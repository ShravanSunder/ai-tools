import { createHash } from "node:crypto";

export type AuthorityDigest = `sha256:${string}`;

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

export interface CurrentBaselineExecutionRepetition {
  readonly variant: "baseline" | "treatment";
  readonly repetitionNumber: number;
  readonly attemptNumber: number;
  readonly sourceAttemptReceiptDigest: AuthorityDigest;
  readonly acceptedAttemptReceiptDigest: AuthorityDigest;
  readonly acceptedRepetitionReceiptDigest: AuthorityDigest;
  readonly processClosed: true;
  readonly streamsDrained: true;
  readonly outputRedacted: true;
  readonly snapshotsCollected: true;
  readonly cleanupFactsCollected: true;
}

export interface CurrentBaselineExecutionEvidence {
  readonly calibrationRunDigest: AuthorityDigest;
  readonly acceptedSkillSourceDigest: AuthorityDigest;
  readonly repetitions: readonly CurrentBaselineExecutionRepetition[];
}

export interface CurrentBaselineCalibration {
  readonly contractConsistent: true;
  readonly contractConsistencyEvidenceDigest: AuthorityDigest;
  readonly baselinePolicyValid: true;
  readonly baselinePolicyEvidenceDigest: AuthorityDigest;
  readonly baselineRepetitionDigests: readonly AuthorityDigest[];
  readonly treatmentRepetitionDigests: readonly AuthorityDigest[];
  readonly comparisonIntentPassed: true;
  readonly objectiveEvidenceDigest: AuthorityDigest;
  readonly semanticEvidenceDigest: AuthorityDigest;
  readonly deterministicMutationCoverage: true;
  readonly subjectProfileVerified: true;
  readonly reviewProfileVerified: true;
}

