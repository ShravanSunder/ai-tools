import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const admissionSources = [
  "plugins/shravan-dev-workflow/skills/plan-handoff/SKILL.md",
] satisfies readonly string[];

const completedPlanSources = [
  ...admissionSources,
  "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
] satisfies readonly string[];

const portablePlanSources = [
  ...completedPlanSources,
  "plugins/shravan-dev-workflow/skills/plan-handoff/references/handoff-template.md",
  "tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md",
  "tests/skills/fixtures/minimal-planning-delivery/handoff-approval.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "plan-handoff-existing-plan-only",
    requiredSourceReads: admissionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "requires-an-existing-plan",
        requirement: "Refuses to package design context as an existing plan and creates no plan-handoff artifact when no plan exists.",
        failureExample: "Invents a plan identity or produces a plan handoff from the design idea.",
      },
      {
        name: "uses-authority-sensitive-routing",
        requirement: "Routes the supplied unreviewed design idea to spec-handoff for portability and does not recommend plan-implementation without current ready three-artifact authority.",
        failureExample: "Reports generic planning unavailability or recommends plan-implementation without its admission evidence.",
      },
    ],
  },
  {
    scenarioId: "plan-handoff-routes-ready-design-to-planner",
    requiredSourceReads: [
      ...admissionSources,
      "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
      "tests/skills/fixtures/minimal-planning-delivery/specification.md",
      "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
      "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "routes-ready-design-to-planner",
        requirement: "Recognizes exact current ready three-artifact authority and routes missing plan creation to plan-implementation.",
        failureExample: "Reports planning unavailable or routes only to spec-handoff despite exact ready authority.",
      },
      {
        name: "does-not-fabricate-a-handoff",
        requirement: "Creates no plan and no plan-handoff artifact because an existing canonical plan does not yet exist.",
        failureExample: "Invents the task sequence or a plan tuple inside plan-handoff.",
      },
    ],
  },
  {
    scenarioId: "plan-handoff-full-packet",
    requiredSourceReads: portablePlanSources,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "requires-complete-plan-coverage",
        requirement: "Requires a line count and end-to-end plan read before packaging instead of trusting the user's summary.",
        failureExample: "Produces a compact prompt from summary-only context.",
      },
      {
        name: "produces-portable-artifacts",
        requirement: "In this fast read-only characterization, returns the complete copy-paste prompt and states that the normal write-enabled route requires repo-local plan-handoff and copy-paste-prompt artifacts with repo/worktree, branch, source identity, open questions, and security context, without claiming those files were created now.",
        failureExample: "Returns a thin chat paragraph, omits portability fields, or falsely claims read-only artifact creation.",
      },
      {
        name: "preserves-plan-and-proof-authority",
        requirement: "Preserves the immutable handoff-plan.md path, originating planner plan-implementation, draft payload, separate approval absence from handoff-approval.md, obligation/proof mapping, freshness guards, split triggers, gaps, and parent verification rule without embedding approval or a document digest in the plan.",
        failureExample: "Reauthors the plan, drops proof metadata, or treats handoff as approval.",
      },
    ],
  },
  {
    scenarioId: "plan-handoff-proof-matrix-preservation",
    requiredSourceReads: portablePlanSources,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "rejects-summary-only-compression",
        requirement: "Requires full plan coverage before packaging and does not infer missing fields from the user's summary.",
        failureExample: "Accepts summary-only packaging for speed.",
      },
      {
        name: "preserves-obligation-proof-context",
        requirement: "Preserves the immutable handoff-plan.md path, separate approval absence from handoff-approval.md, evidence sources, freshness guards, split triggers, open proof gaps, and parent-owned verification with the obligation-to-slice-to-proof mapping without embedding approval or a document digest in the plan.",
        failureExample: "Carries commands but drops ownership, freshness, or delegated-evidence verification.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
