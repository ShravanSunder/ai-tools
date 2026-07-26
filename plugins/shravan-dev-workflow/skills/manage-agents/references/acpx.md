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

Build the call with that provider token, the exact model id, and its advertised reasoning control. Record provider-command overrides in the relationship ledger. Route adapter implementation to `building-acp-adapters.md`.

## Call An Agent

Global options precede the agent, agent options follow it, and command options follow the command.

- Delegate or Operator: use `exec` for one bounded assignment and receipt.
- Advisor or Sidekick: use a named session for ledgered continuity.

Set the narrowest permission boundary that performs the assignment:

- Packet contains all evidence: `--deny-all --no-terminal`.
- Agent reads source: `--approve-reads --no-terminal`.
- Authorized implementation: `--approve-all`.
- Unattended call: `--non-interactive-permissions fail`.

One-shot call:

```bash
acpx --cwd /absolute/repo --model '<provider-model-id>' \
  --approve-reads --no-terminal <agent> exec \
  --file tmp/agent-packet.md
```

Persistent call:

```bash
acpx --cwd /absolute/repo --model '<provider-model-id>' \
  --approve-reads --no-terminal \
  --non-interactive-permissions fail \
  <agent> sessions ensure --name <relationship-name>

acpx --cwd /absolute/repo --approve-reads --no-terminal \
  --non-interactive-permissions fail \
  <agent> -s <relationship-name> \
  --file tmp/agent-packet.md
```

Use `sessions ensure` for idempotent reuse, `sessions new` for a ledgered continuity reset, and `--resume-session <provider-session-id>` to reconnect a documented provider-native session.

## Continue Or Control A Relationship

Queue a follow-up in the same relationship:

```bash
acpx <agent> -s <relationship-name> --no-wait \
  'continue the current assignment with this additional evidence'
```

Default submission waits for completion. `--no-wait` returns after queue acknowledgement; read the assignment receipt after the active turn drains.

Inspect and control the relationship:

```bash
acpx <agent> status -s <relationship-name>
acpx <agent> cancel -s <relationship-name>
acpx <agent> set-mode <provider-mode> -s <relationship-name>
acpx <agent> set model <provider-model-id> -s <relationship-name>
acpx <agent> set effort <provider-effort> -s <relationship-name>
```

Use provider-advertised model, effort, and mode values. Record configuration transitions in the relationship ledger. Treat cancellation as cooperative and status as liveness evidence.

## Read The Receipt

Inspect local relationship records:

```bash
acpx <agent> sessions show <relationship-name>
acpx <agent> sessions history <relationship-name> --limit 20
acpx <agent> sessions read <relationship-name> --tail 20
acpx <agent> sessions list --local
```

Choose output for the receipt consumer:

| Consumer | Format |
| --- | --- |
| Human terminal | text |
| Final agent response | `--format quiet` |
| Structured transcript evidence | `--format json` |

Use `session-ledger.md` to verify relationship identity and receipt freshness. The parent verifies assignment-bound output before accepting its claims.
