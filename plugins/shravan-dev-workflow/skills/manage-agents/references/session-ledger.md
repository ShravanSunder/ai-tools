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

```bash
acpx <agent> sessions ensure --name <name>
acpx <agent> sessions new --name <name>
acpx <agent> sessions ensure --name <name> \
  --resume-session <provider-session-id>
acpx <agent> -s <name> 'continue the scoped job'
```

Completion: the parent can explain whether the session was created, resumed,
idle, running, dead, or missing.

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

When reducing a persistent agent result, record:

```text
source agent:
category: advisor | sidekick
prompt/job:
status:
candidate result:
evidence cited by child:
parent checks run:
accepted:
rejected / unverified:
follow-up:
```

Completion: every accepted result has a parent check or a clearly labeled proof
gap.
