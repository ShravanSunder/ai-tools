---
name: spec-design
description: Use when defining or revising a specification's authoritative Why/What, including the problem, consumers, outcomes, requirements, public or externally observable contracts, constraints, failure obligations, or proof obligations. Not for extracting tacit needs or unmade decisions, reconverging a drifted shared model, internal structural How, review-only requests, implementation planning, creating/updating/evaluating one named runtime skill package, or a standalone security scan/audit/threat model.
---

# Spec Design

A specification is an authority map for observable obligations.

It turns evidence and authorized decisions into a contract that another capable agent can realize without inventing product meaning:

```text
consumer and problem
  -> current observable reality
  -> desired outcome
  -> normative requirement
  -> observable contract or constraint
  -> failure expectation
  -> proof obligation
```

Every `MUST` needs a legitimate basis. Every material requirement needs an observable consequence. Unresolved product meaning stays visible; internal component structure stays downstream in `program-design`.

## Boundary

This skill owns authoritative Why/What:

- problem, consumers, current observable behavior, outcomes, and non-goals;
- source authority and load-bearing user decisions;
- normative requirements and traceability;
- public or externally observable UI, API, CLI, data, configuration, and operational contracts;
- externally required failure, compatibility, security, reliability, performance, accessibility, privacy, and operability obligations;
- proof modalities required by material obligations;
- the specification artifact and author self-check.

It does not choose components, internal owners, dependency direction, state storage, call graphs, recovery mechanisms, task order, files, or exact validation commands. Route structural How to `program-design`, review-only work to `spec-program-review`, and one named runtime-skill package to `skills-creation`.

## Terminal Contract

Return exactly one:

```text
locally-ready
decision-needed
evidence-blocked
deferred
```

A `locally-ready` result includes the artifact identity and digest; an immutable governing-source inventory containing every source identity, version or digest, authority status, freshness/applicability, and scoped-completeness basis; the load-bearing decision inventory; requirement/proof inventory; author self-check; required independent local-review coverage; remaining gaps; and an explicit statement that pair acceptance is not claimed.

Produce terminal labels by observable condition:

- `locally-ready`: every completion blocker is cleared and the complete return above exists.
- `decision-needed`: legitimate sources cannot settle load-bearing product meaning, public behavior, compatibility, policy, or cost/risk tolerance; return the decision owner, options, evidence, and deferral consequence.
- `evidence-blocked`: required governing or observational evidence is missing, inaccessible, stale, or contradictory enough that a truthful obligation cannot be derived; return the exact evidence and access/state change needed.
- `deferred`: an authorized caller explicitly postpones scoped work after its consequence is recorded; return completed coverage, deferred scope, authority for deferral, consequence, and re-entry condition.

## Workflow

### 1. Establish authority, audience, and artifact boundary

Record `target classification: general-domain | runtime-skill-package`. IF the target is one named runtime skill package, require the explicit `skills-creation` parent packet/result identity that authorizes this composition. Without it, return the `skills-creation` route and stop before authoring.

MUST load `references/authority-and-problem-framing.md` for stages 1-2 to classify sources, authority, consumers, the current/desired gap, and unresolved decisions. At this stage, return the artifact boundary, consumer/authority model, and immutable source inventory with exact identity, version/digest, authority status, freshness/applicability, and scoped-completeness basis.

Inventory current sources before treating the draft as truth. External popularity is advisory evidence unless an authorized contract makes it normative.

IF an external platform, protocol, library, policy, or empirical claim could change product meaning or an observable obligation and current local sources do not establish it, perform a bounded lookup directly or use `research-swarm`; return the exact external source identity/version, authority status, transfer assumptions, and remaining evidence gap before deriving the affected obligation.

Completion: artifact boundary, consumers, decision authority, source classes, current observable reality, and authority conflicts are explicit.

### 2. Model the problem before proposing obligations

Name what happens today, who bears the cost, where it is observable, what proves it, and what would remain wrong if the requested feature existed only nominally. Keep implementation root cause separate from the observable problem.

Using the already-loaded `references/authority-and-problem-framing.md`, return the complete authority/problem model after this stage.

Completion: the current/desired gap is inspectable and each causal claim is evidenced or labeled as a hypothesis.

### 3. Define outcomes, non-goals, and semantic slices

State the outcomes the change must create and the nearest plausible expansions it will not create. Separate outcomes from requested mechanisms.

When independently governed capabilities, protocols, domains, or consumer journeys are mixed, split those semantic slices before polishing requirements.

Completion: each goal has an observable success condition, each material non-goal blocks a likely scope guess, and every slice has one reason to change.

### 4. Resolve decisions at the correct altitude

Search legitimate sources before asking. Ask only when product meaning, public behavior, irreversible compatibility, policy, or cost/risk tolerance remains undecidable.

Ask one load-bearing decision at a time with options, recommendation, evidence, gain, cost, foreclosed choices, and consequence of deferral. Delegation, vague assent, silence, or a topic change is not decision authority.

Completion: each load-bearing branch has durable authority evidence, is explicitly deferred with consequence, or produces `decision-needed`.

### 5. Derive normative requirements

MUST load `references/requirements-and-traceability.md` to construct requirements, repair vague or task-shaped statements, and return requirement-to-problem/outcome/basis coverage.

