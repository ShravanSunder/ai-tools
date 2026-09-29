# 2026-09-29 manage-agents Sol and Opus Daily driver

`shravan-dev-workflow` 2.70.0.

- Worker / Sidekick OpenAI Sol is Daily driver, Thinking Effort medium to high, Partial, Cross-domain and Cross-system.
- Review and Advisor OpenAI Sol stay xhigh Daily driver. Advisor Sol is a new pickable row.
- Review and Advisor Claude Opus move from Frontier to Daily driver xhigh and are no longer `User must authorize`.
- Review gains a Use column. Review Astra stays Frontier and is `User must authorize`. Advisor Astra and Fable stay request-only.
- Pressure scenarios `model-thinking-selection`, `owner-authorization-required`, and `delegate-frontier-reviewer-only` follow the new rows.

Validation: `pnpm --dir tests/skills run test` and typecheck after the edit. Codex and Claude installed caches were not refreshed; refresh follows the post-push or release step.
