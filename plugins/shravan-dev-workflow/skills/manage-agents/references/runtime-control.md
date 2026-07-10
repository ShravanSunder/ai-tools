# Runtime Control

## Command Shape

Global options precede the provider; provider options follow it; command
options follow the command.

```bash
acpx --cwd /absolute/repo --approve-reads claude -s advisor \
  --file tmp/advisor-packet.md
acpx --format quiet --deny-all --no-terminal codex exec \
  --file tmp/review-packet.md
```

## Prompt Or Exec

| Need | Command | Continuity |
| --- | --- | --- |
| One bounded Delegate/Operation | `acpx <agent> exec ...` | none |
| Persistent Advisor/Sidekick | `sessions ensure/new`, then prompt or bare call with `-s` | ledgered session |
| Follow-up after active turn | persistent prompt with `--no-wait` | queued in same session |

`exec` has no resume expectation. Persistent prompt identity and scope are owned
by `session-ledger.md`.

## Queue Or Steer

- Default queue submission waits for the queued prompt to finish.
- `--no-wait` returns after acknowledgement; the prompt runs after the active
  turn drains.
- Steer means immediate in-flight injection and requires an explicit runtime
  capability. ACPX 0.12 has no generic `steer` command.

Do not report queue acknowledgement as steering or completion.

## Session Controls

```bash
acpx <agent> status -s <name>
acpx <agent> cancel -s <name>
acpx <agent> set-mode <mode> -s <name>
acpx <agent> set model <model-id> -s <name>
acpx <agent> set effort <level> -s <name>
```

`cancel` is cooperative. Modes and config keys are adapter-advertised. Do not
invent creation flags such as `sessions ensure --effort`. Status proves local
liveness only.

## Permissions

```bash
acpx --deny-all --no-terminal <agent> exec 'packet-only prompt'
acpx --approve-reads --no-terminal <agent> exec 'source review'
acpx --approve-reads <agent> 'inspect files and ask before writes'
acpx --approve-all <agent> 'apply the explicitly scoped patch'
```

Use the narrowest boundary that can perform the assignment. Keep
`--non-interactive-permissions fail` for unattended runs, and never broaden an
Advisor or reviewer merely because a read request failed.

Troubleshooting: https://acpx.sh/prompting.html,
https://acpx.sh/session-control.html, and https://acpx.sh/permissions.html
