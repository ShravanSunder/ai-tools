# Implementation Review Swarm

Shravan review swarm skill.

The skill defines a reusable review pipeline:

- Build a shared review packet with mode, scope, git range, intent, and constraints.
- Run spec compliance before broader quality review when the work has a request or plan.
- Dispatch specialist reviewer lanes, normally backed by Codex subagents.
- Add Claude, Gemini/agy, or another external model lane only on explicit request.
- Reduce every candidate finding through repository evidence before reporting a verdict.

See `SKILL.md` for the workflow and `references/` for prompts.
