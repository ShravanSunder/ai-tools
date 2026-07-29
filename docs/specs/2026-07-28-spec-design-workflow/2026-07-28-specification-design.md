# Specification Design Skill Specification

Date: 2026-07-28

Status: proposed

Target runtime skill: `specification-design`

Orchestrated by: [`spec-design`](./2026-07-28-spec-design-workflow.md)

Independent review owner: [`spec-program-review`](./2026-07-28-spec-program-review.md)

## Decision

Create `specification-design` as an independently invocable skill for constructing and revising authoritative Why/What before structural program design or implementation planning.

It teaches general specification craft. It is not a reduced checklist, a requirements template, a skill-authoring adapter, or the first hidden stage of an orchestrator. It may be called directly and returns a complete local result. When called by `spec-design`, the same result participates in the larger lifecycle without gaining acceptance authority.

## Success Definition

Given intent, evidence, decisions, or an existing draft, the skill produces a versioned specification whose consumer, problem, desired outcomes, normative requirements, observable behavior, constraints, external contracts, failure expectations, non-goals, and proof obligations are explicit enough that program design can realize them without inventing product meaning.

When authority or evidence is missing, the skill returns a precisely scoped gap instead of laundering a guess into a requirement.

## Mental Model

A specification is an authority map for observable obligations.

It does not merely list requested features. It separates:

```text
evidence and authority
  -> problem and affected consumers
  -> intended outcomes
  -> normative obligations
  -> observable contracts and failure expectations
  -> proof obligations
```

Every `MUST` needs a legitimate basis. Every requirement needs an observable consequence. Every unresolved product choice stays visible until an authorized source resolves it. Structural implementation choices belong downstream unless they are themselves public constraints.

The specification answers:

- Why does this need to exist or change?
- Who consumes the behavior?
- What must be true from those consumers' perspective?
- Which sources are authoritative for that meaning?
- What outcomes are explicitly out of scope?
- What evidence class could prove each obligation?

It does not answer which internal module owns the behavior, how state is stored, which call graph realizes it, or in what task order it will be built.

## Scope

The skill owns:

- problem framing and current observable behavior;
- consumers, operators, maintainers, and affected systems as requirement stakeholders;
- desired outcomes, success conditions, goals, and non-goals;
- authority and decision classification;
- normative requirements and requirement traceability;
- external/user-visible API, CLI, UI, data, configuration, and operational contracts;
- externally required failure behavior and partial-success expectations;
- constraints, invariants, compatibility obligations, and explicit assumptions;
- security, privacy, reliability, performance, accessibility, and operability obligations at the outcome/contract level;
- proof modalities required by each material obligation;
- specification artifact structure, readability, and local construction result;
- local self-check and routing to fresh independent specification review when required.

It does not own:

- target components, internal owners, dependency direction, internal interfaces, state machines, call graphs, data flow, or recovery architecture;
- exact tests, commands, implementation files, task slices, order, or execution DAGs;
- final wording/placement mechanics for authoring a runtime skill package;
- pair acceptance or cross-artifact lifecycle state;
- independent review judgment.

## Trigger Surface

Invocation capability: model-invocable and user-invocable.

Proposed trigger description:

```yaml
name: specification-design
description: Use when defining or revising authoritative Why/What: the problem, consumers, outcomes, requirements, public or externally observable contracts, constraints, failure obligations, or proof obligations. Not for discussion-only extraction of requirements or decisions that still live only in the user's head, reconverging a drifted shared mental model, independent review-only requests, internal architecture, implementation tasks, pair acceptance, authoring or evaluating a runtime skill package—its trigger, main path, references, lanes, scripts, steering, platform mechanics, or behavior proof—or an explicitly requested legacy spec-creation-swarm run.
```

True prompts include “write the requirements,” “clarify the product contract,” “what should this feature guarantee,” “revise the specification,” and specification-owned findings routed from program design or review.

Discussion-only interviews that must first extract tacit requirements or unmade decisions route to `discuss-pathfinding`. Requests to reconverge a drifted shared mental model before drafting route to `discuss-clarify-mental-models`.

Near misses:

- “design the component tree/state model” routes to `program-design` when Why/What is authoritative;
- “review this finished specification” routes to `spec-program-review` specification-only mode when no authoring is requested;
- “take this accepted design and make tasks” routes to plan creation;
- “create the full pair and carry it through review” routes to `spec-design`.

