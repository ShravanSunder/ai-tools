import { describe, expect, it } from "vitest";

import type { ScenarioOutcome } from "../reduction/outcome-reducer.js";
import { reduceWithBlindReview } from "./behavioral-scenario-runner.js";

function review(outcome: ScenarioOutcome) {
  return {
    outcome,
    infrastructureReasons: outcome === "infrastructure_error" ? ["review transport failed"] : [],
    parseError: outcome === "not_evaluated" ? "review output malformed" : null,
  } as const;
}

describe("behavioral scenario final reduction", () => {
  it("lets objective treatment failure outrank a semantic pass", () => {
    expect(reduceWithBlindReview(
      { outcome: "behavior_fail", reasons: ["treatment failed deterministic checks"] },
      review("pass"),
    ).outcome).toBe("behavior_fail");
  });

  it("keeps deterministic variance inconclusive regardless of reviewer opinion", () => {
    expect(reduceWithBlindReview(
      { outcome: "inconclusive", reasons: ["treatment repetitions are mixed"] },
      review("pass"),
    )).toMatchObject({
      outcome: "inconclusive",
      reasons: expect.arrayContaining(["blind review cannot resolve mixed deterministic repetitions"]),
    });
  });

  it("fails closed when review infrastructure or output is unavailable", () => {
    expect(reduceWithBlindReview(
      { outcome: "pass", reasons: ["RED failed and GREEN passed"] },
      review("infrastructure_error"),
    ).outcome).toBe("infrastructure_error");
    expect(reduceWithBlindReview(
      { outcome: "pass", reasons: ["RED failed and GREEN passed"] },
      review("not_evaluated"),
    ).outcome).toBe("not_evaluated");
  });

  it("accepts or rejects a deterministically eligible run from semantic review", () => {
    const deterministicPass = { outcome: "pass" as const, reasons: ["RED failed and GREEN passed"] };

    expect(reduceWithBlindReview(deterministicPass, review("pass")).outcome).toBe("pass");
    expect(reduceWithBlindReview(deterministicPass, review("behavior_fail")).outcome).toBe("behavior_fail");
  });
});
