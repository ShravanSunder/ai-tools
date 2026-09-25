# Native Providers: Claude

Owns Claude Code native Task / Agent launch and workspace-access encoding. Return the host Task / Agent encoding and workspace-access encoding.

This reference applies after `SKILL.md` selects a native 🛠️ Worker or Operator assignment. Persistent Sidekick, Advisor, and Review Sidekick relationships use their separate top-level route.

## Launch

Use the host Task / Agent tool for the selected Claude model. Do not substitute `claude -p` or ACPX when that tool can spawn the selected model.

Task / Agent may omit plan-mode or readonly flags. Do not hop to `claude -p --permission-mode plan` to invent one.

## Models

Use the exact model id the host Task / Agent tool advertises. The allowed model-and-effort combinations in the `SKILL.md` role table still apply, except native Claude may use Haiku for an 🔧 Operator or Sonnet for a Worker.

## Workspace Access

Reader and writer authority details are owned by `agent-job-packet.md`.

- Readers: assignment contract `workspace read-only`. Parent verifies the repo worktree is unchanged after the receipt.
- Writers: assignment contract `write <paths>`. Path-scoped enforcement: `dontAsk` with `Edit(<paths>/**)` allow rules. Prefer that when enforcement matters; otherwise declared. Parent verifies the receipt's diff stayed inside the declared scope.
