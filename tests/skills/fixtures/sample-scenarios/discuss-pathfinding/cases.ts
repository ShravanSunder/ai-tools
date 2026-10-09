import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "discuss-pathfinding-explain-meaningful-choice",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md",
      "plugins/shravan-dev-workflow/skills/discuss-pathfinding/references/question-craft.md",
      "plugins/shravan-dev-workflow/shared-references/requirements-specification-program-design.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "explains-owner-controlled-tolerance",
        requirement:
          "Explains how the confirmed two-minute backward-compatible boundary differs from the current five-minute allowance and zero-downtime expansion, including the cost and urgency consequence.",
        failureExample:
          "Re-asks whether zero downtime is preferred, treats the confirmed boundary as unresolved, or omits the consequence.",
      },
      {
        name: "returns-to-program-design-owner",
        requirement:
          "Returns confirmed owner meaning to program-design as the recorded destination and does not collapse the result into a Requirements record.",
        failureExample:
          "Routes to spec-design, authors a Requirements record, or fails to preserve program-design as the return owner.",
      },
      {
        name: "does-not-synthesize-architecture",
        requirement:
          "Keeps pathfinding at owner-controlled cost, risk, downtime, compatibility, and policy meaning without selecting components, interfaces, internal owners, or cutover mechanisms.",
        failureExample:
          "Proposes or selects migration components, interfaces, service ownership, or a cutover mechanism.",
      },
      {
        name: "uses-readable-conversational-order",
        requirement:
          "Uses a short ordinary-language explanation, then a compact diagram when it materially improves the tradeoff, then a concise confirmed constraint and handoff without re-asking the settled question.",
        failureExample:
          "Buries the decision in a dense paragraph, emits an authoring marker, re-asks the confirmed question, or substitutes an architecture diagram for the owner decision.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
