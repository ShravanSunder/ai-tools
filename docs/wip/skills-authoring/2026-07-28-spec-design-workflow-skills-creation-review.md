# Spec Design Workflow — `skills-creation` Proposal Review

Date: 2026-07-28

Status: targeted revision required; current proposal review complete

Review target: `docs/specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design-workflow.md`

Target binding:

- Repository head: `934eba93147f9e5c75ff6602959053277461aa8d`
- Proposal Git blob: `5fa9a66c6dff3d405c8bd1fa3c64386b919af165`
- Proposal SHA-256: `811e9641a3c5d05cc09881762aa8a1a440efb11810d662cd518967d53a53aaec`
- Worktree at review start: clean
- Owning workflow: `shravan-dev-workflow:skills-creation` 1.6.71
- Reviewer runtime: native Codex, OpenAI Sol `gpt-5.6-sol`, `xhigh`, fresh history, read-only

## Review Frame

Classification: evaluate a behavior-changing proposal for one new named skill, `spec-design`, owned by `shravan-dev-workflow`. Retirements and adjacent changes are accepted only where they are required cutover consumers of that one skill.

Reusable behavior: this skill helps an agent reliably turn design intent into an authoritative Specification, an integrated Program Design, and a closed review/remediation/acceptance cycle before planning.

Success definition: the workflow must teach an agent how to construct strong Why/What and integrated How artifacts, teach independent reviewers what to inspect and reject, preserve user decision authority, close every upheld finding, and prevent planning until the synchronized pair is accepted.

Authoring basis: observed failure plus user-directed intent.

- The two investigation notes establish historical authority-laundering and authority-review failures.
- Faithful RED reproduction is `insufficient evidence`: the stored notes do not preserve the full prompt, transcript, environment, and inputs required by the pressure-testing contract.
- The current proposal may be designed from the user-approved success definition, but no RED/GREEN behavior-improvement claim is available.

Surface allocation:

- Trigger: model- and user-invocable description for bare requirements and pre-plan design creation, semantic revision, review, resume, remediation, and acceptance.
- Main path: FRAMING → DRAFTING → REVIEW → GATE, with one parent author/reducer.
- Depth: Specification craft, Program Design craft, artifact formats, review-cycle shapes, and six reviewer missions.
- Proof: executable authority, integration, receipt-invalidation, recovery, and trigger scenarios plus the fast pressure suite.

## Outcome

review target: proposed `spec-design` skill contract

verdict: `targeted-revision`

blocker overrides:

- The usable main path does not require substantive teaching contracts or concrete returns from the two drafting references and five focused review references.
- The decision-authority gate is syntax-bypassable and confirms only normative `user-decision` obligations, not every load-bearing user-owned basis.
- The mandatory whole-pair reviewer cannot be dispatched under the current `manage-agents` pattern/model contract.
- The hard cutover deletes existing behavior-proof scenarios while explicitly deferring the replacements required by repository policy.

highest risk: an implementation can create the promised files and state machinery, satisfy format/ledger gates, and still fail to teach agents how to design a Specification, integrate a Program Design, or perform substantive focused review. That reproduces the exact machinery-without-craft failure this revision is meant to close.

first required revision: add a compact proposal-level teaching contract for each drafting reference and all six reviewer missions. Each contract must name the capability gained, construction questions or inspections, good and bad signals, calibration boundary, concrete result consumed by the next state, and a completion condition that rejects a reference shell with headings but no judgment.

proof or retest implication: re-review the revised proposal under all three lanes at the new digest. The implementation scope must port or replace pressure scenarios before deleting retired ones, run the named cases, include positive/negative trigger evaluation, and run `tests/skills/run-skill-pressure-tests.sh --fast` before a PR-ready claim.

implementation decision: `revise-first`

ship decision: `blocked`

## What the Current Revision Gets Right

The proposal now has the right high-level architecture:

- One parent owns synthesis, artifact authorship, reduction, and acceptance.
- Specification owns Why/What; Program Design owns How.
- `Design Overview` is explicitly the integrated end-to-end system model; headings and traceability rows alone are not treated as design.
- Review is an inner loop with remediation, receipt invalidation, refresh, and verified closure.
- Decision authority and user confirmation are first-class concerns.
- The lifecycle header, mandatory ledger, receipt scope, invalidation, and accepted-pair plan gate are substantially stronger than the earlier proposal.
- The new reference tree correctly separates craft, artifact formats, process schema, and reviewer missions.
- The implementation says to adapt the useful current craft rather than rewrite from nothing.

The teaching change is therefore directionally correct. The problem is not the tree. The problem is that the proposal still lets an implementation satisfy the tree with shallow references.

## Ranked Accepted Findings

### 1. Teaching depth is named but not contracted

Severity: blocker

Evidence:

- The proposal makes craft load-bearing at lines 42-44.
- The tree gives topical summaries to two drafting references and names six reviewer files at lines 266-291.
- Only the whole-pair reviewer receives a substantive mission in the proposal, at lines 225-235.
- The generic anatomy rule at lines 293-295 does not state the actual judgment each reference must teach.
- DRAFTING loads the references at lines 395-401 but consumes no concrete craft result.
- The implementation blocker at lines 538-539 can be satisfied by file presence.

Behavior risk: eight structurally valid reference shells can pass while agents learn no Specification craft, Program Design construction method, or focused-review judgment.

Smallest fix:

- Add one compact contract per reference.
- Drafting contracts should use authoring anatomy: inputs, construction questions, decision boundaries, output/result, good/bad examples, calibration, and completion.
- Reviewer contracts should use review anatomy: mission, where to look, how to inspect, good/bad signals, overlap boundary, calibration, finding result, and stop condition.
- Make the stage guard consume the named result.
- Make “reference exists but teaches only headings/topics” explicitly non-complete.

Retest: supply a deliberately shallow implementation with all eight files and generic headings; the contract must reject it. Supply a formally complete pair whose Why/What is weak and whose How has satisfied rows but conflicting state ownership/failure propagation; it must remain non-accepting.

### 2. Decision authority can still be laundered outside exact `MUST` wording

Severity: blocker

Evidence:

- Basis is mandatory for every normative requirement, material invariant, and traceability realization at lines 143-154.
- “Normative” is defined only as `MUST`/`MUST NOT` at line 168.
- Material non-goals and constraints receive a basis only “where they bind design choices” at line 172.
- User confirmation is limited to normative `user-decision` obligations at lines 174 and 325.

Behavior risk: `REQ-001: Support X`, an acceptance criterion, or a binding non-goal can carry user-owned meaning without exact normative wording and avoid the basis/confirmation gate. A fresh reviewer cannot authenticate a user-decision paraphrase; only the user can.

Smallest fix: require basis and source for every `REQ-*` and every material authority-bearing statement regardless of modal wording. Before acceptance, surface and confirm every load-bearing `user-decision` basis across requirements, non-goals, constraints, material invariants, and normative-force structural realizations.

Retest: repeat the four-source laundering case using `support`, `required`, an acceptance criterion, and a user-owned non-goal without `MUST`; all unauthorized branches must remain non-accepting.

### 3. The mandatory Frontier reviewer conflicts with `manage-agents`

Severity: blocker

Evidence:

- The whole-pair reviewer is mandatory at line 225.
- Every dispatch must use the real `manage-agents` contracts at line 299.
- The reviewer is specified as a Frontier/high Delegate at line 314.
- The proposal tries to grant an above-ceiling capability through a packet field/note at lines 544 and 60.
- Current `manage-agents` permits Delegate only at Balanced or Mini and makes the pattern the owner of model category.

Behavior risk: the mandatory acceptance gate has no contract-valid dispatch. A packet records a choice; it cannot override the pattern table that owns allowed choices.

Smallest fix: keep `manage-agents/SKILL.md` as the sole owner. Either add the intended Frontier one-shot reviewer category there as an explicit supported Delegate case, or select an already valid pattern/category. Remove the claim that the packet itself can raise the ceiling.

Retest: instantiate the whole-pair packet and validate its pattern, category, lineage, reasoning, fresh-history, and read-only settings against the final `manage-agents` table.

### 4. The cutover removes proof before replacement proof exists

Severity: blocker

Evidence:

