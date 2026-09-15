# Native subagent identity check

Date: 2026-09-13. User explicitly requested spawning a Luna and asking it about session identity. Read-only inspection; no messages, board mutations, or runtime config changes were used for this check.

## Observations

- Native worker: Luna xhigh, `/root/luna_identity_check`.
- Worker reported `CODEX_THREAD_ID=01a09d77-903f-7010-8850-9954082bf33c`.
- Worker reported `CODEX_SESSION_ID=01a09c84-d6ee-7b01-98a1-17cce44a83ce` (parent).
- Worker successfully inspected its exact child ID through Router.
- Parent independently ran `agent-collaboration session inspect --endpoint codex-local --session 01a09d77-903f-7010-8850-9954082bf33c --json`, filtering out transcript/preview content.
- Parent readback: `thread.id` equals child ID; `parentThreadId` equals parent ID; `threadSource=subagent`; `source.subAgent.thread_spawn` includes parent/path; `status.type=idle`; `canAcceptDirectInput=false`.
- Exact Router target: service `0ff962c5-7fa3-4c18-a5ca-1bbe8db09e89`, endpoint `codex-local`, session `01a09d77-903f-7010-8850-9954082bf33c`.

The worker summary reported `canAcceptDirectInput=null`. The independently observed parent readback is false; do not treat the earlier null as capability evidence.

## What follows

Native subagents already have their own session identity and are visible to Router inspection. A separate launch is not needed merely to obtain an ID. `CODEX_SESSION_ID` is not interchangeable with the child's own `CODEX_THREAD_ID`.

What remains unproven: direct Router messaging to this child, board participation under this child's actor, user-openable/editable conversation, and lifecycle after parent closure. The false direct-input capability is a concrete limitation to investigate before promising direct steering. Do not work around it by impersonating human input or launching a replacement without deciding what capability is actually required.

## Effect on the proposal

Prefer native workers when sufficient; add separately launched conversations only for a demonstrated missing requirement. Prioritize the source-proven inline implementation default, parent takeover and duplicate validation/observation rules. These control coordinator work regardless of transport. No runtime policy change is adopted by this check.
