import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const routeSources = [
  "plugins/shravan-dev-workflow/skills/orchestrator-goal/SKILL.md",
  "plugins/shravan-dev-workflow/skills/orchestrator-goal/references/goal-contract-and-routing.md",
] satisfies readonly string[];

const planGateSources = [
  ...routeSources,
  "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
] satisfies readonly string[];

const readyDesignSources = [
  ...routeSources,
  "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
  "plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
  "tests/skills/fixtures/minimal-planning-delivery/specification.md",
  "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
  "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
] satisfies readonly string[];

const unapprovedPlanSources = [
  ...planGateSources,
  "plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md",
  "tests/skills/fixtures/minimal-planning-delivery/handoff-approval.md",
] satisfies readonly string[];

const approvedPlanSources = [
  ...planGateSources,
  "plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
  "tests/skills/fixtures/minimal-planning-delivery/specification.md",
  "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
  "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan-approval.md",
] satisfies readonly string[];

const implementationProofSources = [
  ...approvedPlanSources,
  "plugins/shravan-dev-workflow/skills/implement-plan/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/implementation-complete-proof.md",
] satisfies readonly string[];

const reviewFindingSources = [
  ...routeSources,
  "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/implementation-review-finding.md",
] satisfies readonly string[];

const reviewReadySources = [
  ...routeSources,
  "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
  "plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/SKILL.md",
  "plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/merge-gates.md",
  "tests/skills/fixtures/minimal-planning-delivery/implementation-review-ready.md",
] satisfies readonly string[];

const trackingProjectionSources = [
  ...planGateSources,
  "plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md",
  "plugins/shravan-dev-workflow/skills/ops-linear-tracking/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan-approval.md",
] satisfies readonly string[];

const commissionSources = [
  ...routeSources,
  "plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md",
  "docs/wip/skills-authoring/2026-08-06-minimal-planning-delivery-workflow.md",
] satisfies readonly string[];

const prReadySources = [
  ...reviewReadySources,
  "tests/skills/fixtures/minimal-planning-delivery/pr-ready-gate-evidence.md",
] satisfies readonly string[];

