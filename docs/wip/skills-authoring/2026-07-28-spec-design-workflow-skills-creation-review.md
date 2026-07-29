# Spec Design Workflow — `skills-creation` Proposal Re-review

Date: 2026-07-28

Status: targeted revision required; current-digest review complete

Review target: `docs/specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design-workflow.md`

## Target Binding

- Repository head: `48b5206d441f8a559e0b45d8617657be0fc3e9d7`
- Proposal Git blob: `260e0137bb55ee76416715e5536aad6ff33802c9`
- Proposal SHA-256: `f2ccbf22cf5166d5ae9c91db7df051434c65af08bd5f047d5d61616f817719d4`
- Proposal length: 746 lines
- Owning workflow: `shravan-dev-workflow:skills-creation`
- Agent coordination: `shravan-dev-workflow:manage-agents`
- Reviewer runtime: native Codex, OpenAI Sol `gpt-5.6-sol`, `xhigh`, fresh history, read-only
- Stale-review rule: every receipt bound to the former 553-line `811e…` proposal was discarded

## Direct Answer

The updated proposal no longer has the original “machinery with no craft” failure.

It now contains substantive, usable teaching:

- specification authoring at lines 185–245: decision interviewing, decomposition, outcome-to-requirement order, EARS forms, vague-verb repair, stranger test, requirement/task separation, non-goal craft, contract fields, edge cases, and tradeoffs;
- program-design authoring at lines 255–277: integrated overview first, current-system grounding, alternatives, deep modules, ownership/source-of-truth interrogation, caller-first interfaces, falsifying probes, failure containment, and proof seams;
- pair review at lines 326–344: dependency-order reading, end-to-end trace, authority audit, crux inversion, cross-requirement integration, planning readiness, finding quality, and parent-side reviewer hygiene.

That is real spec design, program design, and review teaching. The remaining failure is not absence. It is that the proposal does not yet make all of that teaching retrievable, recoverable, independently rechecked, and internally consistent under the skill-authoring contract.

## Review Frame

Classification: evaluate one behavior-changing proposal for the named `spec-design` skill.

Reusable behavior: reliably turn bare requirements or product intent into an authoritative Specification, an integrated Program Design, and a closed review/remediation/acceptance cycle before planning.

Success definition: an agent must know how to construct strong Why/What and integrated How artifacts, independent reviewers must know what to inspect and reject, every craft pass must have a recoverable result, and no acceptance path may depend on guessing or an impossible predicate.

Authoring basis: user-directed intent informed by recorded authority-laundering and review failures.

Surface allocation:

- trigger: bare requirements, semantic design work, in-cycle review/remediation, and precise adjacent-skill boundaries;
- main path: FRAMING → DRAFTING → REVIEW → GATE;
- depth: drafting craft, common pair-review craft, artifact formats, lifecycle schema, and lane-specific judgment;
- proof: pressure scenarios plus trigger evaluation and the repository fast suite.

## Outcome

review target: proposed `spec-design` skill contract

verdict: `targeted-revision`

blocker overrides:

- The DRAFTING guard consumes craft results that have no owned, revision-bound disk record, so the state is not recoverable as promised.
- The common pair-review method has no single reference owner or mandatory call, while the lane contracts do not yet contain the full judgment anatomy the proposal promises.
- The future reference and Delegate call sites do not satisfy the literal `skills-creation` call/dispatch grammar.
- A first-ever design cannot satisfy the instruction to improve on its predecessor.
- A code-constrained program design cannot simultaneously obey the file-path ban and the mandatory source-anchor contract.

highest risk: the implementation can contain excellent craft prose yet fail to load it in the right agent, fail to preserve its pass results across interruption, or block a valid first design at acceptance. That is a retrieval-and-contract version of the same failure the rewrite is meant to prevent.

first required revision: make the craft executable as one contract: give common review craft one owner, add literal load/dispatch calls and concrete returns, give DRAFTING checks a revision-bound process record, and make the mandatory whole-pair reviewer independently repeat both drafting-quality checks.

proof or retest implication: re-review the revised proposal at a new digest; then pressure-test a shallow-but-formally-complete pair, a first-ever design, an interrupted post-DRAFTING pair, a code-constrained structural choice, an unmapped section-writer decision, and both adjacent trigger pairs.

implementation decision: `revise-first`

ship decision: `blocked`

## Ranked Accepted Findings

### 1. DRAFTING craft results have no recoverable record

Severity: blocker

Evidence:

