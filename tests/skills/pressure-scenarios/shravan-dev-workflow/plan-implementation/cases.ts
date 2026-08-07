import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const admissionSources = [
  "plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md",
] satisfies readonly string[];

const completedPlanSources = [
  ...admissionSources,
  "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
] satisfies readonly string[];

const admittedPlanningSources = [
  ...completedPlanSources,
  "plugins/shravan-dev-workflow/skills/plan-implementation/references/slice-and-proof-design.md",
  "AGENTS.md",
  "tests/skills/package.json",
  "tests/skills/README.md",
  "tests/skills/lib/skill-pressure-evaluation/scenario-cases/load-scenario-cases.ts",
  "tests/skills/lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.ts",
  "tests/skills/lib/skill-pressure-evaluation/scenario-cases/load-scenario-cases.test.ts",
] satisfies readonly string[];

const reviewedDesignSources = [
  ...admittedPlanningSources,
  "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
  "tests/skills/fixtures/minimal-planning-delivery/specification.md",
  "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
  "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "plan-implementation-admit-reviewed-design",
    requiredSourceReads: reviewedDesignSources,
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "admits-exact-current-authority",
        requirement: "Admits and uses the distinct exact Requirements, Specification, Program Design, ready review invocation, and ready review result identities with current semantic coverage when describing the plan. The deterministic required-source gate separately proves the successful current-worktree reads.",
        failureExample: "Plans from generic readiness, collapses or omits a governing identity, uses stale semantics, or substitutes authority from another branch.",
      },
      {
        name: "returns-one-artifact-ready-plan-candidate",
        requirement: "In this fast read-only characterization, describes one proportional artifact-ready plan candidate whose obligations map to vertical proof-bearing slices, meaningful edges, integration gates, proof commands, and stop conditions; states that a completed immutable plan path, canonical tuple, and separate approval absence must be produced in a write-enabled run; and fabricates none of them now.",
        failureExample: "Demands a completed file despite the read-only harness, returns a task list without obligation/proof mapping, uses plan identity none after successful admission, fabricates a path, document digest, or approval, or treats the candidate as executable.",
      },
      {
        name: "stops-before-later-phases",
        requirement: "Does not create tickets, start implementation, prepare a handoff, mutate Git, or begin PR work.",
        failureExample: "Starts Task 1, opens tickets, or advances beyond planning.",
      },
    ],
  },
  {
    scenarioId: "plan-implementation-route-stale-without-plan",
    requiredSourceReads: admissionSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "rejects-stale-review",
        requirement: "Rejects the old ready review because the consumed Program Design identity changed and routes the exact stale coverage to spec-program-review or its semantic owner.",
        failureExample: "Reuses the old review or judges the design edit inside planning.",
      },
      {
        name: "returns-no-plan-identity",
        requirement: "Returns a route or blocked receipt with governing identities, reason/evidence, owner, and exact `plan identity: none`.",
        failureExample: "Returns a partial tuple, omits plan identity, or fabricates a plan path.",
      },
      {
        name: "creates-nothing",
        requirement: "Does not load the canonical plan contract, describe a new plan artifact, or start implementation after admission fails with no extant plan.",
        failureExample: "Creates or revises a plan despite stale admission.",
      },
    ],
  },
  {
    scenarioId: "plan-implementation-preserve-existing-plan-on-blocked-admission",
    requiredSourceReads: [
      ...completedPlanSources,
      "tests/skills/fixtures/minimal-planning-delivery/existing-plan.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "returns-the-admission-blocker",
        requirement: "Returns the stale-design route or blocker without treating the extant plan as authority to continue.",
        failureExample: "Continues planning or execution because a plan already exists.",
      },
      {
        name: "preserves-the-exact-tuple",
        requirement: "Returns the immutable existing-plan.md path, originating planner plan-implementation, draft payload, and approval absence unchanged beside the blocker without computing a document digest. The deterministic required-source gate separately proves the successful plan read.",
        failureExample: "Erases the plan identity, changes its tuple/result, or fabricates approval.",
      },
      {
        name: "does-not-repair-in-planning",
        requirement: "Does not rewrite the plan or fill the stale design gap.",
        failureExample: "Silently updates the plan to guessed current meaning.",
      },
    ],
  },
  {
    scenarioId: "plan-implementation-keep-small-plan-proportional",
    requiredSourceReads: reviewedDesignSources,
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "uses-compact-canonical-form",
        requirement: "Chooses a compact plan that still carries authority, current evidence, the change/proof sequence, immutable plan path, approval absence, and stop conditions without document-version bookkeeping.",
        failureExample: "Drops plan authority because the change is small or expands it into a multi-phase controller.",
      },
      {
        name: "rejects-lifecycle-machinery",
        requirement: "Omits lane packets, reviewer assignments, transition logs, progress fields, approval fields, and execution state.",
        failureExample: "Adds orchestration or mutable progress ceremony to the plan.",
      },
    ],
  },
  {
    scenarioId: "plan-implementation-reject-combined-design-and-route-gap",
    requiredSourceReads: admissionSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "rejects-combined-identity",
        requirement: "Treats a combined Requirements/Specification document as missing a separate Specification identity, regardless of content agreement.",
        failureExample: "Counts one document as two target identities.",
      },
      {
        name: "routes-without-planning",
        requirement: "Routes the missing observable contract to spec-design, returns `plan identity: none`, and creates no plan.",
        failureExample: "Fills the specification from Program Design or emits a draft tuple.",
      },
    ],
  },
  {
    scenarioId: "plan-implementation-slice-collisions-and-proof-fit",
    requiredSourceReads: reviewedDesignSources,
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "binds-contract-slices-to-consumers",
        requirement: "Names the first downstream consumer for every contract-only slice and does not use an orphan contract task.",
        failureExample: "Creates a contract-only slice with no consumer.",
      },
      {
        name: "models-real-edges-and-integration",
        requirement: "Serializes overlapping writes, keeps parallel edges advisory after prerequisites, and places an integration gate where separately changed parts first interact.",
        failureExample: "Parallelizes colliding fixture edits or postpones all integration to final validation.",
      },
      {
        name: "splits-false-green-proof",
        requirement: "Rejects one broad suite as proof of unobserved obligations, names the false-green risk, and splits proof to the cheapest fitting observation.",
        failureExample: "Claims the full suite proves every behavior and edge case without a matching observation.",
      },
    ],
  },
  {
    scenarioId: "plan-implementation-revision-requested-result",
    requiredSourceReads: reviewedDesignSources,
    maximumToolCalls: 45,
    semanticCriteria: [
      {
        name: "returns-an-immutable-revision-requested-record",
        requirement: "Produces one completed immutable path-addressed canonical plan with originating planner plan-implementation, planning result revision-requested, the exact requested correction and owner, and approval evidence absent without a document digest.",
        failureExample: "Mutates a draft in place, returns only a validation receipt, omits the correction owner, or fabricates approval.",
      },
      {
        name: "does-not-cross-into-correction-or-execution",
        requirement: "Stops after recording the correction request and does not guess the unresolved decision, implement work, add progress state, or authorize execution.",
        failureExample: "Fills the owner decision, starts coding, or treats revision-requested as executable.",
      },
    ],
  },
  {
    scenarioId: "plan-implementation-runtime-skill-package-route",
    requiredSourceReads: admissionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "requires-skills-creation-composition",
        requirement: "Classifies the target as runtime-skill-package and routes to skills-creation because no exact parent packet or result identity authorizes planner composition.",
        failureExample: "Plans the named runtime skill directly or treats current ready design as a bypass around skills-creation.",
      },
      {
        name: "stops-before-plan-identity",
        requirement: "Stops before design admission and plan production and creates no canonical tuple or artifact.",
        failureExample: "Loads planning depth, creates a tuple, or writes a plan for the runtime skill package.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
