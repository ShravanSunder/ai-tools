import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export default {
  scenarioId: "discuss-pathfinding-user-requirements-record",
  requiredSourceReads: ["plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md"],
  maximumToolCalls: 45,
  semanticCriteria: [
    { name: "consumer-classes", requirement: "Preserves developer users, customer stakeholders, and operators as distinct classes.", failureExample: "Collapses everyone into one generic persona or drops the buyer." },
    { name: "evidence-authority", requirement: "Separates observational ticket evidence from authorized product meaning and challenges blanket must priority.", failureExample: "Promotes every ticket claim into a must." },
    { name: "boundary-confirmation", requirement: "Keeps foundation, missing behavior, non-goals, complexity budget, and unresolved choices visible for owner confirmation before specification handoff. In a quick conversational pass, it may ask one axis now and preserve the remaining boundary axes as explicit open questions for later turns.", failureExample: "Calls the record ready without boundary confirmation or loses the unasked boundary axes." },
  ],
} satisfies SkillPressureCaseDefinition;
