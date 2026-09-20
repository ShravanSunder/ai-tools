#!/usr/bin/env python3

"""Stop-review classifier via TypeSafe JEV Nouls over OpenRouter System One.

TypeSafeClient posts to OpenRouter's System One base URL. Compose stop/continue
in code from Noul probabilities. Choice is not used.
"""

import argparse
import json
import os
import sys
import typing as t
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field

_HERE = Path(__file__).resolve().parent
for _candidate in (_HERE, _HERE.parent):
    if (_candidate / "keyring_secrets.py").is_file():
        sys.path.insert(0, str(_candidate))
        break

from keyring_secrets import KeyringSecretError, LoadSecretProps, load_secret
from typesafe_sdk import (
    JSONContent,
    Noul,
    NoulAnswer,
    NoulCriteria,
    SystemOneResponse,
    TypeSafeAPIError,
    TypeSafeClient,
    TypeSafeError,
    Usage,
)

DEFAULT_BASE_URL: str = "https://openrouter.ai/api"
DEFAULT_ENDPOINT: str = "https://openrouter.ai/api/v1/systemone"
DEFAULT_MODEL: str = "jev-latest"
DEFAULT_YES: float = 0.8
DEFAULT_TIMEOUT_S: float = 40.0
OPENROUTER_HEADERS: dict[str, str] = {
    "HTTP-Referer": "https://github.com/ShravanSunder/ai-tools",
    "X-Title": "ai-tools stop-review jev",
}

Decision = t.Literal["continue_work", "stop_ok"]
NoulName = t.Literal[
    "invited_pick",
    "explicit_wait",
    "keep_going",
    "already_ordered",
    "unfinished_job",
    "collaborator_owns_remaining",
    "saved_wake_reported",
    "named_choice_presented",
    "user_wants_explanation",
    "open_how_recommendation",
    "off_rails_wrap",
]
NOUL_NAMES: tuple[NoulName, ...] = (
    "invited_pick",
    "explicit_wait",
    "keep_going",
    "already_ordered",
    "unfinished_job",
    "collaborator_owns_remaining",
    "saved_wake_reported",
    "named_choice_presented",
    "user_wants_explanation",
    "open_how_recommendation",
    "off_rails_wrap",
)


class JevError(RuntimeError):
    pass


class NoulQuestionProps(BaseModel):
    model_config = ConfigDict(frozen=True)

    question: str
    true: str
    false: str
    state_fields: tuple[str, ...] = ("latest_user", "last_assistant")

    def to_noul(self) -> Noul:
        instructions: dict[str, str] = {name: f"`{name}`" for name in self.state_fields}
        instructions["question"] = self.question
        return Noul(
            instructions=instructions,
            criteria=NoulCriteria(true=self.true, false=self.false),
        )


