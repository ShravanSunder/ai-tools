import { createHash } from "node:crypto";
import type { AuthorityReceiptReference } from "./evaluation-registry.js";
import { readTrackedAuthorityReceiptFile } from "./tracked-authority-receipt-file.js";

export type AuthorityDigest = `sha256:${string}`;

export interface PromotionEvidenceReceiptReference extends AuthorityReceiptReference {
  readonly scenarioId: string;
  readonly variant: "baseline" | "treatment";
  readonly repetitionNumber: number;
  readonly attemptNumber: number;
}

export interface PromotionAttemptEvidenceReceipt {
  readonly schemaVersion: 1;
  readonly receiptKind: "attempt";
  readonly scenarioId: string;
  readonly variant: "baseline" | "treatment";
  readonly repetitionNumber: number;
  readonly attemptNumber: number;
  readonly sourceAttemptReceiptDigest: AuthorityDigest;
  readonly acceptedForRepetition: boolean;
  readonly acceptedRepetitionReceiptDigest: AuthorityDigest | null;
  readonly processClosed: true;
  readonly streamsDrained: true;
  readonly outputRedacted: true;
  readonly snapshotsCollected: true;
}

export interface PromotionCleanupEvidenceReceipt {
  readonly schemaVersion: 1;
  readonly receiptKind: "cleanup";
  readonly scenarioId: string;
  readonly variant: "baseline" | "treatment";
  readonly repetitionNumber: number;
  readonly attemptNumber: number;
  readonly sourceAttemptReceiptDigest: AuthorityDigest;
  readonly processClosed: true;
  readonly streamsDrained: true;
  readonly cleanupFactsCollected: true;
}

export interface CalibrationFreshnessInputs {
  readonly behaviorContractDigest: AuthorityDigest;
  readonly baselinePolicyDigest: AuthorityDigest;
  readonly runnerSemanticsDigest: AuthorityDigest;
  readonly subjectProfileDigest: AuthorityDigest;
  readonly reviewProfileDigest: AuthorityDigest;
}

export interface CalibrationFreshnessFingerprint extends CalibrationFreshnessInputs {
  readonly digest: AuthorityDigest;
}

export interface ParentAcceptanceReceipt {
  readonly schemaVersion: 1;
  readonly receiptKind: "parent_acceptance";
  readonly scenarioId: string;
  readonly behaviorContractDigest: AuthorityDigest;
  readonly acceptedAuthorityReceiptDigest: AuthorityDigest;
  readonly acceptedRunDigest: AuthorityDigest;
  readonly calibrationFingerprintDigest: AuthorityDigest;
  readonly claimedRequirementManifestDigest: AuthorityDigest;
}

export interface PromotionReceipt {
  readonly schemaVersion: 1;
  readonly receiptKind: "promotion";
  readonly scenarioId: string;
  readonly behaviorContractDigest: AuthorityDigest;
  readonly calibrationFingerprint: CalibrationFreshnessInputs;
  readonly calibrationRunDigest: AuthorityDigest;
  readonly promotionTreatmentDigest: AuthorityDigest;
  readonly calibration: {
    readonly contractConsistent: true;
    readonly contractConsistencyEvidenceDigest: AuthorityDigest;
    readonly baselinePolicyValid: true;
    readonly baselinePolicyEvidenceDigest: AuthorityDigest;
    readonly baselineRepetitionDigests: readonly AuthorityDigest[];
    readonly treatmentRepetitionDigests: readonly AuthorityDigest[];
    readonly comparisonIntentPassed: true;
    readonly objectiveEvidenceDigest: AuthorityDigest;
    readonly semanticEvidenceDigest: AuthorityDigest;
    readonly attemptReceipts: readonly PromotionEvidenceReceiptReference[];
    readonly cleanupReceipts: readonly PromotionEvidenceReceiptReference[];
    readonly deterministicMutationCoverage: true;
    readonly subjectProfileVerified: true;
    readonly reviewProfileVerified: true;
  };
  readonly parentAcceptance: ParentAcceptanceReceipt;
}

