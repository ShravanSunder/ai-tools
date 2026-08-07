---
name: review-implementation
description: Use when independently reviewing implemented code, tests, proof, a branch diff, commit, PR head, or accepted remediation before PR readiness, including when required governing-authority, approved-plan, source, diff, or proof identities are missing or conflicting and the review must block. Not for design-artifact review, skill-package authoring review, editing findings, standalone security scans, security audits, threat models, vulnerability reviews, security diff scans, security-finding remediation, or PR lifecycle monitoring.
---

# Review Implementation

Implementation review is independent reconstruction, not reviewer consensus. One complete fresh-context reviewer traces governing obligation to plan to implementation to proof; the parent verifies every candidate and owns the result. Reviewer count never substitutes for coverage.

## Admit The Review

1. Classify `general-domain | runtime-skill-package`. A runtime skill package always routes to `skills-creation` and stops; that workflow owns skill proposal and changed-skill review.
2. Classify a general-domain target as `meaningful-review-required | non-substantial | blocked-input`. `non-substantial` is limited to formatting, typo, link-repair, or generated-metadata-only changes whose exact diff and every changed file were inspected and shown to have no semantic or runtime consumer. Record that evidence per file. Any unavailable diff, uncertain effect, behavior, architecture, security, runtime, data, migration, or meaningful code change is `blocked-input` or `meaningful-review-required`, never `non-substantial`.
3. For meaningful review, MUST load `../../shared-references/canonical-implementation-plan.md` to validate and preserve the unchanged complete tuple plus separate current-plan approval evidence and return the validated unchanged tuple, exact approval record, and any blocking discrepancy. This skill alone maps that return to review-specific `admit | blocked-input`.

For `non-substantial`, return one current row per changed file with changed path, exact base/reviewed/diff anchor, reviewed source/search scope, consumer search and result anchors, evidence freshness, and no-effect conclusion, then stop before canonical-plan admission or reviewer dispatch. Never compute a file hash or digest for review identity.

Admit either complete ready reviewed-design authority or admitted repository-improvement authority, plus an exact canonical `draft` tuple with matching later approval, base and reviewed identities, diff range, repository instructions, proof claims and evidence, constraints, known gaps, and prior-coverage freshness. Under the `spec-program-review` operation contract, which remains the sole owner of design-review labels and semantics, reviewed-design authority requires separate current Requirements, Specification, and Program Design identities plus the exact semantically current `three-artifact-design` review invocation/result with result `ready`. Repository-improvement authority requires the tuple's `plan-improve-repo` origin and its anchored admitted planning basis; an asserted but unproven `implementation-mechanics-only` basis blocks. Missing or conflicting authority, tuple, approval, source identity, diff, or claimed-proof boundary is `blocked-input`; never infer it from a summary.

Completion: `non-substantial` returns its complete per-file evidence rows. Meaningful or blocked admission returns classification, governing identities, unchanged tuple, the complete separate approval-evidence record or explicit absence, base/reviewed identity, diff, proof boundary, and `admit | blocked-input` explicitly.

## Reconstruct And Judge