Completion: every goal is covered, every requirement has a basis and observable pass/fail consequence, and two capable implementers would not need to invent different product behavior.

### 6. Specify observable contracts and negative space

MUST load `references/observable-contracts.md` to inspect each load-bearing external surface and return its applicable contract, failure, compatibility, example, and undefined-behavior slots.

Completion: each consumer can predict normal, boundary, failure, partial-success, and compatibility behavior without knowing the internal architecture.

### 7. State cross-cutting obligations without designing their realization

For security, privacy, reliability, performance, accessibility, observability, data lifecycle, compliance, and platform compatibility, state the externally required guarantee or mark it not applicable with a reason.

Name assets, actors, prohibited outcomes, and security non-goals when sensitive behavior is in scope. Leave trust-boundary realization and enforcement calls to `program-design`.

Completion: applicable qualities are observable obligations or constraints, not adjectives or hidden implementation choices.

### 8. Define proof obligations

MUST load `references/proof-obligations.md` to map each material requirement to an evidence class and return requirement-to-modality coverage plus proof gaps.

Do not choose test files, commands, mocks, task order, or capture procedure. Those belong to program-design seams and planning mechanics.

Completion: every material obligation names evidence that could prove it, and no proof gap is hidden behind “test later.”

### 9. Author the smallest coherent artifact

MUST load `references/artifact-and-self-review.md` to choose the artifact structure, preserve the specification spine, and return the structure decision, traceability/navigation result, and artifact identity/digest.

Follow the repository's documented spec location; otherwise use `docs/specs/` for substantial file-backed work. Keep research ledgers and review reports out of the normative design artifact.

Section writers may organize already mapped meaning only. Their packet must name accepted claims and bases, prose boundary, prohibited invention, and required gap return. They may not originate requirements, invariants, option selections, failure policy, realizations, or normative prose.

Completion: every normative claim has one home and a stranger can navigate from problem to proof.

### 10. Run the author self-check

Using the Author Self-Check procedure in the already-loaded `references/artifact-and-self-review.md`, re-read the whole artifact. Check authority conflicts, traceability, vague obligations, missing contract/failure behavior, hidden How, contradictory goals/non-goals, proof gaps, and assumptions disguised as decisions, then return the digest-bound author self-check with exact gaps.

Completion: the current digest has a self-check result with exact passes and gaps. Self-check is never independent review.

### 11. Obtain fresh local review when required

Call `spec-program-review` using its `classify-review-requirement` operation with: target classification and the exact `skills-creation` parent packet/result identity when the target is a runtime skill package; requested future mode `specification-only`; the exact current artifact identity/digest; scope and claimed semantic effect; the immutable governing-source inventory and scoped-completeness basis; matched material-risk predicates; and `caller requirement: required | none` (default `none`). Consume the digest-bound `review-required | non-substantial` result, decision branch, basis, source coverage, caller requirement, and preserved target/parent identity.

When `review-required`, invoke `spec-program-review` separately in `specification-only` mode with fresh context and read-only authority, carrying the target classification and exact `skills-creation` parent packet/result identity when applicable. Route accepted Why/What findings back here. Any edit invalidates review of the prior digest.

Completion: current independent review covers the digest, or the exact `non-substantial` basis or blocking input is recorded.

### 12. Return the local result

Return the artifact identity/digest; immutable governing-source inventory with identity, version/digest, authority status, freshness/applicability, and scoped-completeness basis; decision inventory; requirement/proof inventory; self-check; independent local-review coverage; gaps; and non-acceptance boundary.

IF returning a substantial specification in chat and problem, consumer, authority, journey, or requirement-to-proof relationships are non-obvious, use `tui-presentation` to render only those Why/What relationships. Keep normative meaning in the artifact and route internal component, call, state, or failure-mechanism views to `program-design`.

Completion: the caller can invoke `program-design`, compose the result into caller-owned workflow state, or provide the exact missing decision/evidence without reinterpreting the artifact.

## Bounded Delegation

There is no default swarm. IF one bounded evidence, observable-surface, product-intent, contract, or already-mapped section-writing question benefits from independent work, use `manage-agents` to select the agent pattern and runtime.

The packet names the exact question, sources, accepted claims when writing, maximum authority, non-goals, and expected evidence. Delegation is parallel-safe only after the source inventory and semantic boundary exist. Instance authority is equal to or narrower than the packet and never includes requirement meaning or final prose integration. Return a `complete | partial | blocked` assignment receipt; the parent verifies sources and reduces the result.

## Completion Blockers

Do not return `locally-ready` while any of these hold:

- target classification is missing, or a runtime-skill-package target lacks the explicit `skills-creation` parent packet/result identity;
- a normative claim lacks authority or an explicit decision gap;
- the problem, outcome, requirement, contract/failure, and proof chain cannot be traced;
- unresolved product meaning is disguised as an assumption;
- a material non-goal is omitted, or an applicable cross-cutting quality lacks an observable obligation or constraint or a reasoned not-applicable result;
- internal architecture or implementation tasks are presented as requirements without an externally authoritative constraint;
- a section writer originated meaning;
- a required independent review is missing, stale, partial, silent, or blocked;
- the artifact digest, source coverage, or non-acceptance boundary is missing.
