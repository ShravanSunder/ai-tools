# 2026-07-31 User Requirements and Design Views

Plugin: `shravan-dev-workflow` 1.7.4

## What Changed

- Extended `discuss-pathfinding` with a user-requirements destination that separates direct users from affected stakeholders, evidence from row-level authority, and priority from its assigner. It writes scaled user-requirements records with stable U identifiers and captures user-job sequence inputs for later specification views.
- Extended `spec-design` with a minimum user-requirements source contract, honest decline routing, U→P→O→R→C→V traceability, and predicate-driven journey, context, and requirement-coverage views.
- Kept `program-design` structural-How-only while preserving its source-grounded call-stack/call-path analysis and moving medium/fallback mechanics out of its skill-local reference.
- Updated `spec-program-review` to run one mode-complete reviewer first, reduce before focused follow-up, and select at most one concrete focused risk by default. Every mode now includes compact reader reconstruction, requirements-fidelity comparison, deletion-first scope reduction, and applicable current/proposed call-path checks; the deeper `reader-understanding` lane remains conditional.
- Replaced artifact-digest ceremony with a current-reviewed-pair contract across review, planning admission, handoff, and routing consumers. Edits after review make affected coverage stale and route back to `spec-program-review`.
- Added `shared-references/diagram-rendering-and-fallbacks.md` as the single runtime owner for Mermaid/table/TUI/plain-text selection, exact-format override, fallback, semantic preservation, and visual checks.
- Added `docs/diagram-vocabulary.md` as a maintainer-only view/altitude/owner/consumer index.
- Added six stored pressure scenarios and a deterministic static contract suite. Model pressure execution remains deferred by explicit user direction and is not claimed as behavior proof.

## Trigger and Routing Changes

- Unwritten user/stakeholder needs and behavioral personas route to `discuss-pathfinding`.
- Adding or semantically correcting a specification's Why/What views routes to `spec-design`.
- Pure format-only maintenance of settled diagrams routes to `docs-maintain`; in-chat explanation with no artifact revision routes to `tui-presentation`; structural views remain with `program-design`.

## Validation

- The system `skill-creator` quick validator passed for `discuss-pathfinding`, `spec-design`, `program-design`, and `spec-program-review` with PyYAML supplied through the validation environment.
- `claude plugin validate .` passed.
- Four JSON manifests and all active OpenAI YAML metadata files parsed successfully.
- The deterministic skills test suite passed: 8 files and 42 tests. TypeScript validation passed with pnpm 11.8.0.
- Manual previews passed for one Markdown requirement-coverage table and one fenced plain-text call fallback. Mermaid source retained the required fields, but rendered readability was not inspected and remains an explicit gap. See [proof details](references/2026-07-31-user-requirements-design-view-proof.md).
- Full model pressure tests were not run by explicit user direction. Stored scenarios and static/manual proof do not establish runtime behavior.

## Refresh Status

- Source metadata targets `1.7.4` for Codex and Claude.
- No Codex or Claude refresh/reinstall was performed.
- Installed-cache readback remains pending and is not required for source/PR readiness.