export interface DemotionReceipt {
  readonly schemaVersion: 1;
  readonly receiptKind: "demotion";
  readonly scenarioId: string;
  readonly behaviorContractDigest: AuthorityDigest;
  readonly observedRunDigest: AuthorityDigest;
  readonly evidence: {
    readonly contractDigest: AuthorityDigest;
    readonly repetitionSetDigest: AuthorityDigest;
    readonly reviewDigest: AuthorityDigest;
    readonly aggregateDigest: AuthorityDigest;
    readonly reason: "contract_contradiction" | "unstable_baseline" | "reviewer_ambiguity" | "execution_budget_insufficient";
  };
  readonly parentAcceptance: ParentAcceptanceReceipt;
}

export interface ValidatedPromotionReceipt {
  readonly receipt: PromotionReceipt;
  readonly authorityReceiptDigest: AuthorityDigest;
  readonly calibrationFingerprint: CalibrationFreshnessFingerprint;
  readonly freshness: CalibrationFreshnessResult;
}

export type CalibrationFreshnessResult =
  | { readonly status: "fresh"; readonly reasonCode: null }
  | { readonly status: "stale"; readonly reasonCode: "stale_calibration" };

export function calculateCalibrationFreshnessFingerprint(
  inputs: CalibrationFreshnessInputs,
): CalibrationFreshnessFingerprint {
  assertFreshnessInputs(inputs, "calibration freshness inputs");
  return { ...inputs, digest: digestCanonical(inputs) };
}

export function evaluateCalibrationFreshness(props: {
  readonly recordedFingerprintDigest: AuthorityDigest;
  readonly currentFreshnessInputs: CalibrationFreshnessInputs;
}): CalibrationFreshnessResult {
  assertDigest(props.recordedFingerprintDigest, "recorded calibration fingerprint digest");
  return calculateCalibrationFreshnessFingerprint(props.currentFreshnessInputs).digest === props.recordedFingerprintDigest
    ? { status: "fresh", reasonCode: null }
    : { status: "stale", reasonCode: "stale_calibration" };
}

export function calculateAuthorityReceiptDigest(receipt: unknown): AuthorityDigest {
  const record = assertRecord(receipt, "authority receipt");
  const { parentAcceptance: _parentAcceptance, ...unsignedReceipt } = record;
  return digestCanonical(unsignedReceipt);
}

export function calculateParentAcceptanceReceiptDigest(receipt: unknown): AuthorityDigest {
  return digestCanonical(parseParentAcceptanceReceipt(receipt));
}

export function validateParentAcceptanceReceipt(props: {
  readonly receipt: unknown;
  readonly expected: {
    readonly scenarioId: string;
    readonly behaviorContractDigest: AuthorityDigest;
    readonly authorityReceiptDigest: AuthorityDigest;
    readonly runDigest: AuthorityDigest;
    readonly calibrationFingerprintDigest: AuthorityDigest;
    readonly claimedRequirementManifestDigest: AuthorityDigest;
  };
}): ParentAcceptanceReceipt {
  const receipt = parseParentAcceptanceReceipt(props.receipt);
  if (receipt.scenarioId !== props.expected.scenarioId) throw new Error("parent acceptance scenario id does not match");
  if (receipt.behaviorContractDigest !== props.expected.behaviorContractDigest) throw new Error("parent acceptance behavior contract digest does not match");
  if (receipt.acceptedAuthorityReceiptDigest !== props.expected.authorityReceiptDigest) throw new Error("parent acceptance authority receipt digest does not match");
  if (receipt.acceptedRunDigest !== props.expected.runDigest) throw new Error("parent acceptance run digest does not match");
  if (receipt.calibrationFingerprintDigest !== props.expected.calibrationFingerprintDigest) throw new Error("parent acceptance calibration fingerprint digest does not match");
  if (receipt.claimedRequirementManifestDigest !== props.expected.claimedRequirementManifestDigest) throw new Error("parent acceptance claimed requirement manifest digest does not match");
  return receipt;
}

