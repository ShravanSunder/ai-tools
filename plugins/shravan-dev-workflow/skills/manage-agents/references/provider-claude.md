# Provider: Claude

Load this when the subordinate agent is Claude through ACPX and Claude-specific
behavior affects the run.

## When To Use Claude

Use Claude as a subordinate agent when the task benefits from an outside model
family, a persistent reviewer sidekick, or Claude-specific coding-agent
behavior the user requested.

Completion: the parent records why Claude was selected instead of defaulting to
it silently.

## Command Shapes

```bash
acpx claude exec 'one-shot review prompt'
acpx claude sessions ensure --name reviewer
acpx claude -s reviewer 'continue reviewing the current branch'
```

Completion: persistent Claude work uses a named session when more than one
sidekick could exist in the repo.

## System Prompt And Settings

Claude-compatible adapters may consume `--system-prompt` or
`--append-system-prompt` at session creation. Treat system-prompt overrides as
session-shaping choices and record them in the ledger when they matter.

Claude user settings may be intentionally isolated by the adapter. Include user
settings only when the run requires them and resource conflicts are understood.

Completion: model/system-prompt/settings choices are explicit when they affect
behavior.

## Model Control

Use `--model <id>` for session creation when the adapter accepts the model id.
Use `set model <id>` for mid-session changes when the adapter advertises model
control.

Completion: the selected model id is provider-advertised or the run records the
fallback.
