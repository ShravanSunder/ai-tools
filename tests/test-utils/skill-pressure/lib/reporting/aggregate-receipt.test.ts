import { describe, expect, it } from "vitest";

import { createAggregateReceipt } from "./aggregate-receipt.js";

describe("skill pressure aggregate receipt", () => {
  it("reports exact outcome counts for every selected execution", () => {
    const receipt = createAggregateReceipt({
      runId: "run-1",
      discoveredScenarioCount: 5,
      selectedScenarioIds: ["pass", "fail", "infra", "missing"],
      invalid: [],
      results: [
        { scenarioId: "pass", executionStatus: "executed", outcome: "pass", comparisonIntent: "improvement", reasonCode: null, receiptPath: "/tmp/pass.json" },
        { scenarioId: "fail", executionStatus: "executed", outcome: "behavior_fail", comparisonIntent: "improvement", reasonCode: "treatment_behavior_failed", receiptPath: "/tmp/fail.json" },
        { scenarioId: "infra", executionStatus: "infrastructure_error", outcome: "infrastructure_error", comparisonIntent: "non_regression", reasonCode: "runtime_profile_unverified", receiptPath: "/tmp/infra.json" },
      ],
    });

    expect(receipt.counts).toEqual({
      selected: 4,
      skipped: 1,
      invalid: 0,
      executed: 2,
      passed: 1,
      behaviorFailed: 1,
      inconclusive: 0,
      infrastructureError: 1,
      notEvaluated: 0,
    });
    expect(receipt.missingScenarioIds).toEqual(["missing"]);
    expect(receipt.success).toBe(false);
    expect(receipt.receiptDigest).toMatch(/^sha256:/u);
  });

  it("succeeds only when every selected scenario executed and passed", () => {
    expect(createAggregateReceipt({
      runId: "run-2",
      discoveredScenarioCount: 2,
      selectedScenarioIds: ["alpha", "beta"],
      invalid: [],
      results: [
        { scenarioId: "alpha", executionStatus: "executed", outcome: "pass", comparisonIntent: "improvement", reasonCode: null, receiptPath: "/tmp/alpha.json" },
        { scenarioId: "beta", executionStatus: "executed", outcome: "pass", comparisonIntent: "non_regression", reasonCode: null, receiptPath: "/tmp/beta.json" },
      ],
    }).success).toBe(true);
  });
});
