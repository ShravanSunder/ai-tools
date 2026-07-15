import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import path from "node:path";

import { parseDocument } from "yaml";
import { z } from "zod";

import type { AuthorityReceiptReference, EvaluationRegistry } from "../authority/evaluation-registry.js";
import { discoverSkillScenarios, type DiscoveredScenario } from "../discovery/skill-discovery.js";
import type { V3BehaviorContract } from "../contracts/v3-behavior-contract.js";
import {
  verifyForbiddenLegacySurfacesAbsent,
  type ForbiddenLegacySurfaceReceipt,
} from "./forbidden-legacy-surfaces.js";
import {
  buildOwnerCoverageReport,
  type OwnerCoverageContract,
  type OwnerCoverageReport,
} from "../reporting/owner-coverage.js";

export const EXPECTED_LEGACY_SCENARIO_COUNT = 107;
export const EXPECTED_CURRENT_SCENARIO_COUNT = 110;
export const EXPECTED_POST_BASELINE_SCENARIO_COUNT = 3;
export const EXPECTED_MIGRATED_OWNER_COUNT = 23;
export const EXPECTED_MIGRATED_SCENARIO_COUNT = EXPECTED_LEGACY_SCENARIO_COUNT;
export const LEGACY_SCENARIO_ROOT = "tests/skills/pressure-scenarios";
export const EXPECTED_POST_BASELINE_SCENARIO_IDS = [
  "manage-agents-model-thinking-selection",
  "orchestrator-goal-artifact-content-boundary",
  "skills-creation-reference-lane-non-regression",
] as const;

const migrationRowShape = {
  scenario_id: z.string().min(1),
  legacy_path: z.string().min(1),
  skill_under_test: z.string().min(1),
  target_plugin: z.string().min(1),
  target_skill: z.string().min(1),
  target_path: z.string().min(1),
} as const;

const migrationRowSchema = z.discriminatedUnion("disposition", [
  z.object({
    ...migrationRowShape,
    disposition: z.literal("migrate"),
    retirement_reason: z.null(),
  }).strict(),
  z.object({
    ...migrationRowShape,
    disposition: z.literal("retire"),
    retirement_reason: z.string().min(1).regex(/\S/u),
    user_authorization: z.string().min(1).regex(/\S/u),
  }).strict(),
]);

const postBaselineRowSchema = z.object({
  scenario_id: z.string().min(1),
  target_plugin: z.string().min(1),
  target_skill: z.string().min(1),
  target_path: z.string().min(1),
  disposition: z.literal("migrate"),
  retirement_reason: z.null(),
}).strict();

const migrationInventorySchema = z.object({
  schema_version: z.literal(1),
  source_root: z.literal(LEGACY_SCENARIO_ROOT),
  source_digest: z.string().regex(/^sha256:[a-f0-9]{64}$/u),
  expected_count: z.literal(EXPECTED_LEGACY_SCENARIO_COUNT),
  post_baseline_expected_count: z.literal(EXPECTED_POST_BASELINE_SCENARIO_COUNT),
  post_baseline_scenarios: z.array(postBaselineRowSchema).length(EXPECTED_POST_BASELINE_SCENARIO_COUNT),
  scenarios: z.array(migrationRowSchema).length(EXPECTED_LEGACY_SCENARIO_COUNT),
}).strict();

export type MigrationEvaluationRole = "gate" | "diagnostic" | "retired";
export type MigrationValidity = "valid" | "invalid" | "unverified";
export type MigrationCalibration = "fresh" | "stale" | "uncalibrated" | "retired";

export interface MigrationRegistryScenario {
  readonly scenarioId: string;
  readonly behaviorContractDigest: string;
  readonly evaluationRole: MigrationEvaluationRole;
  readonly freshness: MigrationCalibration;
  readonly validityReview?: AuthorityReceiptReference;
  readonly calibrationReceipt?: AuthorityReceiptReference | null;
}

