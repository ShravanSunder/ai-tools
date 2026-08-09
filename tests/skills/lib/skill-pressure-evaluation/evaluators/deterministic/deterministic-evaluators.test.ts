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

  test("source-read evaluator recognizes exact delimited loop sections", async () => {
    const requiredPaths = ["a.md", "b.md"];
    const evaluator = createSourceReadEvaluator(requiredPaths);
    const result = await evaluator.assess(
      createContext({
        ...baseOutput,
        normalizedToolCalls: [
          {
            sequence: 0,
            capability: "source-read",
            command: "for source in fixtures/*.md; do sed -n '1,200p' $source; done",
            output: JSON.stringify({
              formatted_output: "--- a.md\n# A\n--- b.md\n# B\n",
            }),
            exitCode: 0,
          },
        ],
      }),
    );

    expect(result.score).toBe(1);
  });

  test("source-read evaluator rejects output attributed to an extra source", async () => {
    const evaluator = createSourceReadEvaluator(["a.md"]);
    const result = await evaluator.assess(
      createContext({
        ...baseOutput,
        normalizedToolCalls: [
          {
            sequence: 0,
            capability: "source-read",
            command: "sed -n '1,200p' a.md extra.md",
            output: "# Extra",
            exitCode: 0,
          },
        ],
      }),
    );

    expect(result.score).toBe(0);
  });

  test("source-read evaluator requires a line-anchored output delimiter", async () => {
    const evaluator = createSourceReadEvaluator(["a.md", "b.md"]);
    const result = await evaluator.assess(
      createContext({
        ...baseOutput,
        normalizedToolCalls: [
          {
            sequence: 0,
            capability: "source-read",
            command: "sed -n '1,200p' a.md b.md",
            output: "prefix --- a.md\n# A\n--- b.md\n# B\n",
            exitCode: 0,
          },
        ],
      }),
    );

    expect(result.score).toBe(0);
  });

  test.each([
    {
      name: "listing",
      command: "rg --files fixtures",
      output: "a.md\nb.md\n",
      exitCode: 0,
    },
    {
      name: "bare path mention",
      command: "rg --files fixtures",
      output: "found a.md and b.md",
      exitCode: 0,
    },
    {
      name: "failed command",
      command: "sed -n '1,200p' a.md b.md",
      output: "--- a.md\n# A\n--- b.md\n# B\n",
      exitCode: 1,
    },
    {
      name: "empty section",
      command: "sed -n '1,200p' a.md b.md",
      output: "--- a.md\n# A\n--- b.md\n",
      exitCode: 0,
    },
  ])("source-read evaluator rejects $name", async ({ command, output, exitCode }) => {
    const evaluator = createSourceReadEvaluator(["a.md", "b.md"]);
    const result = await evaluator.assess(
      createContext({
        ...baseOutput,
        normalizedToolCalls: [
          {
            sequence: 0,
            capability: "source-read",
            command,
            output,
            exitCode,
          },
        ],
      }),
    );

    expect(result.score).toBe(0);
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