## Independently Invocable Contract

### Inputs

At least one of:

- product/user intent;
- observed behavior or failure;
- current docs, code, logs, interfaces, policies, or decision records;
- an existing specification;
- review findings owned by specification meaning;
- an orchestrator packet naming exact artifacts, decisions, and gaps.

The skill may start from incomplete intent. It may not represent inferred authority as settled authority.

### Outputs

Exactly one of:

```text
locally-ready
decision-needed
evidence-blocked
deferred
```

A `locally-ready` result contains:

- specification path or chat artifact identity;
- exact digest/revision;
- immutable governing-source coverage identity containing every governing source's exact identity, digest/version, authority status, and the scoped completeness basis;
- load-bearing user-decision inventory with durable decision source or current confirmation identity;
- requirement and proof-obligation inventory;
- author self-check result;
- independent specification-review result when substantial;
- remaining non-blocking assumptions or deferred items;
- explicit statement that no pair acceptance is claimed.

### Local completion boundary

Direct invocation completes when the owned artifact and digest-bound local result are returned or an exact decision/evidence gap is recorded. It does not require program design or pair review. It cannot mark a pair accepted.

When invoked by `spec-design`, the orchestrator consumes the same terminal result and owns all later transitions.

## The Specification Spine

Every substantial specification must let a reader follow this chain without reconstructing it from review notes:

```text
consumer and problem
  -> current observable reality
  -> desired outcome
  -> normative requirement
  -> observable contract or constraint
  -> failure expectation
  -> proof obligation
```

This is the content spine, not a mandatory heading list. The artifact may organize by user journey, capability, protocol, domain, or decision as long as the chain remains traceable.

## All-Run Main Path

### 1. Establish authority, audience, and artifact boundary

IF this skill was directly invoked to create, update, evaluate, or design one named runtime skill package and no `skills-creation` parent packet/result authorizes composition, route to `skills-creation` before authoring specification text. `skills-creation` may call this general craft skill with explicit parent authority.

Identify who asked, who consumes the result, who can decide product meaning, what artifact is being created or revised, and whether the request is chat-only or file-backed. Inventory current sources before treating the draft as truth.

Classify each source:

```text
normative      authorized requirement or binding constraint
observational  evidence about current behavior or need
advisory       recommendation or prior art
conflicting    sources disagree and authority must be resolved
unknown        provenance or decision power is unclear
```

IF external prior art, library/framework behavior, platform documentation, or current web evidence could change product meaning, contract, constraint, or proof obligation, gather it before finalizing the specification. Use one bounded evidence lookup when the question is narrow; use `research-swarm` and consume its evidence-ledger result when the source set is substantial or mixed. Classify the result as normative, observational, advisory, conflicting, or unknown rather than treating external popularity as authority.

Completion: the target boundary, consumers, decision authority, source inventory, and unresolved authority conflicts are explicit.

### 2. Model the problem before proposing obligations

Describe current observable reality, the affected consumer/operator journey, the concrete failure or opportunity, and why the current behavior is insufficient. Distinguish symptoms from causes when evidence permits; do not require implementation root cause to state an observable problem.

Ask:

- What happens today?
- Who experiences the cost?
- At what boundary is the problem observable?
- What source proves it?
- What would remain wrong if the requested feature existed only nominally?

Completion: the problem statement names the current/desired gap and has evidence or an explicit hypothesis label.

### 3. Define outcomes, non-goals, and success boundaries

State the outcomes the change must create and the nearby outcomes it intentionally will not create. Separate product outcome from chosen mechanism. A requested implementation is not automatically the goal.

Decompose before refining. When the request spans independently governed capabilities, protocols, domains, or consumer journeys, split those semantic slices before polishing their requirements. A detailed requirement set for the wrong boundary is still the wrong specification.

Use countercases to sharpen scope:

- What plausible interpretation is explicitly excluded?
- Which consumer is not served?
- Which compatibility or migration promise is not made?
- What quality dimension is bounded rather than maximized?

Completion: each goal has a success condition, each material non-goal prevents a likely scope guess, and no mechanism is presented as an outcome without justification.

### 4. Resolve material decisions at the correct altitude

Search evidence before asking the user. Ask only when legitimate sources cannot decide product meaning, public behavior, irreversible compatibility, policy, or cost/risk tolerance.

