---
name: implement-plan
description: Use when executing or continuing an approved implementation plan, checking that its path and approval still match its current meaning, or correcting an implementation-owned finding from review-implementation. Not for plan or design defects, changes to one named runtime skill package or an accepted multi-run skill-change slice without explicit skills-creation composition, independent implementation review, tracker publication, or PR lifecycle work.
---

# Implement Plan

Implementation executes one approved immutable plan against the current repository. Check authority and reality before editing, then complete the smallest safe slice that can be proven. A surprise that changes meaning returns to its owner; execution never invents a seam merely to keep moving.

## Check Whether Implementation Can Start

1. Classify the target as `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` parent identity authorizing composition; otherwise return that route and stop.
2. MUST load `../../shared-references/canonical-implementation-plan.md` to validate the complete plan record, result-specific payload, and separate approval-evidence record or explicit absence, and return `admit | route | blocked` with the exact reason.

Proceed only with `draft` and authorized-owner approval naming the exact plan path and current meaning. Route `revision-requested` to the recorded originating planner. Stop `blocked` at its recorded blocker and unblock owner. Approval evidence must prove that approval was recorded after a complete read of the completed plan; this skill cannot approve a plan, and earlier goal text cannot pre-authorize unseen plan meaning.

Completion: the target classification, unchanged complete plan record, separate current-plan approval-evidence record or explicit absence, and admission result or exact route are explicit.

A `route` or `blocked` admission ends this run before `references/execution-and-proof.md` is loaded. Only `admit` enters execution depth.

## Execute the Plan and Prove Each Claim

1. MUST load `references/execution-and-proof.md` to validate the current branch/HEAD, instructions, diff, named paths, dependencies, write scopes, commands, security assumptions, and proof feasibility before edits, and return the pre-edit verdict, smallest ready frontier, proof and integration contract, surprise routes, and completion-report contract.
2. Select the smallest ready frontier. Work inline by default. Use `manage-agents` only when the approved plan identifies genuinely independent disjoint slices or the user explicitly requests delegation; agent availability is not a reason to parallelize.
3. Execute one slice inside its allowed write scope. Use red/green when the plan or repository requires it, and preserve every proof gate.
4. Re-anchor against the current repository and prove the slice before advancing. Integrate only at the plan's named gate and only after its prerequisites are proven.
5. Classify each surprise as `reversible drift | design break | plan defect | out-of-scope infrastructure failure | evidence gap`. Correct reversible drift inside the approved boundary and report it. Route every other class to the owner named by the loaded reference and stop before building on it.
6. For an accepted implementation-owned review correction, return the smallest correction and fresh affected proof, mark the prior review coverage stale, and require later fresh independent review without launching it here.
7. Return the canonical plan record and approval evidence unchanged, plus the completion report owned by `references/execution-and-proof.md`.

Completion: every claimed slice has fresh fitting proof, integration occurred only at named gates, incomplete obligations and blockers are explicit, and the canonical plan and approval evidence remain unchanged.

## Boundaries

- Never rewrite the canonical plan as execution state. Progress, commands, observations, and blockers belong in implementation proof.
- Never weaken, remove, disable, or relabel a proof gate to make execution pass. Split or replan when required proof cannot pass inside approved scope.
- A reversible correction cannot move ownership, change a public contract or data format, write migration state, weaken proof, or become a dependency for another slice before it is reviewed; those are design or plan routes, not drift repair.
- Stop before independent review, tickets, PR work, merge, or release. This skill returns implementation and proof; later skills own later phases.

## Completion Blockers

Do not claim implementation complete while the plan or approval admission is invalid; current source contradicts a load-bearing plan assumption; write scope is broader than approved; a proof gate is missing, stale, weakened, or unable to observe its obligation; an integration prerequisite is unproven; a surprise lacks its exact classification and owner; or any plan obligation remains without a fresh implementation/proof row.
