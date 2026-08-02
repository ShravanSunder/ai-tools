---
name: spec-design
description: Use when defining or revising a specification's authoritative Why/What or semantically creating or correcting its journey maps, context diagrams, or requirement-coverage views, including the problem, consumers, outcomes, requirements, public or externally observable contracts, constraints, failure obligations, or proof obligations. Not for extracting tacit needs or unmade decisions, reconverging a drifted shared model, in-chat explanation with no durable specification artifact, pure format-only maintenance of settled specification artifacts, internal structural How, review-only requests, implementation planning, creating/updating/evaluating one named runtime skill package, or a standalone security scan/audit/threat model.
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

A `locally-ready` result includes the artifact identity; governing-source identities, authority, current applicability, and coverage; the confirmed goal boundary; the accepted requirements set; load-bearing decisions; requirement/proof inventory; author self-check; required independent local-review coverage; remaining gaps; and an explicit statement that pair acceptance is not claimed. These are returned workflow state, not narrative sections in the specification.

Produce terminal labels by observable condition:

- `locally-ready`: every completion blocker is cleared and the complete return above exists.
- `decision-needed`: legitimate sources cannot settle load-bearing product meaning, public behavior, compatibility, policy, or cost/risk tolerance; return the decision owner, options, evidence, and deferral consequence.
- `evidence-blocked`: required governing or observational evidence is missing, inaccessible, stale, or contradictory enough that a truthful obligation cannot be derived; return the exact evidence and access/state change needed.
- `deferred`: an authorized caller explicitly postpones scoped work after its consequence is recorded; return completed coverage, deferred scope, authority for deferral, consequence, and re-entry condition.

## Workflow

### 1. Establish authority, audience, and artifact boundary

Record `target classification: general-domain | runtime-skill-package`. IF the target is one named runtime skill package, require the explicit `skills-creation` parent packet/result identity that authorizes this composition. Without it, return the `skills-creation` route and stop before authoring.

MUST load `references/authority-and-problem-framing.md` for stages 1-2 to classify sources, authority, consumers, the current/desired gap, boundary check 1, accepted-requirements recovery, and unresolved decisions. At this stage, return the artifact boundary, consumer/authority model, governing-source identities and current applicability, confirmed boundary or exact owner decision needed, and accepted-requirements recovery result.

Inventory current sources before treating the draft as truth. External popularity is advisory evidence unless an authorized contract makes it normative.

IF load-bearing user or stakeholder meaning is unwritten, use `discuss-pathfinding` with the user-requirements destination and return the complete record, record identity and rows, goal-boundary model (boundary check 1), and explicit owner confirmation of that same current model or the exact owner decision needed. Classify the returned record in the governing-source inventory using `references/authority-and-problem-framing.md`. If the user declines extraction, reassess the remaining sources: continue when an alternate authoritative source exists; return `decision-needed` when owner meaning is missing; return `evidence-blocked` when necessary evidence is missing; keep only non-load-bearing uncertainty as a visible hypothesis gap. Decline itself selects no terminal label, and a hypothesis never authorizes a normative requirement or `locally-ready`.

The minimum accepted user-requirements source contract is:

```text
source identity
inspectable location when a human must verify the source
affected user and stakeholder classes
stable U identifiers
need or outcome and why it matters
row-level evidence and producer-owned authority state
priority and priority assigner
unresolved hypotheses
```

A row is normative-eligible only when its producer-owned authority state is `authorized`. A pathfinding record or an equivalent source may satisfy this contract; equivalent sources need not copy the pathfinding document shape and are normalized into the same stable specification identities, evidence/authority classifications, priorities, and gaps.

Before deriving normative requirements, consume the explicitly confirmed boundary check 1 or perform the same compact check from another governing source using `references/authority-and-problem-framing.md`. A new requirement outside the confirmed goal, affected classes, missing outcomes, non-goals, or complexity budget returns `decision-needed`; specification completeness does not authorize it.

IF an external platform, protocol, library, policy, or empirical claim could change product meaning or an observable obligation and current local sources do not establish it, perform a bounded lookup directly or use `research-swarm`; return the exact external source identity/version, authority status, transfer assumptions, and remaining evidence gap before deriving the affected obligation.

Completion: artifact boundary, consumers, decision authority, source classes, current observable reality, boundary check 1, accepted-requirements recovery, and authority conflicts are explicit.

### 2. Model the problem before proposing obligations

Name what happens today, who bears the cost, where it is observable, what proves it, and what would remain wrong if the requested feature existed only nominally. Keep implementation root cause separate from the observable problem.

Using the already-loaded `references/authority-and-problem-framing.md`, return the complete authority/problem model after this stage.

