# Native Providers: Cursor

Owns Cursor native Task launch and workspace-access encoding. Return the host Task encoding and workspace-access encoding.

This reference applies after `SKILL.md` selects a native 🛠️ Worker or Operator assignment. Persistent Sidekick, Advisor, and Review Sidekick relationships use their separate top-level route.

## Launch

Use the host Task tool for a model listed below. Do not substitute Cursor CLI or ACPX when Task can spawn the selected model.

Task may omit a sandbox or `workspace_readonly` flag. Do not hop to Cursor CLI to invent one.

## Models

| Role | Model | Route |
| --- | --- | --- |
| 🛠️ Worker | xAI Grok 4.6, medium, in place of a Daily-driver row; or Claude Opus, when the Models row picks it | native Task |
| 🔧 Operator | OpenAI Luna | agent-router (see Launch in `SKILL.md`) |

Other Claude Opus efforts and Claude Fable only on owner request. Resolve the exact id with the exact-id rule in `SKILL.md` Launch. Treat `agent --list-models` short names as CLI labels, not native Task ids, unless the host requires them.

## Workspace Access

Access limits: `agent-job-packet.md` Limits.

- Readers: assignment contract `workspace read-only`, spawned as a new Task with no `resume` — `resume: "self"` forks the parent's history and is never used for review. Parent verifies the repo worktree is unchanged after the receipt.
- Writers: assignment contract `write <paths> (declared)`. Cursor Task does not path-scope writes. Parent verifies the receipt's diff stayed inside the declared scope.
