import { createHash } from "node:crypto";
import { lstat, readFile, realpath } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  assertClaimedRequirementValidationIntegrity,
  type ClaimedRequirementValidation,
} from "../authority/claimed-requirements.js";
import {
  calculateParentAcceptanceReceiptDigest,
  validateParentAcceptanceReceipt,
  validateCurrentBaselineReceipt,
} from "../authority/authority-receipts.js";
import type { DiscoveryInvalidReceipt } from "../discovery/skill-discovery.js";
import type {
  AuthorityReceiptReference,
  EvaluationRegistryRow,
} from "../authority/evaluation-registry.js";
import type { CalibrationFreshnessInputs } from "../authority/authority-receipts.js";
import { assertEphemeralParentAcceptancePath } from "../authority/ephemeral-parent-acceptance-receipt.js";
import type { ScenarioOutcome } from "../reduction/outcome-reducer.js";
import {
  calculateV3ScenarioEvidenceDigest,
  type ExecutedV3BehavioralScenario,
} from "../evaluation/v3-behavioral-scenario-execution.js";
import { calculateV3ScenarioAuthorityRunDigest } from "../evaluation/v3-scenario-authority.js";
import { readObservedTokenCount } from "../evaluation/scenario-execution-budget.js";
import { readTrackedAuthorityReceiptFile } from "../authority/tracked-authority-receipt-file.js";

export type AggregateSuiteKind = "gate" | "diagnostic";
export type CalibrationStatus = "calibrated" | "stale" | "uncalibrated";

export interface V3ScenarioExecutionSummary {
  readonly scenarioId: string;
  readonly scenarioReceiptDigest: string;
  readonly runDigest: string;
  readonly claimedRequirementManifestDigest: string;
  readonly parentAcceptanceReceiptDigest: string | null;
  readonly parentAcceptanceSourceReceipt: AuthorityReceiptReference | null;
  readonly calibrationSourceReceipt: AuthorityReceiptReference | null;
  readonly calibrationAuthorityReceiptDigest: string | null;
  readonly calibrationFingerprintDigest: string | null;
  readonly calibrationFreshnessInputs: CalibrationFreshnessInputs | null;
  readonly registrySnapshotDigest: string;
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
  readonly authorityReasonCode: string | null;
}

const validatedScenarioSummary = Symbol("validated-v3-scenario-summary");
export type ValidatedV3ScenarioExecutionSummary = V3ScenarioExecutionSummary & {
  readonly [validatedScenarioSummary]: true;
};

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
  readonly unknownBehaviorRequirement: number;
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
  readonly registrySnapshotDigest: string;
  readonly executionGraphPreflightReceipt: AuthorityReceiptReference | null;
  readonly selectionMode: "gate" | "diagnostic" | "focused";
  readonly selectionDigest: string;
  readonly selectedScenarioIds: readonly string[];
  readonly selectedScenarios: readonly {
    readonly scenarioId: string;
    readonly repetitions: number;
  }[];
  readonly excludedStaleGateScenarioIds: readonly string[];
  readonly missingScenarioIds: readonly string[];
  readonly untracedBehaviorRequirementIds: readonly string[];
  readonly unknownBehaviorRequirementIds: readonly string[];
  readonly results: readonly V3ScenarioExecutionSummary[];
  readonly counts: AggregateCounts;
  readonly receiptDigest: string;
}