NOUL_QUESTIONS: dict[NoulName, Noul] = {
    "invited_pick": NoulQuestionProps(
        question="Did `latest_user` invite a named A-vs-B pick that `last_assistant` is now presenting?",
        true=(
            "User asked to draw it out or pictured the options, or challenged a restriction/surface, "
            "and last_assistant names CHOICE 1 vs CHOICE 2 or A vs B plus which-do-you-want. "
            "A recommendation still waits when the user invited that pick."
        ),
        false=(
            "draw it again of already-agreed UI that is still unbuilt; why-stop; "
            "did you have a question; how do we show X; I understand C, I don't understand A "
            "(explanation, not a pick); leftover quiz after yes; sitrep."
        ),
    ).to_noul(),
    "explicit_wait": NoulQuestionProps(
        question=(
            "Is `last_assistant` waiting on inspect/agree, a computer-control or tool permission "
            "the user has not given, or a saved/verified/active authorized timed wake or listener?"
        ),
        true=(
            "Wait for you to inspect; no further changes until we agree; computer-control/tool "
            "denied; may I inspect to finish proof; last_assistant reports a wake/listener "
            "saved/verified/active. Keep-going and why-stop do not clear a denial. "
            "A tool call in last_turn_tool_calls is not enough unless last_assistant reports it saved."
        ),
        false=(
            "I'll set a wake later; leftover defer question; sitrep / on the rails / may I defer X "
            "while proof or review remains; leftover A vs B after why-stop; confirmation before "
            "already-ordered implement."
        ),
        state_fields=("latest_user", "last_assistant", "last_turn_tool_calls"),
    ).to_noul(),
    "keep_going": NoulQuestionProps(
        question="Did `latest_user` tell the assistant not to stop, or ask why it stopped / whether it had a question?",
        true=(
            "why did you stop; why are you stopping; you should not stop; don't stop until done; "
            "did you have a question."
        ),
        false=(
            "why are you going off the rails / what's the problem / focus on the PR; "
            "a new primary inspect or discuss request; an invited pick; a permission wait."
        ),
        state_fields=("latest_user",),
    ).to_noul(),
    "already_ordered": NoulQuestionProps(
        question=(
            "Did `latest_user` already answer or order the current work (yes; go with C; do it this way; "
            "follow-up; sitrep / on the rails; inventory and fix; implement/fix/prove)?"
        ),
        true=(
            "yes; going with C; do it this way; sitrep / are we on the rails; do inventory and fix; "
            "implement/fix/prove already ordered. yes only answers the previous ask."
        ),
        false=(
            "Invited pick; explicit wait/inspect; keep-going/why-stop; off-rails accusation; "
            "a new primary storyboard or architecture question."
        ),
        state_fields=("latest_user",),
    ).to_noul(),
    "unfinished_job": NoulQuestionProps(
        question=(
            "Does `last_assistant` still show unfinished review, implement, prove, unbuilt UI, "
            "parked lists, or only a recorded decision the user already gave?"
        ),
        true=(
            "Remaining review/docs/proof; unbuilt UI; parked pending-prompt lists; "
            "how-question answered with a recommendation; yes C is recorded while review remains; "
            "inventory done but no production fix yet."
        ),
        false=(
            "Current job is done in last_assistant; last_assistant delivered the invited pick or "
            "explicit wait; a saved/verified wake now gates the next check."
        ),
        state_fields=("latest_user", "last_assistant", "conversation_window"),
    ).to_noul(),
    "collaborator_owns_remaining": NoulQuestionProps(
        question=(
            "Is remaining implement/fix/prove work owned by a named collaborator "
            "(Sol, Fable, another session) rather than this session?"
        ),
        true="Named collaborator still proving or implementing; this session is waiting on them.",
        false="This session still owns the remaining work, or no remaining implement/prove work.",
        state_fields=("last_assistant", "conversation_window"),
    ).to_noul(),
    "saved_wake_reported": NoulQuestionProps(
        question="Does `last_assistant` report that an authorized timed wake or listener is saved, verified, or active?",
        true="last_assistant says the wake/listener is saved/verified/active.",
        false=(
            "Wake exists only in last_turn_tool_calls; I'll set a wake; wake on event later; "
            "deferred follow-up without a saved wake."
        ),
        state_fields=("last_assistant", "last_turn_tool_calls"),
    ).to_noul(),
    "named_choice_presented": NoulQuestionProps(
        question=(
            "Does `last_assistant` present named CHOICE 1 vs CHOICE 2 or A vs B and ask which the user wants, "
            "where the next edit depends on that answer?"
        ),
        true=(
            "Named options plus which-do-you-want; the user invited a pick or challenged a restriction. "
            "A recommendation still waits."
        ),
        false=(
            "Leftover quiz after yes / why-stop; parked pending-prompt lists; explanation of A vs C; "
            "draw it again of already-agreed unbuilt UI."
        ),
    ).to_noul(),
    "user_wants_explanation": NoulQuestionProps(
        question=(
            "Did `latest_user` ask to understand a named option or diagram, and is `last_assistant` explaining "
            "rather than presenting a determining pick?"
        ),
        true="I understand C, I don't understand A; more diagrams; explanation without which-do-you-want.",
        false="Invited pick with named choices; keep-going; job done; leftover quiz after yes.",
    ).to_noul(),
    "open_how_recommendation": NoulQuestionProps(
        question=(
            "Did `latest_user` ask how to show or structure something, and did `last_assistant` answer with a "
            "layout/design recommendation that is not a named CHOICE 1 vs CHOICE 2 pick?"
        ),
        true=(
            "how we gonna show X; how do we show subgroup; I recommend muted labels/layout; "
            "recommendation not accepted; no which-do-you-want."
        ),
        false=(
            "CHOICE 1 vs CHOICE 2 + recommend Choice 1; storyboard then which visual treatment; "
            "I don't understand, draw it out; leftover quiz after yes; explicit wait; job done."
        ),
    ).to_noul(),
    "off_rails_wrap": NoulQuestionProps(
        question=(
            "Did `latest_user` accuse the agent of going off the rails or ask what the problem is, "
            "and tell it to wrap the current PR quietly?"
        ),
        true=(
            "why are you going off the rails; what's the problem; focus on the PR and wrap it up quietly. "
            "last_assistant is narrowing back; do not inject a new work order for the tangent."
        ),
        false="Ordinary why-stop / you should not stop while the original job is still undone.",
    ).to_noul(),
}


