# 2026-08-02 GH watch cadence defaults

## Plugin

- Marketplace-facing plugin: `shravan-dev-workflow`
- Version: `1.7.8`

## User-visible behavior

- PR monitoring defaults to a 120-second cadence.
- Slow jobs or systems that require a slower cadence use 240 seconds.
- Blocking `gh pr checks --watch` and `gh run watch` examples use the same defaults.
- The previous 30-60-second active-window exception is removed.

## Affected surfaces

- `implementation-pr-wrapup/references/monitor-loop.md`
- `implementation-pr-wrapup/references/github-pr-state.md`
- `.codex-plugin/plugin.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- Source and manifest versions were updated to `1.7.8`.
- Installed cache refresh/reinstall was not performed in this change.
