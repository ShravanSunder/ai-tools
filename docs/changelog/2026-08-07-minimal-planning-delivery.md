# 2026-08-07 Minimal Planning And Delivery

Plugin: `shravan-dev-workflow` 2.1.0

## User-visible behavior

- Adds `plan-implementation` to translate one current reviewed Requirements,
  Specification, and Program Design set into a proportional proof-bearing
  Markdown implementation plan.
- Adds `implement-plan` to validate one exact separately approved plan, execute
  its smallest ready frontier, and return implementation proof without taking
  over review or PR lifecycle work.
- Adds `review-implementation` for one regimented independent reconstruction of
  implementation and proof, with one focused follow-up only when a concrete
  residual risk remains.
- Restores `orchestrator-goal` as a thin long-horizon router through phase-owned
  evidence to a PR-ready, unmerged terminal. It does not duplicate phase
  judgment or maintain a second lifecycle ledger.
- Keeps the canonical Markdown plan authoritative. Optional `ops-*` tracking is
  a projection only; tickets do not become a second plan.
- Does not restore the retired planning or implementation swarms.

## Changed surfaces

- Adds the four active skill packages, supporting references, Codex metadata,
  pressure scenarios, fixtures, and deterministic/semantic evaluator coverage.
- Adds one shared canonical implementation-plan contract and updates active
  handoff, design, planning, review, and PR-lifecycle callers to preserve it.
- Updates the plugin README, repository skill inventory, both source plugin
  manifests, and Claude marketplace metadata. The Codex marketplace continues
  to use the same local source and availability policy.

## Validation

- Focused Vitest: 3 files, 28 tests passed (exit 0).
- Full unit Vitest: 17 files, 106 tests passed (exit 0).
- TypeScript typecheck: `pnpm --dir tests/skills run typecheck` passed (exit 0).
- The exact 62-case integrated pressure selection was attempted with Luna xhigh
  and Terra medium: 52 passed and 10 failed (108 unrelated cases skipped; exit
  1). Two deterministic fixture/criterion defects were corrected and their
  targeted rerun passed 2/2. An eight-case follow-up passed 5/8; a final bounded
  three-case confirmation passed 1/3. The remaining two failures preserved the
  correct safety decision but omitted already-required response fields, so the
  pressure route is not claimed green and no extra runtime prose was added to
  chase output variance.
- `git diff --check` passed (exit 0).
- Manifest JSON, Claude plugin validation, Codex marketplace listing, stale
  route scanning, and public-safety checks are release gates recorded after the
  final source review.

## Refresh / reinstall

- Source metadata targets `2.1.0`.
- No Codex or Claude cache refresh/reinstall was performed or claimed. Installed
  cache state is not used as runtime proof.
