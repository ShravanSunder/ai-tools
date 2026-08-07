# Execution And Proof

This reference owns pre-edit repository validation, ready-frontier selection, slice-local proof, integration gates, surprise classification, and implementation completion reporting for an already admitted plan.

Expected inputs: the unchanged complete canonical plan tuple and result payload, matching later approval evidence for the exact plan path and current meaning, current repository path and intended branch, governing instructions, allowed writes, and known evidence gaps.

Return: the pre-edit verdict, ready frontier, proof and integration contract, classified surprise routes, and completion report.

## Pre-edit Verdict

Read the plan completely, then inspect the current branch/HEAD, worktree status and diff, applicable repository instructions, every named owner/path/interface, dependency or collision edge, validation command, security assumption, and proof seam needed by the first candidate slice.

Return one verdict:

```text
ready
  the exact approved plan path and current meaning still match current source, the first slice's
  writes and commands are real, and its required proof can run inside scope

route
  a design or plan owner must correct meaning before execution can proceed

blocked
  authority, environment, write scope, dependency, or proof is unavailable
  without changing the approved plan or user boundary
```

Record the inspected branch/HEAD, pre-existing changes, instruction sources, validated paths and commands, applicable trust boundaries, and any contradiction. Never silently absorb unrelated dirty work or rewrite the plan to match current source.

## Ready Frontier

The ready frontier is the smallest plan slice whose prerequisites are proven and whose write scope does not collide with in-flight work. Prefer one vertical slice that changes behavior and proves it at the cheapest fitting observation seam.

- Execute inline by default.
- Parallel work is advisory and only eligible when the approved plan identifies independent slices with disjoint writes after proven prerequisites. `manage-agents` owns dispatch mechanics.
- Contract-only or prefactoring work must name the downstream consumer it unlocks and integrate at that consumer's first interaction.
- A slice too large to prove inside scope returns a split or plan-defect route before edits.

Return the selected slice, prerequisites, allowed writes, non-goals, collision decision, and first integration gate. For one isolated slice with no separately changed parts, return `integration gate: not applicable` with that reason instead of inventing a gate.

## Proof And Integration Contract

For the selected slice, map each obligation to the smallest observation that can confirm it:

```text
obligation | changed owner/path | automated proof | manual/runtime proof |
quality proof | integration gate | freshness anchor
```

Use repository-required red/green for behavior changes unless the governing plan records a valid exception. Run the focused proof before wider regression checks. Re-read the changed files and diff, then run applicable format, lint, typecheck, and broader tests. Manual or runtime proof is required when the obligation is observable only through a runnable surface; a unit test is not relabeled smoke or runtime proof.

Never weaken a proof gate. A failing required gate triggers diagnosis, a smaller provable split, or an exact route. An unrelated infrastructure failure is reported separately from scoped behavior proof and does not authorize infrastructure edits outside the plan.

Integrate only when every named prerequisite and the slice-local proof are green. At the first interaction between separately changed parts, run the plan's integration gate before dependent work proceeds.

## Accepted Review Remediation

Inspect the accepted finding, its source anchors, parent disposition, exact route, governing plan obligation, and prior proof before treating remediation as executable work. An implementation-owned correction changes code, tests, fixtures, or implementation-proof evidence inside approved meaning and write scope. A finding that changes an obligation, observable contract, owner, interface, state/failure policy, sequence, dependency, collision, proof seam, or authority routes to the applicable design or originating-plan owner instead.

For an implementation-owned finding, select one bounded corrective slice, name its allowed writes, and map every affected obligation to fresh focused, integration/manual, and quality proof as applicable. Do not resolve the finding from reviewer prose or reuse proof produced before the correction. After the correction and affected proof, return that the prior review coverage is stale and later independent review must be fresh; stop before launching that review.

Remediation admission is complete when the accepted finding and parent route are source-backed, the correction stays inside approved meaning, the affected-proof set is explicit, and the next action is either the bounded correction or one exact semantic/planning route.

## Surprise Classification

```text
reversible drift
  implementation wandered within the approved meaning and can be corrected
  before another slice depends on it -> correct, record, re-prove

design break
  Requirements, observable contract, structural ownership/interface/state,
  failure, concurrency, trust, compatibility, or proof seam is wrong or absent
  -> stop at spec-design or program-design as the affected meaning requires

plan defect
  slice, sequence, dependency, collision, write scope, or proof mapping is wrong
  -> stop at the recorded originating planner

out-of-scope infrastructure failure
  required tooling or environment failed outside the approved change surface
  -> preserve scoped evidence and return the exact external owner/blocker

evidence gap
  the required observation cannot be obtained without new authority or a plan
  change -> stop with the missing proof and owner decision
```

Do not call a change reversible when it moves ownership, changes a public contract or data format, writes migration state, weakens proof, or becomes a prerequisite for other work before correction.

## Completion Report

Return implementation evidence keyed to the unchanged canonical tuple and complete separate approval-evidence record or explicit absence:

```text
implementation base/HEAD/diff:
covered obligations and slices:
changed files:
automated commands and exit codes:
manual/runtime observations:
quality results:
integration gates:
reversible drift corrected:
incomplete rows:
blockers and exact routes:
proof freshness:
```

Complete when: the pre-edit verdict was `ready`; each claimed row has fresh fitting evidence; integration gates ran at the first interaction; every surprise has one classification and owner; incomplete rows remain explicit; and neither the plan tuple nor approval evidence was mutated.
