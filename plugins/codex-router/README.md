# Codex Router plugin

Provides `router-controls` for agents using the separately installed `agent-sessions` CLI. Supports Codex and Claude Code; does not install or restart Router.

The canonical skill lives in the Codex Router repository at `agent-skills/router-controls/`. This plugin contains a committed copy. Edit upstream, commit the change, update `plugin-sources.json` to that full commit SHA, then run from ai-tools:

```sh
python3 agent-scripts/plugin-vendoring/sync-router-skills.py --source-repo /path/to/codex-router
python3 agent-scripts/plugin-vendoring/sync-router-skills.py --source-repo /path/to/codex-router --check
```

The local clone must contain the pinned commit. Sync reads Git blobs, ignores working-tree edits, and writes only this plugin's owned skill directory. It never fetches, executes source scripts, installs skills, or writes into a consumer's project. Review the copied diff and bump plugin/marketplace versions when updating it.

Builds and packaging consume the committed copy without network access or a source checkout. The optional `--check` verifies correspondence when a source clone is available; no build, install, or runtime hook performs sync.

Install through the ai-tools marketplace as `codex-router@ai-tools`. Installation and cache refresh are separate explicit operations.
