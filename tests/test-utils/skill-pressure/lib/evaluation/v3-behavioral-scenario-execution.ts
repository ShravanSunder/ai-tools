import { createHash } from "node:crypto";
import path from "node:path";

import type {
  AuthorityReceiptReference,
  EvaluationRegistry,
  EvaluationRegistryRow,
} from "../authority/evaluation-registry.js";
import { calculateEvaluationRegistrySnapshotDigest } from "../authority/evaluation-registry.js";
import type {
  AuthorityDigest,
  CalibrationFreshnessInputs,
  ValidatedCurrentBaselineReceipt,
} from "../authority/authority-receipts.js";
import type { ClaimedRequirementValidation } from "../authority/claimed-requirements.js";
import type { ObjectiveArtifactDeclaration } from "../contracts/objective-check-types.js";
import type { V3BehaviorContract } from "../contracts/v3-behavior-contract.js";
import {
  evaluateObjectiveCheckPlan,
  type ObjectiveCheckResult,
} from "../evidence/objective-artifact-checks.js";
import {
  reduceDeterministicCheckResults,
  type NormalizedRepetitionEvidence,
} from "../evidence/repetition-evidence.js";
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
import type {
  ReviewerCommandType,
  ReviewerLifecycleEvidence,
} from "../review/structured-review-runner.js";
import {
  ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
  ACPX_LUNA_HIGH_SUBJECT_PROFILE,
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
import {
  resolveV3ScenarioAuthority,
  type V3ParentAcceptanceContext,
  type V3ParentAcceptanceRequest,
} from "./v3-scenario-authority.js";

export interface V3ExecutedRepetition {
  readonly evidence: NormalizedRepetitionEvidence;
  readonly runtimeProfile: RuntimeProfileReceipt;
  readonly durableFacts: AttemptDurableFacts;
  readonly comparisonIdentity: V3ComparisonIdentity;
}

type ActiveEvaluationRegistryRow = EvaluationRegistryRow & {
  readonly evaluationRole: "gate" | "diagnostic";
};

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
  readonly lifecycle: ReviewerLifecycleEvidence;
}

export interface V3ReviewerLifecycleReceipt {
  readonly risk: "standard" | "high";
  readonly state: "not_started" | "completed" | "failed";
  readonly lifecycleComplete: boolean;
  readonly failureCommandType: ReviewerCommandType | null;
  readonly namedSessionIdentity: string | null;
  readonly providerSessionIdentity: string | null;
  readonly usageObserved: boolean;
  readonly commandReceipts: readonly {
    readonly commandType: ReviewerCommandType;
    readonly receiptPath: string;
    readonly receiptDigest: string;
  }[];
}

