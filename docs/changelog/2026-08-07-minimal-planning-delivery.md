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
- Gives the shared plan contract one numbered sequence of action-led headings
  instead of two different "admission" sections and compressed noun stacks.
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

- Focused Vitest: 4 files, 37 tests passed (exit 0).
- Full unit Vitest: 17 files, 109 tests passed (exit 0).
- TypeScript typecheck: `pnpm --dir tests/skills run typecheck` passed (exit 0).
- The exact 62-case integrated pressure selection was attempted with Luna xhigh
  and Terra medium: 52 passed and 10 failed (108 unrelated cases skipped; exit
  1). Two deterministic fixture/criterion defects were corrected and their
  targeted rerun passed 2/2. An eight-case follow-up passed 5/8; a bounded
  three-case confirmation passed 1/3. The two remaining responses both made the
  required safe stop but omitted nested run-note wording. Owner review rejected
  that receipt formatting as irrelevant to the safety claim. Read-only
  accepted-spec verification or expiry therefore no longer requires the full
  Scaled Run Note, and the scenario now grades the behavior that matters: stale
  acceptance expires, the semantic spec change returns to review, and no skill
  implementation occurs. Five uncontaminated transcripts satisfy the revised
  assertions; a fresh Luna xhigh / Terra medium targeted run passed 1/1 (exit
  0). The original 62-case batch was not rerun and is not claimed green.
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
