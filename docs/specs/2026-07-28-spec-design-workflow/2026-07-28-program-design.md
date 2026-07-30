# Program Design Skill Specification

Date: 2026-07-28

Status: accepted-to-implement after the 2026-07-30 naming correction

Target runtime skill: `program-design`

Workflow contract: [`spec and program design workflow`](./2026-07-28-spec-design-workflow.md)

Requires: an authoritative result from [`spec-design`](./2026-07-28-spec-design.md) or equivalent Why/What source

Independent review owner: [`spec-program-review`](./2026-07-28-spec-program-review.md)

## Decision

Create `program-design` as an independently invocable skill for designing structural How against authoritative Why/What.

It turns obligations into a coherent system model: component composition, ownership, interfaces, state, calls and flows, failure/concurrency/security/reliability behavior, alternatives, and proof seams. It stops before implementation task planning.

This is a general program-design skill. It must work for application features, services, data pipelines, CLIs, protocols, agent workflows, refactors, and other program-shaped systems. When the target happens to be a skill, `skills-creation` supplies skill-package-specific trigger/reference/lane/platform mechanics; `program-design` does not become a skill-authoring manual.

## Success Definition

Given an authoritative specification and current-system evidence, the skill produces a versioned program design that makes structural ownership and runtime behavior explicit enough that planning can map it to files, tasks, order, commands, checkpoints, and proof execution without inventing architecture.

If the specification is missing, stale, contradictory, or insufficient, the skill routes the exact Why/What gap back to `spec-design` rather than patching it locally.

## Mental Model

Program design is an executable mental model before it is code.

A useful program design lets two readers simulate the system and reach the same answers:

```text
which components exist
  -> which component owns each truth and decision
  -> which interfaces connect them
  -> how state changes
  -> how control and data move
  -> how failures, races, retries, and recovery behave
  -> where requirements can be proven
```

The core test is not “does this architecture sound reasonable?” It is “can a reader trace every material requirement through owners, interfaces, states, normal flow, failure flow, and proof seams without inventing a hidden component or policy?”

Diagrams are design instruments here. Component trees, call graphs, state machines, and failure flows expose misplaced ownership and hidden coupling before a plan turns them into code tasks.

## Scope

The skill owns:

- authoritative specification coverage and route-back gaps;
- current-system component, call, state, data, boundary, and proof model;
- candidate architectures and explicit tradeoffs;
- target component composition and reasons to change;
- ownership, sources of truth, dependency direction, and allowed/forbidden edges;
- internal and external interface realization;
- state ownership, mutation authority, lifecycle, and transitions;
- normal control/data/call flows;
- failure, partial-success, retry, cancellation, cleanup, recovery, and degradation semantics;
- concurrency, ordering, idempotency, consistency, and race policy;
- trust boundaries, security controls, reliability containment, observability architecture, and operational behavior;
- compatibility/cutover/migration architecture where required by the specification;
- proof seams and structural enforcement class;
- requirement-to-design traceability;
- design alternatives, accepted debt, payer, and revisit signal;
- local self-check and fresh independent program-design review for substantial work.

It does not own:

- new product requirements, user outcomes, or public behavior not authorized by the specification;
- implementation task slices, exact file edits, worker assignments, execution order/DAG, commands, red/green procedure, or evidence capture;
- final skill-package frontmatter, reference placement, platform encoding, or pressure-test implementation;
- review judgment or pair acceptance;
- generic agent/runtime/session mechanics.

## Trigger Surface

Invocation capability: model-invocable and user-invocable.

Proposed trigger description:

```yaml
name: program-design
description: Use when defining or revising structural How against settled observable obligations, including components, ownership, internal interfaces, state, calls, flows, failure/retry/recovery realization, concurrency/consistency, compatibility/cutover realization, trust boundaries, or proof seams. Not for authoring Why/What; use spec-design. Not for independent review-only requests, inventing requirements, implementation task planning, pair acceptance, a standalone security scan, security audit, or threat model, authoring or evaluating a runtime skill package—its trigger, main path, references, lanes, scripts, steering, platform mechanics, or behavior proof—or an explicitly requested legacy spec-creation-swarm run.
```

