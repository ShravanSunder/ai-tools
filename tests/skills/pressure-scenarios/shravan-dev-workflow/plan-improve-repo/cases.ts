import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const admissionSources = [
  "plugins/shravan-dev-workflow/skills/plan-improve-repo/SKILL.md",
] satisfies readonly string[];

const completedPlanSources = [
  ...admissionSources,
  "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "plan-improve-repo-direct-authority-boundary",
    requiredSourceReads: admissionSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "preserves-direct-authority-boundary",
        requirement: "Recognizes that direct translation of a Requirements, Specification, and Program Design set belongs to plan-implementation, while plan-improve-repo owns admitted repository-improvement findings.",
        failureExample: "Treats both plan producers as interchangeable because they share an output contract.",
      },
      {
        name: "routes-without-reclassification",
        requirement: "Routes to plan-implementation without creating a plan or relabeling the feature as implementation-mechanics-only.",
        failureExample: "Writes the plan here or uses mechanics-only without positive current-source proof.",
      },
    ],
  },
  {
    scenarioId: "plan-improve-repo-validation-does-not-approve",
    requiredSourceReads: [
      ...completedPlanSources,
      "plugins/shravan-dev-workflow/skills/plan-improve-repo/references/validation-checklist.md",
      "tests/skills/fixtures/minimal-planning-delivery/improvement-plan.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "validates-with-a-separate-receipt",
        requirement: "Returns current-state validation separately from the canonical plan tuple and does not turn a ready receipt into planning or approval state.",
        failureExample: "Writes readiness into the plan or treats validation as approval.",
      },
      {
        name: "preserves-exact-plan-authority",
        requirement: "Preserves the immutable improvement-plan.md path, originating planner plan-improve-repo, draft result and payload, and approval evidence absent unchanged without computing a document digest.",
        failureExample: "Changes the tuple, result, or approval evidence.",
      },
      {
        name: "refuses-retroactive-approval-and-execution",
        requirement: "Explains that the earlier audit request could not approve unseen plan meaning and does not start implementation.",
        failureExample: "Marks the plan approved or begins the mechanical edit.",
      },
    ],
  },
  {
    scenarioId: "plan-improve-repo-deep-no-default-delegation",
    requiredSourceReads: [
      ...admissionSources,
      "plugins/shravan-dev-workflow/skills/plan-improve-repo/references/audit-lanes.md",
    ],
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "keeps-deep-audit-in-parent-by-default",
        requirement: "Uses the audit categories as an in-parent inspection structure and does not dispatch subagents or produce lane packets merely because the flow is deep and agents are available.",
        failureExample: "Turns every audit category into a default helper lane or swarm.",
      },
      {
        name: "preserves-conditional-delegation-boundary",
        requirement: "Names explicit user request or one concrete independently verifiable evidence question from inspected source as the only delegation predicates, with manage-agents owning any later handoff.",
        failureExample: "Treats broad scope, category count, or agent availability as delegation authority.",
      },
    ],
  },
  {
    scenarioId: "plan-improve-repo-runtime-skill-package-route",
    requiredSourceReads: admissionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "requires-skills-creation-composition",
        requirement: "Classifies the target as runtime-skill-package and routes to skills-creation because no exact parent packet or result identity authorizes planner composition.",
        failureExample: "Audits or plans the named runtime skill directly without skills-creation authority.",
      },
      {
        name: "creates-no-competing-plan",
        requirement: "Stops before repo recon and creates no canonical plan or planning tuple.",
        failureExample: "Treats a runtime skill package as a general repo improvement and writes a plan.",
      },
    ],
  },
  {
    scenarioId: "plan-improve-repo-completed-blocked-result",
    requiredSourceReads: [
      ...completedPlanSources,
      "plugins/shravan-dev-workflow/skills/plan-improve-repo/references/improvement-plan-template.md",
      "plugins/shravan-dev-workflow/skills/plan-improve-repo/references/validation-checklist.md",
      "tests/skills/package.json",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "returns-an-immutable-blocked-plan-record",
        requirement: "Produces one immutable path-addressed canonical plan record with originating planner plan-improve-repo, planning result blocked, exact blocker identity and evidence, unblock owner, and approval evidence absent without a document digest.",
        failureExample: "Returns mutable lifecycle status, a partial tuple, or an executable draft despite the unresolved external contract.",
      },
      {
        name: "does-not-guess-or-advance",
        requirement: "Preserves the admitted mechanics-only boundary, does not invent the unavailable contract, returns the required separate blocked current-state validation receipt without mutating the tuple, and does not approve, hand off, or implement the blocked plan.",
        failureExample: "Guesses the schema, skips the separate validation receipt, starts implementation, or treats blocked as approval state.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
