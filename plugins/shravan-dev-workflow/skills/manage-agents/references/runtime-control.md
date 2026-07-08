# Runtime Control

Load this when the task needs command/session control for a subordinate agent:
prompt versus exec, persistent versus one-shot, queueing, follow-ups, steering,
timeouts, cancel, status, model control, permissions, or terminal capability.

## Job Shape

Choose the runtime shape before writing the prompt.

```text
one-shot job
  use: exec
  memory: none
  parent proof: exit code, final text, JSON stream, or captured artifact

persistent sidekick
  use: sessions ensure/new, then prompt
  memory: scoped by agent command, absolute cwd, optional session name
  parent proof: status/history plus verified output

queued follow-up
  use: persistent prompt with --no-wait when a turn is already running
  memory: same persistent session
  parent proof: acknowledgement plus later status/history/result check

steer
  use: only a runtime or adapter surface that supports immediate injection
  memory: current live turn
  parent proof: runtime acknowledgement and changed in-flight behavior
```

Completion: the selected shape says whether the child should remember prior
turns and whether the parent waits, queues, or steers.

## Prompt Versus Exec

Use `exec` for stateless answers, script steps, independent reviews, and machine
pipelines that should not append to a persistent conversation.

Use `prompt` or bare `acpx <agent> ...` for persistent work that needs memory,
queue-aware follow-ups, cancel/status/control commands, or named sidekicks.

Completion: `exec` jobs have no resume expectation; persistent jobs have a
session ledger row before follow-up prompts are sent.

Troubleshooting source: https://acpx.sh/prompting.html

## Queue Versus Steer

ACPX CLI queueing is not immediate steering.

- Default queue submission waits for the queued prompt to finish.
- `--no-wait` enqueues and returns after acknowledgement.
- Queued prompts run after the current turn drains.
- Steering means immediate injection into an active task, and only exists when
  the runtime surface exposes a `steer` mode or equivalent adapter behavior.

Completion: every follow-up is labeled as `queue` or `steer`, with the expected
start time stated.

## Session Control

Use these controls against the same `(agentCommand, cwd, optional session name)`
scope:

```bash
acpx <agent> status -s <name>
acpx <agent> cancel -s <name>
acpx <agent> set-mode <mode> -s <name>
acpx <agent> set model <model-id> -s <name>
```

Notes:

- `cancel` is cooperative and succeeds when there is nothing to cancel.
- `set-mode` values are adapter-defined.
- `set model` works only when the adapter advertises model control.
- `status` is local process/session state, not proof that the agent's claims
  are true.

Completion: control commands include the session name when the sidekick is
named, and status output is interpreted as liveness only.

Troubleshooting source: https://acpx.sh/session-control.html

## Permissions

Choose the narrowest permission boundary that can do the job:

```bash
acpx --deny-all --no-terminal <agent> exec 'read-only reasoning prompt'
acpx --approve-reads --no-terminal <agent> exec 'review without shell'
acpx --approve-reads <agent> 'inspect files and ask before writes'
acpx --approve-all <agent> 'apply the scoped patch and run tests'
```

Use `--policy` or `--permission-policy` when automation needs tool-level
approval, denial, or escalation behavior. Use `--no-terminal` for review-only
or sandboxed tasks where the agent should know terminal calls are unavailable
up front.

Completion: the permission mode matches the requested authority, and any write
or shell-capable run has an explicit parent-approved scope.

Troubleshooting source: https://acpx.sh/permissions.html

## CLI Fallback

Use the full CLI reference only when a command fails because exact grammar,
global-option placement, or subcommand syntax is unclear.

Troubleshooting source: https://acpx.sh/CLI.html
