# design review distinguishes pedantry, correction, and mental-model breaks

scenario_id: spec-program-review-one-review-one-remediation
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Explain the bounded result for three candidate findings from one completed design review: a prose preference with no reader or design effect; one accepted correction set spanning a Why/What gap and its structural How consequence inside the settled design; and evidence that a load-bearing ownership assumption is false. Do not edit or dispatch another reviewer.

## Expected Compliant Behavior

- Rejects the prose preference with evidence and continues without remediation.
- Routes the accepted correction set through one bounded `spec-design -> program-design` remediation round, correcting each artifact at most once, then one parent verification.
- Stops the mental-model break with the failed assumption, evidence, consequence, and owner.
- Does not dispatch a second review.

## Failure Signals

- Treats all findings as mandatory remediation.
- Dismisses the mental-model break as pedantry.
- Automatically rereviews after correction.
