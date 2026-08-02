import { createDeterministicGateEvaluator } from "../evaluators/deterministic/deterministic-gate-evaluator.js";
import { createRecordedEvaluator } from "../evaluators/recorded-evaluator.js";
import type { SkillPressureEvaluator } from "../scenario-cases/scenario-case-types.js";

export interface ApplyEvaluatorRequest {
  readonly evaluator: SkillPressureEvaluator;
  readonly enforcement: "record" | "enforce";
}

export interface ExecuteEvaluatorSequenceProps {
  readonly deterministicEvaluators: readonly SkillPressureEvaluator[];
  readonly semanticEvaluator: SkillPressureEvaluator | undefined;
  readonly semanticEvaluationEnabled: boolean;
  readonly applyEvaluator: (request: ApplyEvaluatorRequest) => Promise<void>;
}

export async function executeEvaluatorSequence(
  props: ExecuteEvaluatorSequenceProps,
): Promise<void> {
  const recordedEvaluators = props.deterministicEvaluators.map(
    createRecordedEvaluator,
  );
  for (const recordedEvaluator of recordedEvaluators) {
    await props.applyEvaluator({
      evaluator: recordedEvaluator.evaluator,
      enforcement: "record",
    });
  }

  await props.applyEvaluator({
    evaluator: createDeterministicGateEvaluator(recordedEvaluators),
    enforcement: "enforce",
  });

  if (props.semanticEvaluationEnabled && props.semanticEvaluator !== undefined) {
    await props.applyEvaluator({
      evaluator: props.semanticEvaluator,
      enforcement: "enforce",
    });
  }
}