export async function validatePromotionReceipt(props: {
  readonly receipt: unknown;
  readonly currentFreshnessInputs: CalibrationFreshnessInputs;
  readonly repositoryRoot: string;
}): Promise<ValidatedPromotionReceipt> {
  const receipt = parsePromotionReceipt(props.receipt);
  const authorityReceiptDigest = calculateAuthorityReceiptDigest(receipt);
  const calibrationFingerprint = calculateCalibrationFreshnessFingerprint(receipt.calibrationFingerprint);
  if (receipt.behaviorContractDigest !== receipt.calibrationFingerprint.behaviorContractDigest) {
    throw new Error("promotion behavior contract digest does not match calibration fingerprint");
  }
  validatePromotionEvidence(receipt.calibration);
  await validatePromotionEvidenceFiles({
    repositoryRoot: props.repositoryRoot,
    scenarioId: receipt.scenarioId,
    attemptReceipts: receipt.calibration.attemptReceipts,
    cleanupReceipts: receipt.calibration.cleanupReceipts,
  });
  validateParentAcceptanceReceipt({
    receipt: receipt.parentAcceptance,
    expected: {
      scenarioId: receipt.scenarioId,
      behaviorContractDigest: receipt.behaviorContractDigest,
      authorityReceiptDigest,
      runDigest: receipt.calibrationRunDigest,
      calibrationFingerprintDigest: calibrationFingerprint.digest,
      claimedRequirementManifestDigest: receipt.parentAcceptance.claimedRequirementManifestDigest,
    },
  });
  return {
    receipt,
    authorityReceiptDigest,
    calibrationFingerprint,
    freshness: evaluateCalibrationFreshness({
      recordedFingerprintDigest: calibrationFingerprint.digest,
      currentFreshnessInputs: props.currentFreshnessInputs,
    }),
  };
}

export function validateDemotionReceipt(props: {
  readonly receipt: unknown;
  readonly currentRunDigest?: AuthorityDigest;
}): { readonly receipt: DemotionReceipt; readonly authorityReceiptDigest: AuthorityDigest } {
  const receipt = parseDemotionReceipt(props.receipt);
  if (props.currentRunDigest !== undefined && receipt.observedRunDigest === props.currentRunDigest) {
    throw new Error("a demotion cannot change authority for the same run");
  }
  const authorityReceiptDigest = calculateAuthorityReceiptDigest(receipt);
  validateParentAcceptanceReceipt({
    receipt: receipt.parentAcceptance,
    expected: {
      scenarioId: receipt.scenarioId,
      behaviorContractDigest: receipt.behaviorContractDigest,
      authorityReceiptDigest,
      runDigest: receipt.observedRunDigest,
      calibrationFingerprintDigest: receipt.parentAcceptance.calibrationFingerprintDigest,
      claimedRequirementManifestDigest: receipt.parentAcceptance.claimedRequirementManifestDigest,
    },
  });
  return { receipt, authorityReceiptDigest };
}

export function evaluateReleaseAuthority(props: {
  readonly evaluationRole: "gate" | "diagnostic" | "retired";
  readonly calibration: ValidatedPromotionReceipt | null;
  readonly outcome: "pass" | "behavior_fail" | "inconclusive" | "infrastructure_error" | "not_evaluated";
  readonly runDigest: AuthorityDigest;
  readonly parentAcceptance: unknown | null;
  readonly claimedRequirementStatus: "traced" | "untraced" | "unknown";
  readonly claimedRequirementManifestDigest: AuthorityDigest;
}): { readonly releaseAuthority: boolean; readonly reasonCode: string | null } {
  if (props.evaluationRole !== "gate") return { releaseAuthority: false, reasonCode: "diagnostic_result" };
  if (props.calibration === null) return { releaseAuthority: false, reasonCode: "missing_calibration" };
  if (props.calibration.freshness.status === "stale") return { releaseAuthority: false, reasonCode: "stale_calibration" };
  if (props.claimedRequirementStatus !== "traced") return { releaseAuthority: false, reasonCode: "untraced_behavior_requirement" };
  if (props.outcome !== "pass") return { releaseAuthority: false, reasonCode: "non_passing_gate_outcome" };
  if (props.parentAcceptance === null) return { releaseAuthority: false, reasonCode: "missing_parent_acceptance" };
  try {
    validateParentAcceptanceReceipt({
      receipt: props.parentAcceptance,
      expected: {
        scenarioId: props.calibration.receipt.scenarioId,
        behaviorContractDigest: props.calibration.receipt.behaviorContractDigest,
        authorityReceiptDigest: props.calibration.authorityReceiptDigest,
        runDigest: props.runDigest,
        calibrationFingerprintDigest: props.calibration.calibrationFingerprint.digest,
        claimedRequirementManifestDigest: props.claimedRequirementManifestDigest,
      },
    });
  } catch {
    return { releaseAuthority: false, reasonCode: "parent_acceptance_mismatch" };
  }
  return { releaseAuthority: true, reasonCode: null };
}

