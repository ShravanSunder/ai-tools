import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { createRepositoryFixture, scenarioContract } from "../test-fixtures.js";
import { loadScenarioContract } from "./skill-contracts.js";

describe("skill pressure scenario contract", () => {
  it("loads the behavioral fields and keeps the rubric separate from the prompt", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(scenarioPath, scenarioContract({ scenarioId: "behavior", plugin: "workflow", skill: "skill" }));

    await expect(loadScenarioContract({ scenarioPath })).resolves.toMatchObject({
      scenarioId: "behavior",
      plugin: "workflow",
      skill: "skill",
      skillType: "discipline",
      prompt: "Follow the requested workflow under time pressure.",
      hiddenRubric: "The response must reject the shortcut and follow the workflow.",
      baseline: "no_skill",
      repetitions: 5,
      risk: "standard",
    });
  });

  it("rejects fewer than five repetitions", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(scenarioPath, scenarioContract({ scenarioId: "too-few", plugin: "workflow", skill: "skill", repetitions: 4 }));

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/repetitions/);
  });

  it("rejects owner fields that disagree with the owner path", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(scenarioPath, scenarioContract({ scenarioId: "wrong-owner", plugin: "wrong", skill: "skill" }));

    await expect(
      loadScenarioContract({ scenarioPath, expectedOwner: { plugin: "workflow", skill: "skill" } }),
    ).rejects.toThrow(/owner fields/);
  });

  it("rejects duplicate deterministic check ids", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    const source = scenarioContract({ scenarioId: "duplicate", plugin: "workflow", skill: "skill" })
      .replace("deterministic_checks: []", `deterministic_checks:
  - check_id: same
    fact: visible_response
    operator: contains
    expected: first
  - check_id: same
    fact: visible_response
    operator: contains
    expected: second`);
    await writeFile(scenarioPath, source);

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/duplicate check_id/);
  });
});
