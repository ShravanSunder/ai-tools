# Session Ledger

Load this when subordinate work must be resumed, monitored, queued, cancelled,
or reduced across more than one turn or more than one agent.

## Ledger Rule

Persistent sidekicks need a ledger before follow-ups. The parent needs enough
identity to resume the right conversation and enough state to decide whether a
result is fresh.

Completion: every persistent sidekick has one current ledger row before a
follow-up or reduction claim is made.

## Minimal Row

```text
agent name:
provider / command:
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
Use `sessions new` when intentionally starting over. Use `sessions show`,
`history`, and `status` to inspect before reducing a long-running job.

```bash
acpx <agent> sessions ensure --name <name>
acpx <agent> -s <name> 'continue the scoped job'
acpx <agent> status -s <name>
acpx <agent> sessions history <name> --limit 20
```

Completion: the parent can explain whether the session was created, resumed,
idle, running, dead, or missing.

## Progress Checks

Polling `status` checks local process state only. It is useful for deciding
whether a queue owner is running, idle, dead, or missing, but it does not prove
the agent's task succeeded.

Use `history` or captured JSON/quiet output to find completed turn content.
Use parent verification to accept or reject claims from that content.

Completion: progress checks separate liveness from correctness.

## Reduction Receipt

When reducing a sidekick result, record:

```text
source sidekick:
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
