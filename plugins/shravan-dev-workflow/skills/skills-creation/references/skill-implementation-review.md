# Skill Implementation Review

Review the implemented skill change before proof is generated and before ship status advances. This reference audits the actual changed files, proof quality, pressure coverage, accepted spec constraints, and remaining ship risk.

Return changed-file coverage, accepted/rejected/unverified findings, smallest edits, targeted retest, and ship decision.

For final repo skill-work readiness, `implementation-review-swarm` owns review orchestration and this reference supplies the skill-specific rubric, changed file coverage, and targeted retest expectations. Parent authority stays in the main run: subordinate agents return candidate evidence, not the final verdict. The calling `SKILL.md` owns which lanes are dispatched and their fresh-context contract; `manage-agents` owns pattern, model, runtime, and packet mechanics. Use `skill-review-lane-schema.md` for shared packet, finding, coverage, and reduction shapes.

The artifact under review here is the changed files, so every applicable lane can run. Receipts arriving here come from the lanes selected in `SKILL.md` and are synthesized by the parent, not by another lane. `lanes/claim-vs-evidence.md` is the one most specific to this stage: it grades whether the evidence supports the claim being made.

If the user explicitly requests outside counsel and Codex authored the change, prefer a non-Codex provider for at least one lane. When using `implementation-review-swarm`, use this reference as the skill-specific review input rather than a competing orchestration path.

## Review Rubric

Dispatched lanes own their own checks and each states its rubric in `lanes/`. This reference does not restate them; it covers what only a whole-change ship decision can judge:

- Every edited, added, or deleted source file is covered. Each file is reviewed semantically, marked source/static-only with its behavior status, or explicitly excluded by the accepted behavior-review boundary; deletions are verified through both absence and pointer inventory.
- The implemented diff matches the accepted spec and user constraints without crossing the accepted source, behavior, or ship boundary.
- Any lane or shared shape the change introduces satisfies `reference-lanes-design.md`, which is the single owner of qualification, authority, and shape families.
- Each rule has one live owner, with no aliases, forwarding stubs, or duplicate prose preserving a retired ownership.
- Behavior rows in a source-only review are explicitly `unverified/deferred`; source or static review may authorize only the next proof step and cannot authorize ship.
- The four surfaces still line up: trigger, `SKILL.md`, references, proof.
- Sensitive surfaces, platform metadata, changelog, and cache decisions are handled when in scope.
- The smallest accepted edit is clear enough to implement without broadening into portfolio audit.

Cover each item with source-backed evidence. When a lane receipt already covers an item, cite the receipt rather than re-deriving it.

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
