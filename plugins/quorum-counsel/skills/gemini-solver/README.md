# gemini-solver

Codex skill that delegates analysis tasks to Google Gemini via `gemini -p` CLI in headless mode.

## Relationship to quorum-counsel

This is the **Codex counterpart** of the Claude Code agent at `plugins/quorum-counsel/agents/gemini-solver.md`.

| Aspect | Claude Plugin (gemini-solver) | This Skill (gemini-solver) |
|--------|-------------------------------|---------------------------|
| Orchestrator | Claude Code (Haiku subagent) | Codex |
| Calls | `gemini -p` (Gemini 3 Pro) | `gemini -p` (Gemini 3 Pro) |
| Safety | Read-only in `-p` mode | Read-only in `-p` mode |
| Output | `jq -r '.response'` | `jq -r '.response'` |

The CLI invocation is identical. The difference is the orchestrator: Claude Code uses a Haiku subagent with PreToolUse hooks, while Codex runs the skill inline with prefix_rule allowlists.

## Usage

This skill auto-triggers in Codex when the task matches the description (large codebase understanding, architecture analysis, second opinion from a different model family).
