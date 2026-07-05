# Discuss-With-Me Retired From Plugin Discovery

Plugin: `shravan-dev-workflow` 1.6.42

## User-Visible Change

Retired the old `discuss-with-me` skill from the live plugin skill tree. The
split discussion surface now routes fuzzy shared-model work through
`discuss-clarify-mental-models`, while narrow human/product decisions stay as
direct user clarification from the owning workflow.

## Affected Surfaces

- Moved `plugins/shravan-dev-workflow/skills/discuss-with-me/` to
  `plugins/shravan-dev-workflow/retired-skills/discuss-with-me/` and renamed
  the retired entrypoint to `SKILL.retired.md` so recursive `SKILL.md` scanners
  cannot rediscover it.
- Moved old `discuss-with-me` pressure scenarios and the legacy shell wrapper
  under retired test paths so the default pressure runner no longer treats them
  as live scenarios.
- Updated plugin manifests, marketplace metadata, README, AGENTS skill table,
  orchestrator-goal routing, research/review/docs route references, and pressure
  scenario expectations away from `discuss-with-me`.
- Renamed spec-creation's decision-question reference from
  `references/discuss-with-me.md` to `references/user-decision-questions.md`.

## Validation

- `jq . plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .agents/plugins/marketplace.json .claude-plugin/marketplace.json` -- pass.
- `claude plugin validate .` -- pass.
- `pnpm --dir tests/skills exec tsc --noEmit` -- pass.
- `bash -n tests/skills/retired-test-scripts/test-discuss-with-me-pressure.sh`
  -- pass.
- `git diff --check` -- pass.
- `tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-clarity-gate --timeout 900` -- pass after rerun outside the sandbox.
- `tests/skills/run-skill-pressure-tests.sh --fast --scenario implementation-review-swarm-reanchor-missed-system --timeout 900` -- pass after rerun outside the sandbox.
- `tests/skills/run-skill-pressure-tests.sh --fast --scenario implementation-review-swarm-route-back-by-owner --timeout 900` -- pass after rerun outside the sandbox.
- Active grep check: no `discuss-with-me` references outside this changelog and
  retired paths; no `SKILL.md` remains under any `discuss-with-me` path.

## Refresh / Reinstall Status

- Source-only. Installed Codex/Claude plugin caches were not refreshed; that is
  a separate home-level mutation.
- `codex plugin list --marketplace ai-tools --available --json` still reports
  installed `shravan-dev-workflow` at 1.6.36 while the source manifests are
  1.6.42.
