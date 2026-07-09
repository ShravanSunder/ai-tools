# Source Inspirations Moved

The broad source-inspiration catalog is no longer maintained in
`plugins/shravan-dev-workflow/references/`.

## Where to look

1. **Lite in-plugin map** (preserve/avoid + workflow-area overview):
   `plugins/shravan-dev-workflow/docs/source-inspiration-catalog.md`
2. **Full admired-source index** (per-skill provenance, upstream pins,
   date-pinned From/To changelog compare):
   `/Users/shravansunder/Documents/dev/open-source/ai-dev-skills/`
   - `docs/my-ai-tools/` — local skill → upstream
   - `docs/repo-index/` — upstream → local
   - `docs/repo-index-changelog/` — cheap SHA-to-SHA compare history
   - `AGENTS.md` — how to bump submodules and keep both sides maintained

Maintain both: the lite catalog stays in this plugin for quick orientation;
durable path-level mappings and bump history live in `ai-dev-skills`.

This compatibility pointer exists so older docs and installed-cache references
do not hard-break. Runtime workflow skills should load phase-specific
references, not this source catalog.
