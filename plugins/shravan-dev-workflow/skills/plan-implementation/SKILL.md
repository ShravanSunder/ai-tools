---
name: plan-implementation
description: Use when creating or revising a repo-grounded implementation plan after the request or current workflow identifies a Requirements, Specification, and Program Design set as its intended direct authority, including when an artifact, review readiness, or semantic freshness is missing, conflicting, or stale and must be routed before planning continues. Not for plans whose direct authority is an admitted repository-improvement finding, including source-proven implementation-mechanics-only work; changes to one named runtime skill package or an accepted multi-run skill-change slice without explicit skills-creation composition; an existing plan handoff; tracker publication; implementation; or PR work.
---

# Plan Implementation

An implementation plan is a proof route through the current repository. It translates reviewed design obligations into the smallest dependency-aware sequence that can change and prove the system. It does not redesign the product, authorize its own execution, or track execution progress.

## Admission

1. Classify the target as `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` parent identity authorizing composition; otherwise return that route and stop.
2. Admit only the exact current design set under the landed `spec-program-review` operation contract: mode `three-artifact-design`, distinct current Requirements, Specification, and Program Design identities, separately preserved exact review invocation identity and exact review result identity, result `ready`, and semantically current coverage for every consumed target. `spec-program-review` remains the sole owner of those labels and semantics.

A missing, combined, conflicting, stale, non-ready, or design-gap input returns `route | blocked` with the governing-input identities, reason and evidence, and semantic or unblock owner. If no completed plan exists, include `plan identity: none` and stop without creating an artifact. IF a completed plan exists, load `../../shared-references/canonical-implementation-plan.md` to validate and return its unchanged tuple plus its separate approval-evidence record or explicit absence beside the blocking receipt; do not mutate the plan.

Completion: the target classification, exact design/review identities, semantic freshness, and either admission or the complete blocking receipt are explicit.

## Plan The Change

1. Read the Requirements, Specification, and Program Design completely. Preserve their distinct authority: Requirements owns Why and boundaries, Specification owns observable What and proof obligations, and Program Design owns structural How and proof seams.
2. Re-anchor against the current branch, HEAD, repository instructions, owner modules, interfaces, tests, commands, and proof seams. Record the inspected snapshot.
3. Trace scope, non-goals, constraints, artifact pointers, success evidence, and stop conditions to their governing source. A conflict, stale meaning, or missing decision returns to its semantic owner; planning cannot fill it.
4. MUST load `references/slice-and-proof-design.md` to decompose the admitted obligations and return the slice graph, obligation/proof mapping, dependency and collision edges, integration gates, false-green risks, and any split or replan stop.
5. Keep only edges that change execution: `requires`, `serial`, or advisory `parallel`. Put an integration gate at the first slice where independently changed parts meet.
6. Check every obligation has a slice and fitting proof; every write path and command is real or explicitly new; scope fits its proof; contract-only and prefactoring slices name their downstream consumer; and no step invents design.
7. MUST load `../../shared-references/canonical-implementation-plan.md` to choose the proportional Markdown form and repository home. In a write-enabled run, write the completed plan with originating planner `plan-implementation`, validate the canonical tuple and result-specific payload, and return the tuple plus explicit approval absence. In a fast read-only characterization, return the intended repository home, candidate result and payload, explicit approval absence, and `completed plan: not created in this read-only run`; never fabricate an immutable path or use `plan identity: none` after successful admission. Then stop.

Completion: a write-enabled run leaves one immutable path-addressed canonical Markdown plan with `draft | revision-requested | blocked`. A fast read-only characterization instead leaves no plan artifact and returns its intended home, candidate result/payload, separate approval absence, and explicit non-extant status. In either case every obligation maps to a slice and proof gate, necessary edges and integration gates are explicit, and no document digest is computed.

## Boundaries

- Planning stops after the plan and canonical tuple return. Do not create tickets, edit product code, dispatch implementation, review implementation, prepare a handoff, mutate Git, or start PR work.
- A successful plan result is `draft`, not approval. Only separate later owner approval naming the exact plan path and current meaning can authorize execution.
- Approval evidence and execution progress never live in the canonical plan.
- Optional `ops-*` tracking may later project only the exact plan identity and canonical `draft | revision-requested | blocked` planning result; it never adds lifecycle state or becomes plan authority.
- Plan inline without planning lanes. If required source evidence cannot be grounded in the current run, return the exact research gap and stop instead of dispatching ad hoc helpers.

## Completion Blockers

Do not claim planning complete while admission is absent or stale; an obligation lacks a proof-bearing slice; a path or command was guessed; an edge hides a collision; a contract-only slice has no consumer; a proof gate cannot observe its obligation; the plan invents Why, What, or How; or the exact tuple and approval absence were not returned.
