---
name: spec-program-review
description: Use when classifying whether independent specification-only or program-only review is required for exact artifact digests, or when independently reviewing a specification, program design, or their pair for authority, requirements, architecture, failure, traceability, crux, or planning-readiness gaps. Classification or review only; not for editing, remediation, acceptance, plan/implementation review, creating/updating/evaluating one named runtime skill package, or a standalone security scan/audit/threat model.
---

# Specification and Program Design Review

Classification is a deterministic preflight over exact scope and risk; it is not review. Review is adversarial model reconstruction, not proofreading.

The reviewer independently rebuilds and attacks:

```text
authority and intent
  -> obligations and observable contracts
  -> components, owners, interfaces, states, and flows
  -> failure/security/reliability behavior
  -> proof modalities and seams
  -> planning readiness
```

Review independence means fresh context, read-only authority, and source-backed judgment. It does not mean ignorance of governing sources. This skill never edits artifacts, runs remediation, plans, mutates caller state, or accepts a pair.

## Operations

```text
classify-review-requirement
  requested future mode: specification-only | program-only
  returns: review-required | non-substantial, or blocked input
  dispatches: no reviewer

review
  mode: specification-only | program-only | pair
  returns: ready | needs-revision | blocked | decision-needed
  dispatches: exactly one fresh mode-complete reviewer plus qualified focused lanes
```

All results bind exact artifact and governing-source identities/digests. A changed target makes prior coverage stale.

## 1. Guard the Skill-Authoring Boundary

Record `target classification: general-domain | runtime-skill-package`.

IF the target is one named runtime skill package, require the explicit `skills-creation` parent packet/result identity authorizing this review composition. Without it, return the `skills-creation` route and stop before classification or reviewer dispatch.

Completion: target classification and, when applicable, the exact `skills-creation` parent packet/result identity are recorded.

## 2. Classify Review Requirement

IF operation is `classify-review-requirement`, load `references/classifying-review-requirement.md` and return the digest-bound `review-required | non-substantial` result or blocked missing-input result.

Dispatch no reviewer, select no lanes, and return no review verdict. `review-required` instructs the caller to make a separate fresh review invocation.

Completion: classification returns immediately with zero reviewer dispatches.

## 3. Bind a Review Invocation

For operation `review`, require:

```text
target classification: general-domain | runtime-skill-package
skills-creation parent packet/result identity when target is runtime-skill-package
mode
exact target paths/identities and digests
governing source identities/digests/versions, authority statuses, and freshness/applicability
governing-source coverage completeness basis
constraints and non-goals
risk predicates
claimed proof evidence or gaps
review question when narrower than readiness
```

`program-only` also requires the governing specification digest. `pair` requires current specification and program-design artifacts; a pair-ready verdict additionally requires current local results or independently repeated and recorded local checks.

Completion: target, mode, sources, and current digests are unambiguous.

## 4. Select the Mode

The selected mode reference owns its review judgment:

```text
specification-only -> references/reviewing-specification.md
program-only       -> references/reviewing-program-design.md
pair               -> references/reviewing-pair.md
```

Specification review judges authoritative Why/What. Program review judges internal How and realization of the governing specification separately. Pair review independently repeats load-bearing local checks and judges traceability/integration/planning readiness.

Completion: exactly one mode and its complete required artifact set are selected.

## 5. Resolve Reviewer Runtime and Authority

MUST use `manage-agents` before each reviewer dispatch to resolve the one-shot `Delegate` pattern, required model category and reasoning, reviewer history `none`, read-only workspace access, runtime, permissions, packet, and receipt mechanics. Frontier Sol high/xhigh remains available for independent review assignments under that pattern.

Every reviewer gets:

- no parent conversation history;
- read-only workspace access;
- exact targets and self-contained governing sources;
- no caller conclusion, expected verdict, author confidence, prior praise, or hidden conversation;
- candidate-only authority.

Record the resolved model/runtime, reasoning control, `parent history: none`, read-only enforcement, permission boundary, and conclusion-free packet decision before dispatch. A receipt expires after reviewed text changes. Silence is never a clean result.

Completion: dispatch mechanics and independence are resolved and recorded before any reviewer runs.

## 6. Dispatch the Mode-Complete Reviewer

Every reviewer dispatch instantiates this caller-owned packet contract from `references/lanes/lane-schema.md`:

```text
assignment identity: unique and digest-bound
lane: exact selected lane
review mode: selected mode
target paths/identities, line counts, and digests: exact current values
governing-source identities/digests/versions, authority statuses, and freshness/applicability: exact inventory
governing-source coverage completeness basis: why the scoped inventory is complete
observable selection predicate: mandatory predicate or exact focused predicate
bounded review question: readiness or the caller's narrower question
source scope: exact inspectable sources
constraints and non-goals: caller constraints plus lane exclusions
risk predicates: exact matched/ambiguous risks
mission: copied from the selected lane reference
maximum authority: copied from the selected lane reference
overlap boundary and non-goals: copied from the selected lane reference
prerequisites and dependency state: exact satisfied/missing prerequisites
stop condition: copied or narrowed from the selected lane reference
expected return: selected lane's complete/partial/blocked receipt shape
```

