# ACPX Provider: Claude

## Fable

The locally verified custom model id is `claude-fable-5[1m]`, not bare `fable`. User settings must expose that custom catalog. Define one relationship wrapper so every lifecycle call keeps the same model environment, cwd, and permission boundary:

```bash
REPO=/absolute/repo

fable_acpx() {
  ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
  ANTHROPIC_CUSTOM_MODEL_OPTION='claude-fable-5[1m]' \
  ANTHROPIC_MODEL='claude-fable-5[1m]' \
  acpx --cwd "$REPO" --approve-reads --no-terminal \
    --non-interactive-permissions fail claude "$@"
}
```

The adapter observed `default`, `low`, `medium`, `high`, `xhigh`, and `max`. Use the Models table thinking values for Frontier Fable and invoke every lifecycle command through the wrapper so the custom model environment remains part of the relationship.

## Settings And Permissions

`ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1` also loads user plugins, commands, hooks, and external resources. Keep `--approve-reads --no-terminal --non-interactive-permissions fail` for source-grounded advice and review, and forbid repository and home writes in the packet. Use `--deny-all` only when the packet already contains every needed excerpt. Do not broaden to `--approve-all` for review or advice.

A friendly alias or exit code 0 does not prove Fable launched; verify capability evidence and record the accepted id in the ledger.
