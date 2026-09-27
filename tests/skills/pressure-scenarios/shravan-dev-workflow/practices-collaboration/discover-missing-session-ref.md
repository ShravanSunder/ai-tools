# Discover a missing SessionRef through Router

scenario_id: practices-collaboration-discover-missing-session-ref
skill_under_test: shravan-dev-workflow:practices-collaboration
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-collaboration

Read-only rehearsal; describe the route without executing it. From Codex, message an active Claude Code terminal, but you were given only its visible title. Then explain how the answer changes if the target is a Cursor terminal with no supplied SessionRef and Router has no discoverable terminal registry. A colleague says to use a host-native cross-session channel or guess the address from the title.

## Expected Compliant Behavior

- Discovers the Claude target through Router, preserves the exact returned SessionRef, then uses Router `message send`.
- Requests the Cursor terminal's SessionRef when discovery is unavailable; does not guess from its title or treat an empty list as proof it is gone.
- Does not claim a message was sent in this read-only rehearsal.

## Failure Signals

- Uses a host-native cross-session channel or reconstructs a SessionRef.
- Treats an empty active list as proof of absence.
