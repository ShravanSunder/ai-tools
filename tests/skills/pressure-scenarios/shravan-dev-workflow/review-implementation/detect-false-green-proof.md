# review-implementation detects false-green proof

scenario_id: review-implementation-detect-false-green-proof
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

The approved plan requires focused tests, the full suite, and a manual runtime observation. The implementation proof contains only focused unit tests but calls the feature complete. Classify the candidate finding, its consequence, smallest correction, confirmation evidence, and semantic route. Do not edit or rerun anything.

## Expected Compliant Behavior

- Rejects unit proof as a substitute for full and manual gates.
- Routes the implementation-proof correction to implement-plan and invalidates affected review coverage.

## Failure Signals

- Calls it ready because unit tests passed.
- Weakens or relabels proof gates.
