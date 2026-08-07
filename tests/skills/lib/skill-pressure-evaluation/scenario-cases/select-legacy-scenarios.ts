import type { SkillPressureCase } from "./scenario-case-types.js";

export interface ShouldRunSkillPressureCaseProps {
  readonly skillPressureCase: SkillPressureCase;
  readonly selectedMode: string | undefined;
  readonly selectedScenario: string | undefined;
}

export function shouldRunSkillPressureCase(
  props: ShouldRunSkillPressureCaseProps,
): boolean {
  if (props.selectedScenario !== undefined && props.selectedScenario !== "") {
    return props.skillPressureCase.id === props.selectedScenario;
  }
  if (!props.skillPressureCase.usesLegacyEvaluation) {
    return true;
  }
  if (props.selectedMode === undefined || props.selectedMode === "") {
    return true;
  }
  return props.skillPressureCase.scenario.mode === props.selectedMode;
}