class StopReviewNouls(SystemOneResponse):
    invited_pick: NoulAnswer
    explicit_wait: NoulAnswer
    keep_going: NoulAnswer
    already_ordered: NoulAnswer
    unfinished_job: NoulAnswer
    collaborator_owns_remaining: NoulAnswer
    saved_wake_reported: NoulAnswer
    named_choice_presented: NoulAnswer
    user_wants_explanation: NoulAnswer
    open_how_recommendation: NoulAnswer
    off_rails_wrap: NoulAnswer


class NoulScores(BaseModel):
    model_config = ConfigDict(frozen=True)

    invited_pick: float
    explicit_wait: float
    keep_going: float
    already_ordered: float
    unfinished_job: float
    collaborator_owns_remaining: float
    saved_wake_reported: float
    named_choice_presented: float
    user_wants_explanation: float
    open_how_recommendation: float
    off_rails_wrap: float

    def fired(self, *names: NoulName) -> str:
        dumped: dict[str, float] = self.model_dump()
        return ", ".join(f"{name}={dumped[name]:.2f}" for name in names)

    @classmethod
    def from_response(cls, response: StopReviewNouls) -> t.Self:
        return cls(
            invited_pick=response.invited_pick.noul,
            explicit_wait=response.explicit_wait.noul,
            keep_going=response.keep_going.noul,
            already_ordered=response.already_ordered.noul,
            unfinished_job=response.unfinished_job.noul,
            collaborator_owns_remaining=response.collaborator_owns_remaining.noul,
            saved_wake_reported=response.saved_wake_reported.noul,
            named_choice_presented=response.named_choice_presented.noul,
            user_wants_explanation=response.user_wants_explanation.noul,
            open_how_recommendation=response.open_how_recommendation.noul,
            off_rails_wrap=response.off_rails_wrap.noul,
        )


class NestedStop(BaseModel):
    model_config = ConfigDict(frozen=True)

    active: bool
    previous_continues: int
    max_continues: int


class WindowState(BaseModel):
    model_config = ConfigDict(frozen=True)

    latest_user: str
    last_assistant: str
    conversation_window: str
    last_turn_tool_calls: list[JSONContent]
    nested_stop: NestedStop


class WindowStateProps(BaseModel):
    model_config = ConfigDict(frozen=True)

    window_text: str
    last_turn_tool_calls: list[JSONContent] = Field(default_factory=list)
    nested: bool = False
    previous_continues: int = 0
    max_continues: int = 6


class CallJevProps(BaseModel):
    model_config = ConfigDict(frozen=True)

    state: WindowState
    api_key: str
    model: str = DEFAULT_MODEL
    endpoint: str = DEFAULT_ENDPOINT
    timeout_s: float = DEFAULT_TIMEOUT_S


