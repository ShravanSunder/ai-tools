---
name: program-design
description: Use when defining or revising structural How—the internal architecture—or its required structural views and diagrams, against settled observable obligations, including components, ownership, internal interfaces, state, calls, flows, failure/recovery, concurrency/consistency, compatibility/cutover, trust boundaries, or proof seams. Not for authoring Why/What, in-chat explanation of settled architecture with no program-design authoring, pure format-only maintenance of settled program-design artifacts, review-only requests, implementation task planning, creating/updating/evaluating one named runtime skill package, or a standalone security scan/audit/threat model.
---

# Program Design

A program design is the structural realization of a fixed observable contract.

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

A `locally-ready` result includes the program-design and governing-specification identities; the confirmed goal boundary and accepted requirements set from `spec-design`; current-system, constraint, platform, and external source identities with current applicability; structural model and call-path deltas; requirement-realization inventory; structural-realization confirmation; author self-check; required independent local-review coverage; debt/gaps; and explicit non-acceptance. These are returned workflow state, not narrative sections in the program-design artifact.

A bounded scope decision, design excerpt, or chat explanation without that complete return cannot be `locally-ready`, even when its selected structure is sound.

Produce terminal labels by observable condition:

- `locally-ready`: every completion blocker is cleared and the complete return above exists.
- `specification-gap`: governing Why/What is missing, conflicting, stale, or would be silently invented; return the exact gap and `spec-design` route.
- `evidence-blocked`: load-bearing current-system, platform, feasibility, or proof-path evidence is missing, inaccessible, stale, or contradictory; return the exact evidence and access/state change needed.
- `decision-needed`: two or more viable structural directions remain and selection requires owner-controlled cost, risk, compatibility, or policy tolerance not settled by the specification; return the decision owner, alternatives, tradeoffs, falsifiers, and deferral consequence.
- `deferred`: an authorized caller explicitly postpones scoped work after its consequence is recorded; return completed coverage, deferred scope, authority for deferral, consequence, and re-entry condition.

After producing the terminal result, return exactly one phase-guided route:

```text
locally-ready      -> recommend spec-program-review in pair mode
specification-gap  -> recommend spec-design
decision-needed    -> recommend discuss-pathfinding only when this skill's
                      method identifies an unmade owner-controlled structural
                      choice; required return owner: program-design;
                      otherwise stop with the exact owner decision
evidence-blocked | deferred -> stop with the exact reason
```

Before recommending a skill, inspect that destination's declared inputs and return a compact pointer-based handoff containing relevant artifact and governing-source pointers, the phase result and current boundary status, the exact gap or decision, and why that destination owns the next work. A pair-review handoff includes the specification and program-design identities, confirmed goal boundary and accepted requirements set, structural-realization confirmation, constraints/non-goals, claimed proof and gaps, and review question. Exclude copied artifacts, unrelated implementation history, and orchestration counters. A direct program-design invocation carries no cycle budget.

## Workflow

### 1. Validate authoritative Why/What

Record `target classification: general-domain | runtime-skill-package`. IF the target is one named runtime skill package, require the explicit `skills-creation` parent packet/result identity that authorizes this composition. Without it, return the `skills-creation` route and stop before modeling How.

Read the entire governing specification and the confirmed goal boundary accepted by `spec-design`. Extract requirements, observable contracts, constraints, failure expectations, proof modalities, non-goals, open decisions, owner-set package or system limits, and the accepted requirements set. If the specification does not carry or point to the confirmed goal boundary and accepted requirements set, return the exact `spec-design` gap before selecting target structure; program design does not reconstruct Why/What authority.

Classify gaps as `missing meaning | conflicting meaning | feasibility question | design choice | planning detail`. Missing or conflicting meaning returns `specification-gap`; do not patch it locally.

Classify a requested correction as requirements/Why/What, structural How, or both. Removing unrelated implementation machinery is How unless the owner changes governing outcomes or scope. For How-only corrections, consume the accepted requirements set as fixed input. When both change, return to `spec-design` first and resume only after revised Why/What is settled.

For a semantic correction to a structural view, reload current-system evidence and the governing obligation, re-run the affected ownership/interface/call/state/flow decision and view predicate, update affected trace links, and run artifact self-review. Skip unrelated stages unless the correction changes their source, owner, or invariant. Pure rendering-format changes route to `docs-maintain`.

