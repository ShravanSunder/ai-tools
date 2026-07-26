# ACPX Agent Calls

Use ACPX for cross-provider agent calls and ACPX-persistent Advisor or Sidekick relationships.

## Select The Provider

Use the first available launcher and keep it stable for persistent relationships:

```text
acpx -> pnpm dlx acpx -> npx --yes acpx
```

Before every call, select the provider that owns the chosen model lineage and load its contract:

- OpenAI lineage: call the `codex` provider and load `acpx-provider-codex.md`.
- Claude lineage: call the `claude` provider and load `acpx-provider-claude.md`.
- Cursor lineage: call the `cursor` provider and load `acpx-provider-cursor.md`.

When the user explicitly selects Cursor as the provider for an OpenAI or Claude model, call `cursor` and load `acpx-provider-cursor.md`.

Build the call with the selected provider token, exact model id, and advertised reasoning control. For persistent relationships, record provider-command overrides in the relationship ledger.

## Call An Agent

- Delegate or Operator: use `exec` for one bounded assignment and receipt.
- Advisor or Sidekick: use a named session for ledgered continuity.

Start without prior agent-session history by using a one-shot call or a new named session. Reuse a named session when the parent selects continuity.

Set the narrowest permission boundary that performs the assignment:

- Agent reads source and packet: `--approve-reads --no-terminal`.
- Authorized implementation: `--approve-all`.
- Unattended call: `--non-interactive-permissions fail`.

Resolve one stable `<provider-agent-command>` from the provider contract. It includes the launcher, required environment, absolute cwd, permission boundary, provider token, and exact model selection. Use it for every lifecycle call in the relationship.

One-shot call:

```bash
<provider-agent-command> exec \
  --file tmp/agent-packet.md
```

New named conversation:

```bash
<provider-agent-command> sessions new --name <relationship-name>

<provider-agent-command> -s <relationship-name> \
  --file tmp/agent-packet.md
```

Inherited relationship:

```bash
<provider-agent-command> sessions ensure --name <relationship-name>

<provider-agent-command> -s <relationship-name> \
  --file tmp/agent-packet.md
```

Use `--resume-session <provider-session-id>` to reconnect a documented provider-native session.

## Continue Or Control A Relationship

Queue a follow-up in the same relationship:

```bash
<provider-agent-command> -s <relationship-name> --no-wait \
  'continue the current assignment with this additional evidence'
```

Default submission waits for completion. `--no-wait` returns after queue acknowledgement; read the assignment receipt after the active turn drains.

Inspect and control the relationship:

```bash
<provider-agent-command> status -s <relationship-name>
<provider-agent-command> cancel -s <relationship-name>
```

Follow the selected provider contract for model, effort, or mode transitions and record them in the relationship ledger. Treat cancellation as cooperative and status as liveness evidence.

## Read The Receipt

Inspect local relationship records:

```bash
<provider-agent-command> sessions show <relationship-name>
<provider-agent-command> sessions history <relationship-name> --limit 20
<provider-agent-command> sessions read <relationship-name> --tail 20
<provider-agent-command> sessions list --local
```

Choose output for the receipt consumer:

| Consumer | Format |
| --- | --- |
| Human terminal | text |
| Final agent response | `--format quiet` |
| Structured transcript evidence | `--format json` |

For persistent relationships, use `session-ledger.md` to verify identity and receipt freshness. The parent verifies every assignment-bound output before accepting its claims.
