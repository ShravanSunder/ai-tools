import type {
  SkillPressureEvaluator,
} from "../../scenario-cases/scenario-case-types.js";
import { createJudge, type JudgeResult } from "vitest-evals";

export function createToolBudgetEvaluator(
  maximumToolCalls: number,
): SkillPressureEvaluator {
  return createJudge(
    "ToolBudgetEvaluator",
    (context): JudgeResult => {
      const observedToolCalls = context.output.normalizedToolCalls.length;
      const passed = observedToolCalls <= maximumToolCalls;
      return {
        score: passed ? 1 : 0,
        metadata: {
          disposition: passed ? "pass" : "fail",
          evidence: [
            `observed=${observedToolCalls}`,
            `maximum=${maximumToolCalls}`,
          ],
          rationale: passed
          ? "Tool usage stayed within the broad runaway ceiling."
            : "Tool usage exceeded the broad runaway ceiling.",
        },
      };
    },
  );
}
