# Provider: Cursor

Load this when the subordinate agent is Cursor through ACPX and Cursor-specific
behavior affects the run.

## When To Use Cursor

Use Cursor when the user explicitly requests Cursor, Composer, a model exposed
through Cursor, or Cursor's branch/reference behavior. Cursor is a multi-model
provider, not one model lineage.

Completion: Cursor selection is tied to a user request or a stated comparison
goal.

## Command Shapes

```bash
acpx cursor exec 'one-shot branch review'
acpx cursor sessions ensure --name composer
acpx --model <exact-advertised-id> cursor exec 'review the current branch'
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

Current task guidance:

- Grok 4.5 through Cursor can serve as a medium-or-above sidekick when the
  advertised catalog and account allow it.
- Cursor Composer 2.5 is in the Luna-like operational tier for monitoring,
  scripts, PR babysitting, merge observation, and reporting.
- A Cursor provider label alone does not satisfy an independent-lineage
  requirement. Record the actual selected model.

Cursor account usage limits can remove or throttle a model during a run. Check
the advertised catalog before dispatch and predeclare a fallback. If fallback
would change required lineage or capability, return unavailable/blocked rather
than silently substituting.

Completion: the ledger records Cursor provider, exact model id, intended
lineage/capability, usage-limit status, and fallback.

## Branch References

When asking Cursor to compare or inspect branches, include explicit refs,
worktree/cwd, and non-goals in the prompt. Do not rely on chat memory to tell
the sidekick which branch is source of truth.

Completion: Cursor branch work includes explicit refs and a parent verification
step.
