import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  loadSkillPressureCase,
  validateNoOrphanCaseDefinitions,
  validateUniqueSkillPressureCaseIdentities,
} from "./load-scenario-cases.js";
import { parseScenarioMarkdown } from "./parse-scenario-fixture.js";

describe("loadSkillPressureCase", () => {
  test("projects an in-scope fixture into subject-only input", async () => {
    const scenarioPath = join(
      import.meta.dirname,
      "../../../pressure-scenarios/shravan-dev-workflow/discuss-pathfinding/material-ambiguity.md",
    );
    const scenario = parseScenarioMarkdown({
      filePath: scenarioPath,
      markdown: readFileSync(scenarioPath, "utf8"),
    });

    const pressureCase = await loadSkillPressureCase(scenario);

    expect(pressureCase.input).toEqual({
      scenarioId: scenario.scenarioId,
      skillUnderTest: scenario.skillUnderTest,
      mode: scenario.mode,
      prompt: scenario.prompt,
    });
    expect(pressureCase.deterministicEvaluators.length).toBeGreaterThan(0);
    expect(pressureCase.semanticEvaluator).toBeDefined();
  });

  test("requires companions for the four in-scope skills", async () => {
    const scenario = parseScenarioMarkdown({
      filePath: "/missing/discuss-pathfinding/missing.md",
      markdown: `scenario_id: missing
skill_under_test: shravan-dev-workflow:discuss-pathfinding

## Prompt

Use the skill.
`,
    });

    await expect(loadSkillPressureCase(scenario)).rejects.toThrow(
      "requires a colocated evaluator definition",
    );
  });

  test("keeps unrelated scenarios eligible for legacy evaluation", async () => {
    const scenario = parseScenarioMarkdown({
      filePath: "/missing/other-skill/legacy.md",
      markdown: `scenario_id: legacy
skill_under_test: shravan-dev-workflow:other-skill

## Prompt

Use the skill.
`,
    });

    const pressureCase = await loadSkillPressureCase(scenario);

    expect(pressureCase.usesLegacyEvaluation).toBe(true);
    expect(pressureCase.semanticEvaluator).toBeUndefined();
  });

  test("rejects duplicate scenario identities during collection", async () => {
    const scenarioPath = join(
      import.meta.dirname,
      "../../../pressure-scenarios/shravan-dev-workflow/discuss-pathfinding/material-ambiguity.md",
    );
    const scenario = parseScenarioMarkdown({
      filePath: scenarioPath,
      markdown: readFileSync(scenarioPath, "utf8"),
    });
    const pressureCase = await loadSkillPressureCase(scenario);

    expect(() =>
      validateUniqueSkillPressureCaseIdentities([pressureCase, pressureCase]),
    ).toThrow(`Duplicate skill pressure scenario identity: ${scenario.scenarioId}`);
  });

  test("rejects a case definition without its Markdown fixture", () => {
    expect(() =>
      validateNoOrphanCaseDefinitions({
        caseDefinitionFiles: ["/scenarios/program-design/orphan.case.ts"],
        scenarioFixtureFiles: ["/scenarios/program-design/paired.md"],
      }),
    ).toThrow(
      "Case definition has no colocated Markdown fixture: /scenarios/program-design/orphan.case.ts",
    );
  });

  test("rejects a fixture and case definition with different identities", async () => {
    const scenarioPath = join(
      import.meta.dirname,
      "../../../fixtures/load-scenario-cases/mismatch.md",
    );
    const scenario = parseScenarioMarkdown({
      filePath: scenarioPath,
      markdown: readFileSync(scenarioPath, "utf8"),
    });

    await expect(loadSkillPressureCase(scenario)).rejects.toThrow(
      `Case definition scenario mismatch: ${scenarioPath.replace(/\.md$/, ".case.ts")}`,
    );
  });
});
