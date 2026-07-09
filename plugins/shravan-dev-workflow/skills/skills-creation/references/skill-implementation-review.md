# Skill Implementation Review

Review the implemented skill change after proof exists and before ship status
advances. This reference audits the actual changed files, proof quality,
pressure coverage, accepted spec constraints, and remaining ship risk.

Return changed-file coverage, accepted/rejected/unverified findings, smallest
edits, targeted retest, and ship decision.

For final repo skill-work readiness, `implementation-review-swarm` owns review
orchestration and this reference supplies the skill-specific rubric, changed
file coverage, and targeted retest expectations. Parent authority stays in the
main run: subordinate agents return candidate evidence, not the final verdict.
Use `skill-review-output-schema.md` for shared packet, finding, coverage, and
reduction shapes.

## Review Lanes

Use at least two read-only perspectives for non-trivial skill changes:

- `fresh-perspective`: checks whether the implemented skill still satisfies its
  promise and avoids duplicated homes, weak pointers, missing gates, and no-op
  prose.
- `local-lane`: uses a second independent in-session/local perspective with a
  different focus. This is the default second lane.
- `outside-model`: uses Claude, Cursor-backed model, Grok, or another
  configured non-parent provider only when the user explicitly requests
  external counsel. Otherwise record `outside-model not requested`.

If the user explicitly requests outside counsel and Codex authored the change,
prefer a non-Codex outside-model lane. If another model authored it, prefer
Codex plus one different model. Provider choice, packets, permissions, and
reductions are governed by the active review orchestrator; when using
`implementation-review-swarm`, use this reference as the skill-specific review
input rather than a competing orchestration path.

## Review Rubric

Ask reviewers to check:

- Every changed file is reviewed, marked static-only, or explicitly outside the
  behavior-review scope.
- The implemented diff matches the accepted spec and user constraints.
- The pressure result proves behavior rather than only satisfying a regex or
  static validator.
- The change preserves RED-before-edit and GREEN-before-ship.
- The four surfaces still line up: trigger, `SKILL.md`, references, proof.
- Each rule has one home with the right owner.
- Reference pointers are observable and name what comes back to the main path.
- Schema, lane, output, or tool shapes exist only for real consumers.
- Sensitive surfaces, platform metadata, changelog, and cache decisions are
  handled when in scope.
- The smallest accepted edit is clear enough to implement without broadening
  into portfolio audit.

## Reduction

The parent verifies candidate findings against source files, pressure output,
and user constraints before accepting them. Reject findings that contradict the
current scope, treat length alone as a blocker when the user scoped length out,
or ask for broad `skill-audit` work during one-skill authoring.

Accepted implementation findings route back to the owning phase:

```text
spec mismatch or missing decision -> skill spec step
wording/reference/platform issue  -> implementation step
proof-quality issue               -> proof step
ship-surface issue                -> prune/ship step
```

After accepted edits, rerun the narrowest pressure scenario or static proof
that could catch the issue. If the finding challenges proof quality, rerun the
scenario that produced the questionable proof. If the edit changes placement or
reference retrieval, rerun the scenario that exercises workflow spine or
reference loading. When accepted findings cause edits, refresh the parent
reduction or changed-file coverage for the touched files before returning to
ship status; do not reuse stale reviewed-file coverage for changed text.
