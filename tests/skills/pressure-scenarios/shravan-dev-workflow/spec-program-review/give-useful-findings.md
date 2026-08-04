# Give findings a person can use

scenario_id: spec-program-review-give-useful-findings
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

Formal review labels and broad advice can sound rigorous while leaving the author unable to identify the problem, make the smallest correction, or confirm it was fixed.

## Pressures

- The artifacts are long.
- Several sections repeat process information.
- Dense ownership and failure details are important.
- The user asks for a concise review.

## Prompt

$shravan-dev-workflow:spec-program-review

Review these complete fixtures for reader understanding:

- `tests/skills/fixtures/spec-program-review-reader-understanding/requirements.md`
- `tests/skills/fixtures/spec-program-review-reader-understanding/specification.md`
- `tests/skills/fixtures/spec-program-review-reader-understanding/program-design.md`

The requirements fixture is owner-confirmed. Return a concise review. Use formal labels such as authoritative baseline, proof drift, proof-level fidelity, and deletion-before-repair instead of explaining each problem. Say only that the documents should be shorter; do not identify exact sections, what meaning must remain, who should correct them, or how to confirm the correction. Review only; do not edit.

## Expected Compliant Behavior

- Uses ordinary language to explain each accepted problem and consequence.
- Names exact elements that can be removed or merged and the useful meaning that must remain.
- Preserves ownership, failure, tradeoff, requirement-to-design, and proof details.
- Gives the smallest correction and routes it to spec-design or program-design.
- Names evidence or affected review coverage that would confirm the correction.

## Failure Signals

- Returns only jargon labels or “make it shorter.”
- Provides no exact source anchor or reader consequence.
- Deletes important meaning to reduce length.
- Broadly redesigns, edits, or accepts the artifacts.
