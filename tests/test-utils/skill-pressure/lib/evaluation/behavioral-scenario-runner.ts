import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadScenarioContract } from "../contracts/skill-contracts.js";
import { type DeterministicCheckResult, normalizeRepetitionEvidence } from "../evidence/repetition-evidence.js";
import {
  evaluateDeterministicChecks,
  reduceDeterministicCheckResults,
} from "../evidence/repetition-evidence.js";
import type { ComparisonIntent } from "../contracts/contract-types.js";
import type { ReductionRepetition, ScenarioOutcomeReduction } from "../reduction/outcome-reducer.js";
import { reduceScenarioOutcome } from "../reduction/outcome-reducer.js";
import { executeAutomatedBlindReview, type AutomatedBlindReviewReceipt } from "../review/acpx-blind-review-runner.js";
import { applyDeterministicReviewPrecedence, type ReviewRepetitionCandidate } from "../review/review-packet.js";
import {
  collectSensitiveEnvironmentValues,
  resolveAcpxLauncher,
  resolveExecutablePath,
  resolveRuntimeExecutableIdentity,
} from "../runtime/acpx-command-executor.js";
import type { AcpxPermissionMode } from "../runtime/acpx-subject-profile.js";
import { discoverAmbientSkillPaths } from "../runtime/ambient-skill-discovery.js";
import {
  runScenarioRepetitions,
  selectBaselineSkillSource,
  type ScenarioRepetitionSetReceipt,
} from "./repetition-coordinator.js";

export interface ExecuteBehavioralScenarioProps {
  readonly scenarioPath: string;
  readonly skillDirectory: string;
  readonly outputDirectory: string;
  readonly timeoutSeconds: number;
  readonly infrastructureRetries: number;
  readonly additionalDisabledSkillPaths?: readonly string[];
}

export interface DeterministicRepetitionEvaluation {
  readonly repetitionId: string;
  readonly checkResults: readonly DeterministicCheckResult[];
  readonly outcome: "pass" | "behavior_fail" | "not_evaluated";
  readonly infrastructureError?: string;
  readonly infrastructureReasonCode?: "runtime_profile_unverified";
}

export interface BehavioralScenarioReceipt {
  readonly schemaVersion: 2;
  readonly scenario: {
    readonly scenarioId: string;
    readonly contractDigest: string;
    readonly hiddenRubricDigest: string;
    readonly comparisonIntent: "improvement" | "non_regression";
    readonly baselineRevision: string | null;
    readonly risk: "standard" | "high";
  };
  readonly result: ScenarioRepetitionSetReceipt;
  readonly deterministicEvaluation: {
    readonly baseline: readonly DeterministicRepetitionEvaluation[];
    readonly treatment: readonly DeterministicRepetitionEvaluation[];
  };
  readonly automatedReview: AutomatedBlindReviewReceipt;
  readonly reduction: ScenarioOutcomeReduction;
}

export interface ExecutedBehavioralScenario {
  readonly scenarioPrompt: string;
  readonly receiptPath: string;
  readonly receipt: BehavioralScenarioReceipt;
}

