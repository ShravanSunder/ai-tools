import { createHash } from "node:crypto";

import type { DiscoveryInvalidReceipt } from "../discovery/skill-discovery.js";
import type { ScenarioOutcome } from "../reduction/outcome-reducer.js";

export interface ScenarioExecutionSummary {
  readonly scenarioId: string;
  readonly executionStatus: "executed" | "infrastructure_error";
  readonly outcome: ScenarioOutcome;
  readonly comparisonIntent: "improvement" | "non_regression";
  readonly reasonCode: string | null;
  readonly receiptPath: string;
}

export interface SkillPressureAggregateReceipt {
  readonly schemaVersion: 1;
  readonly runId: string;
  readonly selectedScenarioIds: readonly string[];
  readonly missingScenarioIds: readonly string[];
  readonly results: readonly ScenarioExecutionSummary[];
  readonly counts: {
    readonly selected: number;
    readonly skipped: number;
    readonly invalid: number;
    readonly executed: number;
    readonly passed: number;
    readonly behaviorFailed: number;
    readonly inconclusive: number;
    readonly infrastructureError: number;
    readonly notEvaluated: number;
  };
  readonly success: boolean;
  readonly receiptDigest: string;
}

export function createAggregateReceipt(props: {
  readonly runId: string;
  readonly discoveredScenarioCount: number;
  readonly selectedScenarioIds: readonly string[];
  readonly invalid: readonly DiscoveryInvalidReceipt[];
  readonly results: readonly ScenarioExecutionSummary[];
}): SkillPressureAggregateReceipt {
  const selectedScenarioIds = [...props.selectedScenarioIds].sort();
  if (new Set(selectedScenarioIds).size !== selectedScenarioIds.length) {
    throw new Error("aggregate selection contains duplicate scenario ids");
  }
  const results = [...props.results].sort((left, right) => left.scenarioId.localeCompare(right.scenarioId));
  if (new Set(results.map((result) => result.scenarioId)).size !== results.length) {
    throw new Error("aggregate results contain duplicate scenario ids");
  }
  const selected = new Set(selectedScenarioIds);
  const unexpectedResult = results.find((result) => !selected.has(result.scenarioId));
  if (unexpectedResult !== undefined) {
    throw new Error(`aggregate result was not selected: ${unexpectedResult.scenarioId}`);
  }
  const completed = new Set(results.map((result) => result.scenarioId));
  const missingScenarioIds = selectedScenarioIds.filter((scenarioId) => !completed.has(scenarioId));
  const counts = {
    selected: selectedScenarioIds.length,
    skipped: props.discoveredScenarioCount - selectedScenarioIds.length,
    invalid: props.invalid.length,
    executed: results.filter((result) => result.executionStatus === "executed").length,
    passed: results.filter((result) => result.outcome === "pass").length,
    behaviorFailed: results.filter((result) => result.outcome === "behavior_fail").length,
    inconclusive: results.filter((result) => result.outcome === "inconclusive").length,
    infrastructureError: results.filter((result) => result.outcome === "infrastructure_error").length,
    notEvaluated: results.filter((result) => result.outcome === "not_evaluated").length,
  };
  const base = {
    schemaVersion: 1 as const,
    runId: props.runId,
    selectedScenarioIds,
    missingScenarioIds,
    results,
    counts,
    success: props.invalid.length === 0 &&
      missingScenarioIds.length === 0 &&
      counts.executed === selectedScenarioIds.length &&
      counts.passed === selectedScenarioIds.length,
  };
  return {
    ...base,
    receiptDigest: `sha256:${createHash("sha256").update(JSON.stringify(base)).digest("hex")}`,
  };
}
