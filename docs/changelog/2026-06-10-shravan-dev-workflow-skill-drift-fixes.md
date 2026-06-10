# 2026-06-10 Shravan Dev Workflow Skill Drift Fixes

Plugin: `shravan-dev-workflow`
Version: `1.6.4`

## Summary

Fixed the first follow-up issues from the full skill audit: stale installed-cache
visibility, stale private prompt references, a renamed plan-execute artifact, and
uneven trigger-eval coverage.

## Changes

- Added full-suite routing and gate checks to `references/trigger-evals.md`.
- Renamed the `plan-execute` controller brief from `validate-execute-brief.md`
  to `plan-execute-brief.md`.
- Tightened `pm-linear-work` frontmatter to a direct `Use when...` trigger.
- Bumped Codex and Claude plugin manifests to `1.6.4`.
- Updated the Claude marketplace entry for `shravan-dev-workflow` to `1.6.4`.

## Validation To Run

- `quick_validate.py` on every skill.
- `validate_plugin.py plugins/shravan-dev-workflow`.
- `claude plugin validate .`.
- `codex plugin add shravan-dev-workflow@ai-tools`.
- `codex plugin list --marketplace ai-tools --available --json`.
