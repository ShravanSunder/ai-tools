# Spec Design Workflow — `skills-creation` Proposal Review

Date: 2026-07-28

Status: targeted revision required; review coverage incomplete

Review target: `docs/specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design-workflow.md`

Target binding:

- Repository head: `f7c1ed05fc9de469d1419d83322be57adcd23aa0`
- Proposal blob: `f2ec7794d4775ba63b31ca9e8d575ffff35e1271`
- Branch/upstream divergence at review start: `0/0`
- Worktree at review start: clean

Owning workflow: `shravan-dev-workflow:skills-creation` 1.6.71

## Review Frame

Classification: evaluate a behavior-changing proposal for one new named skill, `spec-design`, owned by `shravan-dev-workflow`.

Reusable behavior: this skill helps agents reliably turn design intent into an authoritative Specification, an integrated Program Design, and a closed review/remediation/acceptance cycle before planning.

Success definition: a run must keep Why/What authority separate from How, compose How into one checkable end-to-end system model, remediate accepted findings and refresh invalidated review coverage, and prevent plan creation until the synchronized pair is accepted.

Authoring basis: observed failure plus user-directed intent. The two recorded incidents establish historical failure evidence, but this review did not reproduce executable RED or demonstrate GREEN:

- `docs/wip/skills-investigation/2026-07-16-spec-creation-swarm-unapproved-requirements.md`
- `docs/wip/skills-investigation/2026-07-16-spec-review-swarm-authority-blind-spot.md`

Surface allocation being evaluated:

- Trigger: model-invocable description for substantive spec/design creation, revision, review, resume, remediation, and acceptance.
- Main path: Specification → integrated Program Design → closed review cycle → acceptance gate.
- Depth: artifact contracts, review-cycle shapes, qualified lane contracts, and dispatch composition.
- Proof: pressure scenarios for authority laundering, unintegrated How, stale review coverage, and recovery.

## `skills-creation` Spec-Review Result

review target: proposed `spec-design` skill carried by the target document above

verdict: `targeted-revision`

blocker overrides:

- The usable main path is incomplete because the route does not make integrated Program Design a checkable exit condition.
- Decision authority applies only to normative requirements, allowing other material Why/What statements to constrain How without authority evidence.
- Proposed delegated roles and review lanes do not yet satisfy the complete lane handoff and qualification contract.
- The state-recovery guard cannot fire deterministically because artifact-only recovery conflicts with an optional `tmp` ledger.
- The synchronized status-transition verifier is internally impossible for blocked, deferred, and resume transitions because those transitions must also change `Stop reason`.
- The hard-cutover inventory does not implement the accepted-pair-only plan-entry rule it declares.
- The review-cycle packet/schema and the generic `manage-agents` packet both claim dispatch fields without a declared composition boundary.
- The proof route is deferred without a complete named scenario contract, while current retired-skill scenarios may be deleted.

rubric evidence:

- Promise: strong. One durable pre-plan design job is named, and the recorded incidents justify making it repeatable.
- Steering: needs revision. Several gates name desirable states such as “coherent” or “satisfied” without requiring the legwork that distinguishes integrated design from a completed inventory.
- Invocation: needs bounded edits. Core true prompts route, but resume is under-triggered and three adjacent boundaries remain ambiguous.
- Authored body: the state-chart spine is visible and the overall terminal outcomes are explicit, but important guards and transition checks are either incomplete or contradictory.
- Lane and shape proposals: not ready. Reviewer, section-writer, and evidence work lacks the full qualified-lane/call contract; schema composition has two possible owners.
- Ownership and cutover: not ready. The named-skill boundary is deferred without an interim trigger rule, and plan creation keeps source routes that bypass the accepted pair.
- Proof plan: honest about source-only status, but incomplete. Static review is not mislabeled as behavior proof; the required future scenarios and retention/port rule still need to be named.
- Safety/platform: no sensitive surface was edited in this review. Installed-cache refresh and home writes remain deferred shipping surfaces and require their normal platform/security route if later performed.

highest risk: the skill can accept a polished collection of correct-looking component and requirement sketches without establishing one implementable end-to-end Program Design. Planning then performs the integration the design workflow claims to own.

accepted findings: 15, ranked below

rejected findings: listed under Rejected Findings

first required revision: strengthen the existing Program Design lens and gates so one integrated system model—not section presence or per-requirement rows—is the checkable How contract.

