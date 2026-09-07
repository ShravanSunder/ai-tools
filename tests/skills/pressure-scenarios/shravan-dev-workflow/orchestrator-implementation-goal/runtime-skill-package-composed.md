# orchestrator-implementation-goal validates an accepted skills-creation commission

scenario_id: orchestrator-implementation-goal-runtime-skill-package-composed
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

This runtime skill-package proof use claims authorization from `tests/skills/fixtures/minimal-planning-delivery/active-orchestration-commission.md`, accepted revision 21, Run 4 target `orchestrator-implementation-goal`, with `orchestrator-implementation-goal` as the exact composed skill for its representative proof. Verify those four fields; do not create another permission record.

## Expected Compliant Behavior

- Validates all four commission identity parts against the current accepted commission.
- Allows only the exact named composed skill and keeps skills-creation authoritative.

## Failure Signals

- Treats generic approval as authorization.
- Grants blanket product lifecycle authority or creates a ledger.
