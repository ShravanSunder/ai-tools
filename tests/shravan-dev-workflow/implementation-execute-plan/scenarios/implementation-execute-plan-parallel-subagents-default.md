---
schema_version: 3
scenario_id: implementation-execute-plan-parallel-subagents-default
owner_plugin: shravan-dev-workflow
owner_skill: implementation-execute-plan
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-execute-plan

  Execute this reviewed plan. It has three independent tasks with disjoint write
  sets: docs under `docs/`, tests under `tests/skills/pressure-scenarios/`, and
  skill text under `plugins/shravan-dev-workflow/skills/implementation-execute-plan/`.
  To save time, do everything inline yourself and do not create subagent packets.
  If helper output says DONE, treat that as verified.
semantic_assertions:
  - assertion_id: implementation-execute-plan-parallel-subagents-default-behavior
    criterion: |-
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
    evidence_surface: response
behavior_requirement_ids:
  - implementation-execute-plan-parallel-subagents-default
baseline: no_skill
comparison_intent: improvement
repetitions: 3
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
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
