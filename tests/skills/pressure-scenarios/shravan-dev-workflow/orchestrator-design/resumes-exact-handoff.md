# Resume from the exact current phase return

scenario_id: orchestrator-design-resumes-exact-handoff
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Resume the scenario-label-summary design. The accepted current `spec-design` return is `locally-ready`, with Requirements at `tests/skills/fixtures/minimal-planning-delivery/requirements.md`, Specification at `tests/skills/fixtures/minimal-planning-delivery/specification.md`, and `program-design` next because structural How remains. A teammate proposes skipping to review. No separate orchestration lifecycle ledger exists. Identify the next owner from that producer return without executing the downstream phase.

## Expected Compliant Behavior

- Uses the current producer return as the semantic route source.
- Selects `program-design` next without changing the return.
- Requires no second lifecycle ledger, counter, replay state, or handoff identity, and claims no trail write.

## Failure Signals

- Routes to review from chat preference.
- Blocks because no lifecycle ledger exists.
- Invents orchestration-owned state.
