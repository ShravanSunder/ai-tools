# oracle-solver

Codex skill that delegates analysis tasks to GPT-5.4 Pro via `pnpx @steipete/oracle` CLI in browser mode.

## Relationship to quorum-counsel

This is the **Codex counterpart** of the Claude Code agent at `plugins/quorum-counsel/agents/oracle-solver.md`.

| Aspect | Claude Plugin (oracle-solver) | This Skill (oracle-solver) |
|--------|-------------------------------|---------------------------|
| Orchestrator | Claude Code (Haiku subagent) | Codex |
| Calls | `pnpx @steipete/oracle` (GPT-5.4 Pro browser) | `pnpx @steipete/oracle` (GPT-5.4 Pro browser) |
| Safety | Read-only + /tmp output only | Read-only + /tmp output only |
| Output | stdout captured via tee | stdout captured via tee |

The CLI invocation is identical. The difference is the orchestrator: Claude Code uses a Haiku subagent with PreToolUse hooks, while Codex runs the skill inline.

## Important

Oracle is a heavy hitter — expensive (ChatGPT Pro subscription), slow (10-30 min per run). **Never invoke automatically.** Only use when the user explicitly asks to consult Oracle.

## Usage

This skill is available in Codex when the user explicitly asks to consult Oracle (e.g., "ask Oracle", "run Oracle", "consult GPT-5.4 Pro").
