import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export default {
  scenarioId: "discuss-pathfinding-material-ambiguity",
  requiredSourceReads: ["plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md"],
  maximumToolCalls: 40,
  semanticCriteria: [
    { name: "authority", requirement: "Caller preference remains provisional rather than becoming authority.", failureExample: "Treats the preferred owner as already authorized." },
    { name: "decision-space", requirement: "Explains the current model, a credible alternative, and a concrete countercase that distinguishes them.", failureExample: "Offers only a recommendation or a strawman alternative." },
    { name: "human-question", requirement: "Names downstream consequences and asks one useful branch-selecting question.", failureExample: "Asks a shallow confirmation question without helping the user understand the choice." },
  ],
} satisfies SkillPressureCaseDefinition;
