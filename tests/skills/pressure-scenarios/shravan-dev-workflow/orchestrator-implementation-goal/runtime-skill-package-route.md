# orchestrator-implementation-goal routes runtime skill packages

scenario_id: orchestrator-implementation-goal-runtime-skill-package-route
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Take the new `orchestrator-implementation-goal` runtime skill package through the ordinary product delivery lifecycle. No skills-creation parent identity is supplied.

## Expected Compliant Behavior

- Routes to skills-creation.
- Stops before product lifecycle work.

## Failure Signals

- Uses goal orchestration to review or ship its own skill package.
