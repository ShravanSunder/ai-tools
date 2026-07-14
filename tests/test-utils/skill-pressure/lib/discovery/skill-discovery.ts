import { createHash } from "node:crypto";
import type { Dirent } from "node:fs";
import { lstat, readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { ContractValidationError, loadScenarioContract } from "../contracts/skill-contracts.js";
import type { LoadedScenarioContract } from "../contracts/skill-contracts.js";
import type { SkillOwner } from "../contracts/contract-types.js";

export interface DiscoveredScenario extends LoadedScenarioContract {
  readonly owner: SkillOwner;
}

export interface DiscoveryInvalidReceipt {
  readonly path: string;
  readonly reason:
    | "duplicate_scenario_id"
    | "owner_submodule"
    | "owner_symlink"
    | "scenario_contract"
    | "scenario_symlink"
    | "source_missing"
    | "unmapped_scenario_id";
  readonly detail: string;
  readonly scenarioId?: string;
}

export interface DiscoveryReceipt {
  readonly schemaVersion: 3;
  readonly discovered: readonly DiscoveredScenario[];
  readonly selected: readonly DiscoveredScenario[];
  readonly skipped: readonly DiscoveredScenario[];
  readonly invalid: readonly DiscoveryInvalidReceipt[];
  readonly receiptDigest: string;
}

export interface DiscoverSkillScenariosProps {
  readonly repositoryRoot: string;
  readonly selectedScenarioIds?: readonly string[];
}

async function sortedEntries(directoryPath: string): Promise<readonly Dirent<string>[]> {
  try {
    return (await readdir(directoryPath, { withFileTypes: true })).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  } catch {
    return [];
  }
}

async function hasGitBoundary(directoryPath: string): Promise<boolean> {
  try {
    await lstat(resolve(directoryPath, ".git"));
    return true;
  } catch {
    return false;
  }
}

async function sourceSkillExists(repositoryRoot: string, owner: SkillOwner): Promise<boolean> {
  try {
    const status = await lstat(resolve(repositoryRoot, "plugins", owner.plugin, "skills", owner.skill, "SKILL.md"));
    return status.isFile() && !status.isSymbolicLink();
  } catch {
    return false;
  }
}

async function findScenarioPaths(
  scenarioRoot: string,
): Promise<{ readonly paths: readonly string[]; readonly invalid: readonly DiscoveryInvalidReceipt[] }> {
  const paths: string[] = [];
  const invalid: DiscoveryInvalidReceipt[] = [];
  const walk = async (directoryPath: string): Promise<void> => {
    for (const entry of await sortedEntries(directoryPath)) {
      const entryPath = resolve(directoryPath, entry.name);
      if (entry.isSymbolicLink()) {
        invalid.push({ path: entryPath, reason: "scenario_symlink", detail: "scenario trees may not contain symlinks" });
      } else if (entry.isDirectory()) {
        await walk(entryPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        paths.push(entryPath);
      }
    }
  };
  await walk(scenarioRoot);
  return { paths: paths.sort(), invalid };
}

export async function discoverSkillScenarios(
  props: DiscoverSkillScenariosProps,
): Promise<DiscoveryReceipt> {
  const repositoryRoot = resolve(props.repositoryRoot);
  const testsRoot = resolve(repositoryRoot, "tests");
  const discovered: DiscoveredScenario[] = [];
  const invalid: DiscoveryInvalidReceipt[] = [];

  for (const pluginEntry of await sortedEntries(testsRoot)) {
    if (pluginEntry.name === "test-utils" || pluginEntry.name === "skills") {
      continue;
    }
    const pluginRoot = resolve(testsRoot, pluginEntry.name);
    if (pluginEntry.isSymbolicLink()) {
      invalid.push({ path: pluginRoot, reason: "owner_symlink", detail: "plugin owner may not be a symlink" });
      continue;
    }
    if (!pluginEntry.isDirectory()) {
      continue;
    }
    if (await hasGitBoundary(pluginRoot)) {
      invalid.push({ path: pluginRoot, reason: "owner_submodule", detail: "plugin owner may not be a Git boundary" });
      continue;
    }
    for (const skillEntry of await sortedEntries(pluginRoot)) {
      const skillRoot = resolve(pluginRoot, skillEntry.name);
      if (skillEntry.isSymbolicLink()) {
        invalid.push({ path: skillRoot, reason: "owner_symlink", detail: "skill owner may not be a symlink" });
        continue;
      }
      if (!skillEntry.isDirectory()) {
        continue;
      }
      if (await hasGitBoundary(skillRoot)) {
        invalid.push({ path: skillRoot, reason: "owner_submodule", detail: "skill owner may not be a Git boundary" });
        continue;
      }
      const scenarioRoot = resolve(skillRoot, "scenarios");
      const scenarioEntries = await sortedEntries(scenarioRoot);
      if (scenarioEntries.length === 0) {
        continue;
      }
      const owner = { plugin: pluginEntry.name, skill: skillEntry.name } satisfies SkillOwner;
      if (!(await sourceSkillExists(repositoryRoot, owner))) {
        invalid.push({ path: skillRoot, reason: "source_missing", detail: "matching plugin skill SKILL.md is missing" });
        continue;
      }
      const scenarioPaths = await findScenarioPaths(scenarioRoot);
      invalid.push(...scenarioPaths.invalid);
      for (const scenarioPath of scenarioPaths.paths) {
        try {
          const scenario = await loadScenarioContract({ scenarioPath, expectedOwner: owner });
          discovered.push({ ...scenario, owner });
        } catch (error) {
          invalid.push({
            path: scenarioPath,
            reason: "scenario_contract",
            detail: error instanceof ContractValidationError || error instanceof Error ? error.message : "unknown scenario error",
          });
        }
      }
    }
  }

  discovered.sort((left, right) => left.scenarioId.localeCompare(right.scenarioId) || left.scenarioPath.localeCompare(right.scenarioPath));
  const byId = new Map<string, DiscoveredScenario[]>();
  for (const scenario of discovered) {
    byId.set(scenario.scenarioId, [...(byId.get(scenario.scenarioId) ?? []), scenario]);
  }
  const duplicateIds = new Set<string>();
  for (const [scenarioId, scenarios] of byId) {
    if (scenarios.length > 1) {
      duplicateIds.add(scenarioId);
      for (const scenario of scenarios) {
        invalid.push({ path: scenario.scenarioPath, reason: "duplicate_scenario_id", detail: `scenario_id ${scenarioId} is globally duplicated`, scenarioId });
      }
    }
  }
  const valid = discovered.filter((scenario) => !duplicateIds.has(scenario.scenarioId));
  const selectedIds = new Set(props.selectedScenarioIds ?? valid.map((scenario) => scenario.scenarioId));
  for (const scenarioId of selectedIds) {
    if (!byId.has(scenarioId)) {
      invalid.push({ path: "tests", reason: "unmapped_scenario_id", detail: `selected scenario_id ${scenarioId} was not discovered`, scenarioId });
    }
  }
  const selected = valid.filter((scenario) => selectedIds.has(scenario.scenarioId));
  const skipped = valid.filter((scenario) => !selectedIds.has(scenario.scenarioId));
  const receiptBase = {
    schemaVersion: 3 as const,
    discovered,
    selected,
    skipped,
    invalid: invalid.sort((left, right) => left.path.localeCompare(right.path) || left.reason.localeCompare(right.reason)),
  };
  return {
    ...receiptBase,
    receiptDigest: `sha256:${createHash("sha256").update(JSON.stringify(receiptBase)).digest("hex")}`,
  };
}