function parsePromotionReceipt(input: unknown): PromotionReceipt {
  const receipt = assertRecord(input, "promotion receipt");
  assertLiteral(receipt.schemaVersion, 1, "promotion receipt schemaVersion");
  assertLiteral(receipt.receiptKind, "promotion", "promotion receipt kind");
  assertIdentifier(receipt.scenarioId, "promotion receipt scenario id");
  assertDigest(receipt.behaviorContractDigest, "promotion behavior contract digest");
  assertDigest(receipt.calibrationRunDigest, "promotion calibration run digest");
  assertDigest(receipt.promotionTreatmentDigest, "promotion treatment digest");
  const calibrationFingerprint = parseFreshnessInputs(receipt.calibrationFingerprint, "promotion calibration fingerprint");
  const calibration = parsePromotionEvidence(receipt.calibration);
  return {
    schemaVersion: 1,
    receiptKind: "promotion",
    scenarioId: receipt.scenarioId,
    behaviorContractDigest: receipt.behaviorContractDigest,
    calibrationFingerprint,
    calibrationRunDigest: receipt.calibrationRunDigest,
    promotionTreatmentDigest: receipt.promotionTreatmentDigest,
    calibration,
    parentAcceptance: parseParentAcceptanceReceipt(receipt.parentAcceptance),
  };
}

function parseDemotionReceipt(input: unknown): DemotionReceipt {
  const receipt = assertRecord(input, "demotion receipt");
  assertLiteral(receipt.schemaVersion, 1, "demotion receipt schemaVersion");
  assertLiteral(receipt.receiptKind, "demotion", "demotion receipt kind");
  assertIdentifier(receipt.scenarioId, "demotion receipt scenario id");
  assertDigest(receipt.behaviorContractDigest, "demotion behavior contract digest");
  assertDigest(receipt.observedRunDigest, "demotion observed run digest");
  const evidence = assertRecord(receipt.evidence, "demotion evidence");
  assertDigest(evidence.contractDigest, "demotion contract digest");
  assertDigest(evidence.repetitionSetDigest, "demotion repetition set digest");
  assertDigest(evidence.reviewDigest, "demotion review digest");
  assertDigest(evidence.aggregateDigest, "demotion aggregate digest");
  const allowedReasons = ["contract_contradiction", "unstable_baseline", "reviewer_ambiguity", "execution_budget_insufficient"] as const;
  if (!allowedReasons.includes(evidence.reason as typeof allowedReasons[number])) {
    throw new Error("treatment failure or mix does not justify demotion");
  }
  return {
    schemaVersion: 1,
    receiptKind: "demotion",
    scenarioId: receipt.scenarioId,
    behaviorContractDigest: receipt.behaviorContractDigest,
    observedRunDigest: receipt.observedRunDigest,
    evidence: {
      contractDigest: evidence.contractDigest,
      repetitionSetDigest: evidence.repetitionSetDigest,
      reviewDigest: evidence.reviewDigest,
      aggregateDigest: evidence.aggregateDigest,
      reason: evidence.reason as DemotionReceipt["evidence"]["reason"],
    },
    parentAcceptance: parseParentAcceptanceReceipt(receipt.parentAcceptance),
  };
}

