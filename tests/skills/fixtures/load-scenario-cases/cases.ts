import type { SkillPressureCaseDefinition } from "../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "fixture-scenario",
    semanticCriteria: [
      {
        name: "fixture",
        requirement: "Loads the named skill-folder registry.",
        failureExample: "Requires one TypeScript companion per Markdown fixture.",
      },
    ],
  },
  {
    scenarioId: "different-scenario",
    semanticCriteria: [
      {
        name: "identity",
        requirement: "Matches a colocated Markdown scenario.",
        failureExample: "Silently attaches evaluation criteria to another scenario.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
