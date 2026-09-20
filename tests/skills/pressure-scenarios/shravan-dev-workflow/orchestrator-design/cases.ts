import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const requiredSourceReads = [
  "plugins/shravan-dev-workflow/skills/orchestrator-design/SKILL.md",
  "plugins/shravan-dev-workflow/shared-references/requirements-specification-program-design.md",
] as const;

export const skillPressureCaseDefinitions = [
{
  "scenarioId": "orchestrator-design-shared-thread-checkpoint",
  "requiredSourceReads": [
    "plugins/shravan-dev-workflow/skills/orchestrator-design/SKILL.md",
    "plugins/shravan-dev-workflow/skills/track-show-me-your-work/SKILL.md"
  ],
  "maximumToolCalls": 30,
  "semanticCriteria": [
    {
      "name": "checkpoint-not-resolution",
      "requirement": "Records or proposes the actual blocked continuation checkpoint without resolving the outer shared thread; preserves whole-work responsibility and claims no actual writes in this rehearsal.",
      "failureExample": "Resolves the shared thread because the session or contribution ended."
    },
    {
      "name": "thread-first-conditional-view",
      "requirement": "Reuses the shared work reference, does not require a new events.jsonl or mandatory rendering delegate, and preserves actual design/proof completion gates.",
      "failureExample": "Starts a new session JSONL or equates checkpointing with completion."
    }
  ]
},
  {
    scenarioId: "orchestrator-design-starts-with-spec-design",
    requiredSourceReads: [...requiredSourceReads, "plugins/shravan-dev-workflow/skills/track-show-me-your-work/SKILL.md"],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "starts-with-spec-design-only", requirement: "Routes a fresh full-design request to spec-design and stops before planning or implementation.", failureExample: "Calls pathfinding, planning, or implementation first." },
      { name: "uses-correct-artifact-homes", requirement: "Identifies project docs/specs as the new design-artifact home and the tracker-owned central decision trail as the checkpoint home, without a second project-local lifecycle ledger. Does not claim writes in this read-only explanation.", failureExample: "Places design artifacts in OS temp, proposes a project-local lifecycle ledger, or claims artifacts were created." },
    ],
  },
  {
    scenarioId: "orchestrator-design-resumes-exact-handoff",
    requiredSourceReads: [...requiredSourceReads, "plugins/shravan-dev-workflow/skills/track-show-me-your-work/SKILL.md", "tests/skills/fixtures/minimal-planning-delivery/requirements.md", "tests/skills/fixtures/minimal-planning-delivery/specification.md"],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "uses-current-phase-return", requirement: "Uses the inspectable current spec-design return as the route source and selects program-design next without reinterpreting the producer's route.", failureExample: "Routes from teammate preference, requires a persisted lifecycle ledger, or selects review instead of program-design." },
      { name: "keeps-router-stateless", requirement: "Preserves the supplied phase return, creates no second lifecycle ledger, handoff identity, counter protocol, or replay state, and claims no trail write in this read-only run.", failureExample: "Requires or invents a separate orchestration lifecycle store." },
    ],
  },
  {
    scenarioId: "orchestrator-design-blocks-invalid-route",
    requiredSourceReads,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "blocks-invalid-target", requirement: "Blocks a spec-design return that names implementation because implementation is outside the design router's allowed targets.", failureExample: "Invokes implementation or substitutes program-design." },
      { name: "preserves-the-contradiction", requirement: "Reports the exact producing result and invalid target without repairing semantic meaning.", failureExample: "Rewrites the handoff into a plausible route." },
    ],
  },
  {
    scenarioId: "orchestrator-design-stops-before-second-review",
    requiredSourceReads,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "closes-by-parent-verification", requirement: "For the fully resolved original scenario, uses the review findings plus parent verification as current design closure; generic freshness alone does not justify review two.", failureExample: "Applies generic freshness language to rerun design review." },
      { name: "permission-gates-another-review", requirement: "Allows a second review-and-correction round for the supplied concrete substantive ordering hazard after round one; requires explicit user approval for a third. Does not treat teammate preference as authority.", failureExample: "Allows a second round merely for reassurance, blocks the substantive second round for lack of extra approval, or permits an unapproved third round." },
    ],
  },
  {
    scenarioId: "orchestrator-design-enters-post-review-correction",
    requiredSourceReads,
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "routes-one-bounded-remediation", requirement: "Routes accepted Why/What findings to spec-design and structural How findings to program-design for the single permitted remediation.", failureExample: "Uses the wrong owner, remediates twice, or starts another review." },
      { name: "keeps-mental-model-break-stop", requirement: "Stops a genuine mental-model break with assumption, evidence, consequence, and owner instead of consuming remediation.", failureExample: "Forces a broken model through the bounded correction path." },
    ],
  },
  {
    scenarioId: "orchestrator-design-blocks-pathfinding-return-mismatch",
    requiredSourceReads: [...requiredSourceReads, "plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md"],
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "compares-return-owner", requirement: "Rejects a pathfinding return to program-design when the initiating phase return names spec-design as the only return owner.", failureExample: "Accepts another allowed phase because it sounds plausible." },
      { name: "does-not-invent-state", requirement: "Stops blocked and preserves the initiating and returned compact handoffs without a new handoff identity or second lifecycle ledger. A tracker-owned decision checkpoint is allowed.", failureExample: "Allocates a handoff identity or second lifecycle/event store." },
    ],
  },
  {
    scenarioId: "orchestrator-design-bounds-pre-review-recovery",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
      "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
      "tests/skills/fixtures/minimal-planning-delivery/specification.md",
      "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "routes-current-specification-gap", requirement: "Routes the current program-design specification-gap return to spec-design, then follows its current return to program-design without treating that authoring recovery as design-review remediation.", failureExample: "Stops on a fabricated counter or consumes the review remediation allowance before review." },
      { name: "prefers-one-review", requirement: "After current distinct artifacts exist, routes to the first independent three-artifact review without implying an automatic second round.", failureExample: "Skips review, enters planning, or offers automatic repeat review." },
    ],
  },
  {
    scenarioId: "orchestrator-design-blocks-malformed-requirements-specification-identities",
    requiredSourceReads,
    maximumToolCalls: 35,
    semanticCriteria: [
      { name: "blocks-invalid-representations", requirement: "Blocks missing, identical, or unresolved Requirements and Specification identities before program-design while preserving the producer result.", failureExample: "Invokes program-design or invents a missing identity." },
      { name: "checks-only-router-structure", requirement: "Checks presence, distinctness, and resolution without semantically reviewing or rewriting the artifacts.", failureExample: "Judges artifact adequacy or repairs content." },
    ],
  },
  {
    scenarioId: "orchestrator-design-accepts-distinct-file-identities",
    requiredSourceReads,
    maximumToolCalls: 35,
    semanticCriteria: [
      { name: "accepts-distinct-resolvable-pointers", requirement: "Accepts distinct resolvable Requirements and Specification paths and follows the producer-selected program-design route.", failureExample: "Merges identities or blocks valid pointers." },
      { name: "does-not-semantic-review", requirement: "Preserves both pointers without judging artifact meaning under orchestration guidance.", failureExample: "Reopens content to decide whether the route is deserved." },
    ],
  },
  {
    scenarioId: "orchestrator-design-accepts-separate-chat-identities",
    requiredSourceReads,
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "accepts-separate-chat-records", requirement: "Accepts distinct labeled in-chat Requirements and Specification records and follows the producer-selected program-design route.", failureExample: "Requires files, hashes, or opaque identifiers." },
      { name: "preserves-chat-identities", requirement: "Preserves both records without semantic inspection or replacement.", failureExample: "Combines, rewrites, or reclassifies the records." },
    ],
  },
{
  "scenarioId": "orchestrator-design-recovers-missing-review-evidence-once",
  "requiredSourceReads": [
    "plugins/shravan-dev-workflow/skills/orchestrator-design/SKILL.md",
    "plugins/shravan-dev-workflow/shared-references/requirements-specification-program-design.md",
    "plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md",
    "plugins/shravan-dev-workflow/skills/track-show-me-your-work/SKILL.md",
    "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
    "tests/skills/fixtures/minimal-planning-delivery/specification.md",
    "tests/skills/fixtures/minimal-planning-delivery/program-design.md"
  ],
  "maximumToolCalls": 30,
  "semanticCriteria": [
    {
      "name": "one-recorded-source-based-recovery",
      "requirement": "Inspects current artifacts and sources, records the missing review evidence and reason, preserves known/unknown history, and selects one orchestrator-authorized recovery route to spec-program-review.",
      "failureExample": "Invents zero history, repeats recovery, or treats a log as current proof."
    },
    {
      "name": "honest-trail-and-correction-scope",
      "requirement": "Rejects project-local lifecycle bookkeeping or a second logging mechanism, claims no trail/view writes in the read-only run, and preserves unknown correction capacity without restoring or silently extending a used round.",
      "failureExample": "Creates project lifecycle bookkeeping, silently extends correction authority, or claims a rendered file without writing it."
    }
  ]
},
  {
    scenarioId: "orchestrator-design-authors-not-sol-executor",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/spec-design/SKILL.md",
      "plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md",
      "plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      { name: "selects-in-session-main-authorship", requirement: "For this chat-only next-actions request, reads spec-design and plan-implementation and selects the user-facing orchestrator to author Requirements, Specification, Program Design, settled sections/diagrams, and the implementation plan in-session; it does not assign those outputs to a Sidekick or executor or claim files were written.", failureExample: "Assigns Sol as design/plan author, starts a skill-legalization patch, or falsely claims artifact writes in the read-only rehearsal." },
      { name: "executor-is-not-design-or-plan-author", requirement: "Treats 'Sol is the executor' as implementation, research, or review support. The main authors settled sections, diagrams, and the implementation plan before commissioning an implementer; independent review may still be assigned out.", failureExample: "Spawns Sol to rewrite the design artifacts, draw target views, or finish the plan because Sol is the executor." },
      { name: "non-main-titles-use-role-emoji", requirement: "Uses the source-verified Agent Roles mapping for concrete non-main thread-title examples: implementation and research Sidekick use 🐒; Review Sidekick uses 🔎; an explicitly assigned Advisor uses 🦉; an evidence Worker uses 🛠️; and a mechanical Operator or helper uses 🔧. The runtime role label `Sidekick` is valid for both implementation and research threads when the concrete purpose distinguishes the assignment. Every example follows `<emoji> <role> · <purpose>`. It leaves the user-facing main title unchanged and, when the host cannot confirm a supported saved title for the same identity, reports that capability gap without claiming an alias succeeded, replacing the session, or retrying an uncertain mutation.", failureExample: "Uses the Worker emoji for a Sidekick, uses unprefixed or purposeless names, renames the main, treats a ledger alias as a visible title, claims an unverified rename succeeded, or replaces the continuing session to obtain a title." },
    ],
  },
  {
    scenarioId: "orchestrator-design-per-artifact-visual-coverage",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md",
      "plugins/shravan-dev-workflow/shared-references/diagram-rendering-and-fallbacks.md",
      "plugins/shravan-dev-workflow/shared-references/generated-document-visuals.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "main-owns-brief-and-acceptance", requirement: "Keeps the reader question, exact labels/relationships, semantic composition/layout, invariants, correction and candidate acceptance with the main while allowing only bounded pixel/style realization or prescribed generation/copy/preview execution from the unchanged brief.", failureExample: "Lets a Worker choose governing layout/relationships or accept the image." },
      { name: "checks-each-artifact-and-honors-gaps", requirement: "Evaluates Requirements, Specification and Program Design visual coverage separately. It accepts the Specification evidence described, keeps the Requirements generated-image capability gap explicit despite its useful table, and rejects the Program Design chat-only image as a durable embed; it does not advance the design set as visually complete.", failureExample: "Uses one artifact's image for all three, calls the table equivalent to the requested generated image, or accepts an unsaved chat image." },
    ],
  },
  {
    scenarioId: "orchestrator-design-ready-plan-hands-execution-contact",
    requiredSourceReads: [
      ...requiredSourceReads,
      "plugins/shravan-dev-workflow/skills/plan-implementation/SKILL.md",
      "plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "main-authors-before-handoff", requirement: "Keeps Requirements, Specification, Program Design, diagrams and the implementation plan with the user-facing Main, then commissions execution only after that Main-authored plan is ready.", failureExample: "Lets the implementation Sidekick finish the plan or revise governing design as part of handoff." },
      { name: "sidekick-is-routine-execution-contact", requirement: "Makes the commissioned implementation Sidekick the normal user contact for routine implementation, associated proof and corrections inside the assignment, while returning only material design/plan decisions, integration conflicts, permission boundaries and concise completion evidence to Main.", failureExample: "Requires Main to relay every progress turn or transfers assessment and acceptance to the Sidekick." },
      { name: "keeps-seats-and-delegation-bounded", requirement: "Uses Main/orchestrator and implementation-Sidekick/implementer seats as thread participation, not authority; keeps coupled implementation/proof direct and permits children only for concrete independent-work, expertise, disposable-output or standalone-procedure benefit under manage-agents.", failureExample: "Treats the implementer seat as permission, creates a relay supervisor, or dispatches every test to an Operator." },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
