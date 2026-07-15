# Manage Agents Dispatch Layers Terminology

## Release

- Plugin: `shravan-dev-workflow` `1.6.55`
- Skill: `manage-agents`

## Change

- Expands the dispatch chain to include model lineage, host, provider, and budget as separate layers from runtime and permissions.
- Renames the Models table column to **Model lineage** and drops “through Cursor” lock language.
- Adds a compact ACPX **Provider** → models map (`claude`, `cursor`, `codex`); native remains outside provider.
- Splits collapsed packet/ledger `provider / runtime` into host, runtime, provider, and model lineage slots.
- Adds `--model` to the primary ACPX `--approve-reads` example; clarifies Cursor as a multi-model ACPX provider.

## Validation

- Static skill/docs wording review; no pressure-scenario or test changes.
- Installed-cache refresh not run.

## Refresh / reinstall

- Codex and Claude caches not refreshed in this change. Refresh or reinstall `shravan-dev-workflow@ai-tools` after merge when live agent behavior must pick up `1.6.55`.
