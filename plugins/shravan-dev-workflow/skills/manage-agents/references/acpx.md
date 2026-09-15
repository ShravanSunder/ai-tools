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
- xAI lineage through Cursor provider: call the `cursor` provider and load `acpx-provider-cursor.md`.

When the user explicitly selects Cursor as the provider for an OpenAI or Claude model, call `cursor` and load `acpx-provider-cursor.md`.

Build the call with the selected provider token, exact model id, and advertised reasoning control. For persistent relationships, record provider-command overrides in the relationship ledger.

## Call An Agent

- Review (any independent review or verification): use a named session. Never `exec`.
- Other Worker or Operator work: `exec` is allowed.
- Advisor, Sidekick, or continuing Reviewer: use a named session for ledgered continuity.
- Never pass `--timeout` on any ACPX call. A dropped client wait is not a missing receipt — read `sessions list --local`, `sessions show`, or `sessions read` before any `blocked` claim.

Start a review with a new named session. For a new single-assignment Worker or Operator, start without prior agent-session history using a single call or new named session. Sidekicks and Advisors always continue their established named session unless the relationship is explicitly replaced.

Set the narrowest permission boundary that performs the assignment. ACPX permission policy matches tool names and kinds, never paths — it cannot scope writes to specific directories, and none of this is an OS sandbox:

- `workspace read-only`: `--approve-reads --no-terminal --non-interactive-permissions fail` — auto-approves reads, fail-closed on writes and exec; an ACPX permission layer, not a read-only mount, and not a reason to skip native spawn. The assignment contract still allows project `tmp/` and system `/tmp`; it still forbids repo file edits.
- `write <paths> (declared)`: `--approve-all` plus the assignment contract's bright-line authority — "edit only under <paths>; an edit outside them is a stop condition, return blocked." The parent verifies the receipt's diff stayed inside the declared scope.
- Unattended call: `--non-interactive-permissions fail`.

Resolve one stable `<provider-agent-command>` from the provider contract. It includes the launcher, required environment, absolute cwd, permission boundary, provider token, and exact model selection. Use it for every lifecycle call in the relationship.

Review (named session only):

```bash
<provider-agent-command> sessions new --name <relationship-name>

<provider-agent-command> -s <relationship-name> \
  --file tmp/agent-packet.md
```

Single call (non-review only):

```bash
<provider-agent-command> exec \
  --file tmp/agent-packet.md
```

Inherited relationship (inspect the recorded session first; do not create on lookup failure):

```bash
<provider-agent-command> sessions show <relationship-name>

<provider-agent-command> -s <relationship-name> \
  --file tmp/agent-packet.md
```

Use `--resume-session <provider-session-id>` to reconnect a documented provider-native session.

Before continuing an established Sidekick or Advisor, inspect its named record with `sessions show` and retain the returned ACPX record/provider-native session IDs. Use the same provider command, cwd, relationship name and `-s` on each prompt. A new task inside that relationship updates its assignment context; it does not use `exec` or `sessions new`.

If a local record is missing, inspect `sessions list --local` and the selected provider's documented reconnect support before `sessions ensure`, because ensure may create a new session. A missing record, idle process, cache expiry or dropped wait is not proof that the conversation is lost. Create a replacement only after identifying the missing/irrecoverable state and explicitly recording the relationship reset; do not silently reset continuity.

For continuation proof, compare the record/provider-native identity before and after the resumed prompt and inspect the assignment-bound response. Queue acknowledgement alone is not proof of re-entry or completion. If the adapter cannot expose or preserve the required identity, report the capability gap rather than claiming same-session operation. Stop the probe when preserved identity and an attributable response are observed, or the exact failure is established.

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

| Consumer                       | Format           |
| ---                            | ---              |
| Human terminal                 | text             |
| Final agent response           | `--format quiet` |
| Structured transcript evidence | `--format json`  |

For persistent relationships, use `session-ledger.md` to verify identity and receipt freshness. The parent verifies every assignment-bound output before accepting its claims.