- Lines 43–44 require guards to be observable and state recoverable from disk.
- Lines 416–418 define the requirement-quality pass and open-decision list.
- Lines 430–433 define the integration pass and assumption list.
- Line 594 requires those results to be recorded before REVIEW.
- The artifact formats at lines 640–725 contain no record for them.
- The mandatory ledger begins only with the first reviewer dispatch at lines 132 and 598, after DRAFTING must already have passed.

Behavior risk: after an interruption, a fresh parent cannot determine whether the pair passed DRAFTING without transcript memory, an invented storage location, or rerunning an undefined pass.

Smallest fix: create the mandatory process ledger when the pair lifecycle begins, not at first reviewer dispatch, and let `review-cycle-schema.md` own a revision-bound drafting-check record containing requirement-quality status, integration status, open-decision identifiers, assumption identifiers/dispositions, evidence anchors, and remaining failures. Keep process receipts out of the design artifacts.

Retest: give a fresh agent only the pair and ledger immediately after DRAFTING. It must determine whether REVIEW entry is permitted and name every unresolved decision or assumption.

### 2. Common review craft has no owner or mandatory retrieval path

Severity: blocker

Evidence:

- Lines 326–342 contain the common review method.
- The reference tree at lines 375–400 has drafting references, schemas, and lane missions, but no common review-craft reference.
- Line 324 says each reviewer loads a lane mission.
- Line 404 says the three `How to` sections are lifted “into the references” without naming which reference owns the common review section.
- `skills-creation` requires one owner, an exact load destination, and a concrete returned result.

Behavior risk: focused reviewers can load only their lane-specific mission and never receive dependency-order reading, authority audit, crux inversion, integration checking, planning-readiness calibration, or finding-quality rules. Copying the common section into six lanes avoids omission but creates six drifting owners.

Smallest fix: add `references/reviewing-pair.md` as the sole owner of lines 326–344. The reviewer dispatch contract must require every reviewer to load it and return its common review result before applying the selected lane mission.

Retest: dispatch only `contract-review` and prove the reviewer still applies dependency order, authority audit, integration, and planning readiness before its contract-specific inspection.

### 3. The promised teaching anatomy is still incomplete at the lane boundary

Severity: important; blocker override because incomplete branch-critical depth cannot be accepted to implement

Evidence:

- Line 404 requires every reference to contain mission, where to look, how to inspect, good/bad signals, overlap, calibration, and stop condition, and says implementation must not re-derive them.
- Lines 407–436 give drafting references capability, topics, results, and calibration, but not the complete promised anatomy.
- Lines 438–484 give focused lanes mostly mission, inspection nouns, and finding result; lane-specific good/bad signals, overlap, calibration, and stop conditions are absent.
- The whole-pair contract at lines 438–443 does not explicitly consume and independently repeat the requirement-quality and integration passes even though it is the only reviewer for small pairs.

Behavior risk: the implementer must invent judgment the proposal calls authoritative. A small pair can receive authority/traceability/coherence review while vague requirements or a shallow integrated design remain only author self-checks.

Smallest fix: fill every promised anatomy slot for all eight references in the proposal, and require `whole-pair-integrity` to independently repeat both drafting-quality passes. Keep generic review mechanics in `reviewing-pair.md`; keep only domain-specific judgment in each lane.

Retest: use a pair with complete identifiers, bases, and traceability, but one vague requirement and contradictory state ownership. The mandatory reviewer alone must find both.

### 4. Future skill calls do not use the required literal grammar

Severity: important; blocker override because incomplete calls are an explicit `skills-creation` completion blocker

Evidence:

- Lines 590–594 say the parent “loads” drafting references; the concrete results appear later in the guard rather than in actionable call forms.
- Section-writer packets merely “cite” those references at line 590.
- `artifact-formats.md` and `review-cycle-schema.md` are only “cited” at lines 402 and 640.
- `skills-creation` requires `MUST load <reference> and return <result>` or a complete lane-handoff contract.

Behavior risk: excellent reference files can exist without the parent or subagent reliably opening them or returning the result the next guard consumes.

Smallest fix: add an implementation call-contract block with exact `MUST load` calls and concrete results for `artifact-formats.md`, both drafting references, `reviewing-pair.md`, and `review-cycle-schema.md`; require section writers to load the applicable drafting reference.

Retest: one parent-drafting prompt and one section-writer prompt must both show the required reference opened and its named result returned before the guard.

### 5. First-design acceptance is unreachable

Severity: blocker

Evidence:

- Lines 48–55 and the FRAMING entry at lines 542–584 make this the general entry point for bare requirements and first designs.
- Line 342 says to accept only when the pair “definitely improves on its predecessor” and every gate criterion holds.
- A first design has no predecessor.

