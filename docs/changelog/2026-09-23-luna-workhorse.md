# Workhorse routing

- Marketplace plugin: `shravan-dev-workflow` `2.58.0` for Codex, Claude Code, and Cursor.
- `manage-agents` uses Workhorse and Daily driver tiers. Guidance, Architectural span, and Latency keep Workhorse on clear background work and out of interactive or event-keeping seats.
- Workhorse implementation 🐒 Sidekicks answer short owner status checks and route substantive conversation to Main. Agent-role mentions in ten workflow skills and their changed references now show the role emoji by example.
- `implementation-pr-wrapup` uses Workhorse 🛠️ Workers for description drafts and Workhorse 🔧 Operators for blocking monitors. Pressure fixtures cover the new selection and contact boundaries.
- Updated the three plugin manifests, Claude and Cursor marketplace entries, `AGENTS.md`, and the pressure-scenario index. Codex marketplace entries carry no plugin version.
- Validation: `pnpm --dir tests/skills run test` (122 passed), `pnpm --dir tests/skills run typecheck`, `claude plugin validate .`, and `git diff --check` passed. Live pressure evals remain unverified because the non-interactive ACPX subject could not obtain a source-read permission; the default configured model was also unavailable in the installed adapter.
- Codex and Claude cache refresh/reinstall: not run; reserved for an explicit post-push or release proof step.
