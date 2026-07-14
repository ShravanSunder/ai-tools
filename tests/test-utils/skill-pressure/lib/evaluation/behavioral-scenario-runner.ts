import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadScenarioContract } from "../contracts/skill-contracts.js";
import { type DeterministicCheckResult, normalizeRepetitionEvidence } from "../evidence/repetition-evidence.js";
import {
  evaluateDeterministicChecks,
  reduceDeterministicCheckResults,
} from "../evidence/repetition-evidence.js";
import type { ScenarioOutcomeReduction } from "../reduction/outcome-reducer.js";
import { reduceObjectiveEvidenceOutcome } from "../reduction/outcome-reducer.js";
import { executeAutomatedBlindReview, type AutomatedBlindReviewReceipt } from "../review/acpx-blind-review-runner.js";
import { applyDeterministicReviewPrecedence, type ReviewDeterministicState } from "../review/review-packet.js";
import {
  collectSensitiveEnvironmentValues,
  resolveAcpxLauncher,
  resolveExecutablePath,
  resolveRuntimeExecutableIdentity,
} from "../runtime/acpx-command-executor.js";
import { discoverAmbientSkillPaths } from "../runtime/ambient-skill-discovery.js";
import {
  runScenarioRepetitions,
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
    readonly reduction: ScenarioOutcomeReduction;
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
  if (scenario.baseline !== "no_skill") {
    throw new Error("the focused behavioral runner currently requires a no_skill baseline");
  }
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
  const result = await runScenarioRepetitions({
    repetitions: scenario.repetitions,
    infrastructureRetries: props.infrastructureRetries,
    baselineSource: { mode: "none" },
    treatmentSource: { mode: "current", directory: path.resolve(props.skillDirectory) },
    repetitionProps: {
      runRoot: path.join(outputDirectory, "repositories"),
      scenarioId: scenario.scenarioId,
      prompt: scenario.prompt,
      fixtureFiles: [],
      expectedArtifacts: scenario.expectedArtifacts,
      skillName: scenario.skill,
      launcher,
      codexExecutable,
      runtimeIdentity,
      model: "gpt-5.6-luna",
      reasoningEffort: "xhigh",
      permissionMode: "approve-reads",
      disabledAmbientSkillPaths,
      timeoutSeconds: props.timeoutSeconds,
      redactionSecrets: collectSensitiveEnvironmentValues(),
    },
  });
  const deterministicBaseline = result.baseline.map((receipt) => evaluateReceipt(receipt, scenario.deterministicChecks));
  const deterministicTreatment = result.treatment.map((receipt) => evaluateReceipt(receipt, scenario.deterministicChecks));
  const deterministicReduction = reduceObjectiveEvidenceOutcome({
    expectedRepetitions: scenario.repetitions,
    baseline: deterministicBaseline,
    treatment: deterministicTreatment,
  });
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
  const reduction = reduceWithBlindReview(deterministicReduction, automatedReview);
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
      reduction: deterministicReduction,
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

export function reduceWithBlindReview(
  deterministicReduction: ScenarioOutcomeReduction,
  automatedReview: Pick<AutomatedBlindReviewReceipt, "outcome" | "infrastructureReasons" | "parseError">,
): ScenarioOutcomeReduction {
  if (deterministicReduction.outcome === "inconclusive") {
    return {
      outcome: "inconclusive",
      reasons: [...deterministicReduction.reasons, "blind review cannot resolve mixed deterministic repetitions"],
    };
  }
  const outcome = applyDeterministicReviewPrecedence({
    semanticOutcome: automatedReview.outcome,
    deterministicState: deterministicStateForOutcome(deterministicReduction.outcome),
  });
  return {
    outcome,
    reasons: [
      ...deterministicReduction.reasons,
      automatedReview.outcome === "infrastructure_error"
        ? `blind review infrastructure error: ${automatedReview.infrastructureReasons.join("; ")}`
        : automatedReview.outcome === "not_evaluated"
          ? `blind review was not evaluated: ${automatedReview.parseError ?? "review receipt is incomplete"}`
          : `blind review candidate outcome: ${automatedReview.outcome}`,
    ],
  };
}

function deterministicStateForOutcome(outcome: ScenarioOutcomeReduction["outcome"]): ReviewDeterministicState {
  switch (outcome) {
    case "infrastructure_error":
      return "infrastructure_error";
    case "not_evaluated":
      return "missing_evidence";
    case "behavior_fail":
      return "objective_behavior_failure";
    case "pass":
      return "pass";
    case "inconclusive":
      throw new Error("inconclusive deterministic reduction must be handled before review precedence");
  }
}

function evaluateReceipt(
  receipt: ScenarioRepetitionSetReceipt["baseline"][number],
  checks: Parameters<typeof evaluateDeterministicChecks>[1],
): DeterministicRepetitionEvaluation {
  const checkResults = evaluateDeterministicChecks(normalizeRepetitionEvidence({ receipt }), checks);
  return {
    repetitionId: receipt.repetitionId,
    checkResults,
    outcome: reduceDeterministicCheckResults(checkResults),
    ...(receipt.status === "infrastructure_error"
      ? { infrastructureError: receipt.infrastructureReasons.join("; ") }
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
