# 2026-09-25 Capability revamp: phases, tokens, and research

- `shravan-dev-workflow` 2.61.0 (PR 2 of the capability revamp; spec `docs/wip/skills-authoring/2026-09-25-capability-revamp/proposal.md`).
- Layering is a DAG between levels only: skills in one level may name each other; none names a higher level. Phases no longer name orchestrators; practices, presentation, and shared references no longer name phases except as consumer declarations or data values.
- New `shared-references/phase-return-tokens.md`: seven return tokens with payloads. Orchestrators map them to the next owner (including `plan-defect` through the plan's `originating planner` and `ready-for-review` through `general-domain | runtime-skill-package`); mapping never widens the requested task.
- Renamed `research-workflow` to `practices-research` (hard cutover); ledgers move to `tmp/practices-research/`; research returns a token instead of naming a phase.
- Every phase skill opens or resumes the trace through `practices-show-me-your-work` at entry and checkpoints at completion.
- `requirements-specification-program-design.md` and `canonical-implementation-plan.md` route by token; the `pr-ready-unmerged` terminal default moves into `orchestrator-implementation-goal`.
- New scenarios: `practices-research-renamed-research-invocation`, `implementation-review-direct-entry-opens-trace`, `spec-program-review-returns-specification-gap`.
- Validation: skill tests 123/123, typecheck, Claude marketplace validation, `git diff --check`, cross-level upward-name check, renamed-name search. Live behavior evals blocked by an out-of-credits Codex workspace; claim level: drafted from user intent.
- Codex, Claude, and Cursor cache refresh/reinstall: pending post-merge.
