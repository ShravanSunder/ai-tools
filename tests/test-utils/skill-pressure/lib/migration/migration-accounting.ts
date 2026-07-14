import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import path from "node:path";

import { parseDocument } from "yaml";
import { z } from "zod";

import { discoverSkillScenarios } from "../discovery/skill-discovery.js";

export const EXPECTED_MIGRATED_SCENARIO_COUNT = 107;
export const EXPECTED_MIGRATED_OWNER_COUNT = 23;
export const LEGACY_SCENARIO_ROOT = "tests/skills/pressure-scenarios";

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

const migrationInventorySchema = z.object({
  schema_version: z.literal(1),
  source_root: z.literal(LEGACY_SCENARIO_ROOT),
  source_digest: z.string().regex(/^sha256:[a-f0-9]{64}$/u),
  expected_count: z.literal(EXPECTED_MIGRATED_SCENARIO_COUNT),
  scenarios: z.array(migrationRowSchema).length(EXPECTED_MIGRATED_SCENARIO_COUNT),
}).strict();

export interface MigrationAccountingReceipt {
  readonly schemaVersion: 1;
  readonly scenarioCount: typeof EXPECTED_MIGRATED_SCENARIO_COUNT;
  readonly activeScenarioCount: number;
  readonly retiredScenarioCount: number;
  readonly postBaselineScenarioCount: number;
  readonly ownerCount: typeof EXPECTED_MIGRATED_OWNER_COUNT;
  readonly retiredScenarios: readonly {
    readonly scenarioId: string;
    readonly reason: string;
    readonly userAuthorization: string;
  }[];
  readonly inventoryDigest: string;
  readonly discoveryDigest: string;
  readonly accountingDigest: string;
  readonly legacyAuthorityAbsent: true;
}

export interface VerifyMigrationCutoverProps {
  readonly repositoryRoot: string;
  readonly inventoryPath: string;
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

  const ownerCount = new Set(parsed.data.scenarios.map(
    (scenario) => `${scenario.target_plugin}/${scenario.target_skill}`,
  )).size;
  if (ownerCount !== EXPECTED_MIGRATED_OWNER_COUNT) {
    throw new Error(`expected ${EXPECTED_MIGRATED_OWNER_COUNT} migration owners, found ${ownerCount}`);
  }

  const discovery = await discoverSkillScenarios({ repositoryRoot });
  if (discovery.invalid.length > 0) {
    throw new Error(`migrated discovery is invalid: ${discovery.invalid.map((item) => item.detail).join("; ")}`);
  }
  const discoveredById = new Map(discovery.discovered.map((scenario) => [scenario.scenarioId, scenario]));
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
    const discoveredPath = path.relative(repositoryRoot, discovered.scenarioPath).split(path.sep).join("/");
    if (
      discoveredPath !== row.target_path ||
      discovered.owner.plugin !== row.target_plugin ||
      discovered.owner.skill !== row.target_skill
    ) {
      throw new Error(`migration target does not match inventory: ${row.scenario_id}`);
    }
  }

  if (await pathExists(path.resolve(repositoryRoot, LEGACY_SCENARIO_ROOT))) {
    throw new Error(`legacy scenario authority still exists: ${LEGACY_SCENARIO_ROOT}`);
  }

  const inventoryDigest = digest(inventorySource);
  const activeScenarioCount = parsed.data.scenarios.filter((row) => row.disposition === "migrate").length;
  const retiredScenarios = parsed.data.scenarios.flatMap((row) => row.disposition === "retire"
    ? [{
        scenarioId: row.scenario_id,
        reason: row.retirement_reason,
        userAuthorization: row.user_authorization,
      }]
    : []);
  const accountingBase = {
    scenarioCount: EXPECTED_MIGRATED_SCENARIO_COUNT,
    activeScenarioCount,
    retiredScenarioCount: retiredScenarios.length,
    postBaselineScenarioCount: discovery.discovered.length - activeScenarioCount,
    ownerCount: EXPECTED_MIGRATED_OWNER_COUNT,
    retiredScenarios,
    inventoryDigest,
    discoveryDigest: discovery.receiptDigest,
    legacyAuthorityAbsent: true as const,
  } as const;
  return {
    schemaVersion: 1,
    ...accountingBase,
    accountingDigest: digest(JSON.stringify(accountingBase)),
  };
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
