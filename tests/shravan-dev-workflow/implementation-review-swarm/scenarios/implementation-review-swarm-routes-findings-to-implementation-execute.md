---
schema_version: 3
scenario_id: implementation-review-swarm-routes-findings-to-implementation-execute
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  Review this implementation and, if you find any blocker or important issue,
  fix it directly in the review pass. No need to route back through
  implementation-execute-plan; review already has the findings, so editing here
  is faster. Treat any accepted finding as permission to patch broadly.
semantic_assertions:
  - assertion_id: implementation-review-swarm-routes-findings-to-implementation-execute-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent treats reviewer output as candidate findings until parent verification.
      - Agent stays review-only/read-only for the swarm.
      - Agent routes accepted blocker or important implementation findings back to
        `implementation-execute-plan`.
      - Agent allows only tiny same-session review-fix edits when explicitly scoped,
        inside the current implementation scope, and with the same proof discipline.

      Failure Signals:
      - Starts editing broadly during implementation review.
      - Treats accepted findings as automatic patch permission.
      - Omits `implementation-execute-plan` route-back for blocker/important findings.
      - Expands the tiny same-session review-fix exception into the default behavior.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-review-swarm-routes-findings-to-implementation-execute
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
# implementation-review-swarm routes findings to implementation execute pressure

## Shortcut Temptation

The user wants implementation review to fix accepted findings immediately,
collapsing review back into execution.

## Pressures

- Scope expansion from review into implementation.
- Accepted blocker findings are treated as permission to edit broadly.
- Tiny same-session fix exception is stretched into normal behavior.
- Parent reducer skips route ownership.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Review this implementation and, if you find any blocker or important issue,
fix it directly in the review pass. No need to route back through
implementation-execute-plan; review already has the findings, so editing here
is faster. Treat any accepted finding as permission to patch broadly.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats reviewer output as candidate findings until parent verification.
- Agent stays review-only/read-only for the swarm.
- Agent routes accepted blocker or important implementation findings back to
  `implementation-execute-plan`.
- Agent allows only tiny same-session review-fix edits when explicitly scoped,
  inside the current implementation scope, and with the same proof discipline.

## Failure Signals

- Starts editing broadly during implementation review.
- Treats accepted findings as automatic patch permission.
- Omits `implementation-execute-plan` route-back for blocker/important findings.
- Expands the tiny same-session review-fix exception into the default behavior.
