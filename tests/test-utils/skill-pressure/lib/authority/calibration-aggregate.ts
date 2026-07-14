import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ExecutedV3BehavioralScenario } from "../evaluation/v3-behavioral-scenario-execution.js";
import { digestJson } from "./calibration-freshness.js";
import type { AuthorityDigest } from "./authority-receipts.js";

export async function validateCalibrationAggregateReceipt(props: {
  readonly scenarioReceiptPath: string;
  readonly scenarioReceiptDigest: AuthorityDigest;
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
}): Promise<void> {
  const scenarioOutputDirectory = path.dirname(path.dirname(props.scenarioReceiptPath));
  const outputName = path.basename(scenarioOutputDirectory);
  const scenarioSuffix = `-${props.receipt.scenarioId}`;
  if (!outputName.endsWith(scenarioSuffix)) {
    throw new Error("cannot locate calibration aggregate from the scenario receipt path");
  }
  const runId = outputName.slice(0, -scenarioSuffix.length);
  const aggregatePath = path.join(path.dirname(scenarioOutputDirectory), runId, "aggregate-receipt.json");
  const aggregate = assertRecord(
    JSON.parse(await readFile(aggregatePath, "utf8")),
    "calibration aggregate receipt",
  );
  const receiptDigest = asAuthorityDigest(
    assertString(aggregate.receiptDigest, "calibration aggregate receipt digest"),
    "calibration aggregate receipt digest",
  );
  const { receiptDigest: _receiptDigest, ...aggregateWithoutDigest } = aggregate;
  if (digestJson(aggregateWithoutDigest) !== receiptDigest) {
    throw new Error("calibration aggregate receipt digest does not match");
  }
  const suite = assertRecord(aggregate.suite, "calibration aggregate suite");
  if (suite.kind !== "diagnostic" || suite.success !== true) {
    throw new Error("promotion requires a successful diagnostic aggregate");
  }
  if (!Array.isArray(aggregate.selectedScenarioIds) || aggregate.selectedScenarioIds.length !== 1 ||
    aggregate.selectedScenarioIds[0] !== props.receipt.scenarioId) {
    throw new Error("promotion aggregate must select exactly the promoted scenario");
  }
  const counts = assertRecord(aggregate.counts, "calibration aggregate counts");
  for (const count of ["invalid", "infrastructureError", "missing", "accountingIncomplete"] as const) {
    if (counts[count] !== 0) throw new Error(`promotion aggregate has nonzero ${count}`);
  }
  if (!Array.isArray(aggregate.results) || aggregate.results.length !== 1) {
    throw new Error("promotion aggregate must contain exactly one result");
  }
  const result = assertRecord(aggregate.results[0], "calibration aggregate result");
  if (
    result.scenarioId !== props.receipt.scenarioId ||
    result.scenarioReceiptDigest !== props.scenarioReceiptDigest ||
    result.runDigest !== props.receipt.authoritySnapshot.runDigest ||
    result.outcome !== "pass" ||
    result.accountingComplete !== true
  ) throw new Error("promotion aggregate result does not match the scenario receipt");
}

function asAuthorityDigest(value: string, label: string): AuthorityDigest {
  if (!/^sha256:[a-f0-9]{64}$/u.test(value)) throw new Error(`${label} is invalid`);
  return value as AuthorityDigest;
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as Record<string, unknown>;
}

function assertString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${label} must be non-empty`);
  return value;
}