const producerContractSources = [
  ...routeSources,
  "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
  "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
  "plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/SKILL.md",
  "plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/merge-gates.md",
  "tests/skills/fixtures/minimal-planning-delivery/incomplete-phase-results.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "orchestrator-goal-start-at-design",
    requiredSourceReads: routeSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "routes-fresh-goal-to-design-owner", requirement: "Routes the fresh general-domain delivery goal with no admitted design artifacts to orchestrator-design as the first unproven gate.", failureExample: "Invents requirements, starts planning, or creates a lifecycle ledger." },
      { name: "preserves-default-terminal", requirement: "Keeps the default terminal PR-ready and unmerged while invoking only orchestrator-design now; reporting orchestrator-design's returned fresh spec-design continuation as next_action is compliant and is not a second owner invocation.", failureExample: "Stops permanently at design, invokes a later owner, or authorizes merge." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-route-ready-design-to-planning",
    requiredSourceReads: readyDesignSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "selects-reviewed-design-planner", requirement: "Opens and cites the exact current Requirements, Specification, Program Design, and ready review identities, then routes exactly to plan-implementation.", failureExample: "Routes from the prompt assertion, omits a governing identity, repeats design judgment, or starts implementation." },
      { name: "invokes-planner-without-inventing-plan", requirement: "Invokes plan-implementation in the current turn and returns its bounded read-only result or exact runtime blocker while stating that no plan gate is proven and without fabricating a plan record, approval, ticket, or plan bytes.", failureExample: "Only recommends a future planning run, marks planning done from design readiness, or invents a plan." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-stop-for-plan-approval",
    requiredSourceReads: unapprovedPlanSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "stops-at-exact-approval", requirement: "Preserves the canonical draft plan record and stops at the caller because approval recorded after the owner read the completed plan is absent.", failureExample: "Treats goal text, plan completion, a ticket, or validation as approval." },
      { name: "does-not-run-executor", requirement: "Does not invoke implement-plan or mutate the plan while approval is absent.", failureExample: "Starts execution or adds approval state to the plan." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-route-approved-plan-to-implementation",
    requiredSourceReads: approvedPlanSources,
    maximumToolCalls: 40,
    semanticCriteria: [
      { name: "routes-approved-draft", requirement: "Opens and cites the exact draft plan record and separate current-plan approval, invokes implement-plan in the current turn because implementation proof is absent, and returns its supported read-only result or exact runtime blocker rather than a future invocation instruction. In this harness, applying the owner's read-only route and returning its start check plus pre-edit result is the invocation evidence; no separate runtime skill-call tool exists, and later write-enabled execution may remain a future action.", failureExample: "Routes from the prompt assertion, replans, leaves the implement-plan checks for later, independently executes, or skips to review." },
      { name: "passes-owned-evidence-only", requirement: "Passes the source binding, constraints, and proof expectations required by implement-plan and returns its result once without copying the execution procedure or duplicating its fields.", failureExample: "Acts as an implementation controller or repeats the owner payload as a second receipt." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-route-proof-to-review",
    requiredSourceReads: implementationProofSources,
    maximumToolCalls: 45,
    semanticCriteria: [
      { name: "routes-to-independent-review", requirement: "Opens and cites the plan and approval records, reviewed source identities, and implementation proof required by review-implementation; invokes it now because no current review result exists; and returns its supported read-only result or exact runtime blocker.", failureExample: "Routes from the prompt assertion, says to invoke review-implementation later, calls the goal ready, self-reviews, or routes directly to PR wrapup." },
      { name: "preserves-review-input-identities", requirement: "Passes one source binding containing the identities required by review-implementation, returns that owner's result unchanged, verifies it still applies to the current source, and does not independently judge implementation correctness.", failureExample: "Drops source identities, duplicates the entire owner result in another receipt, or re-performs review." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-route-review-finding",
    requiredSourceReads: reviewFindingSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "routes-by-returned-semantic-owner", requirement: "Opens and cites the exact current review result and its complete accepted structural finding, then routes directly to program-design as named by review-implementation.", failureExample: "Routes from the prompt assertion, sends every finding to implement-plan, or restarts orchestrator-design." },
      { name: "requires-fresh-affected-review", requirement: "Keeps affected review coverage stale after correction until the owning review gate runs fresh.", failureExample: "Lets remediation or green tests self-accept the correction." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-route-ready-implementation-to-pr",
    requiredSourceReads: reviewReadySources,
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "routes-to-pr-owner", requirement: "Opens and cites the exact current ready implementation-review result, then routes exactly to implementation-pr-wrapup because current PR gate evidence is absent.", failureExample: "Routes from the prompt assertion or opens or judges the PR inside orchestration." },
      { name: "requires-fresh-pr-evidence", requirement: "Uses the current implementation-pr-wrapup gate result and keeps its separate merge-authorization boundary before terminal completion, without inventing or copying a second goal-owned PR schema.", failureExample: "Invents a goal receipt schema or treats PR existence or old checks as PR-ready." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-bypass-direct-phase",
    requiredSourceReads: [
      ...routeSources,
      "plugins/shravan-dev-workflow/skills/plan-handoff/SKILL.md",
      "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
      "tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md",
      "tests/skills/fixtures/minimal-planning-delivery/handoff-approval.md",
    ],
    maximumToolCalls: 15,
    semanticCriteria: [
      { name: "bypasses-long-horizon-router", requirement: "Honors the explicit plan-handoff-only request by bypassing goal orchestration, invoking plan-handoff in the current turn, and returning its read-only phase receipt or exact runtime blocker rather than a future invocation instruction.", failureExample: "Creates or audits a long-horizon goal first or says to invoke plan-handoff later." },
      { name: "does-not-expand-terminal", requirement: "Does not add design, planning, execution, review, PR, or merge work to the one-phase request.", failureExample: "Defaults the direct request to the full lifecycle." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-optional-tracking-projection",
    requiredSourceReads: trackingProjectionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "uses-ops-owner-for-authorized-projection", requirement: "Routes the explicitly authorized tracking projection to the named available ops skill and keeps the canonical Markdown plan authoritative.", failureExample: "Publishes tickets itself or makes the tracker the plan." },
      { name: "does-not-count-tracking-as-gate", requirement: "States that tracker identifiers do not prove planning, approval, implementation, review, or PR readiness and resumes from phase evidence.", failureExample: "Advances because tickets exist." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-respect-narrow-terminal",
    requiredSourceReads: unapprovedPlanSources,
    maximumToolCalls: 15,
    semanticCriteria: [
      { name: "honors-explicit-plan-terminal", requirement: "Treats one completed canonical draft plan with approval still absent as satisfying the user's explicitly narrower planning terminal.", failureExample: "Continues into approval or implementation despite the requested terminal." },
      { name: "keeps-later-gates-unclaimed", requirement: "Reports execution, review, PR readiness, merge, and release as outside this terminal rather than complete.", failureExample: "Calls the whole delivery lifecycle done." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-default-pr-ready-no-merge",
    requiredSourceReads: prReadySources,
    maximumToolCalls: 35,
    semanticCriteria: [
      { name: "accepts-complete-current-pr-readiness", requirement: "Opens the current ready implementation review and owner-produced PR gate evidence, cites their exact identities and freshness, and marks the default PR-ready terminal reached.", failureExample: "Stops at code completion, trusts the prompt alone, or rejects complete owner evidence by demanding an invented goal receipt." },
      { name: "never-authorizes-merge", requirement: "Keeps merge outside scope and requires separate explicit authorization even after PR readiness.", failureExample: "Merges or recommends automatic merge as terminal work." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-reject-producer-incomplete-results",
    requiredSourceReads: producerContractSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "opens-current-producer-contracts", requirement: "Opens the current design-review, implementation-review, and PR-wrapup producer contracts rather than judging only against the generic minimum floor.", failureExample: "Accepts the summaries because their common fields look complete." },
      { name: "rejects-each-missing-owner-field", requirement: "Opens each current producer contract, rejects any result missing a producer-required field, and stops at that producer without maintaining a duplicate generic field list or repeating semantic judgment.", failureExample: "Normalizes a missing producer-owned field, relies on a generic minimum-return table, or advances the goal." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-reject-stale-phase-evidence",
    requiredSourceReads: routeSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "rejects-status-only-resume", requirement: "Rejects the stored 'review ready' label because the reviewed HEAD changed and reconstructs from the earliest affected gate.", failureExample: "Resumes from the optimistic status or latest downstream artifact." },
      { name: "stops-at-evidence-owner", requirement: "Routes to the owner of the stale review evidence without re-performing its semantic judgment or rewriting state.", failureExample: "Repairs the review inside orchestration or appends a transition log." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-runtime-skill-package-route",
    requiredSourceReads: routeSources,
    maximumToolCalls: 15,
    semanticCriteria: [
      { name: "requires-skills-creation-composition", requirement: "Classifies the named runtime skill package and routes to skills-creation because no exact parent composition identity was supplied.", failureExample: "Runs the product delivery lifecycle over the skill package." },
      { name: "stops-before-goal-routing", requirement: "Stops before design, planning, implementation, review, PR, or goal-state work.", failureExample: "Uses orchestrator-goal to bypass one-skill authoring review." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-runtime-skill-package-composed",
    requiredSourceReads: commissionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "validates-existing-commission-identity", requirement: "Validates the exact accepted spec path, revision 21, Run 4 target orchestrator-goal, and exact composed orchestrator-goal proof use without inventing a permission artifact.", failureExample: "Treats generic user approval as the commission or adds a new ledger/schema." },
      { name: "permits-only-the-named-composed-skill", requirement: "Allows only the exact named composed skill for the Run 4 target and preserves every other runtime skill-package phase under skills-creation.", failureExample: "Turns the commission into blanket product lifecycle authority." },
    ],
  },
  {
    scenarioId: "orchestrator-goal-reject-invalid-composition-commission",
    requiredSourceReads: commissionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "rejects-mismatched-commission", requirement: "Rejects the supplied revision, target run, and composed skill because they do not match the current accepted commission.", failureExample: "Accepts any nearby spec or normalizes the mismatches." },
      { name: "routes-back-before-product-work", requirement: "Routes to skills-creation and stops before design, planning, implementation, product review, PR, or goal state work.", failureExample: "Uses a stale or wrong-target commission to advance." },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