Behavior risk: a greenfield pair cannot be accepted without inventing a comparison baseline.

Smallest fix: replace the sentence with: “Where a predecessor exists, require a definite improvement; otherwise require the pair to satisfy every acceptance criterion against current evidence and constraints.”

Retest: one first-design scenario and one revision-of-existing-design scenario must both have deterministic acceptance predicates.

### 6. The program-design path ban contradicts provenance requirements

Severity: blocker

Evidence:

- Lines 146–177 require basis and named source anchors in both artifacts.
- Line 261 requires grounding against current systems.
- Line 275 bans file paths in the program design.
- Lines 713–720 require each structural realization to carry a source such as a code path.

Behavior risk: for a code-constrained structural choice, the author must violate either the path ban or the authority/provenance contract.

Smallest fix: ban task-oriented file inventories and incidental implementation paths, not evidentiary anchors. Explicitly allow paths required by basis and traceability.

Retest: a `code-constraint` structural realization must satisfy both the grounding and content-placement rules without an inferred exception.

### 7. Section-writer and evidence Delegate contracts are incomplete

Severity: blocker

Evidence:

- Line 42 declares exactly two fan-out concerns: section text and review skepticism.
- Lines 491–507 define section-writer and evidence Delegates.
- Those definitions provide no lane-reference path, parallel-safety basis, or shaped terminal receipt; the generic agent job packet does not provide the missing lane-reference or parallel-safety fields.
- Evidence dispatch is also a third fan-out concern under the literal statement at line 42.
- `skills-creation` requires every dispatch to fill or cite the full lane-handoff contract.

Behavior risk: the implementation cannot qualify these dispatches consistently, and agents can disagree about prerequisites, authority, completion, and whether evidence fan-out is even permitted.

Smallest fix: either keep evidence work parent-owned or change line 42 to distinguish evidence lookup from the two artifact-producing/judgment fan-outs. Define and cite complete dispatch contracts for section writers and evidence contributors: predicate, packet, lane reference, prerequisites/parallel-safety, maximum and instance authority, terminal receipt, stop condition, and parent reduction.

Retest: validate one section-writer and one evidence dispatch against every lane-handoff slot and all lane-qualification properties.

### 8. Section writers can still originate semantic decisions

Severity: important

Evidence:

- Lines 42 and 52 make the parent the sole author and decision integrator.
- Lines 171–177 show that obligations, material invariants, non-goals, constraints, and structural realizations can carry authority.
- Line 505 forbids section writers from minting only `REQ-*`, basis, status, and revision values; it does not forbid new `CLAIM-*`, `INV-*`, structural realizations, option selections, failure policies, or normative-force prose.

Behavior risk: a writer can introduce a decision as fluent candidate prose, and the parent can integrate it without recognizing that it was absent from the packet. That recreates authority laundering inside the boundary intended to prevent it.

Smallest fix: require every semantic sentence to map to packet-supplied identifiers or parent-decided claims. Explicitly forbid originating requirements, claims, invariants, structural realizations, option selections, failure policies, bases, or normative-force statements; return unmapped needs as gaps.

Retest: omit retry policy from a writer packet. The writer must return a gap, not invent an invariant or realization, and parent integration must reject unmapped normative prose.

### 9. Reciprocal trigger boundaries are optional and scope wording disagrees

Severity: important

Evidence:

- Lines 77–87 assign semantic revision and in-cycle threat modeling to `spec-design`.
- The shipped `docs-maintain` description still claims updating architecture docs and existing spec artifacts.
- The shipped `ops-security-review` description still claims every threat-model request.
- Line 60 says adjacent triggers keep shipped wording.
- Line 734 says those descriptions “may” receive mirrored boundaries.

Behavior risk: semantic spec revision can route to docs maintenance and integrated design threat review can route to standalone security review, splitting the closed cycle. The implementer also has contradictory permission about whether those trigger edits are in scope.

Smallest fix: name the two reciprocal frontmatter edits as mandatory, explicit exceptions in Non-goals and Changes; retain the ban on broader adjacent-trigger redesign.

Retest: semantic revision versus typo/archive cleanup, and in-cycle threat review versus standalone repository threat modeling/security audit.

### 10. Admired-source provenance maintenance is omitted

Severity: important

Evidence:

- Lines 245, 277, and 344 cite external and admired-source inputs.
- Lines 731–732 materially remap those inputs into new drafting and review references.
- Line 738 names plugin documentation, changelog, manifests, and metadata, but not the paired admired-source provenance update.
- `AGENTS.md` requires path-level mappings, pins, and bump notes in `ai-dev-skills`, with the lite catalog refreshed only when the high-level story changes.

