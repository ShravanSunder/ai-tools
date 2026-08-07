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

- Focused Vitest: 4 files, 39 tests passed (exit 0).
- Full unit Vitest: 17 files, 109 tests passed (exit 0).
- TypeScript typecheck: `pnpm --dir tests/skills run typecheck` passed (exit 0).
- The exact 62-case integrated pressure selection was attempted with Luna xhigh
  and Terra medium: 52 passed and 10 failed (108 unrelated cases skipped; exit
  1). Two deterministic fixture/criterion defects were corrected and their
  targeted rerun passed 2/2. An eight-case follow-up passed 5/8; a final bounded
  three-case confirmation passed 1/3. The remaining two failures preserved the
  correct safety decision but omitted already-required response fields, so the
  pressure route is not claimed green and no extra runtime prose was added to
  chase output variance. Independent Fable and Sol reviews reproduced those two
  omissions. One bounded remediation made the exact delegation row and complete
  accepted-spec run note non-optional. Its initial two-case rerun reported 2/2,
  but review found the accepted-spec subject had inspected test machinery. The
  harness now forbids that inspection unconditionally; the delegation case has a
  clean pass, while three uncontaminated accepted-spec retries kept the safe stop
  and review route but varied on required receipt fields. That case and the
  original 62-case batch are not claimed green.
- `git diff --check` passed (exit 0).
- Six changed or directly affected skill packages passed the Codex skill quick
  validator.
- Manifest JSON and source-version sync passed at `2.1.0`; `claude plugin
  validate .` and the Codex marketplace listing passed.
- Active retired-route scanning and the added-line public-safety scan passed.
- Codex installed readback still reports `2.0.0`; this is disclosed cache state,
  not source or behavior proof.

## Refresh / reinstall

- Source metadata targets `2.1.0`.
- No Codex or Claude cache refresh/reinstall was performed or claimed. Installed
  cache state is not used as runtime proof.
