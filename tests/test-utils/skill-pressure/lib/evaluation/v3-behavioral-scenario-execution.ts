import { createHash } from "node:crypto";
import path from "node:path";

import type { EvaluationRegistry, EvaluationRegistryRow } from "../authority/evaluation-registry.js";
import type { ObjectiveArtifactDeclaration } from "../contracts/objective-check-types.js";
import type { V3BehaviorContract } from "../contracts/v3-behavior-contract.js";
import { evaluateObjectiveCheckPlan, type ObjectiveCheckResult } from "../evidence/objective-artifact-checks.js";
import { reduceDeterministicCheckResults, type NormalizedRepetitionEvidence } from "../evidence/repetition-evidence.js";
import type { ScenarioOutcomeReduction } from "../reduction/outcome-reducer.js";
import { reduceScenarioOutcome } from "../reduction/outcome-reducer.js";
import {
  type AttemptDurableFacts,
  createScenarioProgressReceipt,
  writeAttemptReceipt,
  writeJsonReceipt,
  writeScenarioProgressReceipt,
} from "../reporting/attempt-receipt.js";
import {
  applyObjectiveSemanticPrecedence,
  buildStructuredSemanticReviewPacket,
  parseStructuredSemanticReviewCandidate,
  validateStructuredSemanticReviewCandidate,
  type SemanticCandidateValidationResult,
  type StructuredSemanticReviewPacket,
} from "../review/semantic-review-contract.js";
import {
  ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
  ACPX_LUNA_XHIGH_SUBJECT_PROFILE,
  type RuntimeProfile,
  type RuntimeProfileReceipt,
} from "../runtime/runtime-profile.js";
import {
  assertScenarioExecutionBudget,
  type DerivedScenarioExecutionBudget,
} from "./scenario-execution-budget.js";
import {
  createObjectiveCheckPlanFromContract,
  validateV3ComparisonSet,
  type V3ComparisonIdentity,
} from "./v3-scenario-preflight.js";

export interface V3ExecutedRepetition {
  readonly evidence: NormalizedRepetitionEvidence;
  readonly runtimeProfile: RuntimeProfileReceipt;
  readonly durableFacts: AttemptDurableFacts;
  readonly comparisonIdentity: V3ComparisonIdentity;
}

export interface PersistV3AttemptProps {
  readonly variant: "baseline" | "treatment";
  readonly repetitionNumber: number;
  readonly attemptNumber: number;
  readonly repetition: V3ExecutedRepetition;
}

export interface PersistAcceptedV3RepetitionProps {
  readonly variant: "baseline" | "treatment";
  readonly repetitionNumber: number;
  readonly repetition: V3ExecutedRepetition;
  readonly attemptReceiptPath: string;
}

export interface V3SubjectExecutionRequest {
  readonly scenarioId: string;
  readonly prompt: string;
  readonly repetitions: number;
  readonly baseline: V3BehaviorContract["baseline"];
  readonly baselineRevision: string | null;
  readonly artifactCollectionPlan: readonly ObjectiveArtifactDeclaration[];
  readonly fixtureRequirements: readonly string[];
  readonly allowedTools: readonly string[];
  readonly allowedWritePaths: readonly string[];
  readonly skillName: string;
  readonly signal: AbortSignal;
  readonly persistAttempt: (props: PersistV3AttemptProps) => Promise<string>;
  readonly persistAcceptedRepetition: (props: PersistAcceptedV3RepetitionProps) => Promise<string>;
}

export interface V3SubjectExecutionResult {
  readonly baseline: readonly V3ExecutedRepetition[];
  readonly treatment: readonly V3ExecutedRepetition[];
}

export interface V3SemanticReviewExecutionResult {
  readonly visibleResponse: string;
  readonly runtimeProfile: RuntimeProfileReceipt;
}

export interface ExecuteV3BehavioralScenarioProps {
  readonly contract: V3BehaviorContract;
  readonly registrySnapshot: EvaluationRegistry;
  readonly executionBudget: DerivedScenarioExecutionBudget;
  readonly configuredScenarioDeadlineMs: number;
  readonly configuredVitestTimeoutMs: number;
  readonly outputDirectory: string;
  readonly redactionSecrets: readonly string[];
  readonly executeSubjects: (request: V3SubjectExecutionRequest) => Promise<V3SubjectExecutionResult>;
  readonly executeSemanticReview: (props: {
    readonly packet: StructuredSemanticReviewPacket;
    readonly signal: AbortSignal;
  }) => Promise<V3SemanticReviewExecutionResult>;
}