function parsePromotionEvidence(input: unknown): PromotionReceipt["calibration"] {
  const evidence = assertRecord(input, "promotion calibration evidence");
  assertLiteral(evidence.contractConsistent, true, "promotion contract consistency");
  assertDigest(evidence.contractConsistencyEvidenceDigest, "promotion contract consistency evidence digest");
  assertLiteral(evidence.baselinePolicyValid, true, "promotion baseline policy validity");
  assertDigest(evidence.baselinePolicyEvidenceDigest, "promotion baseline policy evidence digest");
  assertLiteral(evidence.comparisonIntentPassed, true, "promotion comparison intent result");
  assertLiteral(evidence.deterministicMutationCoverage, true, "promotion deterministic mutation coverage");
  assertLiteral(evidence.subjectProfileVerified, true, "promotion subject profile verification");
  assertLiteral(evidence.reviewProfileVerified, true, "promotion review profile verification");
  const baselineRepetitionDigests = parseDigestArray(evidence.baselineRepetitionDigests, "promotion baseline repetitions");
  const treatmentRepetitionDigests = parseDigestArray(evidence.treatmentRepetitionDigests, "promotion treatment repetitions");
  if (baselineRepetitionDigests.length !== 5 || treatmentRepetitionDigests.length !== 5) {
    throw new Error("promotion requires five baseline and five treatment repetitions");
  }
  const attemptReceipts = parsePromotionEvidenceReferences(evidence.attemptReceipts, "promotion attempt receipts");
  const cleanupReceipts = parsePromotionEvidenceReferences(evidence.cleanupReceipts, "promotion cleanup receipts");
  if (attemptReceipts.length < 10 || cleanupReceipts.length < 10) {
    throw new Error("promotion requires durable attempt and cleanup receipts for every repetition");
  }
  assertDigest(evidence.objectiveEvidenceDigest, "promotion objective evidence digest");
  assertDigest(evidence.semanticEvidenceDigest, "promotion semantic evidence digest");
  return {
    contractConsistent: true,
    contractConsistencyEvidenceDigest: evidence.contractConsistencyEvidenceDigest,
    baselinePolicyValid: true,
    baselinePolicyEvidenceDigest: evidence.baselinePolicyEvidenceDigest,
    baselineRepetitionDigests,
    treatmentRepetitionDigests,
    comparisonIntentPassed: true,
    objectiveEvidenceDigest: evidence.objectiveEvidenceDigest,
    semanticEvidenceDigest: evidence.semanticEvidenceDigest,
    attemptReceipts,
    cleanupReceipts,
    deterministicMutationCoverage: true,
    subjectProfileVerified: true,
    reviewProfileVerified: true,
  };
}

function validatePromotionEvidence(evidence: PromotionReceipt["calibration"]): void {
  if (new Set(evidence.baselineRepetitionDigests).size !== 5 || new Set(evidence.treatmentRepetitionDigests).size !== 5) {
    throw new Error("promotion repetitions must be independently receipted");
  }
  if (
    new Set(evidence.attemptReceipts.map(promotionEvidenceIdentity)).size !== evidence.attemptReceipts.length ||
    new Set(evidence.cleanupReceipts.map(promotionEvidenceIdentity)).size !== evidence.cleanupReceipts.length
  ) {
    throw new Error("promotion attempts and cleanups must be independently receipted");
  }
  const expectedRepetitions = ["baseline", "treatment"].flatMap((variant) =>
    Array.from({ length: 5 }, (_, index) => `${variant}:${String(index + 1)}`));
  for (const references of [evidence.attemptReceipts, evidence.cleanupReceipts]) {
    const coveredRepetitions = new Set(references.map((reference) => {
      if (reference.repetitionNumber > 5) throw new Error("promotion evidence repetition is outside the calibrated range");
      return `${reference.variant}:${String(reference.repetitionNumber)}`;
    }));
    if (!expectedRepetitions.every((identity) => coveredRepetitions.has(identity))) {
      throw new Error("promotion evidence requires all five baseline and treatment repetitions");
    }
  }
}

