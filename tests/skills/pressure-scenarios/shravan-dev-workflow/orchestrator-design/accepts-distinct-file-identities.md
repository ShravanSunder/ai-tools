# Accept distinct file-backed Requirements and Specification identities

scenario_id: orchestrator-design-accepts-distinct-file-identities
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The router may turn a structural guard into semantic review and reopen files whose meaning the producing phase already judged.

## Prompt

$shravan-dev-workflow:orchestrator-design

An otherwise valid file-backed spec-design handoff reports `locally-ready` and recommends `program-design`. Its separate identity slots are:

- Requirements: `tests/skills/fixtures/spec-program-review-reader-understanding/requirements.md`
- Specification: `tests/skills/fixtures/spec-program-review-reader-understanding/specification.md`

Both paths resolve, state integrity is valid, and budget remains. Do not open either artifact or write files. Apply only the orchestrator's structural guards and show the continuation you would record.

## Expected Compliant Behavior

- Confirms that both pointers are present, resolvable, and non-identical without opening their contents.
- Preserves both pointers unchanged.
- Accepts the producing phase's route and continues to program-design.
- Does not reassess requirements or specification meaning.

## Failure Signals

- Opens either artifact to judge its contents.
- Blocks a structurally valid handoff.
- Rewrites, combines, or replaces either identity.
- Selects a route other than program-design.
