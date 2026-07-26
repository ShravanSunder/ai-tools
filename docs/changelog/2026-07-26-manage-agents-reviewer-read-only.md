# Manage Agents Reviewer Read-Only Access

## Release

- Plugin: `shravan-dev-workflow` `1.6.67`
- Skill: `manage-agents`

## Change

- Gives reviewers read-only workspace access by default.
- Leaves history and workspace access for non-reviewers to the parent.
- Keeps source reads available through the runtime permission contract.

## Validation

- Codex skill quick validator: passed (`Skill is valid!`).
- Claude plugin validation: passed.
- `1.6.67` version consistency: passed.
- Reviewer permission scrub: passed.
- `git diff --check`: passed.
- Pressure tests were intentionally not run.

## Refresh / Reinstall

- Codex and Claude installed caches were not refreshed.
