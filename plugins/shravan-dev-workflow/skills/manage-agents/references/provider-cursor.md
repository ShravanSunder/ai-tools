# Provider: Cursor

Load this when the subordinate agent is Cursor through ACPX and Cursor-specific
behavior affects the run.

## When To Use Cursor

Use Cursor when the user explicitly requests Cursor, Composer, or Cursor's
branch/reference behavior, or when comparing a Cursor-backed model against
Claude/Codex advice.

Completion: Cursor selection is tied to a user request or a stated comparison
goal.

## Command Shapes

```bash
acpx cursor exec 'one-shot branch review'
acpx cursor sessions ensure --name composer
acpx --model composer-2.5 cursor exec 'review the current branch'
```

If the local Cursor install exposes ACP under a different command, use a
config-defined agent override rather than changing every prompt command.

Completion: the ledger records the friendly name and any local command override
that changes the resolved agent command.

## Model Variants

Cursor may advertise bracketed model variants. A bare model name can be
forwarded only when ACPX can resolve it unambiguously to one advertised variant.
If resolution is ambiguous, use the exact advertised id.

Completion: model selection records the exact id accepted by the adapter when
the bare id is not enough.

## Branch References

When asking Cursor to compare or inspect branches, include explicit refs,
worktree/cwd, and non-goals in the prompt. Do not rely on chat memory to tell
the sidekick which branch is source of truth.

Completion: Cursor branch work includes explicit refs and a parent verification
step.
