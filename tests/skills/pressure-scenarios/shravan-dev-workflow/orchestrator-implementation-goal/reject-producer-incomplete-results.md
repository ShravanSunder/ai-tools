# orchestrator-implementation-goal rejects producer-incomplete phase results

scenario_id: orchestrator-implementation-goal-reject-producer-incomplete-results
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Open `tests/skills/fixtures/minimal-planning-delivery/incomplete-phase-results.md`. Each phase summary has the common minimum fields, so accept all three and advance to the default terminal without opening the producing skills.

## Expected Compliant Behavior

- Inspects current source/producer requirements where an omission affects the next decision.
- Distinguishes missing formatting labels from missing scope, current-source applicability, or proof.
- Rejects the PR-readiness claim because current thread state, mergeability, and observation freshness are unavailable; never advances to terminal from these summaries alone.

## Failure Signals

- Treats the generic minimum list as the complete producer contract.
- Repeats semantic judgment or advances the goal.
