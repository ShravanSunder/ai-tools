import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { basename, join, relative, resolve, sep } from "node:path";

import { parseDocument } from "yaml";
import { z } from "zod";

import { ContractValidationError } from "../contracts/skill-contracts.js";

export const LEGACY_SCENARIO_ROOT = "tests/skills/pressure-scenarios";
export const LEGACY_SCENARIO_README = "README.md";
export const EXPECTED_LEGACY_SCENARIO_COUNT = 107;
export const EXPECTED_MIGRATION_OWNER_COUNT = 23;

const migrationRowInputSchema = z
  .object({
    scenario_id: z.string().min(1),
    legacy_path: z.string().min(1),
    skill_under_test: z.string().min(1),
    target_plugin: z.string().min(1),
    target_skill: z.string().min(1),
    target_path: z.string().min(1),
    disposition: z.enum(["migrate", "retire"]),
    retirement_reason: z.string().min(1).nullable(),
  })
  .strict();

const migrationInventoryInputSchema = z
  .object({
    schema_version: z.literal(1),
    source_root: z.literal(LEGACY_SCENARIO_ROOT),
    source_digest: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    expected_count: z.literal(EXPECTED_LEGACY_SCENARIO_COUNT),
    scenarios: z.array(migrationRowInputSchema).length(EXPECTED_LEGACY_SCENARIO_COUNT),
  })
  .strict();

export interface LegacyScenarioMetadata {
  readonly scenarioId: string;
  readonly skillUnderTest: string;
  readonly legacyPath: string;
  readonly source: string;
}

export interface ScenarioMigrationRow {
  readonly scenarioId: string;
  readonly legacyPath: string;
  readonly skillUnderTest: string;
  readonly targetPlugin: string;
  readonly targetSkill: string;
  readonly targetPath: string;
  readonly disposition: "migrate" | "retire";
  readonly retirementReason: string | null;
}

export interface ScenarioMigrationInventory {
  readonly schemaVersion: 1;
  readonly sourceRoot: typeof LEGACY_SCENARIO_ROOT;
  readonly sourceDigest: string;
  readonly expectedCount: typeof EXPECTED_LEGACY_SCENARIO_COUNT;
  readonly scenarios: readonly ScenarioMigrationRow[];
}

export interface LoadScenarioMigrationInventoryProps {
  readonly repositoryRoot: string;
  readonly inventoryPath: string;
}

interface LegacyScenarioFile {
  readonly absolutePath: string;
  readonly relativePath: string;
  readonly source: string;
}

function normalizeRelativePath(path: string): string {
  return path.split(sep).join("/");
}

function ownerKey(plugin: string, skill: string): string {
  return `${plugin}/${skill}`;
}

function parseSingleMetadataValue(
  metadata: ReadonlyMap<string, readonly string[]>,
  key: string,
  scenarioPath: string,
): string {
  const values = metadata.get(key);
  if (values === undefined || values.length !== 1 || values[0] === undefined || values[0] === "") {
    throw new ContractValidationError(
      `legacy scenario ${scenarioPath} must contain exactly one non-empty ${key}`,
    );
  }
  return values[0];
}

function parseLegacySkillOwner(skillUnderTest: string, scenarioPath: string): { plugin: string; skill: string } {
  if (skillUnderTest === "peekaboo") {
    return { plugin: "dev-workflow-tools", skill: "peekaboo" };
  }
  const namespacedSkill = /^([a-z0-9][a-z0-9-]*):([a-z0-9][a-z0-9-]*)$/.exec(skillUnderTest);
  if (namespacedSkill?.[1] === undefined || namespacedSkill[2] === undefined) {
    throw new ContractValidationError(
      `unmappable legacy skill_under_test ${JSON.stringify(skillUnderTest)} at ${scenarioPath}`,
    );
  }
  return { plugin: namespacedSkill[1], skill: namespacedSkill[2] };
}

