import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type { V3BehaviorContract } from "../contracts/v3-behavior-contract.js";
import { discoverSkillScenarios } from "../discovery/skill-discovery.js";
import { calculateSkillSourceClosureDigest } from "../installation/codex-repo-skill-installer.js";
import type { ExecutedV3BehavioralScenario } from "../evaluation/v3-behavioral-scenario-execution.js";
import { validateV3ScenarioExecutionForAggregate } from "../reporting/aggregate-receipt.js";
import {
  ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
  ACPX_LUNA_HIGH_SUBJECT_PROFILE,
  type RuntimeProfile,
  type RuntimeProfileReceipt,
} from "../runtime/runtime-profile.js";
import {
  calculateCurrentCalibrationFreshnessInputs,
  digestJson,
} from "./calibration-freshness.js";
import { validateCalibrationAggregateReceipt } from "./calibration-aggregate.js";
import {
  calculateAuthorityReceiptDigest,
  calculateCalibrationFreshnessFingerprint,
  validateCurrentBaselineReceipt,
  type AuthorityDigest,
  type CalibrationFreshnessInputs,
  type CurrentBaselineExecutionRepetition,
  type ParentAcceptanceReceipt,
  type CurrentBaselineReceipt,
} from "./authority-receipts.js";
import {
  loadEvaluationRegistry,
  type EvaluationRegistryRow,
} from "./evaluation-registry.js";
import { promoteRegistryRow } from "./promotion-registry.js";

const DEFAULT_REGISTRY_PATH = "tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml";

export interface PromoteScenarioResult {
  readonly scenarioId: string;
  readonly promotionReceiptPath: string;
  readonly promotionReceiptDigest: AuthorityDigest;
  readonly authorityReceiptDigest: AuthorityDigest;
  readonly calibrationFingerprintDigest: AuthorityDigest;
  readonly registryPath: string;
}

export interface PromotionTransactionDependencies {
  readonly validateScenarioExecution?: typeof validateV3ScenarioExecutionForAggregate;
  readonly validateAggregateReceipt?: (props: {
    readonly scenarioReceiptPath: string;
    readonly scenarioReceiptDigest: AuthorityDigest;
    readonly receipt: ExecutedV3BehavioralScenario["receipt"];
  }) => Promise<void>;
  readonly calculateFreshnessInputs?: typeof calculateCurrentCalibrationFreshnessInputs;
  readonly beforeRegistryCommit?: () => Promise<void>;
}

