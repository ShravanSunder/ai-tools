# Skill Spec Review

Review the intended skill design before implementation. This reference judges whether the proposed promise, trigger, workflow, reference split, and proof plan would make a trustworthy skill if implemented.

Return a spec-review verdict, blocker overrides, rubric evidence, accepted and rejected findings, first required revision, and proof or retest implication.

The review lead runs this stage with reviewer agents that did not write the spec, and returns its result to whoever asked for the review.

## The Artifact

The artifact is a skill spec, conversational or in a spec doc. `../../skill-creation/references/skill-spec.md` owns its slots and when it must be a doc; a required spec doc that is missing makes this review `blocked`. The reviewers judge the provided artifact; they do not author it.

## Ordered Checks

Two reviewer agents walk the checks, each in its own session, each loading `checks/review-schema.md` first:

- **teaching reviewer:** `checks/mental-model-fit.md`, then `checks/depth-coverage.md`;
- **structure reviewer:** `checks/trigger-routing.md`, then `checks/rule-agreement.md`.

The proposal contains the lens, trigger, rules, promised stages, and planned reference tree those checks need. Line-level checks wait for implementation review.

For a scoped change, the review lead still checks the proposal against the Verdicts and Rubric below, assigns only the check that owns the targeted failure form plus `rule-agreement`, and records why each other check was not selected. IF the proposal changes an output or tool shape, load `../../skill-creation/references/shared-shape-design.md` and return its shape-consumer contract. Each selected check records `complete | partial | blocked`; an unselected check records `complete` with `not selected: <reason>`. Return the per-check status block before the verdict.

## Verdicts

`checks/review-schema.md` owns the verdict labels. Here, `great` means accepted to implement, `targeted-revision` means a bounded spec fix before editing, and `significant-rewrite` means the promise, trigger, workflow, or proof route must be redesigned before implementation.

Blocker overrides: a spec cannot be accepted when the target behavior is not one named skill (for a multi-run spec doc: per run in its sequence), the trigger is not a loading condition, the authored body contract or usable main path is incomplete, a reference or dispatched-procedure call is vague or incomplete, a callee owns its entry routing, proposed dispatched work is not a prescribed procedure or widens authority, a promised stage or branch has no teaching owner, a shape-only reference lacks a named consumer, shared shapes lack real consumers or duplicate authority, a hard cutover retains competing owners, a proposed rule, gate, or completion criterion names no failure form, behavior-changing guidance has no proof route or done bar, sensitive surfaces are unclassified, or the proposed text is mostly no-op prose.

## Rubric

Covers what only a whole-spec verdict can judge:

- promise: the reusable behavior is specific and worth making durable.
- steering: proposed guidance leads with the action, result, and taste that define strong work; prohibitions are reserved for named failure boundaries and paired with the positive target. Each proposed rule, gate, and completion criterion names the failure form it serves. `steering-strength` does not run on a proposal, so this is the only gate on proposed wording before files are edited; checkability is covered by the `authored body` item below.
- invocation: model-invocable and user-invocable capabilities pay the right load for this skill's real callers.
- authored body: `SKILL.md` will name the mental model or stance, show a scan-visible all-run spine, end each meaningful step or reference pass with checkable completion, and state the overall proof, unresolved-condition, or blocker boundary.
- shape proposals: apply the returned shared-shape contract; every shared shape names a real consumer.
- ownership and cutover: every concept has one live owner, superseded paths and duplicate prose are removed without aliases or forwarding stubs, and the spec names all active consumers that must cut over together when ownership changes.
- proof plan: structural proof and artifact-scoped behavior proof are separated, behavior proof matches the skill type, the done bar matches the authoring basis (`new-from-intent` for user-directed intent, `fix-for-recorded-failure` for a reproduced failure), and the plan preserves the basis the spec records.
- safety/platform: sensitive surfaces, plugin mechanics, changelog, and cache refresh are routed correctly when in scope.

Cover each item with source-backed evidence. When a check result already covers an item, cite it rather than re-deriving it.

## Reduction

The review lead reduces candidate findings into the spec-review result before remediation, verifying each at its anchor as `checks/review-schema.md` requires. Reject pedantic, stylistic, already-satisfied, or otherwise non-semantic findings with source evidence and continue. Accepted findings that remain inside the settled mental model return to the author for remediation under the convergence rule and accepted boundary in this skill's `SKILL.md`. A finding that breaks a load-bearing assumption or exposes an undecided user choice stops with the failed assumption, evidence, consequence, and the decision the user must make; do not force it through remediation. The same review lead verifies corrected anchors against the original bounded findings and returns its result, which accepts the proposal without another review. `significant-rewrite`, `reject-or-restart`, an expanded correction, or uncertain effect goes to the user before another review.

### Acceptance Binding

The review lead closes a review with the original review record plus its verification of each remediation. Never compute or maintain a document hash or digest. When the lead has verified them, formatting, typo, link, process-only changes, and exact accepted remediation preserve closure without another review. This stage-specific closure overrides generic changed-text freshness rules. A semantic change outside the accepted boundary, or of uncertain effect, goes to the user before another proposal review.

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

The first required revision is the smallest useful spec change. IF the revision changes wording, output shape, omitted slots, conditional behavior, invocation, reference retrieval, or completion criteria, load `../../skill-creation/SKILL.md` and return the matching failure form from its wording table.

Complete when: the verdict carries one of the allowed labels, every blocker override is checked, and the implementation decision is explicit.
