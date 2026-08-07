import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const skillSources = [
  "plugins/shravan-dev-workflow/skills/spec-handoff/SKILL.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "spec-handoff-portable-design-context",
    requiredSourceReads: skillSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "keeps-handoff-as-portability",
        requirement: "Packages decisions, non-goals, open questions, source evidence, and proof expectations without claiming approval or phase completion.",
        failureExample: "Calls the design complete or hides open questions to make it look ready.",
      },
      {
        name: "does-not-create-a-plan",
        requirement: "Does not turn design context into an implementation plan inside spec-handoff.",
        failureExample: "Invents tasks or a plan tuple while packaging the design.",
      },
      {
        name: "routes-by-actual-admission",
        requirement: "Does not recommend plan-implementation without exact current ready three-artifact evidence; names the missing or stale prerequisite instead.",
        failureExample: "Routes generic design context straight to planning or reports all planning unavailable.",
      },
    ],
  },
  {
    scenarioId: "spec-handoff-routes-ready-design-to-planner",
    requiredSourceReads: [
      ...skillSources,
      "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
      "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
      "tests/skills/fixtures/minimal-planning-delivery/specification.md",
      "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
      "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "preserves-ready-design-portably",
        requirement: "Packages the current design identities, exact review identities, decisions, non-goals, gaps, and proof expectations without creating a plan or claiming completion.",
        failureExample: "Converts the handoff into an implementation plan or drops review identity/freshness evidence.",
      },
      {
        name: "recommends-exactly-the-planner",
        requirement: "From the supplied exact current ready three-artifact result, recommends exactly plan-implementation as the next planning owner.",
        failureExample: "Reports planning unavailable, lists competing routes, or starts implementation.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
