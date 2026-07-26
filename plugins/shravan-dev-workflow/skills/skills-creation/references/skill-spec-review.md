# Skill Spec Review

Review the intended skill design before implementation. This reference judges whether the proposed promise, trigger, workflow, reference split, and proof plan would make a trustworthy skill if implemented.

Return a spec-review verdict, blocker overrides, rubric evidence, accepted and rejected findings, first required revision, and proof or retest implication.

Parent authority stays in the main run: lanes return candidate findings, not the final verdict. The calling `SKILL.md` owns which lanes are dispatched and their fresh-context contract; `manage-agents` owns pattern, model, runtime, and packet mechanics. Use `skill-review-lane-schema.md` for shared packet, finding, coverage, and reduction shapes.

The artifact under review here is a proposal, not files on disk, so only lanes whose questions are answerable about a design are dispatched: `lanes/mental-model-fit.md`, `lanes/trigger-routing.md`, and `lanes/rule-agreement.md`. Lanes that need line-level text, call sites, or real transcripts run at implementation review instead. This reference covers the rest of the spec verdict in-parent.

## Verdicts

Allowed verdicts: `great`, `targeted-revision`, `significant-rewrite`, `reject-or-restart`. Use the exact label; do not replace it with a free-form phrase such as "not great yet."

For pre-implementation spec review, `great` means accepted to implement. `targeted-revision` means the intended design needs a bounded spec fix before editing. `significant-rewrite` means the proposed design's promise, trigger, workflow, or proof route must be redesigned before implementation.

Blocker overrides: a spec cannot be accepted when the target behavior is not one named skill, the trigger is not a loading condition, the authored body contract or usable main path is incomplete, a reference or lane call is vague or incomplete, a callee owns its entry routing, proposed lane work misses any qualification or widens authority, branch-critical depth has no owning reference, shared shapes lack real consumers or duplicate authority, a hard cutover retains competing owners, behavior-changing guidance has no proof route, sensitive surfaces are unclassified, or the proposed text is mostly no-op prose.

## Rubric

Dispatched lanes own their own checks and each states its rubric in `references/lanes/`. This reference does not restate them; it covers what only a whole-spec verdict can judge:

- promise: the reusable behavior is specific and worth making durable.
- invocation: model-invocable and user-invocable capabilities pay the right load for this skill's real callers.
- authored body: `SKILL.md` will name the mental model or stance, show a scan-visible all-run spine, end each meaningful step or reference pass with checkable completion, and state the overall proof, unresolved-condition, or blocker boundary.
- lane and shape proposals: any lane the spec proposes satisfies `reference-lanes-design.md`, and any shared shape names a real consumer there. That reference is the single owner of qualification, authority, and shape families.
- ownership and cutover: every concept has one live owner, superseded paths and duplicate prose are removed without aliases or forwarding stubs, and the spec names all active consumers that must cut over together when ownership changes.
- proof plan: structural proof and artifact-scoped behavior proof are separated, behavior proof matches the skill type, and the plan preserves the authoring basis chosen in `SKILL.md` step 2.
- safety/platform: sensitive surfaces, plugin mechanics, changelog, and cache refresh are routed correctly when in scope.

Cover each item with source-backed evidence. When a lane receipt already covers an item, cite the receipt rather than re-deriving it.

## Reduction

The parent reduces candidate findings into the spec-review result. Accepted findings return to the design step they affect before implementation starts. Implementation may start only after the parent marks the spec accepted-to-implement. If the verdict is `targeted-revision`, `significant-rewrite`, or `reject-or-restart`, revise the spec and run a fresh parent reduction before editing files, unless the user explicitly skips review.

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