export function createV3AggregateReceipt(props: {
  readonly runId: string;
  readonly suiteKind: AggregateSuiteKind;
  readonly discoveredScenarioCount: number;
  readonly selectedScenarioIds: readonly string[];
  readonly claimedRequirements: ClaimedRequirementValidation;
  readonly registrySnapshotDigest: string;
  readonly executionGraphPreflightReceipt: AuthorityReceiptReference | null;
  readonly selection: {
    readonly mode: "gate" | "diagnostic" | "focused";
    readonly selectionDigest: string;
    readonly selectedScenarios: readonly {
      readonly scenarioId: string;
      readonly repetitions: number;
    }[];
    readonly excludedStaleGateScenarioIds: readonly string[];
  };
  readonly invalid: readonly DiscoveryInvalidReceipt[];
  readonly results: readonly ValidatedV3ScenarioExecutionSummary[];
}): V3SkillPressureAggregateReceipt {
  assertClaimedRequirementValidationIntegrity(props.claimedRequirements);
  if (!Number.isSafeInteger(props.discoveredScenarioCount) || props.discoveredScenarioCount < 0) {
    throw new Error("aggregate discovered scenario count must be a non-negative safe integer");
  }
  assertDigest(props.claimedRequirements.manifestDigest, "claimed requirement input");
  assertDigest(props.registrySnapshotDigest, "registry snapshot");
  if (props.selectedScenarioIds.length > 0 && props.executionGraphPreflightReceipt === null) {
    throw new Error("selected aggregate requires an execution-graph preflight receipt");
  }
  if (props.executionGraphPreflightReceipt !== null) {
    assertAuthorityReceiptReference(
      props.executionGraphPreflightReceipt,
      "execution-graph preflight",
    );
  }
  assertDigest(props.selection.selectionDigest, "suite selection");

  const selectedScenarioIds = normalizeUniqueValues(
    props.selectedScenarioIds,
    "aggregate selection scenario ids",
  );
  const excludedStaleGateScenarioIds = normalizeUniqueValues(
    props.selection.excludedStaleGateScenarioIds,
    "aggregate excluded stale gate scenario ids",
  );
  const selectedScenarios = props.selection.selectedScenarios.map((scenario) => ({ ...scenario }));
  if (
    selectedScenarios.some(
      (scenario) => scenario.repetitions !== 3,
    ) ||
    JSON.stringify(selectedScenarios.map((scenario) => scenario.scenarioId).sort()) !==
      JSON.stringify([...selectedScenarioIds].sort())
  ) {
    throw new Error(
      "aggregate selected scenario repetition metadata does not match selected scenario ids",
    );
  }
  if (excludedStaleGateScenarioIds.some((scenarioId) => selectedScenarioIds.includes(scenarioId))) {
    throw new Error("aggregate scenario cannot be both selected and excluded as stale");
  }
  if (props.discoveredScenarioCount < selectedScenarioIds.length) {
    throw new Error(
      "aggregate discovered scenario count cannot be smaller than selected scenario count",
    );
  }
  const claimedRequirementIds = normalizeUniqueValues(
    props.claimedRequirements.manifest.claimedRequirementIds,
    "claimed behavior requirement ids",
  );
  const unknownBehaviorRequirementIds = normalizeUniqueValues(
    props.claimedRequirements.unknownRequirementIds,
    "unknown behavior requirement ids",
  );
  const results = props.results
    .map((summary) => {
      if (
        !Object.hasOwn(summary, validatedScenarioSummary) ||
        summary[validatedScenarioSummary] !== true
      ) {
        throw new Error(
          `scenario ${summary.scenarioId} was not validated from persisted authority receipts`,
        );
      }
      return normalizeScenarioExecutionSummary(summary);
    })
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
  const mismatchedClaim = results.find(
    (result) =>
      result.claimedRequirementManifestDigest !== props.claimedRequirements.manifestDigest,
  );
  if (mismatchedClaim !== undefined) {
    throw new Error(
      `scenario ${mismatchedClaim.scenarioId} claimed requirement manifest digest does not match the aggregate`,
    );
  }
  const mismatchedRegistrySnapshot = results.find(
    (result) => result.registrySnapshotDigest !== props.registrySnapshotDigest,
  );
  if (mismatchedRegistrySnapshot !== undefined) {
    throw new Error(
      `scenario ${mismatchedRegistrySnapshot.scenarioId} registry snapshot digest does not match the aggregate`,
    );
  }

  const completed = new Set(results.map((result) => result.scenarioId));
  const missingScenarioIds = selectedScenarioIds.filter((scenarioId) => !completed.has(scenarioId));
  const authoritativeRequirementIds = new Set(
    results
      .filter((result) => result.releaseAuthority && result.outcome === "pass")
      .flatMap((result) => result.behaviorRequirementIds),
  );
  const untracedBehaviorRequirementIds = claimedRequirementIds.filter(
    (requirementId) =>
      props.claimedRequirements.untracedRequirementIds.includes(requirementId) ||
      !authoritativeRequirementIds.has(requirementId),
  );
  const counts = createAggregateCounts({
    discoveredScenarioCount: props.discoveredScenarioCount,
    selectedScenarioIds,
    missingScenarioIds,
    untracedBehaviorRequirementIds,
    unknownBehaviorRequirementIds,
    invalid: props.invalid,
    results,
  });
  const suite = createSuiteResult({ kind: props.suiteKind, counts, results });
  const base = {
    schemaVersion: 3 as const,
    runId: props.runId,
    suite,
    claimedRequirementIds,
    claimedRequirementInputDigest: props.claimedRequirements.manifestDigest,
    registrySnapshotDigest: props.registrySnapshotDigest,
    executionGraphPreflightReceipt: props.executionGraphPreflightReceipt,
    selectionMode: props.selection.mode,
    selectionDigest: props.selection.selectionDigest,
    selectedScenarioIds,
    selectedScenarios,
    excludedStaleGateScenarioIds,
    missingScenarioIds,
    untracedBehaviorRequirementIds,
    unknownBehaviorRequirementIds,
    results,
    counts,
  };
  return deepFreeze({
    ...base,
    receiptDigest: `sha256:${createHash("sha256").update(JSON.stringify(base)).digest("hex")}`,
  });
}

export function createParentAcceptedV3AggregateReceipt(props: {
  readonly sourceAggregate: V3SkillPressureAggregateReceipt;
  readonly claimedRequirements: ClaimedRequirementValidation;
  readonly results: readonly ValidatedV3ScenarioExecutionSummary[];
}): V3SkillPressureAggregateReceipt {
  const { receiptDigest, ...sourceWithoutDigest } = props.sourceAggregate;
  if (digestAggregateReceipt(sourceWithoutDigest) !== receiptDigest) {
    throw new Error("source aggregate receipt digest does not match");
  }
  if (props.sourceAggregate.schemaVersion !== 3 || props.sourceAggregate.suite.kind !== "gate") {
    throw new Error("parent-accepted aggregation requires a v3 gate aggregate");
  }
  if (
    props.claimedRequirements.manifestDigest !==
    props.sourceAggregate.claimedRequirementInputDigest
  ) {
    throw new Error("parent-accepted aggregate claimed requirements do not match the source run");
  }
  if (
    props.results.length !== props.sourceAggregate.selectedScenarioIds.length ||
    props.results.some((result) => !result.releaseAuthority)
  ) {
    throw new Error("parent-accepted aggregate requires authority for every selected scenario");
  }
  return createV3AggregateReceipt({
    runId: props.sourceAggregate.runId,
    suiteKind: "gate",
    discoveredScenarioCount: props.sourceAggregate.counts.discovered,
    selectedScenarioIds: props.sourceAggregate.selectedScenarioIds,
    claimedRequirements: props.claimedRequirements,
    registrySnapshotDigest: props.sourceAggregate.registrySnapshotDigest,
    executionGraphPreflightReceipt: props.sourceAggregate.executionGraphPreflightReceipt,
    selection: {
      mode: props.sourceAggregate.selectionMode,
      selectionDigest: props.sourceAggregate.selectionDigest,
      selectedScenarios: props.sourceAggregate.selectedScenarios,
      excludedStaleGateScenarioIds: props.sourceAggregate.excludedStaleGateScenarioIds,
    },
    invalid: [],
    results: props.results,
  });
}

function digestAggregateReceipt(receipt: unknown): string {
  return `sha256:${createHash("sha256").update(JSON.stringify(receipt)).digest("hex")}`;
}