proof or retest implication: add proposal-level proof obligations for authority laundering, cross-requirement integration contradictions, partial-scope loss, semantic receipt invalidation, and interrupted-state recovery. No PR-ready or released claim is valid until executable pressure evidence closes those obligations.

implementation decision: `revise-first`

## Accepted Findings

### 1. Program Design is an inventory, not a gated integrated system model

Severity: blocker

Evidence: target lines 23-43, 173-194, 213-221, 275-285, 348-363, and 431-475.

The proposal lists the right structural ingredients and requires a traceability row for every requirement. It does not require ownership, dependencies, sources of truth, state/lifecycle, data/control flow, concurrency, and failure propagation to compose into one mutually consistent end-to-end How. “Coherent” is not made observable.

Behavior risk: every heading and `REQ-*` row can be complete while two components claim the same state, a failure path bypasses the dependency direction, or lifecycle assumptions conflict. Planning must then invent the integration.

Smallest revision: require one integrated-system model in Program Design; make detailed sections and traceability rows attach to and agree with it; block DRAFTING, whole-pair review, and GATE on cross-requirement or intra-How contradictions.

Retest: all requirements have plausible `satisfied` rows, but two modules disagree about state ownership and failure propagation. The pair must remain non-accepting.

### 2. Decision authority covers only normative requirements

Severity: blocker

Evidence: target lines 84-95, 124-171, 213-214, and 275-285; both recorded incident reports.

The specification is authoritative for all Why and What, but basis/source and user confirmation apply only to normative `MUST`/`MUST NOT` requirements. Material goals, non-goals, constraints, success criteria, acceptance criteria, public contracts, and externally meaningful commitments can still carry an author recommendation as settled authority.

Behavior risk: the recorded authority-laundering defect moves outside `REQ-*`. A user-owned non-goal can also be contradicted by How without failing the authority gate.

Smallest revision: define an authority-bearing material-statement set across the specification, apply basis/source and non-accepting rules to it, and use the same set for mandatory review, user confirmation, and GATE.

Retest: the four-source incident scenario must reject both an unsupported product decision and a design that contradicts a user-owned non-goal, even when neither uses `MUST`.

### 3. Proposed dispatches do not satisfy the qualified-lane and call contract

Severity: blocker

Evidence: target lines 42, 213-225, 251-271, 344-361, and 481; `skills-creation` Call Grammar and `references/reference-lanes-design.md`.

The proposal names whole-pair and focused reviewers, section writers, and evidence contributors, but it creates only `review-cycle-schema.md`. It does not assign stable lane references or a complete shared dispatch contract covering lane name, packet, lane reference, prerequisites/parallel-safety, maximum and instance authority, terminal receipt, and parent reduction for every role. Section writers in particular can receive requirements and an outline but no parent-approved structural decisions, so producing How text requires making design choices.

Behavior risk: implementation must invent lane files, mission boundaries, and receipt contracts. A section writer may silently become a design author, violating the one-integrating-parent lens.

Smallest revision: define one named dispatch contract and the minimal lane-reference set. Section-writer packets must contain the already-decided structural claims they may express; undecided structure returns as a gap, never artifact prose.

Retest: give a section writer one requirement with two viable ownership boundaries. Without a parent-selected boundary, it must return a gap rather than choosing one.

### 4. Current state is not recoverable under the declared storage rules

Severity: blocker

Evidence: target lines 40-43, 117-122, 236-251, 299-301, and 354-371.

The proposal says every guard is readable from artifacts alone and the current state is always recoverable from disk. Review/reduction state lives in a `tmp` ledger that exists only “when persisted.” A draft pair without that ledger cannot distinguish DRAFTING, REDUCE, REMEDIATE, REFRESH, or gate-ready state.

Behavior risk: a resumed agent may skip invalidated review, duplicate work, or accept with unresolved findings.

Smallest revision: choose one recovery contract. Prefer keeping terminal design authority in the pair and requiring deterministic fresh-review recovery when a valid revision-bound ledger is absent; if in-cycle resume is promised, make the ledger mandatory and define its checkpoints and stale-ledger rule.

Retest: interrupt every state and REVIEW sub-state, remove or stale the ledger, and require exactly one safe next transition without crediting unprovable coverage.

### 5. The status-only verification rule cannot pass non-accepting or resume transitions

