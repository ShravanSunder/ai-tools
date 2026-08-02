import { createJudge, type JudgeResult } from "vitest-evals";
import type { SkillPressureEvaluator } from "../../scenario-cases/scenario-case-types.js";
import type { RecordedEvaluator } from "../recorded-evaluator.js";

export function createDeterministicGateEvaluator(
  recordedEvaluators: readonly RecordedEvaluator[],
): SkillPressureEvaluator {
  return createJudge(
    "DeterministicGateEvaluator",
    (): JudgeResult => {
      const failures = recordedEvaluators.flatMap((recordedEvaluator) => {
        const result = recordedEvaluator.readResult();
        return result?.score === 1
          ? []
          : [
              {
                evaluator: recordedEvaluator.evaluator.name,
                score: result?.score ?? null,
              },
            ];
      });
      const passed = failures.length === 0;
      return {
        score: passed ? 1 : 0,
        metadata: {
          disposition: passed ? "pass" : "fail",
          failures,
          rationale: passed
            ? "Every deterministic evaluator passed."
            : "At least one deterministic evaluator failed; Terra was not invoked.",
        },
      };
    },
  );
}
