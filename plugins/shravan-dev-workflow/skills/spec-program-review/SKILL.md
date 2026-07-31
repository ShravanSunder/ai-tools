---
name: spec-program-review
description: Use when independently reviewing a specification, program design, or their pair for authority, requirements, reader understanding or readability, architecture, failure, traceability, scope fidelity, crux, or planning-readiness gaps, or when classifying whether specification-only or program-only review is required. Review only; not for editing, remediation, acceptance, plan or implementation review, creating/updating/evaluating one named runtime skill package, or a standalone security scan, audit, or threat model.
---

# Specification and Program Design Review

Review is independent reconstruction of the smallest system that satisfies the confirmed goal. It is not proofreading, design by committee, or a search for mechanisms to complete.

The reviewer rebuilds and challenges:

```text
confirmed goal and accepted requirements
  -> authoritative Why/What and observable contracts
  -> existing foundation and structural How
  -> current/proposed calls, state, failure, and proof
  -> reader understanding and planning readiness
```

Fresh context, read-only access, and candidate-only authority create independence. The parent verifies findings, tests deletion before addition, and owns the coverage-bound result. This skill never edits artifacts, mutates their lifecycle, plans, or accepts a design.

## Operations

```text
classify-review-requirement
  requested future mode: specification-only | program-only
  returns: review-required | non-substantial, or blocked input
  dispatches: no reviewer

review
  mode: specification-only | program-only | pair
  returns: ready | needs-revision | blocked | decision-needed
  dispatches: exactly one mode-complete reviewer first, then at most one focused reviewer by default
```

## 1. Guard the Skill-Authoring Boundary

Record `target classification: general-domain | runtime-skill-package`.

IF the target is one named runtime skill package, require the explicit `skills-creation` parent packet/result identity authorizing this review composition. Without it, return the `skills-creation` route and stop before classification or reviewer dispatch.

Completion: target classification and, when applicable, the `skills-creation` parent identity are recorded.

## 2. Classify Review Requirement

IF operation is `classify-review-requirement`, load `references/classifying-review-requirement.md` and return its `review-required | non-substantial` result or blocked missing-input result.

Dispatch no reviewer, select no lanes, and return no review verdict. `review-required` instructs the caller to make a separate fresh review invocation.

Completion: classification returns immediately with zero reviewer dispatches.

## 3. Prepare the Review

For operation `review`, require:

```text
target classification and skills-creation parent identity when applicable
mode and complete target artifact paths
governing sources, authority states, and coverage basis
boundary check 1 and accepted requirements set, or the exact authority gap
boundary check 2 for program-only or pair, or the exact owner decision still needed
constraints and non-goals
risk predicates
claimed proof evidence or gaps
review question when narrower than readiness
```

Use the owner-confirmed requirements record and boundary-check-1 result when available. Otherwise use the last inspectable owner-accepted governing baseline. If neither exists, or they conflict, return the authority gap. Mutually narrowed current files never establish the accepted requirements set by themselves.

`program-only` also requires the governing specification. `pair` requires the current specification and program design. Missing boundary confirmation may produce `decision-needed`; review does not infer acceptance from silence or a status label.

Completion: the complete target set, governing sources, accepted requirements, boundaries, and open authority decisions are unambiguous.

## 4. Select the Mode

The selected mode reference owns its review judgment:

```text
specification-only -> references/reviewing-specification.md
program-only       -> references/reviewing-program-design.md
pair               -> references/reviewing-pair.md
```

Specification review judges authoritative Why/What. Program review judges structural How and realization of the governing specification. Pair review independently repeats both and judges traceability, integration, and planning readiness.

Completion: exactly one mode and its complete required artifact set are selected.

## 5. Resolve Reviewer Runtime and Authority

MUST use `manage-agents` before each reviewer dispatch and return the one-shot `Delegate` pattern, model and reasoning, reviewer history `none`, read-only workspace access, runtime, permissions, packet, and receipt mechanics.

Every reviewer gets the complete targets and governing sources but no parent conversation history, author conclusion, expected verdict, prior praise, or hidden context. Reviewer findings remain candidate-only. Silence is `no-receipt`, never a clean review.

Completion: fresh-context, read-only, candidate-only dispatch mechanics are recorded before the reviewer runs.

## 6. Dispatch the Mode-Complete Reviewer

Every dispatch uses the complete packet contract in `references/lanes/lane-schema.md`.

MUST dispatch `mode-complete-reviewer` to a fresh subagent using that packet with predicate `mandatory for every review invocation`. The subagent loads `references/lanes/lane-schema.md` and `references/lanes/mode-complete-reviewer.md`; that lane MUST load `references/reviewing-common-method.md` and the selected mode reference before inspection.

Parallel-safe after the complete target and governing-source set exists; actual scheduling is serial. Instance authority is fresh-context, read-only, candidate-only, and equal to or narrower than the lane maximum. Return a `complete | partial | blocked` receipt, or parent-recorded `no-receipt` after explicit follow-up. The parent verifies and reduces it before selecting any focused lane.