MUST dispatch `mode-complete-reviewer` to a fresh subagent using the complete caller-owned packet contract above with predicate `mandatory for every review invocation`.

The subagent loads `references/lanes/lane-schema.md` and `references/lanes/mode-complete-reviewer.md`; that lane MUST load `references/reviewing-common-method.md` and the selected mode reference named above before inspection.

Parallel-safe after the complete target and governing-source set exists; scheduling may serialize. Instance authority is fresh-context, read-only, candidate-only, and equal to or narrower than the lane maximum. Return a `complete | partial | blocked` receipt with complete mode evidence and candidate recommendation, or parent-recorded `no-receipt` after explicit follow-up. The parent verifies and reduces; even a complete receipt is not the final verdict.

Completion: one current mode-complete terminal state exists. `partial`, `blocked`, and `no-receipt` cannot yield `ready`.

## 7. Select Focused Lanes

Focused lanes deepen a predicate-selected risk and never replace mode completeness:

```text
normative sources conflict, product meaning is load-bearing, or a requirement's basis is unclear
  -> references/lanes/specification-authority.md
public UI/API/CLI/schema/config/operator contract is material
  -> references/lanes/contract.md
three or more components, an ownership change, a new source of truth, or a cross-module edge is in scope
  -> references/lanes/architecture-boundary.md
a fallible boundary, retry, partial success, cancellation, shared mutable state, or concurrent actors exist
  -> references/lanes/failure-concurrency.md
auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugin, agent, or external service
  -> references/lanes/security-trust.md
runtime, framework, tool, sandbox, browser, native UI, agent, or test harness constrains feasibility or proof
  -> references/lanes/platform-harness.md
current implementation/prototype/trace may hide unstated decisions
  -> references/lanes/implementation-difference.md
proof modality or seam is disputed, cross-layer, visual, operational, or security-sensitive
  -> references/lanes/proof.md
normative claims are distributed or the artifact/pair is hard to navigate
  -> references/lanes/artifact-navigation.md
```

IF a focused predicate holds, dispatch the selected lane using every field in the complete caller-owned packet contract above, instantiated from the exact focused-lane reference and current sources.

The subagent loads `references/lanes/lane-schema.md`, `references/reviewing-common-method.md`, and the exact selected lane path. Parallel-safe only after the complete target/source set exists; focused lanes may run beside the mode-complete reviewer. Instance authority is fresh-context, read-only, candidate-only, equal to or narrower than the lane maximum, and excludes mode recommendation, final verdict, editing, remediation, planning, and acceptance. Return `complete | partial | blocked` or parent-recorded `no-receipt`; the parent verifies and reduces.

Completion: selected predicates and unselected ambiguous predicates are recorded, and every selected lane has a terminal state.

## 8. Verify Reviewer Independence

Verify every receipt against the pre-dispatch independence record. Recompute the covered target digests and compare the worktree or equivalent workspace-change observation with the pre-dispatch record; confirm assignment/digest binding, no inherited history, read-only access, candidate-only authority, and no reviewer mutation.

Completion: each receipt is assignment- and digest-bound, and reviewer execution did not widen authority or mutate the worktree.

## 9. Verify and Reduce Findings

MUST load `references/finding-and-reduction-schema.md` to verify candidate findings against current files/sources and return dispositions, merged duplicates/conflicts, coverage gaps, and final coverage-bound verdict.

Reject prose taste without behavior effect. Missing evidence is `unverified`, not rejected. Preserve real disagreement as contested. Stop adding reviewers when repeated lanes produce only unsupported doubt; repair selection/packet/calibration instead.

Completion: every candidate is accepted, rejected, contested, or unverified with evidence rationale.

## 10. Return the Coverage-Bound Result

Return every field in the `Coverage-Bound Result` owned by the already-loaded `references/finding-and-reduction-schema.md`, bound to the current mode, exact covered digests, and immutable governing-source inventory.

`ready` means the exact covered artifact(s) satisfy the invoked mode. It does not write caller-owned acceptance state.

Completion: the result names the first required revision, receipt freshness, coverage gaps, and what a planner would still have to invent.

## Completion Blockers

Do not return `ready` while any of these hold:

- target classification is missing, or a runtime-skill-package target lacks the explicit `skills-creation` parent packet/result identity;
- target/source identity or digest is missing, stale, or ambiguous;
- the complete required artifact set was not read;
- no complete fresh mode-complete receipt exists;
- a selected lane is silent without explicit follow-up;
- partial/blocked/no-receipt coverage affects a required dimension;
- a finding lacks a source-backed failure path or disposition;
- specification/program/pair mode boundaries are conflated;
- pair mode trusts author/local checks without independent reinspection;
- the mode's downstream consumer must invent meaning owned by the covered artifact: the pretend program designer for `specification-only`, or the pretend planner for `program-only` and `pair`;
- the result implies edit, remediation, lifecycle, planning, or acceptance authority.
