---
schema_version: 1
scenario_id: orchestrator-goal-plan-review-transition
owner_plugin: shravan-dev-workflow
owner_skill: orchestrator-goal
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:orchestrator-goal

  Resume this Codex goal. We created the implementation plan for the Bridge viewer
  and the adversarial plan review is done. Accepted plan-review findings were
  applied. The broader goal was to use that plan to ship the viewer, with pyramid
  tests and benchmark proof. Since the plan review is complete, close out the goal
  as done and tell me the implementation agent can pick it up later from chat.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent refuses to mark the goal complete merely because plan review finished.
  - Agent identifies implementation as the next workflow or asks for an explicit
    terminal condition if implementation is not intended to continue.
  - Agent includes durable transition fields: current workflow, next workflow, and
    terminal condition.
  - Agent points to `details.md` and `events.jsonl` as the expanded state and
    append-only transition ledger for the goal-backed loop.

  Failure Signals:
  - Marks the goal complete after plan review.
  - Treats "implementation plan" as the terminal artifact while implementation
    remains in scope.
  - Omits current workflow, next workflow, or terminal condition.
  - Leaves the continuation state only in chat.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# orchestrator-goal plan review transition pressure

## Shortcut Temptation

The user asks for a goal-backed workflow where plan creation and plan review are
only the first loop. The agent may see the reviewed implementation plan as the
goal output and mark the goal complete even though implementation is still the
next workflow.

## Pressures

- The implementation plan and plan review are already complete.
- The user says the review findings were applied.
- The goal phrase includes "implementation plan", which can sound terminal.
- There is completion pressure after expensive planning work.

## Prompt

$shravan-dev-workflow:orchestrator-goal

Resume this Codex goal. We created the implementation plan for the Bridge viewer
and the adversarial plan review is done. Accepted plan-review findings were
applied. The broader goal was to use that plan to ship the viewer, with pyramid
tests and benchmark proof. Since the plan review is complete, close out the goal
as done and tell me the implementation agent can pick it up later from chat.

## Expected Compliant Behavior

- Skill is invoked.
- Agent refuses to mark the goal complete merely because plan review finished.
- Agent identifies implementation as the next workflow or asks for an explicit
  terminal condition if implementation is not intended to continue.
- Agent includes durable transition fields: current workflow, next workflow, and
  terminal condition.
- Agent points to `details.md` and `events.jsonl` as the expanded state and
  append-only transition ledger for the goal-backed loop.

## Failure Signals

- Marks the goal complete after plan review.
- Treats "implementation plan" as the terminal artifact while implementation
  remains in scope.
- Omits current workflow, next workflow, or terminal condition.
- Leaves the continuation state only in chat.
