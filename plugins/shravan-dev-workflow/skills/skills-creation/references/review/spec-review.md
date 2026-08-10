# Skill Spec Review

Review the intended skill design before implementation. This reference judges whether the proposed promise, trigger, workflow, reference split, and proof plan would make a trustworthy skill if implemented.

Return a spec-review verdict, blocker overrides, rubric evidence, accepted and rejected findings, first required revision, and proof or retest implication.

## Spec Artifact

A proposal that meets none of the doc predicates below stays conversational: it lives in the run's messages and the review packet carries it.

IF the spec spans more than one update run, carries user decisions a later run must honor, or must survive a session boundary, write it as a spec doc before dispatch and make the doc the reviewed artifact; the review packet's `review target` carries the doc's path and revision. Home: the repo's skill-work wip location (`docs/wip/skills-authoring/` here). The doc is working memory that outlives the conversation, not durable truth: after its last run lands, the wip folder's own rules and `docs-maintain` own its disposition. The doc is one draft — acceptance covers it as a whole — and each run in its sequence names exactly one skill target; a run naming more is split before acceptance. It carries:

```text
targets and owner plugin, with the runs in sequence
problem and evidence
success definition
decisions table — defaults taken with rationale; the user may strike any row
per-run surface allocation: trigger / main path / depth / proof
authoring basis and proof plan, with each run's proof posture
coordination: base branch and commit, pending edits, version and changelog landing
non-goals
spec-review record: accepted revision label, lanes, receipts, verdict, semantic coverage, acceptance
```

Each decisions row records the default taken and its rationale so the user can strike it cheaply — after acceptance, striking a row is an edit like any other, and a row without a rationale gives the user nothing to strike against. Every problem or evidence claim names its source or is labeled a hypothesis. The coordination slot is read at implement and ship time: a slice run checks its base, pending edits, and version/changelog landing against it before editing. The doc is dispatch-ready when every slot carries what its consuming run can execute from without guessing, or its exact unknown; a slot holding TBD is neither.

## Lanes

The artifact here is a **proposal** — conversational or a spec doc — describing a design the skill's files do not yet implement. That selects exactly four lanes:

```text
lanes/mental-model-fit.md
lanes/trigger-routing.md
lanes/rule-agreement.md
lanes/depth-coverage.md
```

Those are the lanes whose questions are answerable about a design. `depth-coverage` runs here because a proposal carries what it judges: the promised stages and the planned reference tree. `no-op-pruning`, `placement-and-calls`, and `claim-vs-evidence` need line-level text, call sites, and real transcripts; against a proposal they would open the currently shipped file and return a clean receipt about text nobody proposed. They run at implementation review instead.

MUST load `review-lane-workflow.md` to prepare dispatch and return the dispatch contract and receipt lifecycle before the first dispatch.

MUST load `lanes/lane-schema.md` to fill the shared shapes and return the review packet and parent reduction shape before the first dispatch.

IF the proposal includes a lane or shared shape, load `../reference-lanes-design.md` to verify lane qualification, authority, and real shape consumers and return the applicable contract before the verdict.

IF the change is scoped, the four lanes above do not dispatch: judge the proposal in-parent against the Verdicts and Rubric below and record the verdict. Rule drift a scoped edit could introduce is caught at implementation review, where `rule-agreement` dispatches against the actual diff.

This reference covers the rest of the spec verdict in-parent.

## Verdicts

`lanes/lane-schema.md` owns the verdict labels. Here, `great` means accepted to implement, `targeted-revision` means a bounded spec fix before editing, and `significant-rewrite` means the promise, trigger, workflow, or proof route must be redesigned before implementation.

Blocker overrides: a spec cannot be accepted when the target behavior is not one named skill (for a multi-run spec doc: per run in its sequence), the trigger is not a loading condition, the authored body contract or usable main path is incomplete, a reference or lane call is vague or incomplete, a callee owns its entry routing, proposed lane work misses any qualification or widens authority, a promised stage or branch has no teaching owner, a shape-only reference lacks a named consumer, shared shapes lack real consumers or duplicate authority, a hard cutover retains competing owners, a proposed rule, gate, or completion criterion names no failure form, behavior-changing guidance has no proof route, sensitive surfaces are unclassified, or the proposed text is mostly no-op prose.

## Rubric

Covers what only a whole-spec verdict can judge:

- promise: the reusable behavior is specific and worth making durable.
- steering: proposed guidance leads with the action, result, and taste that define strong work; prohibitions are reserved for named failure boundaries and paired with the positive target. Each proposed rule, gate, and completion criterion names the failure form it serves. `steering-strength` does not run on a proposal, so this is the only gate on proposed wording before files are edited; checkability is covered by the `authored body` item below.
- invocation: model-invocable and user-invocable capabilities pay the right load for this skill's real callers.
- authored body: `SKILL.md` will name the mental model or stance, show a scan-visible all-run spine, end each meaningful step or reference pass with checkable completion, and state the overall proof, unresolved-condition, or blocker boundary.
- lane and shape proposals: apply the returned lane or shared-shape contract; every proposed lane qualifies, authority stays bounded, and every shared shape names a real consumer.
- ownership and cutover: every concept has one live owner, superseded paths and duplicate prose are removed without aliases or forwarding stubs, and the spec names all active consumers that must cut over together when ownership changes.
- proof plan: structural proof and artifact-scoped behavior proof are separated, behavior proof matches the skill type, and the plan preserves the authoring basis chosen in the skills-creation step `Choose the authoring basis and proof posture`.
- safety/platform: sensitive surfaces, plugin mechanics, changelog, and cache refresh are routed correctly when in scope.

Cover each item with source-backed evidence. When a lane receipt already covers an item, cite the receipt rather than re-deriving it.

## Reduction

The parent reduces candidate findings into the spec-review result before remediation. Reject pedantic, stylistic, already-satisfied, or otherwise non-semantic findings with source evidence and continue. Accepted findings that remain inside the settled mental model return to the design step for at most one remediation. A finding that breaks a load-bearing assumption or exposes unmade owner meaning stops with the failed assumption, evidence, consequence, and exact owner; do not force it through remediation. The parent verifies corrected anchors against the original bounded findings and may then mark the proposal accepted-to-implement without another reviewer dispatch. `significant-rewrite`, `reject-or-restart`, an expanded correction, or uncertain effect stops `review-permission-required` unless the user explicitly authorizes another review.

### Acceptance Binding

The parent closes a review with the original review record plus any one permitted remediation verification. Never compute or maintain a document hash or digest. Parent-verified formatting, typo, link, process-only changes, and exact accepted remediation preserve closure without reviewer dispatch. This stage-specific closure overrides generic changed-text freshness rules. A semantic change outside that remediation or uncertain effect stops `review-permission-required`; only explicit user permission may start another proposal review.

Report with these exact labels:

```text
review target:
verdict:
blocker overrides:
rubric evidence:
highest risk:
accepted findings:
rejected findings:
first required revision:
proof or retest implication:
implementation decision: accepted-to-implement | revise-first | restart | skipped-by-user
```

The first required revision is the smallest useful spec change. When the revision changes wording, output shape, omitted slots, conditional behavior, invocation, reference retrieval, or completion criteria, name the matching failure form from `SKILL.md`.

Complete when: the verdict carries one of the allowed labels, every blocker override is checked, and the implementation decision is explicit.