1. Build one reusable evidence core containing governing authority identities, the unchanged canonical tuple and complete separate approval-evidence record or explicit absence, base and reviewed identities, exact diff range, changed files, repository instructions, proof claims/evidence, constraints, known gaps, applicable risk predicates, and prior-coverage freshness. Instantiate the shared packet schema for each dispatch with its own assignment identity and lane identity plus that evidence core.
2. MUST use `manage-agents` to resolve a one-shot Delegate with parent conversation history `none`, read-only workspace access, exact model/runtime/permissions, packet, and receipt mechanics; return that dispatch contract before any reviewer runs. MUST dispatch `complete-reviewer` to a subagent using that contract and the shared review packet. Subagent loads `references/lanes/lane-schema.md`, `references/lanes/complete-reviewer.md`, and `references/reviewing-implementation.md`. Parallel-safe after every packet input exists; actual scheduling is serial. Instance authority is fresh-context, read-only, candidate-only, complete-review authority equal to or narrower than the lane maximum. Return a `complete | partial | blocked` receipt that identifies the assignment/runtime and confirms history isolation; the parent verifies and reduces it.
3. Verify the receipt's separate assignment, lane, and source identities, read-only authority, target freshness, obligation trace, normal and failure paths, proof-layer fit, runtime reachability when applicable, false-substitute checks, highest-risk crux, and exact uncovered boundary. Do not repeat the reviewer's mission merely to create a second opinion.
4. MUST load `references/finding-and-reduction.md` to verify and reduce every candidate against current sources and return dispositions, merged duplicates and conflicts, evidence boundaries, semantic routes, correction freshness, and the coverage-bound result.
5. If parent reduction leaves one concrete material risk, IF that exact risk remains unresolved, dispatch `focused-reviewer` using the resolved `manage-agents` contract, shared review packet, complete receipt, parent dispositions, and named falsifiable risk question. Subagent loads `references/lanes/lane-schema.md`, `references/lanes/focused-reviewer.md`, and `references/reviewing-implementation.md`. Parallel-safe only after parent reduction of the complete receipt; actual scheduling is serial. Instance authority is fresh-context, read-only, focused-question-only, candidate-only, and equal to or narrower than the lane maximum. Return `complete | partial | blocked`; the parent verifies and reduces it. Additional focused review requires prior caller or current human authority.
6. Return `ready | needs-revision | blocked | decision-needed` with reviewed identities, coverage, evidence boundaries, findings, first correction, exact route, and freshness conditions.

Completion: the complete-reviewer receipt has status `complete`; `partial` or `blocked` prevents `ready` and preserves the exact gap or blocker. Every candidate has a parent disposition, any focused pass answered exactly one unresolved material risk, uncovered boundaries remain explicit, and the result is bound to the reviewed source and proof identities.

## Semantic Routes

- Requirements or observable-contract defect -> `spec-design`.
- Structural ownership, interface, state, failure, concurrency, trust, compatibility, or proof-seam defect -> `program-design`.
- Slice, sequence, dependency, collision, write-scope, or plan-proof defect -> the recorded originating planner: `plan-implementation` or `plan-improve-repo`.
- Code, test, fixture, or implementation-proof defect -> `implement-plan`.
- Missing authority or unresolved owner decision -> caller.

Return every accepted finding with every field from the `Accepted Finding` block in `references/finding-and-reduction.md`; never compress a verified finding into only its anchor, consequence, and route. The complete return therefore preserves severity, exact anchor, governing obligation or invariant, concrete consequence, smallest correction, semantic owner, confirmation evidence, parent disposition, coverage invalidated, and correction freshness.

## Boundaries

- The workflow and its reviewers are read-only. Open and search current source and existing proof with read-only discovery commands only. Do not run build, test, lint, format, migration, or other proof-generation or remediation commands; route missing evidence as a finding or blocker. It never edits or remediates findings and never accepts its own remediation; the parent accepts a candidate only after reopening and verifying its current anchors.
- Reviewer output is candidate evidence. Agreement, confidence, or model count never creates truth.
- Accepted corrections to source or proof invalidate affected coverage and require a new meaningful-review admission and complete-reviewer receipt against the corrected identities and fresh proof. A focused receipt alone never restores correction freshness.
- By default, keep cardinality at one complete reviewer plus one conditional focused pass. Additional focused review requires the prior caller or current human authority named above; never add standing lanes or a lifecycle ledger.
- Stop before implementation correction, PR lifecycle work, merge, release, or cache refresh.

## Completion Blockers

Do not return `ready` while the complete-reviewer receipt is `partial` or `blocked`; governing authority or plan approval is invalid; base, reviewed, diff, or proof identity is stale or missing; material obligations lack source-to-proof coverage; runtime claims lack real reachability proof; a weaker substitute is presented as the requested system; candidate findings lack parent verification; a material risk remains unresolved without its exact coverage boundary; or any accepted correction has not received fresh affected review.
