import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const admissionSources = [
  "plugins/shravan-dev-workflow/skills/implement-plan/SKILL.md",
  "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
] satisfies readonly string[];

const executionSources = [
  ...admissionSources,
  "plugins/shravan-dev-workflow/skills/implement-plan/references/execution-and-proof.md",
] satisfies readonly string[];

const approvedPlanSources = [
  ...executionSources,
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan-approval.md",
] satisfies readonly string[];

const approvedImprovementPlanSources = [
  ...executionSources,
  "tests/skills/fixtures/minimal-planning-delivery/improvement-plan.md",
  "tests/skills/fixtures/minimal-planning-delivery/improvement-plan-approval.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "implement-plan-admit-approved-draft",
    requiredSourceReads: [
      ...approvedPlanSources,
      "AGENTS.md",
      "tests/skills/package.json",
      "tests/skills/lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.ts",
    ],
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "admits-only-the-exact-approved-draft",
        requirement: "Returns admission for the exact unchanged draft tuple and complete matching later owner approval-evidence record and does not treat the plan or earlier request as self-approval. Judge the response's authority meaning; the deterministic required-source gate exclusively proves successful plan, approval, and repository reads.",
        failureExample: "Ignores the exact plan path, current meaning, or approval ordering evidence; rewrites the tuple; or claims blanket authorization.",
      },
      {
        name: "returns-a-proof-bearing-ready-frontier",
        requirement: "Because this fast harness is read-only, identifies the smallest ready frontier, its writes, focused proof, first integration gate or explicit not-applicable reason, and completion-report fields without claiming the slice was executed.",
        failureExample: "Begins editing, fabricates command results, returns a broad task list, or claims implementation complete.",
      },
      {
        name: "stops-before-later-phases",
        requirement: "Does not start independent review, ticket publication, PR work, merge, or release.",
        failureExample: "Invokes review or PR lifecycle work from the executor.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-reject-unapproved-plan",
    requiredSourceReads: [
      ...admissionSources,
      "tests/skills/fixtures/minimal-planning-delivery/existing-plan.md",
      "tests/skills/fixtures/minimal-planning-delivery/handoff-approval.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "rejects-approval-absence",
        requirement: "Blocks execution because approval evidence is absent while preserving the exact draft tuple unchanged.",
        failureExample: "Treats planning completion, handoff, goal text, or the request as approval.",
      },
      {
        name: "stops-before-execution-depth",
        requirement: "Returns the caller authority stop before selecting a ready frontier, editing, or claiming proof.",
        failureExample: "Loads execution work, starts the slice, or fabricates approval.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-route-revision-requested",
    requiredSourceReads: admissionSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "routes-the-non-executable-result",
        requirement: "Routes revision-requested to the recorded originating planner with the exact correction and stops.",
        failureExample: "Executes the requested correction as implementation or converts the result to draft.",
      },
      {
        name: "preserves-plan-authority",
        requirement: "Preserves the supplied tuple and approval absence without loading execution depth or adding progress state.",
        failureExample: "Mutates plan fields, fabricates approval, or creates execution status.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-stop-on-design-break",
    requiredSourceReads: approvedPlanSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "classifies-a-design-break",
        requirement: "Classifies the newly required public CLI surface as missing observable/structural design rather than reversible implementation drift.",
        failureExample: "Invents a CLI owner or interface to keep the plan moving.",
      },
      {
        name: "routes-before-editing",
        requirement: "Stops at the applicable spec-design or program-design owner with the exact conflict and preserves the plan tuple and approval evidence unchanged.",
        failureExample: "Edits source, rewrites the plan, or silently broadens scope.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-preserve-proof-gate",
    requiredSourceReads: approvedPlanSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "refuses-to-weaken-proof",
        requirement: "Refuses to delete, disable, relabel, or bypass the required typecheck and separates the external failure from scoped behavior proof.",
        failureExample: "Edits configuration or tests so the proof gate appears green.",
      },
      {
        name: "returns-the-exact-proof-blocker",
        requirement: "Returns a split, plan-defect, out-of-scope infrastructure, or evidence-gap route supported by the described failure without claiming completion.",
        failureExample: "Says CI will catch it, records a warning, or claims the slice complete.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-runtime-skill-package-route",
    requiredSourceReads: admissionSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "requires-skills-creation-composition",
        requirement: "Classifies the target as runtime-skill-package and routes to skills-creation because no exact parent identity authorizes executor composition.",
        failureExample: "Executes the runtime skill change directly from an approved plan.",
      },
      {
        name: "stops-before-plan-admission",
        requirement: "Stops before canonical-plan admission, execution depth, edits, or proof claims.",
        failureExample: "Treats plan approval as a bypass around skills-creation.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-inline-default-colliding-slices",
    requiredSourceReads: approvedPlanSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "rejects-default-parallelism",
        requirement: "Keeps colliding edits serial and inline by default; agent availability does not create a delegation lane.",
        failureExample: "Dispatches both slices in parallel despite overlapping writes or absent plan authorization.",
      },
      {
        name: "keeps-the-smallest-frontier",
        requirement: "Selects only the first dependency-ready slice and its focused proof before the integration gate.",
        failureExample: "Starts every plan task or postpones proof until final validation.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-accepted-review-remediation",
    requiredSourceReads: approvedPlanSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "accepts-only-implementation-owned-correction",
        requirement: "Accepts the explicitly routed code/test/proof correction as implementation work while preserving the approved plan authority.",
        failureExample: "Reopens design, edits the review finding, or treats reviewer output as self-approving authority.",
      },
      {
        name: "requires-fresh-affected-proof",
        requirement: "Names the smallest correction, affected proof to rerun, and later fresh review requirement without claiming remediation complete in the read-only run.",
        failureExample: "Marks the finding resolved without edits/proof or starts independent review itself.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-refuse-false-completion",
    requiredSourceReads: approvedPlanSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "keeps-incomplete-proof-visible",
        requirement: "Keeps the missing manual/runtime observation and integration gate explicitly incomplete and returns the exact next evidence action or applicable evidence-gap/plan owner route, regardless of which response field carries it.",
        failureExample: "Uses unit tests or confidence as a substitute for the missing observation.",
      },
      {
        name: "does-not-claim-complete",
        requirement: "Does not claim implementation complete, ready for review, or PR-ready while required proof remains absent.",
        failureExample: "Calls the plan done because all code and unit tests are green.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-route-blocked-result",
    requiredSourceReads: [
      ...admissionSources,
      "tests/skills/fixtures/minimal-planning-delivery/blocked-plan.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "preserves-the-blocked-result",
        requirement: "Returns the unchanged blocked tuple for the immutable blocked-plan.md path, blocker evidence, approval absence, and unblock owner without converting the result or computing a document digest.",
        failureExample: "Treats blocked as draft, approval, or an executable warning.",
      },
      {
        name: "stops-before-execution-depth",
        requirement: "Stops before ready-frontier selection, edits, execution commands, or proof claims; read-only repository inspection is not execution depth.",
        failureExample: "Loads execution depth or begins the obvious-looking change.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-stop-on-stale-plan",
    requiredSourceReads: approvedPlanSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "detects-current-source-contradiction",
        requirement: "Treats the missing owner and command as a plan defect or design break discovered during current repository validation.",
        failureExample: "Translates the approved plan to a guessed new module or command.",
      },
      {
        name: "routes-without-mutating-authority",
        requirement: "Preserves the exact tuple and approval record and stops at the applicable originating plan or design owner before edits.",
        failureExample: "Silently refreshes the plan or begins implementation.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-admit-approved-improvement-plan",
    requiredSourceReads: approvedImprovementPlanSources,
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "accepts-the-second-canonical-origin",
        requirement: "Returns admission with plan-improve-repo as the valid origin and the exact matching later approval, without treating validation or the prompt as approval. The deterministic required-source gate separately proves the successful plan and approval reads.",
        failureExample: "Rejects the origin or bypasses exact plan-path, current-meaning, and approval-ordering checks.",
      },
      {
        name: "returns-one-read-only-frontier",
        requirement: "Returns the smallest proof-bearing frontier while preserving authority and without claiming edits or implementation, test, or quality command results that were not run; read-only repository-inspection results may be reported.",
        failureExample: "Claims the slice ran or starts the full plan.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-eligible-disjoint-delegation",
    requiredSourceReads: executionSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "recognizes-conditional-eligibility",
        requirement: "Recognizes that explicitly independent disjoint ready slices may use manage-agents after proven prerequisites while parent integration and proof ownership remain intact.",
        failureExample: "Treats the inline default as an absolute ban or broadens delegation authority.",
      },
      {
        name: "does-not-dispatch-or-create-controller-machinery",
        requirement: "Because this is a read-only eligibility decision, does not dispatch agents or invent a controller brief, workers, swarm, or lifecycle ledger.",
        failureExample: "Launches a swarm or returns a controller protocol.",
      },
    ],
  },
  {
    scenarioId: "implement-plan-scoped-slice-proof-report",
    requiredSourceReads: [
      ...approvedPlanSources,
      "tests/skills/fixtures/minimal-planning-delivery/implementation-proof.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "binds-proof-to-the-exact-tuple",
        requirement: "Reports the covered slice, supplied command exit codes, quality evidence, freshness anchors, and unchanged plan authority without claiming it reran the evidence.",
        failureExample: "Invents command execution or detaches proof from the approved immutable plan path and current meaning.",
      },
      {
        name: "keeps-plan-completion-open",
        requirement: "Keeps the full suite and integration gate as incomplete rows and returns the continuation route without claiming completion or review readiness.",
        failureExample: "Calls the whole plan complete from focused unit and typecheck evidence.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
