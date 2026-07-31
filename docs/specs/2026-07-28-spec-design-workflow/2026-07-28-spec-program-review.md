# Specification and Program Design Review Skill Specification

Date: 2026-07-28

Status: accepted-to-implement after the 2026-07-30 naming correction

Target runtime skill: `spec-program-review`

Workflow contract: [`spec and program design workflow`](./2026-07-28-spec-design-workflow.md)

Reviews artifacts produced by: [`spec-design`](./2026-07-28-spec-design.md) and [`program-design`](./2026-07-28-program-design.md)

## Decision

Create `spec-program-review` as an independently invocable read-only classification and review skill. It has one review-requirement classification entry plus three review modes:

```text
specification-only
program-only
pair
```

It owns the digest-bound predicate that decides whether local independent review is required, the common review method, local specification and program-design review craft, whole-pair integrity review, predicate-selected focused review lanes, finding quality, coverage, and readiness verdicts.

It never edits artifacts, runs remediation, mutates caller-owned workflow state, or accepts a pair. The composing caller owns lifecycle and acceptance; `spec-design` and `program-design` own semantic corrections.

## Success Definition

Given exact artifact identities/digests and governing sources, the skill either returns a total digest-bound local-review-requirement classification or, for an invoked review mode, a coverage-bound independent verdict that identifies whether Why/What is authoritative and testable, whether How is coherent and feasible, whether the pair traces and integrates without contradiction, what the next planner would otherwise have to invent, and the smallest correction routed to the proper semantic owner.

No clean verdict may be inferred from reviewer silence, partial reading, stale artifact coverage, author self-check, or focused lanes that did not inspect the whole required scope.

## Mental Model

Classification is a deterministic preflight over exact scope and risk predicates; it is not review. Review is adversarial model reconstruction, not proofreading.

The reviewer treats each artifact as a set of claims and independently reconstructs:

```text
authority and intent
  -> obligations and observable contracts
  -> components, owners, interfaces, states, and flows
  -> failure/security/reliability behavior
  -> proof modalities and seams
  -> planning readiness
```

Then the reviewer attacks the crux: what assumption, inversion, interleaving, missing owner, or ambiguous contract would cause two competent implementers to build different systems or a planner to invent design?

Review independence means fresh context, read-only authority, and source-backed judgment. It does not mean ignorance of the governing specification or current sources.

## Scope

The skill owns:

- digest-bound local-review-requirement classification without reviewer dispatch;
- exact target/coverage binding and whole-artifact reading;
- common claim extraction and authority audit;
- independent specification-quality review;
- independent program-design-quality review;
- whole-pair traceability, contradiction, integration, and planning-readiness review;
- crux inversion and divergent-implementer probes;
- predicate-selected focused reviews;
- source-anchored findings, severity, route, and validation note;
- candidate finding verification, deduplication, conflicts, and review verdict;
- correction-verification requirements and receipt freshness.

It does not own:

- artifact authorship or edits;
- deciding unresolved product choices;
- lifecycle state, invalidation application, remediation tracking, or final acceptance;
- implementation planning or proof execution;
- generic model/runtime/session/permission mechanics.

## Trigger Surface

Invocation capability: model-invocable and user-invocable.

Proposed trigger description:

```yaml
name: spec-program-review
description: Use when classifying whether independent specification-only or program-only review is required for exact artifact digests, or when independently reviewing a specification, a program design, or their pair before planning or acceptance, especially for authority, requirements, architecture, failure, traceability, crux, or planning-readiness gaps. Classification or review only; not for editing artifacts, lifecycle remediation, pair acceptance, a standalone security scan, security audit, or threat model, authoring or evaluating a runtime skill package—its trigger, main path, references, lanes, scripts, steering, platform mechanics, or behavior proof—or an explicitly requested legacy spec-review-swarm run.
```

True prompts include “review this spec,” “challenge this architecture,” “is this pair ready for planning,” “do a fresh design review,” and local-review calls from the authoring skills.

Near misses:

