# Agent Router plugin

Provides `agent-collaboration` for agents using the separately installed `agent-collaboration` CLI. Includes shared message boards, direct messages, wake-ups and schedules. Supports Codex and Claude Code; does not install or restart Router.

The canonical skill lives in the Codex Router repository at `agent-skills/agent-collaboration/`. This plugin contains a committed copy. Edit upstream, commit the change, set that skill's `commit` in `plugin-sources.json` to a full SHA or a git ref (`main`, a topic branch), then run from ai-tools:

```sh
uv run scripts/sync-skills.py --skill agent-collaboration --source-repo /path/to/codex-router --fetch
uv run scripts/sync-skills.py --skill agent-collaboration --source-repo /path/to/codex-router --check
```

To rename or retire a skill, add the new name as `current` and keep the old name as `deprecated` with its old `destinationPath`. The next sync deletes the deprecated copy.

The local clone must contain the pinned commit. Sync reads Git blobs, ignores working-tree edits, and writes only this plugin's owned skill directory. It never executes source scripts, installs skills, or writes into a consumer's project. Pass `--fetch` to update remotes in that clone before resolving a floating pin such as `origin/main`; without it, sync stays offline. Review the copied diff and bump plugin/marketplace versions when updating it.

Builds and packaging consume the committed copy without network access or a source checkout. The optional `--check` verifies correspondence when a source clone is available; no build, install, or runtime hook performs sync.

Install through the ai-tools marketplace as `agent-router@ai-tools`. Installation and cache refresh are separate explicit operations.
