import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  EXPECTED_MIGRATED_OWNER_COUNT,
  EXPECTED_MIGRATED_SCENARIO_COUNT,
  verifyMigrationCutover,
} from "./migration-accounting.js";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../../..");

describe("post-cutover migration accounting", () => {
  it("proves exact migrated ownership after legacy authority is removed", async () => {
    const receipt = await verifyMigrationCutover({
      repositoryRoot,
      inventoryPath: path.join(
        repositoryRoot,
        "tests/test-utils/skill-pressure/config/legacy-scenario-migration.yaml",
      ),
    });

    expect(receipt.scenarioCount).toBe(EXPECTED_MIGRATED_SCENARIO_COUNT);
    expect(receipt.activeScenarioCount).toBe(EXPECTED_MIGRATED_SCENARIO_COUNT);
    expect(receipt.retiredScenarioCount).toBe(0);
    expect(receipt.postBaselineScenarioCount).toBe(1);
    expect(receipt.retiredScenarios).toEqual([]);
    expect(receipt.ownerCount).toBe(EXPECTED_MIGRATED_OWNER_COUNT);
    expect(receipt.legacyAuthorityAbsent).toBe(true);
    expect(receipt.inventoryDigest).toMatch(/^sha256:/u);
    expect(receipt.discoveryDigest).toMatch(/^sha256:/u);
    expect(receipt.accountingDigest).toMatch(/^sha256:/u);
  });

  it("rejects retirement without an explicit user authorization receipt", async () => {
    const inventoryPath = path.join(
      repositoryRoot,
      "tests/test-utils/skill-pressure/config/legacy-scenario-migration.yaml",
    );
    const inventorySource = await readFile(inventoryPath, "utf8");
    const unauthorizedRetirement = inventorySource.replace(
      "    disposition: migrate\n    retirement_reason: null",
      "    disposition: retire\n    retirement_reason: obsolete behavior",
    );
    const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "skill-pressure-migration-"));
    const temporaryInventoryPath = path.join(temporaryDirectory, "migration.yaml");
    await writeFile(temporaryInventoryPath, unauthorizedRetirement);

    await expect(verifyMigrationCutover({
      repositoryRoot,
      inventoryPath: temporaryInventoryPath,
    })).rejects.toThrow(/user_authorization/);
  });
});