export async function promoteScenarioFromReceipt(props: {
  readonly repositoryRoot: string;
  readonly scenarioReceiptPath: string;
  readonly parentAccepted: boolean;
  readonly registryPath?: string;
  readonly verifyMutationCoverage?: () => Promise<void>;
  readonly dependencies?: PromotionTransactionDependencies;
}): Promise<PromoteScenarioResult> {
  if (!props.parentAccepted) {
    throw new Error("promotion requires explicit parent acceptance");
  }
  const repositoryRoot = path.resolve(props.repositoryRoot);
  const registryPath = path.resolve(
    repositoryRoot,
    props.registryPath ?? DEFAULT_REGISTRY_PATH,
  );
  const discovery = await discoverSkillScenarios({ repositoryRoot });
  if (discovery.invalid.length > 0) {
    throw new Error(`promotion discovery is invalid: ${discovery.invalid[0]?.detail ?? "unknown error"}`);
  }
  const scenarioSource = await readFile(path.resolve(props.scenarioReceiptPath), "utf8");
  const receipt = JSON.parse(scenarioSource) as ExecutedV3BehavioralScenario["receipt"];
  const contract = discovery.discovered.find((candidate) => candidate.scenarioId === receipt.scenarioId);
  if (contract === undefined) throw new Error(`promotion scenario is not discovered: ${receipt.scenarioId}`);
  const registry = await loadEvaluationRegistry({
    repositoryRoot,
    registryPath,
    knownScenarios: discovery.discovered.map((scenario) => ({
      scenarioId: scenario.scenarioId,
      behaviorContractDigest: scenario.behaviorContractDigest,
      plugin: scenario.plugin,
      skill: scenario.skill,
    })),
  });
  const registryRow = registry.scenarios.find((row) => row.scenarioId === receipt.scenarioId);
  if (registryRow === undefined) throw new Error(`promotion registry row is missing: ${receipt.scenarioId}`);
  assertDiagnosticPromotionCandidate(registryRow);
  const scenarioReceiptDigest = digestSource(scenarioSource);
  await (props.dependencies?.validateScenarioExecution ?? validateV3ScenarioExecutionForAggregate)({
    scenarioId: receipt.scenarioId,
    repositoryRoot,
    registryRow,
    expectedRepetitions: contract.repetitions,
    executed: {
      receiptPath: path.resolve(props.scenarioReceiptPath),
      receiptDigest: scenarioReceiptDigest,
      receipt,
    },
  });
  await (props.dependencies?.validateAggregateReceipt ?? validateCalibrationAggregateReceipt)({
    scenarioReceiptPath: path.resolve(props.scenarioReceiptPath),
    scenarioReceiptDigest,
    receipt,
  });
  assertPassingCalibrationReceipt({ receipt, contract });
  await (props.verifyMutationCoverage ?? (() => runMutationCoverage(repositoryRoot)))();

  const evidence = await collectPromotionEvidence({
    repositoryRoot,
    receipt,
  });
  const freshnessInputs = await (
    props.dependencies?.calculateFreshnessInputs ?? calculateCurrentCalibrationFreshnessInputs
  )({
    repositoryRoot,
    contract,
  });
  const calibrationFingerprint = calculateCalibrationFreshnessFingerprint(freshnessInputs);
  assertDiagnosticRunFreshness({ receipt, currentFreshnessInputs: freshnessInputs });
  const behaviorContractDigest = asAuthorityDigest(
    contract.behaviorContractDigest,
    "behavior contract digest",
  );
  const acceptedSkillSourceDigest = treatmentSourceDigest(receipt);
  const currentTreatmentDigest = calculateSkillSourceClosureDigest(
    path.join(repositoryRoot, "plugins", contract.plugin, "skills", contract.skill),
  );
  if (acceptedSkillSourceDigest !== `sha256:${currentTreatmentDigest}`) {
    throw new Error("promotion treatment source no longer matches the current skill source");
  }
  const unsignedBaseline: Omit<CurrentBaselineReceipt, "parentAcceptance"> = {
    schemaVersion: 1 as const,
    receiptKind: "current_baseline" as const,
    scenarioId: receipt.scenarioId,
    behaviorContractDigest,
    calibrationFingerprint: freshnessInputs,
    calibrationRunDigest: asAuthorityDigest(receipt.authoritySnapshot.runDigest, "calibration run digest"),
    acceptedSkillSourceDigest,
    calibration: {
      contractConsistent: true as const,
      contractConsistencyEvidenceDigest: digestJson({
        scenarioReceiptDigest,
        behaviorContractDigest: contract.behaviorContractDigest,
        comparisonValid: receipt.comparisonValidation.valid,
        semanticValid: receipt.semanticReview.validation.valid,
      }),
      baselinePolicyValid: true as const,
      baselinePolicyEvidenceDigest: freshnessInputs.baselinePolicyDigest,
      baselineRepetitionDigests: evidence.baselineRepetitionDigests,
      treatmentRepetitionDigests: evidence.treatmentRepetitionDigests,
      comparisonIntentPassed: true as const,
      objectiveEvidenceDigest: digestJson(receipt.objectiveResults),
      semanticEvidenceDigest: digestJson(receipt.semanticReview),
      deterministicMutationCoverage: true as const,
      subjectProfileVerified: true as const,
      reviewProfileVerified: true as const,
    },
    executionEvidence: {
      calibrationRunDigest: asAuthorityDigest(receipt.authoritySnapshot.runDigest, "calibration run digest"),
      acceptedSkillSourceDigest,
      repetitions: evidence.repetitions,
    },
  };
  const authorityReceiptDigest = calculateAuthorityReceiptDigest(unsignedBaseline);
  const parentAcceptance: ParentAcceptanceReceipt = {
    schemaVersion: 1,
    receiptKind: "parent_acceptance",
    scenarioId: receipt.scenarioId,
    behaviorContractDigest,
    acceptedAuthorityReceiptDigest: authorityReceiptDigest,
    acceptedRunDigest: unsignedBaseline.calibrationRunDigest,
    calibrationFingerprintDigest: calibrationFingerprint.digest,
    claimedRequirementManifestDigest: asAuthorityDigest(
      receipt.claimedRequirements.manifestDigest,
      "claimed requirement manifest digest",
    ),
  };
  const currentBaselineReceipt: CurrentBaselineReceipt = { ...unsignedBaseline, parentAcceptance };
  const promotionReceiptPath = `tests/${contract.plugin}/${contract.skill}/baselines/${receipt.scenarioId}.json`;
  const baselinePath = path.join(repositoryRoot, promotionReceiptPath);
  const promotionSource = `${JSON.stringify(currentBaselineReceipt, null, 2)}\n`;
  const promotionReceiptDigest = digestSource(promotionSource);
  let rollbackBaseline: (() => Promise<void>) | null = null;
  try {
    await validateCurrentBaselineReceipt({
      receipt: currentBaselineReceipt,
      currentFreshnessInputs: freshnessInputs,
      repositoryRoot,
    });
    rollbackBaseline = await replaceCurrentBaselineAtomically({ baselinePath, source: promotionSource });
    await validateCurrentBaselineReceipt({
      receipt: JSON.parse(await readFile(baselinePath, "utf8")) as unknown,
      currentFreshnessInputs: freshnessInputs,
      repositoryRoot,
    });
    await promoteRegistryRow({
      repositoryRoot,
      registryPath,
      discovery,
      scenarioId: receipt.scenarioId,
      promotionReceiptPath,
      promotionReceiptDigest,
      ...(props.dependencies?.beforeRegistryCommit === undefined
        ? {}
        : { beforeRegistryCommit: props.dependencies.beforeRegistryCommit }),
    });
    return {
      scenarioId: receipt.scenarioId,
      promotionReceiptPath,
      promotionReceiptDigest,
      authorityReceiptDigest,
      calibrationFingerprintDigest: calibrationFingerprint.digest,
      registryPath,
    };
  } catch (error) {
    await rollbackBaseline?.();
    throw error;
  }
}