export interface V3ObjectiveRepetitionResult {
  readonly repetitionId: string;
  readonly variant: "baseline" | "treatment";
  readonly results: readonly ObjectiveCheckResult[];
  readonly outcome: "pass" | "behavior_fail" | "not_evaluated";
}

export interface V3BehavioralScenarioReceipt {
  readonly schemaVersion: 3;
  readonly scenarioId: string;
  readonly behaviorIdentity: {
    readonly behaviorContractDigest: string;
    readonly behaviorRequirementIds: readonly string[];
  };
  readonly authoritySnapshot: {
    readonly evaluationRole: EvaluationRegistryRow["evaluationRole"];
    readonly freshness: EvaluationRegistryRow["freshness"];
    readonly releaseAuthority: boolean;
  };
  readonly comparisonValidation: {
    readonly valid: boolean;
    readonly reasons: readonly string[];
  };
  readonly objectiveResults: readonly V3ObjectiveRepetitionResult[];
  readonly semanticReview: {
    readonly validation: SemanticCandidateValidationResult;
    readonly runtimeProfile: RuntimeProfileReceipt | null;
  };
  readonly runtimeProfiles: {
    readonly subjects: readonly RuntimeProfileReceipt[];
    readonly reviewer: RuntimeProfileReceipt;
  };
  readonly executionBudget: DerivedScenarioExecutionBudget;
  readonly attemptReceiptPaths: readonly string[];
  readonly repetitionReceiptPaths: readonly string[];
  readonly progressReceiptPaths: readonly string[];
  readonly reduction: ScenarioOutcomeReduction | {
    readonly outcome: "infrastructure_error" | "not_evaluated";
    readonly reasonCode: "scenario_deadline" | "runtime_profile_unverified" | "incomplete_cleanup" | "comparison_mismatch" | "review_parse_failure" | "stale_calibration";
    readonly reasons: readonly string[];
  };
  readonly lastDurableStage: "scenario_receipt_published";
}

export interface ExecutedV3BehavioralScenario {
  readonly receiptPath: string;
  readonly receipt: V3BehavioralScenarioReceipt;
}

