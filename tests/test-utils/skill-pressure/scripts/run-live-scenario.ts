import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

import { loadScenarioContract } from "../lib/contracts/skill-contracts.js";
import { runScenarioRepetitions } from "../lib/evaluation/repetition-coordinator.js";
import {
  collectSensitiveEnvironmentValues,
  resolveAcpxLauncher,
  resolveExecutablePath,
  resolveRuntimeExecutableIdentity,
} from "../lib/runtime/acpx-command-executor.js";
import { discoverAmbientSkillPaths } from "../lib/runtime/ambient-skill-discovery.js";

const { values } = parseArgs({
  options: {
    scenario: { type: "string" },
    "skill-dir": { type: "string" },
    output: { type: "string" },
    timeout: { type: "string", default: "180" },
    "disable-skill-path": { type: "string", multiple: true, default: [] },
  },
  strict: true,
});

const scenarioPath = path.resolve(requireValue(values.scenario, "--scenario"));
const skillDirectory = path.resolve(requireValue(values["skill-dir"], "--skill-dir"));
const outputDirectory = path.resolve(requireValue(values.output, "--output"));
const timeoutSeconds = Number(values.timeout);
if (!Number.isInteger(timeoutSeconds) || timeoutSeconds <= 0) {
  throw new Error("--timeout must be a positive integer");
}

const scenario = await loadScenarioContract({ scenarioPath });
if (scenario.baseline !== "no_skill") {
  throw new Error("the focused live command currently requires a no_skill baseline");
}
await mkdir(outputDirectory, { recursive: true });
const launcher = await resolveAcpxLauncher();
const codexExecutable = await resolveExecutablePath("codex");
const runtimeIdentity = await resolveRuntimeExecutableIdentity(launcher, codexExecutable);
const discoveredAmbientSkillPaths = await discoverAmbientSkillPaths({
  codexHome: process.env.CODEX_HOME ?? path.join(process.env.HOME ?? "", ".codex"),
});
const disabledAmbientSkillPaths = [...new Set([
  ...discoveredAmbientSkillPaths,
  ...(values["disable-skill-path"] ?? []).map((skillPath) => path.resolve(skillPath)),
])].sort();

const result = await runScenarioRepetitions({
  repetitions: scenario.repetitions,
  baselineSource: { mode: "none" },
  treatmentSource: { mode: "current", directory: skillDirectory },
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
    timeoutSeconds,
    redactionSecrets: collectSensitiveEnvironmentValues(),
  },
});

const resultPath = path.join(outputDirectory, "repetition-set-receipt.json");
await writeFile(resultPath, `${JSON.stringify({
  schemaVersion: 1,
  scenario: {
    scenarioId: scenario.scenarioId,
    contractDigest: scenario.contractDigest,
    hiddenRubricDigest: digestOnly(scenario.hiddenRubric),
    risk: scenario.risk,
  },
  result,
}, null, 2)}\n`, { flag: "wx" });
process.stdout.write(`${JSON.stringify({
  resultPath,
  status: result.status,
  baselineCount: result.baseline.length,
  treatmentCount: result.treatment.length,
  pairSetFingerprint: result.pairSetFingerprint,
  infrastructureReasons: result.infrastructureReasons,
})}\n`);
if (result.status !== "executed") process.exitCode = 1;

function requireValue(value: string | undefined, flag: string): string {
  if (value === undefined || value.trim() === "") throw new Error(`${flag} is required`);
  return value;
}

function digestOnly(value: string): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
