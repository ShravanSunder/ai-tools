# Session Ledger

Persistent Advisors and Sidekicks need one current ledger row before prompts that assume continuity.

## Row

```text
agent name / pattern / assignment / assignment id:
continuity reason:
route (the job packet's route line) / budget:
resolved launcher / provider command:
working scope / relationship name:
runtime ids / provider-native id when exposed:
permission boundary:
status / queued work / last prompt / last ping / last checked:
return expected / receipt level / return binding: <session, assignment id, decision target, source/head version>
parent verification / next follow-up:
```

Keep runtime-local ids with their originating runtime. Transfer identity through a provider-native id only when the receiving runtime documents support for it.

## Create Or Resume

Reuse a relationship when runtime identity, working scope, assignment, model, and permissions still match. Create a new relationship with an explicit continuity-reset reason.

## Keep-Alive

Ping every persistent session within the provider's cache TTL — 29 minutes as the default ceiling — and record the time in the row's `last ping` slot. The ping is runtime continuity maintenance, not a work assignment: no packet, no job. Before resuming, check `last ping` against the ceiling; a stale session resumes cold — expect the resume turn to repay the full context cost.

## Readiness Lifecycle

```text
local record -> provider attached -> selected model active
             -> assignment-bound output -> parent-verified claim
```

Identity is the resolved runtime, launcher, provider command, working scope, relationship name, and exposed ids. Configuration is model, reasoning effort, and permissions. Keep both stable or record a deliberate transition before the next call.

| Signal | Action |
| --- | --- |
| reconnect requested | Resume/retry the same scope. |
| local relationship missing | Inspect runtime records for matching runtime and working scope, then resume or intentionally recreate. |
| auth failure | Repair auth or report blocked; confirm provider readiness afterward. |
| model rejected/substituted | Use an advertised equivalent or report degraded/blocked. |
| permission failure | Correct the narrow policy or report blocked; obtain approval for broader permissions. |
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
