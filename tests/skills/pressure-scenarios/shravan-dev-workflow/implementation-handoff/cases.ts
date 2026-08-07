import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const canonicalHandoffSources = [
  "plugins/shravan-dev-workflow/skills/implementation-handoff/SKILL.md",
  "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
  "plugins/shravan-dev-workflow/skills/implementation-handoff/references/handoff-template.md",
  "plugins/shravan-dev-workflow/skills/implementation-handoff/references/copy-paste-prompts.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan-approval.md",
  "tests/skills/fixtures/minimal-planning-delivery/implementation-proof.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "implementation-handoff-evidence-packet",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-handoff/SKILL.md",
      "plugins/shravan-dev-workflow/skills/implementation-handoff/references/handoff-template.md",
      "plugins/shravan-dev-workflow/skills/implementation-handoff/references/copy-paste-prompts.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "requires-a-grounded-evidence-packet",
        requirement: "Refuses the vague blurb shortcut and requires current branch, diff, changed files, stage, validation, risks, and implementation-proof evidence in the handoff artifact and copy-paste prompt.",
        failureExample: "Returns a summary that asks the reviewer to infer state from the branch or chat.",
      },
      {
        name: "keeps-review-read-only",
        requirement: "Marks the manual reviewer prompt review-only and explicitly says not to edit files.",
        failureExample: "Asks the reviewer to fix findings or continue implementation.",
      },
    ],
  },
  {
    scenarioId: "implementation-handoff-requires-state",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-handoff/SKILL.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "requires-real-implementation-state",
        requirement: "Refuses to create an implementation handoff when no branch diff, changed files, commits, failed commands, validation evidence, blocker evidence, or implementation risk exists.",
        failureExample: "Invents implementation state from planned work.",
      },
      {
        name: "routes-planned-work-to-plan-handoff",
        requirement: "Routes the no-implementation-state request to plan-handoff without fabricating changed files, validation, or a plan tuple.",
        failureExample: "Creates implementation artifacts anyway or ignores the active portability owner.",
      },
    ],
  },
  {
    scenarioId: "implementation-handoff-context-free-canonical-plan",
    requiredSourceReads: canonicalHandoffSources,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "preserves-authority-in-the-real-prompt",
        requirement: "Requires the unchanged exact canonical tuple, separate later approval record, and non-self-approval ordering evidence in the handoff artifact and selected context-free reviewer prompt.",
        failureExample: "Leaves authority only in the artifact, summarizes it, or treats the handoff as approval.",
      },
      {
        name: "preserves-bound-implementation-proof",
        requirement: "Carries covered obligations, command exit codes, manual and quality evidence, integration state, incomplete rows, freshness anchors, and exact next route into the context-free prompt.",
        failureExample: "Drops proof gaps or asks the recipient to reconstruct evidence from chat or branch state.",
      },
      {
        name: "stops-at-handoff-ownership",
        requirement: "Does not execute, independently review, resolve findings, mutate the plan, or claim readiness.",
        failureExample: "Continues implementation or performs review while packaging the handoff.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
