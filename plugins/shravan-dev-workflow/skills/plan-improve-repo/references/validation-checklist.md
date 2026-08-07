# Validation Checklist

Use this before returning a current-state validation receipt for an improvement plan.

## Required Checks

- Plan was read end to end after writing or loading.
- Planning admission is `current-three-artifact-design-ready` or `implementation-mechanics-only`, its evidence identity is recorded, and its semantic coverage is current. Missing or semantically stale admission is `blocked`, not `needs-refresh`.
- Planned-at branch and HEAD are recorded; current validation branch/HEAD belongs to this receipt, not the plan artifact.
- Target branch/base branch are recorded when branch-specific.
- Every cited file exists, or the plan says the file is intentionally new.
- Every write surface has a reason to change.
- Tasks are small enough that proof can pass inside scope.
- Proof gates are concrete commands or manual checks, not vibes.
- Focused validation and full validation are separate.
- Red/green proof is required for behavior changes unless the user explicitly approved an exception.
- Security-sensitive surfaces are named when touched.
- Stop conditions cover stale repo state, unrelated validation failures, unexpected secrets, and changed public contracts.

## Verdicts

- `ready`: current plan claims and paths remain valid; this receipt is not approval or execution authority.
- `needs-refresh`: route the exact correction to the originating planner for a corrected completed plan at a new path before review or execution.
- `blocked`: cannot proceed until a named dependency changes.
- `rejected`: obsolete, duplicate, already solved, or not worth doing.

## Readiness Output

```text
Plan: <path>
Verdict: ready | needs-refresh | blocked | rejected

Coverage:
- plan lines: <count>, chunks: <ranges>
- source files reopened: <paths>
- commands checked: <commands or not run/read-only reason>

Proof:
- planning admission:
- red/green:
- focused validation:
- full validation:
- manual/artifact check:

Issues:
- <missing proof, stale path, oversized task, blocker, or none>

Next:
- spec-design | program-design | spec-program-review | plan-handoff | implement-plan for an exact approved draft | review-implementation for general-repo work | skills-creation for a runtime skill package | originating planner correction

```

## Receipt Boundary

Return two separately labeled blocks:

```text
Canonical plan record (unchanged):
  path:
  originating planner:
  planning result:
  complete result payload:
  complete approval-evidence record or explicit absence:

Current-state validation receipt:
  inspected branch/HEAD:
  paths and commands:
  findings:
  verdict: ready | needs-refresh | blocked | rejected
  next owner:
```

Both complete blocks must appear in the live response. A verdict summary or fields scattered through coverage evidence do not replace either block.

Preserve the canonical tuple, planning result, result payload, and approval evidence unchanged. The validation receipt never replaces or abbreviates the canonical record.
