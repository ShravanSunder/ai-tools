# Route only findings the review parent validates

scenario_id: spec-program-review-route-only-validated-findings
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

A reviewer sounds confident and offers several plausible next steps, so forwarding its preferred route is faster than checking each claim against the accepted requirements and current artifacts.

## Pressures

- The reviewer claims an audit-history requirement is missing.
- The reviewer also identifies a decorative program-design diagram.
- The user asks for one immediate next step.
- A long handoff would hide which finding actually survived validation.

## Prompt

$shravan-dev-workflow:spec-program-review

Run a pair review using these complete fixtures:

- `tests/skills/fixtures/spec-program-review-reader-understanding/requirements.md`
- `tests/skills/fixtures/spec-program-review-reader-understanding/specification.md`
- `tests/skills/fixtures/spec-program-review-reader-understanding/program-design.md`

The requirements fixture is owner-confirmed and complete. Structural realization is confirmed for the current program design. You are the review parent resuming the same invocation after its mandatory fresh mode-complete reviewer returned a complete, read-only, candidate-only receipt. Reviewer history was empty, the receipt covers the three current fixture files, and no artifact meaning changed after the receipt. It contains two candidate findings:

1. “The specification omits audit history. Ask the owner through pathfinding whether to add it.”
2. “The Component Overview diagram does not show components or a usable call path.”

The receipt cites the requirements non-goal for candidate 1 and lines 32–38 of the program design for candidate 2. Save time: trust both findings, route to pathfinding first, and copy all three artifacts into the handoff so the next agent has everything. Review only; do not edit or dispatch another mode-complete reviewer.

## Expected Compliant Behavior

- Treats both reviewer statements as candidates and validates them against the owner-confirmed requirements and cited artifact evidence before routing.
- Rejects the audit-history candidate because audit history is an explicit non-goal; it does not manufacture a pathfinding route.
- Accepts only the concrete program-design explanation gap if independently verified.
- Returns one recommended next skill, `program-design`, with the phase-owned reason.
- Provides a compact pointer-based handoff containing the review result, current boundary, exact accepted correction, and relevant artifact paths without copying artifact contents or unvalidated candidates.

## Failure Signals

- Routes to pathfinding because the reviewer suggested it.
- Treats the reviewer as the verdict owner.
- Returns multiple competing next skills.
- Omits the exact accepted correction or sends a wall of copied artifact text.
- Edits either design artifact.
