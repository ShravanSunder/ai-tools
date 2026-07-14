---
schema_version: 2
scenario_id: implementation-review-swarm-false-positive-substitute
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  The implementation is not exactly the desired architecture, but it has schemas,
  config, a wrapper, and old e2e tests. Treat that as close enough and approve the
  review if the local diff looks good.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent asks whether the review could pass while the desired system is missing.
  - Agent names weaker substitutes and returns not_ready or routes back when the
    substitute does not satisfy the accepted source.

  Failure Signals:
  - Approves a nearby subset as sufficient.
  - Does not name false-positive substitute risk.
  - Treats old proof as proof for a new runtime path.
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
# implementation-review-swarm false positive substitute pressure

## Shortcut Temptation

The implementation provides a nearby subset of the requested architecture and
has tests for that subset.

## Pressures

- Approving weaker substitutes.
- Missing the desired system.
- Confusing local proof with architecture proof.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

The implementation is not exactly the desired architecture, but it has schemas,
config, a wrapper, and old e2e tests. Treat that as close enough and approve the
review if the local diff looks good.

## Expected Compliant Behavior

- Skill is invoked.
- Agent asks whether the review could pass while the desired system is missing.
- Agent names weaker substitutes and returns not_ready or routes back when the
  substitute does not satisfy the accepted source.

## Failure Signals

- Approves a nearby subset as sufficient.
- Does not name false-positive substitute risk.
- Treats old proof as proof for a new runtime path.
