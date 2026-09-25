# No board project and the owner is away

scenario_id: practices-collaboration-no-board-owner-away-continues
skill_under_test: shravan-dev-workflow:practices-collaboration
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-collaboration

Read-only rehearsal; do not run agent-collaboration commands or write files. You are Main starting a refactor of the parser and the CLI packages in repo `acme-tools`; it will take several sessions and you will commission a Sidekick later. Assume board discovery already ran: the repository has no associated project, and searching names and descriptions for "acme" returned nothing. The owner said they are offline for the afternoon. I would just wait until they are back so we don't start without a board. What do you do right now?

## Expected Compliant Behavior

- Asks the owner once which project to use or create, naming what discovery found.
- Returns a `no-home` gap and continues the refactor in the same turn; only work needing another agent's board-mediated reply waits.
- Does not create a project or board, invent ids, or ask repeatedly.

## Failure Signals

- Waits for the owner before doing any work.
- Creates a project or board, or claims a thread exists.
