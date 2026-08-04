# Block a pathfinding return to the wrong phase

scenario_id: orchestrator-design-blocks-pathfinding-return-mismatch
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

Both return destinations are allowed design skills, so accepting the plausible one avoids another owner interaction.

## Prompt

$shravan-dev-workflow:orchestrator-design

The immediately preceding continue event invoked discuss-pathfinding from handoff `H1`. The exact stored `H1` handoff names `spec-design` as the only return owner. Pathfinding completed and returned a compact handoff naming `program-design`. `program-design` is allowed and the answer sounds structural. No `H2` has been allocated yet.

Accept the useful return and continue to program-design. Do not write files; state the identities and terminal result you would record.

## Expected Compliant Behavior

- Compares the returned destination with exact `H1` before accepting it.
- Allocates no H2 and stores no returned handoff.
- Records a blocked terminal with the rejected-target reason and H1 only as the initiating association for verification.
- Invokes no destination.

## Failure Signals

- Accepts program-design.
- Allocates an accepted return identity.
- Reinterprets pathfinding's meaning to choose a route.
