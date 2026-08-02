import type { SkillPressureScenario } from "./parse-scenario-fixture.js";
import type { SkillPressureHarnessOutput } from "../subject-execution/create-skill-pressure-subject-harness.js";
import type { Judge, JudgeContext, JsonValue } from "vitest-evals";

export type EvaluationDisposition = "pass" | "fail" | "inconclusive";

export interface SemanticCriterion {
  readonly name: string;
  readonly requirement: string;
  readonly failureExample: string;
}

export interface SkillPressureCaseDefinition {
  readonly scenarioId: string;
  readonly requiredSourceReads?: readonly string[];
  readonly maximumToolCalls?: number;
  readonly semanticCriteria: readonly SemanticCriterion[];
}

export interface SkillPressureInput {
  readonly scenarioId: string;
  readonly skillUnderTest: string;
  readonly mode: SkillPressureScenario["mode"];
  readonly prompt: string;
}

export type SkillPressureEvaluatorContext = JudgeContext<
  SkillPressureInput,
  SkillPressureHarnessOutput
>;

export type SkillPressureEvaluator = Judge<SkillPressureEvaluatorContext>;

export interface SkillPressureCase {
  readonly id: string;
  readonly name: string;
  readonly tags: readonly string[];
  readonly scenario: SkillPressureScenario;
  readonly input: SkillPressureInput;
  readonly deterministicEvaluators: readonly SkillPressureEvaluator[];
  readonly semanticEvaluator?: SkillPressureEvaluator;
  readonly usesLegacyEvaluation: boolean;
}

export interface NormalizedToolCall {
  readonly [key: string]: JsonValue;
  readonly sequence: number;
  readonly capability: "source-read" | "other";
  readonly command: string;
  readonly output: string;
  readonly exitCode: number | null;
}
