# Native Providers: Codex

Owns Codex native v2 `spawn_agent` model, effort, conversation-history, and workspace-access encoding. Return the exact `model`, `reasoning_effort`, `fork_turns`, and workspace-access encoding.

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

Launch with `spawn_agent`. `spawn_agent` has no sandbox field; do not switch to `codex exec --sandbox read-only` to invent one. Reader and writer packet slots are owned by `agent-job-packet.md`.

- Readers: packet `workspace read-only`. Parent verifies the repo worktree is unchanged after the receipt.
- Writers: packet `write <paths> (declared)`. Codex cannot path-scope writes while the repo is cwd. Parent verifies the receipt's diff stayed inside the declared scope.

## Examples

```json
{
  "message": "Review the bounded implementation packet and return candidate findings. Do not edit any file in the repo. Project tmp/ and system /tmp are allowed.",
  "task_name": "implementation_review",
  "model": "gpt-6-astra",
  "reasoning_effort": "medium",
  "fork_turns": "none"
}
```
