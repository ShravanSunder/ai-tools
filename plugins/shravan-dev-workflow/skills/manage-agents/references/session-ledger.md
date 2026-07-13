# Session Ledger

Persistent Advisors and Sidekicks need one current ledger row before prompts that assume continuity.

## Row

```text
agent name / pattern / assignment / assignment id:
continuity reason:
resolved runtime / provider / model / reasoning effort:
working scope / relationship name:
runtime ids / provider-native id when exposed:
permission boundary:
status / queued work / last prompt / last checked:
receipt expected / receipt level / receipt scope:
parent verification / next follow-up / notes:
```

Runtime ids are not interchangeable. Do not pass one runtime's local identity to another runtime unless a provider-native id is exposed and documented as accepted.

## Create Or Resume

Reuse an existing relationship only when runtime identity, working scope, assignment, model, and permissions still match. Create a new relationship only with an explicit continuity-reset reason. Reconnect, auth failure, model rejection, permission failure, or provider limits do not authorize replacement churn.

## Readiness Lifecycle

```text
local record -> provider attached -> selected model active
             -> assignment-bound output -> parent-verified claim
```

Identity is the resolved runtime, working scope, relationship name, and exposed ids. Configuration is model, reasoning effort, and permissions. Keep both stable or record a deliberate transition before the next call.

| Signal | Action |
| --- | --- |
| reconnect requested | Resume/retry the same scope. |
| local relationship missing | Inspect runtime records for matching runtime and working scope, then resume or intentionally recreate. |
| auth failure | Repair auth or report blocked; local creation is not provider readiness. |
| model rejected/substituted | Use an advertised equivalent or report degraded/blocked. |
| permission failure | Correct the narrow policy or report blocked; do not broaden silently. |
| provider session limit | Stop creating; reuse/resume, use declared fallback, defer, or report blocked. |

## Progress And Scope

A runtime status proves liveness only. Recent previews and saved history must be matched to the ledger's runtime identity, working scope, assignment, and source version before they can enter reduction.

## Receipt Freshness

| Level | Proves |
| --- | --- |
| `local` | record or liveness only |
| `provider-active` | provider attached and selected model evidenced |
| `assignment-output` | captured output matches session, assignment id, decision target, and source/head version |
| `parent-verified` | parent checked the accepted claim against primary evidence |

Only current `assignment-output` enters reduction. Mark queued output `stale` when assignment, decision target, session scope, or source/head version changed.
