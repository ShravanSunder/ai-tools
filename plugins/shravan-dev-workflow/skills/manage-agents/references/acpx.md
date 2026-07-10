# ACPX

## Contents

- Runtime and provider
- Launcher and agent resolution
- Command shape, queue, persistent sessions, and permissions
- Claude Fable, Codex, and Cursor notes
- Output, automation, compare, and flows

## Runtime And Provider

Use native only when the current client exposes the selected model and can honor
the pattern's continuity. Use ACPX for another provider or lineage, persistent
cross-provider work, or explicit ACPX control.

| Provider | Native runtime | ACPX runtime | Caveat |
| --- | --- | --- | --- |
| Codex | Native Codex subagent or CLI session | `acpx codex` | Exact models depend on the current adapter and account. |
| Claude | Claude Code agent or CLI session | `acpx claude` | User settings, custom model environment, auth, and session limits affect availability. |
| Cursor | Cursor agent or Composer | `acpx cursor` | Cursor is multi-model; catalog and usage limits can change. |

Provider is not lineage, and ACPX is a runtime. Record the actual model when
lineage independence matters.

## Launcher And Agent Resolution

Use the globally installed binary first:

```text
acpx -> pnpm dlx acpx -> npx --yes acpx
```

Do not pin routine calls to a research version. Persistent work must keep the
resolved command stable because it participates in session identity.

| Shape | Example |
| --- | --- |
| Built-in | `acpx codex exec 'summarize changes'` |
| Raw command | `acpx --agent 'node ./scripts/acp.mjs --mode ci' exec 'summarize'` |
| Config-defined | Define the command under `agents` in ACPX config, then call its name. |

Use either a positional/built-in name or `--agent`, never both. Config-defined
names may override built-ins; make that override explicit. Calling an existing
ACP command is configuration, not adapter implementation.

Troubleshooting: https://acpx.sh/agents.html and https://acpx.sh/config.html

## Command Shape

Global options precede the provider; provider options follow it; command
options follow the command.

```bash
acpx --cwd /absolute/repo --approve-reads claude -s advisor \
  --file tmp/advisor-packet.md
acpx --format quiet --deny-all --no-terminal codex exec \
  --file tmp/review-packet.md
```

| Need | Command | Continuity |
| --- | --- | --- |
| One bounded Delegate/Operator | `acpx <agent> exec ...` | none |
| Persistent Advisor/Sidekick | `sessions ensure/new`, then prompt or bare call with `-s` | ledgered session |
| Follow-up after active turn | persistent prompt with `--no-wait` | queued in the same session |

`exec` has no resume expectation. Persistent identity and scope belong in
`session-ledger.md`.

## Queue And Session Control

- Default queue submission waits for the queued prompt to finish.
- `--no-wait` returns after acknowledgement; the prompt runs after the active
  turn drains.
- Immediate in-flight steering requires an explicit runtime capability. ACPX
  0.12 has no generic `steer` command.

Do not report queue acknowledgement as steering or completion.

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

## Persistent Sessions

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

```bash
acpx <agent> sessions show <name>
acpx <agent> sessions history <name> --limit 20
acpx <agent> sessions read <name> --tail 20
acpx <agent> sessions list --local
```

`status` and `show` prove liveness. `history` is a recent preview; `read` is
saved history. Before declaring a session missing, match the resolved command
and absolute cwd. Session names are not global. Provider-side
`sessions list --filter-cwd` and `--cursor` are separate from local records.

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

## Provider Notes

### Claude Fable

The locally verified custom model id is `claude-fable-5[1m]`, not bare
`fable`. User settings must expose that custom catalog. Define one relationship
wrapper so every lifecycle call keeps the same model environment, cwd, and
permission boundary:

```bash
REPO=/absolute/repo

fable_acpx() {
  ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
  ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
  ANTHROPIC_MODEL='claude-fable-5[1m]' \
  acpx --cwd "$REPO" --deny-all --no-terminal \
    --non-interactive-permissions fail claude "$@"
}
```

```bash
fable_acpx sessions ensure --name <name>
fable_acpx set effort high -s <name>
fable_acpx set-mode plan -s <name>
fable_acpx -s <name> --file <packet>
fable_acpx status -s <name>
fable_acpx sessions history <name> --limit 20
fable_acpx sessions read <name> --tail 20
```

The adapter observed `default`, `low`, `medium`, `high`, `xhigh`, and `max`.
Use the pattern's reasoning floor. Effort is a control command, not a
`sessions ensure` or `sessions new` option. Use `new` only for an intentional
continuity reset.

`ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1` also loads user plugins, commands, hooks,
and external resources. For source reads, replace `--deny-all` with
`--approve-reads` for the whole relationship, keep
`--no-terminal --non-interactive-permissions fail`, and forbid repository and
home writes in the packet. Do not broaden to `--approve-all` for review or
advice.

Use the same absolute cwd on every call. Session names are not global. A
friendly alias or exit code 0 does not prove Fable launched; verify capability
evidence and record the accepted id in the ledger.

### Codex

Use native Codex subagents when they expose the selected model. Use ACPX Codex
for a portable named session, queue control, or cross-provider flow. Use exact
adapter-advertised model and reasoning options.

Raw fallback:

```bash
acpx --agent 'npx -y @agentclientprotocol/codex-acp' exec 'sanity check'
```

### Cursor

Cursor is a multi-model provider. Use it for Grok 4.5, Composer 2.5, or
Cursor-specific branch behavior. Record config-defined overrides because the
resolved command participates in session identity.

Cursor may silently resolve a bare model name. Record the exact advertised id
and actual lineage. If usage limits remove a model, use an equivalent declared
fallback or report degraded/blocked.

## Output And Automation

| Consumer | Format |
| --- | --- |
| Human terminal | text |
| Full transcript | `--format json` |
| Strict pipeline | `--format json --json-strict` |
| Final answer only | `--format quiet` |
| Large read logs | add `--suppress-reads` |

Scripts never parse human text output. `--format json` emits raw ACP JSON-RPC
NDJSON, not an ACPX-specific event envelope.

```bash
acpx --format json codex exec 'review changed files' \
  | jq -r 'select(.method=="session/update")'
```

Quiet mode reserves stdout for final assistant text; wrappers branch on the
process exit code.

```text
0    success
1    agent / protocol / runtime error
2    CLI usage error
3    timeout
4    no session found
5    permission denied
130  interrupted
```

Handle timeout, no-session, permission-denied, and interrupted outcomes when
they change the next step.

## Compare And Flows

`compare` runs the same one-shot prompt serially and does not create persistent
sessions or a swarm with independent lane packets:

```bash
acpx compare codex claude cursor --file tmp/comparison-packet.md
acpx --format json compare codex claude --file tmp/review-packet.md
```

Use a Delegate or Operator swarm when lanes need different scopes or
adversarial assignments. Provider agreement remains candidate output.

Use flows for a repeatable graph of agent and deterministic steps, not one
prompt with a follow-up:

```bash
acpx flow run examples/flows/branch.flow.ts \
  --input-json '{"task":"add a regression test for the reconnect bug"}'
```

- `acp` nodes call agents.
- `action` nodes run supervised deterministic operations.
- `compute` nodes transform local data.
- decision nodes route branches.
- run artifacts persist under the ACPX flow run directory.

Flows may declare permission requirements and fail before starting when grants
are missing.

Troubleshooting: https://acpx.sh/output-formats.html,
https://acpx.sh/exit-codes.html, https://acpx.sh/flows.html, and
https://acpx.sh/CLI.html
