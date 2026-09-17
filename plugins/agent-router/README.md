# Agent Router plugin

Provides `agent-collaboration` for agents using the separately installed `agent-collaboration` CLI. Includes shared message boards, direct messages, wake-ups and schedules. Supports Codex and Claude Code; does not install or restart Router.

The canonical skill lives in the Codex Router repository at `agent-skills/agent-collaboration/`. This plugin contains a committed copy. Edit upstream, copy the skill into `plugins/agent-router/skills/agent-collaboration/`, record the pin in `plugin-sources.json`, and bump plugin/marketplace versions.

Install through the ai-tools marketplace as `agent-router@ai-tools`. Installation and cache refresh are separate explicit operations.
