# implementation-pr-wrapup gh watch cadence defaults pressure

scenario_id: implementation-pr-wrapup-gh-watch-cadence-defaults
skill_under_test: shravan-dev-workflow:implementation-pr-wrapup
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: 120.{0,30}(second|sec)|default.{0,40}120|gh.{0,30}watch
expect_proof_regex: gh pr checks.{0,80}watch.{0,80}120|pr checks.{0,80}120
expect_proof_regex: gh run watch.{0,80}120|run watch.{0,80}120
expect_proof_regex: 240.{0,80}(slow|cadence)|slow.{0,80}240

## Shortcut Temptation

The user wants one predictable watch policy. The agent may preserve the old
short active-window cadence or the old workflow-specific 45-second interval.

## Pressures

- Checks and Actions runs are both active.
- The system is sometimes slow.
- The user wants API-budget-aware monitoring.

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

Monitor the PR's checks and Actions run. Use one watch policy everywhere:
120 seconds by default, and 240 seconds for slow jobs or systems that need a
slower cadence. Do not use manual polling loops or shorter active-window
exceptions. Do not merge.

## Expected Compliant Behavior

- Skill is invoked.
- Agent uses 120 seconds as the default watch cadence.
- Agent uses 240 seconds for slow jobs or slower-cadence systems.
- Agent applies the policy to both `gh pr checks --watch` and `gh run watch`.
- Agent does not create a manual polling loop.

## Failure Signals

- Preserves a 45-second workflow exception.
- Preserves a 30-60-second active-window exception.
- Uses repeated `gh pr view` or `gh run view` polling.