True prompts include “design the component tree,” “show the call flow,” “where should state live,” “eliminate these effects by redesigning ownership,” “choose the consistency model,” “design compatibility and cutover from the legacy store,” “design the service boundaries,” and program-owned findings routed from review.

Near misses:

- unresolved behavior/product questions route to `spec-design`;
- review-only requests route to `spec-program-review` program-only or pair mode;
- task/file/order/command work routes to plan creation after a current pair-ready review result; direct planning remains subject to the planning workflow's own implementation-mechanics-only input classification;
- full lifecycle work is composed by the caller through `spec-design`, `program-design`, and `spec-program-review`.

## Independently Invocable Contract

### Preconditions and inputs

Required:

- authoritative specification artifact or equivalent Why/What source;
- exact specification identity/revision/digest;
- current-system sources sufficient to verify relevant owners, calls, state, constraints, and proof patterns.

An equivalent Why/What source must be versioned or digest-bound, carry authoritative consumer/outcome/obligation/constraint/failure/proof meaning sufficient for the specification spine, and expose unresolved decisions. A chat summary or recommendation does not qualify merely because it is concise. When equivalence cannot be established, return `specification-gap` and route through `spec-design`.

Optional:

- existing program-design artifact;
- prototypes, traces, diagrams, tests, or current implementation;
- review findings owned by structural How;
- caller record with accepted decisions and invalidations, when one exists.

The skill does not start structural design from bare fuzzy intent. It returns the missing specification input.

### Outputs

Exactly one of:

```text
locally-ready
specification-gap
decision-needed
evidence-blocked
deferred
```

A `locally-ready` result contains:

- program-design path or chat artifact identity;
- exact design digest/revision;
- governing specification identity/digest;
- requirement-to-design coverage;
- immutable governing-source coverage identity containing every governing source's exact identity, digest/version, authority status, and the scoped completeness basis;
- author self-check;
- independent local program-design review when substantial;
- known debt, assumptions, and proof gaps;
- explicit statement that no pair acceptance is claimed.

### Local completion boundary

Direct invocation completes with a digest-bound program design/local result or an exact route-back/blocking result. It does not require pair review and cannot accept the pair.

## The Program-Design Spine

Every substantial program design must make this chain inspectable:

```text
requirement
  -> responsible target component
  -> owned truth / decision
  -> interface contract
  -> state transition
  -> normal flow
  -> failure / recovery / concurrency behavior
  -> proof seam
```

The artifact structure may vary, but this trace must not exist only in the author's head.

## All-Run Main Path

### 1. Validate authoritative Why/What

IF this skill was directly invoked to create, update, evaluate, or design one named runtime skill package and no `skills-creation` parent packet/result authorizes composition, route to `skills-creation` before modeling structural How. `skills-creation` may call this general craft skill with explicit parent authority.

Read the entire governing specification and bind its exact digest. Extract material requirements, observable contracts, constraints, failure expectations, proof modalities, open decisions, and non-goals.

Classify any gap:

```text
missing meaning        specification does not decide required behavior
conflicting meaning    two normative sources disagree
feasibility question   meaning is clear; technical evidence is needed
design choice          meaning is clear; How remains to be selected
planning detail        design is clear; execution mechanics can wait
```

Only the last three permit continued program-design work. Missing/conflicting meaning routes back.

Completion: the governing digest, requirement inventory, non-goals, and any route-back gaps are explicit.

### 2. Build the current-system model from sources

Read code, tests, docs, schemas, runtime traces, logs, and existing diagrams relevant to the required behavior. Search results are an inventory; open the load-bearing sources.

Model the current system using the smallest useful views:

- component/ownership tree;
- production call graph;
- test/proof call graph when it differs materially;
- state owners and mutation sites;
- data/event flow;
- failure and recovery behavior;
- external/platform boundaries;
- existing invariants and enforcement.

For refactors, explicitly name where complex state and repeated effects are symptoms of ambiguous ownership, derived-state duplication, or lifecycle coupling.

