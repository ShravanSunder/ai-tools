# manage-agents Sidekick Luna xhigh

- Marketplace plugin: `shravan-dev-workflow` `2.20.0`; `agent-router` remains `0.13.0`.
- Affected skill: `manage-agents`. Implementation and research Sidekick catalog now includes Mini OpenAI Luna xhigh for Exact steps; Local/Cross-domain, matching the Worker row.
- User-visible change: a continuing Sidekick may be Luna xhigh; it is no longer Balanced-only.
- Added pressure fixture `manage-agents-sidekick-luna-xhigh`.
- Validation: JSON parse, `git diff --check`, `pnpm --dir tests/skills run test:unit`. Live evals and cache refresh not run.
