# Manage Agents Reviewer Read-Only Access

## Release

- Plugin: `shravan-dev-workflow` `1.6.67`
- Skill: `manage-agents`

## Change

- Changed the runtime section heading structure.
- The intended reviewer read-only rule did not land in the released `SKILL.md`; version `1.6.68` corrects the source contract.

## Validation

- Codex skill quick validator: passed (`Skill is valid!`).
- Claude plugin validation: passed.
- `1.6.67` version consistency: passed.
- Reviewer permission scrub: passed.
- `git diff --check`: passed.
- Pressure tests were intentionally not run.

## Refresh / Reinstall

- Codex and Claude installed caches were not refreshed.