export async function validateV3ScenarioExecutionForAggregate(props: {
  readonly scenarioId: string;
  readonly repositoryRoot: string;
  readonly registryRow: EvaluationRegistryRow;
  readonly expectedRepetitions: number;
  readonly executed: ExecutedV3BehavioralScenario;
}): Promise<ValidatedV3ScenarioExecutionSummary> {
  await assertCanonicalScenarioReceiptDirectory(props.executed.receiptPath);
  const scenarioReceiptStatus = await lstat(props.executed.receiptPath);
  if (!scenarioReceiptStatus.isFile() || scenarioReceiptStatus.nlink !== 1) {
    throw new Error(`scenario ${props.scenarioId} receipt must be one regular file without links`);
  }
  const source = await readFile(props.executed.receiptPath);
  const actualReceiptDigest = `sha256:${createHash("sha256").update(source).digest("hex")}`;
  if (actualReceiptDigest !== props.executed.receiptDigest) {
    throw new Error(
      `scenario ${props.scenarioId} persisted receipt digest does not match execution`,
    );
  }
  const persistedReceipt: unknown = JSON.parse(source.toString("utf8"));
  if (JSON.stringify(persistedReceipt) !== JSON.stringify(props.executed.receipt)) {
    throw new Error(
      `scenario ${props.scenarioId} in-memory receipt does not match persisted receipt`,
    );
  }
  const receipt = props.executed.receipt;
  if (receipt.scenarioId !== props.scenarioId) {
    throw new Error(`scenario ${props.scenarioId} execution returned a different scenario receipt`);
  }
  if (receipt.behaviorIdentity.expectedRepetitions !== props.expectedRepetitions) {
    throw new Error(
      `scenario ${props.scenarioId} repetition count does not match the selected contract`,
    );
  }
  assertScenarioMatchesRegistryRow({ receipt, registryRow: props.registryRow });
  await validateExecutionAccounting({
    scenarioId: props.scenarioId,
    scenarioReceiptPath: props.executed.receiptPath,
    receipt,
  });
  const reviewerLifecycleComplete = await validateReviewerLifecycleReceipts({
    scenarioId: props.scenarioId,
    scenarioReceiptPath: props.executed.receiptPath,
    receipt,
  });
  const expectedEvidenceDigest = calculateV3ScenarioEvidenceDigest({
    registrySnapshotDigest: receipt.authoritySnapshot.registrySnapshotDigest,
    comparisonValidation: receipt.comparisonValidation,
    objectiveResults: receipt.objectiveResults,
    semanticValidation: receipt.semanticReview.validation,
    semanticCandidate: receipt.semanticReview.candidate,
    subjects: receipt.subjects,
    reviewerRuntimeProfile: receipt.runtimeProfiles.reviewer,
    reviewerLifecycle: receipt.reviewerLifecycle,
    attemptReceipts: receipt.attemptReceipts,
    repetitionReceipts: receipt.repetitionReceipts,
    progressReceipts: receipt.progressReceipts,
    executionBudget: receipt.executionBudget,
    executionAccounting: receipt.executionAccounting,
    reduction: receipt.reduction,
  });
  if (expectedEvidenceDigest !== receipt.authoritySnapshot.evidenceDigest) {
    throw new Error(
      `scenario ${props.scenarioId} evidence digest does not match persisted evidence`,
    );
  }
  const expectedRunDigest = calculateV3ScenarioAuthorityRunDigest(
    {
      scenarioId: receipt.scenarioId,
      behaviorContractDigest: receipt.behaviorIdentity.behaviorContractDigest as `sha256:${string}`,
      behaviorRequirementIds: receipt.behaviorIdentity.behaviorRequirementIds,
      evaluationRole: receipt.authoritySnapshot.evaluationRole,
      outcome: receipt.reduction.outcome,
      comparisonIntent: receipt.behaviorIdentity.comparisonIntent,
      evidenceDigest: expectedEvidenceDigest,
    },
    receipt.claimedRequirements.manifestDigest as `sha256:${string}`,
  );
  if (expectedRunDigest !== receipt.authoritySnapshot.runDigest) {
    throw new Error(
      `scenario ${props.scenarioId} run digest does not match persisted authority inputs`,
    );
  }
  const calibration = await validateScenarioAuthoritySources({
    repositoryRoot: props.repositoryRoot,
    receipt,
  });
  assertCalibrationAndReleaseStatus({ receipt, registryRow: props.registryRow, calibration });
  const expectedReceiptCount = props.expectedRepetitions * 2;
  const durableAccountingComplete = await validateDurableExecutionReceipts({
    scenarioId: props.scenarioId,
    scenarioReceiptPath: props.executed.receiptPath,
    expectedRepetitions: props.expectedRepetitions,
    attemptReceipts: receipt.attemptReceipts,
    repetitionReceipts: receipt.repetitionReceipts,
    progressReceipts: receipt.progressReceipts,
  });
  if (
    (!reviewerLifecycleComplete || !durableAccountingComplete) &&
    receipt.authoritySnapshot.releaseAuthority
  ) {
    throw new Error(
      `scenario ${props.scenarioId} incomplete durable accounting cannot grant release authority`,
    );
  }
  const summary: V3ScenarioExecutionSummary = {
    scenarioId: receipt.scenarioId,
    scenarioReceiptDigest: props.executed.receiptDigest,
    runDigest: receipt.authoritySnapshot.runDigest,
    claimedRequirementManifestDigest: receipt.claimedRequirements.manifestDigest,
    parentAcceptanceReceiptDigest: receipt.authoritySnapshot.parentAcceptanceReceiptDigest,
    parentAcceptanceSourceReceipt: receipt.authoritySnapshot.parentAcceptanceSourceReceipt,
    calibrationSourceReceipt: receipt.authoritySnapshot.calibrationSourceReceipt,
    calibrationAuthorityReceiptDigest: receipt.authoritySnapshot.calibrationAuthorityReceiptDigest,
    calibrationFingerprintDigest: receipt.authoritySnapshot.calibrationFingerprintDigest,
    calibrationFreshnessInputs: receipt.authoritySnapshot.calibrationFreshnessInputs,
    registrySnapshotDigest: receipt.authoritySnapshot.registrySnapshotDigest,
    executionStatus:
      receipt.reduction.outcome === "infrastructure_error" ? "infrastructure_error" : "executed",
    outcome: receipt.reduction.outcome,
    comparisonIntent: receipt.behaviorIdentity.comparisonIntent,
    reasonCode: receipt.reduction.reasonCode ?? null,
    receiptPath: props.executed.receiptPath,
    evaluationRole: receipt.authoritySnapshot.evaluationRole,
    calibrationStatus: receipt.authoritySnapshot.calibrationStatus,
    demotedThisRun: receipt.authoritySnapshot.demotedThisRun,
    timedOut: receipt.reduction.reasonCode === "scenario_deadline",
    accountingComplete:
      receipt.attemptReceipts.length >= expectedReceiptCount &&
      receipt.repetitionReceipts.length === expectedReceiptCount &&
      durableAccountingComplete &&
      reviewerLifecycleComplete &&
      receipt.lastDurableStage === "scenario_receipt_published",
    behaviorRequirementIds: receipt.behaviorIdentity.behaviorRequirementIds,
    releaseAuthority: receipt.authoritySnapshot.releaseAuthority,
    authorityReasonCode: receipt.authoritySnapshot.reasonCode,
  };
  if (summary.demotedThisRun && summary.releaseAuthority) {
    throw new Error(
      `scenario ${summary.scenarioId} demoted this run cannot carry release authority`,
    );
  }
  Object.defineProperty(summary, validatedScenarioSummary, { value: true });
  return deepFreeze(summary) as ValidatedV3ScenarioExecutionSummary;
}

