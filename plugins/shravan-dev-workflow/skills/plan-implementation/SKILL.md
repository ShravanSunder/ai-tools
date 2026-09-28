---
name: plan-implementation
description: "Use when writing or revising a repository-grounded implementation plan from reviewed Requirements, Specification, and Program Design, an admitted improvement finding, or a direct planning request. Not for audit-only discovery (plan-improve-repo)."
---

# Plan Implementation

IF no work reference is in context and the task qualifies, open or resume the trace through `practices-show-me-your-work` before phase work.

An implementation plan is a proof route through current authority and repository reality. The user-facing main loads this skill and authors one breakdown per delivery, which cuts the work into PR nodes, and one plan per PR node, including strategy, slices, dependencies, proof mapping, and integration gates; helpers may return bounded repository or proof evidence but never plan prose or structure. A ready delivery plan is executable input, not a request for generic post-plan approval.

## Admit Planning

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` parent identity authorizing this composition.
2. Admit either:
   - current distinct Requirements, Specification, and Program Design with a current, complete design review and parent-verified correction evidence under `spec-program-review`'s convergence rule; or
   - for an orchestrated improvement goal or owner-requested delivery of a direct improvement result, the unchanged `plan-improve-repo` return containing an admitted finding pointer, `current-three-artifact-design-ready | implementation-mechanics-only` classification, required evidence pointers, and current applicability anchors.

   A call for later executable nodes also carries the ready breakdown identity and the node id to plan. Admit it only when that breakdown is ready and its admitted basis is still current.
3. Reject missing, combined, conflicting, stale, `design-required`, or malformed authority with `revision-requested | blocked`, exact evidence, and semantic owner. Do not upgrade an improvement basis.
4. Establish `requested terminal: plan-only | pr-ready-unmerged` before substantive planning. Use explicit user or orchestrator intent. If a direct request is ambiguous, ask once at entry.
5. At the same entry boundary, preserve an existing tracking selection or offer once between no tracking and one available named `ops-*` owner. Return a named selection separately for the caller to invoke; no tracking continues immediately.

Completion: the target, governing basis, requested terminal, tracking disposition, and permission to plan or exact non-ready result are explicit.

## Plan the Change

1. Read the governing authority completely and re-anchor against current branch/HEAD, instructions, owners, interfaces, tests, commands, and proof seams.
   IF one bounded repository or proof question benefits from helper work, use `manage-agents` for an evidence-only assignment and verify its anchors before continuing. The main still authors every plan row and delivery boundary.
2. MUST load `references/slice-and-proof-design.md` and return the PR cut (nodes with their planned independence, stacks, contract nodes, integration gates, and order) and, for each plan, its vertical slice graph with each slice's tier record, the throughput checkpoint, obligation/proof map, independent oracle, project proof-layer source or "project silent", property-versus-example choice when one rule covers the cases, existing-test keep/repair/remove disposition, necessary dependency edges, integration gates, false-green risks, and stop conditions. A remove row without replacement, redundancy, or dead-contract proof is not a ready plan.
3. Write the breakdown first, whole.
4. IF the breakdown is new, load the host's presentation skill (`presentation-tui` on a monospace host, `presentation-webui` on a rendered one) and return the drawn PR map for the owner: nodes, edges, stacks, contract PRs, and integration gates. The owner sees the map, not per-PR plans or slices, and seeing it is not an approval stop.
5. Plan each executable node: the first executable nodes with a new breakdown, or the one node a later call names. Check the node's external prerequisites against its actual base under the PR Independence Test; a node with an unmet external prerequisite stays pending, or its gap returns as `plan-defect` or `program-design-gap`. Inside each node, choose the smallest coherent vertical grouping of slices.
6. Ensure every slice names its external dependencies and the boundary where a stand-in is allowed if one is missing; every contract-only or prefactoring slice names its downstream vertical consumer; every Workhorse slice passes Workhorse fit (`../manage-agents/references/model-catalog.md`), and every Daily-driver slice names its reason for leaving Luna; every obligation has fitting proof; and no step invents Why, What, structural How, or external authority.
7. MUST load `../../shared-references/canonical-implementation-plan.md` and apply its complete breakdown, governing-basis, result, delivery-context, home, and validation contract to the breakdown and every plan.
8. For every `pr-ready-unmerged` delivery, first resolve the project root, then inspect that project's ignore coverage for `tmp/*`, add that line to the project-root `.gitignore` only when equivalent coverage is absent, and finally write the breakdown at `<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>-breakdown.md` and one `<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>-<node-id>.md` plan per executable node, and return their exact paths. This includes orchestrated goals and direct continued-delivery planning.
9. Before returning `ready`, review each newly written plan. IF a plan is a full plan, load `references/plan-review.md` and return every review point's take or decline with its reason. A compact plan records its skip reason instead.
10. Return exactly `ready | revision-requested | blocked`. `ready` includes the breakdown record, the complete canonical record of each plan written, and any separate tracking side-route selection; non-ready results create no new plan or preserve an existing ready record unchanged.

## Route the Result

- A direct caller stops with a `plan-only` ready plan.
- For each `pr-ready-unmerged` ready plan, return `ready-for-implementation` (`../../shared-references/phase-return-tokens.md`) without another generic approval question. The caller maps the token and only then commissions or resumes implementation.
- A later executable node's caller returns here with `ready-for-planning`.
- A `plan-defect` returns here through the plan's recorded `originating planner`. Main corrects that node's plan, or writes a new breakdown for a topology change.
- An implementation 🐒 Sidekick that encounters a missing governing plan returns the evidence and exact gap to the current main. It may choose local mechanics inside a ready plan but does not author or repair the plan.
- `revision-requested` returns to the named semantic or planning owner; `blocked` returns to the named unblock owner.
- Planning never edits product code, invokes tracking providers, reviews implementation, manages PR state, or infers merge authority.

Completion: one ready breakdown exists for the delivery, and a main-authored ready immutable plan exists at its required path for every executable node this call planned, each bound to its node and base with complete current meaning; every Workhorse slice passes Workhorse fit; and each newly written plan's review has a disposition for every point or a recorded compact skip reason. Otherwise one exact non-ready result exists. No approval record, document digest, lifecycle state, PR topology inside a plan, helper-authored section, or second plan authority exists.

IF a trace is open, at phase completion record the outcome, evidence, and next owner or return token as a checkpoint through `practices-show-me-your-work`.