Completion: governing specification, confirmed goal boundary, accepted requirements set, requirement inventory, non-goals, correction class, and route-back gaps are explicit.

### 2. Build the current-system model from sources

MUST load `references/current-system-model.md` to reconstruct representative execution paths from real entrypoints through named callers/callees, owners, state mutations or side effects, and observable results/errors; use runtime stack traces, logs, traces, tests, and source navigation when available to validate the dynamic path. Return the source-grounded current-system model, normalized current call paths, and inference gaps.

IF an external platform, protocol, library, sandbox, runtime, or empirical claim could change feasibility, structure, or proof and current local sources do not establish it, perform a bounded lookup directly or use `research-swarm`. IF delegation is useful, the external-prior-art-platform lane may perform that lookup under the Bounded Delegation contract; delegation is not required. Return the exact external source identity/version, authority status, transfer assumptions, structural consequence, and remaining evidence gap before selection.

Completion: current behavior and degree of constraint are source-backed, and `changes / remains authoritative` is explicit.

For each dimension—components, interfaces, state, calls/flows, failure/recovery, concurrency/consistency, compatibility/cutover, trust, and proof—record one applicability judgment in working state or the returned self-check:

```text
required by a named specification obligation
satisfied by the existing system and linked to evidence
not applicable, with the reason when omission could look like a gap
unresolved and requiring evidence or an owner decision
```

These are inspection questions, not mandatory artifact sections. Never invent a store, protocol, retry policy, migration, governance surface, or other subsystem merely to make a category non-empty.

### 3. State the crux and forces

MUST load `references/alternatives-and-crux.md` for stages 3-4 and apply its structural-crux, forces, alternatives, tradeoff, falsifier, and selection method in working state. Surface only an evidence gap that blocks credible alternatives.

Completion: the design problem is expressed as falsifiable structural choices rather than generic quality goals.

### 4. Generate viable alternatives

Start with the existing foundation and its minimal-change realization. Use clean-boundary, pragmatic, and risk perspectives only when they produce a materially different credible structure. Compare alternatives only when a real choice exists; do not manufacture an architecture to fill the alternatives stage.

Using the already-loaded `references/alternatives-and-crux.md`, select the direction and record its tradeoffs, debt/payer, falsifiers/revisit signals, and unresolved decision/evidence gaps for the terminal result.

New durable identity or history, persistence, certification or governance, a control plane, an external service, cross-run state, or a broad migration is material scope expansion when the confirmed goal boundary did not authorize it. Return the owner decision needed to allow that additional complexity rather than making the mechanism inevitable through design prose.

Re-anchor before selecting target composition: compare the selected direction with the confirmed goal, accepted requirements and non-goals, permitted and protected systems, owner-set package limits, existing foundation, smallest workable change, and acceptable complexity. Delete a mechanism when no confirmed obligation needs it. If pursuing it would widen the confirmed goal boundary or budget, return the exact mismatch and owner expansion decision instead of completing the mechanism. Keep this comparison in returned workflow state, not durable program-design prose.

Explain the selection in ordinary language: what changes, what stays the same, why the smaller structure is enough, what it costs, who bears that cost, and what evidence would justify a larger design. A request to use architecture vocabulary does not replace any of those concrete answers; labels such as “minimal structural delta” or “clean boundary” may summarize the explanation but may not carry it.

Completion: the selected direction names what improves, where cost moves, accepted debt/payer, complexity spent, and evidence that would reopen the choice; the Re-anchor comparison is aligned, has deleted unsupported machinery, or has returned the exact expansion decision; and the actual choice and tradeoff are explained in ordinary language.

### 5. Select the target composition

MUST load `references/components-ownership-interfaces.md` for stages 5-7 and apply its target-tree, depth/deletion, ownership, dependency, and behavioral-interface method in working state.

Build the integrated overview before detailing mechanisms. For UI/refactor work, include the render/component tree and distinguish state owners, pure views, integration/effect boundaries, and derived state.

For every new component, state store, identity, interface, contract, dependency, migration, operating surface, or proof mechanism, name the specification obligation it serves, what breaks if removed, why the existing foundation cannot supply it, and why it remains within the agreed acceptable complexity. Delete it when no confirmed obligation breaks; do not complete missing contracts for an unnecessary mechanism.

