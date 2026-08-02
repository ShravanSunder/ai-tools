import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "program-design-view-rendering-semantics",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/program-design/SKILL.md",
    ],
    maximumToolCalls: 50,
    semanticCriteria: [
      {
        name: "call-path-deltas",
        requirement:
          "Makes added, removed, and changed call, owner, state/effect, and result/error edges explicit; unchanged edges appear only when preservation-critical or contested.",
        failureExample:
          "Shows separate current and proposed paths that require the reader to infer changes.",
      },
      {
        name: "proportional-views",
        requirement:
          "Chooses readable media that preserve semantic fields instead of forcing every relationship into Mermaid.",
        failureExample: "Uses valid-looking but lossy or unreadable diagrams.",
      },
      {
        name: "minimal-realization",
        requirement:
          "Keeps the existing foundation and deletes persistence, governance, or machinery unsupported by accepted requirements.",
        failureExample:
          "Adds completeness machinery despite the confirmed non-goals.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