async function validateExecutionAccounting(props: {
  readonly scenarioId: string;
  readonly scenarioReceiptPath: string;
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
}): Promise<void> {
  const preflight = await readDurableExecutionReceipt(
    props.receipt.executionAccounting.preflightReceipt,
    path.dirname(props.scenarioReceiptPath),
  );
  if (
    !isRecord(preflight) ||
    preflight.schemaVersion !== 1 ||
    preflight.scenarioId !== props.scenarioId ||
    preflight.status !== "accepted_before_launch" ||
    JSON.stringify(preflight.executionGraph) !==
      JSON.stringify(props.receipt.executionBudget.executionGraph) ||
    JSON.stringify(preflight.acceptedCaps) !==
      JSON.stringify(props.receipt.executionBudget.acceptedCaps)
  ) {
    throw new Error(
      `scenario ${props.scenarioId} execution preflight does not match its authoritative budget`,
    );
  }
  const observed = props.receipt.executionAccounting.observed;
  const graph = props.receipt.executionBudget.executionGraph;
  const caps = props.receipt.executionBudget.acceptedCaps;
  if (
    observed.modelPrompts > graph.maximumModelPrompts ||
    observed.acpxCommands > graph.maximumAcpxCommands ||
    observed.retries > graph.maximumRetries ||
    observed.observedTokens > graph.maximumObservedTokens ||
    observed.modelPrompts > caps.maxModelPrompts ||
    observed.acpxCommands > caps.maxAcpxCommands ||
    observed.retries > caps.maxRetries ||
    observed.observedTokens > caps.maxObservedTokens
  ) {
    throw new Error(
      `scenario ${props.scenarioId} execution accounting exceeds its graph or accepted caps`,
    );
  }
}

async function assertCanonicalScenarioReceiptDirectory(receiptPath: string): Promise<void> {
  const receiptDirectory = path.dirname(path.resolve(receiptPath));
  const directoryStatus = await lstat(receiptDirectory);
  const temporaryRoot = path.resolve(tmpdir());
  const expectedCanonicalDirectory = path.relative(temporaryRoot, receiptDirectory).startsWith("..")
    ? receiptDirectory
    : path.join(await realpath(temporaryRoot), path.relative(temporaryRoot, receiptDirectory));
  if (
    !directoryStatus.isDirectory() ||
    (await realpath(receiptDirectory)) !== expectedCanonicalDirectory
  ) {
    throw new Error("scenario receipt directory must be a canonical real directory, not a symlink");
  }
}

function assertScenarioMatchesRegistryRow(props: {
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
  readonly registryRow: EvaluationRegistryRow;
}): void {
  const authority = props.receipt.authoritySnapshot;
  if (
    props.registryRow.scenarioId !== props.receipt.scenarioId ||
    props.registryRow.behaviorContractDigest !==
      props.receipt.behaviorIdentity.behaviorContractDigest ||
    props.registryRow.evaluationRole === "retired" ||
    props.registryRow.evaluationRole !== authority.evaluationRole ||
    props.registryRow.freshness !== authority.freshness
  ) {
    throw new Error(
      `scenario ${props.receipt.scenarioId} receipt does not match its selected registry row`,
    );
  }
  if (props.registryRow.evaluationRole === "gate") {
    if (
      props.registryRow.calibrationReceipt === null ||
      authority.calibrationSourceReceipt === null ||
      props.registryRow.calibrationReceipt.receiptPath !==
        authority.calibrationSourceReceipt.receiptPath ||
      props.registryRow.calibrationReceipt.receiptDigest !==
        authority.calibrationSourceReceipt.receiptDigest
    ) {
      throw new Error(
        `scenario ${props.receipt.scenarioId} calibration source does not match its registry row`,
      );
    }
  } else if (authority.calibrationSourceReceipt !== null) {
    throw new Error(
      `diagnostic scenario ${props.receipt.scenarioId} cannot carry gate calibration authority`,
    );
  }
}

function assertCalibrationAndReleaseStatus(props: {
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
  readonly registryRow: EvaluationRegistryRow;
  readonly calibration: Awaited<ReturnType<typeof validateCurrentBaselineReceipt>> | null;
}): void {
  const authority = props.receipt.authoritySnapshot;
  const expectedCalibrationStatus =
    props.registryRow.evaluationRole === "gate" &&
    props.registryRow.freshness === "fresh" &&
    props.calibration?.freshness.status === "fresh"
      ? "calibrated"
      : props.registryRow.evaluationRole === "gate"
        ? "stale"
        : "uncalibrated";
  if (authority.calibrationStatus !== expectedCalibrationStatus) {
    throw new Error(
      `scenario ${props.receipt.scenarioId} calibration status does not match registry authority`,
    );
  }
  if (authority.releaseAuthority && expectedCalibrationStatus !== "calibrated") {
    throw new Error(
      `scenario ${props.receipt.scenarioId} stale or diagnostic authority cannot grant release authority`,
    );
  }
}

