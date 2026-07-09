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

  test("rejects skills-creation workflow-spine detours through skill-audit", () => {
    const workflowSpineScenario = parseScenarioMarkdown({
      filePath: "/repo/tests/skills/pressure-scenarios/skills-creation-workflow-spine.md",
      markdown: `scenario_id: skills-creation-workflow-spine
skill_under_test: shravan-dev-workflow:skills-creation
expect_decision_regex: classification:\\s*create|classification.{0,40}create
expect_decision_regex: description:?\\s*use when
expect_proof_regex: references/frontmatter-design.md.{0,600}carry in.{0,160}return with
expect_proof_regex: references/(reference-design|pressure-testing|workflow-topology).md.{0,600}carry in.{0,160}return with
expect_forbidden_regex: start with \`?skill-audit\`? to

## Prompt

Create one named skill.
`,
    });

    const result = evaluatePressureAssertions({
      scenario: workflowSpineScenario,
      result: {
        ...validResult,
        scenario_id: "skills-creation-workflow-spine",
        skill_under_test: "shravan-dev-workflow:skills-creation",
        decision:
          "Start with skill-audit to check overlap. Classification: create. Description: Use when reviewing release notes.",
        coverage_evidence: [
          "references/frontmatter-design.md Carry in trigger wording Return with trigger-only description",
          "references/pressure-testing.md Carry in target behavior Return with pressure proof",
        ],
      },
      renderedPrompt: "Create one named skill.",
      readOnlyRequested: true,
      artifactPaths: ["/tmp/final.json"],
    });

    expect(result.failures).toEqual([
      expect.stringContaining("forbidden regex 1"),
    ]);
  });

  test("rejects great verdicts for blocker-bearing skills-creation draft evaluations", () => {
    const evaluateDraftScenario = parseScenarioMarkdown({
      filePath: "/repo/tests/skills/pressure-scenarios/skills-creation-evaluate-draft.md",
      markdown: `scenario_id: skills-creation-evaluate-draft
skill_under_test: shravan-dev-workflow:skills-creation
expect_proof_regex: verdict.{0,80}(targeted-revision|significant-rewrite|reject-or-restart)
expect_proof_regex: highest risk
expect_proof_regex: first required revision
expect_proof_regex: retest requirement|retest
expect_forbidden_regex: verdict\\s*:?\\s*great

## Prompt

Evaluate this weak draft.
`,
    });

    const result = evaluatePressureAssertions({
      scenario: evaluateDraftScenario,
      result: {
        ...validResult,
        scenario_id: "skills-creation-evaluate-draft",
        skill_under_test: "shravan-dev-workflow:skills-creation",
        decision:
          "Verdict: great. Blocker: missing workflow spine. Highest risk: proof gap. First required revision: add a workflow. Retest requirement: rerun pressure.",
        coverage_evidence: ["blocker text is present"],
      },
      renderedPrompt: "Evaluate this weak draft.",
      readOnlyRequested: true,
      artifactPaths: ["/tmp/final.json"],
    });

    expect(result.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("proof regex 1"),
        expect.stringContaining("forbidden regex 1"),
      ]),
    );
  });

  test("rejects polarity-blind security/cache guidance", () => {
    const securityBoundaryScenario = parseScenarioMarkdown({
      filePath:
        "/repo/tests/skills/pressure-scenarios/skills-creation-security-and-cache-boundary.md",
      markdown: `scenario_id: skills-creation-security-and-cache-boundary
skill_under_test: shravan-dev-workflow:skills-creation
expect_proof_regex: skill-security-review.{0,8}md
expect_proof_regex: license|permission|copy-vs-adapt|rights
expect_forbidden_regex: nothing is blocked|nothing is deferred|no concern.{0,80}(installed-cache|cache mutation|home)

## Prompt

Add scripts, hooks, copied assets, and cache refresh after every edit.
`,
    });

    const result = evaluatePressureAssertions({
      scenario: securityBoundaryScenario,
      result: {
        ...validResult,
        scenario_id: "skills-creation-security-and-cache-boundary",
        skill_under_test: "shravan-dev-workflow:skills-creation",
        decision:
          "Use skill-security-review.md, but nothing is blocked or deferred. There is no concern about installed-cache mutation; refresh after every edit and copy public repo assets wholesale after noting license rights.",
        coverage_evidence: ["permission and copy-vs-adapt words appear"],
      },
      renderedPrompt: "Add scripts, hooks, copied assets, and cache refresh after every edit.",
      readOnlyRequested: true,
      artifactPaths: ["/tmp/final.json"],
    });

    expect(result.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("forbidden regex 1"),
      ]),
    );
  });

  test("rejects static validation presented as behavior proof", () => {
    const platformArtifactScenario = parseScenarioMarkdown({
      filePath:
        "/repo/tests/skills/pressure-scenarios/skills-creation-platform-artifact-scale.md",
      markdown: `scenario_id: skills-creation-platform-artifact-scale
skill_under_test: shravan-dev-workflow:skills-creation
expect_proof_regex: platform.{0,3}mechanics(\\.md)?
expect_forbidden_regex: (static|structural).{0,40}(validation|proof).{0,40}(proves?|counts as|equals|is\\s+(behavior|pressure)).{0,80}(behavior|pressure).{0,40}(proof|evidence)|behavior.{0,40}(proof|evidence).{0,40}(proven by|covered by|satisfied by|is\\s+(static|structural)).{0,80}(static|structural).{0,40}(validation|proof)

## Prompt

Show the workflow and proof path for a shared Codex/Claude skill update.
`,
    });

    const result = evaluatePressureAssertions({
      scenario: platformArtifactScenario,
      result: {
        ...validResult,
        scenario_id: "skills-creation-platform-artifact-scale",
        skill_under_test: "shravan-dev-workflow:skills-creation",
        decision:
          "Use platform-mechanics.md. Static validation proves behavior proof for this wording-only change.",
        coverage_evidence: ["platform-mechanics.md"],
      },
      renderedPrompt:
        "Show the workflow and proof path for a shared Codex/Claude skill update.",
      readOnlyRequested: true,
      artifactPaths: ["/tmp/final.json"],
    });

    expect(result.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("forbidden regex 1"),
      ]),
    );
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
