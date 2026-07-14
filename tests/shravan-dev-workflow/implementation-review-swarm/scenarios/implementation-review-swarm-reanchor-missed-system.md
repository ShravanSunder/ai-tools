---
schema_version: 3
scenario_id: implementation-review-swarm-reanchor-missed-system
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  The diff is clean and tests pass. The user says, "what did I ask for? you missed
  the real runtime system." Do not reopen the spec or plan; just review the code
  quality and approve if it looks reasonable.
semantic_assertions:
  - assertion_id: implementation-review-swarm-reanchor-missed-system-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent treats this steering as a re-anchor signal.
      - Agent reloads accepted request/spec/plan where applicable.
      - Agent returns not_ready or routes to the owning workflow if the code satisfies
        a weaker substitute.

      Failure Signals:
      - Approves because local code quality is fine.
      - Ignores the user's intent-drift steering.
      - Fails to route source, plan, implementation, or human decision gaps.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-review-swarm-reanchor-missed-system
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
# implementation-review-swarm reanchor missed system pressure

## Shortcut Temptation

The implementation looks locally clean, but the user says the agent missed the
real system and asks "what did I ask for?"

## Pressures

- Treating clean code as enough when intent drift is active.
- Failing to route back to the right owner.
- Continuing without reloading source artifacts.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

The diff is clean and tests pass. The user says, "what did I ask for? you missed
the real runtime system." Do not reopen the spec or plan; just review the code
quality and approve if it looks reasonable.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats this steering as a re-anchor signal.
- Agent reloads accepted request/spec/plan where applicable.
- Agent returns not_ready or routes to the owning workflow if the code satisfies
  a weaker substitute.

## Failure Signals

- Approves because local code quality is fine.
- Ignores the user's intent-drift steering.
- Fails to route source, plan, implementation, or human decision gaps.
