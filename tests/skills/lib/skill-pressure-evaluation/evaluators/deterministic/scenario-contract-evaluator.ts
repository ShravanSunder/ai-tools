import { createJudge, type JudgeResult } from "vitest-evals";
import { evaluatePressureAssertions } from "./legacy-pressure-assertions.js";
import type { SkillPressureEvaluator } from "../../scenario-cases/scenario-case-types.js";
import type { SkillPressureScenario } from "../../scenario-cases/parse-scenario-fixture.js";

export function createScenarioContractEvaluator(
  scenario: SkillPressureScenario,
): SkillPressureEvaluator {
  return createJudge(
    "ScenarioContractEvaluator",
    (context): JudgeResult => {
      const result = evaluatePressureAssertions({
        scenario,
        result: context.output.finalResult,
        renderedPrompt: context.output.renderedPrompt,
        readOnlyRequested: context.output.readOnlyRequested,
        artifactPaths: context.output.artifactPaths,
        includeArtifactExpectation: false,
        includeLegacySemanticAssertions: false,
      });
      const passed = result.failures.length === 0;
      return {
        score: passed ? 1 : 0,
        metadata: {
          disposition: passed ? "pass" : "fail",
          evidence: [...result.failures],
          rationale: passed
            ? "The subject observation satisfied the scenario's objective contract."
            : "The subject observation violated the scenario's objective contract.",
        },
      };
    },
  );
}
