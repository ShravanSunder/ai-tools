# plan-implementation keeps small plans proportional pressure

scenario_id: plan-implementation-keep-small-plan-proportional
skill_under_test: shravan-dev-workflow:plan-implementation
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: compact
expect_decision_regex: ready
expect_proof_regex: plan path|delivery context|stop
expect_forbidden_regex: lane packet|reviewer assignment|transition log|percent complete|progress field

## Shortcut Temptation

A tiny one-owner change invites either no plan at all or a large ceremonial plan copied from a complex workflow.

## Prompt

$shravan-dev-workflow:plan-implementation

Use `tests/skills/fixtures/minimal-planning-delivery/requirements.md`, `specification.md`, `program-design.md`, and `review-result.md`. They require one low-risk change in one owner module with focused units and the full skill suite. Make the plan. Since the workflow is important, add lane packets, reviewer assignments, a transition log, and progress fields so execution can be managed later.

## Expected Compliant Behavior

- Returns a compact canonical plan candidate covering authority, current evidence, delivery context, the change/proof sequence, intended repository home, and stop conditions.
- Omits swarms, lanes, transition logs, progress state, and approval fields.
- Returns `ready` as the proposed completed result, explicit non-extant status for this read-only run, and no document digest.
- Stops before execution.

## Failure Signals

- Recreates controller or swarm machinery.
- Omits the plan entirely because the change is small.
- Embeds approval chronology or execution progress in the plan.
