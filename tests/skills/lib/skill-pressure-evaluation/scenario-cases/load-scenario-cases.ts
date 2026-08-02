import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import type { SkillPressureScenario } from "./parse-scenario-fixture.js";
import { createSemanticCriteriaEvaluator } from "../evaluators/semantic/semantic-criteria-evaluator.js";
import { createDeterministicEvaluators } from "../evaluators/deterministic/create-deterministic-evaluators.js";
import type {
  SkillPressureCase,
  SkillPressureCaseDefinition,
  SkillPressureInput,
} from "./scenario-case-types.js";

const REQUIRED_EVALUATOR_SKILLS = new Set([
  "shravan-dev-workflow:discuss-pathfinding",
  "shravan-dev-workflow:spec-design",
  "shravan-dev-workflow:program-design",
  "shravan-dev-workflow:spec-program-review",
]);

export function validateNoOrphanCaseDefinitions(props: {
  readonly caseDefinitionFiles: readonly string[];
  readonly scenarioFixtureFiles: readonly string[];
}): void {
  const fixtureStems = new Set(
    props.scenarioFixtureFiles.map((filePath) => filePath.replace(/\.md$/, "")),
  );
  for (const caseDefinitionFile of props.caseDefinitionFiles) {
    const caseStem = caseDefinitionFile.replace(/\.case\.ts$/, "");
    if (!fixtureStems.has(caseStem)) {
      throw new Error(
        `Case definition has no colocated Markdown fixture: ${caseDefinitionFile}`,
      );
    }
  }
}

export function validateUniqueSkillPressureCaseIdentities(
  skillPressureCases: readonly SkillPressureCase[],
): void {
  const observedScenarioIdentities = new Set<string>();
  for (const skillPressureCase of skillPressureCases) {
    if (observedScenarioIdentities.has(skillPressureCase.id)) {
      throw new Error(
        `Duplicate skill pressure scenario identity: ${skillPressureCase.id}`,
      );
    }
    observedScenarioIdentities.add(skillPressureCase.id);
  }
}

export async function loadSkillPressureCase(
  scenario: SkillPressureScenario,
): Promise<SkillPressureCase> {
  const input: SkillPressureInput = {
    scenarioId: scenario.scenarioId,
    skillUnderTest: scenario.skillUnderTest,
    mode: scenario.mode,
    prompt: scenario.prompt,
  };
  const casePath = scenario.filePath.replace(/\.md$/, ".case.ts");
  if (!existsSync(casePath)) {
    if (REQUIRED_EVALUATOR_SKILLS.has(scenario.skillUnderTest)) {
      throw new Error(
        `Scenario requires a colocated evaluator definition: ${casePath}`,
      );
    }
    return {
      id: scenario.scenarioId,
      name: scenario.scenarioId,
      tags: [scenario.skillUnderTest],
      scenario,
      input,
      deterministicEvaluators: [],
      usesLegacyEvaluation: true,
    };
  }
  const importedModule: unknown = await import(pathToFileURL(casePath).href);
  if (!isSkillPressureCaseModule(importedModule)) {
    throw new Error(`Case definition must export default: ${casePath}`);
  }
  if (importedModule.default.scenarioId !== scenario.scenarioId) {
    throw new Error(`Case definition scenario mismatch: ${casePath}`);
  }
  return {
    id: scenario.scenarioId,
    name: scenario.scenarioId,
    tags: [scenario.skillUnderTest],
    scenario,
    input,
    deterministicEvaluators: createDeterministicEvaluators({
      definition: importedModule.default,
      scenario,
    }),
    semanticEvaluator: createSemanticCriteriaEvaluator(importedModule.default),
    usesLegacyEvaluation: false,
  };
}

function isSkillPressureCaseModule(
  value: unknown,
): value is { readonly default: SkillPressureCaseDefinition } {
  return (
    typeof value === "object" &&
    value !== null &&
    "default" in value &&
    isSkillPressureCaseDefinition(value.default)
  );
}

function isSkillPressureCaseDefinition(
  value: unknown,
): value is SkillPressureCaseDefinition {
  return (
    typeof value === "object" &&
    value !== null &&
    "scenarioId" in value &&
    typeof value.scenarioId === "string" &&
    "semanticCriteria" in value &&
    Array.isArray(value.semanticCriteria) &&
    value.semanticCriteria.every(isSemanticCriterion) &&
    (!("requiredSourceReads" in value) ||
      (Array.isArray(value.requiredSourceReads) &&
        value.requiredSourceReads.every(
          (sourceRead) => typeof sourceRead === "string",
        ))) &&
    (!("maximumToolCalls" in value) ||
      (typeof value.maximumToolCalls === "number" &&
        Number.isInteger(value.maximumToolCalls) &&
        value.maximumToolCalls > 0))
  );
}

function isSemanticCriterion(value: unknown): value is {
  readonly name: string;
  readonly requirement: string;
  readonly failureExample: string;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "requirement" in value &&
    typeof value.requirement === "string" &&
    "failureExample" in value &&
    typeof value.failureExample === "string"
  );
}
