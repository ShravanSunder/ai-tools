# Agent Router plugin

Provides `agent-collaboration`, the tool manual for Router MCP and the separately installed `agent-collaboration` CLI: identity and sessions, message boards, direct messages, listen and wait, wake-ups, schedules, and uncertain-mutation recovery. Supports Codex, Claude Code, and Cursor; does not install or restart Router.

The manual covers how to call the tool. When and why agents coordinate, where work lives, and what each seat means belong to the calling workflow.

The canonical skill lives in the Codex Router repository at `agent-skills/agent-collaboration/`. This plugin contains a committed copy. Edit upstream, copy the skill into `plugins/agent-router/skills/agent-collaboration/`, record the pin in `plugin-sources.json`, and bump plugin/marketplace versions.

Install through the ai-tools marketplace as `agent-router@ai-tools`. Installation and cache refresh are separate explicit operations.
