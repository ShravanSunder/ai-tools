import { mkdir, symlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { addSkillFixture, createRepositoryFixture } from "../test-fixtures.js";
import { discoverSkillScenarios } from "./skill-discovery.js";

describe("skill scenario discovery", () => {
  it("discovers recursive owner scenarios in deterministic global-id order", async () => {
    const repositoryRoot = await createRepositoryFixture();
    await addSkillFixture(repositoryRoot, {
      plugin: "workflow",
      skill: "alpha",
      scenarios: [
        { scenarioId: "zeta", relativePath: "scenarios/nested/zeta.md" },
        { scenarioId: "alpha", relativePath: "scenarios/alpha.md" },
      ],
    });
    await mkdir(join(repositoryRoot, "tests/test-utils/ignored/scenarios"), { recursive: true });
    await writeFile(join(repositoryRoot, "tests/test-utils/ignored/scenarios/ignored.md"), "ignored");

    const receipt = await discoverSkillScenarios({ repositoryRoot });

    expect(receipt.discovered.map((scenario) => scenario.scenarioId)).toEqual(["alpha", "zeta"]);
    expect(receipt.invalid).toEqual([]);
  });

  it("reports duplicate and unknown selected scenario ids", async () => {
    const repositoryRoot = await createRepositoryFixture();
    await addSkillFixture(repositoryRoot, { plugin: "workflow", skill: "first", scenarios: [{ scenarioId: "duplicate", relativePath: "scenarios/one.md" }] });
    await addSkillFixture(repositoryRoot, { plugin: "workflow", skill: "second", scenarios: [{ scenarioId: "duplicate", relativePath: "scenarios/two.md" }] });

    const receipt = await discoverSkillScenarios({ repositoryRoot, selectedScenarioIds: ["duplicate", "unknown"] });

    expect(receipt.selected).toEqual([]);
    expect(receipt.invalid).toEqual(expect.arrayContaining([
      expect.objectContaining({ reason: "duplicate_scenario_id" }),
      expect.objectContaining({ reason: "unmapped_scenario_id" }),
    ]));
  });

  it("records valid unselected scenarios as skipped", async () => {
    const repositoryRoot = await createRepositoryFixture();
    await addSkillFixture(repositoryRoot, {
      plugin: "workflow",
      skill: "selection",
      scenarios: [
        { scenarioId: "selected", relativePath: "scenarios/selected.md" },
        { scenarioId: "skipped", relativePath: "scenarios/skipped.md" },
      ],
    });

    const receipt = await discoverSkillScenarios({ repositoryRoot, selectedScenarioIds: ["selected"] });

    expect(receipt.selected.map((scenario) => scenario.scenarioId)).toEqual(["selected"]);
    expect(receipt.skipped.map((scenario) => scenario.scenarioId)).toEqual(["skipped"]);
  });

  it("reports symlinked and Git-boundary owners as invalid", async () => {
    const repositoryRoot = await createRepositoryFixture();
    await mkdir(join(repositoryRoot, "tests/real-plugin/real-skill"), { recursive: true });
    await symlink("real-plugin", join(repositoryRoot, "tests/linked-plugin"));
    await mkdir(join(repositoryRoot, "tests/submodule-plugin/skill"), { recursive: true });
    await writeFile(join(repositoryRoot, "tests/submodule-plugin/.git"), "gitdir: fixture\n");

    const receipt = await discoverSkillScenarios({ repositoryRoot });

    expect(receipt.invalid).toEqual(expect.arrayContaining([
      expect.objectContaining({ reason: "owner_symlink" }),
      expect.objectContaining({ reason: "owner_submodule" }),
    ]));
  });
});
