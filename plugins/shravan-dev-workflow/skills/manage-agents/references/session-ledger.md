# Session Ledger

Persistent Advisors, Sidekicks, and Review Sidekicks need one current ledger row before prompts that assume continuity.

## Row

```text
agent name / pattern / assignment / assignment id:
continuity reason:
route (the assignment contract's runtime detail) / budget:
resolved launcher / provider command:
working scope / relationship name:
runtime ids / provider-native id when exposed:
permission boundary:
status / queued work / last prompt / last checked:
return expected / receipt level / return binding: <session, assignment id, decision target, source/head version>
parent verification / next follow-up:
```

In the existing route/runtime slots, label the transport and each ID: ACPX record, provider-native session, or full Router SessionRef. An ACPX name/record ID is not a Router address. A Router mapping is usable only after discovery verifies the same provider-native conversation. Keep runtime-local ids with their originating runtime. A ledger agent name does not prove a visible session title; record verified rename/display evidence in the existing resolved-launcher or runtime-id slot when the host supports it. Transfer identity through a provider-native id only when the receiving runtime documents support for it.

## Create Or Resume

Reuse the same Sidekick, Advisor, or Review Sidekick conversation across follow-ups and corrections unless the relationship is explicitly replaced. Update the assignment and validate any changed scope without creating a new session. Inspect existing records/reconnect support before a reset; record an explicit continuity-reset reason only when the relationship is deliberately replaced.

## Continuity and cost

Cache state is unknown unless observed. A cold resume does not invalidate the session or its assignment, and neither cache expiry nor idle time replaces a persistent relationship. Do not add periodic maintenance or heartbeat timers to this ledger. A useful follow-up reuses identity and scope rather than creating another relationship.

## Readiness Lifecycle

```text
local record -> provider attached -> selected model active
             -> assignment-bound output -> parent-verified claim
```

Identity is the resolved runtime, launcher, provider command, working scope, relationship name, and exposed ids. Configuration is model, reasoning effort, and permissions. Keep both stable or record a deliberate transition before the next call.

| Signal                     | Action                                                                                                 |
| ---                        | ---                                                                                                    |
| reconnect requested        | Resume/retry the same scope.                                                                           |
| local relationship missing | Inspect runtime records for matching runtime and working scope, then resume or intentionally recreate. |
| auth failure               | Repair auth or report blocked; confirm provider readiness afterward.                                   |
| model rejected/substituted | Use an advertised equivalent or report degraded/blocked.                                               |
| permission failure         | Correct the narrow policy or report blocked; obtain approval for broader permissions.                  |
| provider session limit     | Stop creating; reuse/resume, use declared fallback, defer, or report blocked.                          |

## Progress And Scope

A runtime status proves liveness only. Recent previews and saved history must be matched to the ledger's runtime identity, working scope, assignment, and source version before they can enter reduction.

## Receipt Freshness

`agent-job-packet.md` owns receipt levels and their proof meaning. This ledger applies persistence freshness: mark queued output `stale` when assignment, decision target, session scope, or source/head version changed.
