# Manage Agents Binary History

## Release

- Plugin: `shravan-dev-workflow` `1.6.66`
- Skill: `manage-agents`

## Change

- Makes parent conversation history binary: `none` or `all`.
- Removes partial `fork_turns` guidance.

## Validation

- Codex skill quick validator: passed (`Skill is valid!`).
- Claude plugin validation: passed.
- `1.6.66` version consistency: passed.
- Binary-history scrub: passed.
- `git diff --check`: passed.
- Pressure tests were intentionally not run.

## Refresh / Reinstall

- Codex and Claude installed caches were not refreshed.
