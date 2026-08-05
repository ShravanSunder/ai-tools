# Validation Checklist

Use this before calling an improvement plan ready for review, handoff, or execution.

## Required Checks

- Plan was read end to end after writing or loading.
- Planning admission is `current-pair-ready` or `implementation-mechanics-only`, its evidence identity is recorded, and its semantic coverage is current. Missing or semantically stale admission is `blocked`, not `needs-refresh`.
- Planned-at SHA and current SHA are recorded.
- Target branch/base branch are recorded when branch-specific.
- Every cited file exists, or the plan says the file is intentionally new.
- Every write surface has a reason to change.
- Tasks are small enough that proof can pass inside scope.
- Proof gates are concrete commands or manual checks, not vibes.
- Focused validation and full validation are separate.
- Red/green proof is required for behavior changes unless the user explicitly approved an exception.
- Security-sensitive surfaces are named when touched.
- Stop conditions cover stale repo state, unrelated validation failures, unexpected secrets, and changed public contracts.
- Handoff prompt names repo, plan path, first validation step, and parent ownership.

## Verdicts

- `ready`: portable for handoff; execution/review readiness remains blocked when those runtime routes are not shipped.
- `needs-refresh`: update plan before review or execution.
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
- spec-design | program-design | spec-program-review | plan-handoff | blocked execution/review gate | refresh plan
```
