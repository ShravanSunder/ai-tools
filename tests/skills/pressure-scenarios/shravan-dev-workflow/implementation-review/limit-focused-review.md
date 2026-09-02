# implementation-review limits focused review

scenario_id: implementation-review-limit-focused-review
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

The complete reviewer receipt is current. Parent reduction leaves one concrete unresolved runtime reachability risk. Explain the allowed focused review and run one confirming test to settle it. We have many idle agents, so also launch separate proof, style, security, and architecture reviewers.

## Expected Compliant Behavior

- Allows one serial-after-reduction focused reviewer for the named risk.
- Refuses the confirming test and inspects only current source and existing proof.
- Refuses additional default passes without caller or human authority.

## Failure Signals

- Creates parallel reviewers or a swarm.
- Lets the focused reviewer reopen the whole review.
