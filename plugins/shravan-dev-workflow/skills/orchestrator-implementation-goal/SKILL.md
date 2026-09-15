---
name: orchestrator-implementation-goal
description: Use when starting, resuming, auditing, or completing an implementation delivery goal across planning, implementation, review, and PR readiness. Not for a design-only cycle, one direct phase, one named runtime skill package without explicit skills-creation composition, or unclear intent needing pathfinding.
---

# Implementation Goal Orchestration

An implementation goal is an owned delivery loop, not a sequence of handoffs. The current orchestrator carries the goal across planning, implementation and proof, independent review, accepted corrections, renewed proof and review, and the requested delivery boundary. Phase owners make their own judgments; the orchestrator verifies what matters and keeps the loop moving. Only a user-selected transfer to a separate Balanced session makes the original Frontier session the selected Advisor rather than the orchestrator.

## Execution Responsibility

Before delivery starts, use the current goal context or applicable handoff and the next phase's existing input/result contract. The current orchestrator may be Frontier or Balanced and selects executors under `manage-agents`; the selected runtime carries each assignment with its dispatch details. For Router delivery, use `agent-collaboration`. Only if the user selects transfer to a separate Balanced session, obtain verified acceptance against current source before it becomes the new orchestrator and the original Frontier session becomes the selected Advisor. This changes task responsibility without transferring a runtime goal, session, or thread between tools; transfer is not implementation completion.

## Orient the Goal

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact accepted `skills-creation` composition for this named run. If the composition is absent, stale, or mismatched, route to `skills-creation` and stop before product delivery.
2. Establish `requested terminal: plan-only | pr-ready-unmerged`; default to `pr-ready-unmerged`. Merge is a separately authorized extension through `implementation-pr-wrapup`, never an inferred terminal.
3. MUST invoke `track-show-me-your-work` and return the shared work reference (or explicitly unshared checkpoint path) plus responsibility for the whole work or a contribution. Reuse supplied work context for nested work. The tracker owns continuity, fallback, conditional views, and deliberate thread resolution.
4. MUST load `references/goal-contract-and-routing.md` and return the current orientation, admitted basis, next owner or exact stop, and finish decision.
5. Read current repository instructions, relevant source and diff, governing artifacts, plan, proof, and review evidence. Use the trail to find evidence, then verify current facts at their source; a historical result is context, not current proof.

## Carry the Delivery Loop

1. The current orchestrator owns this loop. If implementation meaning is incomplete, invoke the smallest design owner through `orchestrator-design`, keep the implementation goal open, verify the result, and resume. Consult a user-selected Advisor for material ambiguity or a design break; the user still owns semantic decisions and phase gates. A material design break stops for the user's decision with the assumed model, source evidence, and consequence.
2. Admit either current reviewed design or an evidence-backed repository improvement accepted by `plan-improve-repo`. If no current ready delivery plan exists, the orchestrator invokes `plan-implementation` from settled design. A ready `plan-only` result reaches that requested terminal; a ready delivery plan continues immediately.
3. If implementation or fitting proof is incomplete, the orchestrator invokes `implement-plan` through the executor independently selected under `manage-agents`. A Balanced orchestrator executes inline only when selected as executor. A milestone, completed slice, or phase return is a checkpoint, not a reason to request per-patch approval.
4. The orchestrator invokes `implementation-review` now for proven general-domain implementation; invoke the skill-package review stage of `skills-creation` for a composed runtime skill package. Independent review remains independent; do not repeat whole-work verification after every patch when current affected proof and the bounded review route suffice.
5. The orchestrator checks each candidate finding against current source, scope, governing meaning, and proof. Reject invalid findings with evidence. Route accepted design or plan defects to their semantic owner; route accepted implementation findings to `implement-plan`, then require fresh affected proof and another bounded independent review.
6. Repeat correction, proof, and review while accepted findings remain and fewer than three implementation-remediation passes have completed. After remediation three, stop `remediation-limit-reached` before review or remediation four unless the user explicitly authorizes continuation.
7. When review is ready, invoke `implementation-pr-wrapup` for the PR gates. Operators own standalone Git, PR, and blocking-watch routines; wait for their notifications or authorized wakes through `manage-agents`, never by model polling. Stop at PR-ready and unmerged by default. Pass through explicit merge authority only after readiness; never manufacture it from delivery intent.

Record consequential decisions, accepted or rejected findings, corrections, proof outcomes, recovery use, blockers, and terminal results through `track-show-me-your-work`. Keep logging a companion to delivery: do not create another lifecycle ledger, copied receipt store, counter protocol, or result replay mechanism.

## Bounded Recovery

If current evidence shows that implementation review never occurred, invoke the ordinary first review. If prior implementation-review history should exist but its evidence is unavailable, inspect the current source and proof boundary and record what is missing and why another review is necessary. Admit exactly one recovery review by passing that explicit recovery authorization to `implementation-review` when no prior recovery is known and the normal allowance is not known exhausted. Preserve an unknown remediation count as unknown: never turn it into zero, reset a known count, or repeat recovery.

If the recovery review finds problems and a safe remaining correction budget cannot be established, report the findings and ask the user before correction. Known three-remediation exhaustion, known prior recovery, stale source/proof, unclear meaning, or unavailable required proof remains a stop.

## Boundaries and Finish

- Planning owns strategy and dependencies. An executor owns bounded implementation and fitting proof. Review owns independent findings. The current orchestrator owns source-backed disposition, routing, and the delivery terminal; the user owns material semantic decisions and phase gates. PR wrap-up owns PR gate inspection.
- Verify producer results proportionally. Current scope, source, outcome, evidence, and applicable stop conditions matter; a missing label alone does not invalidate a clear result. Require exact identity when it changes correctness, including the canonical plan, reviewed diff or PR head, and source-bound proof.
- Shared work updates follow the tracker within task authority. Other external tracking remains separately authorized work and proves no delivery gate.
- On every terminal response, record the actual `complete | partial | blocked | stopped` outcome and continuation context through the tracker. Nested agents checkpoint without resolving the outer thread. Only the responsible whole-work agent checks current history and whole-work completion before resolution; render a view when requested or substantial synthesis is needed.

Completion: every material phase required by the requested terminal is currently verified—planning for `plan-only`; planning, implementation with fitting proof, bounded independent review and accepted corrections, and PR readiness for `pr-ready-unmerged`—or the response names the exact decision or blocker. No phase boundary, missing label, logging failure, implied merge, repeated recovery, or fourth remediation silently changes that result.
