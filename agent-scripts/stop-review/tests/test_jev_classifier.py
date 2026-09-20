#!/usr/bin/env python3

import typing as t

from typesafe_sdk import Noul

from jev_classifier import (
    DEFAULT_BASE_URL,
    NOUL_NAMES,
    NOUL_QUESTIONS,
    NoulScores,
    StopReviewNouls,
    compose_decision,
    openrouter_base_url,
    parse_window_fields,
)
from run_luna_evals import reason_requirement_failures


def scores(**overrides: float) -> NoulScores:
    values: dict[str, float] = {name: 0.05 for name in NOUL_NAMES}
    values.update(overrides)
    return NoulScores.model_validate(values)


def test_invited_pick_stops() -> None:
    result = compose_decision(scores(invited_pick=0.91, unfinished_job=0.8))
    assert result.decision == "stop_ok"
    assert result.step == 1


def test_permission_wait_beats_keep_going() -> None:
    result = compose_decision(scores(explicit_wait=0.9, keep_going=0.95, unfinished_job=0.84))
    assert result.decision == "stop_ok"
    assert result.step == 2


def test_saved_wake_stops() -> None:
    result = compose_decision(
        scores(
            saved_wake_reported=0.92,
            collaborator_owns_remaining=0.9,
            unfinished_job=0.88,
        )
    )
    assert result.decision == "stop_ok"
    assert result.step == 2


def test_keep_going_continues() -> None:
    result = compose_decision(scores(keep_going=0.98, unfinished_job=0.66))
    assert result.decision == "continue_work"
    assert result.step == 3


def test_collaborator_without_wake_orders_wake() -> None:
    result = compose_decision(
        scores(unfinished_job=0.84, collaborator_owns_remaining=0.9, saved_wake_reported=0.1)
    )
    assert result.decision == "continue_work"
    assert result.step == 5
    assert "wake" in result.reason.lower()
    assert "do not resume" in result.reason.lower()


def test_near_threshold_reported_wake_still_stops() -> None:
    result = compose_decision(
        scores(
            explicit_wait=0.87,
            collaborator_owns_remaining=0.93,
            saved_wake_reported=0.78,
            unfinished_job=0.35,
        )
    )
    assert result.decision == "stop_ok"
    assert result.step == 2


def test_tool_call_wake_does_not_count_as_wait() -> None:
    result = compose_decision(
        scores(
            explicit_wait=0.82,
            collaborator_owns_remaining=0.96,
            saved_wake_reported=0.07,
            unfinished_job=0.84,
            already_ordered=0.84,
        )
    )
    assert result.decision == "continue_work"
    assert result.step == 5
    assert "wake" in result.reason.lower()
    assert "do not resume" in result.reason.lower()


def test_already_ordered_unfinished_continues() -> None:
    result = compose_decision(scores(already_ordered=0.9, unfinished_job=0.85))
    assert result.decision == "continue_work"
    assert result.step == 5


def test_already_ordered_job_done_stops() -> None:
    result = compose_decision(scores(already_ordered=0.85, unfinished_job=0.13))
    assert result.decision == "stop_ok"
    assert result.step == 6


def test_named_choice_stops_without_strong_invited_pick() -> None:
    result = compose_decision(scores(named_choice_presented=0.9, invited_pick=0.37, unfinished_job=0.85))
    assert result.decision == "stop_ok"
    assert result.step == 1


def test_explanation_request_continues() -> None:
    result = compose_decision(scores(user_wants_explanation=0.9, unfinished_job=0.67))
    assert result.decision == "continue_work"


def test_off_rails_wrap_stops() -> None:
    result = compose_decision(scores(off_rails_wrap=0.9, unfinished_job=0.93, keep_going=0.32))
    assert result.decision == "stop_ok"


def test_how_recommendation_continues() -> None:
    result = compose_decision(
        scores(open_how_recommendation=0.91, unfinished_job=0.79, named_choice_presented=0.03)
    )
    assert result.decision == "continue_work"
    assert result.step == 5


def test_how_recommendation_does_not_beat_named_choice() -> None:
    result = compose_decision(
        scores(open_how_recommendation=0.91, named_choice_presented=0.9, invited_pick=0.4)
    )
    assert result.decision == "stop_ok"
    assert result.step == 1


def test_else_stop_ok() -> None:
    result = compose_decision(scores())
    assert result.decision == "stop_ok"
    assert result.step == 6


def test_strips_systemone_path_to_openrouter_base() -> None:
    assert openrouter_base_url("https://openrouter.ai/api/v1/systemone") == DEFAULT_BASE_URL


def test_questions_are_noul_objects() -> None:
    noul_fields: set[str] = set(NoulScores.model_fields)
    response_noul_fields: set[str] = set(StopReviewNouls.model_fields) - {"model", "usage", "answers"}
    expected: set[str] = set(NOUL_NAMES)
    assert set(NOUL_QUESTIONS) == expected
    assert noul_fields == expected
    assert response_noul_fields == expected
    for question in NOUL_QUESTIONS.values():
        assert isinstance(question, Noul)
        assert question.type == "noul"


def test_set_wake_reason_matches() -> None:
    reason = (
        "Set an authorized agent-collaboration wake, report it saved/active, then stop. "
        "Do not resume the collaborator's implement/fix/prove work here."
    )
    missing = reason_requirement_failures(reason, ["wake", "do not resume"])
    assert missing == []


def test_resume_sol_reason_fails() -> None:
    missing = reason_requirement_failures(
        "Resume Sol's remaining prove work.",
        ["wake", "do not resume"],
    )
    assert missing == ["wake", "do not resume"]


def test_extracts_read_first_fields() -> None:
    window = (
        "Read first:\n\n"
        "LATEST USER TURN\n"
        "why did you stop?\n\n"
        "[last] May I inspect that tab?\n\n"
        "Earlier turns follow for context.\n"
    )
    latest_user, last_assistant = parse_window_fields(window)
    assert latest_user == "why did you stop?"
    assert last_assistant == "May I inspect that tab?"