export async function executeV3BehavioralScenario(
  props: ExecuteV3BehavioralScenarioProps,
): Promise<ExecutedV3BehavioralScenario> {
  const registryRow = assertIntegrationInputs(props);
  const objectiveCheckPlan = createObjectiveCheckPlanFromContract(props.contract);
  const receiptDirectory = path.resolve(props.outputDirectory, "receipts");
  const attemptReceiptPaths: string[] = [];
  const attemptBindings = new Map<string, { readonly repetitionDigest: string; readonly receiptDigest: string }>();
  const repetitionReceiptPaths: string[] = [];
  const progressReceiptPaths: string[] = [];
  let progressSequence = 0;
  const abortController = new AbortController();
  const deadlineTimer = setTimeout(() => abortController.abort("scenario_deadline"), props.configuredScenarioDeadlineMs);

  const persistProgress = async (
    status: "running" | "timed_out" | "completed" | "infrastructure_error",
    lastDurableStage: string,
    reasonCode: string | null = null,
  ): Promise<void> => {
    progressSequence += 1;
    const persisted = await writeScenarioProgressReceipt({
      receiptDirectory,
      fileName: `progress-${String(progressSequence).padStart(4, "0")}.json`,
      progress: createScenarioProgressReceipt({
        scenarioId: props.contract.scenarioId,
        status,
        lastDurableStage,
        completedAttemptReceiptPaths: attemptReceiptPaths,
        reasonCode,
      }),
      secrets: props.redactionSecrets,
    });
    progressReceiptPaths.push(persisted.receiptPath);
  };

  await persistProgress("running", "scenario_started");
  try {
    const subjects = await props.executeSubjects({
      scenarioId: props.contract.scenarioId,
      prompt: props.contract.prompt,
      repetitions: props.contract.repetitions,
      baseline: props.contract.baseline,
      baselineRevision: props.contract.baselineRevision,
      artifactCollectionPlan: objectiveCheckPlan.declaredArtifacts,
      fixtureRequirements: props.contract.fixtureRequirements,
      allowedTools: props.contract.allowedTools,
      allowedWritePaths: props.contract.allowedWritePaths,
      skillName: props.contract.skill,
      signal: abortController.signal,
      persistAttempt: async (attempt) => {
        const persisted = await writeAttemptReceipt({
          receiptDirectory,
          fileName: `${attempt.variant}-${attempt.repetitionNumber}-attempt-${attempt.attemptNumber}.json`,
          durableFacts: attempt.repetition.durableFacts,
          receipt: attempt,
          secrets: props.redactionSecrets,
        });
        attemptReceiptPaths.push(persisted.receiptPath);
        attemptBindings.set(persisted.receiptPath, {
          repetitionDigest: digestRepetition(attempt.repetition),
          receiptDigest: persisted.receiptDigest,
        });
        await persistProgress("running", "attempt_receipt_published");
        return persisted.receiptPath;
      },
      persistAcceptedRepetition: async (accepted) => {
        const attemptBinding = attemptBindings.get(accepted.attemptReceiptPath);
        if (
          attemptBinding === undefined ||
          attemptBinding.repetitionDigest !== digestRepetition(accepted.repetition)
        ) {
          throw new Error("accepted repetition does not match its durable attempt receipt");
        }
        const persisted = await writeJsonReceipt({
          receiptDirectory,
          fileName: `${accepted.variant}-${accepted.repetitionNumber}-repetition.json`,
          receipt: {
            schemaVersion: 1,
            scenarioId: props.contract.scenarioId,
            variant: accepted.variant,
            repetitionNumber: accepted.repetitionNumber,
            repetitionId: accepted.repetition.evidence.repetitionId,
            acceptedAttemptReceiptPath: accepted.attemptReceiptPath,
            acceptedAttemptReceiptDigest: attemptBinding.receiptDigest,
            lastDurableStage: "repetition_receipt_published",
          },
          secrets: props.redactionSecrets,
        });
        repetitionReceiptPaths.push(persisted.receiptPath);
        await persistProgress("running", "repetition_receipt_published");
        return persisted.receiptPath;
      },
    });
    if (abortController.signal.aborted) throw new Error("scenario deadline elapsed after subject execution");

    const repetitions = [...subjects.baseline, ...subjects.treatment];
    const comparisonValidation = validateV3ComparisonSet({
      contract: props.contract,
      subjects,
      attemptReceiptPaths,
      repetitionReceiptPaths,
    });
    if (!comparisonValidation.valid) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceiptPaths,
        repetitionReceiptPaths,
        progressReceiptPaths,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults: [],
        semanticValidation: { valid: false, reason: "semantic review skipped after comparison validation failure" },
        reviewerRuntimeProfile: VERIFIED_ABSENT_REVIEW_PROFILE,
        reduction: infrastructureReductionResult("comparison_mismatch", comparisonValidation.reasons),
      });
    }
    const infrastructureReduction = reduceInfrastructure(repetitions);
    if (infrastructureReduction !== null) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceiptPaths,
        repetitionReceiptPaths,
        progressReceiptPaths,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults: [],
        semanticValidation: { valid: false, reason: "semantic review skipped after infrastructure failure" },
        reviewerRuntimeProfile: VERIFIED_ABSENT_REVIEW_PROFILE,
        reduction: infrastructureReduction,
      });
    }

    const objectiveResults = repetitions.map((repetition) => {
      const results = evaluateObjectiveCheckPlan({
        plan: objectiveCheckPlan,
        repositoryEvidence: repetition.evidence.repositoryFacts,
        toolObservations: repetition.evidence.toolObservations,
      });
      return {
        repetitionId: repetition.evidence.repetitionId,
        variant: repetition.evidence.variant,
        results,
        outcome: reduceDeterministicCheckResults(results),
      } satisfies V3ObjectiveRepetitionResult;
    });
    const packet = buildStructuredSemanticReviewPacket({
      assertions: props.contract.semanticAssertions,
      evidence: repetitions.map((repetition) => repetition.evidence),
      redactionSecrets: props.redactionSecrets,
    });
    const review = await props.executeSemanticReview({ packet, signal: abortController.signal });
    if (abortController.signal.aborted) throw new Error("scenario deadline elapsed after semantic review");
    const expectedReviewerProfile = props.contract.risk === "high"
      ? ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE
      : ACPX_LUNA_XHIGH_SUBJECT_PROFILE;
    const reviewProfileReasons = validateExactRuntimeProfile(review.runtimeProfile, expectedReviewerProfile);
    if (reviewProfileReasons.length > 0) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceiptPaths,
        repetitionReceiptPaths,
        progressReceiptPaths,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults,
        semanticValidation: { valid: false, reason: "review runtime profile was not verified" },
        reviewerRuntimeProfile: review.runtimeProfile,
        reduction: infrastructureReductionResult("runtime_profile_unverified", reviewProfileReasons),
      });
    }
    const parsed = parseStructuredSemanticReviewCandidate(review.visibleResponse);
    if (parsed.candidate === null) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceiptPaths,
        repetitionReceiptPaths,
        progressReceiptPaths,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults,
        semanticValidation: { valid: false, reason: parsed.parseError },
        reviewerRuntimeProfile: review.runtimeProfile,
        reduction: {
          outcome: "not_evaluated",
          reasonCode: "review_parse_failure",
          reasons: [parsed.parseError ?? "semantic review response could not be parsed"],
        },
      });
    }
    const semanticValidation = validateStructuredSemanticReviewCandidate({ packet, candidate: parsed.candidate });
    const reduction = semanticValidation.valid
      ? reduceEvidence({ contract: props.contract, subjects, objectiveResults, candidate: parsed.candidate })
      : {
          outcome: "not_evaluated" as const,
          reasonCode: "review_parse_failure" as const,
          reasons: [semanticValidation.reason ?? "semantic review candidate failed validation"],
        };
    const authorityReduction = applyAuthorityFreshness(registryRow, reduction);
    return publishScenarioReceipt({
      props,
      registryRow,
      receiptDirectory,
      attemptReceiptPaths,
      repetitionReceiptPaths,
      progressReceiptPaths,
      persistProgress,
      subjects: repetitions,
      comparisonValidation,
      objectiveResults,
      semanticValidation,
      reviewerRuntimeProfile: review.runtimeProfile,
      reduction: authorityReduction,
    });
  } catch (error) {
    if (!abortController.signal.aborted) throw error;
    const reduction = infrastructureReductionResult("scenario_deadline", [
      error instanceof Error ? error.message : "scenario deadline elapsed",
    ]);
    return publishScenarioReceipt({
      props,
      registryRow,
      receiptDirectory,
      attemptReceiptPaths,
      repetitionReceiptPaths,
      progressReceiptPaths,
      persistProgress,
      subjects: [],
      comparisonValidation: { valid: false, reasons: ["scenario deadline elapsed before comparison validation"] },
      objectiveResults: [],
      semanticValidation: { valid: false, reason: "scenario deadline elapsed before semantic review" },
      reviewerRuntimeProfile: VERIFIED_ABSENT_REVIEW_PROFILE,
      reduction,
      progressStatus: "timed_out",
    });
  } finally {
    clearTimeout(deadlineTimer);
  }
}

