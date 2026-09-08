# ACPX Provider: Claude

## Models

| Model id             |
| -------------------- |
| `claude-fable-5-1`   |
| `claude-opus-5`      |

The locally verified custom Fable id is `claude-fable-5-1`, not bare `fable`. User settings must expose that custom catalog. Opus uses the provider-advertised API id (`claude-opus-5`); verify locally if the adapter exposes a bracketed variant. For Fable, define one relationship wrapper so every lifecycle call keeps the same model environment, cwd, and permission boundary:

```bash
REPO=/absolute/repo

fable_acpx() {
  ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
  ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5-1' \
  ANTHROPIC_MODEL='claude-fable-5-1' \
  acpx --cwd "$REPO" --approve-reads --no-terminal \
    --non-interactive-permissions fail claude "$@"
}
```

The adapter observed `default`, `low`, `medium`, `high`, `xhigh`, and `max`. Use the Models table thinking values for Frontier Fable and invoke every lifecycle command through the wrapper so the custom model environment remains part of the relationship.

## Settings And Permissions

`ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1` also loads user plugins, commands, hooks, and external resources. Keep `--approve-reads --no-terminal --non-interactive-permissions fail` for source-grounded advice and review — fail-closed on writes, the strongest ACPX offers — and record `workspace read-only (enforced)` on the review packet's `access:` line. The parent authorizes write access for non-review assignments; via ACPX a write scope is always `(declared)`. When path-scoped write enforcement matters, dispatch native Claude Code with `dontAsk` and `Edit(<paths>/**)` allow rules instead.

A friendly alias or exit code 0 does not prove Fable launched; verify capability evidence and record the accepted id in the ledger.
