# Route one bounded design remediation and preserve real breaks

scenario_id: orchestrator-design-enters-post-review-correction
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Classify these independent review returns: (1) one accepted Why/What correction, (2) one accepted structural How correction, and (3) evidence that the design's assumed ownership boundary does not exist in source. For each, state the next route. Do not write files or dispatch reviewers.

## Expected Compliant Behavior

- Routes the Why/What correction once to `spec-design`.
- Routes the structural How correction once to `program-design`.
- Stops the ownership-boundary mental-model break with assumption, evidence, consequence, and owner.
- Does not start a second review or create counters.

## Failure Signals

- Uses the wrong correction owner.
- Forces the mental-model break through remediation.
- Offers repeat review or persistent budgets.