const VERIFIED_ABSENT_REVIEW_PROFILE: RuntimeProfileReceipt = {
  requested: { provider: "codex", model: "not_started", reasoningEffort: "not_started" },
  acceptedProviderReported: { model: "not_started", reasoningEffort: "not_started" },
  providerReported: { model: null, reasoningEffort: null },
  verification: {
    status: "unverified",
    reasonCode: "runtime_profile_unverified",
    reasons: ["semantic reviewer was not started"],
  },
};

function assertIntegrationInputs(props: ExecuteV3BehavioralScenarioProps): EvaluationRegistryRow {
  assertScenarioExecutionBudget({
    budget: props.executionBudget,
    configuredScenarioDeadlineMs: props.configuredScenarioDeadlineMs,
    configuredVitestTimeoutMs: props.configuredVitestTimeoutMs,
  });
  const matchingRows = props.registrySnapshot.scenarios.filter((row) => row.scenarioId === props.contract.scenarioId);
  if (matchingRows.length !== 1) {
    throw new Error("registry snapshot must contain exactly one row for the behavior contract");
  }
  const registryRow = matchingRows[0];
  if (registryRow === undefined || registryRow.behaviorContractDigest !== props.contract.behaviorContractDigest) {
    throw new Error("registry snapshot behavior digest does not match the behavior contract");
  }
  if (registryRow.evaluationRole === "retired") {
    throw new Error("retired scenarios cannot execute");
  }
  return registryRow;
}

