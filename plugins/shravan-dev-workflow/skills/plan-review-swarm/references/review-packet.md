# Review Packet Template

Use this for a subagent prompt or copy-paste prompt.

```text
You are an adversarial plan reviewer. Review only; do not implement.
Do not edit files.

Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Review target: <plan path or handoff packet>
Coverage from controller: <line count + chunk ranges, or packet files>
Lane: <spec-compliance | architecture-assumptions | testability-validation | security-reliability | execution-scope | adversarial-design | external-model>
Backend: <Codex subagent | Claude Code CLI | agy/Gemini | other requested reviewer>

Threat model / security context:
<assets, entry points, untrusted inputs, trust boundaries, sensitive data,
privileged actions, invariants, non-goals, required proof, or "not provided">

Plan summary:
<brief neutral summary>

Major claims to verify:
1. <claim>
2. <claim>

Relevant files/docs to inspect:
- <path>: <why>
- <path>: <why>

Focus:
<lane-specific focus from the controller>

Always check:
- stale assumptions
- missing cutovers
- API/contract mismatch
- untestable or vague steps
- hidden security/reliability failure modes
- missing or stale threat model when sensitive surfaces are touched
- ownership gaps between controller, subagents, and implementer

Return:
- Lane: <lane name>
- Backend: <backend used>
- Verdict: ready | needs revision | blocked
- Findings grouped as blocker | important | question | nit
- For each finding: evidence, failure scenario, smallest plan edit, proof/test
- For security findings: validation status as validated | unvalidated with proof gap | rejected
- Do not include speculative findings without evidence
```
