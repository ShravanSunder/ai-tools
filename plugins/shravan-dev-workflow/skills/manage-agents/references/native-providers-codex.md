# Native Providers: Codex

Owns Codex native v2 `spawn_agent` model, effort, and conversation-history values. Return the exact `model`, `reasoning_effort`, and `fork_turns` encoding.

## Models

| Model id             | Note              |
| -------------------- | ----------------- |
| `gpt-6-astra`        |                   |
| `gpt-5.6-sol`        |                   |
| `gpt-5.6-luna`       |                   |

Lib ids: `openai.gpt-6-astra`, `openai.gpt-5.6-{sol,luna}`. Prefer short form unless the host requires `openai.`.

## Effort

`none` | `minimal` | `low` | `medium` (default) | `high` | `xhigh` | `max` | `ultra` | custom string. Pattern floors from `SKILL.md` still apply.

## Conversation History

- No inherited parent history: set `fork_turns="none"`.
- Full parent history: set `fork_turns="all"`.
- Full-history inheritance uses the parent model and reasoning effort; omit `model` and `reasoning_effort`.
- Fresh history may pass explicit model and reasoning-effort overrides.

## Workspace Access

- `read-only`: record `workspace read-only` on the packet and launch with `spawn_agent`. `spawn_agent` has no sandbox field; do not switch to `codex exec --sandbox read-only` to invent one. The packet is the read-only contract; verify the worktree is unchanged after the receipt. Codex cannot scope writes to specific paths while the repo is cwd — a write scope on Codex is `(declared)` in the packet.
- `write`: record the parent-approved paths on the `access:` line (`workspace write <paths> (declared)`).

## Examples

```json
{
  "message": "Review the bounded implementation packet and return candidate findings.",
  "task_name": "implementation_review",
  "model": "gpt-6-astra",
  "reasoning_effort": "medium",
  "fork_turns": "none"
}
```