class ClassifyWindowProps(BaseModel):
    model_config = ConfigDict(frozen=True)

    window_text: str
    api_key: str | None = None
    last_turn_tool_calls: list[JSONContent] = Field(default_factory=list)
    nested: bool = False
    previous_continues: int = 0
    max_continues: int = 6
    yes: float = DEFAULT_YES
    model: str = DEFAULT_MODEL
    endpoint: str = DEFAULT_ENDPOINT
    timeout_s: float = DEFAULT_TIMEOUT_S


class ClassifyCliProps(BaseModel):
    model_config = ConfigDict(frozen=True)

    window_file: Path
    output: str = ""
    nested: bool = False
    previous_continues: int = 0
    max_continues: int = 6
    yes: float = DEFAULT_YES
    model: str = DEFAULT_MODEL
    endpoint: str = DEFAULT_ENDPOINT
    timeout_s: float = DEFAULT_TIMEOUT_S
    tool_calls_file: str = ""


class HookPayload(BaseModel):
    model_config = ConfigDict(frozen=True)

    cot: str
    decision: Decision
    reason: str


class ComposedDecision(BaseModel):
    model_config = ConfigDict(frozen=True)

    decision: Decision
    reason: str
    cot: str
    step: int
    scores: NoulScores


class ClassifyResult(BaseModel):
    model_config = ConfigDict(frozen=True)

    ok: t.Literal[True]
    cot: str
    decision: Decision
    reason: str
    step: int
    scores: NoulScores
    model: str
    usage: Usage


def openrouter_base_url(endpoint: str) -> str:
    text = endpoint.strip().rstrip("/")
    if text.endswith("/v1/systemone"):
        root = text[: -len("/v1/systemone")]
        return root or DEFAULT_BASE_URL
    return text or DEFAULT_BASE_URL


def parse_window_fields(window_text: str) -> tuple[str, str]:
    text = window_text.strip()
    latest_user = ""
    last_assistant = ""
    latest_marker = "LATEST USER TURN"
    last_marker = "[last]"
    if latest_marker in text:
        after_latest = text.split(latest_marker, 1)[1]
        if last_marker in after_latest:
            latest_user = after_latest.split(last_marker, 1)[0]
            rest = after_latest.split(last_marker, 1)[1]
            last_assistant = rest.split("Earlier turns follow", 1)[0]
        else:
            latest_user = after_latest
    if not last_assistant and last_marker in text:
        last_assistant = text.rsplit(last_marker, 1)[1]
        last_assistant = last_assistant.split("\nUSER TURN", 1)[0]
    return latest_user.strip(), last_assistant.strip()


def build_state(props: WindowStateProps) -> WindowState:
    latest_user, last_assistant = parse_window_fields(props.window_text)
    return WindowState(
        latest_user=latest_user or props.window_text[:2000],
        last_assistant=last_assistant or props.window_text[-4000:],
        conversation_window=props.window_text,
        last_turn_tool_calls=list(props.last_turn_tool_calls),
        nested_stop=NestedStop(
            active=props.nested,
            previous_continues=props.previous_continues,
            max_continues=props.max_continues,
        ),
    )


