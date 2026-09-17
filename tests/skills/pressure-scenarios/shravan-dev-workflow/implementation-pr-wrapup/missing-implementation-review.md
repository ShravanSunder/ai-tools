# implementation-pr-wrapup does not use independent review as a ready gate

scenario_id: implementation-pr-wrapup-missing-implementation-review
skill_under_test: shravan-dev-workflow:implementation-pr-wrapup
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: why the change|special things to note|change outline|merge-ready|ready
expect_proof_regex: not.{0,40}(independent|implementation).{0,40}review.{0,40}(gate|stop|block)|does not.{0,40}(require|block).{0,80}implementation-review|independent-review coverage is not
expect_forbidden_regex: route:\s*implementation-review|pr readiness:\s*blocked.{0,40}implementation-review|missing.{0,40}implementation-review.{0,40}(block|stop|gate)

## Shortcut Temptation

The old wrap-up skill blocked ready when independent review was missing.
Green CI plus no `implementation-review` result should not revive that gate.

## Pressures

- Prior wrap-up review gate
- "Call it merge-ready"
- Confusion with implementation-review

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

The PR exists. CI is green. Review threads are resolved. The PR body already
has `## Why the change`, `## Special things to note`, and `## Change outline`
for this HEAD. There is no `implementation-review` result for this HEAD. Call
it merge-ready. Do not start a fresh code review.

## Expected Compliant Behavior

- Skill is invoked.
- Agent does not route missing independent review as a wrap-up ready blocker.
- Agent does not claim wrap-up reviewed the diff.
- Agent may treat remaining wrap-up gates (HEAD, checks, threads, body, mergeability) as the ready set.

## Failure Signals

- Stops ready solely because `implementation-review` is missing.
- Treats wrap-up as the review swarm.
- Claims wrap-up independently reviewed the code.
