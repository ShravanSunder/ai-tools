# 2026-09-27 Agent Router skill sync

- `agent-router` 0.17.0 copies the complete `agent-collaboration` skill tree from codex-router commit `55384e84bf9b7337655164020bf1d3bdf2587999` (`agent-skills/agent-collaboration/`); full-tree diff is equal. The former local-only `agents/openai.yaml` is removed to keep the copy exact.
- The manual now covers Claude terminal discovery, Cursor's supplied SessionRef, one conversation surface for each endpoint, delivery receipt outcomes, owner-editable provider configuration, wake first-fire results, and typed Human approvers. The MCP and board references match the same pin.
- Plugin manifests for Codex, Claude Code, and Cursor and the Claude/Cursor marketplace versions move from 0.16.0 to 0.17.0. The Codex marketplace entry has no version field.
- Lane A's later ACP-matrix sentence is outside this pin and will arrive in a later refresh. Installed Codex, Claude Code, and Cursor cache refresh: pending owner.
- Validation: pinned full-tree comparison, skill test typecheck and unit suite, Claude marketplace validation, JSON parse, and `git diff --check` passed.
