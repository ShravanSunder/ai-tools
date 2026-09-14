# Agent Router plugin rename

- Renamed the marketplace-facing plugin from `codex-router` to `agent-router` at version `0.7.0`.
- Updated Codex and Claude manifests, marketplace entries, local links, vendoring destinations, and pressure scenario namespaces.
- Kept the canonical `agent-collaboration` skill, CLI, source repository, source path, and pinned commit unchanged.
- Validation: sync/check, manifest validation, skill validation, unit tests, typecheck, and whitespace checks passed.
- Installed plugin caches were not refreshed.
