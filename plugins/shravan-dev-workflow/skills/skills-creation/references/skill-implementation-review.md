# Skill Implementation Review

Review the implemented skill change after proof exists and before ship status advances. This reference audits the actual changed files, proof quality, pressure coverage, accepted spec constraints, and remaining ship risk.

Return changed-file coverage, accepted/rejected/unverified findings, smallest edits, targeted retest, and ship decision.

For final repo skill-work readiness, `implementation-review-swarm` owns review orchestration and this reference supplies the skill-specific rubric, changed file coverage, and targeted retest expectations. Parent authority stays in the main run: subordinate agents return candidate evidence, not the final verdict. Use `skill-review-output-schema.md` for shared packet, finding, coverage, and reduction shapes.

## Review Lanes

Use at least two read-only perspectives for behavior-changing skill changes as defined by the calling `SKILL.md`:

- `fresh-perspective`: checks whether the implemented skill still satisfies its promise and avoids duplicated homes, weak pointers, missing gates, and no-op prose.
- `local-lane`: uses a second independent in-session/local perspective with a different focus. This is the default second lane.
- `outside-model`: uses Claude, Cursor-backed model, Grok, or another configured non-parent provider only when the user explicitly requests external counsel. Otherwise record `outside-model not requested`.

If the user explicitly requests outside counsel and Codex authored the change, prefer a non-Codex outside-model lane. If another model authored it, prefer Codex plus one different model. Provider choice, packets, permissions, and reductions are governed by the active review orchestrator; when using `implementation-review-swarm`, use this reference as the skill-specific review input rather than a competing orchestration path.

## Review Rubric

Ask reviewers to check:

- Every edited, added, or deleted source file is covered by the review. Each file is reviewed semantically, marked source/static-only with its behavior status, or explicitly excluded by the accepted behavior-review boundary; deletions are verified through both absence and pointer inventory.
- The implemented diff matches the accepted spec and user constraints without crossing the accepted source, behavior, or ship boundary.
- Every ordinary reference call uses one complete literal `MUST load` or `IF <observable predicate>, load` form and owns the exact path, requested work, and concrete return. The caller keeps the all-run obligation, order, decision, required return, invariant, and completion visible even when coherent detailed procedure lives behind `MUST load`.
- Every lane handoff uses one complete literal `MUST dispatch` or `IF <observable predicate>, dispatch` form and supplies the lane, packet with prerequisites and dependency state, lane reference, parallel-safety basis, bounded instance authority, expected receipt, and parent verification and reduction point.
- Opened ordinary and lane references do not own or repeat their entry mode or predicate. A callee may state expected inputs, local conditions, owned procedure, nested calls, returns, and stop conditions without self-entry routing.
- Every lane satisfies all nine qualifications: concurrent safety after prerequisites; execution from a bounded supplied packet without live parent back-and-forth or hidden reasoning; bounded mission and reason for separate ownership; supplied context and source anchors; owned decisions and non-goals; prerequisites and dependency state; allowed actions and authority; shaped `complete`, `partial`, or `blocked` receipt with evidence and unresolved questions; and parent verification, conflict handling, and reduction.
- Qualified work remains a lane when scheduling serializes it. Conditionality, provider specificity, length, reference placement, directory name, delegation, or actual concurrency cannot substitute for qualification.
- Caller-supplied lane-instance authority equals or narrows the lane reference's stable maximum and never widens it; lane receipts remain provisional until parent verification and reduction.
- Each rule has one live owner. The accepted hard-cutover's retired standalone topology and schema files and pointers are absent, with no aliases, forwarding stubs, or duplicate prose preserving the old ownership.
- Every `lane-schema`, `output-schema`, and `tool-schema` names a real consumer and fits its family predicate. Shared fields compose through links, nesting, or one declared owner; output or tool shapes do not inherit lane authority, and machine validation does not create authority drift.
- Artifact-scoped pressure output proves the affected behavior and countercases; broad regex presence, static validation, or source wording alone is not behavior proof.
- The change preserves demonstrated RED-before-edit and requires artifact-scoped GREEN before ship. Passing controls remain passing controls rather than being relabeled RED.
- Behavior rows in a source-only review are explicitly `unverified/deferred`; source/static review may authorize only the next proof step and cannot authorize ship.
- The four surfaces still line up: trigger, `SKILL.md`, references, proof.
- Reference pointers are observable and name what comes back to the main path.
- Sensitive surfaces, platform metadata, changelog, and cache decisions are handled when in scope.
- The smallest accepted edit is clear enough to implement without broadening into portfolio audit.

## Reduction

The parent verifies candidate findings against source files, pressure output, and user constraints before accepting them. Reject findings that contradict the current scope, treat length alone as a blocker when the user scoped length out, or ask for broad `skill-audit` work during one-skill authoring.

Accepted implementation findings route back to the owning phase:

```text
spec mismatch or missing decision -> skill spec step
wording/reference/platform issue  -> implementation step
proof-quality issue               -> proof step
ship-surface issue                -> prune/ship step
```

After accepted edits, rerun the narrowest pressure scenario or static proof that could catch the issue. If the finding challenges proof quality, rerun the artifact-scoped scenario that produced the questionable proof. If the edit changes placement, call completeness, or reference retrieval, rerun the scenario that exercises the workflow spine or reference loading. When accepted findings cause edits, refresh the targeted retest result, parent reduction, and changed-file coverage for every touched file before returning to ship status; do not reuse stale proof or reviewed-file coverage for changed text.
