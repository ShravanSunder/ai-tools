import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export default {
  scenarioId: "spec-program-review-reader-understanding",
  requiredSourceReads: ["plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md"],
  maximumToolCalls: 65,
  semanticCriteria: [
    { name: "independent-review", requirement: "Performs read-only candidate review without editing, accepting, or redesigning the fixtures.", failureExample: "Rewrites the artifacts or treats review as acceptance." },
    { name: "deletion-quality", requirement: "Identifies element-specific deletion or merge candidates with reader consequences while preserving ownership, failure, tradeoff, mapping, and proof semantics.", failureExample: "Returns only verbosity advice or deletes load-bearing content." },
    { name: "diagram-usefulness", requirement: "Rejects a decorative diagram that carries no calls, state, direction, or failure meaning.", failureExample: "Keeps a diagram merely because it renders." },
  ],
} satisfies SkillPressureCaseDefinition;
