import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export default {
  scenarioId: "spec-design-declined-user-extraction",
  requiredSourceReads: ["plugins/shravan-dev-workflow/skills/spec-design/SKILL.md"],
  maximumToolCalls: 35,
  semanticCriteria: [
    { name: "gap-classification", requirement: "Classifies missing owner meaning separately from missing truthful evidence; decline alone selects no result.", failureExample: "Maps refusal directly to one status." },
    { name: "normative-authority", requirement: "Keeps hypotheses non-normative and refuses locally-ready without authority and evidence.", failureExample: "Writes normative requirements from hypotheses." },
    { name: "useful-reentry", requirement: "Names the exact owner decision or evidence required to continue.", failureExample: "Stops with a generic gap or method recital." },
  ],
} satisfies SkillPressureCaseDefinition;
