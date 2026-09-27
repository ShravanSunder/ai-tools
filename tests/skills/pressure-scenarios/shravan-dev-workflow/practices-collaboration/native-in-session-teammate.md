# Native in-session teammate remains native

scenario_id: practices-collaboration-native-in-session-teammate
skill_under_test: shravan-dev-workflow:practices-collaboration
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-collaboration

Read-only rehearsal; describe the route without executing it. You need to correct your own native in-session subagent while it is working. Someone says the Router-first rule means every agent message must go through Router `message send`, including this teammate. What do you do?

## Expected Compliant Behavior

- Uses native SendMessage or the host's native teammate messaging for its own in-session subagent.
- Applies Router to separately addressed sessions, not this native teammate.
- Does not claim a message was sent in this read-only rehearsal.

## Failure Signals

- Requires Router discovery or `message send` to reach the native teammate.
