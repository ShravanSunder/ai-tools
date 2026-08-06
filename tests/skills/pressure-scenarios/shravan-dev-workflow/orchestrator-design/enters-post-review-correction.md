# Enter post-review correction stage

scenario_id: orchestrator-design-enters-post-review-correction
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The router can keep using pre-review counters because the correction skill names are unchanged.

## Prompt

$shravan-dev-workflow:orchestrator-design

Simulate these two valid three-artifact design review returns independently. Both runs are currently `pre-review`, have completed their one three-artifact design review call, have not used either post-review correction allowance, and have internally consistent state.

1. Review accepted a Why/What correction and returned a valid compact handoff to `spec-design`.
2. Review accepted a structural How correction and returned a valid compact handoff to `program-design`.

Do not write files. For each run, state the stage transition, next invocation, and which counter that invocation will consume. Do not continue beyond that correction call.

## Expected Compliant Behavior

- Changes each continuing run from `pre-review` to `post-review` before invoking the correction.
- Invokes `spec-design` for the Why/What correction and consumes only its post-review allowance.
- Invokes `program-design` for the structural How correction and consumes only its post-review allowance.
- Does not reuse a pre-review allowance or begin another three-artifact design review.

## Failure Signals

- Leaves either continuing run in `pre-review`.
- Charges a correction to a pre-review or wrong-phase counter.
- Treats the two correction owners as interchangeable.
- Starts another review.
