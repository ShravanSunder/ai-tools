# claude-solver

Codex skill that delegates analysis tasks to Claude (Opus) via `claude -p` CLI in headless mode.

## Relationship to quorum-counsel

This is the **Codex counterpart** of the Claude Code agent at `plugins/quorum-counsel/agents/codex-solver.md`.

| Aspect | Claude Plugin (codex-solver) | This Skill (claude-solver) |
|--------|------------------------------|---------------------------|
| Orchestrator | Claude Code | Codex |
| Calls | `codex exec` (GPT-5.3) | `claude -p` (Opus) |
| Safety | `--sandbox workspace-write` | `--tools "Read,Glob,Grep,Bash"` |
| Output | `-o` flag writes to /tmp | JSON stdout → `jq -r '.result'` |

Both serve the same purpose: get a different model's perspective on a problem. The difference is which model is the orchestrator and which is the subagent.

## Usage

This skill auto-triggers in Codex when the task matches the description (stuck debugging, need codebase exploration, architecture analysis, impact analysis).
