import path from "node:path";

import type { ClaimedRequirementValidation } from "../authority/claimed-requirements.js";
import type { EvaluationRegistry } from "../authority/evaluation-registry.js";
import { loadScenarioContract } from "../contracts/skill-contracts.js";
import { normalizeRepetitionEvidence } from "../evidence/repetition-evidence.js";
import { executeStructuredReview } from "../review/structured-review-runner.js";
import {
  collectSensitiveEnvironmentValues,
  resolveAcpxLauncher,
  resolveExecutablePath,
  resolveRuntimeExecutableIdentity,
} from "../runtime/acpx-command-executor.js";
import type { AcpxPermissionMode } from "../runtime/acpx-subject-profile.js";
import { discoverAmbientSkillPaths } from "../runtime/ambient-skill-discovery.js";
import type { RuntimeProfileReceipt } from "../runtime/runtime-profile.js";
import {
  runScenarioRepetitions,
  selectBaselineSkillSource,
} from "./repetition-coordinator.js";
import type { DerivedScenarioExecutionBudget } from "./scenario-execution-budget.js";
import type { SubjectRepetitionReceipt } from "./subject-repetition.js";
import {
  executeV3BehavioralScenario,
  type ExecutedV3BehavioralScenario,
  type V3ExecutedRepetition,
} from "./v3-behavioral-scenario-execution.js";

export interface ExecuteBehavioralScenarioProps {
  readonly scenarioPath: string;
  readonly skillDirectory: string;
  readonly outputDirectory: string;
  readonly timeoutSeconds: number;
  readonly infrastructureRetries: number;
  readonly registrySnapshot: EvaluationRegistry;
  readonly claimedRequirements: ClaimedRequirementValidation;
  readonly executionBudget: DerivedScenarioExecutionBudget;
  readonly scenarioDeadlineMs: number;
  readonly vitestTimeoutMs: number;
  readonly additionalDisabledSkillPaths?: readonly string[];
}

