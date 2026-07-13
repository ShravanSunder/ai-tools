import { describe, expect, it } from "vitest";

import { reduceScenarioOutcome } from "./outcome-reducer.js";

function repetitions(outcome: "pass" | "behavior_fail" | "not_evaluated", count = 5) {
  return Array.from({ length: count }, (_, index) => ({ repetitionId: `run-${index + 1}`, outcome }));
}

describe("scenario outcome reduction", () => {
  it("reduces consistent RED failure and GREEN success to pass", () => {
    expect(reduceScenarioOutcome({
      expectedRepetitions: 5,
      baseline: repetitions("behavior_fail"),
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "pass" });
  });

  it("rejects a lucky one-off GREEN as inconclusive", () => {
    expect(reduceScenarioOutcome({
      expectedRepetitions: 5,
      baseline: repetitions("behavior_fail"),
      treatment: [...repetitions("behavior_fail", 4), ...repetitions("pass", 1)],
    })).toMatchObject({ outcome: "inconclusive", reasons: ["treatment repetitions are mixed"] });
  });

  it("reduces mixed baseline outcomes to inconclusive", () => {
    expect(reduceScenarioOutcome({
      expectedRepetitions: 5,
      baseline: [...repetitions("behavior_fail", 4), ...repetitions("pass", 1)],
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "inconclusive", reasons: ["baseline repetitions are mixed"] });
  });

  it("gives infrastructure errors deterministic precedence", () => {
    expect(reduceScenarioOutcome({
      expectedRepetitions: 5,
      baseline: repetitions("behavior_fail"),
      treatment: [...repetitions("pass", 4), { repetitionId: "run-5", outcome: "pass", infrastructureError: "ACPX timed out" }],
    })).toMatchObject({ outcome: "infrastructure_error", reasons: ["ACPX timed out"] });
  });

  it("marks absent RED failure as a proof gap instead of passing GREEN", () => {
    expect(reduceScenarioOutcome({
      expectedRepetitions: 5,
      baseline: repetitions("pass"),
      treatment: repetitions("pass"),
    })).toMatchObject({ outcome: "not_evaluated", reasons: ["baseline did not demonstrate a behavior failure"] });
  });
});
