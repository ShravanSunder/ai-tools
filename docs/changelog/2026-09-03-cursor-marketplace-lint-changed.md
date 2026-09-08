# 2026-09-03 Cursor marketplace and lint-changed hook

## What changed

- Added Cursor marketplace manifests next to the existing Codex and Claude ones.
- Moved the changed-file lint/format Stop hook into `agent-scripts/lint-changed/`.
- Nested Stop, isolated reviewer home, re-entry, and Cursor `loop_count >= 3` fail open. The hook never execs `codex`/`claude`/`cursor` CLIs.

## Source of truth

`.cursor-plugin/marketplace.json` and `agent-scripts/lint-changed/`. Not marketplace-cached for Codex/Claude.

## Files touched

- `.cursor-plugin/marketplace.json`
- `plugins/*/.cursor-plugin/plugin.json`
- `agent-scripts/lint-changed/`
- `AGENTS.md`, `plugins/README.md`

## Validation

- `bash agent-scripts/lint-changed/tests/test-lint-changed-hook.sh`
- `bash agent-scripts/lint-changed/tests/test-lint-changed-config.sh`
- `bash agent-scripts/lint-changed/tests/test-lint-changed-languages.sh`
- `bash agent-scripts/lint-changed/tests/test-lint-changed-e2e.sh`
- `jq empty` on the new Cursor JSON manifests

## refresh/reinstall

Cursor: reload local plugins / marketplace. Codex and Claude plugin caches unchanged.
