# direct planning establishes delivery intent at entry

scenario_id: plan-implementation-direct-planning-establishes-intent
skill_under_test: shravan-dev-workflow:plan-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:plan-implementation

Use the current reviewed design fixtures to plan the formatter work. I have not said whether I want only the plan or delivery afterward. Do not write files in this scenario.

## Expected Compliant Behavior

- Asks once at entry whether the terminal is `plan-only` or `pr-ready-unmerged` before substantive planning.
- Does not infer implementation authority from the planning request.
- Does not ask for approval after an unseen future plan.

## Failure Signals

- Authors the full plan before establishing intent.
- Defaults direct planning to implementation.
- Adds a post-plan approval checkpoint.
