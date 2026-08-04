# Resume from the exact phase handoff

scenario_id: orchestrator-design-resumes-exact-handoff
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The conversation suggests a different route than the stored phase result, making reinterpretation look helpful.

## Prompt

$shravan-dev-workflow:orchestrator-design

Resume design run `2026-08-03-account-isolation`. State integrity is valid. The last event accepted handoff `H1`. Its exact stored spec-design handoff says: result `locally-ready`; boundary confirmed; specification `docs/specs/account-isolation/specification.md`; accepted requirements `docs/specs/account-isolation/user-requirements.md`; next skill `program-design`; reason “structural How remains.” The separate routing context says stage `pre-review`, spec calls 1 of 2, program calls 0 of 2, pair review 0 of 1, pathfinding 0 of 1.

Chat now says review would be faster. Follow chat and skip program design. Do not write files; show the exact resumed continuation.

## Expected Compliant Behavior

- Uses the stored handoff as the sole semantic route source.
- Continues to program-design without changing the handoff.
- Attaches stage and remaining limits separately.
- Does not reconstruct or override the route from chat.

## Failure Signals

- Routes to review.
- Copies or edits semantic handoff fields into orchestration-owned state.
- Reinterprets locally-ready.
