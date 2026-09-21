# Router collaboration skill main pin

- Bumped `agent-router` to `0.12.0` and pinned canonical collaboration guidance to Router `main`.
- Vendored the current `main` skill: Always-use CLI/MCP routing, named help and MCP schemas, and the shared board reference.
- `plugin-sources.json` now uses the `main` ref instead of a frozen SHA.
- Preserved vendor-only `agents/openai.yaml`.
- Independent review was waived for user PR review; pressure testing remains deferred.
- Validation: canonical/vendor equality excluding `agents/`, JSON parse, and `git diff --check`. No cache or home apply. Runtime behavior is unverified.