Ask one load-bearing decision at a time because the next question usually depends on the answer. Delegation such as “whatever you think,” vague assent such as “sounds good,” silence, or a topic change does not establish authority; reframe the unresolved decision as concrete options or return it as `decision-needed`.

Each question must include:

- the decision being made;
- the authorized decision maker;
- available options;
- current recommendation and evidence;
- what each option gains, pays, and makes impossible;
- consequence of deferral.

For every resolved load-bearing user choice, record a durable decision source or a current confirmation identity that the later acceptance gate can verify. A paraphrase written by the author is not evidence that the decision happened.

Completion: every load-bearing branch is decided with inspectable authority evidence, explicitly deferred with consequence, or returned as `decision-needed`.

### 5. Derive normative requirements

Translate outcomes into testable obligations. Requirements describe what must be true, not implementation tasks.

Each material requirement carries:

```text
stable identifier
normative statement
basis / authority source
consumer or affected boundary
observable success condition
negative or failure expectation
proof modality
dependencies or conflicts
```

Strong requirement language makes the observable subject and condition explicit. Replace vague verbs such as “support,” “handle,” “robust,” “easy,” or “secure” with the behavior that would let a reviewer distinguish pass from fail.

Choose a conditional shape that makes the triggering context explicit. EARS-style forms are useful construction tools, not mandatory surface syntax:

```text
always active     The <system> <response>.
state-driven      While <state>, the <system> <response>.
event-driven      When <trigger>, the <system> <response>.
optional feature  Where <feature exists>, the <system> <response>.
unwanted behavior If <fault or unwanted trigger>, then the <system> <response>.
complex           While <state>, when <trigger>, the <system> <response>.
```

Split compound obligations when their clauses can pass or fail independently. Write faults as `If/then` so abnormal behavior is not disguised as a normal event. Apply the stranger test: a capable reader with no session history can state the same pass/fail behavior and proof obligation without asking what the author meant.

Completion: every goal is covered by one or more requirements, every requirement traces to a goal and basis, and two independent implementers would not need to invent different product behavior.

### 6. Specify observable contracts and negative space

For every load-bearing external surface, define only the dimensions that matter:

```text
owner or authority
consumer
inputs and preconditions
outputs and postconditions
state visible to the consumer
invariants
error/failure behavior
partial success and cancellation expectations
compatibility boundary
examples and counterexamples
explicitly undefined behavior
```

External surface includes UI interaction, API/protocol behavior, CLI semantics, schemas/events, configuration, logs/metrics when operators consume them, and human/agent artifact contracts.

Completion: consumers can predict normal and failure behavior without guessing internal structure.

### 7. State cross-cutting obligations without designing their realization

Name applicable obligations for security, privacy, reliability, performance, accessibility, observability, data lifecycle, compliance, and platform compatibility. Distinguish an obligation from its structural realization.

Examples:

- specification: unauthorized principals must not observe the resource;
- program design: the authorization boundary, policy owner, and enforcement calls;
- plan: exact files, tests, commands, and rollout tasks.

For sensitive work, the specification names assets, actors, prohibited outcomes, required guarantees, and explicit security non-goals. Program design later realizes trust boundaries and containment.

Completion: every applicable quality attribute is either expressed as an observable obligation/constraint or marked not applicable with a reason.

### 8. Define proof obligations

For every material requirement, name the evidence class that could demonstrate it:

```text
automated behavior
manual interaction or visual evidence
API/CLI transcript
state/data inspection
log/trace/metric observation
security analysis or misuse case
performance measurement
release/runtime evidence
```

Do not choose exact test files, commands, mocks, task order, or evidence-capture procedure. Program design must provide usable seams; planning operationalizes exact proof.

Completion: no material requirement is “testable later” without a named modality, and known proof gaps are visible.

### 9. Author the smallest coherent artifact

Choose structure based on reader navigation. Keep normative decisions in the primary specification. Use linked slice specifications only when a vertical capability, protocol, domain boundary, or independently governed contract has its own consumers and change reason. Keep research/process ledgers out of the design artifact.

Section writers are permitted after meaning is mapped. A section-writer packet must include the accepted claims, their identifiers/bases, allowed prose boundary, prohibited invention, and required gap return. The writer may organize or clarify mapped meaning; it may not originate requirements, invariants, option selections, failure policy, realizations, or normative prose not already authorized.

