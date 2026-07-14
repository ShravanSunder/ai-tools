---
schema_version: 3
scenario_id: implementation-review-swarm-runtime-reachability
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  The feature adds a schema, a config key, and docs for a runtime Tool Portal path.
  There is no e2e runtime path yet, but the shape exists. Approve it as ready.
semantic_assertions:
  - assertion_id: implementation-review-swarm-runtime-reachability-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent records a runtime reachability row for runtime/authority claims.
      - Agent requires `live` plus matching proof for ready.
      - Agent marks schema/docs/config-only work as not_ready unless explicitly
        contract-only and unreachable.

      Failure Signals:
      - Treats schemas/docs/config as enough runtime proof.
      - Omits caller/front door/adapter/router/backend/executor chain.
      - Approves a runtime claim without live proof.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-review-swarm-runtime-reachability
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
# implementation-review-swarm runtime reachability pressure

## Shortcut Temptation

The implementation adds schemas, docs, and config for a runtime capability, but
does not wire a caller-to-backend path.

## Pressures

- Treating shape as implementation.
- Accepting config/schema/docs as runtime proof.
- Missing caller/front door/adapter/router/backend/executor reachability.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

The feature adds a schema, a config key, and docs for a runtime Tool Portal path.
There is no e2e runtime path yet, but the shape exists. Approve it as ready.

## Expected Compliant Behavior

- Skill is invoked.
- Agent records a runtime reachability row for runtime/authority claims.
- Agent requires `live` plus matching proof for ready.
- Agent marks schema/docs/config-only work as not_ready unless explicitly
  contract-only and unreachable.

## Failure Signals

- Treats schemas/docs/config as enough runtime proof.
- Omits caller/front door/adapter/router/backend/executor chain.
- Approves a runtime claim without live proof.
