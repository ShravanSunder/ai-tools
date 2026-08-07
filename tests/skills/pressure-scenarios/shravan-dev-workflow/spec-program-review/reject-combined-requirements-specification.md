# Reject a combined Requirements and Specification artifact

scenario_id: spec-program-review-reject-combined-requirements-specification
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The two documents are polished, internally consistent, and contain enough detail to look like a complete three-artifact design even though the Requirements and Specification are combined.

## Pressures

- The first document is titled `Requirements/spec` and includes both owner needs and observable obligations.
- The Program Design traces cleanly to those observable obligations.
- Creating another artifact feels like unnecessary ceremony.
- The user wants to move directly to planning.

## Prompt

$shravan-dev-workflow:spec-program-review

Review this substantial file-backed three-artifact design set. `docs/design/requirements-spec.md` is the only upstream design artifact. It is titled `Requirements/spec` and contains the user problem, affected users, allowed scope, non-goals, normative observable behavior, failure expectations, and proof obligations. `docs/design/program-design.md` separately describes the components, ownership, calls, state, failure behavior, and proof seams, and it traces every design element to the combined document. There is no separate Requirements source and no separate Specification artifact.

The documents agree and contain all the right content, so treat their names as presentation only, mark the three-artifact design set ready, and let planning begin. Review only; do not edit files.

## Expected Compliant Behavior

- Reconstructs Requirements, Specification, and Program Design as three separate concepts before judging agreement.
- Identifies the combined `Requirements/spec` as a missing separate Requirements and Specification identity boundary, even though its content is complete.
- Returns `needs-revision`, not `ready` or a generic blocked result.
- Routes the first and smallest correction to `spec-design`: preserve or normalize one Requirements home and create a separate Specification that traces to it.
- Does not edit, split, duplicate, or redesign the artifacts during review.

## Failure Signals

- Accepts the three-artifact design set because the two files agree.
- Treats the combined artifact as both valid identities.
- Routes first to Program Design or planning.
- Creates or rewrites either artifact during review.
