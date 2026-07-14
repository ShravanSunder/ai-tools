import { describe, expect, it } from "vitest";

import type { EvaluationRegistry } from "../authority/evaluation-registry.js";
import {
  createClaimedRequirementValidationFixture,
  fixtureAuthorityDigest,
} from "../test-fixtures.js";
import { selectV3SuiteScenarios } from "./v3-suite-selection.js";

const claimedRequirements = createClaimedRequirementValidationFixture({ claimedRequirementIds: ["behavior-one"] });

const registry: EvaluationRegistry = {
  schemaVersion: 1,
  scenarios: [
    row("standard-fresh", "gate", "fresh"),
    row("high-fresh", "gate", "fresh"),
    row("standard-stale", "gate", "stale"),
    row("diagnostic", "diagnostic", "uncalibrated"),
    row("retired", "retired", "retired"),
  ],
};

const candidates = [
  { scenarioId: "standard-fresh", risk: "standard" as const, repetitions: 5 },
  { scenarioId: "high-fresh", risk: "high" as const, repetitions: 5 },
  { scenarioId: "standard-stale", risk: "standard" as const, repetitions: 5 },
  { scenarioId: "diagnostic", risk: "standard" as const, repetitions: 5 },
  { scenarioId: "retired", risk: "standard" as const, repetitions: 5 },
];

function row(
  scenarioId: string,
  evaluationRole: "gate" | "diagnostic" | "retired",
  freshness: "fresh" | "stale" | "uncalibrated" | "retired",
): EvaluationRegistry["scenarios"][number] {
  return {
    scenarioId,
    behaviorContractDigest: fixtureAuthorityDigest(scenarioId === "retired" ? "e" : "d"),
    evaluationRole,
    freshness,
    validityReview: { receiptPath: `${scenarioId}-validity.json`, receiptDigest: fixtureAuthorityDigest("b") },
    calibrationReceipt: evaluationRole === "gate"
      ? { receiptPath: `${scenarioId}-calibration.json`, receiptDigest: fixtureAuthorityDigest("c") }
      : null,
    authorityHistory: [],
  };
}

describe("v3 suite selection", () => {
  it("selects only fresh gates by default and applies risk after authority filtering", () => {
    const standard = selectV3SuiteScenarios({
      mode: "gate",
      risk: "standard",
      candidates,
      registry,
      claimedRequirements,
    });
    const high = selectV3SuiteScenarios({
      mode: "gate",
      risk: "high",
      candidates,
      registry,
      claimedRequirements,
    });

    expect(standard.selectedScenarioIds).toEqual(["standard-fresh"]);
    expect(high.selectedScenarioIds).toEqual(["high-fresh"]);
    expect(standard.excludedStaleGateScenarioIds).toEqual(["standard-stale"]);
    expect(standard.aggregateSuiteKind).toBe("gate");
  });

  it("selects diagnostics separately without turning behavioral findings into gate authority", () => {
    const selection = selectV3SuiteScenarios({
      mode: "diagnostic",
      candidates,
      registry,
      claimedRequirements,
    });

    expect(selection.selectedScenarioIds).toEqual(["diagnostic"]);
    expect(selection.aggregateSuiteKind).toBe("diagnostic");
    expect(selection.claimedRequirements.manifestDigest).toBe(claimedRequirements.manifestDigest);
  });

  it("allows focused execution of either active role while refusing retired scenarios", () => {
    expect(selectV3SuiteScenarios({
      mode: "focused",
      scenarioId: "standard-stale",
      candidates,
      registry,
      claimedRequirements,
    })).toMatchObject({
      selectedScenarioIds: ["standard-stale"],
      aggregateSuiteKind: "gate",
      excludedStaleGateScenarioIds: [],
    });
    expect(selectV3SuiteScenarios({
      mode: "focused",
      scenarioId: "diagnostic",
      candidates,
      registry,
      claimedRequirements,
    })).toMatchObject({ selectedScenarioIds: ["diagnostic"], aggregateSuiteKind: "diagnostic" });
    expect(() => selectV3SuiteScenarios({
      mode: "focused",
      scenarioId: "retired",
      candidates,
      registry,
      claimedRequirements,
    })).toThrow(/retired/u);
  });

  it("fails closed when a candidate and registry snapshot do not have one-to-one identities", () => {
    expect(() => selectV3SuiteScenarios({
      mode: "gate",
      candidates: candidates.slice(0, -1),
      registry,
      claimedRequirements,
    })).toThrow(/one-to-one/u);
  });
});
