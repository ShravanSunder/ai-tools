import path from "node:path";
import { parseArgs } from "node:util";

import { executeBehavioralScenario } from "../lib/evaluation/behavioral-scenario-runner.js";

const { values } = parseArgs({
  options: {
    scenario: { type: "string" },
    "skill-dir": { type: "string" },
    output: { type: "string" },
    timeout: { type: "string", default: "180" },
    "infrastructure-retries": { type: "string", default: "1" },
    "disable-skill-path": { type: "string", multiple: true, default: [] },
  },
  strict: true,
});

const executed = await executeBehavioralScenario({
  scenarioPath: path.resolve(requireValue(values.scenario, "--scenario")),
  skillDirectory: path.resolve(requireValue(values["skill-dir"], "--skill-dir")),
  outputDirectory: path.resolve(requireValue(values.output, "--output")),
  timeoutSeconds: parsePositiveInteger(values.timeout, "--timeout"),
  infrastructureRetries: parseNonNegativeInteger(
    values["infrastructure-retries"],
    "--infrastructure-retries",
  ),
  additionalDisabledSkillPaths: values["disable-skill-path"] ?? [],
});
process.stdout.write(`${JSON.stringify({
  resultPath: executed.receiptPath,
  status: executed.receipt.result.status,
  baselineCount: executed.receipt.result.baseline.length,
  treatmentCount: executed.receipt.result.treatment.length,
  pairSetFingerprint: executed.receipt.result.pairSetFingerprint,
  infrastructureReasons: executed.receipt.result.infrastructureReasons,
})}\n`);
if (executed.receipt.result.status !== "executed") process.exitCode = 1;

function requireValue(value: string | undefined, flag: string): string {
  if (value === undefined || value.trim() === "") throw new Error(`${flag} is required`);
  return value;
}

function parsePositiveInteger(value: string | undefined, flag: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${flag} must be a positive integer`);
  return parsed;
}

function parseNonNegativeInteger(value: string | undefined, flag: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${flag} must be a non-negative integer`);
  return parsed;
}