def compose_decision(scores: NoulScores, *, yes: float = DEFAULT_YES) -> ComposedDecision:
    named_pick = scores.invited_pick >= yes or (
        scores.named_choice_presented >= yes
        and scores.keep_going < yes
        and scores.already_ordered < yes
    )
    if named_pick:
        return ComposedDecision(
            decision="stop_ok",
            step=1,
            reason="Invited pick: last_assistant presents named options the user asked to choose. Stop and wait for that answer.",
            cot=f"Current job is gated by an invited pick. {scores.fired('invited_pick', 'named_choice_presented')}.",
            scores=scores,
        )
    collaborator_without_wake = (
        scores.collaborator_owns_remaining >= yes and scores.saved_wake_reported < 0.45
    )
    if scores.saved_wake_reported >= yes or (
        scores.explicit_wait >= yes and not collaborator_without_wake
    ):
        return ComposedDecision(
            decision="stop_ok",
            step=2,
            reason="Explicit wait: inspect/agree, a permission the user has not given, or a saved/active wake gates the next check.",
            cot=f"Current job is waiting. {scores.fired('explicit_wait', 'saved_wake_reported')}.",
            scores=scores,
        )
    if scores.off_rails_wrap >= yes:
        return ComposedDecision(
            decision="stop_ok",
            step=2,
            reason="Off-rails wrap: do not inject a tangent work order. Stop so the user can redirect to PR closure.",
            cot=f"User accused off-rails and asked to wrap the PR. {scores.fired('off_rails_wrap')}.",
            scores=scores,
        )
    if scores.keep_going >= yes:
        return ComposedDecision(
            decision="continue_work",
            step=3,
            reason="Keep going: resume the named outstanding job in its current mode. If that job is design/discussion, do not implement.",
            cot=f"User ordered keep-going. {scores.fired('keep_going', 'unfinished_job')}.",
            scores=scores,
        )
    if scores.user_wants_explanation >= yes:
        return ComposedDecision(
            decision="continue_work",
            step=5,
            reason="Resume the named design/discussion explanation. Do not implement, and do not treat the explanation as a pick.",
            cot=f"User asked for explanation, not a pick. {scores.fired('user_wants_explanation', 'unfinished_job')}.",
            scores=scores,
        )
    if scores.open_how_recommendation >= yes and scores.named_choice_presented < yes:
        return ComposedDecision(
            decision="continue_work",
            step=5,
            reason="How-question answered with a recommendation is not the end of an open design job. Resume that design work.",
            cot=f"Open how-recommendation. {scores.fired('open_how_recommendation', 'unfinished_job', 'named_choice_presented')}.",
            scores=scores,
        )
    if scores.collaborator_owns_remaining >= yes and scores.saved_wake_reported < yes:
        return ComposedDecision(
            decision="continue_work",
            step=5,
            reason=(
                "Set an authorized agent-collaboration wake, report it saved/active, then stop. "
                "Do not resume the collaborator's implement/fix/prove work here."
            ),
            cot=f"Remaining prove is on a collaborator without a reported wake. {scores.fired('collaborator_owns_remaining', 'saved_wake_reported')}.",
            scores=scores,
        )
    leftover_after_order = scores.already_ordered >= yes and scores.unfinished_job >= 0.45
    if scores.unfinished_job >= yes or leftover_after_order:
        return ComposedDecision(
            decision="continue_work",
            step=5,
            reason="Unfinished job: resume the named remaining review/implement/prove or design work. Do not stop on a leftover question.",
            cot=f"Outstanding work remains. {scores.fired('already_ordered', 'unfinished_job')}.",
            scores=scores,
        )
    return ComposedDecision(
        decision="stop_ok",
        step=6,
        reason="Current job is done in last_assistant, or no remaining work is clear enough to continue.",
        cot=f"No continue step matched. {scores.fired('invited_pick', 'explicit_wait', 'keep_going', 'unfinished_job')}.",
        scores=scores,
    )


def _redact_error(detail: str) -> str:
    lowered = detail.lower()
    if "sk-or-" in lowered or "bearer " in lowered:
        return "[redacted]"
    return detail[:240]


def call_jev(props: CallJevProps) -> StopReviewNouls:
    try:
        with TypeSafeClient(
            api_key=props.api_key,
            base_url=openrouter_base_url(props.endpoint),
            model=props.model,
            timeout=props.timeout_s,
            headers=OPENROUTER_HEADERS,
        ) as client:
            result = client.system_one(
                props.state.model_dump(),
                NOUL_QUESTIONS,
                response_model=StopReviewNouls,
            )
    except TypeSafeAPIError as error:
        raise JevError(f"jev http {error.status}: {_redact_error(str(error))}") from error
    except TypeSafeError as error:
        raise JevError(f"jev: {type(error).__name__}") from error
    if not isinstance(result, StopReviewNouls):
        raise JevError("jev unexpected payload")
    return result


