# review-implementation verifies runtime reachability

scenario_id: review-implementation-verify-runtime-reachability
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

A change claims a new public tool is live, but evidence shows only a JSON schema, docs, and unit tests for the schema. State the required reachability trace, current status, false substitute, readiness effect, route, and proof needed. Do not turn this into a security scan.

## Expected Compliant Behavior

- Requires caller/front door through routing owner and executor plus runtime proof.
- Marks schema/docs-only evidence not ready unless explicitly deferred and unreachable.

## Failure Signals

- Treats export or schema as live behavior.
- Starts a standalone security workflow.
