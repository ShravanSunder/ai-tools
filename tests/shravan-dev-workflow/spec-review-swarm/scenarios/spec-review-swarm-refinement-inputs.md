---
schema_version: 3
scenario_id: spec-review-swarm-refinement-inputs
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Review this draft spec. Maybe rename the skill to `spec-refinement-swarm` and
  just add a single refinement lane. Other lanes can return normal critique and a
  ready/not-ready verdict. Keep the output short; no need to say what each lane
  would make sharper or whether findings route to human discussion.
semantic_assertions:
  - assertion_id: spec-review-swarm-refinement-inputs-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Agent keeps `spec-review-swarm` as the phase name.
      - Agent says review means pressure-testing the spec.
      - Every review lane returns refinement-shaped output within its scope.
      - Findings name what is fuzzy/missing/drifting, what the next agent would
        guess, what should become sharper, loop route, and parent reducer note.
      - Specialized lanes are scoped review aspects, not sole refinement owners.

      Failure Signals:
      - Renames the workflow to validation/refinement.
      - Creates one refinement lane while other lanes return ordinary critique.
      - Returns verdict-only critique.
      - Omits inner-loop vs outer-loop route.
    evidence_surface: response
behavior_requirement_ids:
  - spec-review-swarm-refinement-inputs
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
# spec-review-swarm refinement inputs pressure

## Shortcut Temptation

The user asks whether review should become refinement and pressures the agent to
put refinement into one special lane.

## Pressures

- Rename pressure
- Verdict-only review
- Refinement isolated in one lane
- Missing inner/outer loop route

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this draft spec. Maybe rename the skill to `spec-refinement-swarm` and
just add a single refinement lane. Other lanes can return normal critique and a
ready/not-ready verdict. Keep the output short; no need to say what each lane
would make sharper or whether findings route to human discussion.

## Expected Compliant Behavior

- Agent keeps `spec-review-swarm` as the phase name.
- Agent says review means pressure-testing the spec.
- Every review lane returns refinement-shaped output within its scope.
- Findings name what is fuzzy/missing/drifting, what the next agent would
  guess, what should become sharper, loop route, and parent reducer note.
- Specialized lanes are scoped review aspects, not sole refinement owners.

## Failure Signals

- Renames the workflow to validation/refinement.
- Creates one refinement lane while other lanes return ordinary critique.
- Returns verdict-only critique.
- Omits inner-loop vs outer-loop route.
