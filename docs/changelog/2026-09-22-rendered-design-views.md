# 2026-09-22 rendered design views

- Marketplace plugin: `shravan-dev-workflow` `2.22.0`. `2.21.0` already shipped the voice and proof slices, so this deploy bump is the rendered-view behavior.
- Affected skills: `spec-design`, `program-design`, `spec-program-review`, `orchestrator-design`, plus `diagram-rendering-and-fallbacks.md` and `generated-document-visuals.md`.
- A changed screen is an Image Gen picture grounded in the current app, or an explicit `no current UI` gap. One people-and-pain image does not cover those screens.
- Ownership, calls, state, flow, failure, and trust render as Mermaid. A text fence is a gap when Mermaid can render, not a pass.
- A generated screen sits beside that Mermaid and does not replace it. Invented controls fail inspection.
- Review and orchestrator-design reject a text-fence pass and a single image standing in for every changed screen.
- Static registry check passed. New pressure scenarios were not run against a model. Installed caches were not refreshed.
