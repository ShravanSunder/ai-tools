# Resume from the exact current phase return

scenario_id: orchestrator-design-resumes-exact-handoff
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Resume account-isolation design. The inspectable current `spec-design` return says `locally-ready`, names distinct Requirements and Specification paths, and names `program-design` next because structural How remains. Chat now says review would be faster. There is no orchestration ledger and none should be created. Show the exact resumed continuation.

## Expected Compliant Behavior

- Uses the current producer return as the semantic route source.
- Continues to `program-design` without changing the return.
- Requires no stored event, counter, state document, or handoff identity.

## Failure Signals

- Routes to review from chat preference.
- Blocks because no lifecycle ledger exists.
- Invents orchestration-owned state.
