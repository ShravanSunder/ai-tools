# 2026-09-25 Capability revamp: practices and the tool manual

- `shravan-dev-workflow` 2.60.0 and `agent-router` 0.16.0 (PR 1 of the capability revamp; spec `docs/wip/skills-authoring/2026-09-25-capability-revamp/proposal.md`).
- `agent-collaboration` is now a tool manual only: calls, identity, seat values, listen/wait, wakes, schedules, and uncertain-mutation recovery. Coordination policy, seat meanings, and resolution rules moved out. Re-vendored byte for byte from codex-router commit `f6eb23cd` (PR #77); `plugin-sources.json` pins it.
- New `practices-collaboration`: finds the repository's board project and work thread at entry, asks the owner once and returns `no-home` when none exists, maps seats by role, separates messages from posts, owns waiting and listening, and owns resolution.
- Renamed `track-show-me-your-work` to `practices-show-me-your-work` (hard cutover, every consumer swapped). It opens the trace at the start of a qualifying task; with no board it writes an unshared `docs/wip/work-trails/<date-label>/` folder, one writer per file, which Main later transfers to the board.
- `manage-agents` restructured around one Authority section, roles and titles, selection, runtime, handoff, and verify; model tables moved to `references/model-catalog.md`, ACPX to `references/acpx-legacy.md`. The Codex adapter effort key is `reasoning_effort`.
- Eval harness: ACPX now denies unrecognized permission requests instead of failing the turn.
- Validation: skill tests 123/123, typecheck, Claude marketplace validation, Codex quick validator on four skills, and `git diff --check` passed. Live behavior evals for the new scenarios are blocked by an out-of-credits Codex workspace; see [evidence](references/2026-09-25-capability-revamp-practices-proof.md).
- Codex, Claude, and Cursor cache refresh/reinstall: pending; ships paired with the devfiles prompt update.
