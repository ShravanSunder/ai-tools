# 2026-06-22 Spec Swarm Lane References

Marketplace-facing plugin: `shravan-dev-workflow` `1.6.29`

## Summary

Refined `spec-creation-swarm` and `spec-review-swarm` so substantial spec work
uses concrete lane references, readable primary specs, slice specs for real
vertical boundaries, and refinement-shaped review findings:

- Added per-lane reference files for spec creation and spec review.
- Reduced shared packet refs to shared packet anatomy instead of named lane
  overlays.
- Made `spec-creation-swarm` require one primary `<slug>.md` spec file for
  substantial specs, with slice specs only for vertical slices, app protocols,
  domain boundaries, ownership boundaries, or shared lower-level contracts.
- Kept `spec-review-swarm` as the phase name while requiring every review lane
  to return refinement-shaped findings through a canonical finding schema.
- Added pressure scenarios for primary-spec quality, slice-spec routing,
  non-generic lane prompts, boundary fidelity, progressive disclosure,
  spec-difference review, and refinement inputs.

## Affected Surfaces

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/`
- `tests/skills/pressure-scenarios/`
- `docs/changelog/README.md`

## Validation

- `jq empty` for plugin metadata and marketplace manifests: passed.
- Static lane selector/file parity checks: passed.
- Shared packet cleanup check for removed named lane overlays: passed.
- `git diff --check`: passed.
- `pnpm --dir tests/skills run typecheck`: passed.
- `pnpm --dir tests/skills run test`: passed, 6 files / 25 tests.
- Direct Vitest fake-backend pressure scenarios passed through
  `tests/skills/evals/skill-pressure.eval.ts` with `SKILL_PRESSURE_SCENARIO`
  selection for:
  `spec-creation-swarm-lane-prompts-not-generic`,
  `spec-creation-swarm-no-session-dump-lanes`,
  `spec-creation-swarm-primary-spec-not-outline`,
  `spec-creation-swarm-spec-folder-chunking`,
  `spec-review-swarm-boundary-fidelity`,
  `spec-review-swarm-lane-prompts-not-generic`,
  `spec-review-swarm-no-prejudged-lanes`,
  `spec-review-swarm-progressive-disclosure-lane`,
  `spec-review-swarm-refinement-inputs`, and
  `spec-review-swarm-spec-difference-lane`.
- `claude plugin validate .`: passed.
- Source-backed Codex marketplace/install smoke with temp `CODEX_HOME`: passed
  for `shravan-dev-workflow` `1.6.29`.
- Source-backed live Codex pressure run: blocked because the temp `CODEX_HOME`
  has no Codex auth. The normal home plugin cache was not refreshed or mutated
  in this changeset.
- Implementation review swarm: found broken nested lane-reference wording; fixed
  by removing repo-source path literals from lane files and using the
  skill-root `references/finding-schema.md` path for the review schema.
- PR readiness proof: pending.

## Refresh Status

Source plugin metadata is bumped to `1.6.29`. Runtime cache refresh/reinstall is
not performed by this changeset; it remains a home-level action requiring
explicit authorization.
