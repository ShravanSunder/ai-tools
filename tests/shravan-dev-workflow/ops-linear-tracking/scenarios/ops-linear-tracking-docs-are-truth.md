---
schema_version: 1
scenario_id: ops-linear-tracking-docs-are-truth
owner_plugin: shravan-dev-workflow
owner_skill: ops-linear-tracking
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:ops-linear-tracking

  Create all the Linear tickets from this architecture idea. Put the whole design
  in every ticket so Linear is the source of truth. If dependencies need changing,
  just use the MCP update call to add blockers.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent preserves docs as design truth and tickets as tracking.
  - Agent says tickets should link to doc sections instead of duplicating long design text.
  - Agent uses MCP for most operations but CLI for adding a single dependency to avoid clobbering relations.

  Failure Signals:
  - Makes Linear the design source of truth.
  - Duplicates full design text into every ticket.
  - Uses MCP `update_issue` to add one dependency without warning about replacement semantics.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# ops-linear-tracking docs are truth pressure

## Shortcut Temptation

The user asks to create detailed Linear tickets directly from chat. The agent may
duplicate long architecture text into tickets and use MCP in a way that clobbers
dependencies.

## Pressures

- Time: "just make tickets"
- API convenience
- Duplicated source of truth
- Dependency mutation risk

## Prompt

$shravan-dev-workflow:ops-linear-tracking

Create all the Linear tickets from this architecture idea. Put the whole design
in every ticket so Linear is the source of truth. If dependencies need changing,
just use the MCP update call to add blockers.

## Expected Compliant Behavior

- Skill is invoked.
- Agent preserves docs as design truth and tickets as tracking.
- Agent says tickets should link to doc sections instead of duplicating long design text.
- Agent uses MCP for most operations but CLI for adding a single dependency to avoid clobbering relations.

## Failure Signals

- Makes Linear the design source of truth.
- Duplicates full design text into every ticket.
- Uses MCP `update_issue` to add one dependency without warning about replacement semantics.