export interface ExecuteV3BehavioralScenarioProps {
  readonly contract: V3BehaviorContract;
  readonly registrySnapshot: EvaluationRegistry;
  readonly authorityContext: {
    readonly freshnessInputs: CalibrationFreshnessInputs;
    readonly calibration: {
      readonly currentBaseline: ValidatedCurrentBaselineReceipt;
      readonly sourceReceipt: AuthorityReceiptReference;
      readonly source: string;
    } | null;
    readonly claimedRequirements: ClaimedRequirementValidation;
    readonly resolveParentAcceptance: (
      request: V3ParentAcceptanceRequest,
    ) => Promise<V3ParentAcceptanceContext | null>;
  };
  readonly executionBudget: DerivedScenarioExecutionBudget;
  readonly executionAccounting: {
    readonly preflightReceipt: { readonly receiptPath: string; readonly receiptDigest: string };
    readonly snapshot: () => {
      readonly modelPrompts: number;
      readonly acpxCommands: number;
      readonly retries: number;
      readonly observedTokens: number;
    };
  };
  readonly configuredScenarioDeadlineMs: number;
  readonly configuredVitestTimeoutMs: number;
  readonly outputDirectory: string;
  readonly redactionSecrets: readonly string[];
  readonly executeSubjects: (
    request: V3SubjectExecutionRequest,
  ) => Promise<V3SubjectExecutionResult>;
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
    readonly comparisonIntent: "improvement" | "non_regression";
    readonly expectedRepetitions: number;
  };
  readonly authoritySnapshot: {
    readonly evaluationRole: "gate" | "diagnostic";
    readonly freshness: EvaluationRegistryRow["freshness"];
    readonly registrySnapshotDigest: string;
    readonly calibrationStatus: "calibrated" | "stale" | "uncalibrated";
    readonly runDigest: string;
    readonly evidenceDigest: string;
    readonly releaseAuthority: boolean;
    readonly reasonCode: string | null;
    readonly parentAcceptanceReceiptDigest: string | null;
    readonly parentAcceptanceSourceReceipt: AuthorityReceiptReference | null;
    readonly calibrationSourceReceipt: AuthorityReceiptReference | null;
    readonly calibrationAuthorityReceiptDigest: string | null;
    readonly calibrationFingerprintDigest: string | null;
    readonly calibrationFreshnessInputs: CalibrationFreshnessInputs | null;
    readonly demotedThisRun: false;
  };
  readonly claimedRequirements: {
    readonly source: ClaimedRequirementValidation["manifest"]["source"];
    readonly claimedRequirementIds: readonly string[];
    readonly manifestDigest: string;
    readonly status: ClaimedRequirementValidation["status"];
    readonly unknownRequirementIds: readonly string[];
    readonly untracedRequirementIds: readonly string[];
  };
  readonly comparisonValidation: {
    readonly valid: boolean;
    readonly reasons: readonly string[];
  };
  readonly objectiveResults: readonly V3ObjectiveRepetitionResult[];
  readonly semanticReview: {
    readonly validation: SemanticCandidateValidationResult;
    readonly runtimeProfile: RuntimeProfileReceipt | null;
    readonly candidate: unknown | null;
  };
  readonly reviewerLifecycle: V3ReviewerLifecycleReceipt;
  readonly runtimeProfiles: {
    readonly subjects: readonly RuntimeProfileReceipt[];
    readonly reviewer: RuntimeProfileReceipt;
  };
  readonly subjects: readonly V3ExecutedRepetition[];
  readonly executionBudget: DerivedScenarioExecutionBudget;
  readonly executionAccounting: {
    readonly preflightReceipt: { readonly receiptPath: string; readonly receiptDigest: string };
    readonly observed: {
      readonly modelPrompts: number;
      readonly acpxCommands: number;
      readonly retries: number;
      readonly observedTokens: number;
    };
  };
  readonly attemptReceipts: readonly {
    readonly receiptPath: string;
    readonly receiptDigest: string;
  }[];
  readonly repetitionReceipts: readonly {
    readonly receiptPath: string;
    readonly receiptDigest: string;
  }[];
  readonly progressReceipts: readonly {
    readonly receiptPath: string;
    readonly receiptDigest: string;
  }[];
  readonly reduction:
    | ScenarioOutcomeReduction
    | {
        readonly outcome: "infrastructure_error" | "not_evaluated";
        readonly reasonCode:
          | "scenario_deadline"
          | "runtime_profile_unverified"
          | "incomplete_cleanup"
          | "comparison_mismatch"
          | "review_parse_failure"
          | "stale_calibration";
        readonly reasons: readonly string[];
      };
  readonly lastDurableStage: "scenario_receipt_published";
}

export interface ExecutedV3BehavioralScenario {
  readonly receiptPath: string;
  readonly receiptDigest: string;
  readonly receipt: V3BehavioralScenarioReceipt;
}

