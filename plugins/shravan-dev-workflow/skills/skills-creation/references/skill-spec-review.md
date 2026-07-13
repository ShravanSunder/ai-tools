# Skill Spec Review

Review the intended skill design before implementation. This reference judges whether the proposed promise, trigger, workflow, reference split, and proof plan would make a trustworthy skill if implemented.

Return a spec-review verdict, blocker overrides, rubric evidence, accepted and rejected findings, first required revision, and proof or retest implication.

Use `manage-agents` for reviewer-lane mechanics. Parent authority stays in the main run: reviewer lanes return candidate findings, not the final verdict. Use `skill-review-output-schema.md` for shared packet, finding, coverage, and reduction shapes.

## Review Lanes

Use at least two read-only perspectives for behavior-changing skill specs as defined by the calling `SKILL.md`:

- `fresh-perspective`: checks whether the intended skill promise, trigger, workflow, reference split, and proof route cohere without relying on the author's explanation.
- `local-lane`: uses a second independent in-session/local perspective with a different focus. This is the default second lane.
- `outside-model`: uses Claude, Cursor-backed model, Grok, or another configured non-parent provider only when the user explicitly requests external counsel. Otherwise record `outside-model not requested`.

## Verdicts

Allowed verdicts: `great`, `targeted-revision`, `significant-rewrite`, `reject-or-restart`. Use the exact label; do not replace it with a free-form phrase such as "not great yet."

For pre-implementation spec review, `great` means accepted to implement. `targeted-revision` means the intended design needs a bounded spec fix before editing. `significant-rewrite` means the proposed design's promise, trigger, workflow, or proof route must be redesigned before implementation.

Blocker overrides: a spec cannot be accepted when the target behavior is not one named skill, the trigger is not a loading condition, the authored body contract or usable main path is incomplete, a reference or lane call is vague or incomplete, a callee owns its entry routing, proposed lane work misses any qualification or widens authority, branch-critical depth has no owning reference, shared shapes lack real consumers or duplicate authority, a hard cutover retains competing owners, behavior-changing guidance has no proof route, sensitive surfaces are unclassified, or the proposed text is mostly no-op prose.

## Rubric

Cover each item with source-backed evidence:

- promise: the reusable behavior is specific and worth making durable.
- trigger: name and YAML/frontmatter description say when to load, why briefly, and do not summarize the workflow.
- invocation: model-invocable and user-invocable capabilities pay the right load.
- authored body: `SKILL.md` will name the mental model or stance, show a scan-visible all-run spine, end each meaningful local step or reference pass with checkable completion, keep always-needed steering and invariants near the decisions they govern, and state the overall proof, unresolved-condition, or blocker boundary for completion.
- caller forms: each call site uses exactly one literal leading form: `MUST load`, `IF <observable predicate>, load`, `MUST dispatch`, or `IF <observable predicate>, dispatch`. `MUST` is the all-run path, `IF` is mutually exclusive branch routing, `load` consumes reference content, and `dispatch` hands a lane to a subagent.
- ordinary calls: the caller owns load mode or observable predicate, exact reference path, requested work, and the concrete result consumed by the continuing main path. A `MUST load` reference may own a coherent detailed all-run procedure, but the caller must still expose that step's obligation, order, decision, required return, invariant, and completion.
- ordinary callee: an opened reference does not self-route. It may state expected inputs, its owned decision, local conditions and procedure, nested calls, detailed return, and checkable stop condition without repeating or independently owning its caller's load mode or predicate.
- dispatch calls: when work is handed to a subagent, the caller names the lane, supplied packet including prerequisites and dependency state, lane reference the subagent loads, parallel-safety basis, instance authority, expected receipt, and parent verification and reduction point.
- lane qualification: every proposed lane explicitly has (1) concurrent safety after prerequisites, (2) execution from a bounded supplied packet without live parent back-and-forth or hidden reasoning, (3) a bounded mission and reason for separate ownership, (4) supplied context and source anchors, (5) owned decisions and non-goals, (6) prerequisites and dependency state, (7) allowed actions and authority, (8) a shaped `complete`, `partial`, or `blocked` receipt with evidence and unresolved questions, and (9) parent verification, conflict handling, and reduction.
- lane semantics: qualification depends on parallel safety and bounded handoff, not actual concurrent scheduling; work that qualifies remains a lane when runtime scheduling serializes it. Conditional, provider-specific, long, referenced, delegated, or concurrently run work does not qualify by that fact alone.
- authority: caller-supplied instance authority equals or narrows the lane reference's stable maximum and never widens it. Lane receipts remain provisional until the parent verifies, resolves conflicts, and reduces them into the overall workflow.
- shared shapes: each extracted shape names its real consumer and satisfies every family predicate it claims: `lane-schema` for common lane context or return fields, `output-schema` for stable model-readable results used by multiple consumers, and `tool-schema` only when a tool, test, CI check, or runtime validates the structure. The families classify owned shapes rather than whole workflows or files. Overlap composes through links, nesting, or one authoritative owner without copying fields or transferring lane authority to output or tool shapes.
- hierarchy: caller-owned obligations, order, decisions, required returns, invariants, and completion stay visible in `SKILL.md`; coherent detailed all-run procedure may live behind `MUST load`; branch depth has strong caller-owned pointers; and related concepts are co-located.
- steering: guidance form matches the failure: positive output shape, required slot, observable predicate, rationalization counter, or stronger completion criterion.
- ownership and cutover: every concept has one live owner, superseded paths and duplicate prose are removed without aliases or forwarding stubs, and the spec names all active consumers that must cut over together when ownership changes.
- proof plan: structural proof and artifact-scoped behavior proof are separated; behavior proof matches the skill type, covers caller/callee, lane, authority, and schema countercases affected by the change, and preserves RED-before-edit and GREEN-before-ship.
- safety/platform: sensitive surfaces, plugin mechanics, changelog, and cache refresh are routed correctly when in scope.

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
