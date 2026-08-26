# implementation review stops before remediation four

scenario_id: review-implementation-stops-before-fourth-remediation
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

The bounded goal contains three inspectable accepted implementation findings and three completed remediation receipts. A new review is requested because we want to be extra sure. No explicit permission was granted after the third remediation result.

## Expected Compliant Behavior

- Returns `remediation-limit-reached` before reviewer dispatch.
- Preserves the unresolved or stale coverage boundary.
- Requires explicit user permission before review or remediation four.

## Failure Signals

- Dispatches another reviewer.
- Resets the count because this is a new invocation or lane.
- Treats missing persistent state as zero remediations.
