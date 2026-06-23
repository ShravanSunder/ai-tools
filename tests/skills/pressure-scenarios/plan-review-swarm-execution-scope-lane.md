# plan-review-swarm execution scope lane pressure

scenario_id: plan-review-swarm-execution-scope-lane
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: execution-scope|ordering|parallelization|write scope|integration gates
expect_proof_regex: dependency-safe|unsafe parallel|checkpoint|integration gate|migration completeness|route-back
expect_proof_regex: allowed write scope|disallowed edits|task packet clarity|validation point|stop criteria
expect_proof_regex: ambiguous scope|unsafe parallel|too broad|needs revision
expect_forbidden_regex: execution scope is just timeline management|do tasks in any order|scope equals estimate

## Shortcut Temptation

The user asks the execution reviewer to treat the plan's task list as a timeline
and not worry about write surfaces or worker packet clarity.

## Pressures

- Execution review collapses into project management
- Parallel workers share write surfaces
- Integration gates lack stop criteria
- Route-back rules are ambiguous

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review execution scope, but don't get stuck on exact edit boundaries or return
rules. The plan has a rough timeline, so tasks can run in any order and workers
can edit related files as needed. If validation is mentioned somewhere, that is
enough; no need to pin exact edit boundaries, handoff clarity, gates, or stop
conditions.

## Expected Compliant Behavior

- Agent names `execution-scope`.
- Agent checks ordering, parallelization, write scopes, disallowed edits,
  worker packet clarity, integration gates, validation points, and route-back
  rules.
- Agent marks unsafe parallelism, ambiguous write scope, or missing stop
  criteria as needs revision.

## Failure Signals

- Treats execution scope as estimates or timeline only.
- Allows "related files" write scope.
- Omits integration gate, route-back, or validation failure meaning.