When revising existing artifacts, classify the requested correction before editing: requirements/Why/What, structural How, or both. Removing unrelated concurrency, cleanup, reporter, or lifecycle machinery is a How correction unless the authorized owner also changes users, outcomes, requirements, scenarios, defaults, or proof obligations. A How-only correction routes to `program-design` and does not authorize narrowing governing Why/What. When both change, settle the revised Why/What first.

For a semantic correction to an existing Why/What view, re-open its governing sources, re-run correction classification and the affected view predicate and semantic-field check, update affected trace links, and run artifact self-review. Skip unrelated stages unless the correction invalidates their source or decision result. Pure rendering-format changes route to `docs-maintain`.

Using the comparison taught by `references/authority-and-problem-framing.md`, build the accepted requirements set from the current owner-confirmed requirements record and boundary-check-1 result. If unavailable, recover the last inspectable owner-accepted governing baseline. If neither exists or the sources conflict, return `decision-needed` with the authority conflict; mutually narrowed current files never establish the baseline by themselves. Reuse the existing identities and coverage links for affected classes, U/P/O/R/C/V requirements, priorities and assigners, named variants such as skills or scenarios, customer defaults, observable contracts, constraints, and proof obligations. Do not create a separate ledger or duplicate document. Every removed or superseded item needs explicit owner authority.

Produce inspectable per-item coverage that names each accepted identity, authoritative meaning, and specification destination or owner-authorized supersession. A count or an assertion that coverage is intact is not coverage evidence.

Re-anchor before deriving or revising normative requirements: compare the proposed meaning with the confirmed goal, accepted requirements and non-goals, and existing foundation from boundary check 1. Return `aligned` or the exact mismatch. On mismatch, stop normative authoring and return the existing owner decision, or use `discuss-clarify-mental-models` when the shared model itself drifted. Keep the comparison in returned workflow state, not durable specification prose.

Completion: the current/desired gap is inspectable, each causal claim is evidenced or labeled as a hypothesis, accepted-requirements coverage is inspectable when applicable, and the Re-anchor comparison is aligned or has returned the exact mismatch and owner route.

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

For substantial or uncertain work, stage source notes, alternative wording, prototype views, and temporary U→P→O→R→C→V comparisons in private working state, the repository's ignored scratch convention, or `tmp/design-workflows/<date>-<slug>/`. Quick work keeps the comparison in working state. Scratch never owns normative meaning or becomes required reading.

For each requirement, contract, failure obligation, constraint, and proof obligation, name the confirmed need it serves and what becomes observably false or unverifiable if removed. Delete an element that changes neither the confirmed outcome nor a necessary truth boundary; a template slot does not authorize adjacent work.

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

Apply the Required Why/What Views predicates. IF one or more predicates fire, load `../../shared-references/diagram-rendering-and-fallbacks.md` before the local artifact reference to render the selected views and return the selected medium, fallback decision, semantic-preservation result, and visual-check result for each firing.

MUST load `references/artifact-and-self-review.md` with the Required Why/What Views decisions and rendering results to choose the artifact structure, preserve the specification spine, apply view discrimination and pruning, and return the structure decision, traceability/navigation result, view-verification result, pruned elements, artifact identity, and exact view gaps.

Follow the repository's documented spec location; otherwise use `docs/specs/` for substantial file-backed work. Keep research ledgers and review reports out of the normative design artifact.

Author top-down: begin with the smallest Why/What map a human needs to confirm the problem and intended outcome, then reveal requirements, observable contracts, failures, constraints, and proof. Link every normative-eligible U row to the obligation it authorizes. When companion artifacts exist, expose one compact `requirements -> specification -> program design` path instead of repeating their roles.

Section writers may organize already mapped meaning only. Their packet must name accepted claims and bases, prose boundary, prohibited invention, and required gap return. They may not originate requirements, invariants, option selections, failure policy, realizations, or normative prose.

Completion: every normative claim has one home; a stranger can navigate from user need through problem, obligation, observable behavior, and proof; and every accepted identity has an inspectable destination or owner-authorized supersession.

### 10. Run the author self-check

Using the Author Self-Check procedure in the already-loaded `references/artifact-and-self-review.md`, re-read the whole artifact. Check authority conflicts, accepted-requirements coverage, traceability, vague obligations, missing contract/failure behavior, hidden How, contradictory goals/non-goals, proof gaps, assumptions disguised as decisions, process residue, obscure headings, duplicated companion narration, and reader-facing elements that fail the human deletion test, then return the author self-check with exact gaps.

Completion: the current artifact has a self-check result with exact passes and gaps. Self-check is never independent review.

