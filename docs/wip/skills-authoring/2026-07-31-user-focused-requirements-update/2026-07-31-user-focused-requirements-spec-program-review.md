# Run D — spec-program-review Reader Understanding

Date: 2026-07-31
Status: proposed; pending `skills-creation` review
Classification: behavior-changing, unscoped update to one named skill
Target skill: `spec-program-review`
Authoring basis: observed failure
Reproduction: reproduced in the current Perseus artifact set and reduced in `sources/2026-07-31-perseus-human-document-review.md`, `sources/2026-07-31-artifact-fluff-prevention.md`, `sources/2026-07-31-perseus-requirements-fidelity-loss.md`, `sources/2026-07-31-scope-inflation-session-analysis.md`, and `sources/2026-07-31-missing-call-path-deltas.md`
Proof posture: static and manual source validation in this changeset; pressure scenario authored but model execution deferred by explicit user direction as an accepted behavior-proof gap

## Promise and Success

This update helps independent reviewers determine whether a human can reconstruct, confirm, and challenge the specification or program-design model without wading through filler or workflow narration, while keeping review proportional to the confirmed goal and unresolved risk.

Success means the one mode-complete reviewer always tests whether a human can explain what the agent understood, identify where to correct it, trace the load-bearing model, and delete attention-cost residue. The parent reduces that complete review against the confirmed goal and complexity budget before deciding whether one focused follow-up is still needed. A `reader-understanding` lane deepens a concrete unresolved comprehension risk or an explicitly requested reader review; it is not automatically added to every substantial artifact. Findings remain candidate risks, unnecessary mechanisms are tested for deletion before their missing contracts are completed, and no reviewer can silently expand the accepted problem boundary.

## Trigger Surface

Keep the skill model- and user-invocable and add the new reader-understanding entry explicitly:

```yaml
description: Use when independently reviewing a specification, program design, or their pair for authority, requirements, reader understanding or readability, architecture, failure, traceability, scope fidelity, crux, or planning-readiness gaps, or when classifying whether specification-only or program-only review is required. Review only; not for editing, remediation, acceptance, plan or implementation review, creating/updating/evaluating one named runtime skill package, or a standalone security scan, audit, or threat model.
```

“Review this spec for readability” enters the normal review operation. It does not create a separate operation or automatically dispatch `reader-understanding`; the mode-complete reader pass runs first and the focused lane still requires the predicate below.

## Main-Path Surface

Change review sequencing from automatic lane multiplication to mode-first proportional review:

```text
dispatch exactly one mode-complete reviewer
  -> parent verifies and reduces the complete receipt
      -> no concrete unresolved risk: return the coverage-bound result
      -> concrete unresolved reader-comprehension risk or explicit deep-reader request:
           dispatch reader-understanding
      -> another concrete unresolved risk:
           dispatch the single best-matched focused lane
      -> proposed fix expands the confirmed boundary:
           return decision-needed without dispatching reviewers to design the expansion
```

Focused lanes run one at a time after parent reduction. A broad topic predicate—three components, a fallible boundary, a harness, a network call, cross-layer proof, or a hard-to-navigate artifact—is not sufficient by itself. The parent must name the concrete unresolved risk, explain why the complete reviewer did not settle it, and select the one lane whose mission can resolve it. The default review invocation dispatches at most one focused lane; after its receipt, reduce and return the coverage-bound result with remaining gaps. Dispatch an additional focused lane only when the user or caller explicitly authorizes that named residual risk after seeing the current coverage and review cost. Carry that authority in the existing packet constraints and bounded-review-question fields rather than a new budget schema. Stop when the risk is resolved, unsupported, outside the confirmed boundary, or requires an owner decision.

This sequencing is the resource brake for this workflow. It preserves independent subagent review without creating a reviewer swarm or assuming unlimited file descriptors. A generic active-agent budget for `manage-agents` remains separate scope.

Extend the mode-complete reviewer/common method with a compact human-reader pass in all three modes. It performs the applicable reconstruction walk below, checks disclosure order, and applies the deletion question at section/view level plus obvious process-residue and duplication sites. It returns only concrete failures and the smallest supported correction. The focused `reader-understanding` lane owns the deeper heading/paragraph/list/table/diagram audit when that compact pass leaves a material comprehension risk.

