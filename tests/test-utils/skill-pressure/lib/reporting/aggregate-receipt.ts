import { createHash } from "node:crypto";

import type { DiscoveryInvalidReceipt } from "../discovery/skill-discovery.js";
import type { ScenarioOutcome } from "../reduction/outcome-reducer.js";

export type AggregateSuiteKind = "gate" | "diagnostic";
export type CalibrationStatus = "calibrated" | "stale" | "uncalibrated";

export interface V3ScenarioExecutionSummary {
  readonly scenarioId: string;
  readonly executionStatus: "executed" | "infrastructure_error";
  readonly outcome: ScenarioOutcome;
  readonly comparisonIntent: "improvement" | "non_regression";
  readonly reasonCode: string | null;
  readonly receiptPath: string;
  readonly evaluationRole: "gate" | "diagnostic";
  readonly calibrationStatus: CalibrationStatus;
  readonly demotedThisRun: boolean;
  readonly timedOut: boolean;
  readonly accountingComplete: boolean;
  readonly behaviorRequirementIds: readonly string[];
  readonly releaseAuthority: boolean;
}

interface AggregateCounts {
  readonly discovered: number;
  readonly selected: number;
  readonly skipped: number;
  readonly invalid: number;
  readonly executed: number;
  readonly passed: number;
  readonly behaviorFailed: number;
  readonly inconclusive: number;
  readonly infrastructureError: number;
  readonly notEvaluated: number;
  readonly timedOut: number;
  readonly gate: number;
  readonly diagnostic: number;
  readonly calibrated: number;
  readonly staleCalibration: number;
  readonly demotedThisRun: number;
  readonly untracedBehaviorRequirement: number;
  readonly missing: number;
  readonly accountingIncomplete: number;
  readonly releaseAuthorityGranted: number;
  readonly releaseAuthorityWithheld: number;
}

export interface V3SkillPressureAggregateReceipt {
  readonly schemaVersion: 3;
  readonly runId: string;
  readonly suite: {
    readonly kind: AggregateSuiteKind;
    readonly terminalState: "passed" | "completed_with_findings" | "failed";
    readonly success: boolean;
  };
  readonly claimedRequirementIds: readonly string[];
  readonly claimedRequirementInputDigest: string;
  readonly selectedScenarioIds: readonly string[];
  readonly missingScenarioIds: readonly string[];
  readonly untracedBehaviorRequirementIds: readonly string[];
  readonly results: readonly V3ScenarioExecutionSummary[];
  readonly counts: AggregateCounts;
  readonly receiptDigest: string;
}

export function createV3AggregateReceipt(props: {
  readonly runId: string;
  readonly suiteKind: AggregateSuiteKind;
  readonly discoveredScenarioCount: number;
  readonly selectedScenarioIds: readonly string[];
  readonly claimedRequirementIds: readonly string[];
  readonly claimedRequirementInputDigest: string;
  readonly invalid: readonly DiscoveryInvalidReceipt[];
  readonly results: readonly V3ScenarioExecutionSummary[];
}): V3SkillPressureAggregateReceipt {
  if (!Number.isSafeInteger(props.discoveredScenarioCount) || props.discoveredScenarioCount < 0) {
    throw new Error("aggregate discovered scenario count must be a non-negative safe integer");
  }
  assertDigest(props.claimedRequirementInputDigest, "claimed requirement input");

  const selectedScenarioIds = normalizeUniqueValues(props.selectedScenarioIds, "aggregate selection scenario ids");
  if (props.discoveredScenarioCount < selectedScenarioIds.length) {
    throw new Error("aggregate discovered scenario count cannot be smaller than selected scenario count");
  }
  const claimedRequirementIds = normalizeUniqueValues(props.claimedRequirementIds, "claimed behavior requirement ids");
  const results = props.results
    .map(normalizeScenarioExecutionSummary)
    .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId));
  if (new Set(results.map((result) => result.scenarioId)).size !== results.length) {
    throw new Error("aggregate results contain duplicate scenario ids");
  }
  const selected = new Set(selectedScenarioIds);
  const unexpectedResult = results.find((result) => !selected.has(result.scenarioId));
  if (unexpectedResult !== undefined) {
    throw new Error(`aggregate result was not selected: ${unexpectedResult.scenarioId}`);
  }
  if (props.suiteKind === "diagnostic" && results.some((result) => result.releaseAuthority)) {
    throw new Error("diagnostic aggregate cannot contain release authority");
  }

  const completed = new Set(results.map((result) => result.scenarioId));
  const missingScenarioIds = selectedScenarioIds.filter((scenarioId) => !completed.has(scenarioId));
  const authoritativeRequirementIds = new Set(
    results
      .filter((result) => result.releaseAuthority && result.outcome === "pass")
      .flatMap((result) => result.behaviorRequirementIds),
  );
  const untracedBehaviorRequirementIds = claimedRequirementIds.filter(
    (requirementId) => !authoritativeRequirementIds.has(requirementId),
  );
  const counts = createAggregateCounts({
    discoveredScenarioCount: props.discoveredScenarioCount,
    selectedScenarioIds,
    missingScenarioIds,
    untracedBehaviorRequirementIds,
    invalid: props.invalid,
    results,
  });
  const suite = createSuiteResult({ kind: props.suiteKind, counts, results });
  const base = {
    schemaVersion: 3 as const,
    runId: props.runId,
    suite,
    claimedRequirementIds,
    claimedRequirementInputDigest: props.claimedRequirementInputDigest,
    selectedScenarioIds,
    missingScenarioIds,
    untracedBehaviorRequirementIds,
    results,
    counts,
  };
  return {
    ...base,
    receiptDigest: `sha256:${createHash("sha256").update(JSON.stringify(base)).digest("hex")}`,
  };
}

