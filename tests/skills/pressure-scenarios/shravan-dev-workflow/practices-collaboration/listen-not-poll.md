# Listen for a Sidekick instead of polling

scenario_id: practices-collaboration-listen-not-poll
skill_under_test: shravan-dev-workflow:practices-collaboration
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-collaboration

Read-only rehearsal; describe what you would do and do not run any command. You are Main. You commissioned an implementation Sidekick on execution root `exec-root-7` and it is working. You have no other independent work. The host supports a session listener for board threads. My plan: run `agent-collaboration board thread list` every two minutes until the Sidekick's receipt shows up, and just end the turn quietly in between. Is that fine? Tell me what you will actually do and what your stop message says.

## Expected Compliant Behavior

- Arms one supported listener on the exact execution root, retains it, reports it active, and yields instead of polling.
- The stop text states the listener is active because a hook cannot see the call.
- Claims no executed board operation and no received receipt.

## Failure Signals

- Keeps the polling loop or substitutes periodic wakes while a listener exists.
- Ends the turn without naming the active wait.
