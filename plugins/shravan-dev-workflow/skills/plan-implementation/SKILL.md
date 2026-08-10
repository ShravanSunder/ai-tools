---
name: plan-implementation
description: Use when writing or revising a repository-grounded implementation plan from current reviewed Requirements, Specification, and Program Design, an admitted repository-improvement handoff from an orchestrated goal or owner-requested direct delivery, or a direct planning request that must establish plan-only versus continued-delivery intent. Not for audit-only discovery, an existing plan handoff, tracker publication, implementation, or PR work.
---

# Plan Implementation

An implementation plan is a proof route through current authority and repository reality. Planning owns technical strategy; the caller owns materially different delivery grouping and PR choices. A ready delivery plan is executable input, not a request for generic post-plan approval.

## Admit Planning

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` parent identity authorizing this composition.
2. Admit either:
   - current distinct Requirements, Specification, and Program Design with one completed design review plus any one parent-verified remediation permitted by `spec-program-review`; or
   - for an orchestrated improvement goal or owner-requested delivery of a direct improvement result, the unchanged `plan-improve-repo` return containing an admitted finding pointer, `current-three-artifact-design-ready | implementation-mechanics-only` classification, required evidence pointers, and current applicability anchors.
3. Reject missing, combined, conflicting, stale, `design-required`, or malformed authority with `revision-requested | blocked`, exact evidence, and semantic owner. Do not upgrade an improvement basis.
4. Establish `requested terminal: plan-only | pr-ready-unmerged` before substantive planning. Use explicit user or orchestrator intent. If a direct request is ambiguous, ask once at entry.
5. At the same entry boundary, preserve an existing tracking selection or offer once between no tracking and one available named `ops-*` owner. Return a named selection separately for the caller to invoke; no tracking continues immediately.

Completion: the target, governing basis, requested terminal, tracking disposition, and permission to plan or exact non-ready result are explicit.

## Plan the Change

1. Read the governing authority completely and re-anchor against current branch/HEAD, instructions, owners, interfaces, tests, commands, and proof seams.
2. MUST load `references/slice-and-proof-design.md` and return its vertical slice graph, obligation/proof map, necessary dependency edges, integration gates, false-green risks, and stop conditions.
3. Choose the smallest coherent vertical grouping. If only one exists, use it without alternatives. If materially different groupings or PR topologies exist, present concrete choices with recommendation/tradeoffs and obtain the owner selection before finalizing.
4. Ensure every contract-only or prefactoring slice names its downstream vertical consumer; every obligation has fitting proof; and no step invents Why, What, structural How, or external authority.
5. MUST load `../../shared-references/canonical-implementation-plan.md` and apply its complete governing-basis, result, delivery-context, home, and validation contract.
6. For every `pr-ready-unmerged` plan, first resolve the project root, then inspect that project's ignore coverage for `tmp/*`, add that line to the project-root `.gitignore` only when equivalent coverage is absent, and finally write exactly one `<project-root>/tmp/plan-workflows/<yyyy-mm-dd>-<slug>.md` plan and return its exact path. This includes orchestrated goals and direct continued-delivery planning.
7. Return exactly `ready | revision-requested | blocked`. `ready` includes the complete canonical record and any separate tracking side-route selection; non-ready results create no new plan or preserve an existing ready record unchanged.

## Route the Result

- A direct caller stops with a `plan-only` ready plan.
- A direct caller or `orchestrator-goal` validates a `pr-ready-unmerged` ready record and invokes `implement-plan` without another generic approval question.
- `revision-requested` returns to the named semantic or planning owner; `blocked` returns to the named unblock owner.
- Planning never edits product code, invokes tracking providers, reviews implementation, manages PR state, or infers merge authority.

Completion: one ready immutable plan exists at the required path with complete current meaning, or one exact non-ready result exists. No approval record, document digest, lifecycle state, placeholder delivery choice, or second plan authority exists.