Behavior risk: implementation can ship with stale provenance, hiding what was adapted and making future upstream comparisons unreliable.

Smallest fix: add the required `ai-dev-skills` mapping/pin/bump-note update to Changes, plus an explicit decision on whether the lite catalog needs refreshing.

Retest: every new adapted reference has a current path-level provenance entry and a recorded lite-catalog decision.

## Findings Rejected or Not Reopened

### “The proposal still contains no teaching”

Rejected for the current digest. Lines 185–277 and 326–344 are substantive craft. The problem is ownership, retrieval, pass recording, and incomplete lane-specific anatomy—not total absence.

### Reviewer consensus contradicts evidence primacy

Rejected. Line 342 treats agreement as a confidence signal; lines 352–361 still require source verification and explicitly prohibit reviewer count or apparent consensus from determining acceptance. Whether the confidence calibration is ideal is not a rule-agreement contradiction.

### Reintroduce a pre-draft architecture-option swarm

Rejected. The proposal deliberately chooses one integrating parent, and line 263 already requires that parent to design load-bearing choices twice. No current evidence proves a new creation fan-out is necessary; adding one would reopen the chosen ownership boundary.

### Bare requirements must route directly instead of through plan creation

Not reopened. The new description explicitly names bare requirements at lines 77–78, and line 736 deliberately makes plan creation a first-hop router that sends unpaired requirements back to `spec-design`.

## Prior Review Defects Confirmed Fixed

The current digest resolves the stale review’s following defects:

- bare requirements and product intent now appear in the proposed trigger;
- semantic revision and integrated threat review now have positive/negative boundaries in the proposed trigger;
- authority applies regardless of modal wording and user-owned bases are confirmed at the gate;
- `blocked` and `no-receipt` now match the current lane vocabulary;
- REVIEW entry is the single owner of cycle assignment;
- tiny artifacts use the same omission-reason rule as Formats;
- failure-mode review now maps to risk/tradeoff craft composed with proof burden;
- Frontier reviewer capability is added at the `manage-agents` pattern owner rather than through a packet override;
- replacement pressure scenarios and the fast suite are inside the hard cutover and replacement-first rule.

## Parent Reduction

```text
review:
  required: yes
  kind: spec
  artifact: proposal
lanes:
- name: mental-model-fit
  status: complete
  reason: current 746-line digest verified; fit, priors, cost, and coverage inspected
- name: trigger-routing
  status: complete
  reason: current digest verified; adjacent frontmatter and true/near-miss prompts inspected
- name: rule-agreement
  status: complete
  reason: current digest verified by the terminal replacement; two earlier silent attempts were not credited
synthesis:
  merged duplicates:
  - common review owner + incomplete teaching anatomy + literal call grammar
  - incomplete Delegate qualification + section-writer authority leakage
  lane conflicts:
  - subject: consensus language
    positions: candidate contradiction versus confidence-only signal
    reading the artifact supports: confidence-only signal; evidence remains authoritative
    what would settle it: no change required for rule agreement
  coverage gaps:
  - none in the selected proposal-review lanes
  first fix: make the drafting and common-review craft results owned, retrievable, and revision-bound
changed-file coverage:
- path: docs/specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design-workflow.md
  status: reviewed
  reason: all 746 lines read by the parent and full-artifact lanes; current digest verified by every credited lane
implementation decision: revise-first
ship decision: blocked
```

## Reviewer Receipts

All credited receipts are bound to SHA-256 `f2ccbf22cf5166d5ae9c91db7df051434c65af08bd5f047d5d61616f817719d4`, 746 lines.

- `mental-model-fit`: complete; OpenAI Sol `gpt-5.6-sol`, `xhigh`, fresh history, read-only.
- `trigger-routing`: complete; OpenAI Sol `gpt-5.6-sol`, `xhigh`, fresh history, read-only.
- `rule-agreement`: complete terminal replacement; OpenAI Sol `gpt-5.6-sol`, `xhigh`, fresh history, read-only.
- Two non-terminal rule-agreement attempts were interrupted and credited with no coverage or findings.

## Required Re-review

After revision:

1. compute and record the new head, blob, SHA-256, and line count;
2. dispatch fresh-history Sol `xhigh` `mental-model-fit`, `trigger-routing`, and `rule-agreement` lanes;
3. reject any receipt bound to the current digest;
4. parent-verify every finding against the revised proposal and owning source;
5. do not start skill implementation until the reduced verdict is `great` / `accepted-to-implement` or the user explicitly skips the remaining spec review.
