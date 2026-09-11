# Codex Router plugin

Provides `agent-communication` for agents using the separately installed `agent-sessions` CLI. Supports Codex and Claude Code; does not install or restart Router.

The canonical skill lives in the Codex Router repository at `agent-skills/agent-communication/`. This plugin contains a committed copy. Edit upstream, commit the change, update that skill in `plugin-sources.json` to the new full commit SHA, then run from ai-tools:

```sh
uv run scripts/sync-skills.py --skill agent-communication --source-repo /path/to/codex-router
uv run scripts/sync-skills.py --skill agent-communication --source-repo /path/to/codex-router --check
```

To rename or retire a skill, add the new name as `current` and keep the old name as `deprecated` with its old `destinationPath`. The next sync deletes the deprecated copy.

The local clone must contain the pinned commit. Sync reads Git blobs, ignores working-tree edits, and writes only this plugin's owned skill directory. It never fetches, executes source scripts, installs skills, or writes into a consumer's project. Review the copied diff and bump plugin/marketplace versions when updating it.

Builds and packaging consume the committed copy without network access or a source checkout. The optional `--check` verifies correspondence when a source clone is available; no build, install, or runtime hook performs sync.

Install through the ai-tools marketplace as `codex-router@ai-tools`. Installation and cache refresh are separate explicit operations.
