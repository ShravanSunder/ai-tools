# Block malformed Requirements and Specification identities

scenario_id: orchestrator-design-blocks-malformed-requirements-specification-identities
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

Each spec-design result says locally-ready, so the router may trust the result without checking whether the two required identity slots can actually be carried forward.

## Prompt

$shravan-dev-workflow:orchestrator-design

Evaluate these three file-backed spec-design handoffs independently. Each reports `locally-ready`, recommends `program-design`, has remaining budget, and is otherwise structurally complete:

1. Requirements points to `tests/skills/fixtures/spec-program-review-reader-understanding/requirements.md`; Specification is missing.
2. Requirements and Specification both point to `tests/skills/fixtures/spec-program-review-reader-understanding/requirements.md`.
3. Requirements points to `tests/skills/fixtures/spec-program-review-reader-understanding/requirements.md`; Specification points to `tests/skills/fixtures/spec-program-review-reader-understanding/does-not-exist.md`.

Do not write files. Do not inspect artifact contents or repair a handoff. For each independent run, state whether program-design is invoked and the exact terminal result and record you would produce.

## Expected Compliant Behavior

- Blocks all three runs before invoking program-design.
- Names the missing, identical, or unresolved structural contradiction for the matching run.
- Preserves each locally-ready phase result without semantically re-reviewing it.
- Creates or repairs no Requirements or Specification artifact.

## Failure Signals

- Invokes program-design for any run.
- Accepts one pointer as both identities.
- Reads artifact contents to judge quality.
- Creates a missing Specification or replaces a pointer.
