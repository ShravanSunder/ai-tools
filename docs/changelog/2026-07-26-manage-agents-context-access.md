# Manage Agents Context And Access

## Release

- Plugin: `shravan-dev-workflow` `1.6.68`
- Skill: `manage-agents`

## Change

- Separates parent conversation history from workspace access.
- Reviewers use no parent conversation history and read-only workspace access.
- Non-reviewer values are selected by the parent.
- Records both controls in the agent job packet.
- Maps ACPX access to permission flags and native Codex read-only access to packet scope plus worktree verification.
- Removes provider wording that allowed reviewer write approval.

## Validation

- Two-vector source readback: passed.
- Codex skill quick validator: passed (`Skill is valid!`).
- Claude plugin validation: passed.
- `1.6.68` version consistency: passed.
- Contradiction scrub: passed.
- `git diff --check`: passed.
- Pressure tests were intentionally not run.

## Refresh / Reinstall

- Codex and Claude installed caches were not refreshed.