async function validateScenarioAuthoritySources(props: {
  readonly repositoryRoot: string;
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
}): Promise<Awaited<ReturnType<typeof validateCurrentBaselineReceipt>> | null> {
  const authority = props.receipt.authoritySnapshot;
  let calibration: Awaited<ReturnType<typeof validateCurrentBaselineReceipt>> | null = null;
  if (authority.calibrationSourceReceipt !== null) {
    if (
      authority.calibrationAuthorityReceiptDigest === null ||
      authority.calibrationFingerprintDigest === null ||
      authority.calibrationFreshnessInputs === null
    ) {
      throw new Error("calibration source receipt is missing semantic authority fields");
    }
    const calibrationReceipt = await readTrackedAuthorityReceipt({
      repositoryRoot: props.repositoryRoot,
      reference: authority.calibrationSourceReceipt,
      label: "calibration",
    });
    const validatedCurrentBaseline = await validateCurrentBaselineReceipt({
      receipt: calibrationReceipt,
      currentFreshnessInputs: authority.calibrationFreshnessInputs,
      repositoryRoot: props.repositoryRoot,
    });
    if (
      validatedCurrentBaseline.authorityReceiptDigest !== authority.calibrationAuthorityReceiptDigest ||
      validatedCurrentBaseline.calibrationFingerprint.digest !== authority.calibrationFingerprintDigest ||
      validatedCurrentBaseline.receipt.scenarioId !== props.receipt.scenarioId ||
      validatedCurrentBaseline.receipt.behaviorContractDigest !==
        props.receipt.behaviorIdentity.behaviorContractDigest
    ) {
      throw new Error("calibration authority receipt does not match the scenario receipt");
    }
    calibration = validatedCurrentBaseline;
  }

  if (authority.parentAcceptanceSourceReceipt !== null) {
    if (
      authority.parentAcceptanceReceiptDigest === null ||
      authority.calibrationAuthorityReceiptDigest === null ||
      authority.calibrationFingerprintDigest === null
    ) {
      throw new Error("parent acceptance source receipt is missing authority bindings");
    }
    const parentAcceptance = await readEphemeralParentAcceptanceReceipt({
      repositoryRoot: props.repositoryRoot,
      reference: authority.parentAcceptanceSourceReceipt,
      label: "parent acceptance",
    });
    if (
      calculateParentAcceptanceReceiptDigest(parentAcceptance) !==
      authority.parentAcceptanceReceiptDigest
    ) {
      throw new Error("parent acceptance semantic digest does not match the scenario receipt");
    }
    validateParentAcceptanceReceipt({
      receipt: parentAcceptance,
      expected: {
        scenarioId: props.receipt.scenarioId,
        behaviorContractDigest: props.receipt.behaviorIdentity
          .behaviorContractDigest as `sha256:${string}`,
        authorityReceiptDigest: authority.calibrationAuthorityReceiptDigest as `sha256:${string}`,
        runDigest: authority.runDigest as `sha256:${string}`,
        calibrationFingerprintDigest: authority.calibrationFingerprintDigest as `sha256:${string}`,
        claimedRequirementManifestDigest: props.receipt.claimedRequirements
          .manifestDigest as `sha256:${string}`,
      },
    });
  }
  return calibration;
}

async function readTrackedAuthorityReceipt(props: {
  readonly repositoryRoot: string;
  readonly reference: AuthorityReceiptReference;
  readonly label: string;
}): Promise<unknown> {
  const source = await readTrackedAuthorityReceiptFile({
    repositoryRoot: props.repositoryRoot,
    receiptPath: props.reference.receiptPath,
    label: `${props.label} receipt`,
  });
  const actualDigest = `sha256:${createHash("sha256").update(source).digest("hex")}`;
  if (actualDigest !== props.reference.receiptDigest) {
    throw new Error(`${props.label} source receipt digest does not match`);
  }
  return JSON.parse(source.toString("utf8"));
}

async function readEphemeralParentAcceptanceReceipt(props: {
  readonly repositoryRoot: string;
  readonly reference: AuthorityReceiptReference;
  readonly label: string;
}): Promise<unknown> {
  const normalizedPath = assertEphemeralParentAcceptancePath(props.reference.receiptPath);
  const repositoryRoot = await realpath(path.resolve(props.repositoryRoot));
  const resolvedPath = path.resolve(repositoryRoot, normalizedPath);
  const canonicalPath = await realpath(resolvedPath);
  if (canonicalPath !== resolvedPath) {
    throw new Error(`${props.label} receipt cannot use symlinked path components`);
  }
  const status = await lstat(canonicalPath);
  if (!status.isFile() || status.nlink !== 1) {
    throw new Error(`${props.label} receipt must be one regular file without links`);
  }
  const source = await readFile(canonicalPath);
  const actualDigest = `sha256:${createHash("sha256").update(source).digest("hex")}`;
  if (actualDigest !== props.reference.receiptDigest) {
    throw new Error(`${props.label} source receipt digest does not match`);
  }
  return JSON.parse(source.toString("utf8"));
}

