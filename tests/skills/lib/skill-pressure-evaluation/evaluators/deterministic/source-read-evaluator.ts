import type {
  SkillPressureEvaluator,
} from "../../scenario-cases/scenario-case-types.js";
import { createJudge, type JudgeResult } from "vitest-evals";

export function createSourceReadEvaluator(
  requiredPaths: readonly string[],
): SkillPressureEvaluator {
  return createJudge(
    "SourceReadEvaluator",
    (context): JudgeResult => {
      const missingPaths = requiredPaths.filter(
        (requiredPath) =>
          !context.output.normalizedToolCalls.some(
            (call) =>
              call.capability === "source-read" &&
              call.exitCode === 0 &&
              call.command.includes(requiredPath) &&
              call.output.trim().length > 0,
          ),
      );
      const passed = missingPaths.length === 0;
      return {
        score: passed ? 1 : 0,
        metadata: {
          disposition: passed ? "pass" : "fail",
          evidence: passed ? [...requiredPaths] : missingPaths,
          rationale: passed
            ? "Every required source produced observable read output."
            : "Required sources were not observably read.",
        },
      };
    },
  );
}
