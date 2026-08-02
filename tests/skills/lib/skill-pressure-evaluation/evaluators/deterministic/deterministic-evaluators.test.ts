import { describe, expect, test } from "vitest";
import type {
  SkillPressureEvaluatorContext,
  SkillPressureInput,
} from "../../scenario-cases/scenario-case-types.js";
import type { SkillPressureHarnessOutput } from "../../subject-execution/create-skill-pressure-subject-harness.js";
import { createSourceReadEvaluator } from "./source-read-evaluator.js";
import { createToolBudgetEvaluator } from "./tool-budget-evaluator.js";
import { createDeterministicGateEvaluator } from "./deterministic-gate-evaluator.js";
import { createRecordedEvaluator } from "../recorded-evaluator.js";
import { createEvaluatorTestContext } from "../evaluator-test-context.js";

const input: SkillPressureInput = {
  scenarioId: "test",
  skillUnderTest: "shravan-dev-workflow:test-skill",
  mode: "fast",
  prompt: "Use the skill.",
};

const baseOutput: SkillPressureHarnessOutput = {
  backend: "codex",
  renderedPrompt: "prompt",
  finalResult: {
    scenario_id: "test",
    skill_under_test: "shravan-dev-workflow:test-skill",
    skill_invoked: true,
    mode: "fast",
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
};

function createContext(
  output: SkillPressureHarnessOutput,
): SkillPressureEvaluatorContext {
  return createEvaluatorTestContext({ input, output });
}

describe("deterministic evaluators", () => {
  test("gate reports every recorded failure after all evaluators run", async () => {
    const sourceReadEvaluator = createRecordedEvaluator(
      createSourceReadEvaluator(["plugins/example/SKILL.md"]),
    );
    const toolBudgetEvaluator = createRecordedEvaluator(createToolBudgetEvaluator(0));
    const context = createContext({
      ...baseOutput,
      normalizedToolCalls: [
        {
          sequence: 0,
          capability: "other",
          command: "pwd",
          output: "/repo",
          exitCode: 0,
        },
      ],
    });

    await sourceReadEvaluator.evaluator.assess(context);
    await toolBudgetEvaluator.evaluator.assess(context);
    const result = await createDeterministicGateEvaluator([
      sourceReadEvaluator,
      toolBudgetEvaluator,
    ]).assess(context);

    expect(result.score).toBe(0);
    expect(result.metadata?.["failures"]).toEqual([
      { evaluator: "SourceReadEvaluator", score: 0 },
      { evaluator: "ToolBudgetEvaluator", score: 0 },
    ]);
  });

  test("source-read evaluator requires observable successful output", async () => {
    const evaluator = createSourceReadEvaluator(["plugins/example/SKILL.md"]);
    const passingResult = await evaluator.assess(
      createContext({
        ...baseOutput,
        normalizedToolCalls: [
          {
            sequence: 0,
            capability: "source-read",
            command: "sed -n '1,200p' plugins/example/SKILL.md",
            output: "# Skill",
            exitCode: 0,
          },
        ],
      }),
    );
    const failingResult = await evaluator.assess(createContext(baseOutput));

    expect(passingResult.score).toBe(1);
    expect(failingResult.score).toBe(0);
  });

  test("tool-budget evaluator applies only the broad runaway ceiling", async () => {
    const evaluator = createToolBudgetEvaluator(0);
    const result = await evaluator.assess(
      createContext({
        ...baseOutput,
        normalizedToolCalls: [
          {
            sequence: 0,
            capability: "other",
            command: "pwd",
            output: "/repo",
            exitCode: 0,
          },
        ],
      }),
    );

    expect(result.score).toBe(0);
  });
});