function normalizeScenarioExecutionSummary(summary: V3ScenarioExecutionSummary): V3ScenarioExecutionSummary {
  const behaviorRequirementIds = normalizeUniqueValues(
    summary.behaviorRequirementIds,
    `scenario ${summary.scenarioId} behavior requirement ids`,
  );
  if (
    summary.releaseAuthority &&
    (summary.evaluationRole !== "gate" || summary.calibrationStatus !== "calibrated" || summary.outcome !== "pass")
  ) {
    throw new Error(`scenario ${summary.scenarioId} release authority requires a calibrated gate pass`);
  }
  return { ...summary, behaviorRequirementIds };
}

function createAggregateCounts(props: {
  readonly discoveredScenarioCount: number;
  readonly selectedScenarioIds: readonly string[];
  readonly missingScenarioIds: readonly string[];
  readonly untracedBehaviorRequirementIds: readonly string[];
  readonly invalid: readonly DiscoveryInvalidReceipt[];
  readonly results: readonly V3ScenarioExecutionSummary[];
}): AggregateCounts {
  const releaseAuthorityGranted = props.results.filter((result) => result.releaseAuthority).length;
  return {
    discovered: props.discoveredScenarioCount,
    selected: props.selectedScenarioIds.length,
    skipped: props.discoveredScenarioCount - props.selectedScenarioIds.length,
    invalid: props.invalid.length,
    executed: props.results.filter((result) => result.executionStatus === "executed").length,
    passed: props.results.filter((result) => result.outcome === "pass").length,
    behaviorFailed: props.results.filter((result) => result.outcome === "behavior_fail").length,
    inconclusive: props.results.filter((result) => result.outcome === "inconclusive").length,
    infrastructureError: props.results.filter((result) => result.outcome === "infrastructure_error").length,
    notEvaluated: props.results.filter((result) => result.outcome === "not_evaluated").length,
    timedOut: props.results.filter((result) => result.timedOut).length,
    gate: props.results.filter((result) => result.evaluationRole === "gate").length,
    diagnostic: props.results.filter((result) => result.evaluationRole === "diagnostic").length,
    calibrated: props.results.filter((result) => result.calibrationStatus === "calibrated").length,
    staleCalibration: props.results.filter((result) => result.calibrationStatus === "stale").length,
    demotedThisRun: props.results.filter((result) => result.demotedThisRun).length,
    untracedBehaviorRequirement: props.untracedBehaviorRequirementIds.length,
    missing: props.missingScenarioIds.length,
    accountingIncomplete: props.results.filter((result) => !result.accountingComplete).length,
    releaseAuthorityGranted,
    releaseAuthorityWithheld: props.results.length - releaseAuthorityGranted,
  };
}

function createSuiteResult(props: {
  readonly kind: AggregateSuiteKind;
  readonly counts: AggregateCounts;
  readonly results: readonly V3ScenarioExecutionSummary[];
}): V3SkillPressureAggregateReceipt["suite"] {
  const executionIncomplete = props.counts.invalid > 0 ||
    props.counts.executed !== props.counts.selected ||
    props.counts.infrastructureError > 0 ||
    props.counts.timedOut > 0 ||
    props.counts.missing > 0 ||
    props.counts.accountingIncomplete > 0;
  if (props.kind === "diagnostic") {
    return {
      kind: "diagnostic",
      terminalState: executionIncomplete ? "failed" : "completed_with_findings",
      success: !executionIncomplete,
    };
  }

  const gatePassed = !executionIncomplete &&
    props.results.length === props.counts.selected &&
    props.results.every((result) =>
      result.evaluationRole === "gate" &&
      result.calibrationStatus === "calibrated" &&
      result.outcome === "pass" &&
      result.releaseAuthority,
    );
  return {
    kind: "gate",
    terminalState: gatePassed ? "passed" : "failed",
    success: gatePassed,
  };
}

function normalizeUniqueValues(values: readonly string[], label: string): readonly string[] {
  const normalized = [...values].sort((left, right) => left.localeCompare(right));
  if (normalized.some((value) => value.trim() === "")) {
    throw new Error(`${label} cannot contain empty values`);
  }
  if (new Set(normalized).size !== normalized.length) {
    throw new Error(`${label} contains duplicates`);
  }
  return normalized;
}

function assertDigest(value: string, label: string): void {
  if (!/^sha256:[a-f0-9]{64}$/u.test(value)) {
    throw new Error(`${label} digest must be a sha256 digest`);
  }
}

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
  const selectedScenarioIds = normalizeUniqueValues(props.selectedScenarioIds, "aggregate selection scenario ids");
  const results = [...props.results].sort((left, right) => left.scenarioId.localeCompare(right.scenarioId));
  if (new Set(results.map((result) => result.scenarioId)).size !== results.length) {
    throw new Error("aggregate results contain duplicate scenario ids");
  }
  const selected = new Set(selectedScenarioIds);
  const unexpectedResult = results.find((result) => !selected.has(result.scenarioId));
  if (unexpectedResult !== undefined) throw new Error(`aggregate result was not selected: ${unexpectedResult.scenarioId}`);
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
    success: props.invalid.length === 0 && missingScenarioIds.length === 0 &&
      counts.executed === selectedScenarioIds.length && counts.passed === selectedScenarioIds.length,
  };
  return { ...base, receiptDigest: `sha256:${createHash("sha256").update(JSON.stringify(base)).digest("hex")}` };
}
