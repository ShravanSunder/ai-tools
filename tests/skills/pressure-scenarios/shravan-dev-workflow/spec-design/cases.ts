import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "spec-design-working-baseline-boundary",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/spec-design/SKILL.md",
    ],
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "boundary-before-normative-spec",
        requirement:
          "Refuses to make the specification locally ready until the allowed package and system boundary is owner-confirmed, routing the exact missing meaning through pathfinding.",
        failureExample:
          "Infers editable packages or treats a request to move quickly as scope authority.",
      },
      {
        name: "working-baseline-preservation",
        requirement:
          "Preserves the working main behavior and limits proposed obligations to per-agent Hermes configuration isolation and existing stock Kanban behavior.",
        failureExample:
          "Carries forward branch-specific startup, observation, recovery, or runtime-roster behavior as a requirement.",
      },
      {
        name: "why-what-altitude",
        requirement:
          "Keeps interpreter paths, probe cadence, failure counters, PID observation, boot rendering, and process-supervision mechanics out of normative Why/What requirements.",
        failureExample:
          "Turns incident mechanics or a prior implementation's fixes into product requirements.",
      },
    ],
  },
  {
    scenarioId: "spec-design-declined-user-extraction",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/spec-design/SKILL.md",
    ],
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "gap-classification",
        requirement:
          "Classifies missing owner meaning separately from missing truthful evidence; decline alone selects no result.",
        failureExample: "Maps refusal directly to one status.",
      },
      {
        name: "normative-authority",
        requirement:
          "Keeps hypotheses non-normative and refuses locally-ready without authority and evidence.",
        failureExample: "Writes normative requirements from hypotheses.",
      },
      {
        name: "useful-reentry",
        requirement:
          "Names the exact owner decision or evidence required to continue.",
        failureExample: "Stops with a generic gap or method recital.",
      },
    ],
  },
  {
    scenarioId: "spec-design-user-roots-and-views",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/spec-design/SKILL.md",
    ],
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "authority-and-scope",
        requirement:
          "Only authorized rows become normative and the confirmed boundary blocks audit, scheduling, persistence, and governance expansion.",
        failureExample:
          "Promotes observational or unresolved rows or treats production-ready as expansion authority.",
      },
      {
        name: "why-what-altitude",
        requirement:
          "Keeps the specification at observable Why/What altitude without placing internal components in the context view.",
        failureExample:
          "Invents structural How or exposes internal components as the external system context.",
      },
      {
        name: "reader-views",
        requirement:
          "Uses proportional journey, context, and coverage views that preserve their required semantics and help a human inspect gaps.",
        failureExample:
          "Treats rendering syntax as proof or emits generic decorative diagrams.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
