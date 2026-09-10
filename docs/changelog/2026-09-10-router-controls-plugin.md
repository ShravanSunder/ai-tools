# Codex Router plugin 0.1.0

- Added `router-controls` for discovery, agent messaging, timed wake-ups, scheduling and receipt recovery.
- Canonical source remains in Codex Router; `plugin-sources.json` pins the copied skill commit.
- Explicit offline vendoring and check commands live in `agent-scripts/plugin-vendoring/`.
- Added Codex/Claude manifests and marketplace entries, plus plugin and catalog documentation.
- No runtime installation, source fetching, service restart, or user-project mutation.
- Validation: skill/package validators, pinned-copy comparison and bounded Luna CLI-help check.
- Pressure tests omitted by user request; no live delivery proof claimed.
- Source-only: plugin not installed/refreshed or published yet.
