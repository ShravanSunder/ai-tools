import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

import {
  assertComparablePair,
  runSubjectRepetition,
} from "../lib/evaluation/subject-repetition.js";
import {
  collectSensitiveEnvironmentValues,
  resolveAcpxLauncher,
  resolveExecutablePath,
  resolveRuntimeExecutableIdentity,
} from "../lib/runtime/acpx-command-executor.js";
import { discoverAmbientSkillPaths } from "../lib/runtime/ambient-skill-discovery.js";

const { values } = parseArgs({
  options: {
    "scenario-id": { type: "string" },
    "skill-dir": { type: "string" },
    "skill-name": { type: "string" },
    prompt: { type: "string" },
    output: { type: "string" },
    timeout: { type: "string", default: "180" },
    "disable-skill-path": { type: "string", multiple: true, default: [] },
  },
  strict: true,
});

const scenarioId = requireValue(values["scenario-id"], "--scenario-id");
const skillDirectory = path.resolve(requireValue(values["skill-dir"], "--skill-dir"));
const skillName = requireValue(values["skill-name"], "--skill-name");
const prompt = requireValue(values.prompt, "--prompt");
const outputDirectory = path.resolve(requireValue(values.output, "--output"));
const timeoutSeconds = Number(values.timeout);
if (!Number.isInteger(timeoutSeconds) || timeoutSeconds <= 0) {
  throw new Error("--timeout must be a positive integer");
}

await mkdir(outputDirectory, { recursive: true });
const launcher = await resolveAcpxLauncher();
const codexExecutable = await resolveExecutablePath("codex");
const runtimeIdentity = await resolveRuntimeExecutableIdentity(launcher, codexExecutable);
const discoveredAmbientSkillPaths = await discoverAmbientSkillPaths({
  codexHome: process.env.CODEX_HOME ?? path.join(process.env.HOME ?? "", ".codex"),
});
const common = {
  runRoot: path.join(outputDirectory, "repositories"),
  scenarioId,
  prompt,
  fixtureFiles: [],
  skillName,
  launcher,
  codexExecutable,
  runtimeIdentity,
  model: "gpt-5.6-luna",
  reasoningEffort: "xhigh",
  permissionMode: "approve-reads" as const,
  disabledAmbientSkillPaths: [...new Set([
    ...discoveredAmbientSkillPaths,
    ...(values["disable-skill-path"] ?? []).map((skillPath) => path.resolve(skillPath)),
  ])].sort(),
  timeoutSeconds,
  redactionSecrets: collectSensitiveEnvironmentValues(),
};

const baseline = await runSubjectRepetition({
  ...common,
  variant: "baseline",
  selectedSkillSource: { mode: "none" },
});
const treatment = await runSubjectRepetition({
  ...common,
  variant: "treatment",
  selectedSkillSource: { mode: "current", directory: skillDirectory },
});

let pairError: string | null = null;
try {
  assertComparablePair(baseline, treatment);
} catch (error) {
  pairError = error instanceof Error ? error.message : "unknown pair comparison error";
}
const result = {
  schemaVersion: 1,
  scenarioId,
  launcher,
  baseline,
  treatment,
  pairComparable: pairError === null,
  pairError,
};
const resultPath = path.join(outputDirectory, "pair-receipt.json");
await writeFile(resultPath, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
process.stdout.write(`${JSON.stringify({
  resultPath,
  baselineStatus: baseline.status,
  treatmentStatus: treatment.status,
  pairComparable: result.pairComparable,
  pairError,
})}\n`);

if (baseline.status !== "executed" || treatment.status !== "executed" || pairError !== null) {
  process.exitCode = 1;
}

function requireValue(value: string | undefined, flag: string): string {
  if (value === undefined || value.trim() === "") {
    throw new Error(`${flag} is required`);
  }
  return value;
}