IF external prior art, framework/library behavior, platform documentation, or current ecosystem practice could constrain feasibility, boundaries, interfaces, state, failure policy, or proof seams, gather it before selecting the target structure. Use a bounded evidence lookup for one narrow question; use `research-swarm` and consume its evidence-ledger result when the source set is substantial or mixed. Record borrow/adapt/do-not-borrow implications and transfer assumptions; external precedent is evidence, not automatic authority.

State the degree of constraint: greenfield, compatibility-bound, migration-bound, platform-bound, or boxed in by legacy ownership. Record a `changes / remains authoritative` boundary so the target design does not accidentally replace current behavior or rationale outside its mandate.

Completion: the design cites current owners/calls/state/proof anchors and distinguishes direct observation from inference.

### 3. State the design crux and forces

Name the smallest set of structural decisions that determine the rest of the design. Capture forces such as compatibility, latency, consistency, security, failure isolation, team ownership, deployment topology, testability, and change frequency.

Use crux inversion: for each preferred structural claim, ask what evidence or scenario would make the opposite design correct.

Completion: the design problem is expressed as real tradeoffs and falsifiable assumptions rather than generic quality goals.

### 4. Generate viable alternatives

Develop at least the viable alternatives earned by the crux. The old minimal, clean-boundary, pragmatic, and risk perspectives remain useful lenses, not mandatory parallel lanes.

For each alternative, state:

- component/owner shape;
- key interfaces and state placement;
- requirements it serves well or poorly;
- complexity introduced and removed;
- failure/security/proof consequences;
- migration/cutover implications;
- accepted debt and who pays it;
- falsifying evidence or revisit signal.

A first design with no predecessor does not owe predecessor improvement. A redesign must say what materially improves over the current design and what cost moves elsewhere.

Completion: the selected direction is compared against at least one credible alternative when a material choice exists; non-choices are not padded into fake options.

### 5. Select the target composition

Construct the integrated target overview before detailing individual mechanisms. It must let a reader walk the main requirement flow, see the state owners, and trace the riskiest failure to containment. Draw a component tree that names responsibilities and reasons to change. Components are semantic owners, not directories guessed from current files.

```text
target system
  component A
    owns: source of truth / decision / invariant
    exposes: interface
    changes when: named reason
  component B
    owns: source of truth / decision / invariant
    exposes: interface
    changes when: named reason
```

For UI/refactor work, include the render/component tree and distinguish state-owning containers, pure views, effects/integration boundaries, and derived state. The tree should make unnecessary `useEffect` coordination or duplicated state visible.

Apply the depth/deletion test. A component earns an interface when it hides meaningful policy, lifecycle, failure, or integration complexity from its consumers. If deleting it makes the complexity disappear rather than reappear across callers, it is probably a pass-through. If its callers must learn nearly all its internal rules, the component is shallow even when its name sounds architectural.

Completion: every target component has one job, one reason to change, named consumers, and enough owned behavior to justify its interface; the overview composes the component tree, state ownership, main flow, and riskiest failure without relying on later section inventory.

### 6. Assign ownership and dependency direction

For each material truth, decision, invariant, lifecycle, and side effect, name exactly one authoritative owner. Define allowed and forbidden dependency edges and how violations can be detected.

Ask:

- Where is the source of truth?
- Who may mutate it?
- Who derives views?
- Who initiates side effects?
- Which component may depend on which abstraction?
- What tempting shortcut would create a second owner?

Completion: ownership is singular, dependency direction is explicit, and shared responsibility is decomposed or named as a deliberate coordination boundary.

### 7. Define interfaces as behavioral boundaries

Specify each load-bearing interface:

```text
owner and consumers
inputs and preconditions
outputs and postconditions
synchronous/asynchronous semantics
state and side effects
idempotency/order guarantees
error and cancellation behavior
version/compatibility boundary
negative space
examples where ambiguity remains
```

Do not reduce interfaces to method signatures. Show what callers may assume and what owners guarantee.

Write at least one representative caller interaction before finalizing each load-bearing interface. Derive the surface from what consumers need while keeping owner policy hidden. Do not add a seam merely because abstraction sounds cleaner: justify it with a real variation, trust/process boundary, lifecycle owner, proof boundary, or multiple consumers. Conversely, do not wait for two concrete implementations when an external or fallible boundary already requires substitution, containment, or independent proof.

