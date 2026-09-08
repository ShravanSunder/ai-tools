# Work trails and orchestration (2.8.0)

- Added track-show-me-your-work: centralized append-only JSONL, optional Markdown detail, and readable end/request views with direct main-agent recording and a Luna Operator-produced readable view.
- Reshaped design orchestration and renamed the implementation delivery coordinator to orchestrator-implementation-goal; active callers and discovery metadata use the new name.
- Replaced blanket observational-log bans with meaningful decision/evidence tracking and current-source verification on resume.
- Added narrow producer admission for one authorized recovery review when prior evidence is unavailable, preserving known normal limits and blocking repeated recovery.
- Default storage is user-local and private; no automatic transcript ingestion, retrospective, scheduler, memory promotion, or SQLite layer was added.
- Version metadata aligned at 2.8.0 for the new tracking skill and renamed implementation orchestrator. No cache refresh or live installation performed.
- Superseded implementation detail: the custom Python helper and its tests were removed; see `2026-09-07-simplify-work-trail-v1.md`. Prior helper proof does not apply to the instruction-only version.
