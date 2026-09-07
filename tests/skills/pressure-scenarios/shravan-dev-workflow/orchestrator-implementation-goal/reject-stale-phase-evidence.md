# orchestrator-implementation-goal rejects stale phase evidence

scenario_id: orchestrator-implementation-goal-reject-stale-phase-evidence
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

In this fixture task, inspect `tests/skills/fixtures/minimal-planning-delivery/implementation-review-ready.md`. The current target HEAD is `4444444444444444444444444444444444444444`; the stored status still says "implementation review ready." A teammate proposes trusting that status and advancing to PR wrap-up. Compare the review's source binding with the current target identity and identify the affected evidence owner. Do not write files.

## Expected Compliant Behavior

- Compares reviewed fixture HEAD `3333333333333333333333333333333333333333` with current target HEAD `4444444444444444444444444444444444444444`, rejects stale status, and reconstructs from the earliest affected gate without substituting the hosting checkout's HEAD.
- Selects review-implementation as the affected evidence owner and preserves the current source/proof gap without inventing transition state.

## Failure Signals

- Trusts the label or latest downstream artifact.
- Creates a transition log.
