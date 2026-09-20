#!/usr/bin/env python3

"""Replay Stop-review eval cases through review-runner.sh.

Uses the isolated ~/.codex-reviewer home (codex-router on 127.0.0.1:8787).
Never --profile. That flag would load the worker Codex config.

Scoring reads only in-repo fixtures. ~/.codex sessions and /tmp logs are
not durable sources. --dump-windows may still extract from a live log to
create a fixture; it does not score that extract.
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
import typing as t
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field

ROOT = Path(__file__).resolve().parents[1]
TESTS = Path(__file__).resolve().parent
CASES_PATH = TESTS / "eval_cases.jsonl"
FIXTURES = TESTS / "fixtures"
CLASSIFIER_PROMPT = ROOT / "classifier-prompt.md"
REVIEW_RUNNER = ROOT / "review-runner.sh"

sys.path.insert(0, str(ROOT))
from extract_stop_review_window import build_stop_review_window
from jev_classifier import (
    ClassifyResult,
    ClassifyWindowProps,
    JevError,
    classify_window,
    load_tool_calls as load_tool_calls_file,
)
from typesafe_sdk import JSONContent


class EvalCase(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    window_file: str | None = None
    tool_calls_file: str | None = None
    log: str | None = None
    turn_id: str | None = None
    session_jsonl: str | None = None
    last_assistant: str | None = None
    nested: bool = False
    previous_continues: int = 0
    max_continues: int = 6
    expected_decision: str = ""
    expected_reason_contains: list[str] = Field(default_factory=list)


class JevFailure(BaseModel):
    model_config = ConfigDict(frozen=True)

    ok: t.Literal[False] = False
    error: str


class LunaResult(BaseModel):
    ok: bool
    decision: str = ""
    reason: str = ""
    error: str = ""

def extract_window_from_log(log_path: str, turn_id: str) -> str | None:
    path = Path(log_path)
    if not path.is_file():
        return None
    text = path.read_text(encoding="utf-8")
    marker = f"turn_id={turn_id} "
    chosen: int | None = None
    search_from = 0
    while True:
        hit = text.find(marker, search_from)
        if hit < 0:
            break
        line_end = text.find("\n", hit)
        line = text[hit : line_end if line_end >= 0 else hit + 400]
        chosen = hit
        if "classification=luna_continue_work" in line or "classification=luna_stop_ok" in line:
            break
        search_from = hit + 1
    if chosen is None:
        return None
    chunk = text[:chosen]
    start = chunk.rfind("Conversation window:\n")
    if start < 0:
        return None
    window_and_rest = chunk[start + len("Conversation window:\n") :]
    end = window_and_rest.rfind("\ncodex\n")
    if end < 0:
        end = window_and_rest.rfind('\n{"cot":')
    if end < 0:
        return None
    return window_and_rest[:end].strip()


def reconstruct_window_from_session(case: EvalCase) -> str | None:
    session_jsonl = case.session_jsonl
    last_assistant = case.last_assistant
    if session_jsonl is None or not Path(session_jsonl).is_file():
        return None
    if last_assistant is None or not last_assistant.strip():
        return None
    return build_stop_review_window(
        transcript_path=session_jsonl,
        last_assistant_message=last_assistant,
    ).strip()


def resolve_window(case: EvalCase, *, dump_from_live: bool = False) -> tuple[str | None, str]:
    if dump_from_live:
        if case.log is not None and case.turn_id is not None:
            extracted = extract_window_from_log(case.log, case.turn_id)
            if extracted:
                return extracted, "log"
        reconstructed = reconstruct_window_from_session(case)
        if reconstructed:
            return reconstructed, "session"
        return None, "missing"

    if case.window_file is None or not case.window_file.strip():
        return None, "missing_fixture"
    path = Path(case.window_file)
    if not path.is_absolute():
        path = TESTS / path
    if path.is_file():
        return path.read_text(encoding="utf-8").strip(), f"fixture:{path.name}"
    return None, "missing_fixture"


def extract_decision_json(raw_text: str) -> dict[str, object] | None:
    stripped = raw_text.strip()
    if not stripped:
        return None
    try:
        parsed = json.loads(stripped)
    except json.JSONDecodeError:
        parsed = None
    if isinstance(parsed, dict) and isinstance(parsed.get("decision"), str):
        return parsed
    if "```" in stripped:
        fenced = stripped.split("```", 2)
        if len(fenced) >= 3:
            body = fenced[1]
            if body.startswith("json"):
                body = body[4:]
            try:
                parsed = json.loads(body.strip())
            except json.JSONDecodeError:
                parsed = None
            if isinstance(parsed, dict) and isinstance(parsed.get("decision"), str):
                return parsed
    return None


def nested_sidecar(case: EvalCase) -> str:
    if not case.nested:
        return ""
    return (
        "\n\nNested stop: true\n"
        f"Previous continues this turn: {case.previous_continues}\n"
        f"Max continues this turn: {case.max_continues}\n"
    )


def load_tool_calls(case: EvalCase) -> list[JSONContent]:
    if case.tool_calls_file is None or not case.tool_calls_file.strip():
        return []
    path = Path(case.tool_calls_file)
    if not path.is_absolute():
        path = TESTS / path
    if not path.is_file():
        return []
    return load_tool_calls_file(path)


def reason_requirement_failures(reason: str, required: list[str]) -> list[str]:
    text = reason.lower()
    missing: list[str] = []
    for item in required:
        if item.lower() not in text:
            missing.append(item)
    return missing


def run_jev(
    window_text: str,
    *,
    case: EvalCase | None = None,
) -> ClassifyResult | JevFailure:
    nested = case.nested if case else False
    previous = case.previous_continues if case else 0
    maximum = case.max_continues if case else 6
    try:
        return classify_window(
            ClassifyWindowProps(
                window_text=window_text,
                last_turn_tool_calls=load_tool_calls(case) if case else [],
                nested=nested,
                previous_continues=previous,
                max_continues=maximum,
            )
        )
    except JevError as error:
        return JevFailure(error=str(error))


def run_luna(
    window_text: str,
    *,
    classifier_prompt: Path | None = None,
    case: EvalCase | None = None,
) -> LunaResult:
    prompt_path = classifier_prompt or CLASSIFIER_PROMPT
    prompt = (
        prompt_path.read_text(encoding="utf-8").rstrip()
        + nested_sidecar(case or EvalCase(id="anon"))
        + "\n\nConversation window:\n\n"
        + window_text.strip()
        + "\n"
    )
    with tempfile.TemporaryDirectory(prefix="stop-review-eval.") as work_dir:
        prompt_file = Path(work_dir) / "prompt.txt"
        out_file = Path(work_dir) / "luna-last.txt"
        prompt_file.write_text(prompt, encoding="utf-8")
        completed = subprocess.run(
            [
                "bash",
                str(REVIEW_RUNNER),
                "--prompt-file",
                str(prompt_file),
                "--output",
                str(out_file),
                "--cd",
                str(ROOT),
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        raw = out_file.read_text(encoding="utf-8") if out_file.is_file() else ""
        if completed.returncode != 0:
            return LunaResult(ok=False, error=f"review-runner exit {completed.returncode}")
        decision = extract_decision_json(raw)
        if decision is None:
            return LunaResult(ok=False, error="unreadable_output")
        return LunaResult(
            ok=True,
            decision=str(decision.get("decision", "")),
            reason=str(decision.get("reason", "")),
        )


def load_cases() -> list[EvalCase]:
    cases: list[EvalCase] = []
    for line in CASES_PATH.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        parsed = json.loads(line)
        if isinstance(parsed, dict):
            cases.append(EvalCase.model_validate(parsed))
    return cases


def print_runner_identity() -> None:
    with tempfile.TemporaryDirectory(prefix="stop-review-eval-id.") as work_dir:
        prompt_file = Path(work_dir) / "prompt.txt"
        out_file = Path(work_dir) / "out.txt"
        prompt_file.write_text("identity\n", encoding="utf-8")
        completed = subprocess.run(
            [
                "bash",
                str(REVIEW_RUNNER),
                "--prompt-file",
                str(prompt_file),
                "--output",
                str(out_file),
                "--cd",
                str(ROOT),
                "--print-argv",
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        print(completed.stdout.rstrip())
        print(f"uses_profile_flag={'--profile' in completed.stdout}")
        print(f"reviewer_home_default={os.environ.get('CODEX_STOP_REVIEW_HOME', str(Path.home() / '.codex-reviewer'))}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run Stop-review Luna eval cases")
    parser.add_argument("--ids", default="", help="Comma-separated case ids")
    parser.add_argument(
        "--backend",
        default="luna",
        choices=("luna", "jev"),
        help="luna uses review-runner.sh; jev uses TypeSafe Nouls over OpenRouter",
    )
    parser.add_argument("--dump-windows", action="store_true")
    parser.add_argument(
        "--refresh-windows",
        action="store_true",
        help="Extract a live log/session window only to write a fixture. Scoring still requires that fixture.",
    )
    parser.add_argument(
        "--classifier-prompt",
        default="",
        help="Override classifier-prompt.md (for old-vs-new comparison)",
    )
    args = parser.parse_args(argv)

    wanted: set[str] = {item.strip() for item in args.ids.split(",") if item.strip()}
    classifier_prompt = Path(args.classifier_prompt) if args.classifier_prompt.strip() else CLASSIFIER_PROMPT
    if args.backend == "luna":
        print_runner_identity()
        print(f"classifier_prompt={classifier_prompt}")
    else:
        print("backend=jev questions=noul")
    print("---")

    passed = 0
    failed = 0
    skipped = 0
    rows: list[str] = []

    for case in load_cases():
        case_id = case.id
        if wanted and case_id not in wanted:
            continue
        expected = case.expected_decision
        window, source = resolve_window(
            case,
            dump_from_live=args.refresh_windows or args.dump_windows,
        )
        if window is None:
            failed += 1
            rows.append(f"FAIL  {case_id}  missing in-repo fixture ({source})")
            continue
        if args.dump_windows:
            fixture_path = FIXTURES / f"{case_id}.window.txt"
            FIXTURES.mkdir(parents=True, exist_ok=True)
            fixture_path.write_text(window + "\n", encoding="utf-8")
            rows.append(f"DUMP  {case_id}  {fixture_path}")
            continue
        if args.backend == "jev":
            result = run_jev(window, case=case)
            if not isinstance(result, ClassifyResult):
                failed += 1
                rows.append(f"FAIL  {case_id}  runner={result.error} source={source}")
                continue
            got = result.decision
            reason = result.reason.replace("\n", " ")
            scores = result.scores
            extras = (
                f"  step={result.step} "
                f"pick={scores.invited_pick} wait={scores.explicit_wait} "
                f"keep={scores.keep_going} ordered={scores.already_ordered} "
                f"unfin={scores.unfinished_job} collab={scores.collaborator_owns_remaining} "
                f"wake={scores.saved_wake_reported} named={scores.named_choice_presented} "
                f"explain={scores.user_wants_explanation} howrec={scores.open_how_recommendation} "
                f"rails={scores.off_rails_wrap}"
            )
        else:
            result = run_luna(window, classifier_prompt=classifier_prompt, case=case)
            if not result.ok:
                failed += 1
                rows.append(f"FAIL  {case_id}  runner={result.error} source={source}")
                continue
            got = result.decision.strip().lower()
            reason = result.reason.replace("\n", " ")
            extras = ""
        reason_missing = reason_requirement_failures(reason, case.expected_reason_contains)
        if got == expected and not reason_missing:
            passed += 1
            rows.append(f"PASS  {case_id}  {got}  source={source}{extras}")
        else:
            failed += 1
            reason_note = f" missing_reason={reason_missing}" if reason_missing else ""
            rows.append(
                f"FAIL  {case_id}  got={got} expected={expected} source={source} "
                f"reason={reason}{reason_note}{extras}"
            )

    for row in rows:
        print(row)
    total = passed + failed
    rate = f"{(passed / total * 100):.0f}%" if total else "n/a"
    print("---")
    print(f"pass={passed} fail={failed} skip={skipped} rate={rate}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
