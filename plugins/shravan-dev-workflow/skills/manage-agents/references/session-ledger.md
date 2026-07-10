# Session Ledger

Load this when subordinate work must be resumed, monitored, queued, cancelled,
or reduced across more than one turn or more than one agent.

## Ledger Rule

Persistent advisors and sidekicks need a ledger before follow-ups. The parent
needs enough identity to resume the right conversation and enough state to
decide whether a result is fresh.

Completion: every persistent agent has one current ledger row before a
follow-up or reduction claim is made.

## Minimal Row

```text
agent name:
category: advisor | sidekick
assignment:
assignment id:
continuity reason:
provider / command:
model / reasoning level:
cwd:
session name:
session mode: persistent | oneshot
permission boundary:
created / ensured by:
status:
queued work:
last prompt:
last checked:
receipt expected:
receipt level:
receipt scope:
parent verification:
notes:
```

Use `session mode: oneshot` only to document why no persistent resume is
expected.

## Identity Fields

ACPX session-control JSON can include both local and provider-native ids.

- `acpxRecordId`: local record id.
- `acpxSessionId`: ACPX-side session id.
- `agentSessionId`: provider-native id when exposed by the adapter.

Do not pass an ACPX id to a native provider CLI unless the provider-native id is
present and the provider docs say it is accepted.

Completion: the ledger names which id is local and which id, if any, belongs to
the provider.

Troubleshooting source: https://acpx.sh/sessions.html

## Creation And Resume

Use `sessions ensure` for idempotent setup in scripts or repeatable workflows.
Use `sessions new` when intentionally starting over. Both accept
`--resume-session <provider-session-id>` when intentionally attaching an
existing provider session.

`sessions new` requires an explicit continuity-reset reason. Reconnect, auth,
model rejection, permission failure, or provider session limits do not by
themselves authorize replacement-session creation. Inspect the same scope,
reuse or resume when valid, use a declared fallback, or report blocked.

```bash
acpx <agent> sessions ensure --name <name>
acpx <agent> sessions new --name <name>
acpx <agent> sessions ensure --name <name> \
  --resume-session <provider-session-id>
acpx <agent> -s <name> 'continue the scoped job'
```

Completion: the parent can explain whether the session was created, resumed,
idle, running, dead, or missing.

## Provider-Ready Lifecycle

Treat persistent startup as staged evidence:

```text
local record -> provider attached -> selected model active
             -> assignment-bound output -> parent-verified claim
```

Before the first prompt, record the identity tuple: resolved agent command,
absolute cwd, session name, local ACPX ids, and provider-native id when exposed.
Also record the configuration tuple: selected model, reasoning level, and
permission boundary. Hold both constant across lifecycle calls unless a
deliberate control or assignment transition is recorded in the ledger before
the next call; identity changes create or resume a different relationship.

Local record creation proves only local state. Provider capability, status, or
turn evidence must establish provider attachment and the selected model before
the run is described as model-correct. Assignment output must bind to the
current assignment id and decision target before reduction.

| Signal | Required action |
| --- | --- |
| reconnect requested | Retry or resume the same scoped relationship; do not create a replacement name. |
| local session missing | Inspect `sessions list --local` for the exact command and cwd, then ensure or intentionally resume. |
| authentication failure | Repair authentication or report blocked; local creation is not success. |
| model rejected or substituted | Inspect the advertised catalog, use the declared fallback, or report degraded/blocked. |
| permission failure | Correct the narrow policy deliberately or report blocked; do not broaden silently. |
| provider session limit | Stop creating sessions; reuse/resume, choose the declared fallback, defer, or report blocked. |

Completion: the ledger distinguishes local existence, provider readiness,
model correctness, assignment output, and parent verification.

## Progress Checks

Use the `status` command owned by `runtime-control.md` to check local process
state. It is useful for deciding whether a queue owner is running, idle, dead,
or missing, but it does not prove the agent's task succeeded.

Use `history` or captured JSON/quiet output to find completed turn content.
Use parent verification to accept or reject claims from that content.

Completion: progress checks separate liveness from correctness.

```bash
acpx <agent> sessions show <name>
acpx <agent> sessions history <name> --limit 20
acpx <agent> sessions read <name>
acpx <agent> sessions read <name> --tail 20
```

`history` returns recent saved-entry previews and defaults to 20 entries.
`read` returns full saved history, or a bounded tail with `--tail`. Use `read`
when reduction depends on complete turn content; do not call `history` the full
transcript.

## Finding The Right Scope

Session names are not global identities. ACPX persistent scope is:

```text
(resolved agent command, absolute cwd, optional session name)
```

Before declaring a named session missing, list local records and inspect their
cwd and resolved agent command:

```bash
acpx <agent> sessions list --local
```

The unqualified `sessions list` uses the provider's ACP `session/list` when the
adapter advertises it. `--local` reads ACPX records and must be inspected for
the exact cwd. Provider-side listing can be filtered separately:

```bash
acpx <agent> sessions list --filter-cwd /absolute/repo
acpx <agent> sessions list --cursor <opaque-provider-cursor>
```

`--filter-cwd` and `--cursor` apply to provider session listing; they are not a
replacement for local-record inspection.

Completion: the parent locates the matching cwd and resolved command before
history, resume, or missing-session claims.

## Archive, Close, And Retention

```bash
acpx <agent> sessions export <name> --output <archive-path>
acpx <agent> sessions export <name> --cwd /absolute/repo \
  --output <archive-path>
acpx <agent> sessions import <archive-path> --name <new-name> \
  --cwd /absolute/repo
acpx <agent> sessions close <name>
acpx <agent> sessions prune --dry-run --older-than 14 # days
acpx <agent> sessions prune --before 2026-07-01 --include-history
```

- Export/import is for portable ACPX records and event history. Import still
  depends on the destination provider being able to resume the provider id.
- `close` closes the current cwd's default or named session.
- `prune` only targets closed records. Use `--dry-run` first. Add
  `--include-history` only when event-stream deletion is intended.

Completion: destructive retention work is previewed and its history-deletion
scope is explicit.

## Reduction Receipt

Use these receipt levels:

- `local`: local record or liveness only;
- `provider-active`: provider attached and selected model evidenced;
- `assignment-output`: captured output bound to the current session scope,
  assignment id, decision target, and source/head version;
- `parent-verified`: the parent checked the accepted claim against primary
  evidence.

Only current `assignment-output` enters reduction. If queued work completes
after the assignment, decision target, session scope, or source/head version
changes, mark the receipt `stale`; do not reduce it as current evidence.

When reducing a persistent agent result, record:

```text
source agent:
category: advisor | sidekick
prompt/job:
assignment id:
status:
receipt level:
receipt scope:
candidate result:
evidence cited by child:
parent checks run:
accepted:
rejected / unverified:
follow-up:
```

Completion: every accepted result has a parent check or a clearly labeled proof
gap.