Completion: each component has one job, reason to change, consumers, owned behavior, and justified interface.

### 6. Assign ownership and dependency direction

Name one authoritative owner for each material truth, invariant, lifecycle, and side effect. Define allowed and forbidden edges plus how violations are detected.

Completion: no second source of truth or unexplained shared responsibility remains.

### 7. Define interfaces as behavioral boundaries

Specify caller-visible guarantees, not only signatures. Derive at least one representative interaction from consumer needs while hiding owner policy.

Using the already-loaded `references/components-ownership-interfaces.md`, complete the component tree, ownership/dependency maps, behavioral interface contracts, forbidden edges, and gaps for the artifact and terminal result.

Completion: a planner can later locate implementation surfaces without deciding interface semantics.

### 8. Model state and lifecycle

MUST load `references/state-calls-and-flows.md` for stages 8-9 and apply its state/lifecycle, current-to-proposed call-path, flow, and migration/cutover method in working state.

Use a state machine or table when timing/order changes correctness. Distinguish persisted, derived, cached, and synchronized state.

Completion: every write path reaches one owner and illegal transitions have defined handling.

### 9. Draw normal control, data, and call flows

Trace each material requirement from consumer to owner and observable outcome. Include async/background, event, persistence, cache, and proof-harness paths when they alter semantics.

Using the already-loaded `references/state-calls-and-flows.md`, return the state transitions; for every material runtime-behavior group, the source-anchored current and proposed entrypoint-to-effect paths or proposed-only with explicit no predecessor; added, removed, and changed owner/caller/callee/state/effect/result-error edges plus unchanged edges whose preservation is requirement-critical, safety-critical, or contested; end-to-end control/data flows; and compatibility/migration/cutover phase models. Requirements sharing one path may cite one delta. A raw stack trace is evidence, not the design output.

Completion: there is no “and then magic happens” hop; every applicable runtime-behavior design has a visible call path and marked delta edges; migration phases each name authority, version skew, transition, rollback/reconciliation, failure, and proof.

### 10. Design failure, partial success, and recovery

MUST load `references/failure-concurrency-recovery.md` for stages 10-11 and apply its detection, containment, retry, idempotency, timeout/cancellation, cleanup, partial-success, recovery, ordering, and consistency method in working state.

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

Apply the Required Views predicates. For each selected view, state the reader question it answers: who owns what, how a request reaches its effect and returns a result, how state changes, how failure is contained or recovered, or how requirements map to owners and proof. IF one or more predicates fire, load `../../shared-references/diagram-rendering-and-fallbacks.md` before the local artifact reference to render the selected views and return the selected medium, fallback decision, semantic-preservation result, and visual-check result for each firing.

Keep distinct reader questions in separate views when combining them would hide an owner, call edge, state transition, failure path, or proof seam. A request for one diagram or valid Mermaid syntax does not override the fired view predicates or semantic fields.

Rejecting a requested medium as lossy does not complete a fired view. Select and render the clearest supported alternative that preserves the required semantic fields. In a read-only or chat-only run, show that view in the response; explaining the fallback without producing it leaves the view incomplete.

Do not present unverified Mermaid as the readable result. Follow the shared rendering reference to produce the next simplest inspectable fallback that preserves the relationship, or return the exact visual gap.

MUST load `references/artifact-and-self-review.md` with the Required Views decisions and rendering results to consume and verify the requirement/design/proof trace, apply view examples and pruning, and return the artifact decision, artifact identity, trace-navigation result, view-verification result, pruned elements, and exact view gaps.

For substantial or uncertain work, stage source notes, current/target comparisons, credible alternatives, prototype component/call/state/failure views, and temporary requirement→design→proof crosswalks in private working state, the repository's ignored scratch convention, or `tmp/design-workflows/<date>-<slug>/`. Quick work keeps the comparison in working state. Scratch is optional evidence, never a normative home or required reading.

Author top-down. Begin with the smallest integrated overview—composed from already-fired views or concise prose—that lets a human explain how the specified behavior works, then reveal components, interfaces, call paths, state, flows, failure/recovery, concurrency, cutover, trust, and proof. Link through the immediate specification scenario or observable contract rather than jumping from raw customer needs directly to components.

Section writers/modelers may express only already selected requirements, components, ownership, interfaces, state/failure policies, and claims. Unmapped needs return as gaps.

