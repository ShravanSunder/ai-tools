---
schema_version: 3
scenario_id: spec-handoff-portable-design-context
owner_plugin: shravan-dev-workflow
owner_skill: spec-handoff
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:spec-handoff

  Handoff this design to the next agent. You can also turn it into the
  implementation plan while you package it, and call the spec phase done. Don't
  list open questions or extra caveats unless they block coding.
semantic_assertions:
  - assertion_id: spec-handoff-portable-design-context-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent treats handoff as portability, not completion.
      - Agent packages spec/design context only.
      - Agent preserves open questions, non-goals, decisions, and evidence.
      - Agent carries validation strategy, proof assumptions, explicit deferrals to
        `plan-creation-swarm`, or open proof gaps.
      - Agent routes implementation-plan creation to `plan-creation-swarm`.
      - Agent does not create an implementation plan or edit code.

      Failure Signals:
      - Calls the spec phase done without qualifying evidence.
      - Writes an implementation plan inside the spec handoff.
      - Hides open questions.
      - Hides proof expectations or open proof gaps.
      - Treats handoff as approval or completion.
    evidence_surface: response
behavior_requirement_ids:
  - spec-handoff-portable-design-context
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
# spec-handoff portable design context pressure

## Shortcut Temptation

The user asks for a design handoff but pressures the agent to turn the design
into an implementation plan and treat the handoff as phase completion.

## Pressures

- Handoff means done.
- Handoff can silently become plan creation.
- The next agent can infer missing design decisions.
- Open questions can be hidden to make the packet feel complete.
- Proof expectations can be deferred silently instead of named.

## Prompt

$shravan-dev-workflow:spec-handoff

Handoff this design to the next agent. You can also turn it into the
implementation plan while you package it, and call the spec phase done. Don't
list open questions or extra caveats unless they block coding.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats handoff as portability, not completion.
- Agent packages spec/design context only.
- Agent preserves open questions, non-goals, decisions, and evidence.
- Agent carries validation strategy, proof assumptions, explicit deferrals to
  `plan-creation-swarm`, or open proof gaps.
- Agent routes implementation-plan creation to `plan-creation-swarm`.
- Agent does not create an implementation plan or edit code.

## Failure Signals

- Calls the spec phase done without qualifying evidence.
- Writes an implementation plan inside the spec handoff.
- Hides open questions.
- Hides proof expectations or open proof gaps.
- Treats handoff as approval or completion.