- authoring or revising Why/What routes to `spec-design`;
- authoring or revising How routes to `program-design`;
- closed remediation and acceptance stay with the composing caller;
- plan review routes to plan review after a plan exists;
- implementation review routes to implementation review.
- standalone security scans, security audits, and threat models route to `ops-security-review`; security concerns inside a broader specification/program-design review remain in this skill's qualified security/trust lane.

## Independently Invocable Contract

### Inputs

Required in every mode:

- review mode;
- exact artifact path/identity and digest for each target;
- governing source standards and authority sources;
- user constraints/non-goals;
- known risk predicates;
- proof evidence or proof gaps claimed by the author;
- requested review question if narrower than readiness.

These are review-invocation inputs. The separate review-requirement classification entry below has its own smaller callable contract and does not select a review mode or dispatch a reviewer.

Additional requirements:

- `program-only` requires the governing specification identity/digest;
- `pair` requires current specification and program-design artifacts and normally their author/local results;
- missing local results do not authorize a pair-ready verdict unless the pair reviewer independently repeats the missing local checks and records that complete coverage; the review may still report bounded evidence and exact missing prerequisites.

### Review-mode outputs

Every review-mode result contains:

```text
mode and exact covered digests
immutable governing-source coverage identity containing exact source identities/digests/versions, authority statuses, and scoped completeness basis
coverage status
lane receipts and gaps
verdict
what held
ranked findings
accepted, rejected, contested, and unverified candidate findings
finding routes to spec-design | program-design | caller
correction-verification and refresh requirements
planning-readiness boundary
explicit non-acceptance statement
```

Verdicts:

```text
ready
needs-revision
blocked
decision-needed
```

`ready` is a review judgment for the covered mode, not pair acceptance.

The same word `blocked` appears in distinct typed fields: review verdict, lane terminal state, finding-remediation state, and workflow status. They never alias or substitute for one another.

### Review-mode local completion boundary

A review-mode invocation completes when every selected reviewer lane has a terminal state (`complete`, `partial`, `blocked`, or `no-receipt`), the parent has verified/reduced available candidate findings against exact sources, and the result names its coverage and non-acceptance boundary. Only `complete`, `partial`, or `blocked` have receipts. `no-receipt` is a terminal lifecycle state, never a fabricated receipt, and cannot produce `ready`. The invocation does not wait for remediation unless invoked again for refreshed review. Classification uses only the separate complete/blocked callable return below and completes before any reviewer dispatch or review verdict exists.

## Shared Review-Requirement Classification

IF this skill was directly invoked to classify or review one named runtime skill package and no `skills-creation` parent packet/result authorizes composition, route to `skills-creation` before classification or reviewer dispatch. `skills-creation` may call this review skill with explicit parent authority.

This skill owns the classification consumed by both authoring skills and any composing caller:

```text
review-required
non-substantial
```

Classification is an explicit callable entry distinct from the three review modes:

```text
operation: classify-review-requirement
requested future review mode: specification-only | program-only
exact covered artifact digests
change/artifact scope and claimed semantic effect
complete scoped governing-source inventory: exact identities/digests/versions, authority statuses, and completeness basis
matched material-risk predicates
caller requirement: required | none

complete return:
  invocation state: complete
  requested future review mode
  exact covered digests
  immutable governing-source coverage identity
  review-required | non-substantial
  decision branch: forced | matched-risk | non-substantial | semantic-fallback
  matched predicate, non-substantial basis, or remaining semantic effect
  caller requirement

blocked return:
  invocation state: blocked
  classification result: omitted
  exact missing or ambiguous input
```

When no caller packet requires review, `caller requirement` defaults to `none`. It can escalate review to required; it can never suppress an explicit user request, a matched material-risk predicate, or the semantic fallback.

The caller may invoke this entry directly before deciding whether a review invocation is required. It performs no review, selects no reviewer lanes, returns no readiness verdict, and never satisfies pair-mode review. Completion requires a total predicate decision bound to the exact digests. A blocked invocation is not a third classification value, never counts as local coverage, and supplies only the missing input needed to retry.