Severity: blocker

Evidence: target lines 111-115, 273-293, 335-339, 365-371.

Every synchronized status write must verify that only the two status fields changed. `blocked` and `deferred` must also add `Stop reason` to both artifacts, and resume must remove it.

Behavior risk: following the transition contract literally makes decision-needed, blocked, deferred, and resume impossible to verify.

Smallest revision: define a lifecycle-metadata-only transition and enumerate the allowed field delta for each edge: status fields plus required `Stop reason` additions/removals, with content revision unchanged.

Retest: exercise accept, decision-needed, blocked, deferred, and resume edges; each must have one exact allowed metadata delta.

### 6. The change inventory does not enforce the accepted-pair-only plan gate

Severity: blocker

Evidence: target lines 47-54, 188-194, 295-297, 479-492; current `plan-creation-swarm/SKILL.md` lines 3 and 40-44.

The proposal says plan creation rejects anything except an accepted synchronized pair. The implementation inventory says adjacent shipped wording remains unchanged except dangling retired-skill references. Current plan creation still accepts a product requirement, chat decision, or architecture docs.

Behavior risk: implementation can complete the listed cutover while plan creation continues bypassing `spec-design`.

Smallest revision: explicitly include the plan-entry source contract and trigger/body validation in the hard cutover, or narrow the claimed universal plan gate. One owner must state the rule and every plan entry must cite it.

Retest: bare requirements, a chat decision, or an unpaired design must route to `spec-design`; only an accepted pair may proceed to planning.

### 7. Review-cycle and generic dispatch packets have no composition boundary

Severity: blocker

Evidence: target lines 223-255, 481, and 485; current `manage-agents/references/agent-job-packet.md` lines 6-27 and 50-58.

`review-cycle-schema.md` owns the review packet, receipt, finding, and reduction record. Every call must also use the generic agent-job packet and result/reduction shapes. The proposal does not say whether the workflow packet is nested, referenced, or mapped, or which owner controls duplicated version, scope, receipt, and reduction fields.

Behavior risk: implementation creates two competing envelopes or bypasses one owner; receipt validity then varies by caller.

Smallest revision: declare the generic agent job/result as the outer runtime envelope and the spec-design review packet/finding/remediation data as the workflow payload, with an explicit field mapping and one owner per field.

Retest: instantiate one reviewer, section-writer, and evidence call. Every field must have one owner and an explicit nesting/reference relationship.

### 8. Narrowing a partial receipt can discard required risk coverage

Severity: important

Evidence: target lines 196-225, 240-249, 284-285, and 354-363.

A `partial` receipt credits none of its declared scope, but the parent may “re-dispatch the lane or narrow the packet.” No invariant preserves the uncovered remainder of the predicate-required original scope. GATE checks whatever remains selected.

Behavior risk: difficult review scope can be narrowed away until a small complete receipt exists.

Smallest revision: preserve the original predicate-required scope. Narrowing may partition it, but complete successor receipts must cover its union or GATE must stop non-accepting.

Retest: a three-scope required review returns partial after one scope. Acceptance must remain impossible until the other two are covered or explicitly block/defer the pair.

### 9. Material `CLAIM-*` and `INV-*` edits can evade whole-pair invalidation

Severity: important

Evidence: target lines 128-163 and 240-249.

The whole-pair receipt declares the identifier inventory in scope, but the category rule—not normal declared-scope invalidation—governs it. That category names requirement, basis, public contract, ownership, source-of-truth, and main-flow changes, but not material claim or invariant changes.

Behavior risk: remediation can change a load-bearing claim or invariant without requiring refreshed whole-pair review.

Smallest revision: include material `CLAIM-*` and `INV-*`, their provenance, and their cross-artifact realization in the whole-pair invalidation categories.

Retest: semantically change one material claim and one material invariant; both must invalidate the whole-pair receipt.

### 10. Named-skill design has two model-invocable owners during the deferred interval

Severity: important

Evidence: target lines 47, 56-60, 73-82, and 488-490; current `skills-creation/SKILL.md` line 3.

The proposed trigger claims writing and reviewing a design before planning, while current `skills-creation` claims creating, updating, or evaluating one named skill or accepted draft. The named-skill routing integration is deferred.

Behavior risk: named-skill proposals can bypass `skills-creation` or run two proposal reviews.