function reduceInfrastructure(
  repetitions: readonly V3ExecutedRepetition[],
): V3BehavioralScenarioReceipt["reduction"] | null {
  const unverified = repetitions.flatMap((repetition) =>
    validateExactRuntimeProfile(repetition.runtimeProfile, ACPX_LUNA_XHIGH_SUBJECT_PROFILE));
  if (unverified.length > 0) return infrastructureReductionResult("runtime_profile_unverified", unverified);
  const incompleteCleanup = repetitions.filter((repetition) => !repetition.evidence.process.cleanupComplete);
  if (incompleteCleanup.length > 0) {
    return infrastructureReductionResult("incomplete_cleanup", ["one or more subject processes lack complete cleanup evidence"]);
  }
  const processFailures = repetitions.flatMap((repetition) => repetition.evidence.process.outcome === "executed"
    ? []
    : repetition.evidence.process.infrastructureReasons);
  return processFailures.length === 0 ? null : {
    outcome: "infrastructure_error",
    reasonCode: "incomplete_cleanup",
    reasons: processFailures,
  };
}

function validateExactRuntimeProfile(
  receipt: RuntimeProfileReceipt,
  expected: RuntimeProfile,
): readonly string[] {
  const reasons = [...receipt.verification.reasons];
  if (receipt.verification.status !== "verified") reasons.push("runtime profile verification status is not verified");
  if (receipt.requested.provider !== expected.provider) reasons.push("requested provider does not match the required profile");
  if (receipt.requested.model !== expected.requestedModel) reasons.push("requested model does not match the required profile");
  if (receipt.requested.reasoningEffort !== expected.requestedReasoningEffort) reasons.push("requested reasoning effort does not match the required profile");
  if (receipt.acceptedProviderReported.model !== expected.acceptedProviderReportedModel) reasons.push("accepted provider model does not match the required profile");
  if (receipt.acceptedProviderReported.reasoningEffort !== expected.acceptedProviderReportedReasoningEffort) reasons.push("accepted provider effort does not match the required profile");
  if (receipt.providerReported.model !== expected.acceptedProviderReportedModel) reasons.push("provider-reported model does not match the required profile");
  if (receipt.providerReported.reasoningEffort !== expected.acceptedProviderReportedReasoningEffort) reasons.push("provider-reported effort does not match the required profile");
  return [...new Set(reasons)];
}

function digestRepetition(repetition: V3ExecutedRepetition): string {
  return `sha256:${createHash("sha256").update(JSON.stringify(repetition)).digest("hex")}`;
}

function reduceEvidence(props: {
  readonly contract: V3BehaviorContract;
  readonly subjects: V3SubjectExecutionResult;
  readonly objectiveResults: readonly V3ObjectiveRepetitionResult[];
  readonly candidate: NonNullable<ReturnType<typeof parseStructuredSemanticReviewCandidate>["candidate"]>;
}): ScenarioOutcomeReduction {
  const reduceVariant = (repetitions: readonly V3ExecutedRepetition[]) => repetitions.map((repetition) => {
    const objective = props.objectiveResults.find((result) => result.repetitionId === repetition.evidence.repetitionId);
    if (objective === undefined) return { repetitionId: repetition.evidence.repetitionId, outcome: "not_evaluated" as const };
    const classifications = props.candidate.assertions
      .filter((assertion) => assertion.repetitionId === repetition.evidence.repetitionId && assertion.variant === repetition.evidence.variant)
      .map((assertion) => assertion.classification);
    return {
      repetitionId: repetition.evidence.repetitionId,
      outcome: applyObjectiveSemanticPrecedence({ objectiveOutcome: objective.outcome, classifications }),
    };
  });
  return reduceScenarioOutcome({
    comparisonIntent: props.contract.comparisonIntent,
    expectedRepetitions: props.contract.repetitions,
    baseline: reduceVariant(props.subjects.baseline),
    treatment: reduceVariant(props.subjects.treatment),
  });
}

