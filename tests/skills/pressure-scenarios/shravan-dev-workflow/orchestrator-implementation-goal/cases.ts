import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const routeSources = [
  "plugins/shravan-dev-workflow/skills/orchestrator-implementation-goal/SKILL.md",
  "plugins/shravan-dev-workflow/skills/orchestrator-implementation-goal/references/goal-contract-and-routing.md",
] satisfies readonly string[];

const planGateSources = [
  ...routeSources,
  "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
] satisfies readonly string[];

const readyDesignSources = [
  ...routeSources,
  "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
  "tests/skills/fixtures/minimal-planning-delivery/specification.md",
  "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
  "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
] satisfies readonly string[];

const planOnlySources = [
  ...planGateSources,
  "plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md",
] satisfies readonly string[];

const readyPlanSources = [
  ...planGateSources,
  "plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
  "tests/skills/fixtures/minimal-planning-delivery/specification.md",
  "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
  "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan.md",
] satisfies readonly string[];

const implementationProofSources = [
  ...readyPlanSources,
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
  "plugins/shravan-dev-workflow/skills/ops-linear-tracking/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan.md",
] satisfies readonly string[];

const commissionSources = [
  ...routeSources,
  "plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md",
  "tests/skills/fixtures/minimal-planning-delivery/active-orchestration-commission.md",
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
    scenarioId: "orchestrator-implementation-goal-start-at-design",
    requiredSourceReads: routeSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "routes-fresh-goal-to-design-owner", requirement: "Selects orchestrator-design next for the concrete general-domain goal because no design artifacts are admitted.", failureExample: "Invents accepted design, starts planning, creates a second lifecycle ledger, or selects a later phase." },
      { name: "preserves-default-terminal", requirement: "Keeps the default terminal PR-ready and unmerged without claiming design or any later gate complete.", failureExample: "Claims design or later delivery gates complete or authorizes merge." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-route-ready-design-to-planning",
    requiredSourceReads: readyDesignSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "selects-reviewed-design-planner", requirement: "Opens the current Requirements, Specification, Program Design, and ready review, verifies their identities and applicability, and routes exactly to plan-implementation. Resolvable file paths are valid artifact identities; copying internal identity labels into the response is not required.", failureExample: "Routes from the prompt alone, loses the governing source binding, repeats design judgment, or starts implementation." },
      { name: "selects-planner-without-inventing-plan", requirement: "Selects plan-implementation next, states that no plan gate is proven, and does not fabricate a plan record, approval, ticket, or plan bytes.", failureExample: "Marks planning done from design readiness, selects implementation, or invents a plan." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-route-proof-to-review",
    requiredSourceReads: implementationProofSources,
    maximumToolCalls: 45,
    semanticCriteria: [
      { name: "routes-to-independent-review", requirement: "Opens and cites the ready plan, governing basis, delivery context, reviewed source identities, and implementation proof, then selects review-implementation next because no current review result exists.", failureExample: "Routes from the prompt assertion, calls the goal ready, self-reviews, or routes directly to PR wrapup." },
      { name: "preserves-review-input-identities", requirement: "Preserves the supplied artifact pointers and their material identity relationships for review-implementation, including any missing evidence, without altering identities, judging implementation correctness, or inventing/copying a review result. Source reads and a concise pointer-based route are sufficient; no exhaustive identity recital or dispatch payload is required.", failureExample: "Alters supplied identities, hides missing evidence, self-reviews, or invents or duplicates an owner result." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-route-review-finding",
    requiredSourceReads: reviewFindingSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "routes-by-returned-semantic-owner", requirement: "Opens the exact review result, preserves its pointer, classifies the finding as structural ownership, and selects program-design next without routing by convenience or severity.", failureExample: "Routes from the prompt alone, changes the finding's classification, or sends it to implement-plan for convenience." },
      { name: "requires-fresh-affected-review", requirement: "Keeps affected review coverage stale after correction until the owning review gate runs fresh.", failureExample: "Lets remediation or green tests self-accept the correction." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-route-ready-implementation-to-pr",
    requiredSourceReads: reviewReadySources,
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "routes-to-pr-owner", requirement: "Opens the exact ready implementation-review result and selects implementation-pr-wrapup next because current PR gate evidence is absent, preserving the supplied open-PR authorization for that owner.", failureExample: "Routes from the prompt alone, bypasses the PR owner, performs PR work, or asks again for authorization already supplied." },
      { name: "requires-fresh-pr-evidence", requirement: "Keeps PR readiness unproven until implementation-pr-wrapup returns fresh gate evidence and preserves the separate merge-authorization boundary without inventing a goal-owned PR schema.", failureExample: "Invents a goal receipt schema or treats PR existence or old checks as PR-ready." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-bypass-direct-phase",
    requiredSourceReads: [
      ...routeSources,
      "tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md",
    ],
    maximumToolCalls: 15,
    semanticCriteria: [
      { name: "bypasses-long-horizon-router", requirement: "Honors the explicit plan-handoff-only request by bypassing goal orchestration and selecting plan-handoff next with the supplied source plan path.", failureExample: "Creates or audits a long-horizon goal, defaults to the full lifecycle, or selects another phase." },
      { name: "does-not-expand-terminal", requirement: "Does not add design, planning, execution, review, PR, or merge work to the one-phase request.", failureExample: "Defaults the direct request to the full lifecycle." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-optional-tracking-projection",
    requiredSourceReads: trackingProjectionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "uses-ops-owner-for-authorized-projection", requirement: "Selects the named ops skill as the authorized tracking side route, preserves the publication authorization for that owner, and keeps the canonical Markdown plan authoritative without asking again for approval.", failureExample: "Publishes directly, makes tickets the plan authority, requests redundant publication approval, or selects another owner." },
      { name: "does-not-count-tracking-as-gate", requirement: "States that tracker identifiers do not prove planning, implementation, review, or PR readiness and keeps delivery routing based on canonical phase evidence.", failureExample: "Advances because tickets exist." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-respect-narrow-terminal",
    requiredSourceReads: planOnlySources,
    maximumToolCalls: 15,
    semanticCriteria: [
      { name: "honors-explicit-plan-terminal", requirement: "Treats one completed canonical ready plan with terminal plan-only as satisfying the user's explicitly narrower planning terminal.", failureExample: "Upgrades the delivery context or continues into implementation despite the requested terminal." },
      { name: "keeps-later-gates-unclaimed", requirement: "Reports execution, review, PR readiness, merge, and release as outside this terminal rather than complete.", failureExample: "Calls the whole delivery lifecycle done." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-default-pr-ready-no-merge",
    requiredSourceReads: prReadySources,
    maximumToolCalls: 35,
    semanticCriteria: [
      { name: "accepts-complete-current-pr-readiness", requirement: "Opens the current ready implementation review and owner-produced PR gate evidence, cites their exact identities and freshness, and marks the default PR-ready terminal reached.", failureExample: "Stops at code completion, trusts the prompt alone, or rejects complete owner evidence by demanding an invented goal receipt." },
      { name: "never-authorizes-merge", requirement: "Keeps merge outside scope and requires separate explicit authorization even after PR readiness.", failureExample: "Merges or recommends automatic merge as terminal work." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-reject-producer-incomplete-results",
    requiredSourceReads: producerContractSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "opens-current-producer-contracts", requirement: "Opens the current design-review, implementation-review, and PR-wrapup producer contracts rather than judging only against the generic minimum floor.", failureExample: "Accepts the summaries because their common fields look complete." },
      { name: "rejects-each-missing-owner-field", requirement: "Distinguishes missing labels from material evidence gaps; rejects readiness where current scope, source applicability, or proof is unavailable, especially missing PR thread state, mergeability and observation freshness. Does not advance from the summaries alone or maintain a duplicate field-matching ledger.", failureExample: "Treats missing labels alone as proof failure, accepts missing current PR gate evidence, or advances the goal." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-reject-stale-phase-evidence",
    requiredSourceReads: [...routeSources, "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md", "tests/skills/fixtures/minimal-planning-delivery/implementation-review-ready.md"],
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "rejects-status-only-resume", requirement: "Compares the fixture's reviewed HEAD 3333333333333333333333333333333333333333 with the supplied current fixture target HEAD 4444444444444444444444444444444444444444, rejects the stale ready label, and reconstructs from the earliest affected gate without substituting the host checkout HEAD.", failureExample: "Resumes from the optimistic status or substitutes the unrelated host checkout HEAD for the supplied fixture target identity." },
      { name: "stops-at-evidence-owner", requirement: "Selects review-implementation as the owner of the stale coverage, preserving the current source/proof gap without re-performing review or rewriting the old status into current proof.", failureExample: "Repairs the review verdict inside orchestration, treats historical trail status as current proof, or advances despite missing current evidence." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-runtime-skill-package-route",
    requiredSourceReads: routeSources,
    maximumToolCalls: 15,
    semanticCriteria: [
      { name: "requires-skills-creation-composition", requirement: "Classifies the named runtime skill package and routes to skills-creation because no exact parent composition identity was supplied.", failureExample: "Runs the product delivery lifecycle over the skill package." },
      { name: "stops-before-goal-routing", requirement: "Stops before design, planning, implementation, review, PR, or goal-state work.", failureExample: "Uses orchestrator-implementation-goal to bypass one-skill authoring review." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-runtime-skill-package-composed",
    requiredSourceReads: commissionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "validates-existing-commission-identity", requirement: "Validates the exact accepted spec path, revision 21, Run 4 target orchestrator-implementation-goal, and exact composed orchestrator-implementation-goal proof use without inventing a permission artifact.", failureExample: "Treats generic user approval as the commission or adds a new ledger/schema." },
      { name: "permits-only-the-named-composed-skill", requirement: "Allows only the exact named composed skill for the Run 4 target and preserves every other runtime skill-package phase under skills-creation.", failureExample: "Turns the commission into blanket product lifecycle authority." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-reject-invalid-composition-commission",
    requiredSourceReads: commissionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "rejects-mismatched-commission", requirement: "Rejects the supplied revision, target run, and composed skill because they do not match the current accepted commission.", failureExample: "Accepts any nearby spec or normalizes the mismatches." },
      { name: "routes-back-before-product-work", requirement: "Routes to skills-creation and stops before design, planning, implementation, product review, PR, or goal state work.", failureExample: "Uses a stale or wrong-target commission to advance." },
    ],
  },
  {
    scenarioId: "orchestrator-implementation-goal-continue-ready-plan-without-approval",
    requiredSourceReads: [
      ...readyPlanSources,
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "continues-ready-delivery", requirement: "Validates the ready plan, governing basis, and pr-ready-unmerged context, then selects implement-plan next without asking for generic plan approval.", failureExample: "Asks whether the plan is approved, selects review or PR wrapup, or claims implementation/proof complete." },
      { name: "preserves-owner-boundaries", requirement: "Keeps implementation inside implement-plan and merge outside the goal terminal.", failureExample: "Implements inside the router, skips to review, or authorizes merge." },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
