# Native Providers: Claude

Owns Claude Code native Task / Agent launch and workspace-access encoding. Return the host Task / Agent encoding and workspace-access encoding.

This reference applies after `SKILL.md` selects a native subagent assignment. Sidekick/Advisor separate-conversation requirements take precedence over native model availability.

## Launch

Use the host Task / Agent tool for the selected Claude model. Do not substitute `claude -p` or ACPX when that tool can spawn the selected model.

Task / Agent may omit plan-mode or readonly flags. Do not hop to `claude -p --permission-mode plan` to invent one.

## Models

Use the exact model id the host Task / Agent tool advertises. The allowed model-and-effort combinations in the `SKILL.md` role table still apply.

## Workspace Access

Reader and writer packet slots are owned by `agent-job-packet.md`.

- Readers: packet `workspace read-only`. Parent verifies the repo worktree is unchanged after the receipt.
- Writers: packet `write <paths>`. Path-scoped enforcement: `dontAsk` with `Edit(<paths>/**)` allow rules. Prefer that when enforcement matters; otherwise declared. Parent verifies the receipt's diff stayed inside the declared scope.