Completion: a planner can locate implementation surfaces later without deciding interface semantics.

### 8. Model state and lifecycle

For every material stateful entity, define:

- owner and storage/lifetime boundary;
- valid states;
- transition initiator and guard;
- invariant before/after transition;
- persisted vs derived vs cached state;
- reset, cancellation, disposal, and recovery behavior;
- illegal transitions and handling.

Use a state machine when timing/order changes correctness. Use a state table when transitions are compact. In UI work, distinguish render-derived values from synchronized state; in workflows, distinguish artifact state from orchestration state.

Completion: state transitions can be simulated and no write path bypasses the named owner.

### 9. Draw normal control/data/call flows

Show the end-to-end path for each material requirement. Use sequence or flow views when ownership alone does not reveal timing.

```text
consumer -> entry boundary -> coordinator -> owner -> external boundary
                response / event / state change returns along named path
```

Include background jobs, callbacks, events, persistence, caching, and test harness paths when they alter semantics. Distinguish control flow from data ownership.

IF the change must coexist with, migrate from, or cut over an existing system, model each transition phase in this stage. For every phase, name the authoritative state and permitted readers/writers, compatibility and version-skew behavior, migration transition and reconciliation owner, cutover condition, rollback condition, failure/recovery behavior, and proof seam. A temporary dual path is a deliberate coordination boundary with one authority rule per phase, not two silent sources of truth.

Completion: every material requirement reaches an owner and observable outcome through named interfaces with no “and then magic happens” hop; when migration/cutover applies, every phase has explicit authority, transition, rollback/reconciliation, failure, and proof semantics.

### 10. Design failure, partial success, and recovery

For each external or fallible boundary, model:

- failure detection and classification;
- propagation vs containment;
- retry owner, eligibility, limits, and backoff semantics;
- idempotency/duplicate handling;
- timeout and cancellation;
- cleanup/compensation;
- partial-success visibility;
- recovery source of truth;
- degraded behavior and operator signal;
- process/crash/restart behavior where applicable.

The specification owns externally required outcomes. Program design owns the architecture that realizes them.

Completion: failure flows are as explicit as the happy path and every recovery action has one owner.

### 11. Design concurrency and consistency

When multiple actors, processes, renders, requests, events, or retries can overlap, state:

- ordering assumptions;
- atomicity/transaction boundary;
- consistency model;
- race/conflict resolution;
- duplicate/out-of-order behavior;
- locking, versioning, ownership, or serialization mechanism class;
- backpressure and capacity boundary when applicable.

Do not add concurrency machinery when no observable overlap exists. Do not omit it because exact code comes later.

Completion: each material interleaving either preserves invariants or has defined conflict/failure behavior.

### 12. Realize cross-cutting obligations

Translate every applicable specification-level quality obligation into a structural owner, mechanism or boundary, normal and failure behavior, and proof seam. Applicable concerns include security, privacy, data lifecycle, reliability, performance/capacity, accessibility, observability, compliance, and platform compatibility.

For security, reliability, and operability, inspect:

- assets, actors, entry points, and trust boundaries;
- authentication/authorization decision owner;
- validation and parsing boundary;
- secret/credential boundary;
- least-privilege dependency and process boundaries;
- misuse containment and auditability;
- health, logs, traces, metrics, and operator recovery interfaces;
- reliability isolation, fallback, and degradation ownership.

For performance and capacity, name the budgeted resource or latency boundary, load/queue/backpressure owner, degradation behavior, and measurement seam. For privacy, data lifecycle, and compliance, name collection/minimization, retention/deletion, residency/export, audit, and policy-enforcement ownership where applicable. For accessibility and platform compatibility, name the structural enforcement point and the real boundary whose behavior must be proven rather than leaving the obligation as a planner-owned test note.

Standalone security scans remain a separate workflow. Program design still owns ordinary security architecture whenever the system crosses trust boundaries.

Completion: each applicable cross-cutting obligation traces to an owner, realization, failure/degradation behavior, and proof seam; explicit non-goals and reasoned not-applicable results remain visible.

### 13. Define proof architecture and structural enforcement

Map specification proof modalities to seams the implementation can expose:

