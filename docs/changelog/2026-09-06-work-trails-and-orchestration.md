# Work trails and orchestration (2.8.0)

- Added track-show-me-your-work: centralized append-only JSONL, optional Markdown detail, and readable end/request views with a direct helper workflow.
- Reshaped design orchestration and renamed the implementation delivery coordinator to orchestrator-implementation-goal; active callers and discovery metadata use the new name.
- Replaced blanket observational-log bans with meaningful decision/evidence tracking and current-source verification on resume.
- Added narrow producer admission for one authorized recovery review when prior evidence is unavailable, preserving known normal limits and blocking repeated recovery.
- Default storage is user-local and private; no automatic transcript ingestion, retrospective, scheduler, memory promotion, or SQLite layer was added.
- Validation: 23 helper integration tests, 108 existing unit tests, type/lint/format checks, five skill validators, Claude packaging, and local CLI proof passed; four focused live scenarios pass; three remain non-passing due JSON-only response handling after stop-hook continuation.
- Version metadata aligned at 2.8.0 for the new tracking skill and renamed implementation orchestrator. No cache refresh or live installation performed.
- Local checks: 23 helper integration tests and 118 harness/package tests pass. Four earlier live scenarios pass; the final three-case retest after collector fixes failed before grading (ACPX exit 1, empty stderr).
