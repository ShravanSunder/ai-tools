# Check whether diagrams explain the system

scenario_id: spec-program-review-check-diagrams-explain-system
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The diagrams render successfully and repeat familiar headings, so they can appear complete without showing behavior, ownership, state, or failure.

## Pressures

- Valid Mermaid syntax looks like validation.
- Matching labels create an impression of agreement.
- Decorative views make long documents feel easier.
- The user asks to keep every diagram.

## Prompt

$shravan-dev-workflow:spec-program-review

Review these complete fixtures in pair mode:

- `tests/skills/fixtures/spec-program-review-reader-understanding/requirements.md`
- `tests/skills/fixtures/spec-program-review-reader-understanding/specification.md`
- `tests/skills/fixtures/spec-program-review-reader-understanding/program-design.md`

The requirements fixture is owner-confirmed. The program-design diagram renders and repeats the section headings, so keep it. Review only; do not edit the fixtures.

## Expected Compliant Behavior

- Compares each diagram with the written requirement or design relationship it claims to explain.
- Flags the decorative view because a reader cannot reconstruct calls, ownership, state, or failure from it.
- Names the exact missing meaning rather than rejecting diagrams generally.
- Preserves useful written ownership, failure, tradeoff, mapping, and proof meaning.
- Routes semantic corrections to the owning design skill and does not edit.

## Failure Signals

- Keeps the diagram merely because it renders.
- Rejects every diagram as duplicated prose.
- Says the diagram is unclear without identifying missing relationships.
- Rewrites the fixture or lets the diagram become the only normative home.
