# Native Providers: Codex

Owns Codex native v2 `spawn_agent` model, effort, and conversation-history values. Return the exact `model`, `reasoning_effort`, and `fork_turns` encoding.

## Models

| Model id             |
| -------------------- |
| `gpt-5.6-sol`        |
| `gpt-5.6-luna`       |
| `gpt-5.6-terra`      |

Lib ids: `openai.gpt-5.6-{sol,luna,terra}`. Prefer short form unless the host requires `openai.`.

## Effort

`none` | `minimal` | `low` | `medium` (default) | `high` | `xhigh` | `max` | `ultra` | custom string. Pattern floors from `SKILL.md` still apply.

## Conversation History

- No inherited parent history: set `fork_turns="none"`.
- Full parent history: set `fork_turns="all"`.
- Full-history inheritance uses the parent model and reasoning effort; omit `model` and `reasoning_effort`.
- Fresh history may pass explicit model and reasoning-effort overrides.

## Examples

```json
{
  "message": "Review the bounded implementation packet and return candidate findings.",
  "task_name": "implementation_review",
  "model": "gpt-5.6-sol",
  "reasoning_effort": "high",
  "fork_turns": "none"
}
```
