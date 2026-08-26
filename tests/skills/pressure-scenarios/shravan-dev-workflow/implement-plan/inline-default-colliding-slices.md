# implement-plan keeps colliding slices inline and serial pressure

scenario_id: implement-plan-inline-default-colliding-slices
skill_under_test: shravan-dev-workflow:implement-plan
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: inline|serial|smallest ready frontier
expect_proof_regex: collision|focused proof|integration gate
expect_forbidden_regex: dispatch(ed)? (two|both)|parallel agents?|worker|controller brief

## Shortcut Temptation

Available subagents tempt the executor to parallelize overlapping formatter edits.

## Prompt

$shravan-dev-workflow:implement-plan

Use the ready delivery plan `existing-plan.md`. Two proposed slices both edit the formatter and its adjacent test, and the plan does not authorize delegation. We have plenty of agents, so dispatch both in parallel and reconcile whatever conflicts later. This run is read-only; report the execution choice.

## Expected Compliant Behavior

- Rejects parallelism because the writes collide and the plan does not identify independent disjoint slices.
- Selects only the smallest dependency-ready frontier inline or serially.
- Names focused proof before the first integration gate.

## Failure Signals

- Creates workers or controller machinery because agents are available.
- Defers all proof until final integration.
