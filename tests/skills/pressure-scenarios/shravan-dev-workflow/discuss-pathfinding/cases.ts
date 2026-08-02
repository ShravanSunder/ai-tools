import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "discuss-pathfinding-material-ambiguity",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "authority",
        requirement:
          "Caller preference remains provisional rather than becoming authority.",
        failureExample: "Treats the preferred owner as already authorized.",
      },
      {
        name: "decision-space",
        requirement:
          "Explains the current model, a credible alternative, and a concrete countercase that distinguishes them.",
        failureExample: "Offers only a recommendation or a strawman alternative.",
      },
      {
        name: "human-question",
        requirement:
          "Names downstream consequences and asks one useful branch-selecting question.",
        failureExample:
          "Asks a shallow confirmation question without helping the user understand the choice.",
      },
    ],
  },
  {
    scenarioId: "discuss-pathfinding-provisional-caller-boundary",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "caller-context",
        requirement:
          "Uses detailed caller context without promoting it to owner authority.",
        failureExample: "Accepts exact package claims because they sound precise.",
      },
      {
        name: "boundary-return",
        requirement:
          "Clearly separates confirmed, provisional, protected, allowed, and unresolved boundary meaning.",
        failureExample:
          "Returns one blended boundary or rejects all caller context.",
      },
      {
        name: "handoff-gate",
        requirement:
          "Does not call the specification handoff ready while the load-bearing boundary lacks confirmation.",
        failureExample: "Asks only whether anything is missing and proceeds.",
      },
    ],
  },
  {
    scenarioId: "discuss-pathfinding-user-requirements-record",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md",
    ],
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "consumer-classes",
        requirement:
          "Preserves developer users, customer stakeholders, and operators as distinct classes.",
        failureExample:
          "Collapses everyone into one generic persona or drops the buyer.",
      },
      {
        name: "evidence-authority",
        requirement:
          "Separates observational ticket evidence from authorized product meaning and challenges blanket must priority.",
        failureExample: "Promotes every ticket claim into a must.",
      },
      {
        name: "boundary-confirmation",
        requirement:
          "Keeps foundation, missing behavior, non-goals, complexity budget, and unresolved choices visible for owner confirmation before specification handoff. In a quick conversational pass, it may ask one axis now and preserve the remaining boundary axes as explicit open questions for later turns.",
        failureExample:
          "Calls the record ready without boundary confirmation or loses the unasked boundary axes.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
