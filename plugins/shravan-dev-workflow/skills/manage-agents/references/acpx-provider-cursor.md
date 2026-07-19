# ACPX Provider: Cursor

Agent token: `cursor`. Default adapter command: `cursor-agent acp`. If your install exposes ACP as `agent acp` instead, override in ACPX config:

```json
{ "agents": { "cursor": { "command": "agent acp" } } }
```

Cursor is a multi-model ACPX provider. It owns a catalog mapping, not a single model lineage. Use it for Grok 4.5, Composer 2.5, or any other id the adapter advertises. Model lineage is chosen separately; only claim a lineage when this provider advertises an exact id.

## Models

Pass ids with `--model` at session creation or `acpx cursor set model <id> -s <name>` afterward. Unknown ids are rejected. Prefer the exact advertised ACP id from `session/new` / `configOptions.model`. Bare prefixes (for example `composer-2.5`) resolve only when exactly one advertised id shares that prefix; otherwise pass the full bracketed id.

Skill-matrix lineages observed on this host's Cursor ACP catalog (verify locally; catalogs change):

| Lineage | Advertised ACP id | Matrix |
| --- | --- | --- |
| Grok 4.5 | `grok-4.5[effort=high,fast=true]` | Balanced |
| Cursor Composer 2.5 | `composer-2.5[fast=true]` | Mini |

`agent --list-models` uses different short names (`composer-2.5`, `composer-2.5-fast`, `cursor-grok-4.5-high`, …). Those are Cursor CLI labels, not ACPX `--model` ids. Always record the ACP-advertised id in the ledger.

Cursor may silently resolve a bare model name to a bracketed variant. If usage limits remove a model, use an equivalent declared fallback or report degraded/blocked. Record config-defined command overrides because the resolved command participates in session identity.

## Modes

Cursor ACP advertises session modes. Use `acpx cursor set-mode <mode> -s <name>` with an advertised id:

| Mode | Use |
| --- | --- |
| `agent` | Full tool access |
| `plan` | Read-only planning |
| `ask` | Q&A; no edits or command execution |

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

Default source-grounded work to `--approve-reads`. Use `--deny-all` only when the packet already contains every needed excerpt (no repo reads). Keep `--non-interactive-permissions fail` for unattended runs. Do not broaden an Advisor or reviewer to `--approve-all` because a read request failed.
