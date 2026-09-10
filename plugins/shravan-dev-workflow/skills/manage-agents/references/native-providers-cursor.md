# Native Providers: Cursor

Owns Cursor native Task launch and workspace-access encoding. Return the host Task encoding and workspace-access encoding.

## Launch

Use the host Task tool for an advertised Cursor model. Do not substitute Cursor CLI or ACPX when Task can spawn the selected model.

Task may omit a sandbox or `workspace_readonly` flag. Do not hop to Cursor CLI to invent one.

## Models

Use the exact model id the host Task tool advertises. Pattern floors from `SKILL.md` still apply. Treat `agent --list-models` short names as CLI labels, not native Task ids, unless the host requires them.

## Workspace Access

Reader and writer packet slots are owned by `agent-job-packet.md`.

- Readers: packet `workspace read-only`, spawned as a new Task with no `resume` — `resume: "self"` forks the parent's history and is never used for review. Parent verifies the repo worktree is unchanged after the receipt.
- Writers: packet `write <paths> (declared)`. Cursor Task does not path-scope writes. Parent verifies the receipt's diff stayed inside the declared scope.
