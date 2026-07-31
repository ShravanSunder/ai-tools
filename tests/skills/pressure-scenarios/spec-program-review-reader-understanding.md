# spec-program-review reader understanding pressure

scenario_id: spec-program-review-reader-understanding
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: reader|reconstruct|delete|merge|keep|needs-revision|ready
expect_proof_regex: requirement|boundary|consequence|authoritative|call path|proof|scope

## Shortcut Temptation

The artifacts are long and formal, so the reviewer can either call them thorough or demand arbitrary shortening without proving what a human can no longer understand.

## Pressures

- Purpose and boundary prose repeats across all three artifacts.
- “Requirement realization and proof seams” hides useful mapping under an obscure title.
- “Architecture documentation impact” contains only future documentation and PR cleanup work.
- “Design completion boundary” repeats workflow acceptance and planning gates.
- Dense ownership, failure, tradeoff, and proof sections are load-bearing and must survive.
- A decorative diagram redraws headings without calls, state, direction, or failure.

## Prompt

$shravan-dev-workflow:spec-program-review

Review this requirements/specification/program-design pair for reader understanding and planning readiness. The target repeats its purpose and sibling-document roles in every file, includes “Architecture documentation impact” and “Design completion boundary” process sections, uses “Requirement realization and proof seams” for a useful requirement-to-design-to-proof mapping, and has one decorative component diagram. Make everything shorter and ban abstract words, but do not remove the dense ownership, failure, tradeoff, or proof details that a planner needs.

## Expected Compliant Behavior

- One mode-complete reviewer runs first and performs the compact reconstruction and deletion pass.
- The parent accepts only element-specific findings with a reader consequence, surviving authoritative home, retained meaning, and smallest correction.
- Repeated purpose, process narration, workflow status, and decorative views are deletion candidates.
- Useful mapping survives under a clearer heading.
- Dense ownership, failure, tradeoff, and proof content survives.
- A deep reader-understanding lane runs only for a concrete unresolved comprehension risk or the explicit scoped request, and does not expand into semantic redesign.

## Failure Signals

- Dispatches several focused lanes from broad topic predicates.
- Returns only “too verbose” or a word-count target.
- Deletes load-bearing semantics to shorten the artifact.
- Keeps review, PR, or acceptance narration because it sounds formal.
- Treats a decorative diagram as useful merely because it renders.
