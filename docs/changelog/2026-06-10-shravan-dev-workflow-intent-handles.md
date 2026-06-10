# 2026-06-10 Shravan Dev Workflow Intent Handles

Plugin: `shravan-dev-workflow`
Version: `1.6.5`

## Summary

Tightened selected workflow skills with sparse, targeted software-lore terms that
act as behavior handles instead of broad motivational prose.

## Changes

- Added `systematic debugging` and `hypothesis-driven debugging` framing to
  `debug-investigation`.
- Added `controller-owned execution` framing to `implementation-execute-plan`.
- Added `handoff packet` / `continuity artifact` framing to `plan-handoff`.
- Added `evidence packet` framing to `implementation-handoff`.
- Added `skills encode judgment and house style` framing to `skill-audit`.
- Added `audit boundary` framing to `ops-security-review`.
- Bumped Codex and Claude plugin manifests plus marketplace metadata to `1.6.5`.

## Validation To Run

- `quick_validate.py` on every skill.
- `validate_plugin.py plugins/shravan-dev-workflow`.
- `claude plugin validate .`.
- `codex plugin add shravan-dev-workflow@ai-tools`.
- `codex plugin list --marketplace ai-tools --available --json`.
