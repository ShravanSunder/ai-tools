# ACPX Provider: Cursor

Agent token: `cursor`. Default adapter command: `cursor-agent acp`. If your install exposes ACP as `agent acp` instead, override in ACPX config:

```json
{ "agents": { "cursor": { "command": "agent acp" } } }
```

Cursor is a multi-model ACPX provider. It owns a catalog mapping, not a single model lineage. Use it for Grok 4.7 or any other id the adapter advertises. Model lineage is chosen separately; only claim a lineage when this provider advertises an exact id.

## Models

Pass the exact advertised ACP id from `session/new` / `configOptions.model` with `--model` at session creation or `acpx cursor set model <id> -s <name>` afterward.

Illustrative advertised Cursor ACP id examples (catalogs change):

| Model id                           |
| ---------------------------------- |
| `grok-4.7[effort=high,fast=false]` |
| `grok-4.7[effort=high,fast=true]`  |
| `grok-4.6[effort=high,fast=false]` |
| `grok-4.5[effort=high,fast=false]` |
| `claude-opus-5-5`                  |

- Select the model and effort from the `SKILL.md` role table and task signals, then use the exact live-advertised ACP id. If the selected effort is unavailable, report that gap; do not silently change effort.
- Fable only on request. Grok 4.5 or 4.6 only on request.

Treat the short names from `agent --list-models` (`cursor-grok-4.7-high`, `cursor-grok-4.7-medium`, …) as Cursor CLI labels. Use and record the ACP-advertised id for ACPX calls.

When usage limits remove a model, use an equivalent declared fallback or report degraded/blocked. Record config-defined command overrides because the resolved command participates in session identity.

## Modes

Cursor ACP advertises session modes. Use `acpx cursor set-mode <mode> -s <name>` with an advertised id:

| Mode    | Use                                |
| ------- | ---------------------------------- |
| `agent` | Full tool access                   |
| `plan`  | Read-only planning                 |
| `ask`   | Q&A; no edits or command execution |

## Sessions And Identity

Set `$SELECTED_MODEL_ID` to the exact ACP id verified from the live catalog for the selected model and effort; do not fabricate a low or medium id.

```bash
acpx --cwd /absolute/repo --model "$SELECTED_MODEL_ID" --approve-reads --no-terminal \
  --non-interactive-permissions fail cursor sessions ensure --name sidekick
acpx cursor set-mode plan -s sidekick
```

Keep cwd, resolved `cursor` command, exact model id, mode, and permission boundary stable for ledgered relationships. Exit code 0 alone does not prove the intended model launched; confirm the accepted id from status/config evidence.

## Permissions

Use `--approve-reads` for source-grounded work. Keep `--non-interactive-permissions fail` for unattended runs. The parent authorizes write access for non-review assignments.
