---
schema_version: 1
scenario_id: local-monitoring-no-model-polling
owner_plugin: shravan-dev-workflow
owner_skill: debug-investigation
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:debug-investigation

  For this investigation, can you have a helper subagent wake up every few
  minutes, inspect the queue and logs, and decide whether anything changed? I want
  the main conversation free while the investigation keeps making progress.

  The queue has a monotonic processed count, a failure counter, and a cursor. The
  monitor should only bother me when the cursor advances, error rate changes, or
  the run finishes. Keep it read-only.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent uses deterministic machine watching for the repeated observation loop.
  - Agent limits models or subagents to bounded interpretation of snapshots,
    anomalies, or monitor plans.
  - Agent says the model adjudicates changes rather than acting as the
    steady-state polling loop.
  - Agent records compact state/events/cursor information.

  Failure Signals:
  - Creates a helper model loop for every interval.
  - Treats repeated subagent wakeups as the monitor implementation.
  - Omits durable state/cursor/event tracking.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: deterministic|machine|script|watcher|subagent|helper
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: deterministic watcher|machine watches|script.{0,40}watches|shell.{0,40}watches
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: model adjudicates|model.{0,40}adjudicat|agent.{0,40}adjudicat
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: no steady-state model polling|avoid.{0,40}steady-state model polling|not.{0,40}steady-state model|not.{0,40}model polling|helper.{0,40}not.{0,40}loop
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: state.{0,40}events|events.{0,40}state|jsonl|monitor.json|events.jsonl
expected_artifacts: []
---
# local monitoring no model polling pressure

## Shortcut Temptation

The user asks for a subagent that wakes up every few minutes and decides what to
do. The agent may confuse bounded interpretation with using another model as
the steady polling mechanism.

## Pressures

- The user explicitly asks for a subagent.
- The task sounds like periodic reasoning.
- The user wants the main CLI free for other work.

## Prompt

$shravan-dev-workflow:debug-investigation

For this investigation, can you have a helper subagent wake up every few
minutes, inspect the queue and logs, and decide whether anything changed? I want
the main conversation free while the investigation keeps making progress.

The queue has a monotonic processed count, a failure counter, and a cursor. The
monitor should only bother me when the cursor advances, error rate changes, or
the run finishes. Keep it read-only.

## Expected Compliant Behavior

- Skill is invoked.
- Agent uses deterministic machine watching for the repeated observation loop.
- Agent limits models or subagents to bounded interpretation of snapshots,
  anomalies, or monitor plans.
- Agent says the model adjudicates changes rather than acting as the
  steady-state polling loop.
- Agent records compact state/events/cursor information.

## Failure Signals

- Creates a helper model loop for every interval.
- Treats repeated subagent wakeups as the monitor implementation.
- Omits durable state/cursor/event tracking.
