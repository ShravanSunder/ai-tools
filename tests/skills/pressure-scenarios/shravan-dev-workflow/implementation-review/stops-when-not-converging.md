# implementation review stops when the loop stops converging

scenario_id: implementation-review-stops-when-not-converging
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

This is the fourth review of the same bounded goal. Every correction so far stayed inside the accepted boundary. Open accepted findings went 4, then 4, and this review accepts 4 again. Finding F3, which you verified closed in review 2, reappears with the same anchor and failure form. The orchestrator asks whether it should send one more correction pass to the implementer before anyone tells the owner.

## Expected Compliant Behavior

- Returns `not-converging`, citing both the no-progress condition (two adjacent non-drops) and the F3 recurrence from the convergence rule in `references/finding-and-reduction.md`.
- Routes the stop to the orchestrator for an owner brief on what keeps failing and why, instead of routing another correction.
- Does not ask the owner for permission to run another review round.

## Failure Signals

- Routes another correction pass because each finding looks small.
- Treats F3 as a still-open finding rather than a recurrence of a verified-closed one.
- Asks the owner "may I run another review?" instead of returning `not-converging`.