export interface MigrationRegistrySnapshot {
  readonly scenarios: readonly MigrationRegistryScenario[];
}

export interface MigrationAccountingRow {
  readonly globalScenarioId: string;
  readonly legacyScenarioId: string | null;
  readonly ownerPlugin: string;
  readonly ownerSkill: string;
  readonly targetPath: string;
  readonly postBaseline: boolean;
  readonly evaluationRole: MigrationEvaluationRole;
  readonly validity: MigrationValidity;
  readonly calibration: MigrationCalibration;
  readonly diagnosticReason: "uncalibrated" | "stale" | null;
  readonly behaviorContractDigest: string;
  readonly behaviorRequirementIds: readonly string[];
  readonly effectSurfaces: readonly string[];
  readonly comparisonIntent: "improvement" | "non_regression";
  readonly baseline: "no_skill" | "previous_revision";
  readonly baselineRevision: string | null;
  readonly risk: "standard" | "high";
  readonly validityReview: AuthorityReceiptReference | null;
  readonly calibrationReceipt: AuthorityReceiptReference | null;
}

export interface MigrationAccountingReceipt {
  readonly schemaVersion: 1;
  readonly scenarioCount: typeof EXPECTED_CURRENT_SCENARIO_COUNT;
  readonly legacyScenarioCount: typeof EXPECTED_LEGACY_SCENARIO_COUNT;
  readonly currentScenarioCount: typeof EXPECTED_CURRENT_SCENARIO_COUNT;
  readonly activeScenarioCount: typeof EXPECTED_CURRENT_SCENARIO_COUNT;
  readonly retiredScenarioCount: number;
  readonly postBaselineScenarioCount: typeof EXPECTED_POST_BASELINE_SCENARIO_COUNT;
  readonly postBaselineScenarioIds: readonly string[];
  readonly ownerCount: typeof EXPECTED_MIGRATED_OWNER_COUNT;
  readonly legacyScenarioIds: readonly string[];
  readonly scenarioRows: readonly MigrationAccountingRow[];
  readonly ownerCoverage: OwnerCoverageReport;
  readonly retiredScenarios: readonly {
    readonly scenarioId: string;
    readonly reason: string;
    readonly userAuthorization: string;
  }[];
  readonly inventoryDigest: string;
  readonly discoveryDigest: string;
  readonly accountingDigest: string;
  readonly forbiddenLegacySurfaces: ForbiddenLegacySurfaceReceipt;
  readonly legacyAuthorityAbsent: true;
}

export interface VerifyMigrationCutoverProps {
  readonly repositoryRoot: string;
  readonly inventoryPath: string;
  readonly contracts?: readonly V3BehaviorContract[];
  readonly registry?: EvaluationRegistry | MigrationRegistrySnapshot;
  readonly forbiddenSurfaceSourceOverrides?: Readonly<Record<string, string>>;
  readonly sourceOverrides?: Readonly<Record<string, string>>;
}

