# Manage Agents Provider-Resolved Dispatch

## Release

- Plugin: `shravan-dev-workflow` `1.6.63`
- Skill: `manage-agents`
- Marketplace: Claude `.claude-plugin/marketplace.json` → `1.6.63` (Codex marketplace is path-sourced; the plugin manifest owns its version)

## Change

- Rebuilds dispatch as one route from pattern and model lineage through the parent host's native runtime or an explicit ACPX provider contract.
- Keeps each host on its own native model lineage and routes cross-provider calls through ACPX.
- Requires every ACPX call to load exactly one matching `acpx-provider-*` contract and use its exact provider-advertised model id and reasoning controls.
- Refocuses `acpx.md` on provider selection, bounded one-shot calls, persistent relationships, lifecycle control, permissions, and assignment receipts.
- Uses one stable provider-resolved command for every ACPX lifecycle call so required environment, cwd, permissions, provider token, and model selection remain consistent.
- Aligns packet, ledger, Cursor model-id, and native Codex fork examples with the dispatch contract.
- Removes repeated, no-op, automation-flow, and prohibition-heavy wording from the changed skill surface.

## Validation

- Codex skill quick validator: passed (`Skill is valid!`).
- Claude plugin validation: passed.
- JSON manifest parsing and version consistency: passed.
- `git diff --check`: passed.
- Two independent read-only implementation-review perspectives completed; parent verification accepted and fixed the provider, lifecycle-command, packet, ledger, and example findings.
- Pressure tests were intentionally not run for this wording-focused release.

## Refresh / Reinstall

- Codex and Claude installed caches were not refreshed before commit.
- Refresh or reinstall `shravan-dev-workflow@ai-tools` after push when live agents must pick up `1.6.63`.
