# 2026-06-10 Shravan Dev Workflow Discuss Thinking Clarifier

Plugin: `shravan-dev-workflow`
Version: `1.6.6`

## Summary

Sharpened `discuss-with-me` from generic lifecycle alignment into a manual
thinking-clarifier skill that helps the model teach back, steelman, stress-test,
and clarify the user's thinking before action.

## Changes

- Added sparse intent handles to `discuss-with-me`:
  - `reflect-back`
  - `grill-me`
  - `steelman`
  - `stress-test`
  - `assumption-check`
  - `boundary-check`
  - `source-of-truth`
  - `reconverge`
- Added question patterns for steelman, stress test, and boundary probes.
- Strengthened stage guidance with pressure prompts for design, spec, plan,
  implementation, and docs discussions.
- Added trigger evals for grilling, steelmanning, stress-testing, and
  source-of-truth reflection.
- Updated plugin metadata and the skill UI chip text.

## Validation To Run

- `quick_validate.py` on every skill.
- `validate_plugin.py plugins/shravan-dev-workflow`.
- `claude plugin validate .`.
- `git diff --check`.
- `codex plugin add shravan-dev-workflow@ai-tools`.
- `codex plugin list --marketplace ai-tools --available --json`.
