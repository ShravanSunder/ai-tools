# 2026-10-09 remove pressure scenarios

No plugin version change: repository test content, plus one maintainer-doc line in `shravan-dev-workflow` (no behavior change). Owner decision: pressure testing is redesigned from scratch, so the repository keeps no stored scenarios; the existing harness stays.

- Removed every scenario under `tests/skills/pressure-scenarios/` (shravan-dev-workflow, agent-router, dev-workflow-tools) and `tests/skills/retired-pressure-scenarios/`.
- Kept the harness: the evaluator library under `tests/skills/lib/skill-pressure-evaluation/`, the eval suite, fixtures, schemas, and package scripts. With no scenario directory, `pnpm --dir tests/skills run test:evals` exits 1 with nothing to run; the README says so.
- Three harness unit tests read real scenarios; they now read sample copies under `tests/skills/fixtures/sample-scenarios/` (one discuss-pathfinding scenario with a one-entry evaluator registry, two manage-agents scenarios).
- Two static contract tests no longer assert that scenario files exist.
- `shravan-dev-workflow` `docs/source-inspiration-catalog.md` no longer tells maintainers to add pressure scenarios.
- Validation: `pnpm --dir tests/skills test` 17 files, 123 tests passed; `pnpm --dir tests/skills typecheck` exit 0; `claude plugin validate .` passed.
- Codex and Claude cache refresh: not needed (no plugin version change).