```text
requirement
  -> observable boundary
  -> unit/integration/smoke/e2e/manual/operational seam
  -> required state/log/trace/metric/artifact visibility
  -> structural invariant and enforcement class
```

Name whether an invariant should be enforced by type/interface, schema, runtime guard, transaction, lint/static rule, test, health check, or operational alarm. Do not choose exact test files, commands, or execution sequence.

Classify each material dependency by the boundary the proof must cross: in-process, locally substitutable, remote-but-owned, or true external. State which part must be real, which part may be replaced through the designed seam, and what observation demonstrates the requirement. A mockable signature without a production-realistic observation path is not a proof architecture.

Completion: every material requirement has a plausible proof seam and every load-bearing structural rule has an enforcement class or an explicit proof gap.

### 14. Trace, simplify, and author the design artifact

Build a requirement-to-design map. Remove components, interfaces, states, and mechanisms that do not serve a requirement, constraint, failure policy, or proof need. Preserve accepted debt with payer and revisit signal.

Section writers/modelers may be delegated only after the parent has fixed requirements, selected direction, component ownership, and relevant invariants. They may express mapped models or prose; they may not originate requirements, components, ownership, interfaces, state policies, alternatives, failure policies, or normative design claims.

Completion: every design element has a reason, every material requirement has a realization, and gaps are reported rather than filled by delegated invention.

### 15. Run the author integration self-check

Re-read the complete program design and test:

- component composition and singular ownership;
- source-of-truth conflicts;
- dependency direction;
- interface completeness;
- state/call/data-flow consistency;
- normal and failure-flow coverage;
- concurrency and recovery semantics;
- security/reliability boundary coverage;
- requirement-to-design and proof-seam traceability;
- plan leakage or unresolved specification meaning;
- whether two implementers would build materially different systems.

Completion: a digest-bound author self-check records what held and exact gaps. It is not independent review.

### 16. Obtain fresh local review when substantial

Call the `spec-program-review` review-requirement classification entry for program-only mode and the exact current design and governing-specification digests. Consume its `review-required | non-substantial` result and matched predicate/basis. A `review-required` result requires program-only review; a `non-substantial` result records the returned basis and cannot be upgraded by this authoring skill. Classification is not a review invocation and dispatches no reviewer.

When required, invoke `spec-program-review` in program-only mode with the program-design digest, governing specification digest, current-system sources, constraints, and risk predicates. The fresh read-only reviewer judges internal coherence separately from specification satisfaction.

Parent-accepted Why/What findings route to `spec-design`; parent-accepted How findings return here. Any edit to reviewed text invalidates every receipt that covered the prior digest; semantic edits additionally invalidate downstream results held by the composing caller.

Completion: a current independent local program-design result covers the exact design/specification digests, or the block/non-substantial classification is explicit.

### 17. Return the terminal local result

Return artifact identity/digest, governing specification digest, coverage map, current evidence, self-check, independent review, debt/assumptions/proof gaps, and non-acceptance boundary.

Completion: the caller can request pair review through `spec-program-review`; design-bearing planning waits for a current pair-ready review result covering the exact specification and program-design digests. Otherwise the caller provides the exact missing specification decision/evidence.

## Required Design Views

Use only views that expose a load-bearing relationship. A substantial program design normally needs more than prose, but not every view in every domain.

| View | Use when | Must expose |
| --- | --- | --- |
| component tree | three or more components/levels or ownership is contested | responsibility, owner, reason to change, consumers |
| production call graph or sequence | control crosses multiple owners/async boundaries | call direction, sync/async semantics, results/errors |
| test/proof call graph | proof uses materially different harness/boundaries | seam, fixture/driver, real vs fake boundary, observation |
| state machine/table | ordering/lifecycle changes correctness | owner, states, transitions, guards, illegal paths |
| data/event flow | data crosses storage/process/service boundaries | authority, transformation, persistence, privacy boundary |
| failure/recovery flow | a boundary can partially fail or retry | detection, containment, retry, cleanup, recovery owner |
| trust-boundary view | untrusted actors/input/secrets/processes exist | assets, entry points, policy owner, enforcement, containment |
| requirement/design/proof trace | multiple requirements/components interact | realization owner and proof seam per requirement |

