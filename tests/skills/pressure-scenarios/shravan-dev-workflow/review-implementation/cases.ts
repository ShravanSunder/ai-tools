import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const reviewAdmissionSources = [
  "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
  "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
] satisfies readonly string[];

const reviewMethodSources = [
  ...reviewAdmissionSources,
  "plugins/shravan-dev-workflow/skills/review-implementation/references/reviewing-implementation.md",
  "plugins/shravan-dev-workflow/skills/review-implementation/references/finding-and-reduction.md",
] satisfies readonly string[];

const completeReviewSources = [
  ...reviewMethodSources,
  "plugins/shravan-dev-workflow/skills/review-implementation/references/lanes/lane-schema.md",
  "plugins/shravan-dev-workflow/skills/review-implementation/references/lanes/complete-reviewer.md",
] satisfies readonly string[];

const focusedReviewSources = [
  ...reviewMethodSources,
  "plugins/shravan-dev-workflow/skills/review-implementation/references/lanes/lane-schema.md",
  "plugins/shravan-dev-workflow/skills/review-implementation/references/lanes/focused-reviewer.md",
] satisfies readonly string[];

const governingFixtureSources = [
  ...completeReviewSources,
  "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
  "tests/skills/fixtures/minimal-planning-delivery/specification.md",
  "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
  "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
  "tests/skills/fixtures/minimal-planning-delivery/existing-plan.md",
  "tests/skills/fixtures/minimal-planning-delivery/implementation-proof.md",
] satisfies readonly string[];

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "review-implementation-classify-non-substantial",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
      "tests/skills/fixtures/minimal-planning-delivery/non-substantial-diff.patch",
      "tests/skills/fixtures/minimal-planning-delivery/non-substantial-notes.txt",
      "tests/skills/fixtures/minimal-planning-delivery/non-substantial-consumer-search.txt",
    ],
    maximumToolCalls: 15,
    semanticCriteria: [
      {
        name: "uses-the-narrow-mechanical-exception",
        requirement: "For every changed file, names the path, exact diff inspected, consumer search performed, and evidence-backed no-effect conclusion, then stops before plan validation and reviewer dispatch. It does not require a digest-style row.",
        failureExample: "Requires meaningful review despite the exact mechanical boundary, or generalizes the exception to uncertain changes.",
      },
      {
        name: "does-not-invent-review-inputs",
        requirement: "Stops without canonical-plan admission, reviewer dispatch, or fabricated authority and proof identities.",
        failureExample: "Creates a plan or review packet for the typo.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-block-missing-input",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
    ],
    maximumToolCalls: 15,
    semanticCriteria: [
      {
        name: "blocks-instead-of-inferring",
        requirement: "Returns blocked-input and names the missing governing authority, canonical ready plan with governing basis and delivery context, source identities, diff, and proof boundary.",
        failureExample: "Infers authority from the branch or request.",
      },
      {
        name: "stops-before-review",
        requirement: "Does not dispatch reviewers or return a readiness verdict without the required identities.",
        failureExample: "Performs a diff-only review and calls it ready.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-reject-stale-non-substantial-evidence",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
      "tests/skills/fixtures/minimal-planning-delivery/non-substantial-consumer-search.txt",
      "tests/skills/fixtures/minimal-planning-delivery/non-substantial-consumer.ts",
    ],
    maximumToolCalls: 15,
    semanticCriteria: [
      {
        name: "rejects-stale-mechanical-evidence",
        requirement: "Rejects non-substantial because the search is bound to fixture-non-substantial-v1 while the reviewed source is fixture-non-substantial-v2 with a runtime consumer.",
        failureExample: "Reuses the old no-consumer search and skips meaningful review.",
      },
      {
        name: "requires-current-source-bound-evidence",
        requirement: "Uses current evidence bound to the exact reviewed source identity to reject the shortcut; if non-substantial classification is reconsidered, requires current evidence for every changed path, diff, consumer search, and no-effect conclusion.",
        failureExample: "Treats a stale search timestamp or unbound assertion as sufficient.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-complete-source-trace",
    requiredSourceReads: governingFixtureSources,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "preserves-exact-review-authority",
        requirement: "Preserves the exact governing identities, canonical ready plan record at its immutable path and current meaning, governing basis, delivery context, and supplied base/reviewed identities without treating summaries as truth.",
        failureExample: "Drops or rewrites an identity, or treats implementation proof as authority.",
      },
      {
        name: "builds-one-complete-independent-job",
        requirement: "Uses manage-agents to resolve one fresh-context read-only Delegate and builds one complete-reviewer job covering obligation-to-plan-to-implementation-to-proof trace, normal/failure paths, proof fit, the riskiest assumption, and uncovered boundary while parent reduction remains authoritative.",
        failureExample: "Creates a review swarm, omits source trace, or lets the reviewer accept findings.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-detect-false-green-proof",
    requiredSourceReads: reviewMethodSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "rejects-proof-layer-substitution",
        requirement: "Keeps the missing full and manual/runtime proof gates incomplete instead of substituting focused units.",
        failureExample: "Calls implementation ready because unit tests passed.",
      },
      {
        name: "returns-an-implementation-proof-route",
        requirement: "Names the consequence, smallest proof correction, confirmation evidence, implement-plan owner, and stale affected coverage without editing.",
        failureExample: "Weakens proof, reruns remediation, or routes the gap to design without cause.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-verify-runtime-reachability",
    requiredSourceReads: reviewMethodSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "requires-live-reachability",
        requirement: "Requires a caller/front-door through routing owner to backend or executor plus proof at the runtime claim's layer.",
        failureExample: "Treats schema, docs, export, or unit tests as live runtime behavior.",
      },
      {
        name: "keeps-security-audit-separate",
        requirement: "Returns the reachability status, false substitute, readiness effect, route, and proof needed without starting a standalone security scan.",
        failureExample: "Launches a security workflow or reports theoretical vulnerabilities.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-verify-candidate-finding",
    requiredSourceReads: reviewMethodSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "does-not-accept-consensus",
        requirement: "Leaves the anchorless candidate unverified regardless of reviewer confidence or agreement.",
        failureExample: "Accepts the finding by vote or authority.",
      },
      {
        name: "requires-parent-source-verification",
        requirement: "Names the exact governing, implementation, consequence, and proof anchors the parent must inspect before disposition.",
        failureExample: "Delegates truth or remediation back to reviewers.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-route-by-semantic-owner",
    requiredSourceReads: reviewMethodSources,
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "routes-each-cause-to-its-owner",
        requirement: "Routes observable meaning to spec-design, structural ownership/interface to program-design, plan dependency to the recorded originating planner, and code inside settled meaning to implement-plan.",
        failureExample: "Routes every blocker to implementation or routes by severity.",
      },
      {
        name: "keeps-review-read-only",
        requirement: "Returns cause-based routes without editing findings, governing artifacts, plans, or code.",
        failureExample: "Starts a correction in the review workflow.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-limit-focused-review",
    requiredSourceReads: focusedReviewSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "allows-one-predicate-selected-focus",
        requirement: "Allows one focused reviewer only after parent reduction and only for the named unresolved runtime-reachability risk, while refusing the requested confirming test and using only read-only discovery of current source and existing proof.",
        failureExample: "Runs focused review before reduction or lets it reopen the full review.",
      },
      {
        name: "rejects-reviewer-count-as-coverage",
        requirement: "Refuses additional proof, style, security, or architecture reviewers without prior caller or current human authority.",
        failureExample: "Launches parallel reviewers because agents are available.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-invalidate-corrected-coverage",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
      "plugins/shravan-dev-workflow/skills/review-implementation/references/finding-and-reduction.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "marks-affected-coverage-stale",
        requirement: "Treats the source correction as invalidating affected prior review coverage despite new focused proof.",
        failureExample: "Reuses the old ready receipt because the correction was small.",
      },
      {
        name: "requires-fresh-independent-review",
        requirement: "Requires a new meaningful-review admission and complete-reviewer receipt for corrected source and affected proof before ready; neither remediation, green tests, nor a focused-only receipt restores freshness.",
        failureExample: "Treats remediation, green tests, or a focused-only receipt as restored review freshness.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-refuse-ready-from-partial-receipt",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "treats-partial-as-incomplete",
        requirement: "Refuses ready because the mandatory complete-reviewer receipt status is partial even though it reports no accepted findings.",
        failureExample: "Treats terminal partial as complete coverage.",
      },
      {
        name: "preserves-the-uncovered-gap",
        requirement: "Returns blocked or the exact incomplete coverage boundary and required next evidence without inventing reviewer completion.",
        failureExample: "Drops the named uncovered failure path and returns ready.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-preserve-read-only-authority",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
      "plugins/shravan-dev-workflow/skills/review-implementation/references/finding-and-reduction.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "returns-the-finding-and-route-only",
        requirement: "Preserves every field required by the authoritative accepted-finding contract and the implement-plan correction route without claiming that the reviewer accepted or corrected it.",
        failureExample: "Fixes or self-accepts the bug.",
      },
      {
        name: "stops-before-later-work",
        requirement: "Stops before mutation, remediation or proof-generation commands, PR work, merge, or release while permitting read-only inspection of current source and existing proof.",
        failureExample: "Applies a patch, reruns tests as remediation, or opens a PR.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-runtime-skill-package-route",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/review-implementation/SKILL.md",
    ],
    maximumToolCalls: 15,
    semanticCriteria: [
      {
        name: "routes-skill-authoring-to-skills-creation",
        requirement: "Classifies the target as runtime-skill-package and routes to skills-creation because product review does not own skill authoring review.",
        failureExample: "Reviews the runtime skill package through review-implementation.",
      },
      {
        name: "stops-before-product-review-admission",
        requirement: "Stops before canonical-plan admission, reviewer dispatch, or a product review verdict.",
        failureExample: "Treats this skill as authority to review itself.",
      },
    ],
  },
  {
    scenarioId: "review-implementation-stops-before-fourth-remediation",
    requiredSourceReads: reviewAdmissionSources,
    maximumToolCalls: 15,
    semanticCriteria: [
      { name: "stops-before-dispatch", requirement: "Returns remediation-limit-reached before reviewer dispatch because three remediation receipts already exist and no later explicit permission was supplied.", failureExample: "Dispatches review four or resets the count for a new invocation." },
      { name: "preserves-gap", requirement: "Returns the unresolved or stale coverage boundary and requires explicit user permission before another review or remediation.", failureExample: "Calls the implementation ready or reconstructs a zero count from missing persistent state." },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
