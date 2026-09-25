# 2026-09-25 Skill guidance refresh

- `shravan-dev-workflow` 2.62.0. Owner-approved prompt guidance from the GPT-6 Astra and Opus 5.5 prompting notes.
- `manage-agents`: work that splits into many independent units is pre-authorized to fan out (one 🛠️ Worker per unit, evidence checked per result, one closing table); a drifting agent gets a follow-up correction and is replaced only when its context is contaminated or its session is gone.
- `implementation-pr-wrapup` readiness and the `implementation-review` result now answer the merge-risk / worst-break question and list what could not be verified and where the agent looked.
- Skill descriptions trimmed to about 250 characters: "Use when…" plus at most one near-miss, no workflow summary, no "Always" wording. Also touches `scaffold-project` (ai-scaffold) and `peekaboo` (dev-workflow-tools). The vendored `agent-collaboration` description (308) is an upstream follow-up.
- MUST audit: all-caps MUST/IF stays only in call grammar, quoted grammar or RFC terms, and destructive-operation rules; other shouted wording is plain case with unchanged meaning.
- Validation: skill tests 123/123, typecheck, Claude marketplace validation, Codex quick validator. Live behavior evals not run.
- Codex, Claude, and Cursor cache refresh/reinstall: pending post-merge.
