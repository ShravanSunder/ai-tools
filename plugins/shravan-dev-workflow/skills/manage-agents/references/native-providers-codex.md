# Native Providers: Codex

Owns Codex native v2 `spawn_agent` model, effort, and conversation-history values. Return the exact `model`, `reasoning_effort`, and `fork_turns` encoding.

## Models

| Model id             | Note              |
| -------------------- | ----------------- |
| `gpt-5.6-sol`        |                   |
| `gpt-5.6-luna`       |                   |
| `gpt-5.6-terra`      | user request only |

Lib ids: `openai.gpt-5.6-{sol,luna,terra}`. Prefer short form unless the host requires `openai.`. Terra has no pattern-table category; dispatch it only when the user names it.

## Effort

`none` | `minimal` | `low` | `medium` (default) | `high` | `xhigh` | `max` | `ultra` | custom string. Pattern floors from `SKILL.md` still apply.

## Conversation History

- No inherited parent history: set `fork_turns="none"`.
- Full parent history: set `fork_turns="all"`.
- Full-history inheritance uses the parent model and reasoning effort; omit `model` and `reasoning_effort`.
- Fresh history may pass explicit model and reasoning-effort overrides.

## Workspace Access

- `read-only`: enforce with `--sandbox read-only` (OS-enforced) and set the packet's `access:` line to `workspace read-only (enforced)`; verify the worktree is unchanged after the receipt. Codex cannot scope writes to specific paths while the repo is cwd — a write scope on Codex is `(declared)` in the packet.
- `write`: record the parent-approved paths on the `access:` line (`workspace write <paths> (declared)`).

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