async function validatePromotionEvidenceFiles(props: {
  readonly repositoryRoot: string;
  readonly scenarioId: string;
  readonly attemptReceipts: readonly PromotionEvidenceReceiptReference[];
  readonly cleanupReceipts: readonly PromotionEvidenceReceiptReference[];
}): Promise<void> {
  const attemptIdentities = new Set(props.attemptReceipts.map(promotionEvidenceIdentity));
  const cleanupIdentities = new Set(props.cleanupReceipts.map(promotionEvidenceIdentity));
  if (attemptIdentities.size !== cleanupIdentities.size || [...attemptIdentities].some((identity) => !cleanupIdentities.has(identity))) {
    throw new Error("promotion attempt and cleanup receipt identities must match");
  }
  await Promise.all([
    ...props.attemptReceipts.map((reference) => validatePromotionEvidenceFile({
      repositoryRoot: props.repositoryRoot,
      scenarioId: props.scenarioId,
      receiptKind: "attempt",
      reference,
    })),
    ...props.cleanupReceipts.map((reference) => validatePromotionEvidenceFile({
      repositoryRoot: props.repositoryRoot,
      scenarioId: props.scenarioId,
      receiptKind: "cleanup",
      reference,
    })),
  ]);
}

async function validatePromotionEvidenceFile(props: {
  readonly repositoryRoot: string;
  readonly scenarioId: string;
  readonly receiptKind: "attempt" | "cleanup";
  readonly reference: PromotionEvidenceReceiptReference;
}): Promise<void> {
  if (props.reference.scenarioId !== props.scenarioId) throw new Error("promotion evidence scenario id does not match");
  const source = await readTrackedAuthorityReceiptFile({
    repositoryRoot: props.repositoryRoot,
    receiptPath: props.reference.receiptPath,
    label: "promotion evidence receipt",
  });
  const digest = `sha256:${createHash("sha256").update(source).digest("hex")}`;
  if (digest !== props.reference.receiptDigest) throw new Error("promotion evidence receipt digest does not match");
  const receipt: unknown = JSON.parse(source.toString("utf8"));
  const record = assertRecord(receipt, "promotion evidence receipt");
  assertLiteral(record.schemaVersion, 1, "promotion evidence receipt schemaVersion");
  assertLiteral(record.receiptKind, props.receiptKind, "promotion evidence receipt kind");
  assertLiteral(record.scenarioId, props.reference.scenarioId, "promotion evidence receipt scenario id");
  assertLiteral(record.variant, props.reference.variant, "promotion evidence receipt variant");
  assertLiteral(record.repetitionNumber, props.reference.repetitionNumber, "promotion evidence receipt repetition number");
  assertLiteral(record.attemptNumber, props.reference.attemptNumber, "promotion evidence receipt attempt number");
  assertDigest(record.sourceAttemptReceiptDigest, "promotion evidence source attempt receipt digest");
  if (props.receiptKind === "attempt") {
    if (typeof record.acceptedForRepetition !== "boolean") {
      throw new Error("promotion attempt acceptance flag must be boolean");
    }
    if (record.acceptedForRepetition) {
      assertDigest(record.acceptedRepetitionReceiptDigest, "promotion accepted repetition receipt digest");
    } else if (record.acceptedRepetitionReceiptDigest !== null) {
      throw new Error("unaccepted promotion attempt cannot cite an accepted repetition receipt");
    }
    assertLiteral(record.processClosed, true, "promotion attempt process closure");
    assertLiteral(record.streamsDrained, true, "promotion attempt stream drainage");
    assertLiteral(record.outputRedacted, true, "promotion attempt output redaction");
    assertLiteral(record.snapshotsCollected, true, "promotion attempt snapshot collection");
  } else {
    assertLiteral(record.processClosed, true, "promotion cleanup process closure");
    assertLiteral(record.streamsDrained, true, "promotion cleanup stream drainage");
    assertLiteral(record.cleanupFactsCollected, true, "promotion cleanup facts");
  }
}

