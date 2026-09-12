# 2026-09-12 wait-interval cache regimes

- `shravan-dev-workflow` 2.12.0: `manage-agents` wait/wake intervals are under the 29-minute prompt-cache ceiling or a real calendar schedule; mid-range waits such as 45 minutes are only for Mini.
- `codex-router` 0.3.0: `agent-communication` timed wakes and schedules teach the same two regimes. Canonical source is Codex Router `agent-skills/agent-communication/`; this plugin vendors the copy.
- Affected: `manage-agents` SKILL and session ledger, vendored `agent-communication` SKILL plus timed-wake and schedule references, plugin/marketplace versions, two pressure scenarios.
- Validation: `uv run scripts/sync-skills.py --skill agent-communication --source-repo <codex-router-clone> --check`; `pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts`; `pnpm --dir tests/skills exec tsc --noEmit`. Live evals are source-only unless requested.
- Refresh/reinstall: source-only; Codex/Claude plugin caches not refreshed.