async function validateDurableExecutionReceipts(props: {
  readonly scenarioId: string;
  readonly scenarioReceiptPath: string;
  readonly expectedRepetitions: number;
  readonly attemptReceipts: readonly AuthorityReceiptReference[];
  readonly repetitionReceipts: readonly AuthorityReceiptReference[];
  readonly progressReceipts: readonly AuthorityReceiptReference[];
}): Promise<boolean> {
  if (
    !hasUniqueReceiptBindings(props.attemptReceipts) ||
    !hasUniqueReceiptBindings(props.repetitionReceipts) ||
    !hasUniqueReceiptBindings(props.progressReceipts) ||
    props.progressReceipts.length === 0
  )
    return false;
  const receiptDirectory = path.dirname(props.scenarioReceiptPath);
  const attemptBindings = new Map<string, string>();
  const attemptIdentities = new Set<string>();
  for (const reference of props.attemptReceipts) {
    const attempt = await readDurableExecutionReceipt(reference, receiptDirectory);
    if (
      !isRecord(attempt) ||
      attempt.schemaVersion !== 1 ||
      attempt.scenarioId !== props.scenarioId ||
      attempt.lastDurableStage !== "attempt_receipt_published"
    )
      return false;
    if (!attemptHasObservedUsage(attempt)) return false;
    const variant = attempt.variant;
    const repetitionNumber = attempt.repetitionNumber;
    const attemptNumber = attempt.attemptNumber;
    if (
      (variant !== "baseline" && variant !== "treatment") ||
      !Number.isSafeInteger(repetitionNumber) ||
      Number(repetitionNumber) < 1 ||
      Number(repetitionNumber) > props.expectedRepetitions ||
      !Number.isSafeInteger(attemptNumber) ||
      Number(attemptNumber) < 1
    )
      return false;
    const identity = `${variant}:${String(repetitionNumber)}:${String(attemptNumber)}`;
    if (attemptIdentities.has(identity)) return false;
    attemptIdentities.add(identity);
    attemptBindings.set(receiptBindingKey(reference), `${variant}:${String(repetitionNumber)}`);
  }

  const acceptedIdentities = new Set<string>();
  for (const reference of props.repetitionReceipts) {
    const repetition = await readDurableExecutionReceipt(reference, receiptDirectory);
    if (
      !isRecord(repetition) ||
      repetition.schemaVersion !== 1 ||
      repetition.scenarioId !== props.scenarioId ||
      repetition.lastDurableStage !== "repetition_receipt_published" ||
      (repetition.variant !== "baseline" && repetition.variant !== "treatment") ||
      !Number.isSafeInteger(repetition.repetitionNumber) ||
      Number(repetition.repetitionNumber) < 1 ||
      Number(repetition.repetitionNumber) > props.expectedRepetitions ||
      typeof repetition.acceptedAttemptReceiptPath !== "string" ||
      typeof repetition.acceptedAttemptReceiptDigest !== "string"
    )
      return false;
    const acceptedBinding = receiptBindingKey({
      receiptPath: repetition.acceptedAttemptReceiptPath,
      receiptDigest: repetition.acceptedAttemptReceiptDigest,
    });
    const identity = `${repetition.variant}:${String(repetition.repetitionNumber)}`;
    if (attemptBindings.get(acceptedBinding) !== identity) return false;
    if (acceptedIdentities.has(identity)) return false;
    acceptedIdentities.add(identity);
  }
  const expectedIdentities = ["baseline", "treatment"].flatMap((variant) =>
    Array.from(
      { length: props.expectedRepetitions },
      (_, index) => `${variant}:${String(index + 1)}`,
    ),
  );
  if (!expectedIdentities.every((identity) => acceptedIdentities.has(identity))) return false;

  let finalProgressStatus: string | null = null;
  let finalProgressStage: string | null = null;
  for (const reference of props.progressReceipts) {
    const progress = await readDurableExecutionReceipt(reference, receiptDirectory);
    if (
      !isRecord(progress) ||
      progress.schemaVersion !== 1 ||
      progress.scenarioId !== props.scenarioId ||
      !["running", "timed_out", "cancelled", "completed", "infrastructure_error"].includes(
        String(progress.status),
      ) ||
      typeof progress.lastDurableStage !== "string" ||
      progress.lastDurableStage.trim() === "" ||
      !Array.isArray(progress.completedAttemptReceiptPaths) ||
      !progress.completedAttemptReceiptPaths.every(
        (receiptPath) =>
          typeof receiptPath === "string" &&
          props.attemptReceipts.some((attempt) => attempt.receiptPath === receiptPath),
      )
    )
      return false;
    finalProgressStatus = String(progress.status);
    finalProgressStage = String(progress.lastDurableStage);
  }
  return (
    finalProgressStatus !== null &&
    finalProgressStatus !== "running" &&
    finalProgressStage === "reduction_completed"
  );
}

async function validateReviewerLifecycleReceipts(props: {
  readonly scenarioId: string;
  readonly scenarioReceiptPath: string;
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
}): Promise<boolean> {
  const lifecycle = props.receipt.reviewerLifecycle;
  if (lifecycle === undefined) {
    throw new Error(`scenario ${props.scenarioId} reviewer lifecycle evidence is missing`);
  }
  if (!isReviewerLifecycleReceipt(lifecycle)) return false;
  const receiptDirectory = path.dirname(props.scenarioReceiptPath);
  const commandTypes = lifecycle.commandReceipts.map((reference) => reference.commandType);
  if (new Set(commandTypes).size !== commandTypes.length) return false;
  if (new Set(lifecycle.commandReceipts.map(receiptBindingKey)).size !== lifecycle.commandReceipts.length)
    return false;

  if (lifecycle.risk === "standard" && lifecycle.namedSessionIdentity !== null) return false;
  if (
    lifecycle.risk === "high" &&
    lifecycle.state !== "not_started" &&
    (lifecycle.namedSessionIdentity === null ||
      !/^pressure-review-[A-Za-z0-9-]+$/u.test(lifecycle.namedSessionIdentity))
  )
    return false;

  const commands = [] as Array<{
    readonly commandType: string;
    readonly successful: boolean;
  }>;
  for (const reference of lifecycle.commandReceipts) {
    const persisted = await readDurableExecutionReceipt(reference, receiptDirectory);
    if (!isReviewerCommandReceiptFile(persisted)) return false;
    if (
      persisted.scenarioId !== props.scenarioId ||
      persisted.risk !== lifecycle.risk ||
      persisted.namedSessionIdentity !== lifecycle.namedSessionIdentity ||
      persisted.providerSessionIdentity !== lifecycle.providerSessionIdentity ||
      persisted.command.commandType !== reference.commandType
    )
      return false;
    commands.push({
      commandType: persisted.command.commandType,
      successful: isSuccessfulReviewerCommand(persisted.command),
    });
  }

  if (lifecycle.state === "not_started") {
    return false;
  }

  if (!matchesReviewerCommandTopology({ risk: lifecycle.risk, state: lifecycle.state, commands }))
    return false;
  if (lifecycle.state === "completed") {
    return (
      lifecycle.lifecycleComplete &&
      lifecycle.usageObserved &&
      lifecycle.failureCommandType === null &&
      commands.every((command) => command.successful)
    );
  }
  return false;
}

function attemptHasObservedUsage(attempt: Record<string, unknown>): boolean {
  if (!isRecord(attempt.repetition) || !isRecord(attempt.repetition.evidence)) return false;
  const observations = attempt.repetition.evidence.usageObservations;
  if (!Array.isArray(observations) || !observations.every((value) => typeof value === "string"))
    return false;
  try {
    readObservedTokenCount(observations);
    return true;
  } catch {
    return false;
  }
}

function isReviewerLifecycleReceipt(
  value: NonNullable<ExecutedV3BehavioralScenario["receipt"]["reviewerLifecycle"]>,
): boolean {
  const lifecycle = value as unknown as Record<string, unknown>;
  if (
    !hasExactKeys(lifecycle, [
      "risk",
      "state",
      "lifecycleComplete",
      "failureCommandType",
      "namedSessionIdentity",
      "providerSessionIdentity",
      "usageObserved",
      "commandReceipts",
    ]) ||
    (lifecycle.risk !== "standard" && lifecycle.risk !== "high") ||
    !["not_started", "completed", "failed"].includes(String(lifecycle.state)) ||
    typeof lifecycle.lifecycleComplete !== "boolean" ||
    !isNullableReviewerCommandType(lifecycle.failureCommandType) ||
    !isNullableNonEmptyString(lifecycle.namedSessionIdentity) ||
    !isNullableNonEmptyString(lifecycle.providerSessionIdentity) ||
    typeof lifecycle.usageObserved !== "boolean" ||
    !Array.isArray(lifecycle.commandReceipts)
  )
    return false;
  return lifecycle.commandReceipts.every(isReviewerCommandReference);
}

