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
    expect(receipt.ownerCount).toBe(EXPECTED_MIGRATED_OWNER_COUNT);
    expect(receipt.legacyAuthorityAbsent).toBe(true);
    expect(receipt.inventoryDigest).toMatch(/^sha256:/u);
    expect(receipt.discoveryDigest).toMatch(/^sha256:/u);
    expect(receipt.accountingDigest).toMatch(/^sha256:/u);
  });
});