function assertDiagnosticRunFreshness(props: {
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
  readonly currentFreshnessInputs: CalibrationFreshnessInputs;
}): void {
  const recordedInputs = props.receipt.authoritySnapshot.calibrationFreshnessInputs;
  if (recordedInputs === null) {
    throw new Error("diagnostic run is missing its calibration freshness inputs");
  }
  const recorded = calculateCalibrationFreshnessFingerprint(recordedInputs);
  const current = calculateCalibrationFreshnessFingerprint(props.currentFreshnessInputs);
  if (recorded.digest !== current.digest) {
    throw new Error("diagnostic run used stale calibration inputs and must be rerun before promotion");
  }
}

interface CollectedPromotionEvidence {
  readonly repetitions: readonly CurrentBaselineExecutionRepetition[];
  readonly baselineRepetitionDigests: readonly AuthorityDigest[];
  readonly treatmentRepetitionDigests: readonly AuthorityDigest[];
}

async function collectPromotionEvidence(props: {
  readonly repositoryRoot: string;
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
}): Promise<CollectedPromotionEvidence> {
  const repetitionReceipts = new Map<string, {
    readonly receiptDigest: AuthorityDigest;
    readonly acceptedAttemptReceiptDigest: AuthorityDigest;
  }>();
  for (const reference of props.receipt.repetitionReceipts) {
    const source = await readDigestBoundSource(reference);
    const repetition = assertRecord(JSON.parse(source), "repetition receipt");
    const variant = assertVariant(repetition.variant, "repetition receipt variant");
    const repetitionNumber = assertPositiveInteger(repetition.repetitionNumber, "repetition receipt number");
    if (repetition.scenarioId !== props.receipt.scenarioId) throw new Error("repetition receipt scenario does not match");
    const identity = `${variant}:${String(repetitionNumber)}`;
    if (repetitionReceipts.has(identity)) throw new Error("promotion contains duplicate repetition receipts");
    repetitionReceipts.set(identity, {
      receiptDigest: asAuthorityDigest(reference.receiptDigest, "repetition receipt digest"),
      acceptedAttemptReceiptDigest: asAuthorityDigest(
        assertString(repetition.acceptedAttemptReceiptDigest, "accepted attempt receipt digest"),
        "accepted attempt receipt digest",
      ),
    });
  }

  const acceptedAttempts = new Map<string, CurrentBaselineExecutionRepetition>();
  for (const reference of props.receipt.attemptReceipts) {
    const source = await readDigestBoundSource(reference);
    const attempt = assertRecord(JSON.parse(source), "attempt receipt");
    const scenarioId = assertString(attempt.scenarioId, "attempt receipt scenario id");
    if (scenarioId !== props.receipt.scenarioId) throw new Error("attempt receipt scenario does not match");
    const variant = assertVariant(attempt.variant, "attempt receipt variant");
    const repetitionNumber = assertPositiveInteger(attempt.repetitionNumber, "attempt repetition number");
    const attemptNumber = assertPositiveInteger(attempt.attemptNumber, "attempt number");
    const durableFacts = assertRecord(attempt.durableFacts, "attempt durable facts");
    for (const fact of ["processClosed", "streamsDrained", "outputRedacted", "snapshotsCollected", "cleanupFactsCollected"] as const) {
      if (durableFacts[fact] !== true) throw new Error(`promotion requires completed ${fact}`);
    }
    if (repetitionNumber > 3) continue;
    const identity = `${variant}:${String(repetitionNumber)}`;
    const acceptedRepetition = repetitionReceipts.get(identity);
    if (acceptedRepetition === undefined) {
      throw new Error("promotion attempt is missing its accepted repetition receipt");
    }
    const sourceAttemptReceiptDigest = asAuthorityDigest(reference.receiptDigest, "source attempt receipt digest");
    if (sourceAttemptReceiptDigest !== acceptedRepetition.acceptedAttemptReceiptDigest) continue;
    if (acceptedAttempts.has(identity)) throw new Error("promotion has duplicate accepted attempts for a repetition");
    acceptedAttempts.set(identity, {
      variant,
      repetitionNumber,
      attemptNumber,
      sourceAttemptReceiptDigest,
      acceptedAttemptReceiptDigest: acceptedRepetition.acceptedAttemptReceiptDigest,
      acceptedRepetitionReceiptDigest: acceptedRepetition.receiptDigest,
      processClosed: true,
      streamsDrained: true,
      outputRedacted: true,
      snapshotsCollected: true,
      cleanupFactsCollected: true,
    });
  }
  const repetitions = ["baseline", "treatment"].flatMap((variant) =>
    Array.from({ length: 3 }, (_, index) => {
      const repetition = acceptedAttempts.get(`${variant}:${String(index + 1)}`);
      if (repetition === undefined) throw new Error(`promotion is missing accepted ${variant} repetition ${String(index + 1)}`);
      return repetition;
    }));
  return {
    repetitions,
    baselineRepetitionDigests: repetitionDigestLane(repetitionReceipts, "baseline"),
    treatmentRepetitionDigests: repetitionDigestLane(repetitionReceipts, "treatment"),
  };
}

