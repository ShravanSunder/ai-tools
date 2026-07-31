---
name: program-design
description: Use when defining or revising structural How—the internal architecture—against settled observable obligations, including components, ownership, internal interfaces, state, calls, flows, failure/recovery, concurrency/consistency, compatibility/cutover, trust boundaries, or proof seams. Not for authoring Why/What, review-only requests, implementation task planning, creating/updating/evaluating one named runtime skill package, a standalone security scan/audit/threat model, or an explicitly requested legacy spec-creation-swarm run.
---

# Program Design

A program design is an executable mental model of structural How.

It explains how authoritative obligations become owned runtime behavior:

```text
requirement
  -> current-system evidence and constraint degree
  -> structural crux and credible alternatives
  -> selected target composition
  -> responsible target component
  -> owned truth / decision
  -> interface contract
  -> state transition
  -> normal flow
  -> failure / recovery / concurrency behavior
  -> proof seam
```

The design is not a component inventory. It must compose: a reader can walk the main flow, locate each source of truth, simulate material failures/interleavings, and see where proof observes the behavior.

## Boundary

This skill owns:

- current-system modeling and target alternatives;
- component trees, singular ownership, dependency direction, and internal interfaces;
- state/lifecycle, control/data/call flows, migration/cutover, failure/recovery, concurrency, and consistency;
- structural realization of security, reliability, performance, privacy, accessibility, observability, compliance, and platform obligations;
- proof seams and structural enforcement classes;
- program-design artifacts and author integration self-check.

It does not invent product meaning, observable obligations, task/file order, exact commands, or review verdicts. Route missing Why/What to `spec-design`, review-only work to `spec-program-review`, planning mechanics to plan creation, and one named runtime-skill package to `skills-creation`.

## Terminal Contract

Return exactly one:

```text
locally-ready
specification-gap
evidence-blocked
decision-needed
deferred
```

A `locally-ready` result includes the program-design identity/digest; governing specification identity/digest; an immutable source inventory containing every current-system, constraint, platform, and external source identity, version or digest, authority status, freshness/applicability, and scoped-completeness basis; structural model; requirement-realization inventory; author self-check; required independent local-review coverage; debt/gaps; and explicit non-acceptance.

Produce terminal labels by observable condition:

- `locally-ready`: every completion blocker is cleared and the complete return above exists.
- `specification-gap`: governing Why/What is missing, conflicting, stale, or would be silently invented; return the exact gap and `spec-design` route.
- `evidence-blocked`: load-bearing current-system, platform, feasibility, or proof-path evidence is missing, inaccessible, stale, or contradictory; return the exact evidence and access/state change needed.
- `decision-needed`: two or more viable structural directions remain and selection requires owner-controlled cost, risk, compatibility, or policy tolerance not settled by the specification; return the decision owner, alternatives, tradeoffs, falsifiers, and deferral consequence.
- `deferred`: an authorized caller explicitly postpones scoped work after its consequence is recorded; return completed coverage, deferred scope, authority for deferral, consequence, and re-entry condition.

## Workflow

### 1. Validate authoritative Why/What

Record `target classification: general-domain | runtime-skill-package`. IF the target is one named runtime skill package, require the explicit `skills-creation` parent packet/result identity that authorizes this composition. Without it, return the `skills-creation` route and stop before modeling How.

Read the entire governing specification and bind its digest. Extract requirements, observable contracts, constraints, failure expectations, proof modalities, non-goals, and open decisions.

Classify gaps as `missing meaning | conflicting meaning | feasibility question | design choice | planning detail`. Missing or conflicting meaning returns `specification-gap`; do not patch it locally.

Completion: governing digest, requirement inventory, non-goals, and route-back gaps are explicit.

### 2. Build the current-system model from sources

MUST load `references/current-system-model.md` to reconstruct representative execution paths from real entrypoints through named callers/callees, owners, state mutations or side effects, and observable results/errors; use runtime stack traces, logs, traces, tests, and source navigation when available to validate the dynamic path. Return the source-grounded current-system model, normalized current call paths, and inference gaps.

