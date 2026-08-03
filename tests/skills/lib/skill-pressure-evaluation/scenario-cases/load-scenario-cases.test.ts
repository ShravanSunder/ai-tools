import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  loadSkillPressureCase,
  validateNoOrphanCaseDefinitions,
  validateUniqueSkillPressureCaseDefinitionIdentities,
  validateUniqueSkillPressureCaseIdentities,
} from "./load-scenario-cases.js";
import { parseScenarioMarkdown } from "./parse-scenario-fixture.js";
import type { SkillPressureCaseDefinition } from "./scenario-case-types.js";

describe("loadSkillPressureCase", () => {
  test("projects an in-scope fixture into subject-only input", async () => {
    const scenarioPath = join(
      import.meta.dirname,
      "../../../pressure-scenarios/shravan-dev-workflow/discuss-pathfinding/explain-meaningful-choice.md",
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

  test("requires registries for the four in-scope skills", async () => {
    const scenario = parseScenarioMarkdown({
      filePath: "/missing/discuss-pathfinding/missing.md",
      markdown: `scenario_id: missing
skill_under_test: shravan-dev-workflow:discuss-pathfinding

## Prompt

Use the skill.
`,
    });

    await expect(loadSkillPressureCase(scenario)).rejects.toThrow(
      "requires a skill-folder evaluator registry",
    );
  });

  test("loads a scenario definition from its skill-folder named registry", async () => {
    const scenarioPath = join(
      import.meta.dirname,
      "../../../fixtures/load-scenario-cases/valid.md",
    );
    const scenario = parseScenarioMarkdown({
      filePath: scenarioPath,
      markdown: readFileSync(scenarioPath, "utf8"),
    });

    const pressureCase = await loadSkillPressureCase(scenario);

    expect(pressureCase.id).toBe("fixture-scenario");
    expect(pressureCase.deterministicEvaluators.length).toBeGreaterThan(0);
    expect(pressureCase.semanticEvaluator).toBeDefined();
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
      "../../../pressure-scenarios/shravan-dev-workflow/discuss-pathfinding/explain-meaningful-choice.md",
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

  test("rejects duplicate definitions inside one folder registry", () => {
    const duplicateDefinitions = [
      {
        scenarioId: "duplicate-scenario",
        semanticCriteria: [],
      },
      {
        scenarioId: "duplicate-scenario",
        semanticCriteria: [],
      },
    ] satisfies readonly SkillPressureCaseDefinition[];

    expect(() =>
      validateUniqueSkillPressureCaseDefinitionIdentities({
        caseDefinitions: duplicateDefinitions,
        caseRegistryPath: "/scenarios/example-skill/cases.ts",
      }),
    ).toThrow(
      "Duplicate skill pressure case definition identity: duplicate-scenario (/scenarios/example-skill/cases.ts)",
    );
  });

  test("rejects a folder-registry definition without its Markdown fixture", async () => {
    const fixtureDirectory = join(
      import.meta.dirname,
      "../../../fixtures/load-scenario-cases",
    );
    const validScenarioPath = join(fixtureDirectory, "valid.md");
    const validScenario = parseScenarioMarkdown({
      filePath: validScenarioPath,
      markdown: readFileSync(validScenarioPath, "utf8"),
    });

    await expect(
      validateNoOrphanCaseDefinitions({
        caseRegistryFiles: [join(fixtureDirectory, "cases.ts")],
        scenarios: [validScenario],
      }),
    ).rejects.toThrow(
      "Case registry definition has no colocated Markdown fixture: different-scenario",
    );
  });

  test("rejects a fixture missing from its folder registry", async () => {
    const scenarioPath = join(
      import.meta.dirname,
      "../../../fixtures/load-scenario-cases/mismatch.md",
    );
    const scenario = parseScenarioMarkdown({
      filePath: scenarioPath,
      markdown: readFileSync(scenarioPath, "utf8"),
    });

    await expect(loadSkillPressureCase(scenario)).rejects.toThrow(
      `Case registry does not define scenario ${scenario.scenarioId}`,
    );
  });
});
