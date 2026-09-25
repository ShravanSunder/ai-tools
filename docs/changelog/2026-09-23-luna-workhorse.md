# Workhorse routing

- Marketplace plugin: `shravan-dev-workflow` `2.58.0` for Codex, Claude Code, and Cursor.
- `manage-agents` uses Workhorse and Daily driver tiers, with Guidance and Architectural span as task signals. Model tables decide eligible roles and effort.
- Workhorse implementation 🐒 Sidekicks answer short owner status checks and route substantive conversation to Main. Agent-role mentions in ten workflow skills and their changed references now show the role emoji by example.
- `implementation-pr-wrapup` uses Workhorse 🛠️ Workers for description drafts and Workhorse Operators for prescribed monitors. Pressure fixtures cover model-table selection and contact boundaries.
- Updated the three plugin manifests, Claude and Cursor marketplace entries, `AGENTS.md`, and the pressure-scenario index. Codex marketplace entries carry no plugin version.
- The pressure harness accepts `SKILL_PRESSURE_CODEX_PATH` for an explicit installed Codex binary while retaining the pinned adapter's read-only mode and client approval boundary.
- Validation: `pnpm --dir tests/skills run test` (123 passed), typecheck, `claude plugin validate .`, and `git diff --check` passed. Four focused live pressure evals ran on the default model; 0 passed. Their transcripts show no tool-level repo-local skill read, and one response reported a read-only source-read block. Behavior proof remains open.
- Codex and Claude cache refresh/reinstall: not run; reserved for an explicit post-push or release proof step.
