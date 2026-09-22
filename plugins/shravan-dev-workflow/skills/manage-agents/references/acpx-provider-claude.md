# ACPX Provider: Claude

## Models

| Model id             | Role-table lineage |
| -------------------- | ------------------ |
| `claude-fable-5-1`   | Fable 5.1          |

The locally verified custom Fable id is `claude-fable-5-1`, not bare `fable`. User settings must expose that custom catalog. Opus 5.5 uses the id the live catalog advertises for that generation. `opus[1m]` and `claude-opus-5` are not the Opus 5.5 selection. API model names are not guaranteed ACP selection IDs; the live catalog is authoritative. For Fable, define one relationship wrapper so every lifecycle call keeps the same model environment, cwd, and permission boundary:

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

The adapter observed `default`, `low`, `medium`, `high`, `xhigh`, and `max`. Fable 5.1 uses `medium` or `high`. Opus 5.5 uses `low` for Balanced and `medium` or `high` for Frontier. Invoke every lifecycle command through the wrapper so the custom model environment remains part of the relationship.

## Settings And Permissions

`ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1` also loads user plugins, commands, hooks, and external resources. Keep `--approve-reads --no-terminal --non-interactive-permissions fail` for source-grounded advice and review — fail-closed on writes, the strongest ACPX offers — and record `workspace read-only` on the review packet's `access:` line. The parent authorizes write access for non-review assignments; via ACPX a write scope is always `(declared)`. When path-scoped write enforcement matters, load `native-providers-claude.md` and dispatch native Claude Code.

A friendly alias or exit code 0 does not prove Fable launched; verify capability evidence and record the accepted id in the ledger.

When a saved selection is unsupported, deliberately update it to a verified id in the same named session, then inspect the recorded identity rather than creating a replacement session.
