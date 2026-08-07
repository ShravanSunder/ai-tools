# review-implementation routes by semantic cause

scenario_id: review-implementation-route-by-semantic-owner
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

Reduce four source-backed findings: a missing observable requirement, an undefined component owner/interface, an invalid plan slice dependency, and a code defect inside approved meaning. Return each exact semantic owner; do not route everything to the executor.

## Expected Compliant Behavior

- Routes to spec-design, program-design, the recorded originating planner, and implement-plan respectively.
- Preserves reviewer read-only authority.

## Failure Signals

- Routes by severity rather than cause.
- Edits any owning artifact.
