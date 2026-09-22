# Native Providers: Cursor

Owns Cursor native Task launch and workspace-access encoding. Return the host Task encoding and workspace-access encoding.

This reference applies after `SKILL.md` selects a native Worker or Operator assignment, including a read-only review lane Worker. Persistent Sidekick, Advisor, and Review Sidekick relationships use their separate top-level route.

## Launch

Use the host Task tool for an advertised Cursor model. Do not substitute Cursor CLI or ACPX when Task can spawn the selected model.

Task may omit a sandbox or `workspace_readonly` flag. Do not hop to Cursor CLI to invent one.

## Models

Use the exact model id the host Task tool advertises. The allowed model-and-effort combinations in the `SKILL.md` role table still apply, with this Cursor cut: do not select Sol or Fable. The only Claude selection is Opus 5.5 at `medium`. Do not select Opus `low` or `high` on Cursor. A role row that names Sol or Fable uses Opus 5.5 `medium` on Cursor instead. Current OpenAI choices on Cursor are `gpt-6-astra` and `gpt-6-luna`. If Task still advertises only GPT-5.6, report that gap; do not substitute `gpt-5.6-sol`, `gpt-5.6-terra`, or `gpt-5.6-luna`. Treat `agent --list-models` short names as CLI labels, not native Task ids, unless the host requires them.

## Workspace Access

Reader and writer authority details are owned by `agent-job-packet.md`.

- Readers: assignment contract `workspace read-only`, spawned as a new Task with no `resume` — `resume: "self"` forks the parent's history and is never used for review. Parent verifies the repo worktree is unchanged after the receipt.
- Writers: assignment contract `write <paths> (declared)`. Cursor Task does not path-scope writes. Parent verifies the receipt's diff stayed inside the declared scope.
