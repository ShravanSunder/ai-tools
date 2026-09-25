# Native Providers: Codex

Owns Codex native v2 `spawn_agent` model, effort, conversation-history, and workspace-access encoding. Return the exact `model`, `reasoning_effort`, `fork_turns`, and workspace-access encoding.

This reference applies after `SKILL.md` selects a native 🛠️ Worker or Operator assignment. Persistent Sidekick, Advisor, and Review Sidekick relationships use their separate top-level route.

## Models

| Model id             | Note              |
| -------------------- | ----------------- |
| `gpt-6-astra`        |                   |
| `gpt-6-sol`          |                   |
| `gpt-6-luna`         |                   |

Lib ids: `openai.gpt-6-astra`, `openai.gpt-6-sol`, `openai.gpt-6-luna`. Prefer short form unless the host requires `openai.`. Other ids the host advertises are not used.

## Effort

`none` | `minimal` | `low` | `medium` (default) | `high` | `xhigh` | `max` | `ultra` | custom string. The allowed model-and-effort combinations in the `model-catalog.md` role table still apply.

## Conversation History

- A 🔧 Operator running prescribed review proof receives the exact execution grant and command procedure. Use `fork_turns="none"` when its packet must exclude the review lead's history; a positive integer inherits parent history, as does `all`.
- No inherited parent history: set `fork_turns="none"`.
- Full parent history (non-reviewers only): set `fork_turns="all"`.
- Full-history inheritance uses the parent model and reasoning effort; omit `model` and `reasoning_effort`.
- Fresh history may pass explicit model and reasoning-effort overrides.

## Workspace Access

Launch with `spawn_agent`. `spawn_agent` has no sandbox field; do not switch to `codex exec --sandbox read-only` to invent one. Reader and writer authority details are owned by `agent-job-packet.md`.

- Readers: assignment contract `workspace read-only`. Parent verifies the repo worktree is unchanged after the receipt.
- Writers: assignment contract `write <paths> (declared)`. Codex cannot path-scope writes while the repo is cwd. Parent verifies the receipt's diff stayed inside the declared scope.

## Examples

```json
{
  "message": "Run only the prescribed proof command after write-set preflight. Capture output and exit code under tmp/, compare git status before and after, and return the observations. Do not edit tracked files.",
  "task_name": "review_proof_operator",
  "model": "gpt-6-luna",
  "reasoning_effort": "medium",
  "fork_turns": "none"
}
```

## Continue, Wait, and Interrupt

Use the lifecycle tools advertised by the current host. On the collaboration surface exposing `followup_task`, use it to send a follow-up and start an idle 🛠️ Worker turn; `send_message` delivers information without starting an idle turn. `wait_agent` waits for activity, `list_agents` reports liveness, and `interrupt_agent` stops the current turn while preserving the Worker relationship. None of those alone proves assignment completion.

When `wait_agent` is available and no independent useful work remains, call it immediately with the explicit `timeout_ms` selected by **Waiting**, within the host's advertised cap and real deadline. Do not replace an expired bounded wait with `list_agents` merely to ask whether a reply arrived. Rearm `wait_agent` when the assignment still warrants waiting; use `list_agents` for actual liveness or dropped-wait recovery evidence.

Other hosts may expose `send_input`, `resume_agent`, or `close_agent`; use them only when actually advertised and follow their returned contracts. Do not invent missing tools or spawn a replacement merely because the 🛠️ Worker is idle. Reuse the returned task/session identity. Display names and agent-router SessionRefs are separate from native tool IDs. A native child can have its own session ID without supporting agent-router direct input.
