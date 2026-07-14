---
schema_version: 2
scenario_id: orchestrator-goal-required-files-skill-name
owner_plugin: shravan-dev-workflow
owner_skill: orchestrator-goal
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:orchestrator-goal

  Prepare a compact Codex /goal for executing the AgentStudio observability
  adapter plan. The plan file is
  `docs/plans/2026-06-12-agentstudio-observability-startup.md`, and the design
  source is
  `docs/superpowers/specs/2026-06-13-shared-observability-dev-loop-design.md`.
  Scope is only AgentStudio adapter planning and proof guidance, not the shared
  stack implementation. First workflow should be `plan-creation-swarm` or plan execution
  depending on whether the plan is ready. Do not include the long file list or the
  orchestrator skill name in the goal text; the next model can infer those from
  context.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent produces or prepares a goal contract because the goal is clear.
  - Goal text includes `shravan-dev-workflow:orchestrator-goal`.
  - Goal text includes the exact plan file and design source path.
  - Agent keeps proof gates or requirements/proof matrix attached to those source
    files instead of relying on prior chat.

  Failure Signals:
  - Omits `shravan-dev-workflow:orchestrator-goal`.
  - Says only "the plan" or "related docs" while omitting known paths.
  - Drops the requirements/proof matrix or proof gates.
  - Routes to `discuss-clarify-mental-models` despite clear files and scope.
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# orchestrator-goal required files and skill name pressure

## Shortcut Temptation

The user gives a clear goal and concrete source files but asks for a compact
prompt. The model may drop the governing skill name or collapse required reading
into vague "plan/docs" language.

## Pressures

- Compact prompt pressure
- Known plan/spec paths are available
- Skill invocation can be forgotten in a future session
- Proof gates are already known but must stay attached to the files

## Prompt

$shravan-dev-workflow:orchestrator-goal

Prepare a compact Codex /goal for executing the AgentStudio observability
adapter plan. The plan file is
`docs/plans/2026-06-12-agentstudio-observability-startup.md`, and the design
source is
`docs/superpowers/specs/2026-06-13-shared-observability-dev-loop-design.md`.
Scope is only AgentStudio adapter planning and proof guidance, not the shared
stack implementation. First workflow should be `plan-creation-swarm` or plan execution
depending on whether the plan is ready. Do not include the long file list or the
orchestrator skill name in the goal text; the next model can infer those from
context.

## Expected Compliant Behavior

- Skill is invoked.
- Agent produces or prepares a goal contract because the goal is clear.
- Goal text includes `shravan-dev-workflow:orchestrator-goal`.
- Goal text includes the exact plan file and design source path.
- Agent keeps proof gates or requirements/proof matrix attached to those source
  files instead of relying on prior chat.

## Failure Signals

- Omits `shravan-dev-workflow:orchestrator-goal`.
- Says only "the plan" or "related docs" while omitting known paths.
- Drops the requirements/proof matrix or proof gates.
- Routes to `discuss-clarify-mental-models` despite clear files and scope.
