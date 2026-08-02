import { createScenarioContractEvaluator } from "./scenario-contract-evaluator.js";
import { createSourceReadEvaluator } from "./source-read-evaluator.js";
import { createToolBudgetEvaluator } from "./tool-budget-evaluator.js";
import type {
  SkillPressureCaseDefinition,
  SkillPressureEvaluator,
} from "../../scenario-cases/scenario-case-types.js";
import type { SkillPressureScenario } from "../../scenario-cases/parse-scenario-fixture.js";

export function createDeterministicEvaluators(props: {
  readonly definition: SkillPressureCaseDefinition;
  readonly scenario: SkillPressureScenario;
}): readonly SkillPressureEvaluator[] {
  const evaluators: SkillPressureEvaluator[] = [
    createScenarioContractEvaluator(props.scenario),
  ];
  if (props.definition.requiredSourceReads?.length) {
    evaluators.push(
      createSourceReadEvaluator(props.definition.requiredSourceReads),
    );
  }
  if (props.definition.maximumToolCalls !== undefined) {
    evaluators.push(createToolBudgetEvaluator(props.definition.maximumToolCalls));
  }
  return evaluators;
}
