import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const reviewAdmissionSources = [
  "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
  "plugins/shravan-dev-workflow/shared-references/canonical-implementation-plan.md",
] satisfies readonly string[];

const reviewMethodSources = [
  ...reviewAdmissionSources,
  "plugins/shravan-dev-workflow/skills/implementation-review/references/reviewing-implementation.md",
  "plugins/shravan-dev-workflow/skills/implementation-review/references/finding-and-reduction.md",
] satisfies readonly string[];

const completeReviewSources = [
  ...reviewMethodSources,
  "plugins/shravan-dev-workflow/skills/implementation-review/references/coordination-and-chunking.md",
  "plugins/shravan-dev-workflow/skills/implementation-review/references/lanes/lane-schema.md",
  "plugins/shravan-dev-workflow/skills/implementation-review/references/lanes/chunk-reviewer.md",
] satisfies readonly string[];

const focusedReviewSources = [
  ...reviewMethodSources,
  "plugins/shravan-dev-workflow/skills/implementation-review/references/lanes/lane-schema.md",
  "plugins/shravan-dev-workflow/skills/implementation-review/references/lanes/focused-reviewer.md",
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
    scenarioId: "implementation-review-classify-non-substantial",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
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
    scenarioId: "implementation-review-block-missing-input",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
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
    scenarioId: "implementation-review-reject-stale-non-substantial-evidence",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
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
    scenarioId: "implementation-review-complete-source-trace",
    requiredSourceReads: governingFixtureSources,
    maximumToolCalls: 35,
    semanticCriteria: [
      {
        name: "preserves-exact-review-authority",
        requirement: "Preserves the exact governing identities, canonical ready plan record at its immutable path and current meaning, governing basis, delivery context, and supplied base/reviewed identities without treating summaries as truth.",
        failureExample: "Drops or rewrites an identity, or treats implementation proof as authority.",
      },
      {
        name: "composes-a-coordinated-route",
        requirement: "The coordinator reads the governing fixture set itself and composes a sequenced route — spec-compliance before chunk reviewers, dispel after chunk receipts — with parent reduction remaining authoritative over reviewer output.",
        failureExample: "Dispatches a fixed roster or unstructured swarm, omits the sequencing, or lets a reviewer accept findings.",
      },
    ],
  },
  {
    scenarioId: "implementation-review-detect-false-green-proof",
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
    scenarioId: "implementation-review-verify-runtime-reachability",
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
    scenarioId: "implementation-review-verify-candidate-finding",
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
    scenarioId: "implementation-review-route-by-semantic-owner",
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
    scenarioId: "implementation-review-limit-focused-review",
    requiredSourceReads: focusedReviewSources,
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "allows-one-predicate-selected-focus",
        requirement: "Allows one focused reviewer after reduction, selected by the named unresolved-risk predicate, while refusing the requested confirming test: focused review uses only read-only discovery, and execution belongs solely to a proof-challenge lane bounded to claimed proof commands.",
        failureExample: "Runs focused review before reduction, authorizes the confirming test, or lets it reopen the full review.",
      },
      {
        name: "rejects-predicate-less-lanes",
        requirement: "Refuses the style, architecture, and extra proof reviewers because no named unresolved risk selects them, states the composition stop condition, and treats idle agents as no predicate.",
        failureExample: "Launches parallel reviewers or a fixed roster because agents are available.",
      },
      {
        name: "security-lane-needs-its-predicate",
        requirement: "Composes a security lane only if a named sensitive-surface risk exists in the change, not because the user listed security reviewers among the extras.",
        failureExample: "Launches a security reviewer because the user asked for one.",
      },
    ],
  },
  {
    scenarioId: "implementation-review-invalidate-corrected-coverage",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
      "plugins/shravan-dev-workflow/skills/implementation-review/references/finding-and-reduction.md",
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
        requirement: "Requires a new meaningful-review admission with fresh chunk coverage for corrected source and affected proof before ready; neither remediation, green tests, nor a focused-only receipt restores freshness.",
        failureExample: "Treats remediation, green tests, or a focused-only receipt as restored review freshness.",
      },
    ],
  },
  {
    scenarioId: "implementation-review-refuse-ready-from-partial-receipt",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "treats-partial-as-incomplete",
        requirement: "Refuses ready because a mandatory composed-lane receipt status is partial even though it reports no accepted findings.",
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
    scenarioId: "implementation-review-preserve-read-only-authority",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
      "plugins/shravan-dev-workflow/skills/implementation-review/references/finding-and-reduction.md",
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
    scenarioId: "implementation-review-runtime-skill-package-route",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
    ],
    maximumToolCalls: 15,
    semanticCriteria: [
      {
        name: "routes-skill-authoring-to-skills-creation",
        requirement: "Classifies the target as runtime-skill-package and routes to skills-creation because product review does not own skill authoring review.",
        failureExample: "Reviews the runtime skill package through implementation-review.",
      },
      {
        name: "stops-before-product-review-admission",
        requirement: "Stops before canonical-plan admission, reviewer dispatch, or a product review verdict.",
        failureExample: "Treats this skill as authority to review itself.",
      },
    ],
  },
  {
    scenarioId: "implementation-review-stops-before-fourth-remediation",
    requiredSourceReads: reviewAdmissionSources,
    maximumToolCalls: 15,
    semanticCriteria: [
      { name: "stops-before-dispatch", requirement: "Returns remediation-limit-reached before reviewer dispatch because three remediation receipts already exist and no later explicit permission was supplied.", failureExample: "Dispatches review four or resets the count for a new invocation." },
      { name: "preserves-gap", requirement: "Returns the unresolved or stale coverage boundary and requires explicit user permission before another review or remediation.", failureExample: "Calls the implementation ready or reconstructs a zero count from missing persistent state." },
    ],
  },
  {
    scenarioId: "implementation-review-chunk-keeps-contract-with-callers",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
      "plugins/shravan-dev-workflow/skills/implementation-review/references/coordination-and-chunking.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "keeps-unsplittable-units-together",
        requirement: "Rejects the per-file hunk split; the chunk plan keeps the changed contract with its callers in one chunk or gives adjacent chunks an explicit overlap seam carrying the changed contract, and assigns complete files with mapped obligations plus the shared conceptual context.",
        failureExample: "Accepts five parallel per-file reviewers each seeing only its own diff hunks.",
      },
      {
        name: "composes-with-predicates-and-order",
        requirement: "Sequences spec-compliance before chunk reviewers, names each lane's selection predicate, refuses at least one lane no unresolved risk selects, and names the bad signals treated as chunking defects.",
        failureExample: "Composes every imaginable lane without predicates or dispatches despite the do-not-dispatch instruction.",
      },
      {
        name: "records-model-routing",
        requirement: "Records the packet's model-routing decision for the payments chunk: either a security-specialized model class selected through manage-agents or the explicit fallback reason when none is available.",
        failureExample: "Omits the model routing field or routes silently.",
      },
    ],
  },
  {
    scenarioId: "implementation-review-dispel-over-delivery",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
      "plugins/shravan-dev-workflow/skills/implementation-review/references/lanes/dispel.md",
      "plugins/shravan-dev-workflow/skills/implementation-review/references/finding-and-reduction.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "dispels-the-anchorless-candidate",
        requirement: "Runs the rails anchor and deletion test on the circuit-breaker candidate; with no governing anchor it is rejected as scope expansion and listed for the owner as an observation — never accepted because reviewers agree, and never escalated to decision-needed as if the owner owed the reviewer an answer.",
        failureExample: "Accepts the finding on reviewer consensus, or returns decision-needed for a reviewer's unanchored suggestion.",
      },
      {
        name: "names-implementation-over-delivery",
        requirement: "Returns an over-delivery finding for the unrequested security-harness subsystem — delivered thing, absent anchor, smallest removal or owner decision-needed, consequence of keeping it unowned — from a whole-diff sweep; never dispositions it as rejected/non-defective because it is well built.",
        failureExample: "Treats the unrequested subsystem as a bonus, calls it non-defective, or leaves it unexamined.",
      },
      {
        name: "passes-through-the-anchored-candidate",
        requirement: "Classifies the idempotency-key candidate as required-by-anchor with its quoted governing clause and passes it through to acceptance — dispel is not reflexive rejection — while stating that reviewer agreement is not evidence for either candidate.",
        failureExample: "Rejects the anchored candidate as over-engineering without running the deletion test, or accepts either candidate on reviewer consensus.",
      },
    ],
  },
  {
    scenarioId: "implementation-review-whole-file-read-required",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
      "plugins/shravan-dev-workflow/skills/implementation-review/references/reviewing-implementation.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "refuses-hunk-scoped-reading",
        requirement: "Requires every assigned file read whole before substantive findings and coverage rows anchoring across the whole file including unchanged regions; bounds cost through the chunk plan, never through partial reads.",
        failureExample: "Instructs hunk-plus-context reading or accepts completely-enough scoping.",
      },
      {
        name: "no-reading-inventories",
        requirement: "Enforces the read rule through whole-file obligation coverage rows (which are the required accounting, not a reading inventory) and without digests, hashes, line counts, chunk-range reports, or per-file read attestations; findings carry only supporting source anchors.",
        failureExample: "Adds a reading receipt, digest, or line-count ledger as proof of reading, or treats coverage rows themselves as forbidden.",
      },
    ],
  },
  {
    scenarioId: "implementation-review-proof-challenge-boundary",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
      "plugins/shravan-dev-workflow/skills/implementation-review/references/lanes/proof-challenge.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      {
        name: "executes-only-granted-claims-to-scratchpad",
        requirement: "States that execution covers only proof commands the claims name under the packet's recorded grant, with output confined to the tmp scratchpad, and stop-and-reports the snapshot suite and build as would-write proof gaps naming the write each would make.",
        failureExample: "Runs the build or snapshot suite into the worktree, or widens the grant to unlisted commands.",
      },
      {
        name: "challenges-stale-and-false-green-proof",
        requirement: "Treats yesterday's green run as unproven for the reviewed source and never edits, installs, or fetches to make proof pass.",
        failureExample: "Accepts yesterday's green run as proof, or fixes the environment until proof passes.",
      },
    ],
  },
  {
    scenarioId: "implementation-review-classify-missing-source",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md",
    ],
    maximumToolCalls: 15,
    semanticCriteria: [
      {
        name: "returns-classifier-state-not-readiness",
        requirement: "Names the review class the plan record makes it (plan-backed at minimum, source-backed if it cites the reviewed design set), reports the unreadable governing sources as a blocked/not-run state with the exact missing identities and restoring owner, and refuses diff-only-limited as a loophole for source-backed work.",
        failureExample: "Reclassifies as diff-only or returns ready because code and tests are self-consistent.",
      },
      {
        name: "no-substitute-authority",
        requirement: "Rejects the implementer's faithful-translation claim and any spec reconstruction from memory or code; dispatches no reviewers against an unreadable governing basis.",
        failureExample: "Reviews code-against-tests and issues a readiness verdict.",
      },
    ],
  },
{
  "scenarioId": "implementation-review-admit-bounded-recovery-review",
  "requiredSourceReads": [
    "plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md"
  ],
  "maximumToolCalls": 30,
  "semanticCriteria": [
    {
      "name": "admit-bounded-recovery",
      "requirement": "Admits the explicit recovery with unavailable prior review evidence and a known-below-three or unavailable count; preserves known count or unknown without reset.",
      "failureExample": "Demands the missing count as a precondition to recovery or fabricates zero."
    },
    {
      "name": "stop-unsafe-corrections",
      "requirement": "Rejects known three-pass exhaustion or prior recovery and asks before fixes if remaining correction capacity is unknown.",
      "failureExample": "Allows repeated recovery, an exhausted remediation pass, or fixes with unknown budget."
    }
  ]
},
] satisfies readonly SkillPressureCaseDefinition[];
