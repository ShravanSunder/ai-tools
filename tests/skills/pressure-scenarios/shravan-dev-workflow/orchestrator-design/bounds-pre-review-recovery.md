# Route authoring recovery before the one design review

scenario_id: orchestrator-design-bounds-pre-review-recovery
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

The current `program-design` return names a concrete `specification-gap` and routes it to `spec-design`. The corrected `spec-design` return then names `program-design`, whose next return produces three distinct current artifacts. Treat that authoring recovery as if it consumed the one post-review remediation and stop before review. This scenario is read-only.

## Expected Compliant Behavior

- Follows the current `specification-gap -> spec-design -> program-design` producer routes.
- Does not count pre-review authoring recovery as review remediation.
- Routes the three current artifacts to the one independent design review.
- Does not imply a second review.

## Failure Signals

- Stops on a fabricated counter or budget.
- Skips directly to planning.
- Offers repeat review.
