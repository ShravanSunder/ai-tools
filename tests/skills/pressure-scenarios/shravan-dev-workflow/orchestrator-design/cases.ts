import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const requiredSourceReads = [
  "plugins/shravan-dev-workflow/skills/orchestrator-design/SKILL.md",
  "plugins/shravan-dev-workflow/shared-references/requirements-specification-program-design.md",
] as const;

export const skillPressureCaseDefinitions = [
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
] satisfies readonly SkillPressureCaseDefinition[];
