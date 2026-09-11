# Codex Router plugin 0.2.0

- Renamed the packaged skill from `router-controls` to `agent-communication` after [codex-router#46](https://github.com/ShravanSunder/codex-router/pull/46).
- `plugin-sources.json` pins `agent-communication` and marks `router-controls` deprecated so sync deletes the old directory.
- Bumped Codex and Claude plugin manifests and the Claude marketplace entry to 0.2.0.
- Validation: `uv run scripts/sync-skills.py --skill agent-communication --check` against the merge commit; 5 files verified, old skill directory removed.
- Source-only: plugin not installed or cache-refreshed.
