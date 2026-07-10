# Session Ledger

Persistent Advisors and Sidekicks need one current ledger row before prompts
that assume continuity.

## Row

```text
agent name / pattern / assignment / assignment id:
continuity reason:
resolved command / provider / model / reasoning effort:
absolute cwd / session name:
ACPX ids / provider-native id when exposed:
permission boundary:
status / queued work / last prompt / last checked:
receipt expected / receipt level / receipt scope:
parent verification / next follow-up / notes:
```

ACPX ids are local runtime identities. Do not pass one to a native provider CLI
unless a provider-native id is exposed and documented as accepted.

## Create Or Resume

```bash
acpx <agent> sessions ensure --name <name>
acpx <agent> sessions new --name <name>
acpx <agent> sessions ensure --name <name> \
  --resume-session <provider-session-id>
acpx <agent> -s <name> 'continue the scoped job'
```

Use `ensure` for intentional idempotent reuse and `new` only with an explicit
continuity-reset reason. Reconnect, auth failure, model rejection, permission
failure, or provider limits do not authorize replacement-session churn.

## Readiness Lifecycle

```text
local record -> provider attached -> selected model active
             -> assignment-bound output -> parent-verified claim
```

Identity is the resolved command, absolute cwd, session name, and exposed ids.
Configuration is model, reasoning effort, and permissions. Keep both stable or
record a deliberate transition before the next call.

| Signal | Action |
| --- | --- |
| reconnect requested | Resume/retry the same scope. |
| local session missing | Inspect local records for exact command and cwd, then ensure or intentionally resume. |
| auth failure | Repair auth or report blocked; local creation is not provider readiness. |
| model rejected/substituted | Use an advertised equivalent or report degraded/blocked. |
| permission failure | Correct the narrow policy or report blocked; do not broaden silently. |
| provider session limit | Stop creating; reuse/resume, use declared fallback, defer, or report blocked. |

## Progress And Scope

```bash
acpx <agent> sessions show <name>
acpx <agent> sessions history <name> --limit 20
acpx <agent> sessions read <name> --tail 20
acpx <agent> sessions list --local
```

`status`/`show` proves liveness. `history` is a recent preview; `read` is saved
history. Before declaring a session missing, match the local record's resolved
command and absolute cwd. Session names are not global.

Provider-side `sessions list --filter-cwd` and `--cursor` are separate from
local record inspection.

## Receipt Freshness

| Level | Proves |
| --- | --- |
| `local` | record or liveness only |
| `provider-active` | provider attached and selected model evidenced |
| `assignment-output` | captured output matches session, assignment id, decision target, and source/head version |
| `parent-verified` | parent checked the accepted claim against primary evidence |

Only current `assignment-output` enters reduction. Mark queued output `stale`
when assignment, decision target, session scope, or source/head version changed.