function assertDiagnosticPromotionCandidate(row: EvaluationRegistryRow): void {
  if (row.evaluationRole !== "diagnostic" || !["uncalibrated", "stale"].includes(row.freshness)) {
    throw new Error("promotion requires a diagnostic registry row eligible for calibration");
  }
}

function assertPassingCalibrationReceipt(props: {
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
  readonly contract: V3BehaviorContract;
}): void {
  if (props.receipt.reduction.outcome !== "pass") throw new Error("only a passing calibration can be promoted");
  if (!props.receipt.comparisonValidation.valid) throw new Error("promotion comparison is invalid");
  if (!props.receipt.semanticReview.validation.valid) throw new Error("promotion semantic review is invalid");
  if (props.receipt.subjects.length !== 6 || props.contract.repetitions !== 3) {
    throw new Error("promotion requires three baseline and three treatment repetitions");
  }
  const expectedReviewProfile = props.contract.risk === "high"
    ? ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE
    : ACPX_LUNA_HIGH_SUBJECT_PROFILE;
  for (const runtimeProfile of props.receipt.runtimeProfiles.subjects) {
    assertRuntimeProfile(runtimeProfile, ACPX_LUNA_HIGH_SUBJECT_PROFILE, "subject");
  }
  assertRuntimeProfile(props.receipt.runtimeProfiles.reviewer, expectedReviewProfile, "reviewer");
}

function assertRuntimeProfile(
  receipt: RuntimeProfileReceipt,
  expected: RuntimeProfile,
  label: string,
): void {
  if (
    receipt.verification.status !== "verified" ||
    receipt.requested.provider !== expected.provider ||
    receipt.requested.model !== expected.requestedModel ||
    receipt.requested.reasoningEffort !== expected.requestedReasoningEffort ||
    receipt.providerReported.model !== expected.acceptedProviderReportedModel ||
    receipt.providerReported.reasoningEffort !== expected.acceptedProviderReportedReasoningEffort
  ) throw new Error(`promotion ${label} runtime profile is not verified`);
}