The runtime `SKILL.md` keeps this classification branch scan-visible before the review-mode branch. It MUST load `references/classifying-review-requirement.md` and return the total predicate result or blocked missing-input result above. Completion of this branch returns immediately with zero reviewer dispatches; `review-required` is an instruction to make a separate fresh review invocation, not permission for same-context self-review.

Apply this ordered decision table after blocking missing or ambiguous inputs:

1. Return `review-required` with branch `forced` when the user requests independent review or the composing caller requires it.
2. Return `review-required` with branch `matched-risk` for specification-only work when product meaning is load-bearing; more than one requirement, consumer, or contract is affected; public/security-sensitive behavior changes; multiple decisions/surfaces interact; or a material ambiguity was resolved.
3. Return `review-required` with branch `matched-risk` for program-only work when more than one component, owner, or interface is affected; state, failure, concurrency, trust, platform, data, compatibility, or proof architecture is material; or structural ownership/dependency direction changes.
4. Return `non-substantial` only for copy, format, link, or metadata-only work with no semantic effect, or one bounded factual clarification that makes no readiness claim.
5. Return `review-required` with branch `semantic-fallback` for every remaining semantic specification or program-design change and record the remaining semantic effect.

Pair mode is always required for caller-recorded acceptance and for any direct pair-readiness verdict; it does not use this local two-value classifier.

Once a review mode is invoked, one fresh mode-complete reviewer is always dispatched. The classification entry determines whether an authoring skill or composing caller must make that separate review invocation; it never turns classification into same-context self-review.

The classification result names the requested review mode, exact covered digests, matched predicate or non-substantial basis, and whether the caller requires review. No consumer restates or weakens this predicate.

## Review Modes

### Specification-only

Judges whether the specification's Why/What is authoritative, coherent, observable, testable, and sufficient to constrain program design.

It independently checks:

- consumer/problem/outcome authority;
- current/desired observable gap;
- goals/non-goals and negative space;
- normative source classification and conflicts;
- outcome-to-requirement coverage;
- requirement clarity and pass/fail observability;
- public/external contracts and failure expectations;
- cross-cutting obligations;
- proof modality per material requirement;
- hidden internal How or unresolved product meaning;
- artifact navigation and traceability.

It returns Why/What findings to `spec-design`; lifecycle or input issues return to the caller.

### Program-only

Judges two questions separately:

1. Is the structural How internally coherent?
2. Does it realize the governing specification without changing its meaning?

It independently checks:

- current-system source grounding;
- viable alternatives and tradeoff/crux honesty;
- component composition and singular ownership;
- sources of truth and dependency direction;
- interface behavioral completeness;
- state ownership/transitions;
- normal control/data/call flows;
- failure, partial-success, retry, cleanup, cancellation, and recovery;
- concurrency, ordering, idempotency, and consistency;
- trust boundaries, security/reliability/operability architecture;
- realization of applicable performance/capacity, privacy/data-lifecycle/compliance, accessibility, and platform obligations;
- proof seams and enforcement classes;
- requirement-to-design coverage;
- plan leakage and hidden requirement invention.

How findings route to `program-design`. Missing or contradictory Why/What routes to `spec-design`; caller-state issues return to the caller.

### Pair

Repeats the load-bearing local checks independently and adds cross-artifact integrity:

- every material specification obligation has one design realization;
- every material design element traces to an obligation, constraint, failure policy, or proof need;
- specification and design use consistent terms and boundary altitude;
- the design does not narrow, broaden, or contradict observable behavior;
- proof modality and proof seam form a sufficient chain;
- non-goals and compatibility boundaries survive realization;
- security/reliability obligations map to controls and failure behavior;
- every other applicable cross-cutting obligation maps to a structural owner, mechanism/boundary, failure or degradation behavior, and proof seam;
- no review/author self-check is being used outside its covered digest;
- a planner can select tasks and execution mechanics without inventing product meaning or structural How.

Pair mode is mandatory before a caller records pair acceptance. It remains non-accepting.

