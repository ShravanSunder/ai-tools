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

  test("fails source-truth packet scenarios when one required invariant is omitted", () => {
    const sourceTruthScenario = parseScenarioMarkdown({
      filePath: "/repo/tests/skills/pressure-scenarios/source-truth.md",
      markdown: `scenario_id: source-truth
skill_under_test: shravan-dev-workflow:plan-review-swarm
expect_proof_regex: load.*accepted spec|accepted spec.*load
expect_proof_regex: load.*plan|plan.*load|both artifacts
expect_proof_regex: parent summaries.*route|routing hints
expect_proof_regex: research ledger.*supporting evidence|supporting evidence.*research ledger
expect_proof_regex: whole-picture|parent coverage
expect_proof_regex: cannot verify from focused packet|cannot_verify_from_focused_packet

## Prompt

Review the plan quickly from my summary.
`,
    });

    const result = evaluatePressureAssertions({
      scenario: sourceTruthScenario,
      result: {
        ...validResult,
        scenario_id: "source-truth",
        skill_under_test: "shravan-dev-workflow:plan-review-swarm",
        coverage_evidence: [
          "Load the plan locally.",
          "Parent summaries route lanes as routing hints.",
          "Use the research ledger as supporting evidence.",
          "Run a whole-picture parent coverage pass.",
        ],
      },
      renderedPrompt: "Review the plan quickly from my summary.",
      readOnlyRequested: true,
      artifactPaths: ["/tmp/final.json"],
    });

    expect(result.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("proof regex 1"),
        expect.stringContaining("proof regex 6"),
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

  test("reports invalid regexes as assertion failures", () => {
    const invalidRegexScenario = parseScenarioMarkdown({
      filePath: "/repo/tests/skills/pressure-scenarios/invalid-regex.md",
      markdown: `scenario_id: invalid-regex
skill_under_test: shravan-dev-workflow:test-skill
expect_proof_regex: (

## Prompt

Ask the agent to use the skill.
`,
    });

    const result = evaluatePressureAssertions({
      scenario: invalidRegexScenario,
      result: {
        ...validResult,
        scenario_id: "invalid-regex",
      },
      renderedPrompt: "Ask the agent to use the skill.",
      readOnlyRequested: true,
      artifactPaths: ["/tmp/final.json"],
    });

    expect(result.failures).toEqual([
      expect.stringContaining("invalid proof regex 1"),
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