Paths are valid evidentiary anchors when showing current source, basis, or traceability. The design should not become a task inventory of future file edits.

## Delegation and Lane Policy

No fixed swarm runs. Qualified bounded work may run as parallel or serial lanes after prerequisites settle.

### Shared lane dispatch and receipt contract

Every selected lane uses one parameterized contract; a row below supplies its predicate, prerequisites, mission, maximum authority, inspection procedure, calibration, stop condition, return, and prior-craft basis.

```text
IF <lane predicate holds>, dispatch <lane id> to a subagent using a packet containing:
  always: exact governing-specification identity/digest, invocation/work identity, current source scope, and applicable constraints
  when they exist and the lane row's prerequisites require them: exact program-design identity/digest, candidate direction, or selected direction
  the settled requirements and decisions available at that stage, without fabricating unavailable prerequisites
  the lane predicate, bounded question, mission, non-goals, risk predicates, and expected return
Subagent loads references/lanes/<lane>.md and references/lanes/lane-schema.md.
Parallel-safe only after the lane's prerequisites are fixed and its output is not an input to another selected lane; actual scheduling may serialize.
Instance authority is equal to or narrower than the lane row's maximum authority and never includes final design selection, normative artifact integration, pair review, or acceptance.
Return a complete | partial | blocked receipt with covered sources, candidate result, assumptions, gaps, and stop reason. After one explicit follow-up, silence becomes parent-recorded no-receipt with no invented lane output.
The parent opens load-bearing sources, verifies the receipt, resolves conflicts, and alone integrates or rejects candidate design material.
```

`references/lanes/lane-schema.md` owns only the shared packet/receipt envelope. Each lane reference owns its domain mission and the qualification row below; `manage-agents` owns runtime, provider, permission, session, and generic job-packet mechanics.

### Qualified lane missions

| Lane | Predicate and prerequisites | Maximum authority and inspection procedure | Good / bad calibration and stop condition | Return and prior craft |
| --- | --- | --- | --- | --- |
| current-system explorer | Local sources constrain target ownership/calls/state/proof and the parent lacks a current model; target scope and authoritative source roots are named. | Evidence-only. Trace runtime owners, mutation points, calls, states, data flow, failure path, and real proof harness from entry to effect; do not propose target structure. | Good ties each relationship to inspectable anchors and names contradictions; bad is a path inventory. Stop when load-bearing current behavior is traced or the missing source/access is exact. | Current owners/flows/proof anchors, files the parent must read, contradictions, gaps. Adapts the old codebase-explorer source-of-truth/caller/proof work. |
| external prior-art/platform evidence | One bounded external question could change feasibility, boundary, interface, failure policy, or proof seam; the local problem and transfer context are stated. | Evidence-only. Prefer authoritative sources; compare assumptions, versions, deployment model, and failure semantics against the local context; do not select the design. | Good returns borrow/adapt/do-not-borrow with transfer evidence; bad treats popularity or an admired pattern as authority. Stop when the question is answered at the required confidence or source/version uncertainty is explicit. | Source anchors, transfer assumptions, fit/conflict, candidate implications, gaps. Adapts the old prior-art researcher and research-swarm evidence discipline without mandatory broad research. |
| component-flow modeler | Source evidence and selected ownership claims already exist, and one bounded component/call/state/failure view can be drawn independently. | Model-only. Translate supplied claims into one view; do not invent components, owners, interfaces, policies, or alternatives. | Good exposes semantic owners, consumers, direction, states, and failure edges; bad mirrors folders or beautifies an undecided design. Stop and return a gap when a required owner/edge/policy is unmapped. | Source-anchored model, assumptions used, unmapped gaps. Adapts component trees, noun interrogation, and call/state/flow modeling from prior creation/review craft. |
| alternatives advisor | A named structural crux has at least two credible choices; requirements, constraints, forces, and decision altitude are fixed. | Candidate advice only. Develop materially distinct structures under different forces and test tradeoffs, failure consequences, reversibility, and falsifiers; do not decide for the parent or user. | Good explains what each option makes easier/harder and which evidence would overturn it; bad is cosmetic brainstorming or one recommendation with straw alternatives. Stop when viable choices and the decision-driving uncertainty are explicit. | Options, tradeoffs, falsifiers, candidate recommendation, decision owner. Adapts the old minimal/clean-boundary/pragmatic perspectives and design-it-twice rather than preserving fixed fan-out. |
| risk-realization specialist | One named concern—failure/reliability, security/trust, platform/harness, data/concurrency, or another specified cross-cutting obligation—materially shapes structure; its authoritative obligation, actors/boundary, and proof need are named. | Candidate realization only. Trace the selected concern through owner, mechanism/enforcement, concrete failure/interleaving/degradation behavior, recovery or containment, and proof seam; do not redefine product policy, run a standalone audit, or choose exact planning commands. | Good demonstrates one concrete path and a complete obligation-to-structure chain; bad emits a topic checklist or names a lock/mock/control without authority and failure semantics. Stop when the selected concern is structurally realized or an exact specification/evidence gap is identified. | Concern-specific owner/mechanism/failure/proof map, candidate corrections, routed gaps. Parameterizes the old risk/tradeoff, security-threat-model, harness-fit, concurrency/state-machine, and validation/cross-cutting craft without fixed specialist fan-out. |
| section writer | The parent has fixed requirements, direction, components, ownership, interfaces, state/failure policies, and normative claims for one bounded section. | Expression-only. Organize and word only mapped claims, models, and source anchors; no new CLAIM/INV, realization, option selection, component, policy, or normative prose. | Good makes the supplied model readable without changing meaning; bad silently completes an unmapped need or introduces a plausible design choice. Stop at the first unmapped claim and return it as a gap. | Bounded prose/model plus exact unmapped gaps. Adapts prior section-writing mechanics under the strengthened origination ban. |

