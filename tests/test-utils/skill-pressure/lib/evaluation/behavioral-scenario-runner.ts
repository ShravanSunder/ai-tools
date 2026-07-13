import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadScenarioContract } from "../contracts/skill-contracts.js";
import type { DeterministicCheckResult } from "../evidence/repetition-evidence.js";
import {
  evaluateDeterministicChecks,
  normalizeRepetitionEvidence,
  reduceDeterministicCheckResults,
} from "../evidence/repetition-evidence.js";
import type { ScenarioOutcomeReduction } from "../reduction/outcome-reducer.js";
import { reduceScenarioOutcome } from "../reduction/outcome-reducer.js";
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
  readonly schemaVersion: 1;
  readonly scenario: {
    readonly scenarioId: string;
    readonly contractDigest: string;
    readonly hiddenRubricDigest: string;
    readonly risk: "standard" | "high";
  };
  readonly result: ScenarioRepetitionSetReceipt;
  readonly deterministicEvaluation: {
    readonly baseline: readonly DeterministicRepetitionEvaluation[];
    readonly treatment: readonly DeterministicRepetitionEvaluation[];
    readonly reduction: ScenarioOutcomeReduction;
  };
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
  const receipt: BehavioralScenarioReceipt = {
    schemaVersion: 1,
    scenario: {
      scenarioId: scenario.scenarioId,
      contractDigest: scenario.contractDigest,
      hiddenRubricDigest: digest(scenario.hiddenRubric),
      risk: scenario.risk,
    },
    result,
    deterministicEvaluation: {
      baseline: deterministicBaseline,
      treatment: deterministicTreatment,
      reduction: reduceScenarioOutcome({
        expectedRepetitions: scenario.repetitions,
        baseline: deterministicBaseline,
        treatment: deterministicTreatment,
      }),
    },
  };
  const receiptPath = path.join(outputDirectory, "repetition-set-receipt.json");
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
  return { scenarioPrompt: scenario.prompt, receiptPath, receipt };
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
