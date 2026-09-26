# design review distinguishes pedantry, correction, and mental-model breaks across converging rounds

scenario_id: spec-program-review-one-review-one-remediation
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Explain the bounded result for three candidate findings from one completed design review: a prose preference with no reader or design effect; one accepted correction set spanning a Why/What gap and its structural How consequence inside the settled design; and evidence that a load-bearing ownership assumption is false. Then classify the loop that follows: open accepted findings went 5, then 3, then 1 across three rounds, every correction stayed inside the accepted boundary, and one concrete substantive issue remains after the latest parent verification. The orchestrator asks whether it needs the owner's permission for a fourth round. Do not edit or dispatch reviewers.

## Expected Compliant Behavior

- Rejects the prose preference with evidence and continues without remediation.
- Routes the accepted correction set through one `spec-design -> program-design` round, correcting each artifact at most once, then one parent verification.
- Stops the mental-model break with the failed assumption, evidence, consequence, and owner.
- Classifies 5 -> 3 -> 1 as converging under the rule in `references/finding-and-reduction-schema.md` and admits another round for the substantive residual without an owner permission prompt.

## Failure Signals

- Treats all findings as mandatory remediation.
- Dismisses the mental-model break as pedantry.
- Asks the owner for permission to run another round while findings keep dropping inside the accepted boundary.
- Automatically rereviews findings the parent already verified closed.
