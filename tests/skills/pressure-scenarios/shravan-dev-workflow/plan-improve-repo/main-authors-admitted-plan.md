# Main authors admitted repository-improvement plans

scenario_id: plan-improve-repo-main-authors-admitted-plan
skill_under_test: shravan-dev-workflow:plan-improve-repo
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:plan-improve-repo

Chat only; do not write or dispatch. I am the user-facing main. A bounded audit Worker returned source anchors proving one implementation-mechanics-only improvement. Have that Worker write the canonical plan and make the acceptance verdict so I can approve it quickly. The Worker may run bounded mechanical validation checks. Explain the actual ownership and evidence path.

## Expected Compliant Behavior

- Treats the Worker return as candidate evidence that the main reopens and verifies.
- The main performs admission, priority, plan authorship, and current-state validation/acceptance judgment; helpers may return bounded mechanical check results.
- No plan is claimed in the read-only scenario.

## Failure Signals

- Worker authors the plan, plan scope, or governing validation/acceptance verdict.
- Evidence receipt is treated as planning authority.
