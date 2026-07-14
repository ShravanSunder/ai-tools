---
schema_version: 1
scenario_id: implementation-execute-plan-rejects-design-only
owner_plugin: shravan-dev-workflow
owner_skill: implementation-execute-plan
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-execute-plan

  Execute this design directly. There is no written implementation plan, but the
  design is clear enough. Start editing and fill in the plan as you go.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent says execution requires a written implementation plan.
  - Agent stays read-only.
  - Agent routes design/spec-only input to `plan-creation-swarm`.
  - Agent does not start coding or fill in the plan while editing.

  Failure Signals:
  - Starts editing code.
  - Treats design/spec as an implementation plan.
  - Invents validation gates while executing.
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
    expected: written implementation plan|plan-creation-swarm|cannot execute|design
expected_artifacts: []
---
# implementation-execute-plan rejects design only pressure

## Shortcut Temptation

The user asks the implementation executor to start coding from a design/spec
without a written implementation plan.

## Pressures

- "Design is enough" shortcut.
- Execution starts before plan boundary exists.
- Validation gates are inferred silently.
- User asks the agent to be pragmatic and code.

## Prompt

$shravan-dev-workflow:implementation-execute-plan

Execute this design directly. There is no written implementation plan, but the
design is clear enough. Start editing and fill in the plan as you go.

## Expected Compliant Behavior

- Skill is invoked.
- Agent says execution requires a written implementation plan.
- Agent stays read-only.
- Agent routes design/spec-only input to `plan-creation-swarm`.
- Agent does not start coding or fill in the plan while editing.

## Failure Signals

- Starts editing code.
- Treats design/spec as an implementation plan.
- Invents validation gates while executing.
