import { describe, expect, it } from "vitest";

import { reduceScenarioOutcome } from "./outcome-reducer.js";

function repetitions(outcome: "pass" | "behavior_fail" | "not_evaluated", count = 5) {
  return Array.from({ length: count }, (_, index) => ({ repetitionId: `run-${index + 1}`, outcome }));
}

describe("scenario outcome reduction", () => {
  it("reduces consistent improvement to pass", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "improvement",
      expectedRepetitions: 5,
      baseline: repetitions("behavior_fail"),
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "pass", reasonCode: null });
  });

  it("records an already-passing improvement baseline as a proof gap", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "improvement",
      expectedRepetitions: 5,
      baseline: repetitions("pass"),
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "not_evaluated", reasonCode: "improvement_baseline_already_passed" });
  });

  it("rejects mixed treatment repetitions before applying either comparison intent", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "non_regression",
      expectedRepetitions: 5,
      baseline: repetitions("pass"),
      treatment: [...repetitions("behavior_fail", 4), ...repetitions("pass", 1)],
    })).toMatchObject({ outcome: "inconclusive", reasonCode: "mixed_treatment" });
  });

  it("rejects mixed baseline repetitions before applying either comparison intent", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "improvement",
      expectedRepetitions: 5,
      baseline: [...repetitions("behavior_fail", 4), ...repetitions("pass", 1)],
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "inconclusive", reasonCode: "mixed_baseline" });
  });

  it("reduces a passing previous control and passing treatment to non-regression pass", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "non_regression",
      expectedRepetitions: 5,
      baseline: repetitions("pass"),
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "pass", reasonCode: null });
  });

  it("rejects a consistently failing non-regression baseline as an invalid control", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "non_regression",
      expectedRepetitions: 5,
      baseline: repetitions("behavior_fail"),
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "not_evaluated", reasonCode: "invalid_non_regression_control" });
  });

  it("reports consistent treatment failure as behavior failure", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "improvement",
      expectedRepetitions: 5,
      baseline: repetitions("behavior_fail"),
      treatment: repetitions("behavior_fail"),
    })).toMatchObject({ outcome: "behavior_fail", reasonCode: "treatment_behavior_failed" });
  });

  it("gives runtime-profile infrastructure failures precedence over missing evidence", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "non_regression",
      expectedRepetitions: 5,
      baseline: repetitions("not_evaluated"),
      treatment: [
        ...repetitions("pass", 4),
        {
          repetitionId: "run-5",
          outcome: "pass",
          infrastructureError: "runtime profile was not verified",
          infrastructureReasonCode: "runtime_profile_unverified",
        },
      ],
    })).toMatchObject({ outcome: "infrastructure_error", reasonCode: "runtime_profile_unverified" });
  });

  it("keeps missing evidence distinct from an improvement proof gap", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "improvement",
      expectedRepetitions: 5,
      baseline: repetitions("not_evaluated"),
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "not_evaluated", reasonCode: "missing_evidence" });
  });

  it("marks an invalid repetition count before comparison semantics", () => {
    expect(reduceScenarioOutcome({
      comparisonIntent: "improvement",
      expectedRepetitions: 5,
      baseline: repetitions("behavior_fail", 4),
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "not_evaluated", reasonCode: "repetition_count_mismatch" });
  });
});
