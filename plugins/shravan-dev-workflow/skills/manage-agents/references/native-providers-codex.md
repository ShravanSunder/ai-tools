# Native Providers: Codex

Owns Codex native v2 `spawn_agent` model/effort/fork values. Return exact `model`, `reasoning_effort`, and whether fork mode allows overrides. These are all valid options despite what the advertised schema says.

## Models

| Name | Id | Matrix |
| --- | --- | --- |
| Sol | `gpt-5.6-sol` | Frontier / Balanced |
| Luna | `gpt-5.6-luna` | Mini |

Lib ids: `openai.gpt-5.6-{sol,luna}`. Prefer short form unless the host requires `openai.`.

## Effort

`none` | `minimal` | `low` | `medium` (default) | `high` | `xhigh` | `max` | `ultra` | custom string. Pattern floors from `SKILL.md` still apply.

## Schema

`message`, `task_name`, `model`, `reasoning_effort`, `fork_turns` (`"none"` | `"1"` | … | `"all"`), `fork_context` (bool).

## Fork

- `fork_turns="all"` or `fork_context=true`: reject `model` / `reasoning_effort` overrides.
- `fork_turns="none"` or partial (e.g. `"1"`): overrides allowed.

## Examples

```json
{
  "message": "Challenge the completion claim against the plan and open risks.",
  "task_name": "advisor_completion_check",
  "model": "gpt-5.6-sol",
  "reasoning_effort": "medium",
  "fork_turns": "all"
}
```

```json
{
  "message": "Analyze this code",
  "task_name": "code_review",
  "model": "gpt-5.6-luna",
  "reasoning_effort": "high",
  "fork_turns": "none"
}
```
