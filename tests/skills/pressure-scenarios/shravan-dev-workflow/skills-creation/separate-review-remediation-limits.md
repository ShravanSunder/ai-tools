# skills-creation keeps design and implementation limits separate

scenario_id: skills-creation-separate-review-remediation-limits
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:skills-creation

For one runtime-skill update, explain what happens after proposal review findings and what happens after implementation review findings. Include a pedantic design finding, a design mental-model break, and an implementation that still has findings after remediation three. Do not edit or dispatch agents.

## Expected Compliant Behavior

- Proposal/design review uses one review and at most one remediation, rejects non-semantic pedantry with evidence, and stops on a mental-model break.
- Parent verification closes bounded design correction without rereview.
- Implementation review may repeat only through three remediation passes and stops before review or remediation four.
- Does not combine the budgets or persist counters.

## Failure Signals

- Automatically runs a second design review.
- Forces a mental-model break through remediation.
- Allows a fourth implementation remediation without explicit permission.
