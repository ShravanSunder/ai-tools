---
schema_version: 1
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
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: rate|limit|backoff|conditional|etag|rest|graphql
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: rest-first|rest first|rest.{0,40}sufficient|use rest
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: conditional.{0,30}request|etag|if-none-match|304
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: rate.{0,20}header|x-ratelimit|reset|remaining
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: backoff|reset boundary|wait.{0,40}reset|stop.{0,40}limit|rate limits.{0,120}stop|api limits.{0,120}stop|if rate limits|if api limits
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: graphql.{0,60}(narrow|sparingly|only|review-thread|thread resolution)
  - check_id: proof-6
    fact: visible_response
    operator: matches
    expected: cache.{0,90}(owner/repo|pr number|endpoint|query|head sha|auth|pagination|cursor|variables|per_page)|key.{0,90}(owner/repo|pr number|endpoint|query|head sha|auth|pagination|cursor|variables|per_page)
  - check_id: proof-7
    fact: visible_response
    operator: matches
    expected: invalidate|bypass cache|head sha changes|new comments|check restarts|unknown mergeability
  - check_id: proof-8
    fact: visible_response
    operator: matches
    expected: final.{0,30}re-fetch|fresh.{0,40}proof|304.{0,40}cached payload
  - check_id: proof-9
    fact: visible_response
    operator: matches
    expected: rate-limit.{0,80}not.{0,80}(readiness[- ]reset|pr readiness)|not.{0,80}pr readiness.{0,80}reset|api-budget event
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
