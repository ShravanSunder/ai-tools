import { describe, expect, test } from "vitest";
import { parseScenarioMarkdown } from "./scenario-parser.js";
import type { SkillPressureResult } from "./result-schema.js";
import { validateSkillPressureResult } from "./result-schema.js";
import { evaluatePressureAssertions } from "./pressure-assertions.js";

const scenario = parseScenarioMarkdown({
  filePath: "/repo/tests/skills/pressure-scenarios/assertions.md",
  markdown: `scenario_id: assertions
skill_under_test: shravan-dev-workflow:test-skill
expect_decision_regex: first decision
expect_decision_regex: second decision
expect_proof_regex: proof one
expect_proof_regex: proof two
expect_forbidden_regex: forbidden phrase

## Prompt

Ask the agent to use the skill.
`,
});

const validResult: SkillPressureResult = {
  scenario_id: "assertions",
  skill_under_test: "shravan-dev-workflow:test-skill",
  skill_invoked: true,
  mode: "fast",
  read_only: true,
  artifact_expected: false,
  artifact_created: false,
  decision: "The first decision and second decision were both handled.",
  coverage_evidence: ["proof one", "proof two"],
  shortcut_resisted: true,
  rationalizations_rejected: ["did not skip proof"],
  open_questions: [],
  next_action: "none",
};

describe("validateSkillPressureResult", () => {
  test("accepts a result matching the existing JSON schema", () => {
    expect(validateSkillPressureResult(validResult)).toEqual({
      ok: true,
      value: validResult,
    });
  });

  test("rejects a result missing required schema fields", () => {
    const result = validateSkillPressureResult({
      scenario_id: "assertions",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("must have required property");
    }
  });
});

describe("evaluatePressureAssertions", () => {
  test("passes when all deterministic expectations are satisfied", () => {
    const result = evaluatePressureAssertions({
      scenario,
      result: validResult,
      renderedPrompt: "Ask the agent to use the skill.",
      readOnlyRequested: true,
      artifactPaths: ["/tmp/final.json", "/tmp/events.jsonl"],
    });

    expect(result.failures).toEqual([]);
  });

  test("evaluates all repeated decision and proof regexes", () => {
    const result = evaluatePressureAssertions({
      scenario,
      result: {
        ...validResult,
        decision: "Only the first decision was handled.",
        coverage_evidence: ["proof one"],
      },
      renderedPrompt: "Ask the agent to use the skill.",
      readOnlyRequested: true,
      artifactPaths: ["/tmp/final.json"],
    });

    expect(result.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("decision regex 2"),
        expect.stringContaining("proof regex 2"),
      ]),
    );
  });

  test("fails when forbidden regexes match the proof surface", () => {
    const result = evaluatePressureAssertions({
      scenario,
      result: {
        ...validResult,
        coverage_evidence: ["proof one", "proof two", "forbidden phrase"],
      },
      renderedPrompt: "Ask the agent to use the skill.",
      readOnlyRequested: true,
      artifactPaths: ["/tmp/final.json"],
    });

    expect(result.failures).toEqual([
      expect.stringContaining("forbidden regex 1"),
    ]);
  });

  test("accumulates identity and expectation failures", () => {
    const result = evaluatePressureAssertions({
      scenario,
      result: {
        ...validResult,
        scenario_id: "wrong",
        skill_invoked: false,
        shortcut_resisted: false,
      },
      renderedPrompt: "Ask the agent to use the skill.",
      readOnlyRequested: false,
      artifactPaths: [],
    });

    expect(result.failures.length).toBeGreaterThanOrEqual(4);
    expect(result.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("scenario_id"),
        expect.stringContaining("skill_invoked"),
        expect.stringContaining("shortcut_resisted"),
        expect.stringContaining("read-only"),
      ]),
    );
  });
});
