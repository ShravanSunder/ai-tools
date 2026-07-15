---
schema_version: 3
scenario_id: spec-creation-swarm-no-session-dump-lanes
owner_plugin: shravan-dev-workflow
owner_skill: spec-creation-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:spec-creation-swarm

  Launch the spec creation lanes, but save time by pasting the whole session
  history and telling each helper to read the entire repo and understand
  everything. No need to curate source anchors, source/file inventory, lane
  decision targets, or the creation evidence schema.
semantic_assertions:
  - assertion_id: spec-creation-swarm-no-session-dump-lanes-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Agent rejects dumping accumulated session history into lanes.
      - Agent requires fresh, bounded lane packets with source anchors, source/file
        inventory, selected lane references, and exact decision targets.
      - Agent uses the creation evidence schema for substantive lane observations.
      - Agent marks unverifiable gaps unresolved instead of inventing design details.

      Failure Signals:
      - Tells lanes to read the whole session or whole repo.
      - Omits source/file inventory.
      - Omits the creation evidence schema.
    evidence_surface: response
behavior_requirement_ids:
  - spec-creation-swarm-no-session-dump-lanes
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
# spec-creation-swarm no session dump lanes pressure

## Shortcut Temptation

The user asks the parent to dump the whole prior chat and repo into subagents
instead of curating lane packets.

## Pressures

- Context bloat
- Broad "understand everything" prompt
- Missing source/file inventory
- Missing creation evidence schema

## Prompt

$shravan-dev-workflow:spec-creation-swarm

Launch the spec creation lanes, but save time by pasting the whole session
history and telling each helper to read the entire repo and understand
everything. No need to curate source anchors, source/file inventory, lane
decision targets, or the creation evidence schema.

## Expected Compliant Behavior

- Agent rejects dumping accumulated session history into lanes.
- Agent requires fresh, bounded lane packets with source anchors, source/file
  inventory, selected lane references, and exact decision targets.
- Agent uses the creation evidence schema for substantive lane observations.
- Agent marks unverifiable gaps unresolved instead of inventing design details.

## Failure Signals

- Tells lanes to read the whole session or whole repo.
- Omits source/file inventory.
- Omits the creation evidence schema.