IF an external platform, protocol, library, sandbox, runtime, or empirical claim could change feasibility, structure, or proof and current local sources do not establish it, perform a bounded lookup directly or use `research-swarm`. IF delegation is useful, the external-prior-art-platform lane may perform that lookup under the Bounded Delegation contract; delegation is not required. Return the exact external source identity/version, authority status, transfer assumptions, structural consequence, and remaining evidence gap before selection.

Completion: current behavior and degree of constraint are source-backed, and `changes / remains authoritative` is explicit.

### 3. State the crux and forces

MUST load `references/alternatives-and-crux.md` for stages 3-4 to identify the structural crux, forces, viable alternatives, tradeoffs, falsifiers, and selection method. At this stage, return the crux, forces, and any evidence gap that blocks credible alternatives.

Completion: the design problem is expressed as falsifiable structural choices rather than generic quality goals.

### 4. Generate viable alternatives

Use minimal-change, clean-boundary, pragmatic, and risk perspectives as lenses, not mandatory fan-out. Compare credible alternatives only when a material choice exists.

Using the already-loaded `references/alternatives-and-crux.md`, return the credible alternatives, comparison, selected direction, tradeoffs, debt/payer, falsifiers/revisit signals, and unresolved decision/evidence gaps.

Completion: the selected direction names what improves, where cost moves, accepted debt/payer, and evidence that would reopen the choice.

### 5. Select the target composition

MUST load `references/components-ownership-interfaces.md` for stages 5-7 to construct the target component tree, apply depth/deletion tests, assign singular ownership and dependency direction, and define behavioral interface contracts. At this stage, return the integrated overview and target component tree.

Build the integrated overview before detailing mechanisms. For UI/refactor work, include the render/component tree and distinguish state owners, pure views, integration/effect boundaries, and derived state.

Completion: each component has one job, reason to change, consumers, owned behavior, and justified interface.

### 6. Assign ownership and dependency direction

Name one authoritative owner for each material truth, invariant, lifecycle, and side effect. Define allowed and forbidden edges plus how violations are detected.

Completion: no second source of truth or unexplained shared responsibility remains.

### 7. Define interfaces as behavioral boundaries

Specify caller-visible guarantees, not only signatures. Derive at least one representative interaction from consumer needs while hiding owner policy.

Using the already-loaded `references/components-ownership-interfaces.md`, return the component tree, ownership/dependency maps, behavioral interface contracts, forbidden edges, and gaps.

Completion: a planner can later locate implementation surfaces without deciding interface semantics.

### 8. Model state and lifecycle

MUST load `references/state-calls-and-flows.md` for stages 8-9 to construct applicable state transitions, end-to-end flows, and compatibility/migration/cutover phase models. At this stage, return the state/lifecycle model.

Use a state machine or table when timing/order changes correctness. Distinguish persisted, derived, cached, and synchronized state.

Completion: every write path reaches one owner and illegal transitions have defined handling.

### 9. Draw normal control, data, and call flows

Trace each material requirement from consumer to owner and observable outcome. Include async/background, event, persistence, cache, and proof-harness paths when they alter semantics.

Using the already-loaded `references/state-calls-and-flows.md`, return the state transitions, source-anchored target call graph or sequence from entrypoint to effect and result/error, end-to-end control/data flows, and compatibility/migration/cutover phase models.

Completion: there is no “and then magic happens” hop; migration phases each name authority, version skew, transition, rollback/reconciliation, failure, and proof.

### 10. Design failure, partial success, and recovery

MUST load `references/failure-concurrency-recovery.md` for stages 10-11 to construct detection, containment, retry, idempotency, timeout/cancellation, cleanup, partial-success, recovery, ordering, and consistency decisions. At this stage, return the failure/partial-success/recovery model.

Completion: failure flows are as explicit as happy paths and every recovery action has one owner.

### 11. Design concurrency and consistency