The parent reads load-bearing source anchors and owns final integration. `spec-program-review` owns independent review.

## Proposed Runtime Skill Tree

```text
skills/program-design/
  SKILL.md
  references/
    current-system-model.md
    alternatives-and-crux.md
    components-ownership-interfaces.md
    state-calls-and-flows.md
    failure-concurrency-recovery.md
    cross-cutting-realization.md
    proof-architecture-and-traceability.md
    artifact-and-self-review.md
    lanes/
      current-system-explorer.md
      external-prior-art-platform.md
      component-flow-modeler.md
      alternatives-advisor.md
      risk-realization-specialist.md
      section-writer.md
      lane-schema.md
```

`skills-creation` must apply placement and deletion tests. The tree is a proposed responsibility map, not a command to create empty modules.

## Depth and Call Architecture

The runtime `SKILL.md` keeps the mental model, full ordered spine, route-back rule, completion gates, and planning boundary visible. Coherent detailed modeling procedure may live in all-run references.

Likely calls:

```text
MUST load `references/current-system-model.md` and return source-grounded current component/call/state/flow/proof models before selecting target structure.

MUST load `references/alternatives-and-crux.md` and return the crux, viable alternatives, tradeoffs, falsifiers, and selected direction before target design is fixed.

MUST load `references/components-ownership-interfaces.md` and return the target tree, singular owners, dependency rules, and interface contracts.

MUST load `references/state-calls-and-flows.md` and return applicable lifecycle, state-transition, end-to-end flow, and compatibility/migration/cutover models, including phase authority, version skew, transition, rollback/reconciliation, failure behavior, and proof seams.

MUST load `references/failure-concurrency-recovery.md` and return applicable failure, partial-success, retry, cleanup, recovery, ordering, and consistency decisions.

MUST load `references/cross-cutting-realization.md` and return each applicable quality obligation's structural owner, mechanism/boundary, failure or degradation behavior, and proof seam, or a reason it is not applicable.

MUST load `references/proof-architecture-and-traceability.md` and return requirement realization, proof seams, and structural enforcement classes.

MUST load `references/artifact-and-self-review.md` and return the artifact view selection and digest-bound author integration check.
```

Conditional lane calls use the shared dispatch/receipt contract above and the applicable qualification row. Implementation may prune a lane that no longer earns a distinct mission, but it may not keep a lane name without its prerequisites, authority, inspection procedure, calibration, stop condition, return, prior-craft basis, and consuming call site.

## Planning Boundary

