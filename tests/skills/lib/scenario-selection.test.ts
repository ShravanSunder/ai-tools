import { describe, expect, test } from "vitest";
import { parseScenarioMarkdown } from "./scenario-parser.js";
import { shouldRunSkillPressureCase } from "./scenario-selection.js";
import type { SkillPressureCase } from "./skill-pressure-harness.js";

function createCase(mode: "fast" | "integration" | "baseline"): SkillPressureCase {
  return {
    scenario: parseScenarioMarkdown({
      filePath: `/repo/tests/skills/pressure-scenarios/${mode}.md`,
      markdown: `scenario_id: ${mode}
skill_under_test: shravan-dev-workflow:test-skill
mode: ${mode}

## Prompt

Use the skill.
`,
    }),
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
});