function isReviewerCommandReference(value: unknown): value is {
  readonly commandType: string;
  readonly receiptPath: string;
  readonly receiptDigest: string;
} {
  return (
    isRecord(value) &&
    hasExactKeys(value, ["commandType", "receiptPath", "receiptDigest"]) &&
    isReviewerCommandType(value.commandType) &&
    typeof value.receiptPath === "string" &&
    value.receiptPath.trim() !== "" &&
    typeof value.receiptDigest === "string" &&
    /^sha256:[a-f0-9]{64}$/u.test(value.receiptDigest)
  );
}

function isReviewerCommandReceiptFile(value: unknown): value is {
  readonly schemaVersion: 1;
  readonly scenarioId: string;
  readonly risk: "standard" | "high";
  readonly namedSessionIdentity: string | null;
  readonly providerSessionIdentity: string | null;
  readonly command: {
    readonly commandType: string;
    readonly exitCode: number | null;
    readonly timedOut: boolean;
    readonly processClosed: boolean;
    readonly streamsDrained: boolean;
    readonly cleanupComplete: boolean;
    readonly termSent: boolean;
    readonly killSent: boolean;
  };
} {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      "schemaVersion",
      "scenarioId",
      "risk",
      "namedSessionIdentity",
      "providerSessionIdentity",
      "command",
    ]) ||
    value.schemaVersion !== 1 ||
    typeof value.scenarioId !== "string" ||
    (value.risk !== "standard" && value.risk !== "high") ||
    !isNullableNonEmptyString(value.namedSessionIdentity) ||
    !isNullableNonEmptyString(value.providerSessionIdentity) ||
    !isRecord(value.command) ||
    !hasExactKeys(value.command, [
      "commandType",
      "exitCode",
      "timedOut",
      "processClosed",
      "streamsDrained",
      "cleanupComplete",
      "termSent",
      "killSent",
    ]) ||
    !isReviewerCommandType(value.command.commandType) ||
    !isNullableSafeInteger(value.command.exitCode)
  )
    return false;
  return [
    value.command.timedOut,
    value.command.processClosed,
    value.command.streamsDrained,
    value.command.cleanupComplete,
    value.command.termSent,
    value.command.killSent,
  ].every((field) => typeof field === "boolean");
}

function matchesReviewerCommandTopology(props: {
  readonly risk: "standard" | "high";
  readonly state: "completed" | "failed";
  readonly commands: readonly { readonly commandType: string; readonly successful: boolean }[];
}): boolean {
  const commandTypes = props.commands.map((command) => command.commandType);
  if (props.risk === "standard") {
    return commandTypes.length === 1 && commandTypes[0] === "reviewer_prompt";
  }
  const expected = [
    "reviewer_session_create",
    "reviewer_effort_config",
    "reviewer_prompt",
    "reviewer_close",
  ];
  if (props.state === "completed") {
    return JSON.stringify(commandTypes) === JSON.stringify(expected);
  }
  return [
    ["reviewer_session_create", "reviewer_close"],
    ["reviewer_session_create", "reviewer_effort_config", "reviewer_close"],
    expected,
  ].some((topology) => JSON.stringify(commandTypes) === JSON.stringify(topology));
}

function isSuccessfulReviewerCommand(command: {
  readonly exitCode: number | null;
  readonly timedOut: boolean;
  readonly processClosed: boolean;
  readonly streamsDrained: boolean;
  readonly cleanupComplete: boolean;
}): boolean {
  return (
    command.exitCode === 0 &&
    !command.timedOut &&
    command.processClosed &&
    command.streamsDrained &&
    command.cleanupComplete
  );
}

function isReviewerCommandType(value: unknown): value is string {
  return [
    "reviewer_session_create",
    "reviewer_effort_config",
    "reviewer_prompt",
    "reviewer_close",
  ].includes(String(value));
}

function isNullableReviewerCommandType(value: unknown): boolean {
  return value === null || isReviewerCommandType(value);
}

function isNullableNonEmptyString(value: unknown): boolean {
  return value === null || (typeof value === "string" && value.trim() !== "");
}

function isNullableSafeInteger(value: unknown): boolean {
  return value === null || (typeof value === "number" && Number.isSafeInteger(value));
}

function hasExactKeys(value: Record<string, unknown>, expectedKeys: readonly string[]): boolean {
  const actualKeys = Object.keys(value).sort((left, right) => left.localeCompare(right));
  const expected = [...expectedKeys].sort((left, right) => left.localeCompare(right));
  return JSON.stringify(actualKeys) === JSON.stringify(expected);
}

async function readDurableExecutionReceipt(
  reference: AuthorityReceiptReference,
  receiptDirectory: string,
): Promise<unknown> {
  const resolvedPath = path.resolve(reference.receiptPath);
  if (path.dirname(resolvedPath) !== receiptDirectory) {
    throw new Error("durable execution receipt is outside the scenario receipt directory");
  }
  const status = await lstat(resolvedPath);
  if (!status.isFile() || status.nlink !== 1) {
    throw new Error("durable execution receipt must be one regular file without links");
  }
  const source = await readFile(resolvedPath);
  const digest = `sha256:${createHash("sha256").update(source).digest("hex")}`;
  if (digest !== reference.receiptDigest)
    throw new Error("durable execution receipt digest does not match");
  return JSON.parse(source.toString("utf8"));
}

function hasUniqueReceiptBindings(receipts: readonly AuthorityReceiptReference[]): boolean {
  return new Set(receipts.map(receiptBindingKey)).size === receipts.length;
}