def classify_window(props: ClassifyWindowProps) -> ClassifyResult:
    try:
        key = props.api_key or load_secret(
            LoadSecretProps(
                service="ai-tools.stop-review",
                username="openrouter",
                env_name="OPENROUTER_API_KEY",
            )
        )
    except KeyringSecretError as error:
        raise JevError(str(error)) from error
    state = build_state(
        WindowStateProps(
            window_text=props.window_text,
            last_turn_tool_calls=props.last_turn_tool_calls,
            nested=props.nested,
            previous_continues=props.previous_continues,
            max_continues=props.max_continues,
        )
    )
    response = call_jev(
        CallJevProps(
            state=state,
            api_key=key,
            model=props.model,
            endpoint=props.endpoint,
            timeout_s=props.timeout_s,
        )
    )
    scores = NoulScores.from_response(response)
    composed = compose_decision(scores, yes=props.yes)
    return ClassifyResult(
        ok=True,
        cot=composed.cot,
        decision=composed.decision,
        reason=composed.reason,
        step=composed.step,
        scores=scores,
        model=response.model,
        usage=response.usage,
    )


def load_tool_calls(path: Path) -> list[JSONContent]:
    loaded = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(loaded, list):
        return []
    calls: list[JSONContent] = []
    for item in loaded:
        if isinstance(item, dict):
            calls.append(item)
    return calls


def parse_args(argv: list[str] | None = None) -> ClassifyCliProps:
    parser = argparse.ArgumentParser(description="Classify a Stop-review window with JEV Nouls")
    parser.add_argument("--window-file", required=True)
    parser.add_argument("--output", default="")
    parser.add_argument("--nested", action="store_true")
    parser.add_argument("--previous-continues", type=int, default=0)
    parser.add_argument("--max-continues", type=int, default=6)
    parser.add_argument("--yes", type=float, default=float(os.environ.get("CODEX_STOP_REVIEW_JEV_YES", DEFAULT_YES)))
    parser.add_argument("--model", default=os.environ.get("CODEX_STOP_REVIEW_JEV_MODEL", DEFAULT_MODEL))
    parser.add_argument("--endpoint", default=os.environ.get("CODEX_STOP_REVIEW_JEV_ENDPOINT", DEFAULT_ENDPOINT))
    parser.add_argument("--timeout", type=float, default=float(os.environ.get("CODEX_STOP_REVIEW_JEV_TIMEOUT", DEFAULT_TIMEOUT_S)))
    parser.add_argument("--tool-calls-file", default="")
    args = parser.parse_args(argv)
    return ClassifyCliProps(
        window_file=Path(args.window_file),
        output=args.output,
        nested=args.nested,
        previous_continues=args.previous_continues,
        max_continues=args.max_continues,
        yes=args.yes,
        model=args.model,
        endpoint=args.endpoint,
        timeout_s=args.timeout,
        tool_calls_file=args.tool_calls_file,
    )


def main(argv: list[str] | None = None) -> int:
    cli = parse_args(argv)
    if not cli.window_file.is_file():
        raise SystemExit(f"window missing: {cli.window_file}")
    tool_calls: list[JSONContent] = []
    if cli.tool_calls_file:
        tool_path = Path(cli.tool_calls_file)
        if tool_path.is_file():
            tool_calls = load_tool_calls(tool_path)
    result = classify_window(
        ClassifyWindowProps(
            window_text=cli.window_file.read_text(encoding="utf-8"),
            last_turn_tool_calls=tool_calls,
            nested=cli.nested,
            previous_continues=cli.previous_continues,
            max_continues=cli.max_continues,
            yes=cli.yes,
            model=cli.model,
            endpoint=cli.endpoint,
            timeout_s=cli.timeout_s,
        )
    )
    rendered = HookPayload(
        cot=result.cot,
        decision=result.decision,
        reason=result.reason,
    ).model_dump_json()
    if cli.output:
        Path(cli.output).write_text(rendered + "\n", encoding="utf-8")
    else:
        print(rendered)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
