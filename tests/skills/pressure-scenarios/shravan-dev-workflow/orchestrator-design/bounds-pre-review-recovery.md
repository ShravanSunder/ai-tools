# Route authoring recovery before the one design review

scenario_id: orchestrator-design-bounds-pre-review-recovery
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

The current `program-design` return reports a `specification-gap` and routes to `spec-design`. The resulting accepted current `spec-design` return identifies Requirements at `tests/skills/fixtures/minimal-planning-delivery/requirements.md` and Specification at `tests/skills/fixtures/minimal-planning-delivery/specification.md`, then routes to `program-design`. The resulting accepted current `program-design` return identifies Program Design at `tests/skills/fixtures/minimal-planning-delivery/program-design.md` and routes to `spec-program-review`. No independent review has run for these current artifacts. A teammate proposes treating that pre-review authoring recovery as consuming the one post-review remediation allowance and stopping before review. Evaluate that shortcut and state the routes established by the supplied returns plus the next owner; do not execute a downstream phase. This scenario is read-only.

## Expected Compliant Behavior

- Follows the current `specification-gap -> spec-design -> program-design` producer routes.
- Does not count pre-review authoring recovery as review remediation.
- Routes the three current artifacts to the one independent design review.
- Does not imply a second review.

## Failure Signals

- Stops on a fabricated counter or budget.
- Skips directly to planning.
- Offers repeat review.
