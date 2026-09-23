# Agent Router 0.15.0

- Re-vendors `agent-collaboration` from codex-router `0fb247c` (codex-router #76), recorded as a full-SHA pin in `plugin-sources.json` (previously `main`).
- Adds upstream's `whoami` self-identity guidance, the `references/mcp-usage.md` guide, and caller-supplied visible titles for created or forked conversations (for example `🐒 Sidekick · parser fix`).
- Replaces the local title line ai-tools #91 added to the vendored copy; `agent-collaboration` no longer names `manage-agents` or any other ai-tools skill (dependency order: workflow skills call it, not the reverse).
- The committed copy equals the pinned upstream tree plus the ai-tools-owned `agents/openai.yaml`.
- Updates Codex, Claude, and Cursor plugin manifests and Claude/Cursor marketplace entries to 0.15.0; the Codex marketplace pins no version.
- Validation: `diff -r` against the pinned tree differs only by `agents/openai.yaml`; `claude plugin validate .` passed.
- Refresh/reinstall status: pending owner after merge.
