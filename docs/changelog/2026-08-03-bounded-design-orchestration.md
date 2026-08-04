# 2026-08-03 Bounded Design Orchestration

Plugin: `shravan-dev-workflow` 1.7.11

## User-visible behavior

- Adds `orchestrator-design` for one bounded design cycle from `spec-design` through `program-design` and independent pair review. It is a guarded router and temporary recorder, not another requirements, architecture, or review decision-maker.
- Starts every fresh full cycle with `spec-design`; initial requirements pathfinding remains owned by specification design.
- Makes each participating phase return one compact pointer-based handoff or an exact stop. Pathfinding preserves the caller-selected return owner, and review routes only parent-validated findings.
- Allows bounded pre-review recovery, one pair review, and one post-review correction pass. A semantic correction never triggers an automatic second review.
- Preserves resumable state under `tmp/design-orchestration/` without a runtime library, parser, schema, database, hash, or digest.

## Changed surfaces

- New `orchestrator-design` skill and its `design-run-state` reference.
- Return contracts for `spec-design`, `program-design`, `spec-program-review`, and `discuss-pathfinding`.
- Permanent Luna-high/Terra-medium pressure scenarios for the four direct phase handoffs, exact pathfinding returns and stops, fresh and resumed routing, invalid routes, bounded pre-review recovery, and the stale-review stop.
- Codex and Claude plugin metadata, marketplace metadata, repository instructions, and workflow README.

## Validation

- Focused pressure scenarios ran through native Vitest concurrency (`maxConcurrency: 8`) with Luna-high subjects and Terra-medium semantic judges. The initial 13-case review run exposed four gaps; targeted current-source reruns closed them. Every affected route has a passing current receipt, including both no-user pathfinding branches, both return-mismatch meanings, exact phase handoffs, bounded pre-review recovery, stale-review stop, and parent-validated review routing.
- `pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts` — passed: 16 files, 82 tests.
- `pnpm --dir tests/skills exec tsc --noEmit` — passed.
- `claude plugin validate .` — passed.
- Worktree manifest assertion — passed: Claude marketplace and both plugin manifests target `1.7.11`; both plugin manifests include `orchestrator-design`.
- `git diff --check` — passed.
- `codex plugin list --marketplace ai-tools --available --json` — command passed, but reports the separately installed main-worktree cache at `1.7.8`; it is not treated as source validation or refresh proof.

## Refresh / reinstall

- Source metadata targets `shravan-dev-workflow` 1.7.11.
- Local Codex and Claude caches are not refreshed by this source change.
