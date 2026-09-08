# 2026-08-30 Mental Models Goes Diagram-First

Plugin: `shravan-dev-workflow` 2.4.0 → 2.5.0 (rebased over the 2.4.0 manage-agents release; originally authored as 2.2.0 → 2.3.0)

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
- Pressure scenarios: `drift-interrupt`, `map-building`, `reconverge` rewritten for the new surface; new `diagram-first-surface` scenario; new multi-turn `close-map` scenario; new `cases.ts` semantic-criteria registry (the folder moves off legacy regex evaluation, which scanned the whole JSON report rather than the user-facing surface).
- Eval harness (`tests/skills/lib/skill-pressure-evaluation/`): scenarios may now declare `followUpUserTurns` — scripted operator messages sent to the same live subject session after the first response. Every turn must return the JSON report; evaluators grade the final turn, earlier turns feed the semantic judge as conversation evidence, and per-turn prompts/responses are kept as run artifacts. This makes close-turn behavior testable.
- Manifests: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and `.cursor-plugin/plugin.json` bumped to 2.5.0.

## Design Provenance

Spec at `docs/wip/skills-authoring/2026-08-28-mental-models-diagram-first.md` (r4, accepted): two full four-lane spec-review rounds (mental-model-fit, trigger-routing, rule-agreement, depth-coverage; one lane per round on a different model lineage) plus dual-lineage delta verification.

## Validation

- `claude plugin validate .` (see entry-time results in the PR)
- `tsc --noEmit` clean and the tests/skills unit suite green (106 tests) at entry time.
- Live eval runs: all five scenarios pass with every evaluator at 1.00 (source-read gate, tool budget, deterministic contract, semantic criteria) — `drift-interrupt`, `reconverge`, `diagram-first-surface`, `map-building` (after a criterion fix: the skill routes swarm work to the work-vs-goal layout, which has no user-belief column, so the criterion no longer demands a divergence-map confirmation marker there), and the multi-turn `close-map`.
- Harness interaction note: live subject runs use the Codex adapter, so the machine-global stop-review gate can force a continuation turn that concatenates two JSON reports and fails strict transport parsing. Runs were executed with `CODEX_STOP_REVIEW_LUNA_TIMEOUT=1` so the gate fails open; this is an environment interaction, not a scenario defect.
- Named proof gaps: the multi-turn `close-map` scenario now covers close-turn behavior live — falsifier quality, verdict-before-route with the load-bearing assumption, and the renamed-term-with-old-meaning note all pass under the multi-turn harness. Remaining gaps: the single-live-branch reason has no dedicated live criterion, and a deterministic fixture pair proving the live judge ignores private evidence is still absent — the judge is a model, so that safeguard rests on the criteria's explicit scoping sentence plus live-run evidence.

## Refresh Status

Not yet refreshed into installed Codex/Claude caches at entry time; refresh is a post-merge step.
