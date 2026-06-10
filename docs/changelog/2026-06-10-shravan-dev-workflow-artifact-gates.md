# Shravan Dev Workflow Artifact Gates

Plugin: `shravan-dev-workflow`
Version: `1.6.7`
Date: `2026-06-10`

## Summary

Aligned workflow skills around phase-owned artifacts and docs-owned lifecycle:

- `spec-design-swarm`, `plan-review`, and `debug-investigation` now write lane artifacts by default for clear substantial work unless the user asks for chat-only/no-files output.
- `docs-maintain` now owns cleanup, archival, promotion, and source-of-truth reconciliation for existing workflow artifacts; active spec/plan/debug work stays with the phase skill.
- `implementation-review-swarm` now treats Claude, Gemini, `agy`, and other outside counsel as explicit opt-in lanes.
- Plugin metadata, README, source inspirations, trigger evals, and marketplace version were updated to `1.6.7`.

## Validation Targets

- Phase skills should not create files when the request is unclear.
- Phase skills should not decide long-term document lifecycle.
- `docs-maintain` should classify existing specs, plans, debug notes, and handoffs before cleanup or promotion.
- External model lanes should not run unless requested.

## Validation

- `git diff --check`
- `claude plugin validate .`
- `codex plugin list --marketplace ai-tools --available --json` showed installed `shravan-dev-workflow` at `1.6.6` before refresh.
- `codex plugin add shravan-dev-workflow@ai-tools --json` refreshed Codex to `1.6.7`.
