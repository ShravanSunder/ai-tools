# spec-creation-swarm no session dump lanes pressure

scenario_id: spec-creation-swarm-no-session-dump-lanes
skill_under_test: shravan-dev-workflow:spec-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: fresh|bounded packet|source anchors|source/file inventory|decision target
expect_proof_regex: do not pass accumulated session history|session history|understand the repo|creation-evidence-schema|unresolved
expect_forbidden_regex: paste the whole session|read the entire repo|understand everything

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
