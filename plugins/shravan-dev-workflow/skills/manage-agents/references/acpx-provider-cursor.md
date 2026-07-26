# ACPX Provider: Cursor

Agent token: `cursor`. Default adapter command: `cursor-agent acp`. If your install exposes ACP as `agent acp` instead, override in ACPX config:

```json
{ "agents": { "cursor": { "command": "agent acp" } } }
```

Cursor is a multi-model ACPX provider. It owns a catalog mapping, not a single model lineage. Use it for Grok 4.5, Composer 2.5, or any other id the adapter advertises. Model lineage is chosen separately; only claim a lineage when this provider advertises an exact id.

## Models

Pass the exact advertised ACP id from `session/new` / `configOptions.model` with `--model` at session creation or `acpx cursor set model <id> -s <name>` afterward.

Skill-matrix and optional Cursor ACP ids (verify locally; catalogs change):

| Model id                          | Note              |
| --------------------------------- | ----------------- |
| `grok-4.5[effort=high,fast=true]` |                   |
| `composer-2.5[fast=true]`         |                   |
| `claude-fable-5[1m]`              | user request only |
| `claude-opus-5`                   | user request only |
| `gpt-5.6-sol`                     | user request only |
| `gpt-5.6-luna`                    | user request only |
| `gpt-5.6-terra`                   | user request only |

Treat the short names from `agent --list-models` (`composer-2.5`, `composer-2.5-fast`, `cursor-grok-4.5-high`, …) as Cursor CLI labels. Use and record the ACP-advertised id for ACPX calls.

When usage limits remove a model, use an equivalent declared fallback or report degraded/blocked. Record config-defined command overrides because the resolved command participates in session identity.

## Modes

Cursor ACP advertises session modes. Use `acpx cursor set-mode <mode> -s <name>` with an advertised id:

| Mode    | Use                                |
| ------- | ---------------------------------- |
| `agent` | Full tool access                   |
| `plan`  | Read-only planning                 |
| `ask`   | Q&A; no edits or command execution |

## Sessions And Identity

```bash
acpx --cwd /absolute/repo --model 'composer-2.5[fast=true]' --approve-reads --no-terminal \
  --non-interactive-permissions fail cursor sessions ensure --name operator
acpx --cwd /absolute/repo --approve-reads --no-terminal \
  --non-interactive-permissions fail cursor -s operator \
  --file tmp/operator-packet.md

acpx --cwd /absolute/repo --model 'grok-4.5[effort=high,fast=true]' --approve-reads --no-terminal \
  --non-interactive-permissions fail cursor sessions ensure --name sidekick
acpx cursor set-mode plan -s sidekick
```

Keep cwd, resolved `cursor` command, exact model id, mode, and permission boundary stable for ledgered relationships. Exit code 0 alone does not prove the intended model launched; confirm the accepted id from status/config evidence.

## Permissions

Use `--approve-reads` for source-grounded work. Keep `--non-interactive-permissions fail` for unattended runs. The parent authorizes write access for non-review assignments.