function applyAuthorityFreshness(
  registry: EvaluationRegistryRow,
  reduction: V3BehavioralScenarioReceipt["reduction"],
): V3BehavioralScenarioReceipt["reduction"] {
  if (registry.evaluationRole === "gate" && registry.freshness !== "fresh" && reduction.outcome === "pass") {
    return {
      outcome: "not_evaluated",
      reasonCode: "stale_calibration",
      reasons: ["gate calibration is stale"],
    };
  }
  return reduction;
}

function infrastructureReductionResult(
  reasonCode: "scenario_deadline" | "runtime_profile_unverified" | "incomplete_cleanup" | "comparison_mismatch",
  reasons: readonly string[],
): V3BehavioralScenarioReceipt["reduction"] {
  return { outcome: "infrastructure_error", reasonCode, reasons: [...new Set(reasons)] };
}

async function publishScenarioReceipt(props: {
  readonly props: ExecuteV3BehavioralScenarioProps;
  readonly registryRow: EvaluationRegistryRow;
  readonly receiptDirectory: string;
  readonly attemptReceiptPaths: readonly string[];
  readonly repetitionReceiptPaths: readonly string[];
  readonly progressReceiptPaths: readonly string[];
  readonly persistProgress: (
    status: "running" | "timed_out" | "completed" | "infrastructure_error",
    lastDurableStage: string,
    reasonCode?: string | null,
  ) => Promise<void>;
  readonly subjects: readonly V3ExecutedRepetition[];
  readonly comparisonValidation: V3BehavioralScenarioReceipt["comparisonValidation"];
  readonly objectiveResults: readonly V3ObjectiveRepetitionResult[];
  readonly semanticValidation: SemanticCandidateValidationResult;
  readonly reviewerRuntimeProfile: RuntimeProfileReceipt;
  readonly reduction: V3BehavioralScenarioReceipt["reduction"];
  readonly progressStatus?: "timed_out" | "completed" | "infrastructure_error";
}): Promise<ExecutedV3BehavioralScenario> {
  const progressStatus = props.progressStatus ?? (props.reduction.outcome === "infrastructure_error" ? "infrastructure_error" : "completed");
  await props.persistProgress(progressStatus, "reduction_completed", props.reduction.reasonCode ?? null);
  const receiptWithoutStage = {
    schemaVersion: 3 as const,
    scenarioId: props.props.contract.scenarioId,
    behaviorIdentity: {
      behaviorContractDigest: props.props.contract.behaviorContractDigest,
      behaviorRequirementIds: props.props.contract.behaviorRequirementIds,
    },
    authoritySnapshot: {
      evaluationRole: props.registryRow.evaluationRole,
      freshness: props.registryRow.freshness,
      releaseAuthority: props.registryRow.evaluationRole === "gate" &&
        props.registryRow.freshness === "fresh" && props.reduction.outcome === "pass",
    },
    comparisonValidation: props.comparisonValidation,
    objectiveResults: props.objectiveResults,
    semanticReview: {
      validation: props.semanticValidation,
      runtimeProfile: props.reviewerRuntimeProfile,
    },
    runtimeProfiles: {
      subjects: props.subjects.map((subject) => subject.runtimeProfile),
      reviewer: props.reviewerRuntimeProfile,
    },
    executionBudget: props.props.executionBudget,
    attemptReceiptPaths: props.attemptReceiptPaths,
    repetitionReceiptPaths: props.repetitionReceiptPaths,
    progressReceiptPaths: props.progressReceiptPaths,
    reduction: props.reduction,
  };
  const persisted = await writeJsonReceipt({
    receiptDirectory: props.receiptDirectory,
    fileName: "scenario-receipt.json",
    receipt: { ...receiptWithoutStage, lastDurableStage: "scenario_receipt_published" as const },
    secrets: props.props.redactionSecrets,
  });
  return { receiptPath: persisted.receiptPath, receipt: persisted.receipt };
}
