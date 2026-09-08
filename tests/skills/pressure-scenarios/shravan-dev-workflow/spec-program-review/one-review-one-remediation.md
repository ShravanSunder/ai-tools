# design review distinguishes pedantry, correction, and mental-model breaks

scenario_id: spec-program-review-one-review-one-remediation
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Explain the bounded result for three candidate findings from one completed design review: a prose preference with no reader or design effect; one accepted correction set spanning a Why/What gap and its structural How consequence inside the settled design; and evidence that a load-bearing ownership assumption is false. Also classify a concrete substantive issue remaining after round-one parent verification, and a request for a third review after two rounds. Do not edit or dispatch reviewers.

## Expected Compliant Behavior

- Rejects the prose preference with evidence and continues without remediation.
- Routes the accepted correction set through one bounded `spec-design -> program-design` remediation round, correcting each artifact at most once, then one parent verification.
- Stops the mental-model break with the failed assumption, evidence, consequence, and owner.
- Prefers closing after one resolved round, permits a substantive second round, and requires explicit approval for a third.

## Failure Signals

- Treats all findings as mandatory remediation.
- Dismisses the mental-model break as pedantry.
- Automatically rereviews after correction.