Program design owns the structural choices planning consumes:

- target owners and boundaries;
- target interfaces and dependency direction;
- state ownership and transitions;
- normal and failure flows;
- retry, cleanup, partial-success, cancellation, and recovery policy;
- concurrency and consistency;
- compatibility and cutover realization;
- trust boundaries and security/reliability architecture;
- proof seams and enforcement class.

Planning owns the implementation operationalization:

- task slices and exact write scopes;
- sequence, DAG, parallel work, checkpoints, and integration gates;
- exact test layers/files/commands and red/green order;
- evidence capture and freshness;
- implementation/deployment rollback steps.

Program design may name current source paths as evidence and likely integration surfaces as explanatory anchors. It must not turn those into future task assignments or ordered edit lists.

## Skill-Authoring Boundary

When the designed program is a skill, general design concepts still apply:

- runtime components can include trigger, main path, references, lanes, scripts, schemas, and platform boundary;
- ownership, calls, state, failure, and proof seams still need design.

But `skills-creation` owns how those concepts are authoritatively translated into skill frontmatter, scan-visible `SKILL.md`, reference call grammar, lane qualification/contracts, steering prose, client mechanics, and behavior proof. There are no separate runtime “skill specification adapter” or “skill program-design adapter” skills in this proposal.

## Proof Plan

No pressure tests run in this design pass. Later implementation must prove:

| Claim | Static proof | Behavioral proof family |
| --- | --- | --- |
| trigger selects structural How and rejects missing Why/What | boundary audit | bare intent vs authoritative spec |
| current source is modeled before target structure | call/order audit | refactor with misleading proposed owner |
| external prior art and platform behavior enter as source-backed evidence | external-evidence predicate and source-classification audit | library/platform constraint that fits, conflicts, or fails to transfer |
| component trees expose ownership rather than file lists | output contract audit | complex state/effects refactor |
| missing requirements route back rather than being invented | route/result audit | program discovery changes public behavior |
| failure/concurrency/security are conditional but cannot be skipped when applicable | predicate audit | retry/race/trust-boundary cases |
| cross-cutting obligations receive structural How rather than planner invention | obligation-to-realization audit | performance budget and retention/deletion scenarios |
| program design settles How before planning | planning-boundary audit | task planner faced with missing owner/interface/state |
| section writers/modelers cannot originate design | lane authority audit | unmapped component returned as gap |
| every delegated lane is executable without decision leakage | shared dispatch plus per-lane qualification/consumer audit | selected evidence/model/advice/writing lanes with missing prerequisite and no-receipt cases |
| direct invocation is local and non-accepting | terminal result audit | standalone design run |

Behavioral proof is deferred to implementation.

## Acceptance Criteria for the Skill Implementation

- The trigger distinguishes structural How from specification authoring, review, and planning.
- The skill refuses bare intent without authoritative Why/What.
- The mental model and program-design spine are scan-visible.
- The skill teaches current modeling, alternatives, component trees, ownership, interfaces, state, flows, failure, concurrency, security/reliability, and proof architecture.
- Required views are selected by need, not emitted mechanically.
- Current source paths remain evidence, not task inventories.
- Delegation supports evidence/modeling/advice/writing without fixed topology or decision leakage.
- Every retained lane has a complete call contract and domain teaching; lane schemas cannot substitute for inspection procedure or calibration.
- Author self-check and fresh independent review are distinct.
- Planning cannot invent structural design.
- Skill-authoring mechanics remain with `skills-creation`.
- The terminal result is bound to both design and governing specification digests and cannot accept the pair.

## Source Basis

This design preserves current-system exploration, minimal/clean/pragmatic alternatives, risk/tradeoff probes, architecture-boundary interrogation, component/call/state/flow modeling, security/trust-boundary work, validation/testability, harness fit, crux inversion, and planning-readiness judgment from the existing skills. It also preserves the strongest research-backed techniques from the earlier proposal: an integrated overview before detailed inventory, design-it-twice under different forces, module depth/deletion testing, caller-first interface design, explicit changed/unchanged boundaries, falsifying probes, and dependency-category proof strategy. It moves the structural half of several current planning lanes upstream while leaving implementation operationalization in planning.
