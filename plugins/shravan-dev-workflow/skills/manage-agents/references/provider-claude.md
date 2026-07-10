# Provider: Claude

Load this when the subordinate agent is Claude through ACPX and Claude-specific
behavior affects the run.

## When To Use Claude

Use Claude as a subordinate agent when the task benefits from an outside model
lineage, a persistent advisor or sidekick, an outside judge, or Claude-specific
coding-agent behavior the user requested.

Completion: the parent records why Claude was selected instead of defaulting to
it silently.

## Ordinary Claude Command Shapes

```bash
acpx claude exec 'one-shot review prompt'
acpx claude sessions ensure --name reviewer
acpx claude -s reviewer 'continue reviewing the current branch'
```

Completion: persistent Claude work uses a named session and records category,
cwd, model, effort, and permission boundary.

## Fable Through ACPX

The locally verified Fable route is not bare `--model fable`. The successful
Claude adapter catalog advertised the exact custom id
`claude-fable-5[1m]`. For this environment, every ACPX Claude call belonging to
that relationship must carry:

```bash
ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
ANTHROPIC_MODEL='claude-fable-5[1m]'
```

Keep the prefix on session creation, model/effort control, prompt, status,
history, read, and cancel calls. A dead queue owner may reconnect during a call;
omitting the environment can restart Claude with a different settings source or
model catalog.

Create one persistent packet-only advisor:

```bash
ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
ANTHROPIC_MODEL='claude-fable-5[1m]' \
acpx --cwd <absolute-repo> --deny-all --no-terminal \
  --non-interactive-permissions fail claude sessions new \
  --name <advisor-name>

ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
ANTHROPIC_MODEL='claude-fable-5[1m]' \
acpx --cwd <absolute-repo> --deny-all --no-terminal \
  --non-interactive-permissions fail claude set effort xhigh \
  -s <advisor-name>

ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
ANTHROPIC_MODEL='claude-fable-5[1m]' \
acpx --cwd <absolute-repo> --deny-all --no-terminal \
  --non-interactive-permissions fail claude set-mode plan \
  -s <advisor-name>
```

`effort` is an adapter-advertised config option. Live evidence exposed
`default`, `low`, `medium`, `high`, `xhigh`, and `max`. Advisors use `high` or
above. Do not invent `sessions new --effort` or `sessions ensure --effort`;
those flags do not exist in ACPX 0.12.

Send the bounded packet and inspect the result:

```bash
ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
ANTHROPIC_MODEL='claude-fable-5[1m]' \
acpx --cwd <absolute-repo> --deny-all --no-terminal \
  --non-interactive-permissions fail claude -s <advisor-name> \
  --file <advisor-packet>

ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
ANTHROPIC_MODEL='claude-fable-5[1m]' \
acpx --cwd <absolute-repo> --deny-all --no-terminal \
  --non-interactive-permissions fail claude status -s <advisor-name>

ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
ANTHROPIC_MODEL='claude-fable-5[1m]' \
acpx --cwd <absolute-repo> --deny-all --no-terminal \
  --non-interactive-permissions fail claude sessions history \
  <advisor-name> --limit 20

ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
ANTHROPIC_MODEL='claude-fable-5[1m]' \
acpx --cwd <absolute-repo> --deny-all --no-terminal \
  --non-interactive-permissions fail claude sessions read \
  <advisor-name> --tail 20
```

Use `sessions ensure` instead of `new` when idempotent reuse is intentional.
Use `new` when resetting continuity or correcting a session created with the
wrong model/settings contract.

Use the same absolute `--cwd` on every call. A session name alone is not global;
changing cwd selects a different ACPX scope even when the model environment and
name are unchanged.

Completion: status or session capability evidence shows the exact Fable id,
the `set effort` call succeeded at high or above, and the ledger records that
user settings were included.

## System Prompt And Settings

Claude-compatible adapters may consume `--system-prompt` or
`--append-system-prompt` at session creation. Treat system-prompt overrides as
session-shaping choices and record them in the ledger when they matter.

Built-in ACPX Claude sessions intentionally omit user settings by default.
`ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1` exposes user plugins, commands, hooks, and
their external resources to the spawned session. This can create singleton
resource conflicts and a broader tool surface. It can also let an advisor
attempt unintended repository or home writes.

Use packet-only `--deny-all --no-terminal` when source inspection is not
required. When source reads are required, grant the narrowest read policy and
state `do not edit repository or home files` in the packet. Replace
`--deny-all` with `--approve-reads` consistently on creation, control, and
prompt calls for that relationship; keep
`--non-interactive-permissions fail`. Do not broaden to `--approve-all` merely
because the advisor needs source reads. Parent verification must inspect actual
effects before accepting the receipt.

Completion: model/system-prompt/settings choices are explicit when they affect
behavior.

## Model Control

For ordinary provider-advertised Claude models, `--model <id>` at creation or
`set model <id>` may work when the adapter advertises model control. For the
local Fable custom model, use the three-variable environment contract above so
the model is present in Claude's catalog before session creation.

Do not normalize bracketed custom ids. Do not treat a syntactically accepted
friendly alias as proof that the requested model launched.

Completion: the selected model id is provider-advertised or the run records the
fallback.
