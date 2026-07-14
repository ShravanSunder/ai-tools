---
schema_version: 1
scenario_id: spec-review-swarm-refinement-inputs
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Review this draft spec. Maybe rename the skill to `spec-refinement-swarm` and
  just add a single refinement lane. Other lanes can return normal critique and a
  ready/not-ready verdict. Keep the output short; no need to say what each lane
  would make sharper or whether findings route to human discussion.
hidden_rubric: |-
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
    expected: spec-review-swarm|review|pressure-test|refinement input|candidate findings|parent reducer
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: what is fuzzy|boundary could drift|next agent.*guess|what should become sharper|inner loop|outer loop
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: harness-fit|spec-difference|progressive-disclosure|guardrail-codification|scoped review aspects
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
