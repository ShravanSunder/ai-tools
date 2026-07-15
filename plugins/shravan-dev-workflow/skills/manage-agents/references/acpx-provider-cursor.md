# ACPX Provider: Cursor

Cursor is a multi-model ACPX provider (agent token `cursor`). It owns a catalog mapping, not a single model lineage. Use it for Grok 4.5, Composer 2.5, or any other id the user specifies. Model lineage is chosen separately; only claim a lineage when this provider advertises an exact id.

Cursor may silently resolve a bare model name. Record the exact advertised id and the chosen lineage. If usage limits remove a model, use an equivalent declared fallback or report degraded/blocked. Record config-defined overrides because the resolved command participates in session identity.
