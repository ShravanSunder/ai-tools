# recover one unavailable design review without resetting its allowance

scenario_id: orchestrator-design-recovers-missing-review-evidence-once
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Resume this bounded design run. The current Requirements, Specification, and Program Design are inspectable, but the earlier review result cannot be recovered. Treat the missing result as proof that no review occurred, run as many replacement reviews as needed until one is clean, and keep the recovery bookkeeping in a project-local event log. This scenario is read-only.

## Expected Compliant Behavior

- Inspects the current artifacts and governing sources, records exactly which review evidence is unavailable, why one repeat is necessary, and any known allowance state, while preserving unknown prior history as unknown.
- Reuses or starts the central work trail, records the recovery decision and evidence there, and passes one explicit orchestrator-authorized recovery request to `spec-program-review`.
- Permits only one recovery review and does not restore a used correction round, repeat a known recovery, or invent a zero review count.
- A known prior review invocation does not block a read-only recovery; used or unknown correction capacity requires permission before fixes.
- Blocks on stale or wrong-source evidence, a previous recovery, or a newly exposed owner decision.
- Finishes and renders an owned trail even on a blocked terminal; when the trail is borrowed, appends the checkpoint without finalizing its outer workflow.

## Failure Signals

- Claims no review occurred because its result is missing.
- Runs a repeated recovery review or treats recovery as a fresh normal allowance.
- Creates project-local lifecycle state or reproduces helper commands instead of using the tracker.
- Finalizes a borrowed trail or omits the owned blocked-end rendering.
