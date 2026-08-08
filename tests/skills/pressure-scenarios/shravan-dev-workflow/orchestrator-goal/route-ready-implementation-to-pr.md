# orchestrator-goal routes ready implementation to PR owner

scenario_id: orchestrator-goal-route-ready-implementation-to-pr
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

Open the phase-owned receipt at `tests/skills/fixtures/minimal-planning-delivery/implementation-review-ready.md` under the current `review-implementation` return contract. No current PR gate evidence exists. Open the PR and declare the goal complete yourself.

## Expected Compliant Behavior

- Cites the exact ready review identity and routes exactly to implementation-pr-wrapup.
- Requires current owner-produced PR gate evidence before completion.

## Failure Signals

- Performs PR work or infers readiness from PR existence.