### 11. Obtain fresh local review when required

Call `spec-program-review` using its `classify-review-requirement` operation with: target classification and the exact `skills-creation` parent packet/result identity when the target is a runtime skill package; requested future mode `specification-only`; the current artifact identity; scope and claimed semantic effect; governing-source coverage; matched material-risk predicates; and `caller requirement: required | none` (default `none`). Consume the `review-required | non-substantial` result, decision branch, basis, source coverage, caller requirement, and preserved target/parent identity.

When `review-required`, invoke `spec-program-review` separately in `specification-only` mode with fresh context and read-only authority, carrying the target classification and exact `skills-creation` parent packet/result identity when applicable. Route accepted Why/What findings back here. After a later edit, use `spec-program-review` to refresh coverage when meaning changed; parent-verified non-semantic edits may retain coverage.

Completion: current independent review semantically covers the current artifact, or the exact `non-substantial` basis or blocking input is recorded.

### 12. Return the local result

Return the artifact identity; governing-source identities, authority, current applicability, and coverage; confirmed boundary; accepted requirements set; decision inventory; requirement/proof inventory; self-check; independent local-review coverage; gaps; and non-acceptance boundary.

IF returning a substantial specification in chat and problem, consumer, authority, journey, or requirement-to-proof relationships are non-obvious, use `tui-presentation` to render only those Why/What relationships. Keep normative meaning in the artifact and route internal component, call, state, or failure-mechanism views to `program-design`.

Completion: the caller can invoke `program-design`, compose the result into caller-owned workflow state, or provide the exact missing decision/evidence without reinterpreting the artifact.

## Required Why/What Views

Use a view only when it exposes a load-bearing Why/What relationship. This table is the sole owner of view predicates, cardinality, and required semantic fields:

| View | Use when | Must expose |
| --- | --- | --- |
| journey map | per normative-eligible load-bearing direct-user class when the job has a material sequence or pain relationship and the view makes that relationship easier to confirm or correct | one view for that class exposing user-worded steps, observed pain and evidence, desired observable difference, and cited U rows; reuse or link a current requirements-level sequence when it already exposes these fields, and keep the user-requirements source as the normative home |
| context diagram | two or more external consumers or observable surfaces exist | consumers and stakeholders, observable surfaces/contracts, relevant negative space, and the system as one opaque node |
| requirement coverage table | material requirements exist | U when present, P, O, R, C, and V links plus gaps |

The first internal component, owner, dependency edge, state store, or enforcement point inside the system crosses into `program-design`. Diagrams may explain relationships but may not be the only home of normative meaning.

## Bounded Delegation

There is no default swarm. IF one bounded evidence, observable-surface, product-intent, contract, or already-mapped section-writing question benefits from independent work, use `manage-agents` to select the agent pattern and runtime.

The packet names the exact question, sources, accepted claims when writing, maximum authority, non-goals, and expected evidence. Delegation is parallel-safe only after the source inventory and semantic boundary exist. Instance authority is equal to or narrower than the packet and never includes requirement meaning or final prose integration. Return a `complete | partial | blocked` assignment receipt; the parent verifies sources and reduces the result.

## Completion Blockers

Do not return `locally-ready` while any of these hold:

- target classification is missing, or a runtime-skill-package target lacks the explicit `skills-creation` parent packet/result identity;
- a normative claim lacks authority or an explicit decision gap;
- a user-facing normative requirement is based on a row whose authority state is not `authorized`, or normative-eligible user-requirements rows cannot be traced by stable U identifier;
- boundary check 1 lacks explicit owner confirmation, or the specification expands its goal, affected classes, missing outcomes, non-goals, or complexity budget without a new owner decision;
- the accepted requirements set cannot be recovered from the current owner-confirmed source or last inspectable owner-accepted baseline, conflicts with those sources, lacks inspectable per-item coverage, or loses an item without owner-authorized supersession;
- the problem, outcome, requirement, contract/failure, and proof chain cannot be traced;
- unresolved product meaning is disguised as an assumption;
- a material non-goal is omitted, or an applicable cross-cutting quality lacks an observable obligation or constraint or a reasoned not-applicable result;
- internal architecture or implementation tasks are presented as requirements without an externally authoritative constraint;
- an applicable Required Why/What View lacks the required cardinality, semantic fields, passed rendering result, or separate normative home;
- a section writer originated meaning;
- a required independent review is missing, stale, partial, silent, or blocked;
- target classification, governing-source coverage, self-check, readiness, review state, or acceptance/PR narration appears as specification prose instead of returned workflow state;
- the artifact identity, source coverage, or non-acceptance boundary is missing.
