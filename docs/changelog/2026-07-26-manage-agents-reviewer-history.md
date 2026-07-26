# Manage Agents Reviewer History

## Release

- Plugin: `shravan-dev-workflow` `1.6.65`
- Skill: `manage-agents`
- Marketplace: Claude `.claude-plugin/marketplace.json` → `1.6.65` (Codex marketplace is path-sourced; the plugin manifest owns its version)

## Change

- States directly that reviews start with no parent conversation history.
- Keeps bounded review packets, source-read permissions, and conversation history as separate controls.
- Records parent conversation history as `none` or `all` in the agent job packet.
- Maps native Codex history to exact `fork_turns` values and ACPX history to fresh or reused sessions.

## Validation

- Codex skill quick validator: passed (`Skill is valid!`).
- Claude plugin validation: passed.
- JSON manifest parsing and `1.6.65` version consistency: passed.
- Terminology and stale-token scrub: passed.
- `git diff --check`: passed.
- Pressure tests were intentionally not run for this terminology clarification.

## Refresh / Reinstall

- Codex and Claude installed caches were not refreshed.
- Refresh or reinstall `shravan-dev-workflow@ai-tools` after push when live agents must pick up `1.6.65`.
