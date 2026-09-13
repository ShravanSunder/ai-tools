# 2026-09-13 manage-agents reviewer dispatch

## What changed

- Reviewers encode history only as `fork_turns="none"`. A positive integer or `all` is forbidden.
- Independent-review packets name absolute lane paths. They do not load coordinator or manage-agents `SKILL.md`.
- Every ACPX review uses a named session, never `exec`. No ACPX call may pass `--timeout`. A dropped wait is not a missing receipt; read `sessions list/show/read` before `blocked`.

## Source of truth

`plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md`

## Files touched

- `plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md`
- `plugins/shravan-dev-workflow/skills/manage-agents/references/native-providers-codex.md`
- `plugins/shravan-dev-workflow/skills/manage-agents/references/acpx.md`
- `plugins/shravan-dev-workflow/.{claude,codex,cursor}-plugin/plugin.json` (2.12.1)
- four `manage-agents` pressure scenarios and `tests/skills/pressure-scenarios/README.md`

## Validation

- `pnpm --dir tests/skills exec vitest run evals --config vitest.config.ts -t 'manage-agents-(foreign-lineage-uses-acpx|reviewer-fork-turns-none|reviewer-no-coordinator-skill|acpx-frontier-retrieve-not-timeout)'`

## refresh/reinstall

Reinstall `shravan-dev-workflow` 2.12.1 after merge. Not a home-hook change.