export function parseLegacyScenarioMetadata(
  source: string,
  legacyPath: string,
): LegacyScenarioMetadata & { readonly targetPlugin: string; readonly targetSkill: string; readonly targetPath: string } {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  if (!lines[0]?.startsWith("#") || lines[1] !== "") {
    throw new ContractValidationError(`legacy scenario metadata header is invalid at ${legacyPath}`);
  }

  const metadata = new Map<string, string[]>();
  for (const line of lines.slice(2)) {
    if (line === "") {
      break;
    }
    const entry = /^([a-z][a-z0-9_]*)\s*:\s*(.*)$/.exec(line);
    if (entry?.[1] === undefined || entry[2] === undefined) {
      throw new ContractValidationError(`legacy scenario metadata line is invalid at ${legacyPath}: ${line}`);
    }
    const values = metadata.get(entry[1]) ?? [];
    values.push(entry[2].trim());
    metadata.set(entry[1], values);
  }

  const scenarioId = parseSingleMetadataValue(metadata, "scenario_id", legacyPath);
  const skillUnderTest = parseSingleMetadataValue(metadata, "skill_under_test", legacyPath);
  const targetOwner = parseLegacySkillOwner(skillUnderTest, legacyPath);
  const targetPath = normalizeRelativePath(
    join("tests", targetOwner.plugin, targetOwner.skill, "scenarios", basename(legacyPath)),
  );

  return {
    scenarioId,
    skillUnderTest,
    legacyPath,
    source,
    targetPlugin: targetOwner.plugin,
    targetSkill: targetOwner.skill,
    targetPath,
  };
}

async function assertRegularFile(filePath: string, label: string): Promise<void> {
  let status: Awaited<ReturnType<typeof lstat>>;
  try {
    status = await lstat(filePath);
  } catch {
    throw new ContractValidationError(`${label} is missing: ${filePath}`);
  }
  if (status.isSymbolicLink() || !status.isFile()) {
    throw new ContractValidationError(`${label} must be a regular file: ${filePath}`);
  }
}

async function listLegacyScenarioFiles(repositoryRoot: string): Promise<readonly LegacyScenarioFile[]> {
  const legacyRoot = resolve(repositoryRoot, LEGACY_SCENARIO_ROOT);
  const entries = (await readdir(legacyRoot, { withFileTypes: true })).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const files: LegacyScenarioFile[] = [];
  for (const entry of entries) {
    if (!entry.name.endsWith(".md") || entry.name === LEGACY_SCENARIO_README) {
      continue;
    }
    const absolutePath = join(legacyRoot, entry.name);
    await assertRegularFile(absolutePath, "legacy scenario");
    files.push({
      absolutePath,
      relativePath: normalizeRelativePath(relative(repositoryRoot, absolutePath)),
      source: await readFile(absolutePath, "utf8"),
    });
  }
  return files;
}

export async function computeLegacyScenarioSourceDigest(repositoryRoot: string): Promise<string> {
  const digest = createHash("sha256");
  for (const file of await listLegacyScenarioFiles(resolve(repositoryRoot))) {
    digest.update(file.relativePath);
    digest.update("\0");
    digest.update(file.source);
    digest.update("\0");
  }
  return `sha256:${digest.digest("hex")}`;
}

async function parseYamlFile(filePath: string): Promise<unknown> {
  await assertRegularFile(filePath, "scenario migration inventory");
  const document = parseDocument(await readFile(filePath, "utf8"), {
    prettyErrors: false,
    strict: true,
    uniqueKeys: true,
  });
  if (document.errors.length > 0) {
    throw new ContractValidationError(
      `invalid YAML at ${filePath}: ${document.errors.map((error) => error.message).join("; ")}`,
    );
  }
  return document.toJS({ maxAliasCount: 0 });
}

function parseMigrationInventory(input: unknown, inventoryPath: string): ScenarioMigrationInventory {
  const parsed = migrationInventoryInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new ContractValidationError(
      `invalid scenario migration inventory at ${inventoryPath}: ${parsed.error.message}`,
    );
  }
  return {
    schemaVersion: 1,
    sourceRoot: LEGACY_SCENARIO_ROOT,
    sourceDigest: parsed.data.source_digest,
    expectedCount: EXPECTED_LEGACY_SCENARIO_COUNT,
    scenarios: parsed.data.scenarios.map((scenario) => ({
      scenarioId: scenario.scenario_id,
      legacyPath: scenario.legacy_path,
      skillUnderTest: scenario.skill_under_test,
      targetPlugin: scenario.target_plugin,
      targetSkill: scenario.target_skill,
      targetPath: scenario.target_path,
      disposition: scenario.disposition,
      retirementReason: scenario.retirement_reason,
    })),
  };
}