function receiptBindingKey(reference: AuthorityReceiptReference): string {
  return `${reference.receiptPath}\0${reference.receiptDigest}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== "object" || value === null || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value)) deepFreeze(nested);
  return Object.freeze(value);
}

function normalizeScenarioExecutionSummary(
  summary: V3ScenarioExecutionSummary,
): V3ScenarioExecutionSummary {
  assertDigest(summary.scenarioReceiptDigest, `scenario ${summary.scenarioId} receipt`);
  assertDigest(summary.runDigest, `scenario ${summary.scenarioId} run`);
  assertDigest(
    summary.claimedRequirementManifestDigest,
    `scenario ${summary.scenarioId} claimed requirement manifest`,
  );
  assertDigest(summary.registrySnapshotDigest, `scenario ${summary.scenarioId} registry snapshot`);
  if (summary.parentAcceptanceReceiptDigest !== null) {
    assertDigest(
      summary.parentAcceptanceReceiptDigest,
      `scenario ${summary.scenarioId} parent acceptance receipt`,
    );
  }
  if (summary.calibrationAuthorityReceiptDigest !== null) {
    assertDigest(
      summary.calibrationAuthorityReceiptDigest,
      `scenario ${summary.scenarioId} calibration authority receipt`,
    );
  }
  if (summary.parentAcceptanceSourceReceipt !== null) {
    assertAuthorityReceiptReference(
      summary.parentAcceptanceSourceReceipt,
      `scenario ${summary.scenarioId} parent acceptance source`,
    );
  }
  if (summary.calibrationSourceReceipt !== null) {
    assertAuthorityReceiptReference(
      summary.calibrationSourceReceipt,
      `scenario ${summary.scenarioId} calibration source`,
    );
  }
  const behaviorRequirementIds = normalizeUniqueValues(
    summary.behaviorRequirementIds,
    `scenario ${summary.scenarioId} behavior requirement ids`,
  );
  if (summary.demotedThisRun && summary.releaseAuthority) {
    throw new Error(
      `scenario ${summary.scenarioId} demoted this run cannot carry release authority`,
    );
  }
  if (!summary.accountingComplete && summary.releaseAuthority) {
    throw new Error(
      `scenario ${summary.scenarioId} incomplete durable accounting cannot carry release authority`,
    );
  }
  if (
    summary.releaseAuthority &&
    (summary.evaluationRole !== "gate" ||
      summary.calibrationStatus !== "calibrated" ||
      summary.outcome !== "pass" ||
      summary.parentAcceptanceReceiptDigest === null ||
      summary.parentAcceptanceSourceReceipt === null ||
      summary.calibrationSourceReceipt === null ||
      summary.calibrationAuthorityReceiptDigest === null ||
      summary.calibrationFingerprintDigest === null ||
      summary.calibrationFreshnessInputs === null ||
      summary.authorityReasonCode !== null)
  ) {
    throw new Error(
      `scenario ${summary.scenarioId} release authority requires a parent-accepted calibrated gate pass`,
    );
  }
  return { ...summary, behaviorRequirementIds };
}

function createAggregateCounts(props: {
  readonly discoveredScenarioCount: number;
  readonly selectedScenarioIds: readonly string[];
  readonly missingScenarioIds: readonly string[];
  readonly untracedBehaviorRequirementIds: readonly string[];
  readonly unknownBehaviorRequirementIds: readonly string[];
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
    infrastructureError: props.results.filter((result) => result.outcome === "infrastructure_error")
      .length,
    notEvaluated: props.results.filter((result) => result.outcome === "not_evaluated").length,
    timedOut: props.results.filter((result) => result.timedOut).length,
    gate: props.results.filter((result) => result.evaluationRole === "gate").length,
    diagnostic: props.results.filter((result) => result.evaluationRole === "diagnostic").length,
    calibrated: props.results.filter((result) => result.calibrationStatus === "calibrated").length,
    staleCalibration: props.results.filter((result) => result.calibrationStatus === "stale").length,
    demotedThisRun: props.results.filter((result) => result.demotedThisRun).length,
    untracedBehaviorRequirement: props.untracedBehaviorRequirementIds.length,
    unknownBehaviorRequirement: props.unknownBehaviorRequirementIds.length,
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
  const executionIncomplete =
    props.counts.selected === 0 ||
    props.counts.invalid > 0 ||
    props.counts.executed !== props.counts.selected ||
    props.counts.infrastructureError > 0 ||
    props.counts.timedOut > 0 ||
    props.counts.missing > 0 ||
    props.counts.accountingIncomplete > 0 ||
    props.results.some((result) =>
      result.outcome === "not_evaluated" &&
      (result.reasonCode === "missing_evidence" || result.reasonCode === "review_parse_failure"));
  if (props.kind === "diagnostic") {
    return {
      kind: "diagnostic",
      terminalState: executionIncomplete ? "failed" : "completed_with_findings",
      success: !executionIncomplete,
    };
  }

  const gatePassed =
    !executionIncomplete &&
    props.counts.untracedBehaviorRequirement === 0 &&
    props.counts.unknownBehaviorRequirement === 0 &&
    props.results.length === props.counts.selected &&
    props.results.every(
      (result) =>
        result.evaluationRole === "gate" &&
        result.calibrationStatus === "calibrated" &&
        result.outcome === "pass" &&
        !result.demotedThisRun &&
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

function assertAuthorityReceiptReference(
  reference: AuthorityReceiptReference,
  label: string,
): void {
  if (reference.receiptPath.trim() === "")
    throw new Error(`${label} receipt path must be non-empty`);
  assertDigest(reference.receiptDigest, `${label} receipt`);
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
  const selectedScenarioIds = normalizeUniqueValues(
    props.selectedScenarioIds,
    "aggregate selection scenario ids",
  );
  const results = [...props.results].sort((left, right) =>
    left.scenarioId.localeCompare(right.scenarioId),
  );
  if (new Set(results.map((result) => result.scenarioId)).size !== results.length) {
    throw new Error("aggregate results contain duplicate scenario ids");
  }
  const selected = new Set(selectedScenarioIds);
  const unexpectedResult = results.find((result) => !selected.has(result.scenarioId));
  if (unexpectedResult !== undefined)
    throw new Error(`aggregate result was not selected: ${unexpectedResult.scenarioId}`);
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
    infrastructureError: results.filter((result) => result.outcome === "infrastructure_error")
      .length,
    notEvaluated: results.filter((result) => result.outcome === "not_evaluated").length,
  };
  const base = {
    schemaVersion: 1 as const,
    runId: props.runId,
    selectedScenarioIds,
    missingScenarioIds,
    results,
    counts,
    success:
      props.invalid.length === 0 &&
      missingScenarioIds.length === 0 &&
      counts.executed === selectedScenarioIds.length &&
      counts.passed === selectedScenarioIds.length,
  };
  return {
    ...base,
    receiptDigest: `sha256:${createHash("sha256").update(JSON.stringify(base)).digest("hex")}`,
  };
}
