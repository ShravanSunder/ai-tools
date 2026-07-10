# Provider: Claude

## Fable

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

Create/reuse one persistent packet-only relationship, set an
adapter-advertised effort, then prompt and inspect it:

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
Use the reasoning floor from `orchestration-patterns.md`. Do not invent
`sessions ensure --effort` or `sessions new --effort`; effort is a control
command.

Use `new` only for an intentional continuity reset. Reconnect and provider
limits follow `session-ledger.md`; they do not justify replacement names.

## Settings And Permissions

`ACPX_CLAUDE_INCLUDE_USER_SETTINGS=1` also loads user plugins, commands, hooks,
and external resources. That can create resource conflicts or unintended tool
authority.

The wrapper above is packet-only. If source reads are required, replace
`--deny-all` with `--approve-reads` in the wrapper for the whole relationship,
keep `--no-terminal --non-interactive-permissions fail`, and explicitly forbid
repository and home writes in the packet. Do not broaden to `--approve-all` for
review or advice.

Use the same absolute cwd on every call. Session names are not global.

For ordinary provider-advertised Claude models, creation-time `--model <id>` or
`set model <id>` may work when advertised. For Fable, keep the exact three
environment variables above. A friendly alias or exit code 0 does not prove the
requested model launched; verify status/capability evidence and record the
accepted id in the ledger.