function treatmentSourceDigest(receipt: ExecutedV3BehavioralScenario["receipt"]): AuthorityDigest {
  const sourceDigests = new Set(
    receipt.subjects
      .filter((subject) => subject.evidence.variant === "treatment")
      .map((subject) => subject.comparisonIdentity.sourceDigest),
  );
  if (sourceDigests.size !== 1 || sourceDigests.has(null)) {
    throw new Error("promotion treatment source digest is inconsistent");
  }
  const [sourceDigest] = sourceDigests;
  if (typeof sourceDigest !== "string" || !/^[a-f0-9]{64}$/u.test(sourceDigest)) {
    throw new Error("promotion treatment source digest is invalid");
  }
  return `sha256:${sourceDigest}`;
}

function repetitionDigestLane(
  receipts: ReadonlyMap<string, { readonly receiptDigest: AuthorityDigest }>,
  variant: "baseline" | "treatment",
): readonly AuthorityDigest[] {
  return Array.from({ length: 3 }, (_, index) => {
    const receipt = receipts.get(`${variant}:${String(index + 1)}`);
    if (receipt === undefined) throw new Error(`promotion is missing ${variant} repetition ${String(index + 1)}`);
    return receipt.receiptDigest;
  });
}

async function replaceCurrentBaselineAtomically(props: {
  readonly baselinePath: string;
  readonly source: string;
}): Promise<() => Promise<void>> {
  await mkdir(path.dirname(props.baselinePath), { recursive: true });
  const originalSource = await readFile(props.baselinePath, "utf8").catch((error: unknown) => {
    if (isMissingFile(error)) return null;
    throw error;
  });
  const temporaryPath = `${props.baselinePath}.${process.pid}.tmp`;
  try {
    await writeFile(temporaryPath, props.source, { flag: "wx" });
    await rename(temporaryPath, props.baselinePath);
  } finally {
    await rm(temporaryPath, { force: true });
  }
  return async () => {
    if (originalSource === null) {
      await rm(props.baselinePath, { force: true });
      return;
    }
    const rollbackPath = `${props.baselinePath}.${process.pid}.rollback.tmp`;
    try {
      await writeFile(rollbackPath, originalSource, { flag: "wx" });
      await rename(rollbackPath, props.baselinePath);
    } finally {
      await rm(rollbackPath, { force: true });
    }
  };
}

async function readDigestBoundSource(reference: {
  readonly receiptPath: string;
  readonly receiptDigest: string;
}): Promise<string> {
  const source = await readFile(reference.receiptPath, "utf8");
  if (digestSource(source) !== reference.receiptDigest) throw new Error("promotion source receipt digest does not match");
  return source;
}

async function runMutationCoverage(repositoryRoot: string): Promise<void> {
  const packageRoot = path.join(repositoryRoot, "tests/test-utils/skill-pressure");
  const vitestEntrypoint = path.join(packageRoot, "node_modules/vitest/vitest.mjs");
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(process.execPath, [
      vitestEntrypoint,
      "run",
      "lib/evidence/objective-artifact-checks.test.ts",
      "lib/evidence/repository-snapshot.test.ts",
      "lib/review/semantic-review-contract.test.ts",
      "--config",
      "vitest.config.ts",
    ], {
      cwd: packageRoot,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`deterministic mutation coverage failed: ${signal ?? String(code)}`));
    });
  });
}

function digestSource(source: string): AuthorityDigest {
  return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}

function asAuthorityDigest(value: string, label: string): AuthorityDigest {
  if (!/^sha256:[a-f0-9]{64}$/u.test(value)) throw new Error(`${label} is invalid`);
  return value as AuthorityDigest;
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as Record<string, unknown>;
}

function assertString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${label} must be non-empty`);
  return value;
}

function assertVariant(value: unknown, label: string): "baseline" | "treatment" {
  if (value !== "baseline" && value !== "treatment") throw new Error(`${label} is invalid`);
  return value;
}

function assertPositiveInteger(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || Number(value) < 1) throw new Error(`${label} is invalid`);
  return Number(value);
}

function isMissingFile(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
