#!/usr/bin/env python3

"""Replay Stop-review eval cases through review-runner.sh.

Uses the isolated ~/.codex-reviewer home (codex-router on 127.0.0.1:8787).
Never --profile. That flag would load the worker Codex config.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
import typing as t
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TESTS = Path(__file__).resolve().parent
CASES_PATH = TESTS / "eval_cases.jsonl"
FIXTURES = TESTS / "fixtures"
CLASSIFIER_PROMPT = ROOT / "classifier-prompt.md"
REVIEW_RUNNER = ROOT / "review-runner.sh"

SKIP_CLASSIFICATIONS = {"stop_hook_active"}


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


def reconstruct_window_from_session(case: dict[str, object]) -> str | None:
    sys.path.insert(0, str(ROOT))
    from extract_stop_review_window import build_stop_review_window

    session_jsonl = case.get("session_jsonl")
    last_assistant = case.get("last_assistant")
    if not isinstance(session_jsonl, str) or not Path(session_jsonl).is_file():
        return None
    if not isinstance(last_assistant, str) or not last_assistant.strip():
        return None
    return build_stop_review_window(
        transcript_path=session_jsonl,
        last_assistant_message=last_assistant,
    ).strip()


def resolve_window(case: dict[str, object], *, refresh_windows: bool = False) -> tuple[str | None, str]:
    window_file = case.get("window_file")
    if not refresh_windows and isinstance(window_file, str) and window_file.strip():
        path = Path(window_file)
        if not path.is_absolute():
            path = TESTS / path
        if path.is_file():
            return path.read_text(encoding="utf-8").strip(), f"fixture:{path.name}"

    log_path = case.get("log")
    turn_id = case.get("turn_id")
    if isinstance(log_path, str) and isinstance(turn_id, str):
        extracted = extract_window_from_log(log_path, turn_id)
        if extracted:
            return extracted, "log"

    reconstructed = reconstruct_window_from_session(case)
    if reconstructed:
        return reconstructed, "session"
    return None, "missing"


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


def run_luna(window_text: str, *, classifier_prompt: Path | None = None) -> dict[str, object]:
    prompt_path = classifier_prompt or CLASSIFIER_PROMPT
    prompt = (
        prompt_path.read_text(encoding="utf-8").rstrip()
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
            return {
                "ok": False,
                "error": f"review-runner exit {completed.returncode}",
                "stderr": (completed.stderr or "")[-500:],
                "raw": raw,
            }
        decision = extract_decision_json(raw)
        if decision is None:
            return {"ok": False, "error": "unreadable_output", "raw": raw[-500:]}
        return {"ok": True, **decision}


def load_cases() -> list[dict[str, object]]:
    cases: list[dict[str, object]] = []
    for line in CASES_PATH.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        parsed = json.loads(line)
        if isinstance(parsed, dict):
            cases.append(parsed)
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
    parser.add_argument("--dump-windows", action="store_true")
    parser.add_argument(
        "--refresh-windows",
        action="store_true",
        help="Ignore existing fixtures and re-extract windows from logs",
    )
    parser.add_argument(
        "--classifier-prompt",
        default="",
        help="Override classifier-prompt.md (for old-vs-new comparison)",
    )
    args = parser.parse_args(argv)

    wanted = {item.strip() for item in args.ids.split(",") if item.strip()}
    classifier_prompt = Path(args.classifier_prompt) if args.classifier_prompt.strip() else CLASSIFIER_PROMPT
    print_runner_identity()
    print(f"classifier_prompt={classifier_prompt}")
    print("---")

    passed = 0
    failed = 0
    skipped = 0
    rows: list[str] = []

    for case in load_cases():
        case_id = str(case.get("id", ""))
        if wanted and case_id not in wanted:
            continue
        classification = str(case.get("old_classification", ""))
        if classification in SKIP_CLASSIFICATIONS:
            skipped += 1
            rows.append(f"SKIP  {case_id}  ({classification})")
            continue
        expected = str(case.get("expected_decision", ""))
        window, source = resolve_window(case, refresh_windows=args.refresh_windows or args.dump_windows)
        if window is None:
            skipped += 1
            rows.append(f"SKIP  {case_id}  (no window from {source})")
            continue
        if args.dump_windows:
            fixture_path = FIXTURES / f"{case_id}.window.txt"
            FIXTURES.mkdir(parents=True, exist_ok=True)
            fixture_path.write_text(window + "\n", encoding="utf-8")
            rows.append(f"DUMP  {case_id}  {fixture_path}")
            continue
        result = run_luna(window, classifier_prompt=classifier_prompt)
        if not result.get("ok"):
            failed += 1
            rows.append(f"FAIL  {case_id}  runner={result.get('error')} source={source}")
            continue
        got = str(result.get("decision", "")).strip().lower()
        reason = str(result.get("reason", "")).replace("\n", " ")
        if got == expected:
            passed += 1
            rows.append(f"PASS  {case_id}  {got}  source={source}")
        else:
            failed += 1
            rows.append(
                f"FAIL  {case_id}  got={got} expected={expected} source={source} reason={reason}"
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