## Common All-Run Review Method

Every reviewer—mode-complete or focused—loads the common baseline before its lane mission. The baseline owns target/digest binding, complete reading of the target artifact set, freshness, source discipline, candidate-only authority, and receipt shape. The mode-complete reviewer additionally reconstructs the full claim model, applies the selected mode, attacks the whole-mode crux, and returns complete mode evidence plus a candidate recommendation. A focused reviewer reconstructs only the model slice needed by its bounded mission and cannot return or substitute for the parent reducer's final coverage-bound verdict.

### 1. Bind target identity and mode

Apply the named-runtime-skill-package direct-invocation guard above before binding a review target.

Verify paths, line counts, digests, governing specification identity, current HEAD/source version where relevant, and requested mode. Reject ambiguous or changed targets.

Completion: the review result can later prove exactly what was inspected.

### 2. Load the complete required artifact set

Read every target artifact completely. Open the governing sources named by claims, not merely the author's summary. For substantial current-system claims, inspect source anchors needed to verify load-bearing assertions.

Do not issue substantive findings before complete target coverage. A concern raised halfway through an artifact is provisional because a later section may answer or contradict it.

Completion: coverage records every required item opened and any uninspected source as a gap; partial coverage cannot return a clean `ready` verdict.

### 3. Reconstruct the applicable artifact model independently

The mode-complete reviewer extracts the full claim model without preserving the author's section order:

- authority, problem, consumers, outcomes, requirements, contracts, constraints;
- components, owners, interfaces, state, flows, failure/concurrency/security behavior;
- proof modalities and seams;
- decisions, assumptions, non-goals, debt, and open gaps.

Each focused reviewer extracts only the claims, relationships, and sources needed for its selected mission after still reading the complete target artifact set. It does not widen into unselected mode dimensions.

Judge in dependency order: problem and authority, then outcomes and requirements, then observable contracts, then structural realization and proof. An upstream fatal defect makes downstream elegance moot; record the downstream coverage boundary instead of producing noise about a design whose governing meaning failed.

Completion: the mode-complete reviewer can state the artifact's full spine and crux; each focused reviewer can state its bounded model slice and stop boundary without relying on author confidence.

### 4. Audit authority and traceability

Within the reviewer's selected scope, ask who owns each meaning, which source supports it, which downstream claim consumes it, and whether a hidden assumption crosses semantic ownership. The mode-complete reviewer covers the complete selected mode; focused reviewers cover only their lane slice.

Run the four-source drill for every load-bearing basis: code-compelled, user-chosen, author recommendation mislabeled as authority, or contradiction of an authoritative non-goal/constraint. For a code-compelled claim, open the cited source and verify that it actually compels the statement. For a user-chosen claim, verify that the artifact names the choice and rejected alternative rather than presenting a recommendation in decision clothing.

Completion: authority conflicts, unsupported requirements, invented design meaning, orphan design elements, and missing realization links are explicit.

### 5. Run the selected mission

The mode-complete reviewer applies the specification-only, program-only, or pair checks above. Pair mode independently repeats critical local checks; it does not trust author self-checks or prior local review as its only evidence. Focused reviewers apply only their selected lane mission, calibration, overlap boundary, and stop condition.

Completion: every required mode dimension is judged or named as a coverage gap by the mode-complete reviewer, its candidate recommendation is evidence-backed, and every focused reviewer remains inside its lane authority.

### 6. Attack the crux

Use at least these probes when applicable:

- inversion: what if the central assumption is false or the opposite boundary is correct?
- divergent implementers: where could two capable readers build materially different behavior/structure?
- failure interleaving: which timeout, retry, cancellation, partial success, or race breaks the model?
- owner removal: if this component disappeared, who actually owns the truth?
- negative space: what nearby behavior will an implementer assume because it is not forbidden?
- proof break: can the named modality observe the named seam under real conditions?
- pretend planner: what meaning or structural decision would the next planner still have to invent?

