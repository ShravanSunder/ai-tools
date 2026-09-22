# ACPX Provider: Codex

Agent token: `codex`. Use this provider when the host is not Codex native or when the relationship requires a separate persistent Codex conversation, including from a Codex parent. Prefer native Codex subagents for native-eligible bounded assignments; see `references/native-providers-codex.md`.

## Models

| Model id             |
| -------------------- |
| `gpt-6-astra`        |
| `gpt-6-sol`          |
| `gpt-6-luna`         |

Pass the provider-advertised id with `--model` at session creation or `acpx codex set model <id> -s <name>` afterward. Unknown ids are rejected. Prefer the short form unless the adapter requires an `openai.` prefix.

## Effort

Use `acpx codex set effort <level> -s <name>` when the adapter advertises effort control. Select the model-and-effort pair from the applicable role table in `SKILL.md`, then use its advertised effort level; do not duplicate role-tier mappings here.

## Sessions And Identity

Creation example for a new relationship only; for an existing Sidekick, inspect and reuse its recorded session through `acpx.md` rather than running creation again.

```bash
acpx --cwd /absolute/repo --model gpt-6-sol --approve-reads --no-terminal \
  --non-interactive-permissions fail codex sessions ensure --name sidekick
acpx --cwd /absolute/repo --approve-reads --no-terminal \
  --non-interactive-permissions fail codex -s sidekick \
  --file tmp/sidekick-packet.md
```

Keep cwd, resolved `codex` command, model id, effort, and permission boundary stable for ledgered relationships. Record the accepted model id in the ledger; exit code 0 alone does not prove the intended model launched.

## Codex Adapter Configuration

ACPX project configuration can replace the Codex ACP adapter command through `<cwd>/.acpxrc.json`:

```json
{
  "agents": {
    "codex": {
      "command": "npx -y @agentclientprotocol/codex-acp@^1.1.5",
      "args": []
    }
  }
}
```

`agents.codex.args` are arguments to `codex-acp`, not Codex CLI global arguments. Current `codex-acp` 1.1.x starts `codex app-server` itself and does not forward `--profile <name>`. Do not claim that adding `["--profile", "codex-router"]` there selected the Codex profile.

Codex CLI profiles currently do not apply to `app-server`; a `CODEX_PATH` launcher that expands to `codex --profile <name> app-server` is therefore invalid. When ACPX needs profile-equivalent app-server settings, temporarily pass the required settings explicitly to the `codex-acp` child:

```bash
CODEX_CONFIG='<JSON object>' MODEL_PROVIDER='<configured provider id>' \
  acpx --cwd /absolute/repo --model gpt-6-luna \
  --approve-reads --no-terminal --non-interactive-permissions fail \
  codex --file request.md
```

`CODEX_CONFIG` is a JSON object merged into the Codex session configuration; `MODEL_PROVIDER` selects a provider defined there. Keep this bridge caller-owned and explicit: do not read, copy, or expose a local profile automatically. Record the ACPX token, model, effort, permissions, and whether explicit adapter configuration was supplied; do not record secret configuration values. Do not pass or record `--timeout`. Verify environment propagation deterministically and verify the live provider/model separately.

## Permissions

Use `--approve-reads` for source-grounded Advisor and review work. Keep `--non-interactive-permissions fail` for unattended runs. The parent authorizes write access for non-review assignments.
