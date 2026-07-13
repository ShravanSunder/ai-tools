import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  EXPECTED_LEGACY_SCENARIO_COUNT,
  EXPECTED_MIGRATION_OWNER_COUNT,
  LEGACY_SCENARIO_ROOT,
  loadScenarioMigrationInventory,
  parseLegacyScenarioMetadata,
} from "./scenario-migration.js";

const packageRoot = fileURLToPath(new URL("../../", import.meta.url));
const repositoryRoot = join(packageRoot, "../../..");

describe("legacy scenario migration inventory", () => {
  it("RED: stops on an unmappable legacy skill owner", () => {
    expect(() =>
      parseLegacyScenarioMetadata(
        "# unmappable\n\nscenario_id: unmappable\nskill_under_test: bare-skill\nmode: fast\n",
        "tests/skills/pressure-scenarios/unmappable.md",
      ),
    ).toThrow(/unmappable legacy skill_under_test/);
  });

  it("GREEN: proves complete live migration coverage and exact owner accounting", async () => {
    const inventory = await loadScenarioMigrationInventory({
      repositoryRoot,
      inventoryPath: join(packageRoot, "config/legacy-scenario-migration.yaml"),
    });

    expect(inventory.schemaVersion).toBe(1);
    expect(inventory.sourceRoot).toBe(LEGACY_SCENARIO_ROOT);
    expect(inventory.expectedCount).toBe(EXPECTED_LEGACY_SCENARIO_COUNT);
    expect(inventory.scenarios).toHaveLength(EXPECTED_LEGACY_SCENARIO_COUNT);
    expect(new Set(inventory.scenarios.map((scenario) => scenario.scenarioId)).size).toBe(
      EXPECTED_LEGACY_SCENARIO_COUNT,
    );
    expect(new Set(inventory.scenarios.map((scenario) => scenario.targetPath)).size).toBe(
      EXPECTED_LEGACY_SCENARIO_COUNT,
    );
    expect(
      new Set(
        inventory.scenarios.map(
          (scenario) => `${scenario.targetPlugin}/${scenario.targetSkill}`,
        ),
      ).size,
    ).toBe(EXPECTED_MIGRATION_OWNER_COUNT);
    expect(inventory.scenarios.every((scenario) => scenario.disposition === "migrate")).toBe(true);
    expect(inventory.scenarios.every((scenario) => scenario.retirementReason === null)).toBe(true);
    expect(inventory.scenarios.find((scenario) => scenario.skillUnderTest === "peekaboo")).toMatchObject({
      targetPlugin: "dev-workflow-tools",
      targetSkill: "peekaboo",
    });
    expect(inventory.scenarios.every((scenario) => scenario.legacyPath.startsWith(`${LEGACY_SCENARIO_ROOT}/`))).toBe(
      true,
    );
  });

  it("rejects a changed legacy source set instead of silently accepting stale inventory", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "skill-pressure-migration-"));
    const legacyRoot = join(fixtureRoot, LEGACY_SCENARIO_ROOT);
    await mkdir(legacyRoot, { recursive: true });
    await writeFile(join(legacyRoot, "changed.md"), "# changed\n\nscenario_id: changed\nskill_under_test: peekaboo\n");

    await expect(
      loadScenarioMigrationInventory({
        repositoryRoot: fixtureRoot,
        inventoryPath: join(packageRoot, "config/legacy-scenario-migration.yaml"),
      }),
    ).rejects.toThrow(/expected 107 active legacy scenarios, found 1/);
  });
});
