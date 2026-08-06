# 2026-08-06 Three-Artifact Design Review

Plugin: `shravan-dev-workflow` 2.0.1

## User-visible behavior

- Replaces the active `pair` review identity with one
  `three-artifact-design` review over distinct Requirements, Specification,
  and Program Design identities.
- Requires planning admission and design handoffs to preserve current semantic
  coverage plus exact review invocation and result identities for all three
  artifacts.
- Keeps specification-only and program-design-only review modes available.
  Historical changelogs, WIP artifacts, retired skills, and retired pressure
  scenarios retain their original terminology as provenance.

## Changed surfaces

- Renames the active `spec-program-review` runtime reference from
  `reviewing-pair.md` to `reviewing-three-artifact-design.md` with no alias or
  forwarding stub.
- Updates `spec-program-review`, `orchestrator-design`, `spec-design`,
  `program-design`, `spec-handoff`, and `plan-improve-repo`, plus their active
  references, callers, metadata, unit contracts, and pressure scenarios.
- Updates both source plugin manifests and the Claude marketplace metadata to
  `2.0.1`. The Codex marketplace continues to use the same local source path
  and availability policy.

## Validation

- Focused Vitest: 1 file, 13 tests passed (exit 0).
- Full unit Vitest: 16 files, 84 tests passed (exit 0).
- TypeScript typecheck: `pnpm --dir tests/skills run typecheck` passed (exit 0).
- Focused affected pressure evaluation attempted 19 selected cases: 12 passed,
  5 failed, and 2 remained incomplete until the run was interrupted after
  12.5 minutes (91 unrelated cases skipped; exit 1). One failure was a
  semantic omission of stored boundary status, one was inconclusive because
  ACPX could not initialize its Codex adapter, three passed their scenario
  contract but failed required source-read observability before semantic
  judging, and two subject runs did not complete. The pressure route is not
  claimed green.
- Manifest JSON parse: all four marketplace/plugin JSON files passed `jq`
  validation (exit 0).
- `git diff --check`, active stale-terminology scanning, deleted-reference
  absence, and replacement-reference presence passed (exit 0).
- `claude plugin validate .` passed (exit 0).
- `codex plugin list --marketplace ai-tools --available --json` passed (exit
  0). Installed readback still reports 2.0.0 because no cache refresh was
  performed; 2.0.1 installed runtime behavior is not claimed.

## Refresh / reinstall

- Source metadata targets `2.0.1`.
- No Codex or Claude cache refresh/reinstall was performed or claimed;
  installed-cache state is not used as runtime proof.