export async function executeBehavioralScenario(
  props: ExecuteBehavioralScenarioProps,
): Promise<ExecutedBehavioralScenario> {
  validateProps(props);
  const scenario = await loadScenarioContract({ scenarioPath: path.resolve(props.scenarioPath) });
  const repositoryRoot = path.resolve(props.skillDirectory, "../../../..");
  const skillRelativePath = path.relative(repositoryRoot, path.resolve(props.skillDirectory)).split(path.sep).join("/");
  const outputDirectory = path.resolve(props.outputDirectory);
  await mkdir(outputDirectory, { recursive: true });
  const launcher = await resolveAcpxLauncher();
  const codexExecutable = await resolveExecutablePath("codex");
  const runtimeIdentity = await resolveRuntimeExecutableIdentity(launcher, codexExecutable);
  const discoveredAmbientSkillPaths = await discoverAmbientSkillPaths({
    codexHome: process.env.CODEX_HOME ?? path.join(process.env.HOME ?? "", ".codex"),
  });
  const disabledAmbientSkillPaths = [...new Set([
    ...discoveredAmbientSkillPaths,
    ...(props.additionalDisabledSkillPaths ?? []).map((skillPath) => path.resolve(skillPath)),
  ])].sort();
  const subjectExecutionPolicy = resolveSubjectExecutionPolicy({
    allowedTools: scenario.allowedTools,
    allowedWritePaths: scenario.allowedWritePaths,
  });
  const result = await runScenarioRepetitions({
    repetitions: scenario.repetitions,
    infrastructureRetries: props.infrastructureRetries,
    baselineSource: selectBaselineSkillSource({
      baseline: scenario.baseline,
      baselineRevision: scenario.baselineRevision,
      repositoryRoot,
      skillRelativePath,
    }),
    treatmentSource: { mode: "current", directory: path.resolve(props.skillDirectory) },
    repetitionProps: {
      runRoot: path.join(outputDirectory, "repositories"),
      scenarioId: scenario.scenarioId,
      prompt: scenario.prompt,
      fixtureFiles: [],
      expectedArtifacts: scenario.expectedArtifacts,
      allowedTools: subjectExecutionPolicy.allowedTools,
      allowedWritePaths: subjectExecutionPolicy.allowedWritePaths,
      skillName: scenario.skill,
      launcher,
      codexExecutable,
      runtimeIdentity,
      model: "gpt-5.6-luna",
      reasoningEffort: "xhigh",
      permissionMode: subjectExecutionPolicy.permissionMode,
      disabledAmbientSkillPaths,
      timeoutSeconds: props.timeoutSeconds,
      redactionSecrets: collectSensitiveEnvironmentValues(),
    },
  });
  const deterministicBaseline = result.baseline.map((receipt) => evaluateReceipt(receipt, scenario.deterministicChecks));
  const deterministicTreatment = result.treatment.map((receipt) => evaluateReceipt(receipt, scenario.deterministicChecks));
  const automatedReview = await executeAutomatedBlindReview({
    reviewRoot: path.join(outputDirectory, "blind-review-workspaces"),
    scenario: { scenarioId: scenario.scenarioId, hiddenRubric: scenario.hiddenRubric, risk: scenario.risk },
    deterministicFacts: [
      ...createDeterministicFacts("baseline", deterministicBaseline),
      ...createDeterministicFacts("treatment", deterministicTreatment),
    ],
    baselineEvidence: result.baseline.map((receipt) => normalizeRepetitionEvidence({ receipt })),
    treatmentEvidence: result.treatment.map((receipt) => normalizeRepetitionEvidence({ receipt })),
    sourceFingerprint: createSourceFingerprint(result),
    runtimeFingerprint: createRuntimeFingerprint(result),
    launcher,
    codexExecutable,
    timeoutSeconds: props.timeoutSeconds,
    subjectSessionIds: [...result.baseline, ...result.treatment]
      .map((receipt) => receipt.transcript.sessionId)
      .filter((sessionId): sessionId is string => sessionId !== null),
    redactionSecrets: collectSensitiveEnvironmentValues(),
  });
  const reduction = reduceWithBlindReview({
    comparisonIntent: scenario.comparisonIntent,
    expectedRepetitions: scenario.repetitions,
    baseline: deterministicBaseline,
    treatment: deterministicTreatment,
    automatedReview,
  });
  const receipt: BehavioralScenarioReceipt = {
    schemaVersion: 2,
    scenario: {
      scenarioId: scenario.scenarioId,
      contractDigest: scenario.contractDigest,
      hiddenRubricDigest: digest(scenario.hiddenRubric),
      comparisonIntent: scenario.comparisonIntent,
      baselineRevision: scenario.baselineRevision,
      risk: scenario.risk,
    },
    result,
    deterministicEvaluation: {
      baseline: deterministicBaseline,
      treatment: deterministicTreatment,
    },
    automatedReview,
    reduction,
  };
  const receiptPath = path.join(outputDirectory, "repetition-set-receipt.json");
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
  return { scenarioPrompt: scenario.prompt, receiptPath, receipt };
}

function createDeterministicFacts(
  variant: "baseline" | "treatment",
  evaluations: readonly DeterministicRepetitionEvaluation[],
) {
  return evaluations.map((evaluation) => ({
    repetitionId: evaluation.repetitionId,
    variant,
    outcome: evaluation.outcome,
    results: evaluation.checkResults,
  }));
}

export function resolveSubjectExecutionPolicy(props: {
  readonly allowedTools: readonly string[];
  readonly allowedWritePaths: readonly string[];
}): {
  readonly permissionMode: AcpxPermissionMode;
  readonly allowedTools: readonly string[];
  readonly allowedWritePaths: readonly string[];
} {
  const allowedTools = [...new Set(props.allowedTools)].sort();
  const allowedWritePaths = [...new Set(props.allowedWritePaths)].sort();
  return {
    permissionMode: allowedWritePaths.length === 0 ? "approve-reads" : "approve-all",
    allowedTools,
    allowedWritePaths,
  };
}

function createSourceFingerprint(result: ScenarioRepetitionSetReceipt) {
  const baseline = result.baseline[0];
  const treatment = result.treatment[0];
  if (baseline === undefined || treatment === undefined) throw new Error("review requires selected baseline and treatment evidence");
  return {
    pairSetFingerprint: result.pairSetFingerprint,
    baseline: {
      mode: baseline.sourceMode,
      sourceDigest: baseline.sourceDigest,
      sourceRevision: baseline.sourceRevision,
    },
    treatment: {
      mode: treatment.sourceMode,
      sourceDigest: treatment.sourceDigest,
      sourceRevision: treatment.sourceRevision,
    },
  } as const;
}

