import type { SkillPressureCase } from "./skill-pressure-harness.js";

export interface ShouldRunSkillPressureCaseProps {
  readonly skillPressureCase: SkillPressureCase;
  readonly selectedMode: string | undefined;
  readonly selectedScenario: string | undefined;
}

export function shouldRunSkillPressureCase(
  props: ShouldRunSkillPressureCaseProps,
): boolean {
  if (props.selectedScenario !== undefined && props.selectedScenario !== "") {
    return true;
  }
  if (props.selectedMode === undefined || props.selectedMode === "") {
    return true;
  }
  return props.skillPressureCase.scenario.mode === props.selectedMode;
}
