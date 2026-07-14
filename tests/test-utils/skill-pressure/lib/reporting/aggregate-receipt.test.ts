import { describe, expect, it } from "vitest";

import {
  createV3AggregateReceipt,
  type V3ScenarioExecutionSummary,
} from "./aggregate-receipt.js";

const claimedRequirementInputDigest = `sha256:${"a".repeat(64)}`;

function summary(props: Partial<V3ScenarioExecutionSummary> & Pick<V3ScenarioExecutionSummary, "scenarioId">): V3ScenarioExecutionSummary {
  return {
    scenarioId: props.scenarioId,
    executionStatus: props.executionStatus ?? "executed",
    outcome: props.outcome ?? "pass",
    comparisonIntent: props.comparisonIntent ?? "improvement",
    reasonCode: props.reasonCode ?? null,
    receiptPath: props.receiptPath ?? `/tmp/${props.scenarioId}.json`,
    evaluationRole: props.evaluationRole ?? "diagnostic",
    calibrationStatus: props.calibrationStatus ?? "uncalibrated",
    demotedThisRun: props.demotedThisRun ?? false,
    timedOut: props.timedOut ?? false,
    accountingComplete: props.accountingComplete ?? true,
    behaviorRequirementIds: props.behaviorRequirementIds ?? [],
    releaseAuthority: props.releaseAuthority ?? false,
  };
}

