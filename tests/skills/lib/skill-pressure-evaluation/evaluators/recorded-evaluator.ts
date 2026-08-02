import { createJudge, type JudgeResult } from "vitest-evals";
import type { SkillPressureEvaluator } from "../scenario-cases/scenario-case-types.js";

export interface RecordedEvaluator {
  readonly evaluator: SkillPressureEvaluator;
  readResult(): JudgeResult | undefined;
}

export function createRecordedEvaluator(
  sourceEvaluator: SkillPressureEvaluator,
): RecordedEvaluator {
  let result: JudgeResult | undefined;
  return {
    evaluator: createJudge(sourceEvaluator.name, async (context) => {
      result = await sourceEvaluator.assess(context);
      return result;
    }),
    readResult: () => result,
  };
}
