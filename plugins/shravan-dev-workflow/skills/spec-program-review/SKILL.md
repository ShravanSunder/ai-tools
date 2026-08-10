---
name: spec-program-review
description: Use when classifying whether a specification-only or program-only change semantically requires independent review, or when independently reviewing a Specification, Program Design, or complete Requirements, Specification, and Program Design set for authority, requirements, reader understanding or readability, architecture, failure, traceability, scope fidelity, crux, call-path, or planning-readiness gaps. Classification or review only; not for editing, remediation, acceptance, plan or implementation review, creating/updating/evaluating one named runtime skill package, or a standalone security scan, audit, or threat model.
---

# Specification and Program Design Review

Review is independent reconstruction of the smallest system that satisfies the confirmed goal. It is not proofreading, design by committee, or a search for mechanisms to complete.

The reviewer rebuilds and challenges:

```text
Requirements: WHY, for whom, and within what boundary?
  -> Specification: WHAT must be observably true?
  -> Program Design: HOW will the internal system satisfy it?
  -> existing foundation and structural realization
  -> current/proposed calls, state, failure, and proof
  -> reader understanding and planning readiness
```

Requirements, Specification, and Program Design are separate authoritative concepts. Review reconstructs each one independently before judging their agreement; agreement inside a combined `Requirements/spec` document cannot substitute for a separately identifiable Requirements source and Specification.

Fresh context, read-only access, and candidate-only authority create independence. The parent verifies findings, tests deletion before addition, and owns the coverage-bound result. This skill never edits artifacts, mutates their lifecycle, plans, or accepts a design.

One bounded design run permits one independent review invocation and at most one bounded remediation round. That round may span both semantic owners when the accepted finding set requires the existing ordered `spec-design -> program-design` route; each artifact is corrected at most once, then the parent verifies all corrected anchors against the original findings and closes without dispatching another reviewer. A second design review requires explicit user permission given after that result is visible.

Disposition comes before remediation. Reject pedantic, stylistic, already-satisfied, or otherwise non-semantic findings with source evidence and continue. Route one valid correction inside the settled mental model to its semantic owner. If a finding disproves a load-bearing assumption or exposes unmade owner meaning, return the failed assumption, evidence, consequence, and exact owner as `decision-needed` or `blocked`; do not spend the remediation allowance to push through a mental-model break.

## Operations

```text
classify-review-requirement
  requested future mode: specification-only | program-only
  returns: review-required | non-substantial, or blocked input
  dispatches: no reviewer

review
  mode: specification-only | program-only | three-artifact-design
  three-artifact-design targets:
    Requirements identity
    Specification identity
    Program Design identity
  result identity:
    exact review invocation identity
    exact review result identity
  result: ready | needs-revision | blocked | decision-needed
  semantic coverage: exact current identity and meaning coverage for every target
  freshness: current coverage for every consumed target; uncertain semantic effect is stale
  dispatches: exactly one mode-complete reviewer first, then at most one focused reviewer by default
```

Review coverage follows meaning, not changed bytes. After the one permitted remediation, the parent performs and records a semantic-change check without dispatching another reviewer:

- if meaning changed inside the accepted correction, preserve the original review as the independent finding source and add parent-verified remediation anchors for every accepted finding;
- if the parent verifies that meaning did not change—for example, a formatting, link-repair, process-metadata, or typo-only edit—carry the existing semantic coverage forward and dispatch no model reviewer;
- if the change exceeds the accepted correction or its effect is uncertain, stop `review-permission-required`; do not start another review automatically.

