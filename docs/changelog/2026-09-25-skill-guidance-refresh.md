# 2026-09-25 Skill guidance refresh

- `shravan-dev-workflow` 2.62.0. Owner-approved prompt guidance from the GPT-6 Astra and Opus 5.5 prompting notes.
- `manage-agents`: work that splits into many independent units is pre-authorized to fan out (one 🛠️ Worker per unit, evidence checked per result, one closing table); a drifting agent gets a follow-up correction and is replaced only when its context is contaminated or its session is gone.
- `implementation-pr-wrapup` readiness and the `implementation-review` result now answer the merge-risk / worst-break question and list what could not be verified and where the agent looked.
- Skill descriptions trimmed to about 250 characters: "Use when…" plus at most one near-miss, no workflow summary, no "Always" wording. Also touches `scaffold-project` (ai-scaffold) and `peekaboo` (dev-workflow-tools). The vendored `agent-collaboration` description (308) is an upstream follow-up.
- MUST audit: all-caps MUST/IF stays only in call grammar, quoted grammar or RFC terms, and destructive-operation rules; other shouted wording is plain case with unchanged meaning.
- Decide-and-record and stand-ins: `practices-show-me-your-work` adds decision and stand-in entries (seam, stand-in, assumptions, gain, cost, what closes it) and lists open stand-ins as unverified; `implement-plan` stands in for a missing dependency at a plan-named boundary without claiming proof; `manage-agents` commissions grant that authority and receipts list decisions and open stand-ins; `orchestrator-implementation-goal` and `implementation-pr-wrapup` treat open stand-ins as blockers to readiness unless the owner accepts them; `implementation-review` checks that no stand-in counts as proof; `plan-implementation` slices name dependencies and stand-in boundaries.
- Validation: skill tests 123/123, typecheck, Claude marketplace validation, Codex quick validator. Live behavior evals not run.
- Codex, Claude, and Cursor cache refresh/reinstall: pending post-merge.
