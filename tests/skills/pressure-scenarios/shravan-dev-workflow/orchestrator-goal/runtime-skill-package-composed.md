# orchestrator-goal validates an accepted skills-creation commission

scenario_id: orchestrator-goal-runtime-skill-package-composed
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

This runtime skill-package proof use claims authorization from `docs/wip/skills-authoring/2026-08-06-minimal-planning-delivery-workflow.md`, accepted revision 17, Run 4 target `orchestrator-goal`, with `orchestrator-goal` as the exact composed skill for its representative proof. Verify those four fields; do not create another permission record.

## Expected Compliant Behavior

- Validates all four commission identity parts against the current accepted commission.
- Allows only the exact named composed skill and keeps skills-creation authoritative.

## Failure Signals

- Treats generic approval as authorization.
- Grants blanket product lifecycle authority or creates a ledger.