After deletion or simplification, compare coverage with the accepted requirements set. Many mechanisms may become fewer; the complete accepted requirements set from `spec-design` — affected classes, stable identities and requirements, priorities and assigners, named variants, defaults, observable contracts, constraints, and proof obligations — may not lose any item without owner authority. Stop on a conflict with mutually narrowed current files.

Completion: each design element serves an obligation, constraint, failure policy, or proof need; after any deletion or simplification pass, every accepted identity has an inspectable `covered | owner-authorized supersession | gap` disposition and anchor, with shared rows allowed only when every member identity is enumerated and has the same disposition and anchor; and every fired Required View has a passed rendering result with its semantic fields preserved.

### 15. Run the author integration self-check

Using the Integration Self-Check procedure in the already-loaded `references/artifact-and-self-review.md`, re-read the complete artifact for component composition, singular ownership, dependency direction, interfaces, call-path deltas, state/flow/failure consistency, concurrency, cross-cutting realization, proof seams, accepted-requirements coverage, process residue, obscure headings, plan leakage, and unresolved specification meaning, then return the integration self-check with exact gaps.

Before review or planning, ask the authorized owner to confirm the current structural realization. Show the original goal and missing pieces, reused foundation, every new component or contract, a representative entrypoint-to-effect path, complexity spent, retained non-goals, unresolved structural decisions, deviations from the confirmed goal boundary, and accepted-requirements coverage. Reuse confirmation only when it covers this same current structure. When the governing packet already confirms the same minimal-change structure, reject requested out-of-boundary machinery and continue with the authorized design; that rejected pressure does not create a new owner decision. Missing confirmation or a real material expansion in the selected design returns `decision-needed`; confirmation state stays in the returned result rather than a durable status field.

Call this the structural-realization confirmation in every result and handoff. Retired procedural boundary-check names are not aliases for it.

Completion: the current artifact has exact passes and gaps, the current structural realization is explicitly confirmed, and every accepted requirement remains covered or has owner-authorized supersession. Self-check is never independent review.

### 16. Obtain fresh local review when required

Call `spec-program-review` using `classify-review-requirement` with: target classification and the exact `skills-creation` parent packet/result identity when the target is a runtime skill package; requested future mode `program-only`; current program-design and governing-specification identities; scope and claimed semantic effect; governing-source coverage; matched material-risk predicates; and `caller requirement: required | none` (default `none`). Consume the `review-required | non-substantial` result, decision branch, basis, source coverage, caller requirement, and preserved target/parent identity.

When required, invoke `spec-program-review` separately in `program-only` mode with fresh context and read-only authority, carrying:

- target classification and the exact `skills-creation` parent packet/result identity when applicable;
- current program-design and governing-specification identities;
- governing sources, authority states, and coverage;
- confirmed goal boundary and accepted requirements set;
- structural-realization confirmation;
- constraints, non-goals, risk predicates, and claimed proof evidence or gaps;
- the readiness question and any prior coverage plus semantic-change record.

Consume each accepted finding's ordered correction route: Why/What returns to `spec-design`; structural How returns here; `both` returns to `spec-design` first and resumes here only after the observable contract is settled; caller-owned decisions return to the caller and this design does not resume until they are resolved. After a later edit to either artifact, use `spec-program-review` to refresh affected coverage when meaning changed; parent-verified non-semantic edits may retain coverage.

Completion: current independent review semantically covers the current specification and program design, or the exact non-substantial basis/block is recorded.

### 17. Return the local result

Return artifact and governing-specification identities; confirmed goal boundary and accepted requirements set; current-system, constraint, platform, and external source identities with current applicability; structural, call-path-delta, and requirement-realization maps; structural-realization confirmation; self-check; independent review; debt/gaps; and non-acceptance.

IF returning a substantial program design in chat, use `tui-presentation` to render the selected component, call, state, or failure views before the compact result summary. The durable artifact remains the source of truth.

Completion: the caller can request pair review through `spec-program-review` or supply the exact missing specification decision/evidence.

## Required Views

Use a view only when it makes an important structural or behavioral relationship easier for a human to understand, confirm, or correct:

