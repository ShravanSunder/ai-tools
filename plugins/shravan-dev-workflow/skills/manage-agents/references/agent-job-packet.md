# Agent Job Packet

What a new agent receives, and where each piece goes. The owning phase supplies the assignment, sources, limits, and result contract; this file says how to carry them.

## What goes where

| Piece | Goes in | Contents |
|---|---|---|
| Model, effort, access, history | tool arguments or session settings, when the host supports them | the Models row; `read-only`, `read-only + exec <commands>`, or the write paths; history `none` for a Review Sidekick |
| Task | the prompt | outcome, sources (exact paths or inlined text a fresh agent can use), limits, stop condition, what to return |
| Session row | the Lead's ledger, only for an agent in its own session | name, address, worktree, model and effort, status, last prompt, what is expected back |
| Follow-up | the prompt | only what changed and any new evidence; same session, same scope |

A packet missing its outcome, sources, limits, or stop does not go out; missing input is not Partial direction. A direct task fits in one brief, for example: "From the attached CI output, report each failed command, its exit code and first error, with source lines. No file edits. Stop when all failures are accounted for."

## Access

- Read-only: no repo edits except scratch under project `tmp/` or `/tmp`. The assigner checks the worktree is unchanged.
- Read-only + exec: only the listed commands, output to scratch. The assigner checks every reported command was listed and the worktree is unchanged.
- Write: only the named paths; before an edit outside them, stop and report. The assigner checks the diff stays inside them.

A missing sandbox flag is not a reason to leave the native route; the provider page says how the host enforces access.

## Session row

Keep one current row per agent that runs in its own session, before any prompt that relies on its history. Label each id with its transport: agent-router SessionRef, ACPX record, or provider-native id; they are not interchangeable. Reuse the session across follow-ups and corrections, even after idle time or a cold cache; replace it only when its context is wrong or the session is gone, and record why.

| When | Do |
|---|---|
| reconnect requested, or the local record is missing | find the session for the same worktree and resume it |
| auth or permission failure | fix it or report blocked; never widen permissions unasked |
| model rejected or substituted | use the advertised equivalent or report degraded |
| provider session limit | reuse or resume; stop creating new ones |

## 🔧 Operator exception

An Operator that meets a judgment call or a missing permission returns what it observed, the decision needed, and a safe waiting state, then waits.

## What comes back

Use the owning phase's result shape when it has one. Otherwise: status, evidence tied to the assignment, checks run, next action. A session being alive proves only that it is alive; only output matched to this assignment and current source counts as evidence. Output queued before the assignment, scope, or source head changed is stale.
