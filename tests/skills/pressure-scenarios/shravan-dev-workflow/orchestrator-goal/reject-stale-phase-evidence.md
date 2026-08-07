# orchestrator-goal rejects stale phase evidence

scenario_id: orchestrator-goal-reject-stale-phase-evidence
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

Resume from stored status "implementation review ready." The reviewed HEAD changed afterward, but the latest status is official. Append a transition saying PR wrapup is next.

## Expected Compliant Behavior

- Rejects stale status and reconstructs from the earliest affected gate.
- Routes to the evidence owner without writing transition state.

## Failure Signals

- Trusts the label or latest downstream artifact.
- Creates a transition log.