- Pressure scenarios are deferred at line 63.
- Retired-skill scenarios are deleted while replacements are deferred at line 541.
- The six future claims remain follow-up work at line 551.
- `AGENTS.md` lines 77 and 186-189 require behavior-changing workflow skills to add/update pressure scenarios, exercise realistic trigger behavior, and run the fast suite.

Behavior risk: the replacement skill can advance only as an unprovable source cutover, while the existing regression surface is removed. Static structure and reviewer confidence cannot demonstrate the new behavior.

Smallest fix: put replacement scenarios and the fast pressure run inside the hard-cutover scope. Delete retired scenarios only after equivalent `spec-design` scenarios exist and pass.

Retest: the six named cases, positive/negative trigger evaluation, and the fast suite.

### 5. Bare requirements and product intent under-trigger

Severity: important

Evidence: the state chart accepts bare requirements at lines 349-353, but the proposed trigger at lines 77-84 starts from writing/revising/reviewing/resuming/accepting an already named spec/design/architecture artifact.

Behavior risk: “shape these raw requirements before planning” can route to plan creation or nowhere because it lacks the searchable spec/design-document terms.

Smallest fix: open with “turning bare requirements or product intent into” a Specification/Program Design, while retaining the accepted-pair boundary against plan creation.

### 6. Semantic design revision still collides with docs maintenance

Severity: important

Evidence: `spec-design` claims revising any spec/design at lines 77-84; the shipped `docs-maintain` description claims updating/reconciling architecture docs and existing specs. “docs housekeeping” is not a precise near-miss boundary.

Behavior risk: semantic requirement/design changes and documentation-only reconciliation both match both skills.

Smallest fix: define the negative boundary as documentation-only reconciliation, cleanup, archival, or promotion that does not change requirements or design decisions. Permit the required adjacent frontmatter cutover so `docs-maintain` stays quiet for active semantic design.

### 7. Integrated design-time threat review collides with standalone security review

Severity: important

Evidence: design-time security stays inside `spec-design` at lines 441-443, but the proposed trigger does not contain the searchable term `threat model`; the shipped `ops-security-review` description claims every threat-model request.

Behavior risk: “threat-model this pre-plan architecture and fold findings into it” can leave the closed design cycle.

Smallest fix: positively include security/threat review integrated into the design cycle; exclude standalone scans, audits, repository threat models, and finding remediation. Narrow the adjacent security trigger where required.

### 8. Receipt status has two owners

Severity: important

Evidence:

- Proposal lines 239 and 250 rename a reviewer that cannot begin to `not-started`.
- The current skills-creation lane schema, glossary, and lane-qualification contract use `blocked`.
- Alignment is deferred at lines 293 and 549.

Behavior risk: identical missing-input outcomes use different labels depending on which contract the reviewer read, and the proposed lane fails the current shaped-receipt qualification.

Smallest fix: use `complete | partial | blocked` for reviewer returns and reserve `no-receipt` for parent-recorded silence.

### 9. Tiny-form heading rules contradict the format owner

Severity: important

Evidence:

- Scaling permits tiny-form omissions without per-heading justification at line 425.
- Formats requires every omitted heading to state why it is not applicable at line 447.
- The DRAFTING guard rejects missing mandatory headings without a reason at line 401.

Behavior risk: the same tiny artifact is valid and invalid under different proposal sections.

Smallest fix: require omission reasons in tiny artifacts too; keep both security sections mandatory.

### 10. The failure-mode reviewer is mapped to the wrong teaching source

Severity: important

Evidence:

- The lane triggers on operational, concurrency, performance, and data-integrity risk at line 231.
- The source-adaptation list at line 539 leaves `validation-and-testability.md` as its apparent source.
- That source teaches proof modalities and requirement-to-proof trace, not failure containment, reversibility, concurrency, or data-integrity analysis.
- `risk-and-tradeoff-design.md` contains the relevant falsifying-scenario, failure-containment, reversibility, and hidden-assumption craft.

Behavior risk: the implementation must invent the lane’s judgment despite “adapt, do not rewrite from nothing.”

Smallest fix: explicitly map `failure-mode.md` to the relevant risk-and-tradeoff content, optionally composed with validation/testability for proof burden.

### 11. Terminal re-entry starts a review cycle at two different times

