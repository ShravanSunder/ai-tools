---
name: orchestrator-goal
description: Use when starting, resuming, auditing, or completing a general-domain long-horizon delivery goal through design, planning, optional tracking, implementation, bounded independent implementation review, and PR readiness. Not for one named runtime skill package without explicit skills-creation composition, one direct phase, or unclear intent needing pathfinding.
---

# Orchestrator Goal

A goal invocation establishes delivery intent. The orchestrator reconstructs the first unproven phase from current authority, invokes one owner at a time, verifies each returned result, and keeps reconstructing and routing until the requested terminal or a real stop is reached. It does not invent phase judgment or ask for generic plan approval.

## Route the Goal

1. Classify `general-domain | runtime-skill-package`. Runtime skill delivery requires the exact `skills-creation` commission identity.
2. Establish `requested terminal: plan-only | pr-ready-unmerged`; default to `pr-ready-unmerged` unless the user named a narrower terminal.
3. MUST load `references/goal-contract-and-routing.md` and return the goal contract plus the first verified gate or exact blocker.
4. Inspect current durable artifacts, the current canonical plan when present, phase returns, proof, and review receipts. Optional scratch lives only under host OS temp and never proves a phase.
5. Invoke exactly one current phase owner at a time, preserve its result unchanged with the thin source binding from the routing reference, verify its required fields, then reconstruct the next gate and continue immediately. A phase boundary or successful owner result is not a user-approval checkpoint.
6. A `ready` plan with terminal `pr-ready-unmerged`, current governing basis, complete delivery context, and no real blocker routes directly to `implement-plan`. Do not request approval of planner-owned detail.
7. Invoke a selected named `ops-*` tracking skill only as a separate authorized side route. No tracking continues immediately; tickets prove no delivery gate.
8. After implementation proof, route general-domain work to `review-implementation` and runtime-skill work to the implementation-review stage of `skills-creation`.
9. Preserve the ordered implementation review/remediation receipts in current goal context. End early when review is ready. Apply at most three accepted remediation passes; after remediation three, stop `remediation-limit-reached` before review or remediation four unless the user explicitly authorizes continuation.
10. Route ready implementation to `implementation-pr-wrapup`. Default terminal is PR-ready and unmerged; merge remains separate authority.

## Route Map

- Unclear intent -> `discuss-pathfinding`; drifted shared model -> `discuss-clarify-mental-models`.
- Fresh complete design-cycle need -> `orchestrator-design`; partial design -> its first missing owner; complete unreviewed design -> one `spec-program-review` three-artifact review.
- Reviewed design or an orchestrated admitted improvement without a delivery plan -> `plan-implementation`.
- Planning `revision-requested | blocked` -> exact recorded owner. Ready `plan-only` -> terminal. Ready delivery -> `implement-plan`.
- Implementation finding -> exact semantic owner. Implementation-owned finding -> remediation only while fewer than three remediation passes exist.
- Implementation proof without current bounded review -> `review-implementation | skills-creation` by target classification.
- Ready review -> `implementation-pr-wrapup`.

## Boundaries

- Route and verify; never author Requirements, Specification, Program Design, plans, code, findings, proof, tickets, review verdicts, or PR judgments for their owners.
- Never persist `details.md`, `events.jsonl`, counters, approval chronology, remediation ledgers, digests, or replay state. The current ordered receipts are call context, not a new store.
- Missing scratch, review receipts, or remediation evidence cannot reset a limit. Stop for explicit user permission when the bounded sequence cannot be proven.
- Stop for missing meaning, invalid/stale authority or plan, design break, failed required proof, out-of-scope infrastructure, unauthorized external/destructive action, remediation limit, or merge.

Completion: every gate through the requested terminal is proven or explicitly inapplicable; no redundant approval, fourth remediation, or implied merge occurred.
