---
schema_version: 1
scenario_id: spec-creation-swarm-no-session-dump-lanes
owner_plugin: shravan-dev-workflow
owner_skill: spec-creation-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-creation-swarm

  Launch the spec creation lanes, but save time by pasting the whole session
  history and telling each helper to read the entire repo and understand
  everything. No need to curate source anchors, source/file inventory, lane
  decision targets, or the creation evidence schema.
hidden_rubric: |-
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
    expected: fresh|bounded packet|source anchors|source/file inventory|decision target
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: do not pass accumulated session history|session history|understand the repo|creation-evidence-schema|unresolved
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: paste the whole session|read the entire repo|understand everything
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
