import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export default {
  scenarioId: "discuss-pathfinding-provisional-caller-boundary",
  requiredSourceReads: ["plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md"],
  maximumToolCalls: 40,
  semanticCriteria: [
    { name: "caller-context", requirement: "Uses detailed caller context without promoting it to owner authority.", failureExample: "Accepts exact package claims because they sound precise." },
    { name: "boundary-return", requirement: "Clearly separates confirmed, provisional, protected, allowed, and unresolved boundary meaning.", failureExample: "Returns one blended boundary or rejects all caller context." },
    { name: "handoff-gate", requirement: "Does not call the specification handoff ready while the load-bearing boundary lacks confirmation.", failureExample: "Asks only whether anything is missing and proceeds." },
  ],
} satisfies SkillPressureCaseDefinition;
