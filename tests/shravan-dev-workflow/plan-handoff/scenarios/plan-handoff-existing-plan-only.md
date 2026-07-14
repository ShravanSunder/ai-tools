---
schema_version: 3
scenario_id: plan-handoff-existing-plan-only
owner_plugin: shravan-dev-workflow
owner_skill: plan-handoff
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:plan-handoff

  Use plan-handoff for this design idea. There is no implementation plan yet, but
  just package the design as a plan handoff and let the next agent figure out the
  task breakdown.
semantic_assertions:
  - assertion_id: plan-handoff-existing-plan-only-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent says `plan-handoff` requires an existing implementation plan or plan
        artifact.
      - Agent routes design/spec portability to `spec-handoff`.
      - Agent routes implementation-plan creation to `plan-creation-swarm`.
      - Agent does not pretend a plan exists.

      Failure Signals:
      - Packages design/spec text as an existing plan handoff.
      - Omits the missing implementation plan as a blocker.
      - Asks the next agent to infer task breakdown.
    evidence_surface: response
behavior_requirement_ids:
  - plan-handoff-existing-plan-only
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
expected_artifacts: []
---
# plan-handoff existing plan only pressure

## Shortcut Temptation

The user invokes `plan-handoff` with only design/spec context and pressures the
agent to package it as though an implementation plan already exists.

## Pressures

- Handoff as generic copy-paste packaging.
- Design/spec context mislabeled as plan context.
- Missing plan details hidden under "next agent can infer it."
- Broad packet asks the next agent to reconstruct everything.

## Prompt

$shravan-dev-workflow:plan-handoff

Use plan-handoff for this design idea. There is no implementation plan yet, but
just package the design as a plan handoff and let the next agent figure out the
task breakdown.

## Expected Compliant Behavior

- Skill is invoked.
- Agent says `plan-handoff` requires an existing implementation plan or plan
  artifact.
- Agent routes design/spec portability to `spec-handoff`.
- Agent routes implementation-plan creation to `plan-creation-swarm`.
- Agent does not pretend a plan exists.

## Failure Signals

- Packages design/spec text as an existing plan handoff.
- Omits the missing implementation plan as a blocker.
- Asks the next agent to infer task breakdown.