Mode-complete means the reviewer can reach a trustworthy verdict for the confirmed change shape; it does not mean every review category must produce content. The reviewer starts from the customer goal, accepted requirements, existing foundation, and actual delta, then marks a dimension applicable, already satisfied by the existing system, not applicable, or unresolved. It must not request a new subsystem merely because architecture, failure, migration, security, platform, or proof appears in a general review checklist.

The review packet carries the boundary-check-1 result and accepted requirements set returned under Run B's owned acceptance/recovery contract, using its existing identifiers and links. For program-only or pair mode it also carries Run C's complete boundary-check-2 result or exact missing decision, not an opaque acceptance flag. This is review context, not a new ledger or prose added to the durable artifacts. Missing confirmation may yield `decision-needed`; the reviewer does not infer acceptance.

The mode-complete reviewer independently verifies Run B's accepted requirements set against the owner-confirmed record or last inspectable owner-accepted governing baseline before judging cross-document consistency. If neither source is available or they conflict, return the authority gap; do not reconstruct the baseline from mutually narrowed current files. Review checks retained requirements coverage, not only agreement among the current files. Any removed or superseded obligation needs explicit owner authority.

For `program-only` and `pair`, the mode-complete reviewer also enforces Run C's call-path result as a core design obligation. For every applicable material runtime-behavior group, reconstruct the source-anchored current entrypoint-to-effect path and the proposed path, or the proposed-only path with an explicit no-predecessor case, then verify that relevant owners, caller/callee edges, state reads/writes or effects, and result/error propagation are visibly marked added, removed, changed, or intentionally unchanged. Components and interfaces without an applicable visible call path or edge status are a mode finding; they do not require a focused lane to become visible.

Add `reader-understanding` to the lane-schema lane enum. Keep the shared schema as the single owner of common packet and receipt fields, remove artifact-digest ceremony, and let current target paths plus coverage and the rule “edits after review require refreshed coverage” establish freshness. Lane-specific comprehension checks, per-element verdicts, and deletion consequences stay in the lane reference. Cut direct planning and handoff consumers over to the same current-reviewed-pair contract.

During reduction, reject wording preference that changes no reader behavior. Treat attention cost as reader behavior only when the candidate names an exact element and shows that deleting or merging it leaves understanding, decisions, traceability, failure simulation, proof, and authoritative lookup unchanged. Severity follows the existing consequence-based schema; there is no default severity for cruft.

Before accepting any finding, the parent records:

```text
confirmed requirement or boundary served
concrete failure if unresolved
smallest correction
whether deleting the questioned mechanism removes the failure
scope effect: inside confirmed boundary | requires owner expansion decision
```

If a finding exists only because a proposed mechanism is underspecified, test removal first. Complete the mechanism's missing contracts only when a confirmed requirement fails without it. Findings that introduce new persistence, history, identity, governance, certification, control planes, external services, or other material complexity outside the confirmed budget return as owner decisions rather than accepted remediation.

Classify the requested correction as requirements/Why/What, structural How, or both. When the request is How-only, a reviewer treats any deletion from Run B's accepted requirements set carried by the packet as a blocking scope regression unless the owner explicitly authorized it. Removing unnecessary structural machinery while preserving that set is the expected correction.

The review result owns `ready | needs-revision | blocked | decision-needed`. Review never edits a durable `Status` line, and planning consumes the returned review result instead of requiring `Status: Accepted` in the artifact.

## Lane Contract

Create `references/lanes/reader-understanding.md` with this stable job:

```text
mission: reconstruct the complete artifact as a human reader, test whether the
  intended model can be confirmed or corrected, and identify elements that
  consume attention without helping that work
expected inputs: lane-schema packet, complete target artifact set, companion
  links, governing-source inventory, confirmed goal boundary, and the
  mode-complete receipt plus either its concrete unresolved reader risk or the
  caller's exact explicit deep-reader question and scope
prerequisites: complete target/source set exists
maximum authority: fresh-context, read-only, candidate-only
non-goals: prose taste, arbitrary shortening, semantic redesign, editing,
  remediation, verdict, planning, or acceptance
```