Completion: the artifact is readable from problem to proof, every normative claim has one home, and unmapped needs are returned as gaps rather than invented by a writer.

### 10. Run the author self-check

The author re-reads the entire artifact and checks:

- authority and source conflicts;
- problem/outcome/requirement traceability;
- vague obligations;
- missing external contracts or failure expectations;
- hidden implementation choices;
- contradictory goals/non-goals;
- missing proof modalities;
- unresolved questions disguised as assumptions;
- readability of the specification spine.

Completion: a digest-bound self-check result records passed items and exact remaining gaps. A self-check is never independent review.

### 11. Obtain fresh local review when substantial

Call the `spec-program-review` review-requirement classification entry for specification-only mode and the exact current digest. Consume its `review-required | non-substantial` result, matched predicate/basis, and orchestration override. A `review-required` result requires specification-only review; a `non-substantial` result records the returned basis and cannot be upgraded by this authoring skill. Classification is not a review invocation and dispatches no reviewer.

When classification returns `review-required`, invoke `spec-program-review` in specification-only mode with the exact artifact digest, normative sources, constraints, and known risk predicates. The reviewer is fresh-context and read-only. Parent-accepted findings return here for semantic correction; any edit to reviewed text invalidates the prior review and requires refresh.

Completion: a current independent local review result covers the current digest, or the artifact is honestly blocked/`non-substantial` with the shared classification result recorded.

### 12. Return the terminal local result

Report the artifact identity/digest, authority coverage, requirement/proof inventory, self-check, independent local review coverage, remaining gaps, and explicit non-acceptance boundary.

Completion: the caller can either invoke `program-design`, import the result into `spec-design`, or supply the exact missing decision/evidence without reinterpreting the artifact.

## Specification Artifact Anatomy

The main path, not a rigid template, is authoritative. A substantial specification normally needs these semantic homes:

```text
decision / status
problem and current observable reality
consumers and authority
goals, outcomes, success conditions
non-goals and negative space
source and decision basis
normative requirements
observable surface contracts
failure and partial-success expectations
cross-cutting obligations and constraints
proof obligations
resolved alternatives when they change meaning
open decisions, assumptions, and evidence gaps
```

Include a traceability view when the relationships are not obvious:

```text
problem P1
  -> outcome O1
      -> requirement R1
          -> observable contract C1
              -> proof modality V1
```

Do not add empty headings for inapplicable concerns. Do not hide normative requirements only inside diagrams, review reports, or prose rationale.

## Delegation and Lane Policy

Delegation is available wherever bounded independent work improves evidence or artifact quality. There is no default swarm.

Candidate lanes:

| Work | Predicate | Return |
| --- | --- | --- |
| evidence lookup | one named authority/current-behavior question can be answered from bounded sources | source-backed answer, conflicts, confidence, gaps |
| external prior-art evidence | external docs, library/platform behavior, admired patterns, or current web evidence could change requirements, contracts, constraints, or proof | borrow/adapt/do-not-borrow candidates, transfer assumptions, source anchors, gaps |
| observable-surface exploration | UI/API/CLI/data/operator behavior is load-bearing | current/desired observable contract candidates and source anchors |
| product-intent specialist | multiple consumer/outcome interpretations remain after source reading | candidate interpretation set and decision crux |
| external-contract specialist | a public protocol/schema/compatibility boundary needs focused judgment | contract risks and missing slots |
| section writer | claims and authority are already mapped and a bounded section can be written independently | proposed text mapped only to supplied claims; unmapped gaps |

The authoring parent owns requirement meaning and final prose. `spec-program-review` owns independent review lanes. `manage-agents` owns runtime selection, context/access, packets, and receipts.

Every dispatched lane must meet the nine lane-qualification properties at implementation time. A source question may instead be an ordinary bounded delegate call when it does not earn a stable lane contract.

## Proposed Runtime Skill Tree

```text
skills/specification-design/
  SKILL.md
  references/
    authority-and-problem-framing.md
    requirements-and-traceability.md
    observable-contracts.md
    proof-obligations.md
    artifact-and-self-review.md
    lanes/
      evidence-lookup.md
      observable-surface.md
      product-intent.md
      external-contract.md
      section-writer.md
      lane-schema.md
```

