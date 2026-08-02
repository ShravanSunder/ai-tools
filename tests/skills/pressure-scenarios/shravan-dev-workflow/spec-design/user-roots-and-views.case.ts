import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export default {
  scenarioId: "spec-design-user-roots-and-views",
  requiredSourceReads: ["plugins/shravan-dev-workflow/skills/spec-design/SKILL.md"],
  maximumToolCalls: 45,
  semanticCriteria: [
    { name: "authority-and-scope", requirement: "Only authorized rows become normative and the confirmed boundary blocks audit, scheduling, persistence, and governance expansion.", failureExample: "Promotes observational or unresolved rows or treats production-ready as expansion authority." },
    { name: "why-what-altitude", requirement: "Keeps the specification at observable Why/What altitude without placing internal components in the context view.", failureExample: "Invents structural How or exposes internal components as the external system context." },
    { name: "reader-views", requirement: "Uses proportional journey, context, and coverage views that preserve their required semantics and help a human inspect gaps.", failureExample: "Treats rendering syntax as proof or emits generic decorative diagrams." },
  ],
} satisfies SkillPressureCaseDefinition;