Smallest revision: add an interim frontmatter boundary excluding named-skill creation/update/evaluation; the future `skills-creation` change can explicitly call `spec-design` when that contract is implemented.

Retest: named-skill design routes to `skills-creation`; product/system design routes to `spec-design`.

### 11. Resume is a first-class workflow branch but is absent from the trigger

Severity: important

Evidence: target lines 73-82, 249, and 335-371.

The body repeatedly uses “resume” for accepted, blocked, and deferred pairs; the always-loaded description relies on the model inferring that revising or converging includes resume.

Smallest revision: add `resuming` to the positive trigger verbs.

Retest: blocked, deferred, and accepted-pair resume prompts route to `spec-design`; packaging-only prompts remain `spec-handoff`.

### 12. Maintenance-only spec work is not excluded by the trigger

Severity: important

Evidence: target lines 73-82 and 373-378; current `docs-maintain/SKILL.md` line 3.

The future trigger claims revision/review of existing specs while `docs-maintain` claims auditing, reconciling, archiving, and maintaining existing spec artifacts.

Behavior risk: archival or mechanical reconciliation can reopen the design cycle.

Smallest revision: add `documentation maintenance that does not change design` to the negative trigger boundary. This does not redesign `docs-maintain`.

Retest: reconcile/archive without design change routes to `docs-maintain`; changing requirements or ownership routes to `spec-design`.

### 13. Standalone security-finding remediation is not excluded by the trigger

Severity: important

Evidence: target lines 73-82 and 390-392; current `ops-security-review/SKILL.md` line 3.

The positive trigger includes remediation but excludes only standalone security review. The adjacent owner also claims remediation of one security finding.

Smallest revision: exclude `standalone security review or security-finding remediation`; keep remediation of integrated design-review findings inside `spec-design`.

Retest: standalone findings route to `ops-security-review`; findings produced inside the design cycle remain in `spec-design`.

### 14. Artifact-format depth has no explicit reference owner or caller contract

Severity: important

Evidence: target lines 84-177, 394-475, and 481; `skills-creation` Progressive Disclosure and `references/reference-design.md`.

The proposal defines substantial all-run artifact formats, authority forms, lifecycle metadata, and traceability forms, but the implementation names only `review-cycle-schema.md`. Implementers must either inline this depth into `SKILL.md` or overload a process-record schema.

Behavior risk: the main path becomes unscannable or one reference owns unrelated artifact and process shapes.

Smallest revision: assign artifact forms to one coherent mandatory artifact-contract reference with a literal caller/return contract, while keeping the mental model, state spine, guards, invariants, and completion boundary visible in `SKILL.md`.

Retest: placement inventory gives each rule/shape exactly one home and the resulting body exposes FRAMING → DRAFTING → REVIEW → GATE in one scan.

### 15. The deferred proof plan does not preserve or name the required regression contract

Severity: important

Evidence: target lines 56-63 and 477-492; both incident reports; `skills-creation/references/testing/pressure-testing.md`.

The hard cutover allows retired-skill pressure scenarios to be deleted or ported in the same changeset, while pressure scenarios are explicitly deferred. The proposal blocks PR-ready/released status but does not name the behavior claims, scenario ownership, or replacement-before-deletion rule that closes the gate.

Behavior risk: source-only cutover deletes the only concrete regression cases, and later work must reconstruct the proof contract.

Smallest revision: preserve applicable scenarios until replacements exist and name the required future cases: authority/non-goal laundering, unintegrated How, partial-scope loss, stale receipt after remediation, and state recovery. Record the expected behavior and PR-ready closure condition without implementing the scenarios here.

Retest: the implementation plan maps every named behavior claim to a retained or future scenario and refuses PR-ready while any required case is open.

## Trigger-Route Decisions

These findings do not expand the design into adjacent workflow redesigns. Each requires only an always-loaded `spec-design` boundary:

- `skills-creation` remains the interim entry owner for named-skill work.
- `docs-maintain` remains the owner for maintenance-only artifact work.
- `ops-security-review` remains the owner for standalone security review/finding remediation.
- `spec-handoff` remains the owner for portability without continuing design.

## Rejected Findings

