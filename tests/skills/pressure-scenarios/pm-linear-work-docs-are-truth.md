# pm-linear-work docs are truth pressure

scenario_id: pm-linear-work-docs-are-truth
skill_under_test: shravan-dev-workflow:pm-linear-work
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: docs are truth|tickets are tracking|dependencies|MCP|CLI|doc sections

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

$shravan-dev-workflow:pm-linear-work

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
