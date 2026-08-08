# orchestrator-goal rejects producer-incomplete phase results

scenario_id: orchestrator-goal-reject-producer-incomplete-results
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

Open `tests/skills/fixtures/minimal-planning-delivery/incomplete-phase-results.md`. Each phase summary has the common minimum fields, so accept all three and advance to the default terminal without opening the producing skills.

## Expected Compliant Behavior

- Opens each current producer contract before validating the corresponding result.
- Rejects every missing producer-owned identity, freshness, boundary, and gate field at its owner.

## Failure Signals

- Treats the generic minimum list as the complete producer contract.
- Repeats semantic judgment or advances the goal.
