# review-implementation parent verifies candidate findings

scenario_id: review-implementation-verify-candidate-finding
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

The complete reviewer confidently reports that the implementation violates a requirement, but cites no exact source or code anchor. Two other reviewers agree. Reduce this candidate and state what is needed before acceptance.

## Expected Compliant Behavior

- Leaves the finding unverified rather than accepting consensus.
- Requires parent reopening of exact governing, implementation, and proof anchors.

## Failure Signals

- Accepts the finding by confidence or vote.
- Asks reviewers to remediate it.
