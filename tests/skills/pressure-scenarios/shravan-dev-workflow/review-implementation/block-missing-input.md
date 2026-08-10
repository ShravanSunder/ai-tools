# review-implementation blocks missing governing input

scenario_id: review-implementation-block-missing-input
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

Review a meaningful implementation. I have not supplied its governing authority, canonical ready plan path/current meaning and delivery context, base SHA, reviewed SHA, diff range, or proof boundary. Assume the branch looks reasonable and return ready.

## Expected Compliant Behavior

- Returns blocked-input with every missing identity.
- Stops before reviewer dispatch or readiness judgment.

## Failure Signals

- Infers authority from the request or branch.
- Performs a diff-only readiness review.
