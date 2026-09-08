import { createJudge, type JudgeResult } from "vitest-evals";
import { describe, expect, test } from "vitest";
import { createEvaluatorTestContext } from "../evaluators/evaluator-test-context.js";
import type { SkillPressureEvaluator } from "../scenario-cases/scenario-case-types.js";
import { executeEvaluatorSequence } from "./execute-evaluator-sequence.js";

const context = createEvaluatorTestContext({
  input: {
    scenarioId: "sequence-case",
    skillUnderTest: "shravan-dev-workflow:program-design",
    mode: "fast",
    prompt: "Design the bounded system.",
  },
  output: {
    backend: "fake",
    renderedPrompt: "rendered prompt",
    earlierConversationTurns: [],
    finalResult: {
      scenario_id: "sequence-case",
      skill_under_test: "shravan-dev-workflow:program-design",
      skill_invoked: true,
      mode: "fast",
      read_only: true,
      artifact_expected: false,
      artifact_created: false,
      decision: "bounded design",
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
  },
});

describe("executeEvaluatorSequence", () => {
  test("records every deterministic result before one enforced semantic result", async () => {
    const calls: string[] = [];
    const semanticEvaluator = createScoredEvaluator("SemanticEvaluator", 1);

    await executeEvaluatorSequence({
      deterministicEvaluators: [
        createScoredEvaluator("StructureEvaluator", 1),
        createScoredEvaluator("SourceReadEvaluator", 1),
      ],
      semanticEvaluator,
      semanticEvaluationEnabled: true,
      applyEvaluator: async ({ evaluator, enforcement }) => {
        calls.push(`${enforcement}:${evaluator.name}`);
        const result = await evaluator.assess(context);
        enforcePassingScore({ enforcement, result });
      },
    });

    expect(calls).toEqual([
      "record:StructureEvaluator",
      "record:SourceReadEvaluator",
      "enforce:DeterministicGateEvaluator",
      "enforce:SemanticEvaluator",
    ]);
  });

  test("completes deterministic evaluation and skips semantic evaluation when the gate fails", async () => {
    const calls: string[] = [];
    const semanticEvaluator = createScoredEvaluator("SemanticEvaluator", 1);

    await expect(
      executeEvaluatorSequence({
        deterministicEvaluators: [
          createScoredEvaluator("FailingEvaluator", 0),
          createScoredEvaluator("PassingEvaluator", 1),
        ],
        semanticEvaluator,
        semanticEvaluationEnabled: true,
        applyEvaluator: async ({ evaluator, enforcement }) => {
          calls.push(`${enforcement}:${evaluator.name}`);
          const result = await evaluator.assess(context);
          enforcePassingScore({ enforcement, result });
        },
      }),
    ).rejects.toThrow("enforced evaluator failed");

    expect(calls).toEqual([
      "record:FailingEvaluator",
      "record:PassingEvaluator",
      "enforce:DeterministicGateEvaluator",
    ]);
    expect(calls).not.toContain("enforce:SemanticEvaluator");
  });
});

function createScoredEvaluator(
  name: string,
  score: number,
): SkillPressureEvaluator {
  return createJudge(name, (): JudgeResult => ({ score }));
}

function enforcePassingScore(props: {
  readonly enforcement: "record" | "enforce";
  readonly result: JudgeResult;
}): void {
  if (props.enforcement === "enforce" && props.result.score !== 1) {
    throw new Error("enforced evaluator failed");
  }
}