After the full pass, restate the selected artifact model in three sentences. If that compact model cannot be written, or it contradicts a load-bearing section, the artifact has not produced one coherent mental model.

Completion: the highest-risk assumption and its failure consequence are named even when no finding results.

### 7. Select focused lanes by observable predicate

Focused lanes deepen one risk. They never replace the mode-complete reviewer.

Completion: each selected lane names its predicate, mission, source scope, maximum authority, overlap boundary, stop condition, and expected receipt; unselected lanes record why their predicate did not hold when ambiguity would matter.

### 8. Verify and synthesize findings

Treat all reviewer outputs as candidate findings. Verify source evidence, merge by root cause, preserve real disagreement, reject unsupported style preferences, and route each parent-accepted defect to its semantic owner.

Record a one-line evidence rationale for every rejected candidate so the user or a later reviewer can inspect and override the disposition. Missing evidence produces `unverified`, not rejection.

Watch for doubt theater: if repeated fresh review cycles produce substantive-looking findings and the parent verifies none of them, the lane selection, packet, or calibration is wrong. Stop adding reviewers and repair the review contract rather than treating volume as rigor.

Completion: every candidate is accepted, rejected, contested, or unverified; duplicates/conflicts and coverage gaps are explicit.

### 9. Return a coverage-bound verdict

The verdict reflects the selected mode only. Name the first required revision, why it is first, exact correction verification, which receipts an edit would invalidate, and whether planning would still invent meaning/How.

Completion: the result is digest-bound, every selected lane has a terminal state, any `no-receipt` has been followed up and then either freshly re-dispatched or closed as a blocked/non-ready coverage gap, and the result explicitly refuses edit/lifecycle/acceptance authority.

## Finding Contract

Each finding must make the failure executable:

```text
finding identity
review mode / lane
severity: blocker | important | minor | observation
artifact and source anchor
claim or rule under review
failure path or contradiction
behavior/design risk
what the next author/planner would have to guess
smallest semantic correction target
semantic owner: spec-design | program-design | caller
validation note
refresh / retest required
contested evidence when applicable
```

Severity follows consequence:

- `blocker`: the artifact/pair can produce wrong behavior or cannot support the required next phase;
- `important`: correctness depends on guessing or inconsistent interpretation;
- `minor`: the intended model lands but costs avoidable reader effort;
- `observation`: no proven behavior effect; may be pruned.

Reviewers must not upgrade prose taste into a semantic defect.

## Focused Lane Set

The final implementation should prefer a small set of parameterized missions where judgment is stable. Candidate lanes:

| Lane | Observable predicate | Focus | Overlap / stop boundary |
| --- | --- | --- | --- |
| specification authority | normative sources conflict, product meaning is load-bearing, or requirement basis is unclear | consumer/problem/outcome/requirement authority | reports How concerns only as routed gaps; stops after authority/traceability judgment |
| contract | public UI/API/CLI/schema/config/operator contract is material | inputs, outputs, invariants, errors, negative space, compatibility | does not redesign internal interface realization |
| architecture boundary | three or more components, ownership change, new source of truth, or cross-module dependency | owners, boundaries, interfaces, dependency direction, state | reports requirement gaps to specification owner |
| failure/concurrency | fallible boundary, retry, partial success, cancellation, shared mutable state, or concurrent actors exist | interleavings, containment, recovery, consistency | does not select product failure policy when unspecified |
| security/trust | auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugin, agent, or external service is in scope | assets, actors, trust boundaries, enforcement, misuse containment | not a standalone security scan; routes missing obligations |
| platform/harness | runtime/framework/tool/agent/sandbox/browser/native UI/test harness constrains feasibility or proof | platform semantics, real/fake boundaries, proof fit | does not own generic agent mechanics or exact plan commands |
| implementation difference | current implementation/prototype/trace exists and may hide decisions | differences, implicit contracts, migration constraints | current behavior is evidence, not automatic authority |
| proof | proof modality or seam is disputed, cross-layer, visual, operational, or security-sensitive | modality/seam sufficiency and observability | planning owns exact commands/evidence capture |
| artifact navigation | pair/slices exceed simple navigation or normative claims are distributed | authoritative homes, links, traceability, duplication | does not prefer more files without consumer/change reasons |

