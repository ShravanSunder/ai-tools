# manage-agents effort matrix

- Marketplace plugin: `shravan-dev-workflow` `2.24.0`.
- Affected skill: `manage-agents`. Role tables now bind category to model plus effort.
- Frontier: Astra `high`; Opus 5.5 `medium` or `high`; Fable 5.1 `medium` or `high`; Sol `high` or `xhigh`.
- Balanced: Opus 5.5 `low`; Sol `low` or `medium`.
- Mini: Luna `high` or `xhigh`. Operators use Luna `medium` or `high`. Workers and implementation or research Sidekicks use Luna `high` or `xhigh`.
- Grok stays a lineage and is not a current role-table choice. Unlisted efforts are not a current choice.
- Validation: `pnpm --dir tests/skills run test:unit`. Live evals and cache refresh not run.
