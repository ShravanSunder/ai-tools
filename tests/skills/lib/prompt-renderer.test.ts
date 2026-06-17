import { describe, expect, test } from "vitest";
import { parseScenarioMarkdown } from "./scenario-parser.js";
import {
  findPromptRegexLeaks,
  renderCodexPressurePrompt,
} from "./prompt-renderer.js";

const scenario = parseScenarioMarkdown({
  filePath: "/repo/tests/skills/pressure-scenarios/render.md",
  markdown: `scenario_id: render
skill_under_test: shravan-dev-workflow:test-skill
mode: fast
expect_artifact: false
expect_proof_regex: hidden proof phrase

## Prompt

Use the skill without seeing the rubric.

## Expected Compliant Behavior

hidden proof phrase

## Failure Signals

failure phrase
`,
});

describe("renderCodexPressurePrompt", () => {
  test("renders the current pressure-test envelope and operator prompt", () => {
    const prompt = renderCodexPressurePrompt({ scenario });

    expect(prompt).toContain("You are running a Codex skill pressure test.");
    expect(prompt).toContain("- Stay read-only unless the scenario explicitly permits edits.");
    expect(prompt).toContain("- scenario_id: render");
    expect(prompt).toContain("- skill_under_test: shravan-dev-workflow:test-skill");
    expect(prompt).toContain("Operator prompt:");
    expect(prompt).toContain("Use the skill without seeing the rubric.");
  });

  test("does not render grader-only sections or regex metadata", () => {
    const prompt = renderCodexPressurePrompt({ scenario });

    expect(prompt).not.toContain("Expected Compliant Behavior");
    expect(prompt).not.toContain("Failure Signals");
    expect(prompt).not.toContain("hidden proof phrase");
    expect(prompt).not.toContain("failure phrase");
    expect(prompt).not.toContain("expect_proof_regex");
  });
});

describe("findPromptRegexLeaks", () => {
  test("returns proof regexes that match the model-visible prompt", () => {
    const leaks = findPromptRegexLeaks({
      prompt: "The operator prompt says full proof loop.",
      regexes: ["full proof loop", "checkpoint commit"],
    });

    expect(leaks).toEqual(["full proof loop"]);
  });

  test("matches case-insensitively by lowercasing the prompt", () => {
    const leaks = findPromptRegexLeaks({
      prompt: "The operator prompt says FULL PROOF LOOP.",
      regexes: ["full proof loop"],
    });

    expect(leaks).toEqual(["full proof loop"]);
  });
});
