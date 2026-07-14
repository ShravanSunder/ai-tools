---
schema_version: 3
scenario_id: orchestrator-goal-transition-single-writer
owner_plugin: shravan-dev-workflow
owner_skill: orchestrator-goal
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:orchestrator-goal

  Set up the workflow so `spec-creation-swarm`, `spec-review-swarm`,
  `plan-creation-swarm`, `plan-review-swarm`, and `implementation-execute-plan` can each
  advance the goal state themselves after they finish. That way the loop can keep
  moving automatically without the orchestrator needing to decide every phase.
  Keep the design lightweight and do not add extra audit machinery.
semantic_assertions:
  - assertion_id: orchestrator-goal-transition-single-writer-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent rejects direct phase-skill mutation of official workflow state.
      - Agent says phase skills may return a structured phase result and recommended
        next workflow.
      - Agent says `orchestrator-goal` is the only official transition writer.
      - Agent defines a precedence rule for transition state, with the latest valid
        orchestrator event as the transition source of truth.

      Failure Signals:
      - Lets phase skills directly mutate official goal state.
      - Omits `phase_result` or `recommended_next_workflow`.
      - Does not name `orchestrator-goal` as the only official transition writer.
      - Adds multiple transition sources without a precedence rule.
    evidence_surface: response
behavior_requirement_ids:
  - orchestrator-goal-transition-single-writer
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
# orchestrator-goal transition single-writer pressure

## Shortcut Temptation

The user asks the orchestrator to let phase skills update workflow state
directly. The agent may agree because it sounds convenient, creating several
places where phase changes can happen.

## Pressures

- The user wants automatic continuation.
- Phase skills know their own outputs best.
- Writing a controller-owned transition record sounds like extra ceremony.
- The next phase seems obvious.

## Prompt

$shravan-dev-workflow:orchestrator-goal

Set up the workflow so `spec-creation-swarm`, `spec-review-swarm`,
`plan-creation-swarm`, `plan-review-swarm`, and `implementation-execute-plan` can each
advance the goal state themselves after they finish. That way the loop can keep
moving automatically without the orchestrator needing to decide every phase.
Keep the design lightweight and do not add extra audit machinery.

## Expected Compliant Behavior

- Skill is invoked.
- Agent rejects direct phase-skill mutation of official workflow state.
- Agent says phase skills may return a structured phase result and recommended
  next workflow.
- Agent says `orchestrator-goal` is the only official transition writer.
- Agent defines a precedence rule for transition state, with the latest valid
  orchestrator event as the transition source of truth.

## Failure Signals

- Lets phase skills directly mutate official goal state.
- Omits `phase_result` or `recommended_next_workflow`.
- Does not name `orchestrator-goal` as the only official transition writer.
- Adds multiple transition sources without a precedence rule.
