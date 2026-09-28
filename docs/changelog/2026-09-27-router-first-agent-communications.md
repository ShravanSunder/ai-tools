# 2026-09-27 Router-first agent communications

- `shravan-dev-workflow` 2.65.0 updates `practices-collaboration` and `manage-agents`: cross-session messages use Router with a supplied SessionRef first, while native in-session teammate messaging remains available. Persistent Codex, Claude Code, and Cursor commissions use Router when capabilities fit, with create, title, then direct assignment. ACPX requires an observed capability gap; access denial requires the host grant.
- Updated `practices-collaboration` waiting guidance and `manage-agents` ACPX reference, five pressure scenarios, Codex/Claude/Cursor plugin manifests, and Claude/Cursor marketplace versions. The Codex marketplace entry has no version field.
- Validation: `git diff --check` passed; skill test typecheck passed; 123 unit tests passed; Claude marketplace validation passed. Five focused real-model pressure cases passed after configuring the installed Codex binary and a writable npm cache. The live Claude-to-Main journey awaits the codex-router discovery change and Host restart.
- Codex, Claude, and Cursor cache refresh: pending owner.
