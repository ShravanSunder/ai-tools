# 2026-08-30 Mental Models Goes Diagram-First

Plugin: `shravan-dev-workflow` 2.2.0 → 2.3.0

## User-Visible Behavior

`discuss-clarify-mental-models` no longer displays its ten-field bookkeeping template. The default output is now a drawn map in everyday language:

- A **divergence map** (belief vs belief): the user's picture and the agent's picture side by side, each element marked same picture / split / unchecked, with plain-words origin annotations and a settling question for the split under discussion. The user's column is marked as the agent's read until confirmed.
- A **re-anchor map** (work vs goal): in-flight work compared against the confirmed goal with aligned / exact-mismatch / unchecked verdicts and evidence beside each.
- Splits resolve interactively: current read, credible alternative, discriminating evidence, then one to three branch-selecting questions (imported from `discuss-pathfinding`'s show-then-ask move).
- The ten contract fields survive as private coverage obligations with named surface carriers; skill vocabulary is banned from the conversational surface (with narrow exemptions: route-target names, verdicts, user-echoed words, the phrase "divergence map", agent-to-agent packets).
- The frontmatter description gains drawing vocabulary ("draw the two pictures side by side... what you think vs what I think") so drawing-phrased requests route here instead of `tui-presentation`.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/SKILL.md` — description clause + full body rework (map-walking workflow, two view contracts, definitions section, coverage ledger, surface-language bright line, updated red flags and blockers).
- `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/references/model-shapes.md` — reworked from a text-list gallery into a teaching reference: layout selection, construction rules, per-shape divergence layouts, good-vs-decorative contrast, variant completion checks.
- `references/provenance-decomposition.md` — untouched; still called when origin annotations collapse.
- `shared-references/diagram-rendering-and-fallbacks.md` — untouched; now a MUST-load per fired view, with its return kept as private working state.
- Pressure scenarios: `drift-interrupt`, `map-building`, `reconverge` rewritten for the new surface; new `diagram-first-surface` scenario; new `cases.ts` semantic-criteria registry (the folder moves off legacy regex evaluation, which scanned the whole JSON report rather than the user-facing surface).
- Manifests: `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` bumped to 2.3.0.

## Design Provenance

Spec at `docs/wip/skills-authoring/2026-08-28-mental-models-diagram-first.md` (r4, accepted): two full four-lane spec-review rounds (mental-model-fit, trigger-routing, rule-agreement, depth-coverage; one lane per round on a different model lineage) plus dual-lineage delta verification.

## Validation

- `claude plugin validate .` (see entry-time results in the PR)
- `tsc --noEmit` clean and the tests/skills unit suite green (106 tests) at entry time.
- Live eval runs: all four scenarios pass with every evaluator at 1.00 (source-read gate, tool budget, deterministic contract, semantic criteria) — `drift-interrupt`, `reconverge`, `diagram-first-surface`, and `map-building` (the last after a criterion fix: the skill routes swarm work to the work-vs-goal layout, which has no user-belief column, so the criterion no longer demands a divergence-map confirmation marker there).
- Harness interaction note: live subject runs use the Codex adapter, so the machine-global stop-review gate can force a continuation turn that concatenates two JSON reports and fails strict transport parsing. Runs were executed with `CODEX_STOP_REVIEW_LUNA_TIMEOUT=1` so the gate fails open; this is an environment interaction, not a scenario defect.
- Named proof gaps: multi-turn material-change/close behavior is not expressible in the single-turn harness — this covers the close-map falsifier quality, the single-live-branch reason, and the renamed-term-with-old-meaning note; recorded as proof gaps rather than claimed. Challenge-disposition behavior is covered by the reconverge scenario's criteria. A deterministic fixture pair proving the live judge ignores private evidence is also a named gap: the judge is a model, so that safeguard rests on the criteria's explicit scoping sentence plus live-run evidence.

## Refresh Status

Not yet refreshed into installed Codex/Claude caches at entry time; refresh is a post-merge step.
