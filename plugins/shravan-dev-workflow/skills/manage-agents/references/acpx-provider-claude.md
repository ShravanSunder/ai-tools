# ACPX Provider: Claude

Legacy route. agent-router carries persistent Claude relationships over ACP by default. Use this contract only when `acpx-legacy.md` admits ACPX: the selected agent-router service has no Claude endpoint, or cannot meet a stated model, effort, access, or title requirement. Record that gap in the ledger.

## Models

Examples: Claude Fable 5.x and Claude Opus 5.5 ACP selection ids. Resolve the exact id with the Runtime rule in `SKILL.md`. A custom Fable id may differ from bare `fable`, and user settings must expose that custom catalog. API model names are not guaranteed ACP selection IDs; the live catalog is authoritative. For Fable, define one relationship wrapper so every lifecycle call keeps the same model environment, cwd, and permission boundary:

```bash
REPO=/absolute/repo

fable_acpx() {
  ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1 \
  ANTHROPIC_CUSTOM_MODEL_OPTION='<resolved Fable id>' \
  ANTHROPIC_MODEL='<resolved Fable id>' \
  acpx --cwd "$REPO" --approve-reads --no-terminal \
    --non-interactive-permissions deny claude "$@"
}
```

The adapter observed `default`, `low`, `medium`, `high`, `xhigh`, and `max`. Use the Models table thinking values for Frontier Fable and invoke every lifecycle command through the wrapper so the custom model environment remains part of the relationship.

## Settings And Permissions

`ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1` also loads user plugins, commands, hooks, and external resources. Keep `--approve-reads --no-terminal --non-interactive-permissions deny` for source-grounded advice and review (writes and exec are denied, never approved; `deny` keeps the turn alive where `fail` would abort it) and record `workspace read-only` on the review packet's `access:` line. The parent authorizes write access for non-review assignments; via ACPX a write scope is always `(declared)`. When path-scoped write enforcement matters, load `native-providers-claude.md` and dispatch native Claude Code.

A friendly alias or exit code 0 does not prove Fable launched; verify capability evidence and record the accepted id in the ledger.

When a saved selection is unsupported, deliberately update it to a verified id in the same named session, then inspect the recorded identity rather than creating a replacement session.