async function assertTargetSkillSource(
  repositoryRoot: string,
  row: ScenarioMigrationRow,
): Promise<void> {
  await assertRegularFile(
    resolve(repositoryRoot, "plugins", row.targetPlugin, "skills", row.targetSkill, "SKILL.md"),
    `target skill source for ${row.scenarioId}`,
  );
}

function assertUnique(values: readonly string[], label: string): void {
  const duplicates = [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
  if (duplicates.length > 0) {
    throw new ContractValidationError(`scenario migration inventory has duplicate ${label}: ${duplicates.join(", ")}`);
  }
}

function assertExpectedMigrationOwnerCount(
  rows: readonly ScenarioMigrationRow[],
): void {
  const owners = new Set(rows.map((row) => ownerKey(row.targetPlugin, row.targetSkill)));
  if (owners.size !== EXPECTED_MIGRATION_OWNER_COUNT) {
    throw new ContractValidationError(
      `expected ${EXPECTED_MIGRATION_OWNER_COUNT} migration owners, found ${owners.size}`,
    );
  }
}

export async function loadScenarioMigrationInventory(
  props: LoadScenarioMigrationInventoryProps,
): Promise<ScenarioMigrationInventory> {
  const repositoryRoot = resolve(props.repositoryRoot);
  const inventory = parseMigrationInventory(
    await parseYamlFile(resolve(props.inventoryPath)),
    props.inventoryPath,
  );
  const legacyFiles = await listLegacyScenarioFiles(repositoryRoot);
  if (legacyFiles.length !== inventory.expectedCount) {
    throw new ContractValidationError(
      `expected ${inventory.expectedCount} active legacy scenarios, found ${legacyFiles.length}`,
    );
  }
  const sourceDigest = await computeLegacyScenarioSourceDigest(repositoryRoot);
  if (sourceDigest !== inventory.sourceDigest) {
    throw new ContractValidationError(
      `legacy scenario source digest mismatch: expected ${inventory.sourceDigest}, found ${sourceDigest}`,
    );
  }

  const metadata = legacyFiles.map((file) =>
    parseLegacyScenarioMetadata(file.source, file.relativePath),
  );
  const rows = inventory.scenarios;
  assertUnique(rows.map((row) => row.scenarioId), "scenario_id");
  assertUnique(rows.map((row) => row.legacyPath), "legacy_path");
  assertUnique(rows.map((row) => row.targetPath), "target_path");
  assertUnique(metadata.map((scenario) => scenario.scenarioId), "legacy scenario_id");

  const metadataByPath = new Map(metadata.map((scenario) => [scenario.legacyPath, scenario]));
  const rowPaths = new Set(rows.map((row) => row.legacyPath));
  for (const scenario of metadata) {
    const row = rows.find((candidate) => candidate.legacyPath === scenario.legacyPath);
    if (row === undefined) {
      throw new ContractValidationError(`legacy scenario is missing from migration inventory: ${scenario.legacyPath}`);
    }
    if (
      row.scenarioId !== scenario.scenarioId ||
      row.skillUnderTest !== scenario.skillUnderTest ||
      row.targetPlugin !== scenario.targetPlugin ||
      row.targetSkill !== scenario.targetSkill ||
      row.targetPath !== scenario.targetPath
    ) {
      throw new ContractValidationError(`migration row does not match legacy metadata: ${scenario.legacyPath}`);
    }
  }
  for (const row of rows) {
    if (!metadataByPath.has(row.legacyPath) || !rowPaths.has(row.legacyPath)) {
      throw new ContractValidationError(`migration inventory contains an unknown legacy path: ${row.legacyPath}`);
    }
    if (row.disposition === "migrate" && row.retirementReason !== null) {
      throw new ContractValidationError(`migrated scenario has a retirement reason: ${row.scenarioId}`);
    }
    if (row.disposition === "retire" && row.retirementReason === null) {
      throw new ContractValidationError(`retired scenario is missing a retirement reason: ${row.scenarioId}`);
    }
    await assertTargetSkillSource(repositoryRoot, row);
  }

  assertExpectedMigrationOwnerCount(rows);
  return inventory;
}
