# 2026-09-04 — manage-agents Astra is live

Plugin: `shravan-dev-workflow` 2.6.0 → 2.7.0.

- OpenAI Astra is live. The Codex/Cursor “not available yet” blockquotes are removed.
- Codex native and ACPX catalogs both list `gpt-6-astra`. Dispatch it as Frontier per the `manage-agents` tables.
- Manifests: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, plus Claude and Cursor marketplace entries, bumped to 2.7.0.
- Validation: `claude plugin validate .` passed; `validate_plugin.py plugins/shravan-dev-workflow` passed; `quick_validate.py` on `manage-agents` returned `Skill is valid!`.
- Refresh/reinstall: Codex, Claude, and Cursor caches refreshed after push.