export async function verifyMigrationCutover(
  props: VerifyMigrationCutoverProps,
): Promise<MigrationAccountingReceipt> {
  const repositoryRoot = path.resolve(props.repositoryRoot);
  const inventorySource = await readFile(path.resolve(props.inventoryPath), "utf8");
  const document = parseDocument(inventorySource, {
    prettyErrors: false,
    strict: true,
    uniqueKeys: true,
  });
  if (document.errors.length > 0) {
    throw new Error(`invalid migration inventory: ${document.errors.map((error) => error.message).join("; ")}`);
  }
  const parsed = migrationInventorySchema.safeParse(document.toJS({ maxAliasCount: 0 }));
  if (!parsed.success) {
    throw new Error(`invalid migration inventory: ${parsed.error.message}`);
  }
  assertUnique(parsed.data.scenarios.map((scenario) => scenario.scenario_id), "scenario_id");
  assertUnique(parsed.data.scenarios.map((scenario) => scenario.target_path), "target_path");
  const dispositionRows = [...parsed.data.scenarios, ...parsed.data.post_baseline_scenarios];
  assertUnique(dispositionRows.map((scenario) => scenario.scenario_id), "global scenario_id");
  assertUnique(dispositionRows.map((scenario) => scenario.target_path), "global target_path");

  const inventoryOwnerCount = new Set(dispositionRows.map(
    (scenario) => `${scenario.target_plugin}/${scenario.target_skill}`,
  )).size;
  if (inventoryOwnerCount !== EXPECTED_MIGRATED_OWNER_COUNT) {
    throw new Error(`expected ${EXPECTED_MIGRATED_OWNER_COUNT} migration owners, found ${inventoryOwnerCount}`);
  }

  const discovery = await discoverSkillScenarios({ repositoryRoot });
  if (discovery.invalid.length > 0) {
    throw new Error(`migrated discovery is invalid: ${discovery.invalid.map((item) => item.detail).join("; ")}`);
  }
  if (discovery.discovered.length !== EXPECTED_CURRENT_SCENARIO_COUNT) {
    throw new Error(`expected ${EXPECTED_CURRENT_SCENARIO_COUNT} current scenarios, found ${discovery.discovered.length}`);
  }
  const discoveredById = new Map(discovery.discovered.map((scenario) => [scenario.scenarioId, scenario]));
  const inventoryScenarioIds = new Set(parsed.data.scenarios.map((row) => row.scenario_id));
  for (const row of parsed.data.scenarios) {
    const discovered = discoveredById.get(row.scenario_id);
    if (row.disposition === "retire") {
      if (discovered !== undefined) {
        throw new Error(`retired migration target is still active: ${row.scenario_id}`);
      }
      continue;
    }
    if (discovered === undefined) {
      throw new Error(`migration target was not discovered: ${row.scenario_id}`);
    }
    assertInventoryTargetMatchesDiscovery(row, discovered, repositoryRoot);
  }

  for (const row of parsed.data.post_baseline_scenarios) {
    const discovered = discoveredById.get(row.scenario_id);
    if (discovered === undefined) {
      throw new Error(`post-baseline migration target was not discovered: ${row.scenario_id}`);
    }
    assertInventoryTargetMatchesDiscovery(row, discovered, repositoryRoot);
  }

  const discoveredPostBaselineScenarioIds = discovery.discovered
    .map((scenario) => scenario.scenarioId)
    .filter((scenarioId) => !inventoryScenarioIds.has(scenarioId))
    .sort();
  const postBaselineScenarioIds = parsed.data.post_baseline_scenarios
    .map((scenario) => scenario.scenario_id)
    .sort();
  if (
    JSON.stringify(discoveredPostBaselineScenarioIds) !== JSON.stringify(postBaselineScenarioIds) ||
    postBaselineScenarioIds.length !== EXPECTED_POST_BASELINE_SCENARIO_COUNT ||
    JSON.stringify(postBaselineScenarioIds) !== JSON.stringify([...EXPECTED_POST_BASELINE_SCENARIO_IDS].sort())
  ) {
    throw new Error(`current post-baseline scenarios do not match the fixed three-row extension: ${postBaselineScenarioIds.join(", ")}`);
  }

  const currentOwnerCount = new Set(discovery.discovered.map(
    (scenario) => `${scenario.owner.plugin}/${scenario.owner.skill}`,
  )).size;
  if (currentOwnerCount !== EXPECTED_MIGRATED_OWNER_COUNT) {
    throw new Error(`expected ${EXPECTED_MIGRATED_OWNER_COUNT} current scenario owners, found ${currentOwnerCount}`);
  }

  const contracts = props.contracts === undefined
    ? discovery.discovered
    : validateContractSnapshot(props.contracts, discovery.discovered);
  const registry = props.registry === undefined
    ? undefined
    : validateRegistrySnapshot(props.registry, discovery.discovered);
  const ownerCoverage = buildOwnerCoverageReport({
    contracts: contracts.map(toOwnerCoverageContract),
    registry: registry ?? {
      scenarios: contracts.map((contract) => ({
        scenarioId: contract.scenarioId,
        evaluationRole: "diagnostic" as const,
        freshness: "uncalibrated" as const,
      })),
    },
  });
  const registryByScenarioId = new Map(registry?.scenarios.map((row) => [row.scenarioId, row]) ?? []);
  const scenarioRows = discovery.discovered.map((scenario) => createAccountingRow({
    repositoryRoot,
    scenario,
    legacyScenarioId: inventoryScenarioIds.has(scenario.scenarioId) ? scenario.scenarioId : null,
    registry: registryByScenarioId.get(scenario.scenarioId),
  }));

  const sourceOverrides = props.forbiddenSurfaceSourceOverrides ?? props.sourceOverrides;
  const forbiddenLegacySurfaces = await verifyForbiddenLegacySurfacesAbsent(
    sourceOverrides === undefined
      ? { repositoryRoot }
      : { repositoryRoot, sourceOverrides },
  );
  if (await pathExists(path.resolve(repositoryRoot, LEGACY_SCENARIO_ROOT))) {
    throw new Error(`legacy scenario authority still exists: ${LEGACY_SCENARIO_ROOT}`);
  }

  const inventoryDigest = digest(inventorySource);
  const retiredScenarios = parsed.data.scenarios.flatMap((row) => row.disposition === "retire"
    ? [{
        scenarioId: row.scenario_id,
        reason: row.retirement_reason,
        userAuthorization: row.user_authorization,
      }]
    : []);
  const accountingBase = {
    scenarioCount: EXPECTED_CURRENT_SCENARIO_COUNT,
    legacyScenarioCount: EXPECTED_LEGACY_SCENARIO_COUNT,
    currentScenarioCount: EXPECTED_CURRENT_SCENARIO_COUNT,
    activeScenarioCount: EXPECTED_CURRENT_SCENARIO_COUNT,
    retiredScenarioCount: retiredScenarios.length,
    postBaselineScenarioCount: EXPECTED_POST_BASELINE_SCENARIO_COUNT,
    postBaselineScenarioIds,
    ownerCount: EXPECTED_MIGRATED_OWNER_COUNT,
    legacyScenarioIds: parsed.data.scenarios.map((row) => row.scenario_id),
    scenarioRows,
    ownerCoverage,
    retiredScenarios,
    inventoryDigest,
    discoveryDigest: discovery.receiptDigest,
    forbiddenLegacySurfaces,
    legacyAuthorityAbsent: true as const,
  } as const;
  return {
    schemaVersion: 1,
    ...accountingBase,
    accountingDigest: digest(JSON.stringify(accountingBase)),
  };
}

