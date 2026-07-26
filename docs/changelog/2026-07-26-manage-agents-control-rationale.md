# Manage Agents Control Rationale

## Release

- Plugin: `shravan-dev-workflow` `1.6.69`
- Skill: `manage-agents`

## Change

- Explains why reviewers receive no parent conversation history.
- Clarifies when non-review assignments benefit from full or no parent history.
- Clarifies that workspace write access is selected only for workspace modification.

## Validation

- Two-vector consistency readback: passed.
- Codex skill quick validator: passed (`Skill is valid!`).
- Claude plugin validation: passed.
- `1.6.69` version consistency: passed.
- `git diff --check`: passed.
- Pressure tests were intentionally not run.

## Refresh / Reinstall

- Codex and Claude installed caches were not refreshed.
