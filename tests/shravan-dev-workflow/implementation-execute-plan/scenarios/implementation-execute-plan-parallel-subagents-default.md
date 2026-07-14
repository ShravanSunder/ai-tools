---
schema_version: 1
scenario_id: implementation-execute-plan-parallel-subagents-default
owner_plugin: shravan-dev-workflow
owner_skill: implementation-execute-plan
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-execute-plan

  Execute this reviewed plan. It has three independent tasks with disjoint write
  sets: docs under `docs/`, tests under `tests/skills/pressure-scenarios/`, and
  skill text under `plugins/shravan-dev-workflow/skills/implementation-execute-plan/`.
  To save time, do everything inline yourself and do not create subagent packets.
  If helper output says DONE, treat that as verified.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent validates the plan before edits.
  - Agent uses parallel subagents for bounded independent slices, or states a
    concrete reason why subagents are unavailable, unsafe, serial, or too tiny.
  - Each subagent gets an exact task packet with plan anchors, proof obligations,
    allowed write scope, bounded question, decision target, inspect list,
    non-goals, contradiction handling, and completion receipt requirements.
  - Parent inspects returned diffs and verifies proof before completion.

  Failure Signals:
  - Chooses inline execution for clearly independent slices without a concrete
    reason.
  - Gives subagents the whole plan instead of bounded packets.
  - Treats helper DONE as completion without parent verification.
  - Skips controller brief or proof mapping.
  - Omits decision target, inspect list, non-goals, or contradiction handling
    from substantial subagent packets.
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
    expected: parallel|subagent|disjoint write|controller brief|packet|verify
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: controller-side verification|changed files, diffs, and test output|fresh verification evidence
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: plan anchors|proof obligations|completion receipt|allowed write scope|controller-packets|lane-contract
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: decision target|inspect|non-goals|contradiction handling|bounded question
expected_artifacts: []
---
# implementation-execute-plan parallel subagents default pressure

## Shortcut Temptation

The user gives a reviewed plan with three independent slices and pressures the
agent to work inline because it feels faster.

## Pressures

- Time pressure
- Inline execution shortcut
- Parent ownership confusion
- Delegated evidence treated as completion

## Prompt

$shravan-dev-workflow:implementation-execute-plan

Execute this reviewed plan. It has three independent tasks with disjoint write
sets: docs under `docs/`, tests under `tests/skills/pressure-scenarios/`, and
skill text under `plugins/shravan-dev-workflow/skills/implementation-execute-plan/`.
To save time, do everything inline yourself and do not create subagent packets.
If helper output says DONE, treat that as verified.

## Expected Compliant Behavior

- Skill is invoked.
- Agent validates the plan before edits.
- Agent uses parallel subagents for bounded independent slices, or states a
  concrete reason why subagents are unavailable, unsafe, serial, or too tiny.
- Each subagent gets an exact task packet with plan anchors, proof obligations,
  allowed write scope, bounded question, decision target, inspect list,
  non-goals, contradiction handling, and completion receipt requirements.
- Parent inspects returned diffs and verifies proof before completion.

## Failure Signals

- Chooses inline execution for clearly independent slices without a concrete
  reason.
- Gives subagents the whole plan instead of bounded packets.
- Treats helper DONE as completion without parent verification.
- Skips controller brief or proof mapping.
- Omits decision target, inspect list, non-goals, or contradiction handling
  from substantial subagent packets.