Completion: one current mode-complete terminal state exists and its findings have been parent-reduced. `partial`, `blocked`, and `no-receipt` cannot yield `ready`.

## 7. Select At Most One Focused Lane

A broad topic does not select a reviewer. Select a focused lane only when the parent can name a concrete unresolved risk, show why the mode-complete review did not settle it, and explain how the lane can resolve it.

```text
material reader-comprehension risk, or explicit deep-reader request
  -> references/lanes/reader-understanding.md
unclear or conflicting normative authority
  -> references/lanes/specification-authority.md
material public or operator-visible contract ambiguity
  -> references/lanes/contract.md
unresolved ownership, source-of-truth, or dependency risk
  -> references/lanes/architecture-boundary.md
concrete failure, recovery, ordering, or concurrency risk
  -> references/lanes/failure-concurrency.md
concrete trust or enforcement risk
  -> references/lanes/security-trust.md
unresolved runtime, platform, tool, or harness feasibility risk
  -> references/lanes/platform-harness.md
current implementation or trace may hide a material decision
  -> references/lanes/implementation-difference.md
material proof modality or seam remains disputed
  -> references/lanes/proof.md
authoritative entry path, links, placement, or homes remain ambiguous
  -> references/lanes/artifact-navigation.md
```

IF one focused risk qualifies, dispatch the single best-matched lane using the shared packet contract. The subagent loads `references/lanes/lane-schema.md`, `references/reviewing-common-method.md`, and the selected lane. It runs only after parent reduction of the mode-complete receipt. Instance authority remains fresh-context, read-only, candidate-only, and excludes mode recommendation, verdict, editing, remediation, planning, and acceptance. Return `complete | partial | blocked` or parent-recorded `no-receipt`; the parent verifies and reduces it.

After the first focused receipt, return the coverage-bound result with remaining gaps. Dispatch another focused lane only when the user or caller explicitly authorizes the named residual risk after seeing current coverage and review cost; carry that authority in the existing packet constraints and bounded-review-question fields.

Stop focused review when the risk is resolved, unsupported, outside the confirmed boundary, or needs an owner decision.

Completion: the selected risk, non-selected residual risks, terminal receipt, and any explicit authority for an additional lane are recorded.

## 8. Verify Reviewer Independence

Confirm each receipt matches its assignment, reviewer history was empty, access remained read-only, authority stayed candidate-only, and reviewed targets were not edited after inspection. If a reviewed target changed, rerun only the affected coverage before using it.

Completion: each used receipt covers the current target text and reviewer execution did not widen authority or mutate the worktree.

## 9. Verify and Reduce Findings

MUST load `references/finding-and-reduction-schema.md` and return its dispositions, merged duplicates/conflicts, coverage gaps, goal-relevance record, deletion-first decision, scope effect, and final coverage-bound result.

Before accepting a finding, identify the confirmed requirement or boundary it serves, the concrete failure if unresolved, the smallest correction, whether deleting the questioned mechanism removes the failure, and whether the correction stays inside the confirmed boundary. A missing contract on an unnecessary mechanism is a deletion candidate, not an invitation to finish the mechanism.

Classify each requested correction as `requirements/Why/What`, `structural How`, or `both`. A How-only correction preserves the accepted requirements set unless the owner explicitly changes it.

Reject prose taste without reader or design effect. Missing evidence is `unverified`. Preserve real disagreement as contested. New persistence, history, identity, governance, certification, control planes, external services, or other material scope outside the confirmed boundary returns `decision-needed` rather than accepted remediation.

Completion: every candidate has a source-backed disposition and no accepted finding silently changes the confirmed goal or accepted requirements.

## 10. Return the Coverage-Bound Result

Return every field in the `Coverage-Bound Result` owned by `references/finding-and-reduction-schema.md` for the current mode and targets.

`ready` means the reviewed targets satisfy the invoked mode. The returned result is the sole home of review state; durable artifacts remain about their subject matter.

Completion: the result names the first required revision, coverage gaps, any owner decision, and what a downstream program designer or planner would still have to invent.

## Completion Blockers

Do not return `ready` while any of these hold:

- target classification or required runtime-skill-package parent identity is missing;
- the complete target or governing-source set was not read;
- boundary check 1, accepted requirements, or applicable boundary check 2 is missing or conflicting without an explicit returned authority gap;
- no complete fresh mode-complete receipt exists;
- a selected lane is silent without explicit follow-up;
- partial, blocked, or `no-receipt` coverage affects a required dimension;
- a finding lacks a source-backed failure path, goal-relevance record, deletion test, scope effect, or disposition;
- specification, program, or pair mode boundaries are conflated;
- `program-only` or `pair` omits an applicable current/proposed call path, explicit no-predecessor case, or added/removed/changed/intentionally-unchanged edge status;
- pair mode trusts author or local checks without independent reinspection;
- focused review began before parent reduction of the mode-complete receipt, more than one focused lane ran without explicit caller authority, or a broad predicate was treated as sufficient selection;
- the downstream consumer must invent meaning owned by the reviewed artifact;
- the result implies edit, remediation, lifecycle, planning, or acceptance authority.
