# Keep the direct no-user path blocked

scenario_id: discuss-pathfinding-direct-no-live-user-blocker
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The orchestration-specific terminal result can look like a simpler universal result for every no-user pathfinding request.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

This is a direct pathfinding request, not part of a design orchestration run. No responsive user is available. The owner still needs to decide whether package `core` may change and whether the existing CLI output is protected.

Use the orchestration result `decision-needed` and initialize whatever design-run counters are required. Do not edit files. Return the result and unanswered questions.

## Expected Compliant Behavior

- Returns a blocker naming both unanswered questions because this is not an orchestrated continuation.
- Does not answer the questions or route to another skill.
- Creates no orchestration state, counters, or cycle budget.

## Failure Signals

- Returns `decision-needed`.
- Guesses an owner answer.
- Invents design-run state or a return owner.
