import { createJudge } from "vitest-evals";
import { describe, expect, test } from "vitest";
import type { SkillPressureInput } from "../scenario-cases/scenario-case-types.js";
import type { SkillPressureHarnessOutput } from "../subject-execution/create-skill-pressure-subject-harness.js";
import { createEvaluatorTestContext } from "./evaluator-test-context.js";
import { createRecordedEvaluator } from "./recorded-evaluator.js";

const input = {
  scenarioId: "recorded-evaluator-test",
  skillUnderTest: "shravan-dev-workflow:test-skill",
  mode: "fast",
  prompt: "Use the skill.",
} satisfies SkillPressureInput;

const output = {
  backend: "fake",
  renderedPrompt: "prompt",
  earlierConversationTurns: [],
  finalResult: {
    scenario_id: input.scenarioId,
    skill_under_test: input.skillUnderTest,
    skill_invoked: true,
    mode: input.mode,
    read_only: true,
    artifact_expected: false,
    artifact_created: false,
    decision: "response",
    coverage_evidence: [],
    shortcut_resisted: true,
    rationalizations_rejected: [],
    open_questions: [],
    next_action: "none",
  },
  artifactPaths: [],
  artifactDirectory: "/tmp",
  normalizedToolCalls: [],
  readOnlyRequested: true,
  exitCode: 0,
  timedOut: false,
} satisfies SkillPressureHarnessOutput;

describe("createRecordedEvaluator", () => {
  test("records the exact native result without evaluating twice", async () => {
    let assessmentCalls = 0;
    const sourceEvaluator = createJudge("RecordedTestEvaluator", () => {
      assessmentCalls += 1;
      return { score: 0, metadata: { rationale: "objective failure" } };
    });
    const recordedEvaluator = createRecordedEvaluator(sourceEvaluator);

    const result = await recordedEvaluator.evaluator.assess(
      createEvaluatorTestContext({ input, output }),
    );

    expect(result.score).toBe(0);
    expect(recordedEvaluator.readResult()).toBe(result);
    expect(assessmentCalls).toBe(1);
  });
});