Each implemented focused-lane reference must preserve the mission, predicate, and stop boundary above and teach the following source-grounded judgment rather than only defining a result shape:

| Lane | Prior craft source | Non-negotiable judgment and calibration |
| --- | --- | --- |
| specification authority | old `product-intent` and `requirements-testability` lanes plus the four-source drill | distinguish authorized obligation from observation or recommendation; return the exact unsupported or conflicting claim, not generic uncertainty |
| contract | old `contract-and-scope` lane | inspect owner/consumer/input/output/invariant/error/negative-space/compatibility; missing fields matter only when two readers could diverge |
| architecture boundary | old `architecture-boundaries` lane and noun interrogation | test source-of-truth, mutation authority, allowed/forbidden edges, interface depth, and reason to change; style preferences are not findings |
| failure/concurrency | old `risk-and-tradeoff-design` plus validation craft | construct a concrete interleaving or failure path and name containment/recovery/proof consequences; do not invent product failure policy |
| security/trust | old `security-threat-model` lane | trace asset, actor, entry point, policy owner, enforcement, misuse containment, and proof; route standalone scans out |
| platform/harness | old `harness-fit` lane | verify real platform semantics and real-versus-fake proof boundaries; a convenient mock is not proof of production wiring |
| implementation difference | old `spec-difference` lane | separate current behavior as evidence from current behavior as authority; return the missing decision, constraint, migration rule, or proof implication |
| proof | old `validation-and-testability` lane | break the modality-to-seam chain under realistic conditions and identify the smallest missing observation or enforcement class |
| artifact navigation | old `progressive-disclosure` lane | require one readable authoritative entry and deeper files only for real consumer/change boundaries; more files are not automatically clearer |

Good lane output contains a source-backed failure path, behavior/design consequence, smallest semantic correction, and stop boundary. Topic checklists, stylistic preferences, or schema-only returns are incomplete.

Exactly one mode-complete review lane/reviewer is required for every review invocation. It returns complete mode evidence and a candidate recommendation, never the final verdict. Each dispatch uses a fresh one-shot reviewer instance. Additional focused lanes are conditional. After an invalidating edit, affected lanes are re-dispatched with fresh instances.

## Reviewer Independence and Agent Contract

Reviewers are bounded fresh-context read-only agents:

- parent conversation history: none;
- workspace access: read-only;
- exact targets and sources supplied in a self-contained packet;
- the packet carries the artifact and review contract, never the caller's conclusion, expected verdict, or recommendation about what the reviewer should find;
- no author confidence, prior praise, or hidden conversation as evidence;
- candidate findings only;
- terminal `complete`, `partial`, or `blocked` receipt;
- parent verifies and reduces every finding.

`manage-agents` owns pattern/model/runtime/provider/permission/packet/receipt mechanics. The review skill owns mode, lane selection, semantic packet fields, review result, and reduction judgment.

Silence after an explicit follow-up is terminal lane state `no-receipt`, never a receipt and never clean review. The parent may freshly re-dispatch once when useful; otherwise it returns `blocked` with the coverage gap. A receipt expires when reviewed text changes.

## Proposed Runtime Skill Tree

```text
skills/spec-program-review/
  SKILL.md
  references/
    classifying-review-requirement.md
    reviewing-common-method.md
    reviewing-specification.md
    reviewing-program-design.md
    reviewing-pair.md
    finding-and-reduction-schema.md
    lanes/
      mode-complete-reviewer.md
      specification-authority.md
      contract.md
      architecture-boundary.md
      failure-concurrency.md
      security-trust.md
      platform-harness.md
      implementation-difference.md
      proof.md
      artifact-navigation.md
      lane-schema.md
```

