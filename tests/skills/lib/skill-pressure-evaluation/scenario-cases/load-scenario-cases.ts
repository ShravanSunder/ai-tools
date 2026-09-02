import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
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

export async function validateNoOrphanCaseDefinitions(props: {
  readonly caseRegistryFiles: readonly string[];
  readonly scenarios: readonly SkillPressureScenario[];
}): Promise<void> {
  const scenarioIdentitiesByDirectory = new Map<string, Set<string>>();
  for (const scenario of props.scenarios) {
    const scenarioDirectory = dirname(scenario.filePath);
    const scenarioIdentities =
      scenarioIdentitiesByDirectory.get(scenarioDirectory) ?? new Set<string>();
    scenarioIdentities.add(scenario.scenarioId);
    scenarioIdentitiesByDirectory.set(scenarioDirectory, scenarioIdentities);
  }
  for (const caseRegistryFile of props.caseRegistryFiles) {
    const scenarioIdentities =
      scenarioIdentitiesByDirectory.get(dirname(caseRegistryFile)) ??
      new Set<string>();
    const caseDefinitions =
      await loadSkillPressureCaseDefinitions(caseRegistryFile);
    for (const caseDefinition of caseDefinitions) {
      if (!scenarioIdentities.has(caseDefinition.scenarioId)) {
        throw new Error(
          `Case registry definition has no colocated Markdown fixture: ${caseDefinition.scenarioId} (${caseRegistryFile})`,
        );
      }
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

export function validateUniqueSkillPressureCaseDefinitionIdentities(props: {
  readonly caseDefinitions: readonly SkillPressureCaseDefinition[];
  readonly caseRegistryPath: string;
}): void {
  const observedScenarioIdentities = new Set<string>();
  for (const caseDefinition of props.caseDefinitions) {
    if (observedScenarioIdentities.has(caseDefinition.scenarioId)) {
      throw new Error(
        `Duplicate skill pressure case definition identity: ${caseDefinition.scenarioId} (${props.caseRegistryPath})`,
      );
    }
    observedScenarioIdentities.add(caseDefinition.scenarioId);
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
    requiredSourceReads: [],
  };
  const caseRegistryPath = join(dirname(scenario.filePath), "cases.ts");
  if (!existsSync(caseRegistryPath)) {
    if (REQUIRED_EVALUATOR_SKILLS.has(scenario.skillUnderTest)) {
      throw new Error(
        `Scenario requires a skill-folder evaluator registry: ${caseRegistryPath}`,
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
  const caseDefinitions =
    await loadSkillPressureCaseDefinitions(caseRegistryPath);
  const caseDefinition = caseDefinitions.find(
    (definition) => definition.scenarioId === scenario.scenarioId,
  );
  if (caseDefinition === undefined) {
    throw new Error(
      `Case registry does not define scenario ${scenario.scenarioId}: ${caseRegistryPath}`,
    );
  }
  return {
    id: scenario.scenarioId,
    name: scenario.scenarioId,
    tags: [scenario.skillUnderTest],
    scenario,
    input: {
      ...input,
      requiredSourceReads: caseDefinition.requiredSourceReads ?? [],
      followUpUserTurns: caseDefinition.followUpUserTurns ?? [],
    },
    deterministicEvaluators: createDeterministicEvaluators({
      definition: caseDefinition,
      scenario,
    }),
    semanticEvaluator: createSemanticCriteriaEvaluator(caseDefinition),
    usesLegacyEvaluation: false,
  };
}

async function loadSkillPressureCaseDefinitions(
  caseRegistryPath: string,
): Promise<readonly SkillPressureCaseDefinition[]> {
  const importedModule: unknown = await import(
    pathToFileURL(caseRegistryPath).href
  );
  if (!isSkillPressureCaseRegistryModule(importedModule)) {
    throw new Error(
      `Case registry must export named skillPressureCaseDefinitions: ${caseRegistryPath}`,
    );
  }
  validateUniqueSkillPressureCaseDefinitionIdentities({
    caseDefinitions: importedModule.skillPressureCaseDefinitions,
    caseRegistryPath,
  });
  return importedModule.skillPressureCaseDefinitions;
}

function isSkillPressureCaseRegistryModule(
  value: unknown,
): value is {
  readonly skillPressureCaseDefinitions: readonly SkillPressureCaseDefinition[];
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "skillPressureCaseDefinitions" in value &&
    Array.isArray(value.skillPressureCaseDefinitions) &&
    value.skillPressureCaseDefinitions.every(isSkillPressureCaseDefinition)
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
        value.maximumToolCalls > 0)) &&
    (!("followUpUserTurns" in value) ||
      (Array.isArray(value.followUpUserTurns) &&
        value.followUpUserTurns.every(
          (turn) => typeof turn === "string" && turn.trim().length > 0,
        )))
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
