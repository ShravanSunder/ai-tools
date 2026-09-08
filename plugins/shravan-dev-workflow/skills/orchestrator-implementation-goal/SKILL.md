---
name: orchestrator-implementation-goal
description: Use when starting, resuming, auditing, or completing an implementation delivery goal across planning, implementation, review, and PR readiness. Not for a design-only cycle, one direct phase, one named runtime skill package without explicit skills-creation composition, or unclear intent needing pathfinding.
---

# Implementation Goal Orchestration

An implementation goal is an owned delivery loop, not a sequence of handoffs. The orchestrator keeps the goal open across planning, implementation and proof, independent review, accepted corrections, renewed proof and review, and the requested delivery boundary. Phase owners make their own judgments; the orchestrator verifies what matters and keeps the loop moving.

## Orient the Goal

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact accepted `skills-creation` composition for this named run. If the composition is absent, stale, or mismatched, route to `skills-creation` and stop before product delivery.
2. Establish `requested terminal: plan-only | pr-ready-unmerged`; default to `pr-ready-unmerged`. Merge is a separately authorized extension through `implementation-pr-wrapup`, never an inferred terminal.
3. MUST invoke `track-show-me-your-work` and return a usable trail path plus `owned | borrowed`. Reuse a supplied trail for nested work. The outermost workflow owns finish and rendering; nested owners append checkpoints and never finish it.
4. MUST load `references/goal-contract-and-routing.md` and return the current orientation, admitted basis, next owner or exact stop, and finish decision.
5. Read current repository instructions, relevant source and diff, governing artifacts, plan, proof, and review evidence. Use the trail to find evidence, then verify current facts at their source; a historical result is context, not current proof.

## Carry the Delivery Loop

1. If implementation meaning is incomplete, invoke the smallest design owner through `orchestrator-design`, keep this implementation goal open, verify the result, and resume here. A material design break stops for the user's decision with the assumed model, source evidence, and consequence.
2. Admit either current reviewed design or an evidence-backed repository improvement accepted by `plan-improve-repo`. If no current ready delivery plan exists, invoke `plan-implementation`. A ready `plan-only` result reaches that requested terminal; a ready delivery plan continues immediately.
3. If implementation or fitting proof is incomplete, invoke `implement-plan` to execute the current plan and produce the missing proof. A milestone, completed slice, or phase return is a checkpoint, not a reason to hand the goal back.
4. Invoke `implementation-review` now for proven general-domain implementation; invoke the skill-package review stage of `skills-creation` for a composed runtime skill package.
5. Parent-check each candidate finding against current source, scope, governing meaning, and proof. Reject invalid findings with evidence. Route accepted design or plan defects to their semantic owner; route accepted implementation findings to `implement-plan`, then require fresh affected proof and another bounded independent review.
6. Repeat correction, proof, and review while accepted findings remain and fewer than three implementation-remediation passes have completed. After remediation three, stop `remediation-limit-reached` before review or remediation four unless the user explicitly authorizes continuation.
7. When review is ready, invoke `implementation-pr-wrapup` for the PR gates. Stop at PR-ready and unmerged by default. Pass through explicit merge authority only after readiness; never manufacture it from delivery intent.

Record consequential decisions, accepted or rejected findings, corrections, proof outcomes, recovery use, blockers, and terminal results through `track-show-me-your-work`. Keep logging a companion to delivery: do not create another lifecycle ledger, copied receipt store, counter protocol, or result replay mechanism.

## Bounded Recovery

If current evidence shows that implementation review never occurred, invoke the ordinary first review. If prior implementation-review history should exist but its evidence is unavailable, inspect the current source and proof boundary and record what is missing and why another review is necessary. Admit exactly one recovery review by passing that explicit recovery authorization to `implementation-review` when no prior recovery is known and the normal allowance is not known exhausted. Preserve an unknown remediation count as unknown: never turn it into zero, reset a known count, or repeat recovery.

If the recovery review finds problems and a safe remaining correction budget cannot be established, report the findings and ask the user before correction. Known three-remediation exhaustion, known prior recovery, stale source/proof, unclear meaning, or unavailable required proof remains a stop.

## Boundaries and Finish

- Planning owns strategy and dependencies. Implementation owns code and fitting proof. Review owns independent findings. The parent owns source-backed disposition and routing. PR wrap-up owns PR gate inspection.
- Verify producer results proportionally. Current scope, source, outcome, evidence, and applicable stop conditions matter; a missing label alone does not invalidate a clear result. Require exact identity when it changes correctness, including the canonical plan, reviewed diff or PR head, and source-bound proof.
- Optional external tracking is separately authorized work and proves no delivery gate.
- On every terminal or end response, the outermost owner finishes and renders its trail with `complete | partial | blocked | stopped`; a nested owner leaves the borrowed trail open.

Completion: every material phase required by the requested terminal is currently verified—planning for `plan-only`; planning, implementation with fitting proof, bounded independent review and accepted corrections, and PR readiness for `pr-ready-unmerged`—or the response names the exact decision or blocker. No phase boundary, missing label, logging failure, implied merge, repeated recovery, or fourth remediation silently changes that result.
