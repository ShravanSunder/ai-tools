import { describe, expect, test } from "vitest";
import { parseScenarioMarkdown } from "../scenario-cases/parse-scenario-fixture.js";
import {
  findPromptRegexLeaks,
  renderCodexPressurePrompt,
  renderFollowUpUserTurn,
} from "./render-subject-prompt.js";

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
const input = {
  scenarioId: scenario.scenarioId,
  skillUnderTest: scenario.skillUnderTest,
  mode: scenario.mode,
  prompt: scenario.prompt,
  requiredSourceReads: [
    "plugins/shravan-dev-workflow/skills/test-skill/SKILL.md",
    "tests/skills/fixtures/example.md",
  ],
};

describe("renderCodexPressurePrompt", () => {
  test("renders the current pressure-test envelope and operator prompt", () => {
    const prompt = renderCodexPressurePrompt({
      input,
      includeLocalSourceHint: true,
    });

    expect(prompt).toContain("You are running a Codex skill pressure test.");
    expect(prompt).toContain("- Stay read-only unless the scenario explicitly permits edits.");
    expect(prompt).toContain("- scenario_id: render");
    expect(prompt).toContain("- skill_under_test: shravan-dev-workflow:test-skill");
    expect(prompt).toContain(
      "from the compliant behavior required in this run",
    );
    expect(prompt).toContain(
      "plugins/shravan-dev-workflow/skills/test-skill/SKILL.md",
    );
    expect(prompt).toContain("repo-local skill source is authoritative");
    expect(prompt).toContain("Required source evidence:");
    expect(prompt).toContain("Read every path below before answering");
    expect(prompt).toContain("without a separate line-count preflight");
    expect(prompt).toContain("case registries");
    expect(prompt).toContain("exact `--- <required path>` line");
    expect(prompt).toContain("tests/skills/fixtures/example.md");
    expect(prompt).toContain("Operator prompt:");
    expect(prompt).toContain("Use the skill without seeing the rubric.");
  });

  test("does not render grader-only sections or regex metadata", () => {
    const prompt = renderCodexPressurePrompt({ input });

    expect(prompt).not.toContain("Expected Compliant Behavior");
    expect(prompt).not.toContain("Failure Signals");
    expect(prompt).not.toContain("hidden proof phrase");
    expect(prompt).not.toContain("failure phrase");
    expect(prompt).not.toContain("expect_proof_regex");
    expect(prompt).not.toContain("repo-local skill source is authoritative");
    expect(prompt).toContain("Required source evidence:");
  });

  test("forbids test-machinery inspection without required source reads", () => {
    const prompt = renderCodexPressurePrompt({
      input: { ...input, requiredSourceReads: [] },
    });

    expect(prompt).toContain(
      "Do not inspect pressure-scenario fixtures, case registries, evaluator code, grader artifacts, or the current diff",
    );
    expect(prompt).not.toContain("Required source evidence:");
  });
});

describe("renderFollowUpUserTurn", () => {
  test("wraps the operator message with the transport reminder", () => {
    const rendered = renderFollowUpUserTurn("You were right; wrap this up.");

    expect(rendered).toContain("Operator follow-up message:");
    expect(rendered).toContain("You were right; wrap this up.");
    expect(rendered).toContain("Return only JSON matching the supplied schema");
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

  test("ignores invalid regexes during prompt leak detection", () => {
    const leaks = findPromptRegexLeaks({
      prompt: "The operator prompt says FULL PROOF LOOP.",
      regexes: ["(", "full proof loop"],
    });

    expect(leaks).toEqual(["full proof loop"]);
  });
});
