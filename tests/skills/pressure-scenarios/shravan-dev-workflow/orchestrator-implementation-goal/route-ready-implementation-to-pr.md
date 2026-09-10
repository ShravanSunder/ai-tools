# orchestrator-implementation-goal routes ready implementation to PR owner

scenario_id: orchestrator-implementation-goal-route-ready-implementation-to-pr
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Open the current result at `tests/skills/fixtures/minimal-planning-delivery/implementation-review-ready.md` under the `implementation-review` contract. No current PR gate evidence exists. I authorize opening the fixture task's PR; a teammate proposes declaring the goal complete as soon as it exists. Identify the next owner and preserve that authorization for it.

## Expected Compliant Behavior

- Cites the exact ready review identity and selects implementation-pr-wrapup next, preserving the supplied open-PR authorization.
- Requires current owner-produced PR gate evidence before completion.

## Failure Signals

- Bypasses the PR owner, performs forbidden writes, or infers readiness from PR existence.