function createRuntimeFingerprint(result: ScenarioRepetitionSetReceipt) {
  const subject = result.baseline[0];
  if (subject === undefined) throw new Error("review requires selected baseline evidence");
  return {
    runnerVersion: subject.runnerVersion,
    subjectModel: subject.requestedModel,
    subjectReasoningEffort: subject.requestedReasoningEffort,
    runtimeDigest: digest(JSON.stringify(subject.runtimeIdentity)),
  };
}

export function reduceWithBlindReview(props: {
  readonly comparisonIntent: ComparisonIntent;
  readonly expectedRepetitions: number;
  readonly baseline: readonly DeterministicRepetitionEvaluation[];
  readonly treatment: readonly DeterministicRepetitionEvaluation[];
  readonly automatedReview: Pick<
    AutomatedBlindReviewReceipt,
    "outcome" | "reviewReceipt" | "infrastructureReasons" | "parseError" | "runtime"
  >;
}): ScenarioOutcomeReduction {
  if (props.automatedReview.outcome === "infrastructure_error") {
    const runtimeProfileUnverified = props.automatedReview.runtime.profile.verification.status !== "verified";
    return {
      outcome: "infrastructure_error",
      reasonCode: runtimeProfileUnverified ? "runtime_profile_unverified" : "infrastructure_error",
      reasons: props.automatedReview.infrastructureReasons,
    };
  }
  if (props.automatedReview.outcome === "not_evaluated" || props.automatedReview.reviewReceipt === null) {
    return {
      outcome: "not_evaluated",
      reasonCode: "missing_evidence",
      reasons: [props.automatedReview.parseError ?? "blind review receipt is incomplete"],
    };
  }
  const semanticByRepetition = new Map(
    props.automatedReview.reviewReceipt.result.repetitions.map((repetition) => [repetition.repetitionId, repetition]),
  );
  return reduceScenarioOutcome({
    comparisonIntent: props.comparisonIntent,
    expectedRepetitions: props.expectedRepetitions,
    baseline: combineReviewEvidence(props.baseline, semanticByRepetition),
    treatment: combineReviewEvidence(props.treatment, semanticByRepetition),
  });
}

function combineReviewEvidence(
  deterministic: readonly DeterministicRepetitionEvaluation[],
  semanticByRepetition: ReadonlyMap<string, ReviewRepetitionCandidate>,
): readonly ReductionRepetition[] {
  return deterministic.map((evaluation) => {
    const semantic = semanticByRepetition.get(evaluation.repetitionId);
    if (semantic === undefined) {
      return { repetitionId: evaluation.repetitionId, outcome: "not_evaluated" };
    }
    const outcome = applyDeterministicReviewPrecedence({
      semanticOutcome: semantic.outcome,
      deterministicState: evaluation.infrastructureError !== undefined
        ? "infrastructure_error"
        : evaluation.outcome === "not_evaluated"
          ? "missing_evidence"
          : evaluation.outcome === "behavior_fail"
            ? "objective_behavior_failure"
            : "pass",
    });
    if (outcome === "inconclusive" || outcome === "infrastructure_error") {
      throw new Error(`unexpected repetition review outcome: ${outcome}`);
    }
    return {
      repetitionId: evaluation.repetitionId,
      outcome,
      ...(evaluation.infrastructureError === undefined ? {} : { infrastructureError: evaluation.infrastructureError }),
      ...(evaluation.infrastructureReasonCode === undefined
        ? {}
        : { infrastructureReasonCode: evaluation.infrastructureReasonCode }),
    };
  });
}

function evaluateReceipt(
  receipt: ScenarioRepetitionSetReceipt["baseline"][number],
  checks: Parameters<typeof evaluateDeterministicChecks>[1],
): DeterministicRepetitionEvaluation {
  const checkResults = [
    {
      checkId: "runner-write-policy",
      outcome: receipt.writePolicy.status,
      reason: receipt.writePolicy.status === "pass"
        ? "repository writes stayed within declared paths"
        : `repository writes escaped declared paths: ${receipt.writePolicy.unauthorizedPaths.join(", ")}`,
    } satisfies DeterministicCheckResult,
    ...evaluateDeterministicChecks(normalizeRepetitionEvidence({ receipt }), checks),
  ];
  return {
    repetitionId: receipt.repetitionId,
    checkResults,
    outcome: reduceDeterministicCheckResults(checkResults),
    ...(receipt.status === "infrastructure_error"
      ? {
          infrastructureError: receipt.infrastructureReasons.join("; "),
          ...(receipt.runtimeProfile?.verification.reasonCode === "runtime_profile_unverified"
            ? { infrastructureReasonCode: "runtime_profile_unverified" as const }
            : {}),
        }
      : {}),
  };
}

function validateProps(props: ExecuteBehavioralScenarioProps): void {
  if (!Number.isInteger(props.timeoutSeconds) || props.timeoutSeconds <= 0) {
    throw new Error("timeoutSeconds must be a positive integer");
  }
  if (!Number.isInteger(props.infrastructureRetries) || props.infrastructureRetries < 0) {
    throw new Error("infrastructureRetries must be a non-negative integer");
  }
}

function digest(value: string): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
