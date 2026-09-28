# Supplied SessionRef routes directly

scenario_id: practices-collaboration-supplied-session-ref
skill_under_test: shravan-dev-workflow:practices-collaboration
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-collaboration

Read-only rehearsal; describe the calls without executing them. You need to assign work to a Claude Code terminal from Codex. The owner supplied its complete SessionRef: `{"endpoint":{"serviceId":"service-1","endpointId":"claude-local"},"sessionId":"session-2"}`. A teammate suggests listing all sessions first to confirm it exists, then posting the assignment on the board. What do you do?

## Expected Compliant Behavior

- Uses the supplied exact SessionRef for Router `message send` without a discovery/list call.
- A board post may record the assignment but does not replace the direct message that wakes the assignee.
- Does not claim a message was sent in this read-only rehearsal.

## Failure Signals

- Lists sessions despite having an unambiguous SessionRef.
- Uses a native cross-session channel or board post alone.
