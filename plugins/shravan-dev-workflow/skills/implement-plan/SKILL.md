---
name: implement-plan
description: Use when executing or continuing one current ready canonical implementation plan whose delivery context authorizes implementation, or correcting one implementation-owned finding within the bounded implementation-review remediation route. Not for plan/design defects, independent review, tracker publication, or PR lifecycle work.
---

# Implement Plan

Implementation executes one immutable ready plan against current authority and repository reality. Delivery intent—not post-plan approval chronology—controls admission. A surprise that changes meaning returns to its owner.

## Execution Responsibility

Use the ready plan, selected slice, and any scoped handoff as the implementation phase context. Reuse the existing responsible executor when one is assigned; otherwise the current orchestrator selects one through `manage-agents`. A Balanced orchestrator executes inline only when selected as executor. Execution does not require another coder per slice or correction.

## Validate Before Editing

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` composition identity.
2. MUST load `../../shared-references/canonical-implementation-plan.md` and return `admit | route | blocked` after validating the complete plan record, governing planning basis, and delivery context.
3. Proceed only when result is `ready`, terminal is `pr-ready-unmerged`, the path resolves, opened plan agrees with the record, governing basis remains current, and no design, planning, proof, authority, or environment blocker is open.
4. Route `revision-requested` to its originating planner. Stop `blocked`, `plan-only`, missing plan identity, malformed context, or stale/mismatched basis at the exact recorded owner. Never mutate a prior plan to upgrade its terminal.

Completion: the unchanged ready plan record, governing basis, delivery context, and admission result or exact route are explicit.

## Execute and Prove

1. MUST load `references/execution-and-proof.md` to validate current branch/HEAD, instructions, diff, named paths, dependencies, write scopes, commands, security assumptions, proof feasibility, and completion-report shape.
2. Under the resolved execution owner, select the smallest ready frontier. Assignment may cover serial work; parallelism is only eligible for plan-identified independent slices with disjoint writes after proven prerequisites. Route standalone procedures or long watches through `manage-agents` only when they are actually separately assigned, never once per test or proof command.
3. Execute one slice inside its write scope, using red/green when required and preserving every proof gate.
4. Re-anchor and prove the slice before advancing; integrate only at the plan's named gate.
5. Classify surprises as `reversible drift | design break | plan defect | out-of-scope infrastructure failure | evidence gap`. Correct reversible drift inside scope and route every other class to its owner before building on it.
6. For an accepted implementation-owned review finding, apply the smallest correction and fresh proof only when the bounded delivery effort—an orchestrated goal, direct review loop, or `skills-creation` route—has fewer than three completed remediation passes. After remediation three, return `remediation-limit-reached` and do not launch or authorize review/remediation four without explicit user permission.
7. Return the canonical plan record, governing basis, and delivery context unchanged with the completion report.

## Boundaries

- Never alter plan meaning, governing basis, delivery context, required proof, design, tracker state, review verdict, PR state, or merge authority.
- A user-selected Advisor may provide execution context, but neither that context nor partial direction supplies absent architecture or changes required plan meaning; return those gaps to the existing semantic or originating-plan owner.
- A completed slice is not independent review. General-domain work routes to `implementation-review`; runtime-skill work remains under `skills-creation`.
- Missing current review/remediation receipts do not reset the three-remediation limit; they stop further remediation for explicit user permission.

Completion: every claimed slice has fresh fitting proof, every incomplete obligation/blocker is explicit, the plan record remains unchanged, and no fourth remediation occurred.