Model overlap only when multiple actors, processes, renders, requests, events, or retries can interact. State ordering, atomicity, conflict resolution, duplicates/out-of-order behavior, mechanism class, and backpressure where applicable.

Using the already-loaded `references/failure-concurrency-recovery.md`, return the complete failure/recovery, concurrency, ordering, and consistency decisions plus gaps.

Completion: every material interleaving preserves invariants or has defined conflict/failure behavior.

### 12. Realize cross-cutting obligations

MUST load `references/cross-cutting-realization.md` to map each applicable quality obligation and return its structural owner, mechanism/boundary, failure or degradation behavior, proof seam, or reasoned not-applicable result.

Standalone security scans remain separate; ordinary trust-boundary architecture remains program design.

Completion: each applicable obligation has structural How or a reasoned not-applicable result.

### 13. Define proof architecture and structural enforcement

MUST load `references/proof-architecture-and-traceability.md` to return requirement realization, proof seams, real/fake boundary decisions, and enforcement classes.

Do not choose exact test files, commands, or execution order.

Completion: every material requirement has an observable seam and every load-bearing rule has an enforcement class or explicit proof gap.

### 14. Trace, simplify, and author the artifact

MUST load `references/artifact-and-self-review.md` to select the smallest useful design views, consume and verify the requirement/design/proof trace, prune no-op mechanisms, and return the artifact decision, artifact identity/digest, trace-navigation result, and pruned elements.

Render each selected view in a form the destination supports: prefer Mermaid in durable Markdown when the repository renders it, use `tui-presentation` for chat or terminal explanation, use tables for dense ownership or transition data, and fall back to readable plain text when no renderer exists.

Section writers/modelers may express only already selected requirements, components, ownership, interfaces, state/failure policies, and claims. Unmapped needs return as gaps.

Completion: each design element serves an obligation, constraint, failure policy, or proof need.

### 15. Run the author integration self-check

Using the Integration Self-Check procedure in the already-loaded `references/artifact-and-self-review.md`, re-read the complete artifact for component composition, singular ownership, dependency direction, interfaces, state/flow/failure consistency, concurrency, cross-cutting realization, proof seams, plan leakage, and unresolved specification meaning, then return the digest-bound integration self-check with exact gaps.

Completion: the current digest has exact passes and gaps. Self-check is never independent review.

### 16. Obtain fresh local review when required

Call `spec-program-review` using `classify-review-requirement` with: target classification and the exact `skills-creation` parent packet/result identity when the target is a runtime skill package; requested future mode `program-only`; exact program-design and governing-specification identities/digests; scope and claimed semantic effect; the immutable governing-source inventory and scoped-completeness basis; matched material-risk predicates; and `caller requirement: required | none` (default `none`). Consume the digest-bound `review-required | non-substantial` result, decision branch, basis, source coverage, caller requirement, and preserved target/parent identity.

When required, invoke `spec-program-review` separately in `program-only` mode with fresh context and read-only authority, carrying the target classification and exact `skills-creation` parent packet/result identity when applicable. Route Why/What findings to `spec-design`; route How findings back here. Edits invalidate prior coverage.

Completion: current independent review covers both digests, or the exact non-substantial basis/block is recorded.

### 17. Return the local result

Return artifact and governing-specification identities/digests; immutable source inventory with identity, version/digest, authority status, freshness/applicability, and scoped-completeness basis; structural and requirement-realization maps; self-check; independent review; debt/gaps; and non-acceptance.

IF returning a substantial program design in chat, use `tui-presentation` to render the selected component, call, state, or failure views before the compact result summary. The durable artifact remains the source of truth.

Completion: the caller can request pair review through `spec-program-review` or supply the exact missing specification decision/evidence.

## Required Views

Use a view only when it exposes a load-bearing relationship:

| View | Use when | Must expose |
| --- | --- | --- |
| component tree | three or more components/levels or contested ownership | responsibility, owner, consumers, reason to change |
| call graph/sequence | control crosses owners or async boundaries | entrypoint-to-effect caller/callee chain, sync/async/event edges, result/error path, evidence anchors |
| proof call graph | proof harness differs from production path | seam, real/fake boundary, observation |
| state machine/table | lifecycle/order changes correctness | owner, states, transitions, guards, illegal paths |
| data/event flow | data crosses storage/process/service boundaries | authority, transformations, persistence/privacy |
| failure/recovery flow | partial failure, retry, or compensation exists | detection, containment, retry, cleanup, recovery owner |
| trust-boundary view | untrusted actors/input/secrets/processes exist | assets, entry points, policy owner, enforcement, containment |
| requirement/design/proof trace | multiple requirements or components interact | realization owner and proof seam per requirement |

Paths are valid current-source or traceability anchors; the design must not become a future task inventory.

## Bounded Delegation

There is no fixed swarm. Select a lane only when its observable predicate holds:

```text
current sources constrain ownership/calls/state/proof and the parent lacks a model
  -> references/lanes/current-system-explorer.md
one bounded external question could change feasibility/structure/proof
  -> references/lanes/external-prior-art-platform.md
selected claims need one component/call/state/data/failure view
  -> references/lanes/component-flow-modeler.md
a named crux has at least two credible structural choices
  -> references/lanes/alternatives-advisor.md
one cross-cutting concern materially shapes structure
  -> references/lanes/risk-realization-specialist.md
one section has fully mapped meaning and only needs expression
  -> references/lanes/section-writer.md
```

Before any optional dispatch, MUST use `manage-agents` to resolve the agent pattern, exact Sol model/reasoning when constrained by the caller, runtime, history, workspace access, permissions, packet, and receipt mechanics.

IF a predicate holds and delegation is useful, MUST load `references/lanes/lane-schema.md` and return its shared packet and receipt contract. Dispatch the selected lane by instantiating every packet field from that contract with the exact assignment, governing and current artifact state, observed predicate and prerequisites, bounded question and sources, settled meaning, selected-lane authority, non-goals, expected return, and stop condition.

The subagent loads `references/lanes/lane-schema.md` and the exact selected lane path named above.

Parallel-safe only after the lane prerequisites exist and its result is not an input to another selected lane; scheduling may serialize. Instance authority is equal to or narrower than the lane maximum and never includes final design selection, normative integration, pair review, or acceptance. Return a `complete | partial | blocked` receipt; after one explicit follow-up, silence is `no-receipt`. The parent opens load-bearing sources, verifies candidate evidence/models/advice/prose, resolves conflicts, and alone integrates.

## Planning Boundary

Program design settles owners, boundaries, interfaces, state, flows, recovery/concurrency, cutover, trust, and proof seams. Planning chooses task slices, write scopes, DAG/order, exact tests/commands, red/green sequence, evidence capture, checkpoints, deployment, and rollback procedure.

## Completion Blockers

Do not return `locally-ready` while any of these hold:

- target classification is missing, or a runtime-skill-package target lacks the explicit `skills-creation` parent packet/result identity;
- authoritative Why/What is missing, stale, conflicting, or silently rewritten;
- target structure was selected without current-system evidence or a named greenfield basis;
- a material structural choice lacks credible alternatives, explicit tradeoffs, accepted debt and payer, or falsifiers/revisit signals;
- a material component lacks one owner, reason to change, consumer, or behavioral interface;
- a material behavior with current implementation lacks a source-grounded current call path, or any material behavior lacks a target entrypoint-to-effect call graph or sequence with result/error return;
- an applicable Required View was selected but not rendered in an inspectable form, or a substantial design with contested ownership or cross-owner control remains prose-only;
- state, flow, failure/recovery, concurrency, migration, trust, or proof semantics are applicable but undefined;
- a delegated writer/modeler originated design meaning;
- planning would still need to invent an owner, interface, state/failure policy, trust control, or proof seam;
- required independent review is missing, stale, partial, silent, or blocked;
- artifact/specification digests, source coverage, or non-acceptance are missing.
