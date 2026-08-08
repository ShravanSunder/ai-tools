---
name: orchestrator-goal
description: Use when starting, resuming, auditing, or completing a general-domain long-horizon delivery goal that may span design, implementation planning, optional operations tracking, plan execution, independent implementation review, and PR readiness. Not for one named runtime skill package or an accepted multi-run skill-change slice without explicit skills-creation composition, a request for only one phase, the bounded design cycle alone, or unclear intent that still needs pathfinding or mental-model repair.
---

# Orchestrator Goal

A long-horizon goal is a guarded route through phase-owned evidence, not a second workflow implementation. Reconstruct the first unproven gate, invoke its one owner, verify the returned receipt, and continue only along a route that owner permits.

## Find and Run the Next Owner

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` commission identity authorizing this target and composed skill; otherwise route there and stop. MUST load `references/goal-contract-and-routing.md` and return the goal contract plus the first verified gate or exact blocker. Every completed plan still requires owner approval recorded after reading that plan before implementation.
2. Inspect current artifacts and evidence to identify the first unproven gate; a goal label, chat assertion, commit, ticket, or status is not proof. IF a canonical plan exists or a planning result is being evaluated, load `../../shared-references/canonical-implementation-plan.md` and return the exact plan gate and route.
3. Invoke exactly one owning skill in the current turn using the packet defined in the routing reference. Return that owner's result unchanged with the thin source binding defined there. Opening the owner source, describing what it would do, or putting `invoke <owner>` in `next_action` is still deferral. If the current runtime cannot invoke the selected owner, return that exact runtime blocker.
4. Open the selected producer's current return contract, verify its result against the passed source binding and required fields, then classify the transition without re-performing the phase's judgment.
5. Continue through the allowed route or stop for owner approval, decision, blocker, or requested terminal.
6. For accepted implementation findings, route to the named semantic owner and require fresh affected review coverage before advancing.
7. Complete only when every material gate implied by the terminal is done or explicitly not applicable. The default terminal is PR-ready and unmerged; merge always requires separate authorization.

## Route Map

- Unclear never-articulated intent -> `discuss-pathfinding`; drifted shared model -> `discuss-clarify-mental-models`.
- An explicit complete bounded design-cycle request, or a fresh long-horizon delivery goal with neither admitted design artifacts nor a valid stored design-run continuation -> `orchestrator-design`.
- Without a complete-cycle request, partial design artifacts route to the first missing phase: Requirements or observable Why/What -> `spec-design`; structural How -> `program-design`; complete unreviewed three-artifact set -> `spec-program-review` operation `review`, mode `three-artifact-design`.
- A direct one-phase request bypasses this skill's long-horizon route and invokes the requested owning skill in the current turn, returning its phase receipt or exact runtime blocker. Applying this routing contract still counts as invoking `orchestrator-goal`; only the long-horizon continuation is bypassed. A phase-owned correction goes directly to the owner returned by review rather than restarting the full cycle.
- An audit or plan directly authorized by admitted repository-improvement findings -> `plan-improve-repo`; supporting reviewed design does not change that origin.
- Current ready reviewed design without a plan -> `plan-implementation`.
- Plan result `revision-requested` -> recorded originating planner; `blocked` -> recorded unblock owner; only `draft` can advance.
- `draft` without matching later explicit owner approval -> caller stop. Approved `draft` without implementation proof -> `implement-plan`.
- Implementation proof without current review -> `review-implementation`.
- Review findings -> the exact semantic owner selected by `review-implementation`.
- Ready implementation without current PR readiness -> `implementation-pr-wrapup`.
- User-selected tracking projection -> the named available `ops-*` skill; tickets never replace the canonical plan, and tracker identifiers prove none of planning, approval, implementation, review, or PR readiness.

## Boundaries

- This skill selects routes, verifies phase-result identities and freshness, and evaluates the terminal. It never authors Requirements, Specification, Program Design, plans, code, findings, proof, tickets, or PR judgments on behalf of their owners.
- Host goal state may carry the objective and terminal, but current source artifacts and evidence prove gates. Never add `details.md`, `events.jsonl`, transition-writer precedence, a controller brief, worker protocol, or another lifecycle ledger.
- A missing, conflicting, status-only, or stale phase return stops at that phase's owner. Never fill a missing result by inspecting phase internals and deciding the phase again.

## Completion Blockers

Do not claim the goal terminal while a required phase receipt is absent, stale, conflicting, or blocked; a completed plan lacks matching later current-plan approval; implementation proof lacks current independent review; accepted corrections lack fresh affected review coverage; PR checks, comments, reviews, mergeability, or exact head state required by the terminal are unknown; or merge is implied without separate authority.
