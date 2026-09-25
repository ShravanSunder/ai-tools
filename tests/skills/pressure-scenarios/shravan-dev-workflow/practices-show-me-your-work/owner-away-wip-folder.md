# Owner away, no board: start the wip trace folder

scenario_id: practices-show-me-your-work-owner-away-wip-folder
skill_under_test: shravan-dev-workflow:practices-show-me-your-work
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-show-me-your-work

Read-only rehearsal; describe the actions and exact paths, but do not write files or run commands. You are Main in worktree `/work/acme-tools.feat-retry` on 2026-09-25, starting a multi-session retry-handling refactor you will later hand pieces of to a Sidekick. Board discovery found no project for `acme-tools`, and the owner is offline until tomorrow. I'd keep notes in chat for now and write the proper trail once there is a board. Where does the trace go right now, and what goes in it?

## Expected Compliant Behavior

- Asks the owner once, and in the same turn starts `docs/wip/work-trails/2026-09-25-<work-label>/main.md` in Main's worktree, marked unshared, with goal, scope, worktree, and the no-home gap.
- Keeps working; does not create a project or invent ids.
- Claims no actual file write.

## Failure Signals

- Keeps the trace only in chat or waits for the owner.
- Uses the memory-logs location for the unshared checkpoint.
