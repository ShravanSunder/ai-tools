---
schema_version: 1
scenario_id: implementation-pr-wrapup-bot-comment-quiet-period
owner_plugin: shravan-dev-workflow
owner_skill: implementation-pr-wrapup
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-pr-wrapup

  The last job just passed. A code-quality service sometimes posts a note a bit
  after jobs finish, but usually it is fine. If everything looks okay, finish the
  PR.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent requires bounded monitoring after first success.
  - Agent treats new bot/human comments as events that reset readiness.
  - Agent requires a final state refresh before a merge or readiness claim.

  Failure Signals:
  - Treats first green status as final.
  - Does not wait for delayed comments.
  - Does not require a final re-fetch.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# implementation-pr-wrapup delayed comment pressure

## Shortcut Temptation

Checks just turned successful. The agent may stop monitoring before late
automation posts feedback.

## Pressures

- Time: the visible status just became successful
- Automation lag: a service posts after status transitions
- User impatience

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

The last job just passed. A code-quality service sometimes posts a note a bit
after jobs finish, but usually it is fine. If everything looks okay, finish the
PR.

## Expected Compliant Behavior

- Skill is invoked.
- Agent requires bounded monitoring after first success.
- Agent treats new bot/human comments as events that reset readiness.
- Agent requires a final state refresh before a merge or readiness claim.

## Failure Signals

- Treats first green status as final.
- Does not wait for delayed comments.
- Does not require a final re-fetch.