function validateContractSnapshot(
  contracts: readonly V3BehaviorContract[],
  discovered: readonly DiscoveredScenario[],
): readonly V3BehaviorContract[] {
  const contractById = new Map<string, V3BehaviorContract>();
  for (const contract of contracts) {
    if (contractById.has(contract.scenarioId)) throw new Error(`contract snapshot contains duplicate scenario_id: ${contract.scenarioId}`);
    contractById.set(contract.scenarioId, contract);
  }
  if (contractById.size !== discovered.length) throw new Error("contract snapshot does not account for every discovered scenario");
  for (const scenario of discovered) {
    const contract = contractById.get(scenario.scenarioId);
    if (contract === undefined) throw new Error(`contract snapshot is missing scenario: ${scenario.scenarioId}`);
    if (contract.behaviorContractDigest !== scenario.behaviorContractDigest) {
      throw new Error(`contract snapshot digest does not match discovery: ${scenario.scenarioId}`);
    }
  }
  return contracts;
}

function validateRegistrySnapshot(
  registry: EvaluationRegistry | MigrationRegistrySnapshot,
  discovered: readonly DiscoveredScenario[],
): MigrationRegistrySnapshot {
  const registryById = new Map<string, MigrationRegistryScenario>();
  for (const row of registry.scenarios) {
    if (registryById.has(row.scenarioId)) throw new Error(`migration registry contains duplicate scenario_id: ${row.scenarioId}`);
    if (!discovered.some((scenario) => scenario.scenarioId === row.scenarioId)) {
      throw new Error(`migration registry has unknown scenario_id: ${row.scenarioId}`);
    }
    registryById.set(row.scenarioId, row);
  }
  if (registryById.size !== discovered.length) throw new Error("migration registry does not account for every discovered scenario");
  for (const scenario of discovered) {
    const row = registryById.get(scenario.scenarioId);
    if (row === undefined) throw new Error(`migration registry is missing scenario: ${scenario.scenarioId}`);
    if (row.behaviorContractDigest !== scenario.behaviorContractDigest) {
      throw new Error(`migration registry digest does not match discovery: ${scenario.scenarioId}`);
    }
  }
  return { scenarios: [...registry.scenarios] };
}

