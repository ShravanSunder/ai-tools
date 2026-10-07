# 2026-10-09 manage-agents Haiku Workhorse

`shravan-dev-workflow` 2.72.0.

- 🛠️ Worker and 🐒 Sidekick catalogs are separate tables.
- Worker Workhorse is OpenAI Luna or Claude Haiku at high, Exact, Local. Worker Daily driver is Sol or Opus at medium, Complete, Cross-domain.
- Sidekick Workhorse is OpenAI Luna at xhigh or high. Sidekick Daily driver is Sol or Opus at high to xhigh, Partial, Cross-domain or Cross-system.
- Operator catalog adds Claude Haiku at medium and drops Span. Operators stay Exact only.
- Claude and Cursor native Worker/Operator pages list Haiku. No host-to-model routing sentence in `SKILL.md`.

Validation: `claude plugin validate .` and `git diff --check`. Codex and Claude installed caches were not refreshed; refresh follows the post-push or release step.
