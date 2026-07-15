import { open, readFile, rename, rm, writeFile } from "node:fs/promises";

import { parseDocument } from "yaml";

import type { DiscoveryReceipt } from "../discovery/skill-discovery.js";
import { loadEvaluationRegistry } from "./evaluation-registry.js";

export async function demoteRegistryRow(props: {
  readonly repositoryRoot: string;
  readonly registryPath: string;
  readonly discovery: DiscoveryReceipt;
  readonly scenarioId: string;
  readonly beforeRegistryCommit?: () => Promise<void>;
}): Promise<void> {
  const lockPath = `${props.registryPath}.authority.lock`;
  let lock;
  try {
    lock = await open(lockPath, "wx");
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "EEXIST") {
      throw new Error("evaluation registry has a concurrent authority transaction");
    }
    throw error;
  }

  try {
    const source = await readFile(props.registryPath, "utf8");
    const document = parseDocument(source, { prettyErrors: false, strict: true, uniqueKeys: true });
    if (document.errors.length > 0) throw new Error("cannot update an invalid evaluation registry");

    const parsed = document.toJS({ maxAliasCount: 0 }) as { scenarios?: unknown[] };
    const scenarioRows = parsed.scenarios;
    if (!Array.isArray(scenarioRows)) throw new Error("evaluation registry scenarios are missing");
    const rowIndex = scenarioRows.findIndex(
      (row) =>
        typeof row === "object" &&
        row !== null &&
        "scenario_id" in row &&
        row.scenario_id === props.scenarioId,
    );
    if (rowIndex < 0) throw new Error(`evaluation registry row is missing: ${props.scenarioId}`);

    const row = assertRecord(scenarioRows[rowIndex], "evaluation registry row");
    if (row.evaluation_role !== "gate") {
      throw new Error(`only current gate rows can demote: ${props.scenarioId}`);
    }
    document.setIn(["scenarios", rowIndex, "evaluation_role"], "diagnostic");
    document.setIn(["scenarios", rowIndex, "freshness"], "stale");
    document.setIn(["scenarios", rowIndex, "calibration_receipt"], null);

    const temporaryPath = `${props.registryPath}.demotion-${process.pid}.tmp`;
    try {
      await writeFile(temporaryPath, String(document), { flag: "wx" });
      await loadEvaluationRegistry({
        repositoryRoot: props.repositoryRoot,
        registryPath: temporaryPath,
        knownScenarios: props.discovery.discovered.map((scenario) => ({
          scenarioId: scenario.scenarioId,
          behaviorContractDigest: scenario.behaviorContractDigest,
          plugin: scenario.plugin,
          skill: scenario.skill,
        })),
      });
      await props.beforeRegistryCommit?.();
      if ((await readFile(props.registryPath, "utf8")) !== source) {
        throw new Error("evaluation registry changed during the authority transaction");
      }
      await rename(temporaryPath, props.registryPath);
    } finally {
      await rm(temporaryPath, { force: true });
    }
  } finally {
    await lock.close();
    await rm(lockPath, { force: true });
  }
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}
