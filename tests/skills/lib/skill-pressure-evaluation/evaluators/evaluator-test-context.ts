import { normalizeHarnessRun } from "vitest-evals";
import type {
  SkillPressureEvaluatorContext,
  SkillPressureInput,
} from "../scenario-cases/scenario-case-types.js";
import type { SkillPressureHarnessOutput } from "../subject-execution/create-skill-pressure-subject-harness.js";

export function createEvaluatorTestContext(props: {
  readonly input: SkillPressureInput;
  readonly output: SkillPressureHarnessOutput;
}): SkillPressureEvaluatorContext {
  const run = normalizeHarnessRun(props.input, {
    output: props.output,
    events: [
      {
        type: "message",
        role: "assistant",
        content: props.output.finalResult.decision,
      },
    ],
  });

  return {
    input: props.input,
    output: props.output,
    toolCalls: [],
    run,
    session: run.session,
    harness: undefined,
  } satisfies SkillPressureEvaluatorContext;
}
