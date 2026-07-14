import { readFile, rename, rm, writeFile } from "node:fs/promises";

import { parseDocument } from "yaml";

import type { DiscoveryReceipt } from "../discovery/skill-discovery.js";
import type { AuthorityDigest } from "./authority-receipts.js";
import { loadEvaluationRegistry } from "./evaluation-registry.js";

export async function promoteRegistryRow(props: {
  readonly repositoryRoot: string;
  readonly registryPath: string;
  readonly discovery: DiscoveryReceipt;
  readonly scenarioId: string;
  readonly promotionReceiptPath: string;
  readonly promotionReceiptDigest: AuthorityDigest;
  readonly beforeRegistryCommit?: () => Promise<void>;
}): Promise<void> {
  const source = await readFile(props.registryPath, "utf8");
  const document = parseDocument(source, { prettyErrors: false, strict: true, uniqueKeys: true });
  if (document.errors.length > 0) throw new Error("cannot update an invalid evaluation registry");
  const parsed = document.toJS({ maxAliasCount: 0 }) as { scenarios?: unknown[] };
  const scenarioRows = parsed.scenarios;
  if (!Array.isArray(scenarioRows)) throw new Error("evaluation registry scenarios are missing");
  const rowIndex = scenarioRows.findIndex((row) =>
    typeof row === "object" && row !== null && "scenario_id" in row && row.scenario_id === props.scenarioId);
  if (rowIndex < 0) throw new Error(`evaluation registry row is missing: ${props.scenarioId}`);
  const row = assertRecord(scenarioRows[rowIndex], "evaluation registry row");
  const history = Array.isArray(row.authority_history) ? row.authority_history : [];
  document.setIn(["scenarios", rowIndex, "evaluation_role"], "gate");
  document.setIn(["scenarios", rowIndex, "freshness"], "fresh");
  document.setIn(["scenarios", rowIndex, "calibration_receipt"], {
    receipt_path: props.promotionReceiptPath,
    receipt_digest: props.promotionReceiptDigest,
  });
  document.setIn(["scenarios", rowIndex, "authority_history"], [
    ...history,
    {
      sequence: history.length + 1,
      event: "promotion",
      receipt_path: props.promotionReceiptPath,
      receipt_digest: props.promotionReceiptDigest,
    },
  ]);
  const temporaryPath = `${props.registryPath}.promotion-${process.pid}.tmp`;
  try {
    await writeFile(temporaryPath, String(document), { flag: "wx" });
    await loadEvaluationRegistry({
      repositoryRoot: props.repositoryRoot,
      registryPath: temporaryPath,
      knownScenarios: props.discovery.discovered.map((scenario) => ({
        scenarioId: scenario.scenarioId,
        behaviorContractDigest: scenario.behaviorContractDigest,
      })),
    });
    await props.beforeRegistryCommit?.();
    await rename(temporaryPath, props.registryPath);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as Record<string, unknown>;
}