function parsePromotionEvidenceReferences(input: unknown, label: string): readonly PromotionEvidenceReceiptReference[] {
  if (!Array.isArray(input)) throw new Error(`${label} must be an array`);
  return input.map((item) => {
    const reference = assertRecord(item, label);
    assertIdentifier(reference.scenarioId, `${label} scenario id`);
    if (reference.variant !== "baseline" && reference.variant !== "treatment") throw new Error(`${label} variant is invalid`);
    if (!Number.isSafeInteger(reference.repetitionNumber) || Number(reference.repetitionNumber) < 1) throw new Error(`${label} repetition number is invalid`);
    if (!Number.isSafeInteger(reference.attemptNumber) || Number(reference.attemptNumber) < 1) throw new Error(`${label} attempt number is invalid`);
    if (typeof reference.receiptPath !== "string" || reference.receiptPath.trim() === "") throw new Error(`${label} receipt path is invalid`);
    assertDigest(reference.receiptDigest, `${label} receipt digest`);
    return {
      scenarioId: reference.scenarioId,
      variant: reference.variant,
      repetitionNumber: Number(reference.repetitionNumber),
      attemptNumber: Number(reference.attemptNumber),
      receiptPath: reference.receiptPath,
      receiptDigest: reference.receiptDigest,
    };
  });
}

function promotionEvidenceIdentity(reference: PromotionEvidenceReceiptReference): string {
  return `${reference.scenarioId}:${reference.variant}:${String(reference.repetitionNumber)}:${String(reference.attemptNumber)}`;
}

function parseParentAcceptanceReceipt(input: unknown): ParentAcceptanceReceipt {
  const receipt = assertRecord(input, "parent acceptance receipt");
  assertLiteral(receipt.schemaVersion, 1, "parent acceptance schemaVersion");
  assertLiteral(receipt.receiptKind, "parent_acceptance", "parent acceptance receipt kind");
  assertIdentifier(receipt.scenarioId, "parent acceptance scenario id");
  assertDigest(receipt.behaviorContractDigest, "parent acceptance behavior contract digest");
  assertDigest(receipt.acceptedAuthorityReceiptDigest, "parent acceptance authority receipt digest");
  assertDigest(receipt.acceptedRunDigest, "parent acceptance run digest");
  assertDigest(receipt.calibrationFingerprintDigest, "parent acceptance calibration fingerprint digest");
  assertDigest(receipt.claimedRequirementManifestDigest, "parent acceptance claimed requirement manifest digest");
  return {
    schemaVersion: 1,
    receiptKind: "parent_acceptance",
    scenarioId: receipt.scenarioId,
    behaviorContractDigest: receipt.behaviorContractDigest,
    acceptedAuthorityReceiptDigest: receipt.acceptedAuthorityReceiptDigest,
    acceptedRunDigest: receipt.acceptedRunDigest,
    calibrationFingerprintDigest: receipt.calibrationFingerprintDigest,
    claimedRequirementManifestDigest: receipt.claimedRequirementManifestDigest,
  };
}

function parseFreshnessInputs(input: unknown, label: string): CalibrationFreshnessInputs {
  const values = assertRecord(input, label);
  assertFreshnessInputs(values, label);
  return values;
}

function assertFreshnessInputs(input: unknown, label: string): asserts input is CalibrationFreshnessInputs {
  const values = assertRecord(input, label);
  assertDigest(values.behaviorContractDigest, `${label} behavior contract digest`);
  assertDigest(values.baselinePolicyDigest, `${label} baseline policy digest`);
  assertDigest(values.runnerSemanticsDigest, `${label} runner semantics digest`);
  assertDigest(values.subjectProfileDigest, `${label} subject profile digest`);
  assertDigest(values.reviewProfileDigest, `${label} review profile digest`);
}

function parseDigestArray(input: unknown, label: string): readonly AuthorityDigest[] {
  if (!Array.isArray(input)) throw new Error(`${label} must be an array`);
  input.forEach((digest, index) => assertDigest(digest, `${label}[${index}]`));
  return input;
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new Error(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}

function assertDigest(value: unknown, label: string): asserts value is AuthorityDigest {
  if (typeof value !== "string" || !/^sha256:[a-f0-9]{64}$/u.test(value)) throw new Error(`${label} must be a sha256 digest`);
}

function assertIdentifier(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !/^[a-z0-9][a-z0-9-]*$/u.test(value)) throw new Error(`${label} must be an identifier`);
}

function assertLiteral<TValue>(value: unknown, expected: TValue, label: string): asserts value is TValue {
  if (value !== expected) throw new Error(`${label} must equal ${String(expected)}`);
}

function digestCanonical(value: unknown): AuthorityDigest {
  return `sha256:${createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex")}`;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => [key, canonicalize(entry)]));
}