export interface CurrentBaselineReceipt {
  readonly schemaVersion: 1;
  readonly receiptKind: "current_baseline";
  readonly scenarioId: string;
  readonly behaviorContractDigest: AuthorityDigest;
  readonly calibrationFingerprint: CalibrationFreshnessInputs;
  readonly calibrationRunDigest: AuthorityDigest;
  readonly acceptedSkillSourceDigest: AuthorityDigest;
  readonly calibration: CurrentBaselineCalibration;
  readonly executionEvidence: CurrentBaselineExecutionEvidence;
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

export interface ValidatedCurrentBaselineReceipt {
  readonly receipt: CurrentBaselineReceipt;
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

export async function validateCurrentBaselineReceipt(props: {
  readonly receipt: unknown;
  readonly currentFreshnessInputs: CalibrationFreshnessInputs;
  readonly repositoryRoot: string;
}): Promise<ValidatedCurrentBaselineReceipt> {
  const receipt = parseCurrentBaselineReceipt(props.receipt);
  const authorityReceiptDigest = calculateAuthorityReceiptDigest(receipt);
  const calibrationFingerprint = calculateCalibrationFreshnessFingerprint(receipt.calibrationFingerprint);
  if (receipt.behaviorContractDigest !== receipt.calibrationFingerprint.behaviorContractDigest) {
    throw new Error("current baseline behavior contract digest does not match calibration fingerprint");
  }
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
  readonly calibration: ValidatedCurrentBaselineReceipt | null;
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

export function parseCurrentBaselineReceipt(input: unknown): CurrentBaselineReceipt {
  const receipt = assertRecord(input, "current baseline receipt");
  assertExactKeys(receipt, [
    "schemaVersion",
    "receiptKind",
    "scenarioId",
    "behaviorContractDigest",
    "calibrationFingerprint",
    "calibrationRunDigest",
    "acceptedSkillSourceDigest",
    "calibration",
    "executionEvidence",
    "parentAcceptance",
  ], "current baseline receipt");
  assertLiteral(receipt.schemaVersion, 1, "current baseline receipt schemaVersion");
  assertLiteral(receipt.receiptKind, "current_baseline", "current baseline receipt kind");
  assertIdentifier(receipt.scenarioId, "current baseline receipt scenario id");
  assertDigest(receipt.behaviorContractDigest, "current baseline behavior contract digest");
  assertDigest(receipt.calibrationRunDigest, "current baseline calibration run digest");
  assertDigest(receipt.acceptedSkillSourceDigest, "current baseline accepted skill source digest");
  const calibrationFingerprint = parseFreshnessInputs(receipt.calibrationFingerprint, "current baseline calibration fingerprint");
  const calibration = parseBaselineCalibration(receipt.calibration);
  const executionEvidence = parseExecutionEvidence(receipt.executionEvidence);
  if (executionEvidence.calibrationRunDigest !== receipt.calibrationRunDigest) {
    throw new Error("current baseline execution evidence run digest does not match");
  }
  if (executionEvidence.acceptedSkillSourceDigest !== receipt.acceptedSkillSourceDigest) {
    throw new Error("current baseline execution evidence source digest does not match");
  }
  return {
    schemaVersion: 1,
    receiptKind: "current_baseline",
    scenarioId: receipt.scenarioId,
    behaviorContractDigest: receipt.behaviorContractDigest,
    calibrationFingerprint,
    calibrationRunDigest: receipt.calibrationRunDigest,
    acceptedSkillSourceDigest: receipt.acceptedSkillSourceDigest,
    calibration,
    executionEvidence,
    parentAcceptance: parseParentAcceptanceReceipt(receipt.parentAcceptance),
  };
}

function parseBaselineCalibration(input: unknown): CurrentBaselineCalibration {
  const calibration = assertRecord(input, "current baseline calibration");
  assertExactKeys(calibration, [
    "contractConsistent",
    "contractConsistencyEvidenceDigest",
    "baselinePolicyValid",
    "baselinePolicyEvidenceDigest",
    "baselineRepetitionDigests",
    "treatmentRepetitionDigests",
    "comparisonIntentPassed",
    "objectiveEvidenceDigest",
    "semanticEvidenceDigest",
    "deterministicMutationCoverage",
    "subjectProfileVerified",
    "reviewProfileVerified",
  ], "current baseline calibration");
  assertLiteral(calibration.contractConsistent, true, "current baseline contract consistency");
  assertDigest(calibration.contractConsistencyEvidenceDigest, "current baseline contract consistency evidence digest");
  assertLiteral(calibration.baselinePolicyValid, true, "current baseline policy validity");
  assertDigest(calibration.baselinePolicyEvidenceDigest, "current baseline policy evidence digest");
  assertLiteral(calibration.comparisonIntentPassed, true, "current baseline comparison intent result");
  assertLiteral(calibration.deterministicMutationCoverage, true, "current baseline mutation coverage");
  assertLiteral(calibration.subjectProfileVerified, true, "current baseline subject profile verification");
  assertLiteral(calibration.reviewProfileVerified, true, "current baseline review profile verification");
  const baselineRepetitionDigests = parseDigestArray(calibration.baselineRepetitionDigests, "current baseline baseline repetitions");
  const treatmentRepetitionDigests = parseDigestArray(calibration.treatmentRepetitionDigests, "current baseline treatment repetitions");
  if (baselineRepetitionDigests.length !== 3 || treatmentRepetitionDigests.length !== 3) {
    throw new Error("current baseline requires exactly three baseline and three treatment repetitions");
  }
  if (new Set(baselineRepetitionDigests).size !== 3 || new Set(treatmentRepetitionDigests).size !== 3) {
    throw new Error("current baseline repetitions must be independent");
  }
  assertDigest(calibration.objectiveEvidenceDigest, "current baseline objective evidence digest");
  assertDigest(calibration.semanticEvidenceDigest, "current baseline semantic evidence digest");
  return {
    contractConsistent: true,
    contractConsistencyEvidenceDigest: calibration.contractConsistencyEvidenceDigest,
    baselinePolicyValid: true,
    baselinePolicyEvidenceDigest: calibration.baselinePolicyEvidenceDigest,
    baselineRepetitionDigests,
    treatmentRepetitionDigests,
    comparisonIntentPassed: true,
    objectiveEvidenceDigest: calibration.objectiveEvidenceDigest,
    semanticEvidenceDigest: calibration.semanticEvidenceDigest,
    deterministicMutationCoverage: true,
    subjectProfileVerified: true,
    reviewProfileVerified: true,
  };
}

function parseExecutionEvidence(input: unknown): CurrentBaselineExecutionEvidence {
  const evidence = assertRecord(input, "current baseline execution evidence");
  assertExactKeys(evidence, ["calibrationRunDigest", "acceptedSkillSourceDigest", "repetitions"], "current baseline execution evidence");
  assertDigest(evidence.calibrationRunDigest, "current baseline execution run digest");
  assertDigest(evidence.acceptedSkillSourceDigest, "current baseline execution source digest");
  if (!Array.isArray(evidence.repetitions) || evidence.repetitions.length !== 6) {
    throw new Error("current baseline execution evidence requires exactly six repetitions");
  }
  const expectedIdentities = ["baseline:1", "baseline:2", "baseline:3", "treatment:1", "treatment:2", "treatment:3"];
  const repetitions = evidence.repetitions.map((value, index) => parseExecutionRepetition(value, index));
  const identities = repetitions.map((repetition) => `${repetition.variant}:${String(repetition.repetitionNumber)}`);
  if (identities.some((identity, index) => identity !== expectedIdentities[index])) {
    throw new Error("current baseline execution evidence repetitions must use canonical baseline then treatment order");
  }
  if (new Set(identities).size !== repetitions.length) {
    throw new Error("current baseline execution evidence contains duplicate repetitions");
  }
  if (new Set(repetitions.map((repetition) => repetition.acceptedRepetitionReceiptDigest)).size !== repetitions.length) {
    throw new Error("current baseline execution evidence contains duplicate accepted repetitions");
  }
  if (new Set(repetitions.map((repetition) => repetition.sourceAttemptReceiptDigest)).size !== repetitions.length) {
    throw new Error("current baseline execution evidence contains duplicate source attempts");
  }
  return {
    calibrationRunDigest: evidence.calibrationRunDigest,
    acceptedSkillSourceDigest: evidence.acceptedSkillSourceDigest,
    repetitions,
  };
}

function parseExecutionRepetition(input: unknown, index: number): CurrentBaselineExecutionRepetition {
  const repetition = assertRecord(input, `current baseline execution repetition ${String(index + 1)}`);
  assertExactKeys(repetition, [
    "variant",
    "repetitionNumber",
    "attemptNumber",
    "sourceAttemptReceiptDigest",
    "acceptedAttemptReceiptDigest",
    "acceptedRepetitionReceiptDigest",
    "processClosed",
    "streamsDrained",
    "outputRedacted",
    "snapshotsCollected",
    "cleanupFactsCollected",
  ], `current baseline execution repetition ${String(index + 1)}`);
  if (repetition.variant !== "baseline" && repetition.variant !== "treatment") throw new Error("current baseline execution variant is invalid");
  const repetitionNumber = assertPositiveInteger(repetition.repetitionNumber, "current baseline execution repetition number");
  if (repetitionNumber > 3) {
    throw new Error("current baseline execution repetition number is invalid");
  }
  const attemptNumber = assertPositiveInteger(repetition.attemptNumber, "current baseline execution attempt number");
  assertDigest(repetition.sourceAttemptReceiptDigest, "current baseline execution source attempt digest");
  assertDigest(repetition.acceptedAttemptReceiptDigest, "current baseline execution accepted attempt digest");
  assertDigest(repetition.acceptedRepetitionReceiptDigest, "current baseline execution accepted repetition digest");
  if (repetition.sourceAttemptReceiptDigest !== repetition.acceptedAttemptReceiptDigest) {
    throw new Error("current baseline execution source attempt does not bind the accepted repetition");
  }
  assertLiteral(repetition.processClosed, true, "current baseline execution process closure");
  assertLiteral(repetition.streamsDrained, true, "current baseline execution stream drainage");
  assertLiteral(repetition.outputRedacted, true, "current baseline execution output redaction");
  assertLiteral(repetition.snapshotsCollected, true, "current baseline execution snapshot collection");
  assertLiteral(repetition.cleanupFactsCollected, true, "current baseline execution cleanup facts");
  return {
    variant: repetition.variant,
    repetitionNumber,
    attemptNumber,
    sourceAttemptReceiptDigest: repetition.sourceAttemptReceiptDigest,
    acceptedAttemptReceiptDigest: repetition.acceptedAttemptReceiptDigest,
    acceptedRepetitionReceiptDigest: repetition.acceptedRepetitionReceiptDigest,
    processClosed: true,
    streamsDrained: true,
    outputRedacted: true,
    snapshotsCollected: true,
    cleanupFactsCollected: true,
  };
}

function parseDemotionReceipt(input: unknown): DemotionReceipt {
  const receipt = assertRecord(input, "demotion decision");
  assertLiteral(receipt.schemaVersion, 1, "demotion decision schemaVersion");
  assertLiteral(receipt.receiptKind, "demotion", "demotion decision kind");
  assertIdentifier(receipt.scenarioId, "demotion scenario id");
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

function parseParentAcceptanceReceipt(input: unknown): ParentAcceptanceReceipt {
  const receipt = assertRecord(input, "parent acceptance receipt");
  assertExactKeys(receipt, [
    "schemaVersion",
    "receiptKind",
    "scenarioId",
    "behaviorContractDigest",
    "acceptedAuthorityReceiptDigest",
    "acceptedRunDigest",
    "calibrationFingerprintDigest",
    "claimedRequirementManifestDigest",
  ], "parent acceptance receipt");
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
  assertExactKeys(values, ["behaviorContractDigest", "baselinePolicyDigest", "runnerSemanticsDigest", "subjectProfileDigest", "reviewProfileDigest"], label);
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

function assertExactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort();
  const canonicalExpected = [...expected].sort();
  if (actual.length !== canonicalExpected.length || actual.some((key, index) => key !== canonicalExpected[index])) {
    throw new Error(`${label} has unexpected, missing, or duplicate fields`);
  }
}

function assertDigest(value: unknown, label: string): asserts value is AuthorityDigest {
  if (typeof value !== "string" || !/^sha256:[a-f0-9]{64}$/u.test(value)) throw new Error(`${label} must be a sha256 digest`);
}

function assertIdentifier(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !/^[a-z0-9][a-z0-9-]*$/u.test(value)) throw new Error(`${label} must be an identifier`);
}

function assertPositiveInteger(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || Number(value) < 1) throw new Error(`${label} must be a positive integer`);
  return Number(value);
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