| View | Use when | Must expose |
| --- | --- | --- |
| component tree | three or more components/levels or contested ownership | responsibility, owner, consumers, reason to change |
| call graph/sequence | a material runtime entrypoint-to-effect path is added, removed, or changed; the path explains how a material obligation works; or control crosses owners or async boundaries | current and proposed source-anchored paths, or proposed-only with explicit no predecessor; entrypoint, callers/callees, owning component, sync/async/event edges, state reads/writes or external effects, result/error propagation, current evidence anchors, added/removed/changed edges, and preservation-critical or contested unchanged edges |
| proof call graph | proof harness differs from production path | seam, real/fake boundary, observation |
| state machine/table | lifecycle/order changes correctness | owner, states, transitions, guards, illegal paths |
| data/event flow | data crosses storage/process/service boundaries | authority, transformations, persistence/privacy |
| failure/recovery flow | partial failure, retry, or compensation exists | detection, containment, retry, cleanup, recovery owner |
| trust-boundary view | untrusted actors/input/secrets/processes exist | assets, entry points, policy owner, enforcement, containment |
| requirement/design/proof trace | multiple requirements or components interact | requirement, immediate specification scenario or observable contract, realization owner, and proof seam |

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

IF a predicate holds and delegation is useful, MUST load `references/lanes/lane-schema.md` and return its shared packet and receipt contract. Dispatch the selected lane with the exact assignment, governing and current artifact state, observed predicate and prerequisites, bounded question and sources, settled meaning, and any instance constraint that narrows the selected lane reference. The lane reference owns the invariant mission, maximum authority, return, and stop boundary.

The subagent loads `references/lanes/lane-schema.md` and the exact selected lane path named above.

Parallel-safe only after the lane prerequisites exist and its result is not an input to another selected lane; scheduling may serialize. Instance authority is equal to or narrower than the lane maximum and never includes final design selection, normative integration, pair review, or acceptance. Return a `complete | partial | blocked` receipt; after one explicit follow-up, silence is `no-receipt`. The parent opens load-bearing sources, verifies candidate evidence/models/advice/prose, resolves conflicts, and alone integrates.

## Planning Boundary

Program design settles owners, boundaries, interfaces, state, flows, recovery/concurrency, cutover, trust, and proof seams. Planning chooses task slices, write scopes, DAG/order, exact tests/commands, red/green sequence, evidence capture, checkpoints, deployment, and rollback procedure.

## Completion Blockers

Do not return `locally-ready` while any of these hold:

- target classification is missing, or a runtime-skill-package target lacks the explicit `skills-creation` parent packet/result identity;
- authoritative Why/What is missing, stale, conflicting, or silently rewritten;
- the confirmed goal boundary or accepted requirements set is missing, unrecoverable, conflicting, or rebuilt from mutually narrowed current files;
- target structure was selected without current-system evidence or a named greenfield basis;
- a material structural choice lacks credible alternatives, explicit tradeoffs, accepted debt and payer, or falsifiers/revisit signals;
- a material component lacks one owner, reason to change, consumer, or behavioral interface;
- a material runtime-behavior group lacks a source-grounded current and proposed entrypoint-to-effect path, or proposed-only with explicit no predecessor, including added/removed/changed owner/call/state/effect/result-error edges and any preservation-critical or contested unchanged edge;
- an applicable Required View was selected but not rendered in an inspectable form, or a substantial design with contested ownership or cross-owner control remains prose-only;
- a fired Required View lacks a passed rendering result or any required semantic field was lost in the selected medium;
- state, flow, failure/recovery, concurrency, migration, trust, or proof semantics are applicable but undefined;
- a delegated writer/modeler originated design meaning;
- a mechanism survives even though removing it breaks no confirmed requirement, or simplification loses accepted requirements without owner authority;
- the current structural realization and its complexity spend lack explicit owner confirmation;
- planning would still need to invent an owner, interface, state/failure policy, trust control, or proof seam;
- required independent review is missing, stale, partial, silent, or blocked;
- target classification, source/review coverage, self-check, readiness, acceptance, planning, PR, or release narration appears as durable program-design prose instead of returned workflow state;
- artifact/specification identities, source coverage, or non-acceptance are missing.
- a continuation omits a next skill, recommends more than one, or contradicts the terminal mapping above;
- a pathfinding recommendation lacks an unmade owner-controlled structural choice or omits `program-design` as its return owner;
- a continuation handoff omits the destination's required exact gap, boundary state, or artifact pointers, or copies unrelated history.