export async function executeBehavioralScenario(
  props: ExecuteBehavioralScenarioProps,
): Promise<ExecutedV3BehavioralScenario> {
  validateProps(props);
  const contract = await loadScenarioContract({ scenarioPath: path.resolve(props.scenarioPath) });
  const repositoryRoot = path.resolve(props.skillDirectory, "../../../..");
  const skillRelativePath = path.relative(repositoryRoot, path.resolve(props.skillDirectory)).split(path.sep).join("/");
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
    allowedTools: contract.allowedTools,
    allowedWritePaths: contract.allowedWritePaths,
  });
  const redactionSecrets = collectSensitiveEnvironmentValues();

  return executeV3BehavioralScenario({
    contract,
    registrySnapshot: props.registrySnapshot,
    authorityContext: {
      calibration: null,
      claimedRequirements: props.claimedRequirements,
      resolveParentAcceptance: async () => null,
    },
    executionBudget: props.executionBudget,
    configuredScenarioDeadlineMs: props.scenarioDeadlineMs,
    configuredVitestTimeoutMs: props.vitestTimeoutMs,
    outputDirectory: path.resolve(props.outputDirectory),
    redactionSecrets,
    executeSubjects: async (request) => {
      const repetitionsById = new Map<string, V3ExecutedRepetition>();
      const attemptPathsByRepetitionId = new Map<string, string>();
      const result = await runScenarioRepetitions({
        repetitions: request.repetitions,
        infrastructureRetries: props.infrastructureRetries,
        baselineSource: selectBaselineSkillSource({
          baseline: request.baseline,
          baselineRevision: request.baselineRevision,
          repositoryRoot,
          skillRelativePath,
        }),
        treatmentSource: { mode: "current", directory: path.resolve(props.skillDirectory) },
        repetitionProps: {
          runRoot: path.join(path.resolve(props.outputDirectory), "repositories"),
          scenarioId: request.scenarioId,
          prompt: request.prompt,
          fixtureFiles: [],
          expectedArtifacts: contract.expectedArtifacts,
          allowedTools: subjectExecutionPolicy.allowedTools,
          allowedWritePaths: subjectExecutionPolicy.allowedWritePaths,
          skillName: request.skillName,
          launcher,
          codexExecutable,
          runtimeIdentity,
          model: "gpt-5.6-luna",
          reasoningEffort: "xhigh",
          permissionMode: subjectExecutionPolicy.permissionMode,
          disabledAmbientSkillPaths,
          timeoutSeconds: props.timeoutSeconds,
          redactionSecrets,
          signal: request.signal,
        },
        persistAttemptReceipt: async ({ receipt, variant, repetitionNumber, attemptNumber }) => {
          const repetition = toV3Repetition(receipt);
          repetitionsById.set(receipt.repetitionId, repetition);
          const receiptPath = await request.persistAttempt({
            variant,
            repetitionNumber,
            attemptNumber,
            repetition,
          });
          attemptPathsByRepetitionId.set(receipt.repetitionId, receiptPath);
          return receiptPath;
        },
      });
      for (const [variant, receipts] of [["baseline", result.baseline], ["treatment", result.treatment]] as const) {
        for (const [index, receipt] of receipts.entries()) {
          const repetition = repetitionsById.get(receipt.repetitionId);
          const attemptReceiptPath = attemptPathsByRepetitionId.get(receipt.repetitionId);
          if (repetition === undefined || attemptReceiptPath === undefined) {
            throw new Error(`selected repetition lacks its durable attempt binding: ${receipt.repetitionId}`);
          }
          await request.persistAcceptedRepetition({
            variant,
            repetitionNumber: index + 1,
            repetition,
            attemptReceiptPath,
          });
        }
      }
      return {
        baseline: result.baseline.map((receipt) => requiredRepetition(repetitionsById, receipt.repetitionId)),
        treatment: result.treatment.map((receipt) => requiredRepetition(repetitionsById, receipt.repetitionId)),
      };
    },
    executeSemanticReview: async ({ packet, signal }) => executeStructuredReview({
      reviewRoot: path.join(path.resolve(props.outputDirectory), "semantic-review-workspaces"),
      packet,
      risk: contract.risk,
      launcher,
      codexExecutable,
      timeoutSeconds: props.timeoutSeconds,
      signal,
    }),
  });
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

function toV3Repetition(receipt: SubjectRepetitionReceipt): V3ExecutedRepetition {
  return {
    evidence: normalizeRepetitionEvidence({ receipt }),
    runtimeProfile: receipt.runtimeProfile ?? unverifiedRuntimeProfile(),
    durableFacts: {
      processClosed: receipt.process.supervisorReceipt.exitCode !== null || receipt.process.supervisorReceipt.signal !== null,
      streamsDrained: receipt.process.supervisorReceipt.stdoutEof && receipt.process.supervisorReceipt.stderrEof,
      outputRedacted: true,
      snapshotsCollected: true,
      cleanupFactsCollected: true,
    },
    comparisonIdentity: {
      sessionId: receipt.transcript.sessionId,
      repositoryIdentity: receipt.repositoryIdentity,
      commonInputDigest: receipt.commonInputDigest,
      promptDigest: receipt.promptDigest,
      fixtureDigest: receipt.fixtureDigest,
      sourceDigest: receipt.sourceDigest,
      sourceRevision: receipt.sourceRevision,
    },
  };
}

function requiredRepetition(
  repetitionsById: ReadonlyMap<string, V3ExecutedRepetition>,
  repetitionId: string,
): V3ExecutedRepetition {
  const repetition = repetitionsById.get(repetitionId);
  if (repetition === undefined) throw new Error(`missing converted repetition: ${repetitionId}`);
  return repetition;
}

function unverifiedRuntimeProfile(): RuntimeProfileReceipt {
  return {
    requested: { provider: "codex", model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
    acceptedProviderReported: { model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
    providerReported: { model: null, reasoningEffort: null },
    verification: {
      status: "unverified",
      reasonCode: "runtime_profile_unverified",
      reasons: ["subject repetition did not produce a runtime profile receipt"],
    },
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
