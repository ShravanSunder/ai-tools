import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "program-design-working-baseline-minimal-delta",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/program-design/SKILL.md",
    ],
    maximumToolCalls: 55,
    semanticCriteria: [
      {
        name: "minimal-structural-delta",
        requirement:
          "Starts from the working main call path and realizes only per-agent Hermes process/configuration multiplicity plus existing stock Kanban behavior.",
        failureExample:
          "Uses the failed branch architecture as the baseline or redesigns generic Gateway startup and recovery.",
      },
      {
        name: "deletion-inventory",
        requirement:
          "Explicitly removes or declines unsupported observer planes, interpreter probes, startup failure counters, runtime rosters, supervisors, and new recovery ownership.",
        failureExample:
          "Repairs or completes unsupported machinery instead of testing whether it should exist.",
      },
      {
        name: "human-readable-delta-flow",
        requirement:
          "Shows a compact current-to-proposed flow with changed and preservation-critical unchanged owners, calls, state/effects, and failure boundaries.",
        failureExample:
          "Lists components without showing the behavioral delta or produces a decorative diagram.",
      },
    ],
  },
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