The common baseline has one owner. `mode-complete-reviewer.md` owns the stable fresh-review mission, maximum authority, non-goals, stop condition, complete mode-evidence return, and candidate recommendation; it loads the selected mode reference for its distinct judgment. Focused lane files own their bounded mission, maximum authority, calibration, overlap/non-goals, inspection procedure, result detail, and stop condition. `lanes/lane-schema.md` owns the shared reviewer packet and receipt envelope consumed by the mode-complete reviewer and every focused reviewer. `finding-and-reduction-schema.md` owns only parent disposition of candidate findings, duplicate/conflict and coverage reduction, and the final coverage-bound review result. The caller owns predicates, packets, prerequisites, instance authority, terminal-state collection, and the only final coverage-bound verdict.

## Depth and Call Architecture

The runtime `SKILL.md` keeps the classifier/review operation branch, mode selection, all-run review route, independence, non-edit/non-acceptance boundary, and terminal result visible.

Proposed classifier call:

```text
IF operation is `classify-review-requirement`, load `references/classifying-review-requirement.md` and return the digest-bound `review-required | non-substantial` result or blocked missing-input result. Dispatch no reviewer and return no review verdict.
```

Proposed ordinary calls used by the parent reducer:

```text
MUST load `references/finding-and-reduction-schema.md` and return parent dispositions, merged duplicates/conflicts, coverage gaps, and the coverage-bound verdict before completion.
```

Mandatory mode-complete dispatch:

```text
MUST dispatch `mode-complete-reviewer` to a subagent using the exact mode, target digests, governing sources, constraints, risk predicates, and review packet.
Subagent loads `references/lanes/lane-schema.md` and `references/lanes/mode-complete-reviewer.md`; that lane MUST load `references/reviewing-common-method.md` and the selected `reviewing-specification.md`, `reviewing-program-design.md`, or `reviewing-pair.md` mode reference before inspection.
Parallel-safe after the complete target artifact set and governing sources exist; actual scheduling may serialize.
Instance authority is fresh-context, read-only, candidate-only, and equal to or narrower than the lane maximum; `manage-agents` owns runtime enforcement.
Return a `complete | partial | blocked` receipt containing the evidence and candidate recommendation actually produced, or terminal `no-receipt` state containing no lane output; the parent verifies and reduces available evidence. A complete mode receipt is necessary but not sufficient for the parent to return `ready`.
```

Parameterized focused-review dispatch contract:

```text
IF a focused-lane predicate in the focused-lane table holds, dispatch the selected focused lane using a packet containing:
  exact mode and target/governing-source identities and digests
  the observable selection predicate, bounded review question, source scope, constraints, and risk predicates
  the lane mission, maximum authority, overlap/non-goals, stop condition, and expected return
Subagent loads `references/lanes/lane-schema.md`, `references/reviewing-common-method.md`, and the selected `references/lanes/<focused-lane>.md` before inspection.
Parallel-safe only after the complete target artifact set and governing sources exist; focused lanes may run beside the mode-complete reviewer because they return candidate evidence, not inputs to one another. Actual scheduling may serialize.
Instance authority is fresh-context, read-only, candidate-only, equal to or narrower than the selected lane maximum, and excludes mode recommendation, final verdict, editing, lifecycle mutation, remediation, planning, and acceptance.
Return a complete | partial | blocked lane-schema receipt with covered sources, inspected claims, candidate findings, gaps, and stop reason, or parent-recorded no-receipt after explicit follow-up. The parent verifies and reduces available evidence through `finding-and-reduction-schema.md`.
```

The selected focused lane performs only its bounded mission and cannot substitute for the mandatory mode-complete receipt.

## Review Versus Acceptance

The following statements are intentionally different:

```text
review ready
  = the exact covered artifact(s) satisfy the invoked review mode

pair accepted
  = the composing caller verified current author/local/pair results,
    closed findings, freshness, and planning handoff for the exact pair
```

`spec-program-review` may recommend readiness. It cannot write caller-owned lifecycle or acceptance state. Direct pair review is usable only for the exact covered digests and becomes stale after either artifact changes.

## Planning-Readiness Contract

The pretend planner must be able to consume, not decide:

- authoritative requirements and observable contracts;
- target components, owners, sources of truth, and dependency direction;
- interface semantics;
- state ownership/transitions;
- normal/failure/partial-success/recovery/concurrency policy;
- compatibility and cutover realization;
- trust boundaries and security/reliability controls;
- proof modalities and structural seams.

The planner may decide tasks, files, order, DAG, exact commands, red/green steps, evidence capture, checkpoints, and rollout procedure. If the first list requires judgment, the review routes a finding to the semantic author and returns `needs-revision` or `blocked`.

## Proof Plan

No pressure tests run in this design pass. Later implementation must prove:

| Claim | Static proof | Behavioral proof family |
| --- | --- | --- |
| trigger selects artifact review and refuses editing/acceptance | boundary audit | review vs revise prompts |
| classification is total, digest-bound, and reviewer-free | classifier call/return/consumer audit | specification/program material-risk cases, unmatched semantic fallback, non-substantial case, ambiguous-input block, and proof of zero dispatch |
| review-required classification causes a separate fresh invocation | operation-boundary audit | classifier result followed by fresh review rather than same-context self-review |
| all modes use one common method before lane-specific judgment | call-order audit | spec/program/pair packets |
| specification and program review remain distinct | mode rubric audit | coherent How against insufficient Why |
| pair review repeats critical local checks | pair contract audit | flawed requirement with clean author self-check |
| focused lanes cannot substitute for mode completeness | lane selection audit | focused-only clean result attempt |
| findings show failure path, guess, owner, and verification | schema audit | ambiguous interface finding |
| stale/silent/partial receipts cannot yield ready | lifecycle audit | changed artifact and no-receipt cases |
| ready review cannot accept pair | cross-skill authority audit | standalone pair review import |
| planning-readiness detects missing structural How | rubric audit | pretend-planner scenario |

Behavioral proof is deferred to implementation.

## Acceptance Criteria for the Skill Implementation

- The trigger distinguishes review from authoring, caller orchestration, plan review, and implementation review.
- Specification-only, program-only, and pair modes are independently invocable and digest-bound.
- Review-requirement classification is a scan-visible independently callable branch that completes without reviewer dispatch and cannot return a review verdict.
- All reviewers load one common method before their mode/lane mission.
- Each mode teaches what to review, not just which headings to inspect.
- Pair review independently rechecks load-bearing local quality.
- Exactly one fresh mode-complete reviewer is explicitly dispatched for every review invocation; focused lanes are predicate-selected and non-substituting.
- Mode-complete and focused reviewers consume one lane-envelope owner; parent finding disposition/reduction remains a separate owner.
- Every focused lane dispatch instantiates the shared handoff contract with its predicate, prerequisites, authority, inspection mission, stop condition, return, and parent reduction point.
- Findings contain source, failure path, next-agent guess, smallest target, semantic owner, and verification note.
- Reviewers are fresh-context, read-only, and candidate-only.
- The mode-complete reviewer returns complete evidence plus a candidate recommendation; only the parent reducer returns the final coverage-bound verdict.
- Every selected lane reaches a terminal state; `no-receipt` is distinct from a receipt and silence/partial coverage blocks a clean verdict.
- Edits invalidate affected receipts.
- The skill never edits, remediates, mutates lifecycle, plans, or accepts.
- Agent mechanics remain in `manage-agents`.

## Source Basis

This design preserves whole-artifact coverage, product-intent and requirements testability, contract/scope, architecture boundary interrogation, security threat modeling, harness fit, current-implementation difference, validation/testability, progressive disclosure, adversarial crux, planning-readiness, finding schema, and parent synthesis from the existing review skill. It also preserves the earlier research-backed review method: complete reading before findings, dependency-order judgment, the four-source authority drill, three-sentence reconstruction, crux inversion, pretend-planner testing, behavior-effect finding calibration, and the doubt-theater stop. It replaces the mandatory eight-lane swarm with one mode-complete review plus predicate-selected focused lanes while retaining fresh independent eyes and parent reduction.
