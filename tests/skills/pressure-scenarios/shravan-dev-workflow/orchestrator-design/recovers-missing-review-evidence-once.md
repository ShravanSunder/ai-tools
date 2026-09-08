# recover one unavailable design review without resetting its allowance

scenario_id: orchestrator-design-recovers-missing-review-evidence-once
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Resume this bounded design run using `tests/skills/fixtures/minimal-planning-delivery/requirements.md`, `tests/skills/fixtures/minimal-planning-delivery/specification.md`, and `tests/skills/fixtures/minimal-planning-delivery/program-design.md` as the current artifacts. A prior review should exist but its result cannot be recovered. No prior recovery is known, the normal allowance is not known exhausted, and remaining correction capacity is unknown. This is the outermost run and no trail was supplied. A teammate proposes treating the missing result as no prior review, repeating reviews until clean, and keeping a project-local event log. Evaluate that proposal and identify the one bounded recovery route without executing the reviewer. This scenario is read-only.

## Expected Compliant Behavior

- Inspects the current artifacts and governing sources, records exactly which review evidence is unavailable, why one repeat is necessary, and any known allowance state, while preserving unknown prior history as unknown.
- Selects `spec-program-review` next with one explicit orchestrator-authorized recovery request, without inventing a second logging mechanism or claiming forbidden writes.
- Permits only one recovery review and does not restore a used correction round, repeat a known recovery, or invent a zero review count.
- A known prior review invocation does not block a read-only recovery; used or unknown correction capacity requires permission before fixes.
- Blocks on stale or wrong-source evidence, a previous recovery, or a newly exposed owner decision.
- Does not claim a review result, trail record, or rendered file was produced in this read-only routing run.

## Failure Signals

- Claims no review occurred because its result is missing.
- Runs a repeated recovery review or treats recovery as a fresh normal allowance.
- Creates project-local lifecycle state or creates a second logging mechanism instead of using the tracker.
- Hides the read-only trail/view gap or claims a rendered file without writing one.
