---
name: orchestrator-implementation-goal
description: Use when starting, resuming, auditing, or completing an implementation delivery goal across planning, implementation, review, and PR readiness. Not for a design-only cycle, one direct phase, one named runtime skill package without explicit skills-creation composition, or unclear intent needing pathfinding.
---

# Implementation Goal Orchestration

An implementation goal stays with the coordinator, who owns design decisions with the user, the work-root, disposition, and the final report. A persistent implementation Sidekick owns planning, implementation, integration, proof, and corrections. An independent persistent review Sidekick examines implementation only after the coordinator has assessed completed development.

## Execution Responsibility

Before delivery starts, use the current goal context or applicable handoff and the next phase's existing input/result contract. MUST load `manage-agents` to assign or resume the persistent implementation Sidekick and return its responsibility, continuity, and assignment boundary. The coordinator keeps the existing work-root as `orchestrator`; the Sidekick joins it as `implementer`. The Sidekick may execute and prove directly or select bounded native Workers and standalone native Operators, each retained through its assignment corrections. For Router delivery, use `agent-collaboration`.

## Orient the Goal

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact accepted `skills-creation` composition for this named run. If the composition is absent, stale, or mismatched, route to `skills-creation` and stop before product delivery.
2. Establish `requested terminal: plan-only | pr-ready-unmerged`; default to `pr-ready-unmerged`. Merge is a separately authorized extension through `implementation-pr-wrapup`, never an inferred terminal.
3. MUST invoke `track-show-me-your-work` and return the shared work reference (or explicitly unshared checkpoint path) plus responsibility for the whole work or a contribution. Reuse supplied work context for nested work. The tracker owns continuity, fallback, conditional views, and deliberate thread resolution.
4. MUST load `references/goal-contract-and-routing.md` and return the current orientation, admitted basis, next owner or exact stop, and finish decision.
5. Read current repository instructions, relevant source and diff, governing artifacts, plan, proof, and review evidence. Use the trail to find evidence, then verify current facts at their source; a historical result is context, not current proof.

## Carry the Delivery Loop

1. If implementation meaning is incomplete, the implementer returns evidence and a recommendation to the coordinator through `orchestrator-design`, keeps the goal open, and resumes after the decision. Routine implementation choices remain with the implementer.
2. Admit either current reviewed design or an evidence-backed repository improvement accepted by `plan-improve-repo`. If no current ready delivery plan exists, the coordinator assigns `plan-implementation` to the existing implementer from settled design. A ready `plan-only` result reaches that requested terminal; a ready delivery plan continues immediately.
3. If implementation or fitting proof is incomplete, the implementer invokes `implement-plan`, executing directly or assigning a bounded native Worker under `manage-agents`. A milestone, completed slice, or phase return is a checkpoint.
4. When development and fitting proof are complete, the coordinator assesses decisive evidence against the agreed intent, scope, and observable behavior. It returns corrections to the same implementer with affected proof and verifies the corrected result before commissioning the persistent independent implementation-review Sidekick through `manage-agents`.
5. The review Sidekick runs `implementation-review` for general-domain work or the `skills-creation` implementation-review stage for a composed runtime skill package. It owns detailed source reading, lane reduction, and its review result. The coordinator checks findings against cited evidence, resolves scope or design disputes, and returns accepted implementation corrections to the implementer.
6. The same review Sidekick checks corrected code and fresh affected proof. It refreshes affected coverage and preserves the existing remediation limit. Contextual design feedback remains separate from independent review.
7. Repeat correction, proof, and review while accepted findings remain and fewer than three implementation-remediation passes have completed. After remediation three, stop `remediation-limit-reached` before review or remediation four unless the user explicitly authorizes continuation.
8. When review is ready, invoke `implementation-pr-wrapup` for the PR gates. Operators own standalone Git, PR, and blocking-watch routines; wait for their notifications or authorized wakes through `manage-agents`, never by model polling. Stop at PR-ready and unmerged by default. Pass through explicit merge authority only after readiness.

Record consequential decisions, accepted or rejected findings, corrections, proof outcomes, recovery use, blockers, and terminal results through `track-show-me-your-work`. Keep logging a companion to delivery: do not create another lifecycle ledger, copied receipt store, counter protocol, or result replay mechanism.

## Bounded Recovery

If current evidence shows that implementation review never occurred, invoke the ordinary first review. If prior implementation-review history should exist but its evidence is unavailable, inspect the current source and proof boundary and record what is missing and why another review is necessary. Admit exactly one recovery review by passing that explicit recovery authorization to `implementation-review` when no prior recovery is known and the normal allowance is not known exhausted. Preserve an unknown remediation count as unknown: never turn it into zero, reset a known count, or repeat recovery.

If the recovery review finds problems and a safe remaining correction budget cannot be established, report the findings and ask the user before correction. Known three-remediation exhaustion, known prior recovery, stale source/proof, unclear meaning, or unavailable required proof remains a stop.

## Boundaries and Finish

- Planning owns strategy and dependencies. The implementer owns bounded implementation and fitting proof. The review Sidekick owns independent review findings and coverage. The coordinator owns source-backed disposition, routing, and the delivery terminal; the user owns material design decisions and phase gates. PR wrap-up owns PR gate inspection.
- Verify producer results proportionally. Current scope, source, outcome, evidence, and applicable stop conditions matter; a missing label alone does not invalidate a clear result. Require exact identity when it changes correctness, including the canonical plan, reviewed diff or PR head, and source-bound proof.
- Shared work updates follow the tracker within task authority. Other external tracking remains separately authorized work and proves no delivery gate.
- On every terminal response, record the actual `complete | partial | blocked | stopped` outcome and continuation context through the tracker. Nested agents checkpoint without resolving the outer thread. Only the responsible whole-work agent checks current history and whole-work completion before resolution; render a view when requested or substantial synthesis is needed.

Completion: every material phase required by the requested terminal is currently verified—planning for `plan-only`; planning, implementation with fitting proof, bounded independent review and accepted corrections, and PR readiness for `pr-ready-unmerged`—or the response names the exact decision or blocker. No phase boundary, missing label, logging failure, implied merge, repeated recovery, or fourth remediation silently changes that result.