describe("skill pressure aggregate receipt", () => {
  it("reports exact v3 authority and outcome counts for an incomplete diagnostic run", () => {
    const receipt = createV3AggregateReceipt({
      runId: "run-1",
      suiteKind: "diagnostic",
      discoveredScenarioCount: 8,
      selectedScenarioIds: ["pass", "fail", "inconclusive", "not-evaluated", "stale", "timed-out", "missing"],
      claimedRequirementIds: ["release-authority", "traceability"],
      claimedRequirementInputDigest,
      invalid: [],
      results: [
        summary({ scenarioId: "pass", behaviorRequirementIds: ["release-authority"] }),
        summary({ scenarioId: "fail", outcome: "behavior_fail", reasonCode: "treatment_behavior_failed" }),
        summary({ scenarioId: "inconclusive", outcome: "inconclusive", reasonCode: "mixed_treatment" }),
        summary({ scenarioId: "not-evaluated", outcome: "not_evaluated", reasonCode: "missing_evidence" }),
        summary({ scenarioId: "stale", calibrationStatus: "stale", demotedThisRun: true }),
        summary({
          scenarioId: "timed-out",
          executionStatus: "infrastructure_error",
          outcome: "infrastructure_error",
          reasonCode: "scenario_deadline",
          timedOut: true,
        }),
      ],
    });

    expect(receipt.counts).toEqual({
      discovered: 8,
      selected: 7,
      skipped: 1,
      invalid: 0,
      executed: 5,
      passed: 2,
      behaviorFailed: 1,
      inconclusive: 1,
      infrastructureError: 1,
      notEvaluated: 1,
      timedOut: 1,
      gate: 0,
      diagnostic: 6,
      calibrated: 0,
      staleCalibration: 1,
      demotedThisRun: 1,
      untracedBehaviorRequirement: 2,
      missing: 1,
      accountingIncomplete: 0,
      releaseAuthorityGranted: 0,
      releaseAuthorityWithheld: 6,
    });
    expect(receipt.missingScenarioIds).toEqual(["missing"]);
    expect(receipt.untracedBehaviorRequirementIds).toEqual(["release-authority", "traceability"]);
    expect(receipt.claimedRequirementInputDigest).toBe(claimedRequirementInputDigest);
    expect(receipt.suite).toEqual({ kind: "diagnostic", terminalState: "failed", success: false });
    expect(receipt.receiptDigest).toMatch(/^sha256:/u);
  });

  it("completes a diagnostic run with behavioral findings without granting release authority", () => {
    const receipt = createV3AggregateReceipt({
      runId: "run-2",
      suiteKind: "diagnostic",
      discoveredScenarioCount: 3,
      selectedScenarioIds: ["pass", "fail", "not-evaluated"],
      claimedRequirementIds: ["release-authority"],
      claimedRequirementInputDigest,
      invalid: [],
      results: [
        summary({ scenarioId: "pass", behaviorRequirementIds: ["release-authority"] }),
        summary({ scenarioId: "fail", outcome: "behavior_fail", reasonCode: "treatment_behavior_failed" }),
        summary({ scenarioId: "not-evaluated", outcome: "not_evaluated", reasonCode: "missing_evidence" }),
      ],
    });

    expect(receipt.suite).toEqual({
      kind: "diagnostic",
      terminalState: "completed_with_findings",
      success: true,
    });
    expect(receipt.counts.releaseAuthorityGranted).toBe(0);
    expect(receipt.counts.untracedBehaviorRequirement).toBe(1);
    expect(receipt.results.every((result) => !result.releaseAuthority)).toBe(true);
  });

  it("succeeds as a gate suite only for fresh calibrated release-authoritative passes", () => {
    const receipt = createV3AggregateReceipt({
      runId: "run-3",
      suiteKind: "gate",
      discoveredScenarioCount: 2,
      selectedScenarioIds: ["alpha", "beta"],
      claimedRequirementIds: ["authority", "traceability"],
      claimedRequirementInputDigest,
      invalid: [],
      results: [
        summary({
          scenarioId: "alpha",
          evaluationRole: "gate",
          calibrationStatus: "calibrated",
          behaviorRequirementIds: ["authority"],
          releaseAuthority: true,
        }),
        summary({
          scenarioId: "beta",
          comparisonIntent: "non_regression",
          evaluationRole: "gate",
          calibrationStatus: "calibrated",
          behaviorRequirementIds: ["traceability"],
          releaseAuthority: true,
        }),
      ],
    });

    expect(receipt.suite).toEqual({ kind: "gate", terminalState: "passed", success: true });
    expect(receipt.counts.releaseAuthorityGranted).toBe(2);
    expect(receipt.untracedBehaviorRequirementIds).toEqual([]);
  });

  it("fails diagnostics for invalid, infrastructure, missing, or incomplete accounting", () => {
    const scenarios = [
      {
        name: "invalid discovery",
        invalid: [{ path: "invalid.md", reason: "scenario_contract" as const, detail: "invalid contract" }],
        results: [summary({ scenarioId: "scenario" })],
      },
      {
        name: "infrastructure failure",
        invalid: [],
        results: [summary({
          scenarioId: "scenario",
          executionStatus: "infrastructure_error",
          outcome: "not_evaluated",
          reasonCode: "missing_evidence",
        })],
      },
      {
        name: "missing execution",
        invalid: [],
        results: [],
      },
      {
        name: "incomplete accounting",
        invalid: [],
        results: [summary({ scenarioId: "scenario", accountingComplete: false })],
      },
    ];

    for (const scenario of scenarios) {
      const receipt = createV3AggregateReceipt({
        runId: scenario.name,
        suiteKind: "diagnostic",
        discoveredScenarioCount: 1,
        selectedScenarioIds: ["scenario"],
        claimedRequirementIds: [],
        claimedRequirementInputDigest,
        invalid: scenario.invalid,
        results: scenario.results,
      });
      expect(receipt.suite, scenario.name).toEqual({ kind: "diagnostic", terminalState: "failed", success: false });
    }
  });

  it("rejects diagnostic release authority and release authority without a calibrated gate pass", () => {
    expect(() => createV3AggregateReceipt({
      runId: "invalid-authority",
      suiteKind: "diagnostic",
      discoveredScenarioCount: 1,
      selectedScenarioIds: ["scenario"],
      claimedRequirementIds: [],
      claimedRequirementInputDigest,
      invalid: [],
      results: [summary({ scenarioId: "scenario", releaseAuthority: true })],
    })).toThrow(/release authority/u);

    expect(() => createV3AggregateReceipt({
      runId: "uncalibrated-authority",
      suiteKind: "gate",
      discoveredScenarioCount: 1,
      selectedScenarioIds: ["scenario"],
      claimedRequirementIds: [],
      claimedRequirementInputDigest,
      invalid: [],
      results: [summary({ scenarioId: "scenario", evaluationRole: "gate", releaseAuthority: true })],
    })).toThrow(/calibrated gate pass/u);
  });
});
