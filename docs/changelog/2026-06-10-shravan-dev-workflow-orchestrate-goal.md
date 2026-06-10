# 2026-06-10 Shravan Dev Workflow Orchestrator Goal

Plugin: `shravan-dev-workflow`
Version: `1.6.5`

## Summary

Added `orchestrator-goal`, a thin long-horizon goal controller for Codex and
Claude goal-backed workflows.

## Changes

- Added `skills/orchestrator-goal/` with progressive-disclosure references for:
  - reusable goal contracts
  - Codex `/goal` semantics
  - Claude `/goal` semantics
  - routing to phase-specific workflow skills
  - copy-paste goal prompts
- Encoded the two-path DX rule:
  - clear goals compile into verifiable goal contracts
  - unclear goals route to `discuss-with-me`
- Updated plugin README, source-inspiration notes, and trigger evals.
- Updated Codex and Claude plugin metadata for version `1.6.5`.
- Updated agent instructions to prefer `orchestrator-goal` for long-horizon
  `/goal` setup, resume, audit, and handoff workflows.

## Validation To Run

- `quick_validate.py` on every skill.
- `validate_plugin.py plugins/shravan-dev-workflow`.
- `claude plugin validate .`.
- `git diff --check`.
- `codex plugin add shravan-dev-workflow@ai-tools`.
- `codex plugin list --marketplace ai-tools --available --json`.