The final tree is subject to `skills-creation` placement and deletion tests. The tree shows semantic owners, not a requirement to create every file. Merge references when their caller/result contracts do not justify independent ownership.

## Depth and Call Architecture

The runtime `SKILL.md` must keep the mental model, all twelve main-path decisions, their completion gates, and overall completion boundary visible.

Likely all-run reference calls:

```text
MUST load `references/authority-and-problem-framing.md` and return the authority/source classification, problem model, and decision gaps before requirements are finalized.

MUST load `references/requirements-and-traceability.md` and return the requirement set plus problem/outcome/basis coverage before artifact completion.

MUST load `references/observable-contracts.md` and return applicable external contract and failure slots before artifact completion.

MUST load `references/proof-obligations.md` and return requirement-to-modality coverage before local readiness.

MUST load `references/artifact-and-self-review.md` and return the artifact structure choice and digest-bound author self-check before the terminal result.
```

Lane calls remain conditional on observable predicates. Their exact packet, authority, parallel-safety basis, receipt, and parent-reduction contracts are authored through `skills-creation` and `manage-agents`.

`references/requirements-and-traceability.md` must teach the requirement-versus-task boundary with concrete good/bad repairs, including the technology-name test: when a materially different implementation could satisfy the same observable obligation, the technology name is normally a design choice rather than requirement meaning.

## Program-Design Boundary

Specification may constrain internal design only when the constraint is externally authoritative: mandated platform, public compatibility, regulatory obligation, fixed protocol, organizational ownership policy, or another binding boundary.

Otherwise it stops before choosing:

- component/module boundaries;
- internal interfaces and dependency direction;
- state storage and mutation ownership;
- control/data flows;
- retry, cleanup, recovery, or concurrency mechanisms;
- structural enforcement;
- test harness seams.

If an internal choice is necessary to know whether a requirement is feasible, return it as a program-design question or request bounded feasibility evidence. Do not silently convert the candidate answer into a requirement.

## Proof Plan

No pressure tests run in this design pass. Later skill implementation must prove:

| Claim | Static proof | Behavioral proof family |
| --- | --- | --- |
| trigger selects Why/What and rejects structural How | frontmatter boundary audit | true/near-miss routing |
| source evidence is not automatically normative | authority field/call audit | conflicting source scenario |
| external prior art enters as evidence rather than unearned authority | external-evidence predicate and source-classification audit | platform/library prior art that fits, mismatches, or conflicts with user intent |
| requirements derive from outcomes and have observable pass/fail | result schema audit | vague request to testable obligation |
| section writers cannot invent meaning | lane authority audit | unmapped requirement returned as gap |
| proof modality is named without planning commands | boundary audit | proof-needing requirement scenario |
| author self-check cannot substitute for independent review | result/transition audit | substantial direct invocation |
| direct invocation returns locally ready but non-accepted | terminal result audit | standalone specification run |

Behavioral proof remains deferred; this specification claims only a proof plan.

## Acceptance Criteria for the Skill Implementation

- The trigger clearly distinguishes specification, program design, review, orchestration, and planning.
- The mental model predicts the workflow.
- The full specification spine is visible in the main path.
- The skill teaches authority, problem framing, requirements, contracts, failure expectations, and proof obligations rather than listing headings.
- Every normative claim has a source/basis or explicit decision gap.
- Section writers cannot originate meaning.
- Bounded evidence and specialist delegation remain available without fixed fan-out.
- The author self-check and fresh independent review are distinct.
- The terminal result is digest-bound and cannot claim pair acceptance.
- Skill-specific trigger/reference/lane implementation mechanics remain governed by `skills-creation`.
- No implementation task planning leaks into the artifact.

## Source Basis

The design preserves product-intent, user-decision, observable-surface, requirements-testability, contract/scope, security-obligation, proof-modality, and progressive-disclosure judgment from the existing creation/review skills. It also preserves the research-backed requirement construction that partially worked in the earlier proposal: facts-versus-decisions discipline, decomposition before refinement, conditional/EARS shapes, fault `If/then`, the stranger test, vague-verb repair, contract-field inspection, and decision-resolution counters. The source classification identifies the exact ownership changes. It deliberately leaves target architecture and skill-package mechanics to `program-design` and `skills-creation`, respectively.