Severity: important; downgraded from the lane’s blocker rating because the current rules conservatively prevent acceptance, but recovery semantics remain contradictory.

Evidence:

- Line 119 writes `in-cycle` when the first reviewer dispatches.
- Line 405 assigns a cycle on REVIEW entry.
- Lines 264 and 420 say terminal re-entry opens/begins `c<M+1>`, including resumed DRAFTING before REVIEW.
- The header has no value for “new cycle, drafting, no dispatch.”

Behavior risk: the promised disk-recoverable state has no single owner for the next cycle id.

Smallest fix: terminal re-entry invalidates prior acceptance and requires a future fresh cycle; assign and write `c<M+1>` only on REVIEW entry before first dispatch.

## Rejected Finding

### Add pre-draft architecture option counsel

The mental-model lane proposed risk-gated pre-draft design counsel. Rejected for this proposal.

The proposal deliberately replaces fragmented option-lane synthesis with one integrating parent. The user-directed success definition makes that single integrating mind part of the target behavior. The reviewer identified a plausible anchoring tradeoff, but not evidence that the parent cannot generate alternatives or that post-draft counter-review is insufficient. Adding another creation fan-out now would reopen the exact boundary this proposal is choosing. Preserve the concern as a future pressure case, not a current workflow change.

## Parent Reduction

```text
review:
  required: yes
  kind: spec
  artifact: proposal
lanes:
- name: mental-model-fit
  status: complete
  reason: one blocker accepted; one important finding rejected
- name: trigger-routing
  status: complete
  reason: three important findings accepted
- name: rule-agreement
  status: complete
  reason: original relationship returned no receipt and was closed; fresh replacement returned a complete current-digest receipt with six accepted findings
synthesis:
  ranked findings:
  - rank: 1
    defect: teaching references can be structurally present but behaviorally empty
    severity: blocker
    lanes reporting it: mental-model-fit; parent authored-body rubric
  - rank: 2
    defect: authority remains syntax-bypassable and user confirmation is incomplete
    severity: blocker
    lanes reporting it: parent steering and blocker rubric
  - rank: 3
    defect: mandatory Frontier/high Delegate is unsupported by manage-agents
    severity: blocker
    lanes reporting it: rule-agreement
  - rank: 4
    defect: cutover deletes pressure proof while deferring replacement proof
    severity: blocker
    lanes reporting it: rule-agreement; parent proof rubric
  merged duplicates:
  - defect: substantive failure-mode teaching is missing
    merged from: teaching-depth blocker and failure-mode source-mapping finding
  lane conflicts: []
  routed findings:
  - defect: docs-maintain and ops-security-review adjacent frontmatter collisions
    owning lane: trigger-routing
    dispatched: yes
  coverage gaps:
  - no faithful RED reproduction
  - no executable behavior proof for the proposed skill
  - no different-lineage review by explicit user constraint; all reviewers used Sol xhigh
  first fix: add substantive per-reference teaching contracts and exact stage-consumed returns
  why it is first: this is the user-named load-bearing gap and the current proposal can still reproduce it
changed-file coverage:
- path: docs/specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design-workflow.md
  status: reviewed
  reason: full parent read plus three terminal current-digest proposal-lane receipts
accepted findings: 11
rejected findings: 1
unverified findings: none
smallest edits: revise the proposal only; do not implement the skill yet
targeted retest: bind the new digest, rerun all three proposal lanes, then execute the named behavior scenarios during implementation
implementation decision: revise-first
ship decision: blocked
```

## Required Revision Order

1. Specify substantive teaching contracts and concrete returns for both drafting references and all six reviewer missions.
2. Make authority semantic rather than `MUST`-syntax-bound, and confirm every load-bearing user-owned basis.
3. Resolve the Frontier reviewer through the owning `manage-agents` pattern table.
4. Bring replacement pressure scenarios into the cutover and retain proof until replacements pass.
5. Repair trigger boundaries against bare requirements, docs maintenance, and standalone security work.
6. Unify receipt labels, tiny-form omission rules, failure-mode source mapping, and review-cycle creation.
7. Rebind and rerun all three proposal lanes. Implementation starts only after a fresh parent reduction returns `great` and `accepted-to-implement`.