Closure is established by the original review result plus parent-verified remediation evidence for the current artifacts. Keep this call-scoped record out of durable design artifacts and do not add persistent review bookkeeping.

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
mode and complete target identities: file paths or separately labeled in-chat records
governing sources, authority states, and coverage basis
confirmed goal boundary and accepted requirements set, or the exact authority gap
structural-realization confirmation for program-only or three-artifact-design, or the exact owner decision still needed
constraints and non-goals
risk predicates
claimed proof evidence or gaps
review question when narrower than readiness
prior review coverage and semantic-change record when coverage is being reused
bounded design-review status: no prior review | explicit user permission for another review
```

MUST load `../../shared-references/requirements-specification-program-design.md` and return the Requirements, Specification, and Program Design identity status for the selected mode. `specification-only` inspects separately identifiable Requirements and Specification sources. `program-only` and `three-artifact-design` inspect separately identifiable Requirements, Specification, and Program Design sources. Reuse resolvable file pointers or the separately labeled in-chat records supplied by the caller; do not copy them into a combined review artifact.

Use the owner-confirmed requirements record and confirmed goal boundary when available. Otherwise use the last inspectable owner-accepted governing source. If neither exists, or they conflict, return the authority gap. Mutually narrowed current files never establish the accepted requirements set by themselves.

A combined `Requirements/spec`, a Requirements-titled artifact that also stands in for the Specification, or an absent separate Requirements or Specification identity is a concrete blocker-level design finding, not permission for review to infer the missing identity. Record `needs-revision`, route the smallest correction to `spec-design`, and do not repair or create either artifact during review. Continue only with bounded findings that the available sources can support; never return `ready`.

`program-only` also requires the governing Specification. `three-artifact-design` requires the current Requirements, Specification, and Program Design. A missing confirmed goal boundary, or missing structural-realization confirmation for `program-only` or `three-artifact-design`, may produce `decision-needed`; review does not infer acceptance from silence or a status label.

Completion: the complete target set, governing sources, accepted requirements, boundaries, open authority decisions, and any prior-coverage semantic-change record are unambiguous.

If the packet shows that one design review already ran in this bounded design run and contains no explicit user permission granted afterward, return `blocked` with `review-permission-required` before dispatch. Switching modes, lanes, target labels, or caller skills does not reset this boundary.

## 4. Select the Mode

The selected mode reference owns its review judgment:

```text
specification-only -> references/reviewing-specification.md
program-only       -> references/reviewing-program-design.md
three-artifact-design -> references/reviewing-three-artifact-design.md
```

Specification review judges the governing Requirements authority and the Specification's observable What. Program review judges structural How and realization of the governing Specification. Three-artifact design review independently repeats both and judges traceability, integration, and planning readiness.

Completion: exactly one mode and its complete required artifact set are selected.

## 5. Resolve Reviewer Runtime and Authority

MUST use `manage-agents` before each reviewer dispatch and return the one-shot `Delegate` pattern, model and reasoning, reviewer history `none`, read-only workspace access, runtime, permissions, packet, and receipt mechanics.

Every reviewer gets the complete targets and governing sources but no parent conversation history, author conclusion, expected verdict, prior praise, or hidden context. Reviewer findings remain candidate-only. Silence is `no-receipt`, never a clean review.

Coverage from a receipt expires when a later semantic change outside the accepted remediation affects the mode dimensions, focused-lane predicate, or finding coverage it supplied. The exact one permitted remediation is closed by parent verification and does not expire coverage or authorize redispatch. A parent-verified non-semantic edit also preserves coverage. Expanded or uncertain meaning stops `review-permission-required`.

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

After the first focused receipt, return the coverage-bound result with remaining gaps. Dispatch another focused lane only when (a) the human user authorizes that named residual risk after seeing current coverage and review cost, or (b) the pre-dispatch external-caller packet already named that residual risk and authorized a second lane before the mode-complete dispatch. The reviewing parent may not grant this authority to itself before or during review, and reviewer output never creates it. Carry that authority in the existing packet constraints and bounded-review-question fields.

After remediation, do not rerun a focused lane. The parent verifies affected finding anchors; any unresolved or expanded risk stops for explicit permission to begin another review invocation.

Stop focused review when the risk is resolved, unsupported, outside the confirmed goal boundary, or needs an owner decision.

Completion: the selected risk, non-selected residual risks, terminal receipt, and any explicit authority for an additional lane are recorded.

## 8. Verify Reviewer Independence

Confirm each receipt matches its assignment, reviewer history was empty, access remained read-only, authority stayed candidate-only, and the reviewer did not mutate the reviewed targets. Compare the covered target text to the reviewed target text. A later permitted remediation is closed by parent verification against accepted findings; it never causes automatic redispatch.

Completion: each used receipt supplies semantically current coverage for the current target text, and reviewer execution did not widen authority or mutate the worktree.

## 9. Verify and Reduce Findings

MUST load `references/finding-and-reduction-schema.md` and return its dispositions, merged duplicates/conflicts, coverage gaps, goal-relevance record, deletion-first decision, scope effect, and final coverage-bound result.

Re-anchor before accepting a finding: identify the confirmed requirement or goal-boundary field it serves, whether the existing foundation already satisfies it or can supply the correction, the concrete failure if unresolved, the smallest correction, whether removing the questioned mechanism removes the failure, and whether the correction stays inside the confirmed goal boundary. Then return the existing `accepted | rejected | contested | unverified` disposition; do not create a second checkpoint status. When evidence is missing, follow that reference's evidence-lookup branch before accepting. Question whether a proposed mechanism is needed before accepting findings that merely complete its missing contracts.

Every finding uses the complete Finding shape from the loaded schema. For the caller-facing explanation, write every returned finding in ordinary language, whether it is an unreduced reviewer candidate or has the parent disposition `accepted | rejected | contested | unverified`. Each explanation includes:

- a title naming the concrete problem rather than a review method;
- what is wrong and where the evidence appears;
- the affected confirmed requirement or design relationship and concrete consequence;
- the smallest correction, followed by a separate `Route:` line naming `spec-design`, `program-design`, `caller`, or ordered `spec-design -> program-design`;
- the evidence or affected review coverage that would confirm the correction.

Do not leave the route implicit from the artifact or section named. Record parent disposition separately after reduction; unreduced candidate status does not waive the useful finding fields. A review label may summarize the explanation but may not replace any field.

For each material proof claim, compare the claimed outcome with the supplied evidence's actual observation boundary. State what the evidence proves, what it cannot observe, and the smallest missing proof modality or structural observation seam. Do not collapse distinct unsupported claims into generic “runtime proof”; match each claim with the smallest observation that could confirm or falsify it. For each applicable diagram, name the reader question it should answer and compare its visible owners, direction, state or effect, normal and error behavior, and changed edges with the written requirements and design. Rendering or repeated labels alone do not establish usefulness or agreement.

Classify each requested correction by the concept it affects: `Requirements`, `Specification`, `Program Design`, or a named combination. A Program Design-only correction preserves Requirements and the observable Specification unless the owner explicitly changes them.

Route accepted corrections by semantic owner:

- `Requirements` returns to `spec-design`, using `discuss-pathfinding` when owner meaning is missing;
- `Specification` returns to `spec-design`;
- `Program Design` returns to `program-design`;
- any correction spanning Requirements or Specification plus Program Design returns to `spec-design` first, then `program-design` after the observable contract is settled.
- `caller` returns the exact owner/caller decision; review does not resume until that decision is resolved.

Reject prose taste without reader or design effect. Missing evidence is `unverified`. Preserve real disagreement as contested. New persistence, history, identity, governance, certification, control planes, external services, or other material scope outside the confirmed goal boundary returns `decision-needed` rather than accepted remediation.

Completion: every candidate has a source-backed disposition; every finding uses the complete loaded Finding shape and contains each caller-facing field above regardless of disposition or final verdict; and no accepted finding silently changes the confirmed goal or accepted requirements.

## 10. Return the Coverage-Bound Result

Return every field in the `Coverage-Bound Result` owned by `references/finding-and-reduction-schema.md` for the current mode and targets.

`ready` means the reviewed artifact meaning satisfies the invoked mode. When accepted bounded findings are remediated, downstream callers may continue only with the original result plus complete parent-verified remediation evidence. Rejected non-semantic findings need no remediation. A mental-model break remains a stop until its owner supplies settled meaning. Durable artifacts remain about their subject matter and do not acquire review lifecycle or acceptance status.

After parent reduction, return either a stop or exactly one recommended next skill using the route and compact-handoff procedure in the loaded reference. Reviewer candidates never select this route. When validated findings span Requirements or Specification plus Program Design, recommend `spec-design` first and carry the complete accepted set; the later Specification result decides whether `program-design` follows. Recommend `discuss-pathfinding` only when complete review evidence establishes that the current model fails and replacement owner meaning is genuinely unmade, and include the review-selected return owner. A current authoritative correction routes directly to its semantic owner; missing evidence stops.

Completion: the result names the first required revision, coverage gaps, any owner decision, what a downstream program designer or planner would still have to invent, and one parent-selected compact continuation handoff or an exact stop reason.

## Completion Blockers

Do not return `ready` while any of these hold:

- target classification or required runtime-skill-package parent identity is missing;
- the current target identity or semantic scope is missing or ambiguous;
- Requirements and Specification are not separately identifiable in any review mode, or a combined `Requirements/spec` is being used as both;
- the complete target or governing-source set was not read;
- the confirmed goal boundary, accepted requirements, or applicable structural-realization confirmation is missing or conflicting without an explicit returned authority gap;
- no complete semantically current mode-complete receipt exists;
- a selected lane is silent without explicit follow-up;
- partial, blocked, or `no-receipt` coverage affects a required dimension;
- a finding lacks an accepted requirement identity or confirmed goal-boundary field, its plain-language meaning, the observable outcome that fails, source-backed evidence, deletion test, scope effect, semantic correction route, or disposition;
- specification, program, or three-artifact-design mode boundaries are conflated;
- `program-only` or `three-artifact-design` omits an applicable current/proposed call path, explicit no-predecessor case, added/removed/changed edge status, or a preservation-critical or contested unchanged edge;
- a material proof claim is accepted without evidence that can observe it at the required layer, or an applicable diagram is accepted without checking that it answers its reader question and agrees with the written meaning;
- three-artifact-design mode trusts author or local checks without independent reinspection;
- focused review began before parent reduction of the mode-complete receipt, more than one focused lane ran without human-user or pre-dispatch external-caller authority, or a broad predicate was treated as sufficient selection;
- a second design review invocation began without explicit user permission granted after the first review/remediation result;
- the downstream consumer must invent meaning owned by the reviewed artifact;
- the result recommends no next skill, more than one next skill, or a route selected from an unreduced reviewer candidate when a validated continuation exists;
- a continuation omits the current boundary status or makes the destination choose among correction alternatives instead of carrying one smallest verified correction;
- a pathfinding recommendation omits the review-selected return owner, or complete current authority/evidence already settles the correction;
- a continuation copies artifact contents or unrelated history instead of returning the destination's compact pointer-based handoff;
- the result implies edit, remediation, lifecycle, planning, or acceptance authority.
