# Implementation Subagent Review

Codex-first review swarm skill.

The skill defines a reusable review pipeline:

- Build a shared review packet with mode, scope, git range, intent, and constraints.
- Run spec compliance before broader quality review when the work has a request or plan.
- Dispatch specialist Codex reviewer subagents.
- Include `agy` as external counsel for substantial reviews when available.
- Add Claude or extra Gemini/agy only on explicit request.
- Reduce every candidate finding through repository evidence before reporting a verdict.

See `SKILL.md` for the workflow and `references/` for prompts.
