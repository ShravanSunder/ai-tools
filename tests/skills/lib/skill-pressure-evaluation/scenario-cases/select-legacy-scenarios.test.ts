import { describe, expect, test } from "vitest";
import { parseScenarioMarkdown } from "./parse-scenario-fixture.js";
import { shouldRunSkillPressureCase } from "./select-legacy-scenarios.js";
import type { SkillPressureCase } from "./scenario-case-types.js";

function createCase(
  mode: "fast" | "integration" | "baseline",
  usesLegacyEvaluation = true,
): SkillPressureCase {
  const scenario = parseScenarioMarkdown({
    filePath: `/repo/tests/skills/pressure-scenarios/${mode}.md`,
    markdown: `scenario_id: ${mode}
skill_under_test: shravan-dev-workflow:test-skill
mode: ${mode}

## Prompt

Use the skill.
`,
  });
  return {
    id: scenario.scenarioId,
    name: scenario.scenarioId,
    tags: [scenario.skillUnderTest],
    scenario,
    input: {
      scenarioId: scenario.scenarioId,
      skillUnderTest: scenario.skillUnderTest,
      mode: scenario.mode,
      prompt: scenario.prompt,
    },
    deterministicEvaluators: [],
    usesLegacyEvaluation,
  };
}

describe("shouldRunSkillPressureCase", () => {
  test("keeps fast mode selected when no specific scenario is selected", () => {
    expect(
      shouldRunSkillPressureCase({
        skillPressureCase: createCase("fast"),
        selectedMode: "fast",
        selectedScenario: undefined,
      }),
    ).toBe(true);
    expect(
      shouldRunSkillPressureCase({
        skillPressureCase: createCase("integration"),
        selectedMode: "fast",
        selectedScenario: undefined,
      }),
    ).toBe(false);
  });

  test("keeps an explicitly selected scenario regardless of mode", () => {
    expect(
      shouldRunSkillPressureCase({
        skillPressureCase: createCase("integration"),
        selectedMode: "fast",
        selectedScenario: "integration",
      }),
    ).toBe(true);
  });

  test("runs every mode when no mode is selected", () => {
    expect(
      shouldRunSkillPressureCase({
        skillPressureCase: createCase("baseline"),
        selectedMode: undefined,
        selectedScenario: undefined,
      }),
    ).toBe(true);
  });

  test("keeps evaluator cases when no exact scenario is selected", () => {
    expect(
      shouldRunSkillPressureCase({
        skillPressureCase: createCase("integration", false),
        selectedMode: "fast",
        selectedScenario: undefined,
      }),
    ).toBe(true);
  });

  test("filters evaluator cases by exact scenario identity", () => {
    expect(
      shouldRunSkillPressureCase({
        skillPressureCase: createCase("integration", false),
        selectedMode: "fast",
        selectedScenario: "fast",
      }),
    ).toBe(false);
    expect(
      shouldRunSkillPressureCase({
        skillPressureCase: createCase("integration", false),
        selectedMode: "fast",
        selectedScenario: "integration",
      }),
    ).toBe(true);
  });
});