First apply the human confirmation check. For specification review, the reader must be able to restate users, current problem, desired outcome, obligations, negative space, normal/failure behavior, and proof, then point to the exact claim they would correct. For program review, the reader must be able to compare a representative current and proposed entrypoint-to-effect path—or follow proposed-only and see that no predecessor exists—through owner, interface, callers/callees, changed edges, state or side effect, result/error, failure/recovery, tradeoff, and proof seam, then point to the exact structural assumption they would correct.

The mode-complete reviewer applies this reconstruction once. The focused lane repeats and deepens it only for the concrete unresolved reader risk or the caller's exact explicit deep-reader question and scope. Test progressive disclosure according to the selected review mode:

```text
specification-only
  requirements -> authoritative What/Why -> observable contract -> proof obligation
  stop at whether later program design can proceed without inventing meaning;
  do not require a program-design artifact; compare retained requirements with
  boundary check 1 rather than trusting a mutually narrowed requirements/spec pair

program-only
  governing specification obligation -> scenario or observable contract
    -> current/proposed call-path delta -> structural owner/state/failure behavior
    -> proof seam

pair
  requirements -> specification What/Why -> scenario or observable contract
    -> program-design current/proposed call-path delta and other How -> proof;
    account for every accepted requirement group or name the owner-authorized
    supersession
```

In every mode, confirm that each available artifact starts with the smallest useful model and reveals detail afterward. Flag missing links, bottom-up detail before the mental model, and copied prose presented as traceability. Preserve one compact breadcrumb or artifact map. Program-only and pair walks pass through the immediate specification contract rather than jumping from raw customer requirements directly to components. When detailed cases obscure coverage, ask whether one compact crosswalk would let a human verify the applicable chain without replacing the detailed authoritative definitions.

If scratch, research notes, prototype diagrams, or temporary trace matrices exist, treat them as optional evidence only. Flag a final artifact that requires `tmp/`, review notes, or lane evidence to recover its meaning, or that leaves accepted normative content only in scratch. Do not flag scratch merely for existing or for containing discarded alternatives.

Then apply the human deletion test to every heading, paragraph, list, table, and diagram:

```text
If this element disappeared, which first understanding, decision, trace,
failure simulation, proof path, or authoritative lookup would become
underdetermined?
```

Flag an element when no such consequence exists, including repeated purpose/boundary prose; duplicate sibling ownership recitals; authoring-process, review-state, acceptance/readiness, planning, PR, or release narration that is not a governing system obligation; summaries that merely restate the immediately preceding model; decorative diagrams that redraw headings; terminal receipt fields embedded as durable narrative; and duplicated claims with another authoritative home. A status edit whose only meaning is that review occurred belongs in the returned result, not the artifact.

Also flag jargon or abstract phrasing when it prevents a human from restating the idea or locating the decision, relationship, rationale, boundary, example, or correction point it represents. Do not flag a necessary domain term merely because it is specialized; require the term to carry stable meaning and be understandable from the artifact.

Check headings separately. A heading must tell a human what question the section answers. When useful content sits under compressed jargon such as “Requirement realization and proof seams,” preserve the content and propose a plain title such as “How Each Requirement Works and How We Verify It.”

Flag sections such as “Architecture documentation impact” when they contain only post-implementation documentation or PR cleanup work, and “Design completion boundary” when they repeat acceptance or planning gates. Route those items to planning, the returned workflow result, or `docs-maintain`. Preserve any actual system obligation or the single design-readiness check that would otherwise be lost.

Preserve authority and governing-source pointers that affect a decision; scope and negative space; singular ownership; constraints and forbidden edges; alternatives, tradeoffs, debt, falsifiers, and revisit conditions; behavioral interfaces; state, flow, failure/recovery, concurrency, migration, and trust decisions; proof seams; and one smallest useful navigation home. Dense or long is not the same as low signal.

Audit whether each diagram exposes enough direction, timing, ownership, cardinality, state authority, and failure information for a human to reconstruct the model. Flag decorative or under-specified diagrams within this lane. When the information is present but appears semantically wrong, return a routed candidate to the applicable contract, architecture-boundary, failure-concurrency, security-trust, platform-harness, implementation-difference, or proof lane; do not recommend the semantic repair here. Flag source claims with no inspectable location when verification depends on that source.

