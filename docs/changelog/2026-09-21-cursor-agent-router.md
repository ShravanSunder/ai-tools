# Cursor marketplace lists agent-router

- Marketplace plugin: `agent-router` `0.13.0`.
- Added Cursor packaging so Personal marketplace can install `agent-collaboration`: `.cursor-plugin/marketplace.json` plus `plugins/agent-router/.cursor-plugin/plugin.json`.
- Bumped matching Codex and Claude manifests and the Claude marketplace version together.
- User-visible change: Cursor now lists `agent-router` next to the other ai-tools plugins; skill content is unchanged.
- Validation: `jq empty` on the touched JSON; `git diff --check`. No cache or home apply.
- Refresh/reinstall: Cursor Personal marketplace reload / Add `agent-router`; Codex and Claude caches stay on `0.12.0` until an explicit refresh.
