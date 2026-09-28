---
name: implement-plan
description: "Use when executing or continuing one ready canonical implementation plan whose delivery context authorizes implementation, or correcting one implementation-owned review finding. Not for plan or design defects, independent review, or PR work."
---

# Implement Plan

IF no work reference is in context and the task qualifies, open or resume the trace through `practices-show-me-your-work` before phase work.

Implementation executes one immutable ready plan, the plan for one PR node of a ready breakdown, against current authority and repository reality. Delivery intent—not post-plan approval chronology—controls admission. A surprise that changes meaning returns to its owner.

## Execution Responsibility

Use the ready plan, selected slice, and any scoped handoff as the implementation phase context. In an orchestrated project flow, the persistent implementation 🐒 Sidekick is the implementer. Each slice's executor record (`../../shared-references/canonical-implementation-plan.md`) and the staffing table in `manage-agents` (`../manage-agents/SKILL.md`, Commission an implementation 🐒 Sidekick) decide whether the Sidekick executes a slice itself or dispatches it; a dispatched Workhorse slice goes through `manage-agents` for the host's Workhorse route. A Workhorse slice that stops at its boundary, or an executor that disagrees with its record, returns `plan-defect` with the breakdown identity and node id to the originating planner; the implementer does not re-cut it or re-run it on a bigger model. An assigned Worker executes its slice and fitting proof without creating another Sidekick; a direct bounded implementation assignment remains direct. Reuse an existing suitable executor through its corrections. The orchestrator retains design decisions and final disposition.

## Validate Before Editing

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` composition identity.
2. MUST load `../../shared-references/canonical-implementation-plan.md` and return `admit | route | blocked` after validating the complete plan record, governing planning basis, and delivery context, including its ready breakdown, its node, and its recorded PR base.
3. Proceed only when result is `ready`, terminal is `pr-ready-unmerged`, the path resolves, the breakdown is ready and lists the plan's node, the branch sits on the recorded base, opened plan agrees with the record, governing basis remains current, and no design, planning, proof, authority, or environment blocker is open.
4. Route `revision-requested` to its originating planner. Stop `blocked`, `plan-only`, missing plan identity, malformed context, or stale/mismatched basis at the exact recorded owner. Never mutate a prior plan to upgrade its terminal.

Completion: the unchanged ready plan record, governing basis, delivery context, and admission result or exact route are explicit.

## Execute and Prove

1. MUST load `references/execution-and-proof.md` to validate current branch/HEAD, instructions, diff, named paths, dependencies, write scopes, commands, security assumptions, proof feasibility, and completion-report shape.
2. Under the resolved execution owner, select the smallest ready frontier. IF the owner assigns a separate executor or procedure, MUST load `manage-agents` at that assignment point; otherwise continue with the existing assigned executor or direct implementation. Assignment may cover serial work. Parallelism is only eligible for plan-identified independent slices with disjoint writes after proven prerequisites. Route standalone procedures or long watches through `manage-agents` only when they are actually separately assigned, never once per test or proof command.
3. Execute one slice inside its write scope, using red/green when required and preserving every proof gate. When a dependency the slice needs is missing, put a contract-honoring stand-in at a boundary the plan names, record it as a stand-in through `practices-show-me-your-work`, and continue the slice. Claim no proof for the stubbed interaction. Route a replan only when the stand-in would change a public contract, persisted data format, or ownership.
4. Re-anchor and prove the slice before advancing; integrate only at the plan's named gate.
5. Classify surprises as `reversible drift | design break | plan defect | out-of-scope infrastructure failure | evidence gap`. A Workhorse slice that stops at its boundary is a `plan defect`. Correct reversible drift inside scope and route every other class to its owner before building on it.
6. For an accepted implementation-owned review finding, apply the smallest correction and fresh proof. In an orchestrated project flow, return the affected proof through orchestrator disposition to the same 🔎 Review Sidekick assigned to this PR or its stack; independent PRs never share a reviewer. When the review returns `not-converging`, stop correcting and return it to the orchestrator.
7. Return each slice report, including decisions made and open stand-ins, to its assigning implementer. When all of this PR's planned development and fitting proof are complete, return the canonical plan record with its node and base, governing basis, delivery context, and completion report to the orchestrator for that PR's assessment before its first independent review. For a stack layer, that review judges the layer against its parent and this plan.

## Boundaries

- Never alter plan meaning, governing basis, delivery context, required proof, design, tracker state, review verdict, PR state, or merge authority.
- This phase does not mutate PR state; the same implementer may later run separately authorized `implementation-pr-wrapup` after assessment and review prerequisites are satisfied.
- Orchestrator feedback may inform execution, but neither it nor partial direction supplies absent architecture or changes required plan meaning; return those gaps to the orchestrator or originating-plan owner.
- A completed slice is not independent review. General-domain work routes to `implementation-review`; runtime-skill work remains under `skills-creation`.

Completion: every claimed slice has fresh fitting proof, every incomplete obligation/blocker is explicit, the plan record remains unchanged, and no correction continued after `not-converging`.

IF a trace is open, at phase completion record the outcome, evidence, and next owner or return token as a checkpoint through `practices-show-me-your-work`.