Calibrate every candidate with the exact element, the reader behavior unchanged by deletion, the surviving authoritative home when duplicated, the smallest removal or merge, and any semantic material that must be retained. A blanket word ban, length target, mandatory heading shape, or “this reads badly” is not a finding. A request to add more architecture is not a reader-understanding fix and returns to goal-relevance reduction. A shorter artifact that drops accepted semantic coverage is not pruning and routes to the applicable semantic lane or mode-complete verdict.

Overlap boundary: `reader-understanding` owns whether disclosure order and explanation expose enough information for a human to reconstruct/correct the model, plus attention cost, process leakage, and redundant content. `artifact-navigation` owns whether entry paths, link targets, placement, and authoritative homes physically resolve. Semantic lanes own correctness, completeness, and repair of retained claims; `reader-understanding` routes suspected semantic defects to them.

Return the existing lane-schema receipt plus per-flagged-element deletion consequence, duplicate/surviving home when applicable, retained semantic residue, and smallest correction. Stop when every reader-facing element inside the authorized unresolved risk or explicit deep-reader scope has a keep-or-flag basis, or an exact coverage gap is reported. Only a caller-authorized full-artifact audit expands that stop condition to every reader-facing element in the artifact.

Update `artifact-navigation.md` with the reciprocal overlap boundary only; do not duplicate the signal-density procedure there.

## Proof Surface

Add static checks for the readability trigger, lane enum, the section/view-level mode-complete human-reader pass, focused-lane ownership of scoped element-by-element audit, all three mode-specific reconstruction walks, specification-only operation without a program-design artifact, program-only/pair rejection of an applicable runtime-behavior design with no visible current/proposed call path or explicit no-predecessor case and all four edge markers, Run B accepted-requirements recovery and coverage, correction classification, conditional reader-understanding selection, mode-complete-first sequencing, default return after the first focused receipt, explicit user/caller authorization in the existing packet fields before any additional focused dispatch, concrete unresolved-risk qualification, complete dispatch contract reuse, reciprocal overlap, semantic-lane route-back, goal-relevance and deletion-first reduction, owner routing for scope expansion or subtraction, review-result ownership of acceptance, consequence-based wording, and absence of fixed length/vocabulary rules. Add deferred scenarios using the reproduced Perseus-style bait, the scope-inflation incidents, the missing-call-path program designs, and the six-skill-to-Upload-only scope loss: purpose/governing-boundary recitals, completion/acceptance narration, companion-role repetition, PR cleanup, components/interfaces with no visible applicable call path, a hidden removed edge, a same-owner synchronous change whose current/proposed call delta still matters, a first design with proposed-only and explicit no predecessor, an unnecessary persistence/certification mechanism that generates more findings, several broad risk predicates that should not create a reviewer swarm, two concrete residual risks where only one focused lane runs by default and the second requires explicit user/caller authorization recorded in the existing constraints and bounded-review-question fields, a scoped reader risk that must not trigger a whole-document audit, and a mutually consistent requirements/spec/program trio that silently drops five accepted skills. Preserve dense load-bearing alternatives, ownership, state, failure, and proof sections. Distinguish decorative diagrams, diagrams missing reconstruction information, and semantically suspect diagrams routed to another lane.

Do not run model pressure tests in this changeset. The existing Perseus artifacts and advisor results establish the observed failure and design basis; they do not prove the implemented lane works. Report behavior proof as a user-accepted deferred gap.

## Implementation Boundary

Expected changed homes: `spec-program-review/SKILL.md`, including frontmatter, focused-lane selection, and sequencing; `references/reviewing-common-method.md` for applicability and accepted-set recovery; `references/reviewing-program-design.md` and `references/reviewing-pair.md` for call-path enforcement; `references/lanes/mode-complete-reviewer.md` for the compact human-reader pass; new `references/lanes/reader-understanding.md`; `references/lanes/lane-schema.md`; `references/lanes/artifact-navigation.md`; `references/finding-and-reduction-schema.md`; static tests; deferred scenarios; version; and changelog. Keep mode identities, verdict labels, fresh-context/read-only/candidate-only authority, retired skills, and other review skills unchanged. Do not add a second mandatory reviewer, a parallel default lane set, or artifact-edit authority.
