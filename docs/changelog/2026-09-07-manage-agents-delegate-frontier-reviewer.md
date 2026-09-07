# 2026-09-07 — manage-agents Delegate Frontier is reviewer-only

Plugin: `shravan-dev-workflow` 2.7.0 → 2.8.0.

- Delegate table now includes Frontier Astra and Fable (`medium`/`high`) plus a Why column. Only the Frontier rows say `as reviewer only`; Balanced and Mini Why cells stay empty. Delegate Sol thinking is `medium` only.
- Capability Economics no longer routes architecture+Frontier off Delegate onto Advisor. Delegate Frontier is reviewer-only; persistent architecture guidance stays Advisor.
- Review skills keep the single-assignment Delegate pattern. Independent review may take Astra/Fable without becoming an Advisor. Implementation and other thinking Delegates stay Balanced.
- Pressure scenario: `manage-agents-delegate-frontier-reviewer-only`.
- Manifests: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, plus Claude and Cursor marketplace entries, bumped to 2.8.0.
- Validation: `claude plugin validate .` passed; `validate_plugin.py plugins/shravan-dev-workflow` passed; `quick_validate.py` on `manage-agents` returned `Skill is valid!`; `pnpm --dir tests/skills exec vitest run lib` 108/108. Live pressure evals were not run.
- Refresh/reinstall: pending until Codex/Claude/Cursor plugin caches refresh.
