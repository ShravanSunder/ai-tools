import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "spec-program-review-baseline-and-proof-drift",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
    ],
    maximumToolCalls: 55,
    semanticCriteria: [
      {
        name: "authoritative-baseline",
        requirement:
          "Reviews the pair against the owner-confirmed working-main boundary rather than treating the failed branch or a decision-needed WIP as governing authority.",
        failureExample:
          "Accepts internal agreement among current artifacts while they preserve unauthorized branch machinery.",
      },
      {
        name: "deletion-before-repair",
        requirement:
          "Flags unsupported observation, interpreter, startup-counter, roster, supervisor, and recovery machinery for deletion before proposing missing contracts or fixes for it.",
        failureExample:
          "Completes the machinery's joining/admitted states or patches its interpreter path without testing whether the machinery is required.",
      },
      {
        name: "proof-level-fidelity",
        requirement:
          "Rejects focused lock or unit evidence as proof of the full submit-process-notify journey, process isolation, or whole-cohort failure behavior.",
        failureExample:
          "Calls the pair planning-ready because a narrow upstream test passed.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-reader-understanding",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
    ],
    maximumToolCalls: 65,
    semanticCriteria: [
      {
        name: "independent-review",
        requirement:
          "Performs read-only candidate review without editing, accepting, or redesigning the fixtures.",
        failureExample: "Rewrites the artifacts or treats review as acceptance.",
      },
      {
        name: "deletion-quality",
        requirement:
          "Identifies element-specific deletion or merge candidates with reader consequences while preserving ownership, failure, tradeoff, mapping, and proof semantics.",
        failureExample:
          "Returns only verbosity advice or deletes load-bearing content.",
      },
      {
        name: "diagram-usefulness",
        requirement:
          "Rejects a decorative diagram that carries no calls, state, direction, or failure meaning.",
        failureExample: "Keeps a diagram merely because it renders.",
      },
    ],
  },
  {
    scenarioId: "spec-program-review-scope-and-call-path",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
    ],
    maximumToolCalls: 50,
    semanticCriteria: [
      {
        name: "baseline-fidelity",
        requirement:
          "Catches the five lost skills despite agreement among the narrowed current artifacts.",
        failureExample: "Declares readiness because the current files agree.",
      },
      {
        name: "call-path-review",
        requirement:
          "Finds the missing current/proposed call path and silently removed edge without demanding blanket unchanged labels.",
        failureExample:
          "Reviews components but misses executable call behavior or removed edges.",
      },
      {
        name: "deletion-before-addition",
        requirement:
          "Tests deletion of unsupported persistence and certification machinery before completing its missing contracts.",
        failureExample:
          "Invents more contracts for unnecessary machinery.",
      },
      {
        name: "review-authority",
        requirement:
          "Keeps scope expansion as an owner decision and avoids broad reviewer fan-out.",
        failureExample:
          "Authors expanded design or dispatches every possible lane.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
