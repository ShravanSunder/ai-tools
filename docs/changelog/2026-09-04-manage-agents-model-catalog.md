# 2026-09-04 — manage-agents model catalog and Advisor permission

Plugin: `shravan-dev-workflow` 2.5.0 → 2.6.0.

- `manage-agents` pattern tables: Frontier is Astra and Fable 5.1 (`medium`/`high`); Balanced is Sol (`low`/`medium`), Opus (`high`), Grok 4.6 (`medium`/`high`); Mini is Luna. Terra and Composer are out of the runtime tables. Delegates are Balanced or Mini only; Operators are Luna `high`/`xhigh` only.
- Advisor is Frontier guidance only after the user permits it. If they decline or are unavailable, use a Sidekick. Multi-component Frontier judgment is an Advisor or Sidekick, not a Delegate.
- Skill description now starts `Always load to manage subagents.`
- Codex/Cursor ACPX: Astra id stays in the Codex catalog with a blockquote that it is not available yet and must not be dispatched. Fable ACP id is `claude-fable-5-1`. Cursor prefers `grok-4.6[effort=high,fast=false]` and Luna; Fable on request.
- Manifests: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, plus Claude and Cursor marketplace entries, bumped to 2.6.0.
- Pressure scenarios under `tests/skills/pressure-scenarios/.../manage-agents/` still encode the prior Sol-high=Frontier and Composer Mini matrix; they were not updated in this release.
- Validation: `claude plugin validate .` passed; `validate_plugin.py plugins/shravan-dev-workflow` passed; `quick_validate.py` on `manage-agents` returned `Skill is valid!`; `codex plugin list --marketplace ai-tools --available --json` still reports installed `2.5.0` until refresh. Live Astra ids were not tested.
- Refresh/reinstall: pending until Codex/Claude/Cursor plugin caches refresh.