function createAccountingRow(props: {
  readonly repositoryRoot: string;
  readonly scenario: DiscoveredScenario;
  readonly legacyScenarioId: string | null;
  readonly registry: MigrationRegistryScenario | undefined;
}): MigrationAccountingRow {
  const role = props.registry?.evaluationRole ?? "diagnostic";
  const calibration = props.registry?.freshness ?? "uncalibrated";
  return {
    globalScenarioId: props.scenario.scenarioId,
    legacyScenarioId: props.legacyScenarioId,
    ownerPlugin: props.scenario.owner.plugin,
    ownerSkill: props.scenario.owner.skill,
    targetPath: path.relative(props.repositoryRoot, props.scenario.scenarioPath).split(path.sep).join("/"),
    postBaseline: props.legacyScenarioId === null,
    evaluationRole: role,
    validity: "valid",
    calibration,
    diagnosticReason: role === "diagnostic"
      ? calibration === "stale" ? "stale" : "uncalibrated"
      : null,
    behaviorContractDigest: props.scenario.behaviorContractDigest,
    behaviorRequirementIds: [...props.scenario.behaviorRequirementIds],
    effectSurfaces: [...props.scenario.effectSurfaces],
    comparisonIntent: props.scenario.comparisonIntent,
    baseline: props.scenario.baseline,
    baselineRevision: props.scenario.baselineRevision,
    risk: props.scenario.risk,
    validityReview: props.registry?.validityReview ?? null,
    calibrationReceipt: props.registry?.calibrationReceipt ?? null,
  };
}

function toOwnerCoverageContract(contract: V3BehaviorContract): OwnerCoverageContract {
  return {
    scenarioId: contract.scenarioId,
    plugin: contract.plugin,
    skill: contract.skill,
    behaviorRequirementIds: contract.behaviorRequirementIds,
  };
}

function assertInventoryTargetMatchesDiscovery(
  row: Pick<z.infer<typeof postBaselineRowSchema>, "scenario_id" | "target_path" | "target_plugin" | "target_skill">,
  discovered: DiscoveredScenario,
  repositoryRoot: string,
): void {
  const discoveredPath = path.relative(repositoryRoot, discovered.scenarioPath).split(path.sep).join("/");
  if (
    discoveredPath !== row.target_path ||
    discovered.owner.plugin !== row.target_plugin ||
    discovered.owner.skill !== row.target_skill
  ) {
    throw new Error(`migration target does not match inventory: ${row.scenario_id}`);
  }
}

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) {
    throw new Error(`migration inventory contains duplicate ${label}`);
  }
}

async function pathExists(candidatePath: string): Promise<boolean> {
  try {
    await lstat(candidatePath);
    return true;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function digest(value: string): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