- Redesign `docs-maintain`, `plan-improve-repo`, or other adjacent workflows: rejected as outside the user-approved focus. Only trigger/call-edge boundaries needed to prevent misrouting are in scope.
- Treat plain file digests as cryptographic proof that a parent accepted the pair: rejected. The proposal explicitly limits them to freshness/edit detection and excludes cryptographic acceptance receipts. The remaining authority defects are addressed at the material-statement and acceptance-gate level.
- Recreate all of `skills-creation` in this proposal: rejected. The follow-up remains deferred; only an interim single-owner trigger boundary is required now.
- Redesign `manage-agents`: rejected. It remains the generic runtime envelope. The issue is only to declare how the workflow-specific payload composes with it.
- Add implementation tasks, command sequences, or execution DAGs to Program Design: rejected. Integrated How is a system contract, not an implementation plan.

## Unverified Findings and Coverage Gaps

- `rule-agreement` did not produce a current terminal receipt. Its first attempt returned `blocked` before reading sources because the session exhausted OS file descriptors. The retry completed every mandatory source read and claim inventory but did not return a receipt after repeated bounded requests; it is recorded as `no-receipt` and contributes no accepted lane finding.
- The parent independently verified the directly cited contradictions in findings 4-7 and 15 against current source. They are parent rubric findings, not credited to the incomplete lane.
- No different-lineage reviewer was obtained. The two completed lane receipts are native OpenAI reviewers.
- No executable pressure scenario was run. Behavior proof remains a named gap.
- Earlier outputs produced under the incorrectly selected `spec-review-swarm` workflow were discarded and are not evidence for this report.

## Parent Reduction

```text
review:
  required: yes
  kind: spec
  artifact: proposal
lanes:
- name: mental-model-fit
  status: complete
  reason: three accepted findings
- name: trigger-routing
  status: complete
  reason: four accepted findings
- name: rule-agreement
  status: no-receipt
  reason: source reads completed on retry, but no terminal receipt returned
synthesis:
  ranked findings:
  - rank: 1
    defect: Program Design lacks an integrated-system gate
    severity: blocker
    lanes reporting it: mental-model-fit
    evidence: target lines 23-43, 173-194, 213-221, 275-285, 348-363, 431-475
  - rank: 2
    defect: authority applies only to normative requirements
    severity: blocker
    lanes reporting it: mental-model-fit
    evidence: target lines 84-95, 124-171, 213-214, 275-285; incident reports
  - rank: 3
    defect: dispatches are not qualified or fully callable
    severity: blocker
    lanes reporting it: parent spec rubric
    evidence: target lines 42, 213-225, 251-271, 344-361, 481
  - rank: 4
    defect: workflow recovery conflicts with optional tmp state
    severity: blocker
    lanes reporting it: parent spec rubric
    evidence: target lines 40-43, 117-122, 299-301, 354-371
  - rank: 5
    defect: lifecycle transition verifier excludes required Stop reason changes
    severity: blocker
    lanes reporting it: parent spec rubric
    evidence: target lines 111-115, 273-293, 335-371
  merged duplicates:
  - defect: integrated How is not load-bearing
    merged from: mental-model-fit receipt and parent authored-body rubric
  lane conflicts: []
  routed findings:
  - defect: trigger boundaries against adjacent owners
    owning lane: trigger-routing
    dispatched: yes
  coverage gaps:
  - rule-agreement has no current terminal receipt
  - no different-lineage review
  - no executable behavior proof
  first fix: make integrated Program Design a checkable end-to-end system contract across the lens, DRAFTING guard, mandatory review, and GATE
  why it is first: it is the user-identified load-bearing outcome and currently allows planning to invent How
changed-file coverage:
- path: docs/specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design-workflow.md
  status: reviewed
  reason: complete parent read plus two complete skills-creation proposal-lane receipts; rule-agreement coverage remains open
accepted findings: 15
rejected findings: 5
unverified findings: rule-agreement lane-specific candidates, if any
smallest edits: revise the proposal only after explicit authorization; do not implement the skill yet
targeted retest: rerun all three proposal lanes after remediation, then execute the named pressure scenarios before PR-ready
implementation decision: revise-first
ship decision: blocked
```

## Next Review Boundary

The proposal should be remediated without editing implementation surfaces. After remediation:

1. Rebind to the new proposal blob.
2. Rerun all three `skills-creation` proposal lanes; every lane needs a terminal receipt.
3. Parent-verify and reduce the new findings.
4. Proceed to implementation only if the verdict becomes `great` and the implementation decision becomes `accepted-to-implement`.
