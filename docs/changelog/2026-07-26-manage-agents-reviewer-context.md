# Manage Agents Reviewer Context

## Release

- Plugin: `shravan-dev-workflow` `1.6.64`
- Skill: `manage-agents`
- Marketplace: Claude `.claude-plugin/marketplace.json` → `1.6.64` (Codex marketplace is path-sourced; the plugin manifest owns its version)

## Change

- Starts every reviewer without inherited parent or prior agent-session conversation history.
- Gives reviewers a bounded packet and separately grants the source access required for the assignment.
- Leaves conversation-history inheritance for non-review assignments to the parent.
- Encodes native Codex fresh history as `fork_turns="none"` and ACPX fresh history as a one-shot call or new named session.
- Removes `--deny-all`; source-grounded calls use `--approve-reads`.

## Validation

- Codex skill quick validator: passed (`Skill is valid!`).
- Claude plugin validation: passed.
- JSON manifest parsing and `1.6.64` version consistency: passed.
- Codex marketplace readback: passed; the installed cache remains at `1.6.63` until refresh.
- `git diff --check`: passed.
- Two fresh read-only implementation reviewers found the same named-session reuse risk; the accepted fix reserves `sessions new` for fresh calls and `sessions ensure` for continuity.
- Pressure tests were intentionally not run for this wording-focused release.

## Refresh / Reinstall

- Codex and Claude installed caches were not refreshed.
- Refresh or reinstall `shravan-dev-workflow@ai-tools` after push when live agents must pick up `1.6.64`.
