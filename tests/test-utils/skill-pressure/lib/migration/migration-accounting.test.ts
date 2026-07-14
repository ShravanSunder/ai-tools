import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  EXPECTED_CURRENT_SCENARIO_COUNT,
  EXPECTED_LEGACY_SCENARIO_COUNT,
  EXPECTED_MIGRATED_OWNER_COUNT,
  verifyMigrationCutover,
} from "./migration-accounting.js";
import { loadEvaluationRegistry } from "../authority/evaluation-registry.js";
import { discoverSkillScenarios } from "../discovery/skill-discovery.js";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../../..");

describe("post-cutover migration accounting", () => {
  it("proves exact migrated ownership after legacy authority is removed", async () => {
    const discovery = await discoverSkillScenarios({ repositoryRoot });
    const registry = await loadEvaluationRegistry({
      repositoryRoot,
      registryPath: path.join(
        repositoryRoot,
        "tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml",
      ),
      knownScenarios: discovery.discovered,
    });
    const receipt = await verifyMigrationCutover({
      repositoryRoot,
      inventoryPath: path.join(
        repositoryRoot,
        "tests/test-utils/skill-pressure/config/legacy-scenario-migration.yaml",
      ),
      contracts: discovery.discovered,
      registry,
    });

    expect(receipt.scenarioCount).toBe(EXPECTED_CURRENT_SCENARIO_COUNT);
    expect(receipt.legacyScenarioCount).toBe(EXPECTED_LEGACY_SCENARIO_COUNT);
    expect(receipt.currentScenarioCount).toBe(EXPECTED_CURRENT_SCENARIO_COUNT);
    expect(receipt.activeScenarioCount).toBe(EXPECTED_CURRENT_SCENARIO_COUNT);
    expect(receipt.retiredScenarioCount).toBe(0);
    expect(receipt.postBaselineScenarioCount).toBe(2);
    expect(receipt.postBaselineScenarioIds).toEqual([
      "orchestrator-goal-artifact-content-boundary",
      "skills-creation-reference-lane-non-regression",
    ]);
    const artifactBoundaryScenario = discovery.discovered.find(
      (scenario) => scenario.scenarioId === "orchestrator-goal-artifact-content-boundary",
    );
    expect(artifactBoundaryScenario?.semanticAssertions).toEqual([
      expect.objectContaining({ evidenceSurface: "artifact:goal-contract" }),
    ]);
    expect(receipt.retiredScenarios).toEqual([]);
    expect(receipt.ownerCount).toBe(EXPECTED_MIGRATED_OWNER_COUNT);
    expect(receipt.legacyAuthorityAbsent).toBe(true);
    expect(receipt.scenarioRows).toHaveLength(EXPECTED_CURRENT_SCENARIO_COUNT);
    expect(receipt.scenarioRows[0]?.targetPath).toMatch(/^tests\//u);
    expect(receipt.scenarioRows.every((row) => row.evaluationRole === "diagnostic")).toBe(true);
    expect(receipt.scenarioRows.every((row) => row.validity === "valid")).toBe(true);
    expect(receipt.scenarioRows.every((row) => row.calibration === "uncalibrated")).toBe(true);
    expect(receipt.scenarioRows.every((row) => row.diagnosticReason === "uncalibrated")).toBe(true);
    expect(receipt.scenarioRows.every((row) => row.validityReview !== null)).toBe(true);
    expect(receipt.legacyScenarioIds).toHaveLength(EXPECTED_LEGACY_SCENARIO_COUNT);
    expect(receipt.legacyScenarioIds.length + receipt.postBaselineScenarioIds.length).toBe(EXPECTED_CURRENT_SCENARIO_COUNT);
    expect(receipt.scenarioRows.filter((row) => row.postBaseline).map((row) => row.globalScenarioId).sort()).toEqual([
      "orchestrator-goal-artifact-content-boundary",
      "skills-creation-reference-lane-non-regression",
    ]);
    expect(receipt.ownerCoverage.owners).toHaveLength(EXPECTED_MIGRATED_OWNER_COUNT);
    expect(receipt.ownerCoverage.owners.every((owner) => owner.gateCoveredBehaviorRequirementIds.length === 0)).toBe(true);
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
      "    target_path: tests/shravan-dev-workflow/debug-investigation/scenarios/debug-investigation-background-monitoring.md\n    disposition: migrate\n    retirement_reason: null",
      "    target_path: tests/shravan-dev-workflow/debug-investigation/scenarios/debug-investigation-background-monitoring.md\n    disposition: retire\n    retirement_reason: obsolete behavior",
    );
    const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "skill-pressure-migration-"));
    const temporaryInventoryPath = path.join(temporaryDirectory, "migration.yaml");
    await writeFile(temporaryInventoryPath, unauthorizedRetirement);

    await expect(verifyMigrationCutover({
      repositoryRoot,
      inventoryPath: temporaryInventoryPath,
    })).rejects.toThrow(/user_authorization/);
  });

  it("accepts registry and contract snapshots as verification inputs", async () => {
    const discovery = await discoverSkillScenarios({ repositoryRoot });
    const registry = {
      schemaVersion: 1 as const,
      scenarios: discovery.discovered.map((scenario) => ({
        scenarioId: scenario.scenarioId,
        behaviorContractDigest: scenario.behaviorContractDigest,
        evaluationRole: "diagnostic" as const,
        freshness: "uncalibrated" as const,
        validityReview: {
          receiptPath: "tests/test-utils/skill-pressure/config/authority-receipts/validity.json",
          receiptDigest: `sha256:${"a".repeat(64)}`,
        },
        calibrationReceipt: null,
        authorityHistory: [],
      })),
    };

    const receipt = await verifyMigrationCutover({
      repositoryRoot,
      inventoryPath: path.join(
        repositoryRoot,
        "tests/test-utils/skill-pressure/config/legacy-scenario-migration.yaml",
      ),
      contracts: discovery.discovered,
      registry,
    });

    expect(receipt.scenarioRows[0]).toMatchObject({
      evaluationRole: "diagnostic",
      validity: "valid",
      calibration: "uncalibrated",
    });
    expect(receipt.ownerCoverage.uncoveredBehaviorRequirementIds.length).toBeGreaterThan(0);
  });

  it("rejects a legacy inventory row that no longer maps to the immutable current corpus", async () => {
    const inventoryPath = path.join(
      repositoryRoot,
      "tests/test-utils/skill-pressure/config/legacy-scenario-migration.yaml",
    );
    const inventorySource = await readFile(inventoryPath, "utf8");
    const changedInventory = inventorySource.replace(
      "  - scenario_id: debug-investigation-background-monitoring",
      "  - scenario_id: replaced-legacy-row",
    );
    const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "skill-pressure-migration-row-"));
    const temporaryInventoryPath = path.join(temporaryDirectory, "migration.yaml");
    await writeFile(temporaryInventoryPath, changedInventory);

    await expect(verifyMigrationCutover({
      repositoryRoot,
      inventoryPath: temporaryInventoryPath,
    })).rejects.toThrow(/migration target was not discovered/u);
  });
});
