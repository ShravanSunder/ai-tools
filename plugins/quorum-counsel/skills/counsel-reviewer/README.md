# counsel-reviewer

Codex skill that orchestrates parallel code/plan review using Claude (Opus) + Gemini, then synthesizes findings with confidence scoring.

## Relationship to quorum-counsel

This is the **Codex counterpart** of the Claude Code agent at `plugins/quorum-counsel/agents/counsel-reviewer.md`.

| Aspect | Claude Plugin (counsel-reviewer) | This Skill (counsel-reviewer) |
|--------|----------------------------------|------------------------------|
| Orchestrator | Claude Code (Haiku subagent) | Codex |
| Model A | `codex exec` (GPT-5.3) — bugs/security | `claude -p` (Opus) — bugs/security |
| Model B | `gemini -p` (Gemini 3) — architecture | `gemini -p` (Gemini 3) — architecture |
| Auto-approve | bash-allow.sh PreToolUse hook | prefix_rule() in default.rules |
| Stop gate | review-gate.sh Stop hook | Not available in Codex |
| Slash commands | `/review-pr`, `/review-plan` | Skill auto-triggers by description |

Both versions share:
- The same synthesis strategy (confidence scoring, consensus bonus, weighted aggregation)
- The same severity rubric (P0-P3)
- The same prompt templates (adapted for different subagent CLIs)
- The same output structure (/tmp/counsel-review/)

## Usage

This skill auto-triggers in Codex for plan review (after creating implementation plans) or code review (after completing implementation).
