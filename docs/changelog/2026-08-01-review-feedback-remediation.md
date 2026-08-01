# 2026-08-01 Review Feedback Remediation

Plugin: `shravan-dev-workflow` 1.7.5

## What Changed

Applied the parent-verified fixes from the PR #37 implementation-review reduction across four runtime skills and one shared reference.

- `spec-program-review`: an additional focused lane now requires either explicit human-user authorization after seeing current coverage and cost, or pre-dispatch caller-packet authority naming that residual risk; the reviewing parent cannot grant this authority to itself mid-review, and reviewer output never creates it. The completion blocker enforces the same two branches. Parent reduction gained the bounded evidence-lookup branch: before accepting a finding, cite the accepted requirement identity, restate its meaning in plain language, and name the failing observable outcome; missing evidence routes to one bounded evidence lookup (`no redesign`) rather than more reviewers.
- `spec-design`, `program-design`, `spec-program-review`: when simplification, baseline recovery, or requirement subtraction is in scope, accepted-requirements coverage returns one compact row per stable identity or accepted group with `covered | owner-authorized supersession | gap` plus its anchor; a bare "coverage intact" assertion is not a result. Unrelated runs do not build a universal ledger.
- `program-design`: the simplification rule now cites the complete `spec-design` accepted requirements set — including stable identities, requirements, priorities, and assigners — instead of a narrower local list.
- `discuss-pathfinding` and `spec-design`: the boundary handoff token is canonicalized as `goal-boundary model (boundary check 1)` at every producer and consumer seam.
- `shared-references/diagram-rendering-and-fallbacks.md`: named acceptable rendered-inspection methods (repository/browser preview, local renderer); when no rendered inspection is available the result is `visual check: unverified (no renderer available)` with fallback or an explicit gap — never a bare pass. The rendered-view proof record was corrected accordingly.
- `plugins/README.md`: the `spec-program-review` summary now describes semantic-freshness review instead of the retired exact-digest contract.
- Public-safety scrub: absolute local paths and private checkout identifiers were removed from the tracked evidence documents under `docs/wip/skills-authoring/2026-07-31-user-focused-requirements-update/`.

## Validation

- Vitest deterministic suite: 8 files, 42 tests passed (after the contract test was aligned with the corrected wording).
- TypeScript: passed.
- `claude plugin validate .`: passed.
- `git diff --check`: passed.
- Public-safety scan of the update directory: zero remaining private paths or checkout names.
- Model pressure execution remains deferred by explicit user direction and is not claimed as behavior proof.

## Refresh Status

- Source metadata targets `1.7.5` for Codex and Claude.
- No Codex or Claude refresh/reinstall was performed; installed-cache readback remains pending and is not required for source/PR readiness.