export async function executeV3BehavioralScenario(
  props: ExecuteV3BehavioralScenarioProps,
): Promise<ExecutedV3BehavioralScenario> {
  const registryRow = assertIntegrationInputs(props);
  const objectiveCheckPlan = createObjectiveCheckPlanFromContract(props.contract);
  const receiptDirectory = path.resolve(props.outputDirectory, "receipts");
  const attemptReceiptPaths: string[] = [];
  const attemptReceipts: Array<{ readonly receiptPath: string; readonly receiptDigest: string }> =
    [];
  const attemptBindings = new Map<
    string,
    { readonly repetitionDigest: string; readonly receiptDigest: string }
  >();
  const repetitionReceiptPaths: string[] = [];
  const repetitionReceipts: Array<{
    readonly receiptPath: string;
    readonly receiptDigest: string;
  }> = [];
  const progressReceiptPaths: string[] = [];
  const progressReceipts: Array<{ readonly receiptPath: string; readonly receiptDigest: string }> =
    [];
  let progressSequence = 0;
  const abortController = new AbortController();
  const deadlineTimer = setTimeout(
    () => abortController.abort("scenario_deadline"),
    props.configuredScenarioDeadlineMs,
  );

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
        completedAttemptReceiptPaths: [...attemptReceiptPaths].sort((left, right) => left.localeCompare(right)),
        reasonCode,
      }),
      secrets: props.redactionSecrets,
    });
    progressReceiptPaths.push(persisted.receiptPath);
    progressReceipts.push({
      receiptPath: persisted.receiptPath,
      receiptDigest: persisted.receiptDigest,
    });
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
          receipt: { scenarioId: props.contract.scenarioId, ...attempt },
          secrets: props.redactionSecrets,
        });
        attemptReceiptPaths.push(persisted.receiptPath);
        attemptReceipts.push({
          receiptPath: persisted.receiptPath,
          receiptDigest: persisted.receiptDigest,
        });
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
        repetitionReceipts.push({
          receiptPath: persisted.receiptPath,
          receiptDigest: persisted.receiptDigest,
        });
        await persistProgress("running", "repetition_receipt_published");
        return persisted.receiptPath;
      },
    });
    if (abortController.signal.aborted)
      throw new Error("scenario deadline elapsed after subject execution");

    const repetitions = [...subjects.baseline, ...subjects.treatment];
    const comparisonValidation = validateV3ComparisonSet({
      contract: props.contract,
      subjects,
      attemptReceiptPaths: [...attemptReceiptPaths].sort((left, right) => left.localeCompare(right)),
      repetitionReceiptPaths: [...repetitionReceiptPaths].sort((left, right) => left.localeCompare(right)),
    });
    if (!comparisonValidation.valid) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceipts,
        repetitionReceipts,
        progressReceipts,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults: [],
        semanticValidation: {
          valid: false,
          reason: "semantic review skipped after comparison validation failure",
        },
        reviewerRuntimeProfile: VERIFIED_ABSENT_REVIEW_PROFILE,
        reviewerLifecycle: createNotStartedReviewerLifecycleReceipt(props.contract.risk),
        reduction: infrastructureReductionResult(
          "comparison_mismatch",
          comparisonValidation.reasons,
        ),
      });
    }
    const infrastructureReduction = reduceInfrastructure(repetitions);
    if (infrastructureReduction !== null) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceipts,
        repetitionReceipts,
        progressReceipts,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults: [],
        semanticValidation: {
          valid: false,
          reason: "semantic review skipped after infrastructure failure",
        },
        reviewerRuntimeProfile: VERIFIED_ABSENT_REVIEW_PROFILE,
        reviewerLifecycle: createNotStartedReviewerLifecycleReceipt(props.contract.risk),
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
    let review: V3SemanticReviewExecutionResult;
    try {
      review = await props.executeSemanticReview({ packet, signal: abortController.signal });
    } catch {
      review = {
        visibleResponse: "",
        runtimeProfile: VERIFIED_ABSENT_REVIEW_PROFILE,
        lifecycle: createNotStartedReviewerLifecycleEvidence(props.contract.risk),
      };
    }
    const reviewerLifecycle = await persistReviewerLifecycle({
      receiptDirectory,
      scenarioId: props.contract.scenarioId,
      lifecycle: review.lifecycle,
      secrets: props.redactionSecrets,
    });
    if (abortController.signal.aborted) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceipts,
        repetitionReceipts,
        progressReceipts,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults,
        semanticValidation: {
          valid: false,
          reason: "scenario deadline elapsed before semantic review completed",
        },
        reviewerRuntimeProfile: review.runtimeProfile,
        reviewerLifecycle,
        reduction: infrastructureReductionResult("scenario_deadline", [
          "scenario deadline elapsed after semantic review",
        ]),
        progressStatus: "timed_out",
      });
    }
    const reviewerLifecycleReduction = reduceReviewerLifecycle(review.lifecycle);
    if (reviewerLifecycleReduction !== null) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceipts,
        repetitionReceipts,
        progressReceipts,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults,
        semanticValidation: {
          valid: false,
          reason: "reviewer lifecycle evidence is incomplete",
        },
        reviewerRuntimeProfile: review.runtimeProfile,
        reviewerLifecycle,
        reduction: reviewerLifecycleReduction,
      });
    }
    const expectedReviewerProfile =
      props.contract.risk === "high"
        ? ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE
        : ACPX_LUNA_HIGH_SUBJECT_PROFILE;
    const reviewProfileReasons = validateExactRuntimeProfile(
      review.runtimeProfile,
      expectedReviewerProfile,
    );
    if (reviewProfileReasons.length > 0) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceipts,
        repetitionReceipts,
        progressReceipts,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults,
        semanticValidation: { valid: false, reason: "review runtime profile was not verified" },
        reviewerRuntimeProfile: review.runtimeProfile,
        reviewerLifecycle,
        reduction: infrastructureReductionResult(
          "runtime_profile_unverified",
          reviewProfileReasons,
        ),
      });
    }
    const parsed = parseStructuredSemanticReviewCandidate(review.visibleResponse);
    if (parsed.candidate === null) {
      return publishScenarioReceipt({
        props,
        registryRow,
        receiptDirectory,
        attemptReceipts,
        repetitionReceipts,
        progressReceipts,
        persistProgress,
        subjects: repetitions,
        comparisonValidation,
        objectiveResults,
        semanticValidation: { valid: false, reason: parsed.parseError },
        reviewerRuntimeProfile: review.runtimeProfile,
        reviewerLifecycle,
        reduction: {
          outcome: "not_evaluated",
          reasonCode: "review_parse_failure",
          reasons: [parsed.parseError ?? "semantic review response could not be parsed"],
        },
      });
    }
    const semanticValidation = validateStructuredSemanticReviewCandidate({
      packet,
      candidate: parsed.candidate,
    });
    const reduction = semanticValidation.valid
      ? reduceEvidence({
          contract: props.contract,
          subjects,
          objectiveResults,
          candidate: parsed.candidate,
        })
      : {
          outcome: "not_evaluated" as const,
          reasonCode: "review_parse_failure" as const,
          reasons: [semanticValidation.reason ?? "semantic review candidate failed validation"],
        };
    const authorityReduction = applyAuthorityFreshness(
      registryRow,
      props.authorityContext.calibration?.currentBaseline ?? null,
      reduction,
    );
    return publishScenarioReceipt({
      props,
      registryRow,
      receiptDirectory,
      attemptReceipts,
      repetitionReceipts,
      progressReceipts,
      persistProgress,
      subjects: repetitions,
      comparisonValidation,
      objectiveResults,
      semanticValidation,
      semanticCandidate: parsed.candidate,
      reviewerRuntimeProfile: review.runtimeProfile,
      reviewerLifecycle,
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
      attemptReceipts,
      repetitionReceipts,
      progressReceipts,
      persistProgress,
      subjects: [],
      comparisonValidation: {
        valid: false,
        reasons: ["scenario deadline elapsed before comparison validation"],
      },
      objectiveResults: [],
      semanticValidation: {
        valid: false,
        reason: "scenario deadline elapsed before semantic review",
      },
      reviewerRuntimeProfile: VERIFIED_ABSENT_REVIEW_PROFILE,
      reviewerLifecycle: createNotStartedReviewerLifecycleReceipt(props.contract.risk),
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

function createNotStartedReviewerLifecycleEvidence(
  risk: ReviewerLifecycleEvidence["risk"],
): ReviewerLifecycleEvidence {
  return {
    risk,
    state: "not_started",
    lifecycleComplete: false,
    failureCommandType: null,
    namedSessionIdentity: null,
    providerSessionIdentity: null,
    usageObserved: false,
    commandReceipts: [],
  };
}

function createNotStartedReviewerLifecycleReceipt(
  risk: V3ReviewerLifecycleReceipt["risk"],
): V3ReviewerLifecycleReceipt {
  return {
    risk,
    state: "not_started",
    lifecycleComplete: false,
    failureCommandType: null,
    namedSessionIdentity: null,
    providerSessionIdentity: null,
    usageObserved: false,
    commandReceipts: [],
  };
}

async function persistReviewerLifecycle(props: {
  readonly receiptDirectory: string;
  readonly scenarioId: string;
  readonly lifecycle: ReviewerLifecycleEvidence;
  readonly secrets: readonly string[];
}): Promise<V3ReviewerLifecycleReceipt> {
  const commandReceipts: V3ReviewerLifecycleReceipt["commandReceipts"][number][] = [];
  for (const command of props.lifecycle.commandReceipts) {
    const persisted = await writeJsonReceipt({
      receiptDirectory: props.receiptDirectory,
      fileName: reviewerCommandReceiptFileName(command.commandType),
      receipt: {
        schemaVersion: 1,
        scenarioId: props.scenarioId,
        risk: props.lifecycle.risk,
        namedSessionIdentity: props.lifecycle.namedSessionIdentity,
        providerSessionIdentity: props.lifecycle.providerSessionIdentity,
        command,
      },
      secrets: props.secrets,
    });
    commandReceipts.push({
      commandType: command.commandType,
      receiptPath: persisted.receiptPath,
      receiptDigest: persisted.receiptDigest,
    });
  }
  return {
    risk: props.lifecycle.risk,
    state: props.lifecycle.state,
    lifecycleComplete: props.lifecycle.lifecycleComplete,
    failureCommandType: props.lifecycle.failureCommandType,
    namedSessionIdentity: props.lifecycle.namedSessionIdentity,
    providerSessionIdentity: props.lifecycle.providerSessionIdentity,
    usageObserved: props.lifecycle.usageObserved,
    commandReceipts,
  };
}

function reviewerCommandReceiptFileName(commandType: ReviewerCommandType): string {
  const fileNames = {
    reviewer_session_create: "reviewer-session-create.json",
    reviewer_effort_config: "reviewer-effort-config.json",
    reviewer_prompt: "reviewer-prompt.json",
    reviewer_close: "reviewer-close.json",
  } as const satisfies Record<ReviewerCommandType, string>;
  return fileNames[commandType];
}

function assertIntegrationInputs(
  props: ExecuteV3BehavioralScenarioProps,
): ActiveEvaluationRegistryRow {
  assertScenarioExecutionBudget({
    budget: props.executionBudget,
    configuredScenarioDeadlineMs: props.configuredScenarioDeadlineMs,
    configuredVitestTimeoutMs: props.configuredVitestTimeoutMs,
  });
  const matchingRows = props.registrySnapshot.scenarios.filter(
    (row) => row.scenarioId === props.contract.scenarioId,
  );
  if (matchingRows.length !== 1) {
    throw new Error("registry snapshot must contain exactly one row for the behavior contract");
  }
  const registryRow = matchingRows[0];
  if (
    registryRow === undefined ||
    registryRow.behaviorContractDigest !== props.contract.behaviorContractDigest
  ) {
    throw new Error("registry snapshot behavior digest does not match the behavior contract");
  }
  if (registryRow.evaluationRole === "retired") {
    throw new Error("retired scenarios cannot execute");
  }
  if (registryRow.evaluationRole === "gate") {
    const calibrationContext = props.authorityContext.calibration;
    if (registryRow.calibrationReceipt === null || calibrationContext === null) {
      throw new Error("gate execution requires the registry calibration receipt context");
    }
    if (
      registryRow.calibrationReceipt.receiptPath !== calibrationContext.sourceReceipt.receiptPath ||
      registryRow.calibrationReceipt.receiptDigest !==
        calibrationContext.sourceReceipt.receiptDigest
    ) {
      throw new Error(
        "calibration context does not match the registry calibration receipt reference",
      );
    }
    const actualCalibrationSourceDigest = `sha256:${createHash("sha256")
      .update(calibrationContext.source)
      .digest("hex")}`;
    if (actualCalibrationSourceDigest !== calibrationContext.sourceReceipt.receiptDigest) {
      throw new Error("calibration source receipt digest does not match its content");
    }
    let parsedCalibrationSource: unknown;
    try {
      parsedCalibrationSource = JSON.parse(calibrationContext.source);
    } catch {
      throw new Error("calibration source receipt is not valid JSON");
    }
    if (
      JSON.stringify(parsedCalibrationSource) !==
      JSON.stringify(calibrationContext.currentBaseline.receipt)
    ) {
      throw new Error("calibration source receipt does not match the validated current baseline");
    }
  } else if (props.authorityContext.calibration !== null) {
    throw new Error("diagnostic execution cannot receive gate calibration authority");
  }
  return registryRow as ActiveEvaluationRegistryRow;
}

function reduceInfrastructure(
  repetitions: readonly V3ExecutedRepetition[],
): V3BehavioralScenarioReceipt["reduction"] | null {
  const unverified = repetitions.flatMap((repetition) =>
    validateExactRuntimeProfile(repetition.runtimeProfile, ACPX_LUNA_HIGH_SUBJECT_PROFILE),
  );
  if (unverified.length > 0)
    return infrastructureReductionResult("runtime_profile_unverified", unverified);
  const incompleteCleanup = repetitions.filter(
    (repetition) => !repetition.evidence.process.cleanupComplete,
  );
  if (incompleteCleanup.length > 0) {
    return infrastructureReductionResult("incomplete_cleanup", [
      "one or more subject processes lack complete cleanup evidence",
    ]);
  }
  const processFailures = repetitions.flatMap((repetition) =>
    repetition.evidence.process.outcome === "executed"
      ? []
      : repetition.evidence.process.infrastructureReasons,
  );
  return processFailures.length === 0
    ? null
    : {
        outcome: "infrastructure_error",
        reasonCode: "incomplete_cleanup",
        reasons: processFailures,
      };
}

function reduceReviewerLifecycle(
  lifecycle: ReviewerLifecycleEvidence,
): V3BehavioralScenarioReceipt["reduction"] | null {
  if (lifecycle.state === "completed" && lifecycle.lifecycleComplete && lifecycle.usageObserved)
    return null;
  return infrastructureReductionResult("incomplete_cleanup", [
    "semantic reviewer lifecycle evidence is incomplete",
  ]);
}

function validateExactRuntimeProfile(
  receipt: RuntimeProfileReceipt,
  expected: RuntimeProfile,
): readonly string[] {
  const reasons = [...receipt.verification.reasons];
  if (receipt.verification.status !== "verified")
    reasons.push("runtime profile verification status is not verified");
  if (receipt.requested.provider !== expected.provider)
    reasons.push("requested provider does not match the required profile");
  if (receipt.requested.model !== expected.requestedModel)
    reasons.push("requested model does not match the required profile");
  if (receipt.requested.reasoningEffort !== expected.requestedReasoningEffort)
    reasons.push("requested reasoning effort does not match the required profile");
  if (receipt.acceptedProviderReported.model !== expected.acceptedProviderReportedModel)
    reasons.push("accepted provider model does not match the required profile");
  if (
    receipt.acceptedProviderReported.reasoningEffort !==
    expected.acceptedProviderReportedReasoningEffort
  )
    reasons.push("accepted provider effort does not match the required profile");
  if (receipt.providerReported.model !== expected.acceptedProviderReportedModel)
    reasons.push("provider-reported model does not match the required profile");
  if (receipt.providerReported.reasoningEffort !== expected.acceptedProviderReportedReasoningEffort)
    reasons.push("provider-reported effort does not match the required profile");
  return [...new Set(reasons)];
}

function digestRepetition(repetition: V3ExecutedRepetition): string {
  return `sha256:${createHash("sha256").update(JSON.stringify(repetition)).digest("hex")}`;
}

function reduceEvidence(props: {
  readonly contract: V3BehaviorContract;
  readonly subjects: V3SubjectExecutionResult;
  readonly objectiveResults: readonly V3ObjectiveRepetitionResult[];
  readonly candidate: NonNullable<
    ReturnType<typeof parseStructuredSemanticReviewCandidate>["candidate"]
  >;
}): ScenarioOutcomeReduction {
  const reduceVariant = (repetitions: readonly V3ExecutedRepetition[]) =>
    repetitions.map((repetition) => {
      const objective = props.objectiveResults.find(
        (result) => result.repetitionId === repetition.evidence.repetitionId,
      );
      if (objective === undefined)
        return {
          repetitionId: repetition.evidence.repetitionId,
          outcome: "not_evaluated" as const,
        };
      const classifications = props.candidate.assertions
        .filter(
          (assertion) =>
            assertion.repetitionId === repetition.evidence.repetitionId &&
            assertion.variant === repetition.evidence.variant,
        )
        .map((assertion) => assertion.classification);
      return {
        repetitionId: repetition.evidence.repetitionId,
        outcome: applyObjectiveSemanticPrecedence({
          objectiveOutcome: objective.outcome,
          classifications,
        }),
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
  calibration: ValidatedCurrentBaselineReceipt | null,
  reduction: V3BehavioralScenarioReceipt["reduction"],
): V3BehavioralScenarioReceipt["reduction"] {
  if (
    registry.evaluationRole === "gate" &&
    (registry.freshness !== "fresh" ||
      calibration === null ||
      calibration.freshness.status !== "fresh") &&
    reduction.outcome === "pass"
  ) {
    return {
      outcome: "not_evaluated",
      reasonCode: "stale_calibration",
      reasons: ["gate calibration is stale"],
    };
  }
  return reduction;
}

function infrastructureReductionResult(
  reasonCode:
    | "scenario_deadline"
    | "runtime_profile_unverified"
    | "incomplete_cleanup"
    | "comparison_mismatch",
  reasons: readonly string[],
): V3BehavioralScenarioReceipt["reduction"] {
  return { outcome: "infrastructure_error", reasonCode, reasons: [...new Set(reasons)] };
}

async function publishScenarioReceipt(props: {
  readonly props: ExecuteV3BehavioralScenarioProps;
  readonly registryRow: ActiveEvaluationRegistryRow;
  readonly receiptDirectory: string;
  readonly attemptReceipts: readonly {
    readonly receiptPath: string;
    readonly receiptDigest: string;
  }[];
  readonly repetitionReceipts: readonly {
    readonly receiptPath: string;
    readonly receiptDigest: string;
  }[];
  readonly progressReceipts: readonly {
    readonly receiptPath: string;
    readonly receiptDigest: string;
  }[];
  readonly persistProgress: (
    status: "running" | "timed_out" | "completed" | "infrastructure_error",
    lastDurableStage: string,
    reasonCode?: string | null,
  ) => Promise<void>;
  readonly subjects: readonly V3ExecutedRepetition[];
  readonly comparisonValidation: V3BehavioralScenarioReceipt["comparisonValidation"];
  readonly objectiveResults: readonly V3ObjectiveRepetitionResult[];
  readonly semanticValidation: SemanticCandidateValidationResult;
  readonly semanticCandidate?: unknown | null;
  readonly reviewerRuntimeProfile: RuntimeProfileReceipt;
  readonly reviewerLifecycle: V3ReviewerLifecycleReceipt;
  readonly reduction: V3BehavioralScenarioReceipt["reduction"];
  readonly progressStatus?: "timed_out" | "completed" | "infrastructure_error";
}): Promise<ExecutedV3BehavioralScenario> {
  const progressStatus =
    props.progressStatus ??
    (props.reduction.outcome === "infrastructure_error" ? "infrastructure_error" : "completed");
  await props.persistProgress(
    progressStatus,
    "reduction_completed",
    props.reduction.reasonCode ?? null,
  );
  const attemptReceipts = sortReceiptReferences(props.attemptReceipts);
  const repetitionReceipts = sortReceiptReferences(props.repetitionReceipts);
  const progressReceipts = sortReceiptReferences(props.progressReceipts);
  const registrySnapshotDigest = calculateEvaluationRegistrySnapshotDigest(
    props.props.registrySnapshot,
  );
  const executionAccounting = {
    preflightReceipt: props.props.executionAccounting.preflightReceipt,
    observed: props.props.executionAccounting.snapshot(),
  };
  const evidenceDigest = calculateV3ScenarioEvidenceDigest({
    registrySnapshotDigest,
    comparisonValidation: props.comparisonValidation,
    objectiveResults: props.objectiveResults,
    semanticValidation: props.semanticValidation,
    semanticCandidate: props.semanticCandidate ?? null,
    subjects: props.subjects,
    reviewerRuntimeProfile: props.reviewerRuntimeProfile,
    reviewerLifecycle: props.reviewerLifecycle,
    attemptReceipts,
    repetitionReceipts,
    progressReceipts,
    executionBudget: props.props.executionBudget,
    executionAccounting,
    reduction: props.reduction,
  });
  const authority = await resolveV3ScenarioAuthority({
    candidate: {
      scenarioId: props.props.contract.scenarioId,
      behaviorContractDigest: props.props.contract.behaviorContractDigest as AuthorityDigest,
      behaviorRequirementIds: props.props.contract.behaviorRequirementIds,
      evaluationRole: props.registryRow.evaluationRole,
      outcome: props.reduction.outcome,
      comparisonIntent: props.props.contract.comparisonIntent,
      evidenceDigest,
    },
    calibration: props.props.authorityContext.calibration?.currentBaseline ?? null,
    claimedRequirements: props.props.authorityContext.claimedRequirements,
    resolveParentAcceptance: props.props.authorityContext.resolveParentAcceptance,
  });
  const claimedRequirements = props.props.authorityContext.claimedRequirements;
  const receiptWithoutStage = {
    schemaVersion: 3 as const,
    scenarioId: props.props.contract.scenarioId,
    behaviorIdentity: {
      behaviorContractDigest: props.props.contract.behaviorContractDigest,
      behaviorRequirementIds: props.props.contract.behaviorRequirementIds,
      comparisonIntent: props.props.contract.comparisonIntent,
      expectedRepetitions: props.props.contract.repetitions,
    },
    authoritySnapshot: {
      evaluationRole: props.registryRow.evaluationRole,
      freshness: props.registryRow.freshness,
      registrySnapshotDigest,
      calibrationStatus:
        props.props.authorityContext.calibration === null
          ? ("uncalibrated" as const)
          : props.props.authorityContext.calibration.currentBaseline.freshness.status === "fresh" &&
              props.registryRow.freshness === "fresh"
            ? ("calibrated" as const)
            : ("stale" as const),
      runDigest: authority.runDigest,
      evidenceDigest,
      releaseAuthority: authority.releaseAuthority,
      reasonCode: authority.reasonCode,
      parentAcceptanceReceiptDigest: authority.parentAcceptanceReceiptDigest,
      parentAcceptanceSourceReceipt: authority.parentAcceptanceSourceReceipt,
      calibrationSourceReceipt: props.props.authorityContext.calibration?.sourceReceipt ?? null,
      calibrationAuthorityReceiptDigest:
        props.props.authorityContext.calibration?.currentBaseline.authorityReceiptDigest ?? null,
      calibrationFingerprintDigest:
        props.props.authorityContext.calibration?.currentBaseline.calibrationFingerprint.digest ?? null,
      calibrationFreshnessInputs: props.props.authorityContext.freshnessInputs,
      demotedThisRun: false as const,
    },
    claimedRequirements: {
      source: claimedRequirements.manifest.source,
      claimedRequirementIds: claimedRequirements.manifest.claimedRequirementIds,
      manifestDigest: claimedRequirements.manifestDigest,
      status: claimedRequirements.status,
      unknownRequirementIds: claimedRequirements.unknownRequirementIds,
      untracedRequirementIds: claimedRequirements.untracedRequirementIds,
    },
    comparisonValidation: props.comparisonValidation,
    objectiveResults: props.objectiveResults,
    semanticReview: {
      validation: props.semanticValidation,
      runtimeProfile: props.reviewerRuntimeProfile,
      candidate: props.semanticCandidate ?? null,
    },
    reviewerLifecycle: props.reviewerLifecycle,
    runtimeProfiles: {
      subjects: props.subjects.map((subject) => subject.runtimeProfile),
      reviewer: props.reviewerRuntimeProfile,
    },
    subjects: props.subjects,
    executionBudget: props.props.executionBudget,
    executionAccounting,
    attemptReceipts,
    repetitionReceipts,
    progressReceipts,
    reduction: props.reduction,
  };
  const persisted = await writeJsonReceipt({
    receiptDirectory: props.receiptDirectory,
    fileName: "scenario-receipt.json",
    receipt: { ...receiptWithoutStage, lastDurableStage: "scenario_receipt_published" as const },
    secrets: props.props.redactionSecrets,
  });
  return {
    receiptPath: persisted.receiptPath,
    receiptDigest: persisted.receiptDigest,
    receipt: persisted.receipt,
  };
}

function sortReceiptReferences<TReference extends {
  readonly receiptPath: string;
  readonly receiptDigest: string;
}>(references: readonly TReference[]): readonly TReference[] {
  return [...references].sort((left, right) => left.receiptPath.localeCompare(right.receiptPath));
}

export function calculateV3ScenarioEvidenceDigest(props: {
  readonly registrySnapshotDigest: string;
  readonly comparisonValidation: V3BehavioralScenarioReceipt["comparisonValidation"];
  readonly objectiveResults: V3BehavioralScenarioReceipt["objectiveResults"];
  readonly semanticValidation: V3BehavioralScenarioReceipt["semanticReview"]["validation"];
  readonly semanticCandidate: unknown;
  readonly subjects: readonly V3ExecutedRepetition[];
  readonly reviewerRuntimeProfile: RuntimeProfileReceipt;
  readonly reviewerLifecycle: V3ReviewerLifecycleReceipt;
  readonly attemptReceipts: V3BehavioralScenarioReceipt["attemptReceipts"];
  readonly repetitionReceipts: V3BehavioralScenarioReceipt["repetitionReceipts"];
  readonly progressReceipts: V3BehavioralScenarioReceipt["progressReceipts"];
  readonly executionBudget: V3BehavioralScenarioReceipt["executionBudget"];
  readonly executionAccounting: V3BehavioralScenarioReceipt["executionAccounting"];
  readonly reduction: V3BehavioralScenarioReceipt["reduction"];
}): AuthorityDigest {
  return `sha256:${createHash("sha256")
    .update(
      JSON.stringify({
        registrySnapshotDigest: props.registrySnapshotDigest,
        comparisonValidation: props.comparisonValidation,
        objectiveResults: props.objectiveResults,
        semanticValidation: props.semanticValidation,
        semanticCandidate: props.semanticCandidate,
        subjects: props.subjects,
        reviewerRuntimeProfile: props.reviewerRuntimeProfile,
        reviewerLifecycle: props.reviewerLifecycle ?? null,
        attemptReceipts: props.attemptReceipts,
        repetitionReceipts: props.repetitionReceipts,
        progressReceipts: props.progressReceipts,
        executionBudget: props.executionBudget,
        executionAccounting: props.executionAccounting,
        reduction: props.reduction,
      }),
    )
    .digest("hex")}`;
}
