import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import {
  parseScenarioMarkdown,
  validateScenarioFilePlacement,
} from "./parse-scenario-fixture.js";

const repeatedMetadataScenario = `scenario_id: repeated-fields
skill_under_test: shravan-dev-workflow:test-skill
mode: fast
expect_decision_regex: first decision
expect_decision_regex: second decision
expect_proof_regex: first proof
expect_proof_regex: second proof

## Prompt

Do the thing.

## Expected Compliant Behavior

The agent follows both decision expectations.

## Failure Signals

The agent only follows one expectation.
`;

describe("parseScenarioMarkdown", () => {
  test("parses repeated metadata fields as arrays", () => {
    const scenario = parseScenarioMarkdown({
      filePath: "/repo/tests/skills/pressure-scenarios/repeated-fields.md",
      markdown: repeatedMetadataScenario,
    });

    expect(scenario.scenarioId).toBe("repeated-fields");
    expect(scenario.skillUnderTest).toBe("shravan-dev-workflow:test-skill");
    expect(scenario.expectDecisionRegexes).toEqual([
      "first decision",
      "second decision",
    ]);
    expect(scenario.expectProofRegexes).toEqual([
      "first proof",
      "second proof",
    ]);
  });

  test("applies defaults for optional expectation metadata", () => {
    const scenario = parseScenarioMarkdown({
      filePath: "/repo/tests/skills/pressure-scenarios/defaults.md",
      markdown: `scenario_id: defaults
skill_under_test: shravan-dev-workflow:test-skill

## Prompt

Stay read-only.
`,
    });

    expect(scenario.mode).toBe("fast");
    expect(scenario.expectReadOnly).toBe(true);
    expect(scenario.expectArtifact).toBe(false);
    expect(scenario.expectDecisionRegexes).toEqual(["."]);
    expect(scenario.expectProofRegexes).toEqual([]);
    expect(scenario.expectForbiddenRegexes).toEqual([]);
  });

  test("extracts prompt, expected behavior, and failure signal sections", () => {
    const scenario = parseScenarioMarkdown({
      filePath:
        "/repo/tests/skills/pressure-scenarios/discuss-pathfinding-example.md",
      markdown: repeatedMetadataScenario,
    });

    expect(scenario.prompt).toContain("Do the thing.");
    expect(scenario.expectedCompliantBehavior).toContain(
      "follows both decision expectations",
    );
    expect(scenario.failureSignals).toContain("only follows one expectation");
  });

  test("trims metadata keys and values", () => {
    const scenario = parseScenarioMarkdown({
      filePath: "/repo/tests/skills/pressure-scenarios/trimmed.md",
      markdown: `scenario_id : trimmed-scenario
skill_under_test: shravan-dev-workflow:test-skill
mode: fast
expect_decision_regex: ${"trimmed decision  "}

## Prompt

Use the skill.
`,
    });

    expect(scenario.scenarioId).toBe("trimmed-scenario");
    expect(scenario.expectDecisionRegexes).toEqual(["trimmed decision"]);
  });

  test("rejects scenarios without required identity metadata", () => {
    expect(() =>
      parseScenarioMarkdown({
        filePath: "/repo/tests/skills/pressure-scenarios/bad.md",
        markdown: `skill_under_test: shravan-dev-workflow:test-skill

## Prompt

No id.
`,
      }),
    ).toThrow(/scenario_id/);
  });

  test("rejects scenarios without a prompt section", () => {
    expect(() =>
      parseScenarioMarkdown({
        filePath: "/repo/tests/skills/pressure-scenarios/bad.md",
        markdown: `scenario_id: bad
skill_under_test: shravan-dev-workflow:test-skill
`,
      }),
    ).toThrow(/Prompt/);
  });

  test("new delegation scenarios do not forbid compliant negations", () => {
    const repoRoot = path.resolve(import.meta.dirname, "../../../../..");
    const cases = [
      {
        relativePath:
          "tests/skills/pressure-scenarios/shravan-dev-workflow/manage-agents/main-default-after-ready-plan.md",
        compliant:
          "The Sidekick does not automatically become the default user contact; Main remains the default conversation.",
        violation: "The Sidekick automatically becomes the default user contact.",
      },
      {
        relativePath:
          "tests/skills/pressure-scenarios/shravan-dev-workflow/manage-agents/no-relay-supervisor.md",
        compliant:
          "Do not create a supervisor whose only job is to relay Worker updates.",
        violation: "Create a supervisor to relay every Worker update.",
      },
    ] as const;

    for (const fixtureCase of cases) {
      const filePath = path.join(repoRoot, fixtureCase.relativePath);
      const scenario = parseScenarioMarkdown({
        filePath,
        markdown: readFileSync(filePath, "utf8"),
      });
      expect(scenario.expectForbiddenRegexes).toHaveLength(1);
      const forbiddenPattern = new RegExp(
        scenario.expectForbiddenRegexes[0] ?? "",
        "i",
      );
      expect(forbiddenPattern.test(fixtureCase.compliant)).toBe(false);
      expect(forbiddenPattern.test(fixtureCase.violation)).toBe(true);
    }
  });
});

describe("validateScenarioFilePlacement", () => {
  test("accepts plugin and skill folders matching skill_under_test", () => {
    const scenarioDirectory = "/repo/tests/skills/pressure-scenarios";
    const scenario = parseScenarioMarkdown({
      filePath: `${scenarioDirectory}/shravan-dev-workflow/spec-design/boundary.md`,
      markdown: `scenario_id: spec-design-boundary
skill_under_test: shravan-dev-workflow:spec-design

## Prompt

Use the skill.
`,
    });

    expect(() =>
      validateScenarioFilePlacement({ scenarioDirectory, scenario }),
    ).not.toThrow();
  });

  test("rejects a flat or mismatched scenario location", () => {
    const scenarioDirectory = "/repo/tests/skills/pressure-scenarios";
    const scenario = parseScenarioMarkdown({
      filePath: `${scenarioDirectory}/spec-design-boundary.md`,
      markdown: `scenario_id: spec-design-boundary
skill_under_test: shravan-dev-workflow:spec-design

## Prompt

Use the skill.
`,
    });

    expect(() =>
      validateScenarioFilePlacement({ scenarioDirectory, scenario }),
    ).toThrow("pressure-scenarios/<plugin>/<skill>");
  });
});
