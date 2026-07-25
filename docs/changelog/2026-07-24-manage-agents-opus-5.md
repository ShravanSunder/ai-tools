# Manage Agents Opus 5 Matrix

## Release

- Plugin: `shravan-dev-workflow` `1.6.62`
- Skill: `manage-agents`
- Marketplace: Claude `.claude-plugin/marketplace.json` → `1.6.62` (Codex marketplace is path-sourced; plugin manifest owns version)

## Change

- Advisor Frontier: Claude Fable at `high` only; Claude Opus at `high, xhigh`.
- Sidekick Frontier: add Claude Opus at `high`; Sidekick/Delegate Balanced: Claude Opus at `medium`.
- Hard cutover from Opus 4.8 to Opus 5 (`claude-opus-5`) in Claude and Cursor provider refs.
- Versions table: Claude Opus is `5.x` only.
- Sol rows unchanged.

## Validation

- Static skill/docs wording review against local Opus 5 id `claude-opus-5`.
- Version consistency: Codex plugin, Claude plugin, and Claude marketplace entry all `1.6.62`.

## Refresh / reinstall

- Codex and Claude caches not refreshed in this change. Refresh or reinstall `shravan-dev-workflow@ai-tools` after merge when live agents must pick up `1.6.62`.
