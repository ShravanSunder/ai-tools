import { createHash } from "node:crypto";

export interface OwnerCoverageContract {
  readonly scenarioId: string;
  readonly plugin: string;
  readonly skill: string;
  readonly behaviorRequirementIds: readonly string[];
}

export interface OwnerCoverageRegistryRow {
  readonly scenarioId: string;
  readonly evaluationRole: "gate" | "diagnostic" | "retired";
  readonly freshness: "fresh" | "stale" | "uncalibrated" | "retired";
}

export interface OwnerCoverageRegistry {
  readonly scenarios: readonly OwnerCoverageRegistryRow[];
}

export interface OwnerCoverageOwner {
  readonly owner: {
    readonly plugin: string;
    readonly skill: string;
  };
  readonly knownBehaviorRequirementIds: readonly string[];
  readonly gateCoveredBehaviorRequirementIds: readonly string[];
  readonly uncoveredBehaviorRequirementIds: readonly string[];
}

export interface OwnerCoverageReport {
  readonly owners: readonly OwnerCoverageOwner[];
  readonly knownBehaviorRequirementIds: readonly string[];
  readonly gateCoveredBehaviorRequirementIds: readonly string[];
  readonly uncoveredBehaviorRequirementIds: readonly string[];
  readonly digest: `sha256:${string}`;
}

export interface BuildOwnerCoverageReportProps {
  readonly contracts: readonly OwnerCoverageContract[];
  readonly registry: OwnerCoverageRegistry;
}

export function buildOwnerCoverageReport(
  props: BuildOwnerCoverageReportProps,
): OwnerCoverageReport {
  const contractByScenarioId = new Map<string, OwnerCoverageContract>();
  for (const contract of props.contracts) {
    if (contractByScenarioId.has(contract.scenarioId)) {
      throw new Error(`owner coverage contracts contain duplicate scenario_id: ${contract.scenarioId}`);
    }
    if (contract.behaviorRequirementIds.length === 0) {
      throw new Error(`owner coverage contract has no behavior requirement ids: ${contract.scenarioId}`);
    }
    assertUnique(contract.behaviorRequirementIds, `behavior requirement ids for ${contract.scenarioId}`);
    contractByScenarioId.set(contract.scenarioId, contract);
  }

  const registryByScenarioId = new Map<string, OwnerCoverageRegistryRow>();
  for (const row of props.registry.scenarios) {
    if (registryByScenarioId.has(row.scenarioId)) {
      throw new Error(`owner coverage registry contains duplicate scenario_id: ${row.scenarioId}`);
    }
    if (!contractByScenarioId.has(row.scenarioId)) {
      throw new Error(`owner coverage registry has unknown scenario_id: ${row.scenarioId}`);
    }
    registryByScenarioId.set(row.scenarioId, row);
  }

  const byOwner = new Map<string, {
    readonly plugin: string;
    readonly skill: string;
    readonly known: Set<string>;
    readonly covered: Set<string>;
  }>();
  for (const contract of props.contracts) {
    const ownerKey = `${contract.plugin}/${contract.skill}`;
    const owner = byOwner.get(ownerKey) ?? {
      plugin: contract.plugin,
      skill: contract.skill,
      known: new Set<string>(),
      covered: new Set<string>(),
    };
    for (const requirementId of contract.behaviorRequirementIds) owner.known.add(requirementId);
    const registryRow = registryByScenarioId.get(contract.scenarioId);
    if (registryRow?.evaluationRole === "gate" && registryRow.freshness === "fresh") {
      for (const requirementId of contract.behaviorRequirementIds) owner.covered.add(requirementId);
    }
    byOwner.set(ownerKey, owner);
  }

  const owners = [...byOwner.values()]
    .sort(compareOwners)
    .map((owner) => {
      const knownBehaviorRequirementIds = [...owner.known].sort();
      const gateCoveredBehaviorRequirementIds = [...owner.covered].sort();
      const covered = new Set(gateCoveredBehaviorRequirementIds);
      return {
        owner: { plugin: owner.plugin, skill: owner.skill },
        knownBehaviorRequirementIds,
        gateCoveredBehaviorRequirementIds,
        uncoveredBehaviorRequirementIds: knownBehaviorRequirementIds.filter((id) => !covered.has(id)),
      } satisfies OwnerCoverageOwner;
    });
  const knownBehaviorRequirementIds = uniqueSorted(owners.flatMap((owner) => owner.knownBehaviorRequirementIds));
  const gateCoveredBehaviorRequirementIds = uniqueSorted(owners.flatMap((owner) => owner.gateCoveredBehaviorRequirementIds));
  const covered = new Set(gateCoveredBehaviorRequirementIds);
  const uncoveredBehaviorRequirementIds = knownBehaviorRequirementIds.filter((id) => !covered.has(id));
  const base = {
    owners,
    knownBehaviorRequirementIds,
    gateCoveredBehaviorRequirementIds,
    uncoveredBehaviorRequirementIds,
  } as const;
  return {
    ...base,
    digest: `sha256:${createHash("sha256").update(JSON.stringify(base)).digest("hex")}`,
  };
}

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) throw new Error(`owner coverage contains duplicate ${label}`);
}

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function compareOwners(
  left: { readonly plugin: string; readonly skill: string },
  right: { readonly plugin: string; readonly skill: string },
): number {
  return `${left.plugin}/${left.skill}`.localeCompare(`${right.plugin}/${right.skill}`);
}
