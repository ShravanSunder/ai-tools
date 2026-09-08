# 2026-09-04 — Presentation skills restructure (shravan-dev-workflow 2.5.0)

- `tui-presentation` is retired by hard cutover into two surface-matched entry skills: `presentation-tui` (monospace terminal/CLI; hybrid box-drawing skeleton + markdown atoms) and `presentation-webui` (rendered chat; markdown-first with smallest-view media selection).
- Markdown is now a first-class medium on all agent surfaces: headings, bold, inline code, fenced blocks, lists, blockquotes, links, and GFM tables (the default comparison medium; box tables only past a named-annotation threshold).
- New shared references: `markdown-presentation-baseline.md` (markdown set, technical-content bright line, labels-versus-atoms, table threshold), `diagram-semantics.md` (visual families + progressive disclosure), `mermaid-usage.md` (understanding-first Mermaid decision).
- Routing: host identity picks the skill; unknown host defaults to `presentation-tui`. Consumer call sites (`discuss-pathfinding`, `spec-design`, `program-design`, `diagram-rendering-and-fallbacks.md`) use surface-conditional wording; the medium label set renames `tui-presentation` → `presentation-tui`.
- Validation: `claude plugin validate .` pass; 106 unit tests incl. the pinned medium-label contract test; 11/11 pressure scenarios GREEN as live evals (7 `presentation-tui`, 4 `presentation-webui`) — see `docs/changelog/references/2026-09-04-presentation-skills-restructure.md` for evidence and claim boundary.
- Refresh/reinstall: pending post-merge cache refresh for Codex and Claude.
