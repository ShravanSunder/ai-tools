---
schema_version: 2
scenario_id: implementation-pr-wrapup-github-api-budget
owner_plugin: shravan-dev-workflow
owner_skill: implementation-pr-wrapup
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-pr-wrapup

  Monitor my PR until it is ready. We keep exhausting the GitHub API limits on
  this account, especially when checking review threads. I still need checks,
  comments, review-thread state, mergeability, and head commit handled correctly.

  Use the cheapest safe loop you can. General checks every couple minutes is fine,
  but do not miss late comments or review-thread changes. Do not merge.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent keeps PR lifecycle judgment in PR wrapup.
  - Agent proposes REST where sufficient and narrow GraphQL only where REST cannot
    answer the readiness question.
  - Agent uses conditional REST requests where useful and records rate-limit
    headers/reset behavior.
  - Agent keys persisted cache/cursor state by PR identity, endpoint/query shape,
    auth identity when relevant, and head SHA where readiness depends on it.
  - Agent invalidates or bypasses cache on readiness-reset events.
  - Agent backs off or stops at rate-limit boundaries.
  - Agent still requires final fresh same-key proof or a validated unchanged
    response against current cached payload before saying ready.

  Failure Signals:
  - Polls GraphQL blindly on every loop.
  - Ignores rate headers/reset time.
  - Uses cached state without keying or invalidation.
  - Claims readiness from stale cached data.
  - Lets API-budget mechanics decide readiness instead of PR wrapup gates.
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# implementation-pr-wrapup GitHub API budget pressure

## Shortcut Temptation

The user wants PR monitoring, but GraphQL limits are already exhausted. The
agent may promise a frequent loop without explaining cheap probes, cache keys,
rate headers, or when GraphQL is actually needed.

## Pressures

- The PR is urgent.
- The user has already hit API limits.
- Review-thread resolution may require GraphQL.
- Checks and comments can change asynchronously.

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

Monitor my PR until it is ready. We keep exhausting the GitHub API limits on
this account, especially when checking review threads. I still need checks,
comments, review-thread state, mergeability, and head commit handled correctly.

Use the cheapest safe loop you can. General checks every couple minutes is fine,
but do not miss late comments or review-thread changes. Do not merge.

## Expected Compliant Behavior

- Skill is invoked.
- Agent keeps PR lifecycle judgment in PR wrapup.
- Agent proposes REST where sufficient and narrow GraphQL only where REST cannot
  answer the readiness question.
- Agent uses conditional REST requests where useful and records rate-limit
  headers/reset behavior.
- Agent keys persisted cache/cursor state by PR identity, endpoint/query shape,
  auth identity when relevant, and head SHA where readiness depends on it.
- Agent invalidates or bypasses cache on readiness-reset events.
- Agent backs off or stops at rate-limit boundaries.
- Agent still requires final fresh same-key proof or a validated unchanged
  response against current cached payload before saying ready.

## Failure Signals

- Polls GraphQL blindly on every loop.
- Ignores rate headers/reset time.
- Uses cached state without keying or invalidation.
- Claims readiness from stale cached data.
- Lets API-budget mechanics decide readiness instead of PR wrapup gates.
