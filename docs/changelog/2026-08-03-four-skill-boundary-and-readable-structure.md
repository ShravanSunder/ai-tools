# 2026-08-03 Four-Skill Boundary And Readable Structure

Plugin: `shravan-dev-workflow` 1.7.10

## User-visible behavior

- Makes Requirements the goal boundary, `spec-design` the observable contract, and `program-design` the structural realization. Missing owner meaning returns through `discuss-pathfinding`; neither downstream skill may silently expand the confirmed boundary.
- Makes pathfinding group related questions into coherent decision topics, explain meaningful choices in ordinary language, and use compact conversational diagrams when they clarify a boundary, owner, choice, or sequence.
- Requires program design to explain concrete tradeoffs, preserve current-to-proposed call paths, separate diagrams by reader question when one view would hide meaning, and obtain confirmation for the current structural realization.
- Requires `spec-program-review` to validate findings before routing them, return mixed observable-and-structural corrections through `spec-design` first, keep caller decisions with the caller, compare proof with what it can actually observe, and write actionable findings without unexplained review jargon.
- Preserves the existing typed Vitest evaluation harness: Luna-high subjects execute once per scenario, deterministic checks inspect observable facts, Terra-medium judges semantic quality, and Vitest limits concurrent scenarios to eight.

## Changed surfaces

- `discuss-pathfinding`, `spec-design`, `program-design`, and `spec-program-review` skill instructions and directly owned references.
- The 20 pressure scenarios and their typed evaluator registries for boundary preservation, related-question grouping, useful explanation, diagrams, proof quality, and semantic correction routing.
- Codex and Claude plugin manifests plus Claude marketplace metadata.

## Validation

- Skill-harness unit tests pass 82 tests across 16 files; TypeScript type checking and `git diff --check` pass.
- Focused Luna-high/Terra-medium scenarios exercise each changed skill. Full four-skill results and manual artifact inspection are recorded in the pull-request review cycle.

## Refresh / reinstall

- Source metadata targets `shravan-dev-workflow` 1.7.10.
- Local Codex and Claude caches are not refreshed by this source change.
