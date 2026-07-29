# Spec Design Orchestration Skill Specification

Date: 2026-07-28

Status: proposed

Target runtime skill: `spec-design`

Companion skill specifications:

- [`specification-design`](./2026-07-28-specification-design.md)
- [`program-design`](./2026-07-28-program-design.md)
- [`spec-program-review`](./2026-07-28-spec-program-review.md)

## Decision

Create `spec-design` as the orchestration skill for a closed pre-plan design workflow. It routes work through three independently invocable craft skills, owns one canonical orchestration record, closes review/remediation loops, and alone records pair acceptance.

`spec-design` does not teach or perform specification craft, program-design craft, or review judgment. Those meanings belong to the three companion skills. The orchestrator owns composition and lifecycle because direct skill descriptions cannot resolve resume, invalidation, or cross-artifact remediation from persisted state.

The runtime architecture is four skills, not four documents hiding one monolith:

```text
spec-design
  owns: lifecycle, routing, revision binding, invalidation, acceptance
  calls:
    specification-design
      owns: authoritative Why / What
    program-design
      owns: structural How
    spec-program-review
      owns: local-review-requirement classification and independent review judgment
```

## Problem

The previous workflow mixed four different reasons to change:

- how to construct an authoritative specification;
- how to design the program that realizes it;
- how to review either artifact and the pair;
- how to keep the multi-artifact lifecycle closed.

That made the workflow large without giving each craft a complete teaching spine. It also allowed the word “swarm” to stand in for orchestration, even though the useful behavior was bounded delegation and parent reduction rather than a fixed fan-out.

The replacement must prevent four failures:

1. optional handoffs leave a specification without program design, a design without review, or findings without refreshed verification;
2. independently invoked phase skills accidentally claim pair readiness;
3. lifecycle truth is copied into both artifacts, ledgers, and receipts until they disagree;
4. planning invents ownership, state, interfaces, failure policy, or proof seams that program design never settled.

## Success Definition

When a user starts, resumes, revises, or remediates substantial pre-plan design work, `spec-design` identifies the current valid phase from disk, invokes the semantic owner of the next work, rejects stale results, repeats review after invalidating edits, and returns either an accepted specification/program-design pair or an explicit blocked/deferred result. For a bounded planning request, it can instead return an exact, source-backed `implementation-mechanics-only | design-required` classification. No phase skill must guess lifecycle state, and no planner must invent missing Why, What, or structural How.

## Mental Model

`spec-design` is a transaction coordinator for meaning.

The specification and program design are independently authored artifacts, but acceptance is an atomic property of an exact pair. Review results are observations about exact artifact digests. A semantic edit invalidates downstream observations; it does not mutate them into freshness. The orchestrator advances only when the required results cover the current artifacts.

The planning-basis classifier is the transaction admission gate. If any design-bearing category is applicable or unresolved, classification opens or resumes the meaning transaction at its owning phase. Only a complete finding that every design-bearing category is inapplicable returns `implementation-mechanics-only` without creating lifecycle state.

This mental model predicts the workflow:

```text
intent
  -> authoritative Why / What
  -> structural How
  -> independent pair review
  -> semantic-owner remediation
  -> refreshed review
  -> accepted pair
  -> planning handoff
```

Meaning flows forward. Gaps route backward to the owner of the missing meaning.

## Scope

`spec-design` owns:

- generic start, continue, resume, revise, remediate, and acceptance routing;
- one canonical orchestration record;
- artifact identity, digest, revision, and result freshness;
- required phase transitions and prerequisite checks;
- finding ownership, remediation routing, invalidation, and refresh;
- pair acceptance and planning handoff readiness;
- authoritative planning-basis classification for bounded implementation requests;
- stop/resume inputs when evidence or a user decision blocks progress.

It does not own:

- problem framing, requirements, or observable contract craft;
- component, ownership, interface, state, flow, failure, security, reliability, or proof-seam design;
- review rubrics, findings, or review verdicts;
- generic model, provider, permission, session, packet, or receipt mechanics;
- implementation task decomposition, file scopes, order, commands, checkpoints, or evidence capture;
- implementation, proof execution, documentation cleanup, or old-skill retirement.

## Trigger Surface

Invocation capability: model-invocable and user-invocable.

Proposed trigger description:

```yaml
name: spec-design
description: Use when starting, continuing, resuming, remediating, or completing a pre-plan design workflow that must produce an accepted specification and program-design pair, or when classifying whether a planning request is implementation-mechanics-only with no unresolved design decision. Not for directly authoring only Why/What, only structural How, only reviewing named artifacts, authoring or evaluating a runtime skill package—its trigger, main path, references, lanes, scripts, steering, platform mechanics, or behavior proof—or an explicitly requested legacy spec-creation-swarm/spec-review-swarm run.
```

Routing boundaries:

- direct authoritative Why/What work routes to `specification-design`;
- direct structural How work with an authoritative specification routes to `program-design`;
- direct review of named artifacts routes to `spec-program-review`;
- implementation task sequencing routes to plan creation only with an exact accepted-pair handoff or a current `spec-design` planning-basis classification that returned `implementation-mechanics-only` for the exact bounded request;
- generic agent coordination composes with `manage-agents` rather than being redefined here.

`spec-design` is selected when persisted phase state, multiple design capabilities, remediation, or pair acceptance must be resolved. It must not swallow an explicit one-phase request merely because that phase could later participate in a pair.

## Independently Invocable Contract

### Inputs

One of:

- bare intent or an unresolved design question;
- a specification candidate;
- a specification/program-design pair;
- a review result or finding set;
- an existing orchestration record;
- a request to resume, continue, revise, remediate, accept, or prepare for planning.

Inputs may be chat context, artifact paths, or exact prior results. Artifact-backed inputs are preferred for substantial work.

### Output

The normal orchestration entry returns the current orchestration record plus exactly one terminal invocation result:

```text
accepted-pair
decision-needed
evidence-blocked
phase-blocked
deferred
```

An `accepted-pair` result names exact specification and program-design digests, the covering review result, closed findings, and planning-handoff input. Other results name the next semantic owner and the precise input required to continue.

The separate planning-basis classification entry does not create a design workflow or accepted-pair result:

```text
operation: classify-planning-basis
input identity and exact bounded request/artifact digests
candidate implementation work and claimed design decisions

complete result:
  immutable classification identity and freshness
  implementation-mechanics-only | design-required
  matched no-unresolved-design predicate or exact unresolved decision
  exact bounded request plus every load-bearing inspected source identity/digest/version
  basis and inspected sources

blocked invocation:
  invocation state: blocked
  classification result: omitted
  exact missing input
```

`implementation-mechanics-only` requires that the bounded work contain no new or changed design-bearing Why/What/How semantics: requirement, ownership, interface, state, failure/recovery, concurrency/consistency, compatibility/cutover, trust, or proof-seam categories are inapplicable to the requested change. A design-bearing category described as “settled” in an unaccepted source is not mechanics-only; it requires an accepted pair or returns `design-required` into the normal `spec-design` lifecycle. Missing or ambiguous input blocks classification rather than guessing.

### Local completion boundary

The normal lifecycle invocation is locally complete when the orchestrator has either:

- accepted an exact reviewed pair and produced the planning handoff input; or
- persisted an honest stop state with the next required skill, missing input, invalidated results, and resume condition.

It is not complete merely because a phase skill or reviewer returned.

The planning-basis classification invocation is locally complete only when it returns a current identified result for the exact bounded input, or a blocked invocation with the missing input and no classification value.

## Canonical Orchestration Record

One record is the sole lifecycle source of truth. The exact serialization is implementation work, but the semantic fields are fixed:

```text
workflow identity
authoritative record locator
status: active | blocked | deferred | accepted
phase: orient | specification | program-design | review | remediation-specification | remediation-program | refresh | acceptance
next skill and reason

planning-basis classification when requested:
  invocation state: complete | blocked
  immutable classification-result identity or verbatim embedded result
  exact bounded request plus every load-bearing inspected source identity/digest/version
  freshness
  implementation-mechanics-only | design-required when complete
  matched predicate/basis or exact unresolved/missing input

result source coverage:
  immutable governing-source coverage identity for each imported author, classification, and review result
  exact source identity, digest/version, authority status, and completeness basis live in the result, not copied here

specification:
  path, artifact identity, revision, digest
  author result identity, covered digest
  phase terminal result: locally-ready | decision-needed | evidence-blocked | deferred
  invocation state: complete | partial | blocked | no-receipt
  local review classification invocation state: complete | blocked
  local review requirement when complete: mode, covered digest, review-required | non-substantial, basis, orchestration override
  independent local review identity, covered digest, verdict when review-required

program design:
  path, artifact identity, revision, digest
  governing specification digest
  author result identity, covered digests
  phase terminal result: locally-ready | specification-gap | decision-needed | evidence-blocked | deferred
  invocation state: complete | partial | blocked | no-receipt
  local review classification invocation state: complete | blocked
  local review requirement when complete: mode, covered digests, review-required | non-substantial, basis, orchestration override
  independent local review identity, covered digests, verdict when review-required

pair review:
  result identity, covered pair digests, mode, verdict, coverage
  invocation state: complete | partial | blocked | no-receipt

findings:
  finding identity, severity, source anchor, semantic owner
  review disposition: accepted | rejected | contested | unverified
  remediation status: open | blocked | corrected-awaiting-refresh | closed
  user decision or correction evidence, invalidation effect

stop / resume:
  missing evidence or decision
  exact continuation input

acceptance:
  accepted pair digests
  covering review result
  confirmed load-bearing user-decision bases: claim identity, source paraphrase, authorized confirmer, confirmation evidence
  planning handoff identity
```

The planning-basis classification result is one immutable identified result owned by the classification operation. A lifecycle record may reference that result or embed it verbatim for the same identity; it must not restate, recompute, or become a second owner of the classification. Consumers validate the result's identity and complete covered-source set before use.

Every imported author, classification, and review result owns one immutable governing-source coverage value. It contains the exact identity and digest/version of every source that governed the result, each source's authority status, the scoped inventory rule used to establish completeness, and any unresolved discovery gap. The canonical orchestration record stores only that coverage identity with the result identity; it never copies or weakens the covered-source set. A result with an unresolved completeness gap cannot advance the workflow.

Artifact-local metadata may identify the artifact, revision, digest, governing input, local status, and authoritative orchestration-record locator. It must not duplicate workflow phase, next skill, open finding state, planning classification, or pair acceptance.

Phase terminal results and invocation states are separate contracts. A semantic result says what the phase concluded; an invocation state says whether the call produced a usable receipt. `partial`, `blocked`, and `no-receipt` never overwrite or masquerade as a phase terminal result.

The shared local-review classification is persisted for the exact covered digest set. “Locally covered” means either a current required review exists or a current `non-substantial` classification records its basis. A missing classification is not local coverage.

Finding state uses one total mapping:

- `accepted` starts `open`, becomes `corrected-awaiting-refresh` after correction evidence, and becomes `closed` only after required refreshed coverage;
- `rejected` is `closed` with no remediation;
- `contested` is `blocked` until an authorized decision reclassifies it as `accepted` or `rejected`;
- `unverified` is `blocked` until evidence allows reclassification.

An accepted finding never changes its remediation status to `blocked`. If its correction cannot proceed, the finding remains `open`, the workflow status/result becomes `blocked`, and `stop / resume` records the exact missing evidence or authorized decision. On resume, the same finding continues from `open`. This keeps finding disposition/remediation separate from workflow liveness.

`upheld`, `resolved-contested`, and other unstated aliases are not persisted states.

## Planning-Basis Classification Path

This is a callable sibling entry to the lifecycle path, not a shortcut through acceptance:

1. IF this skill was directly invoked for one named runtime skill package and no `skills-creation` parent packet/result authorizes composition, route to `skills-creation`; otherwise bind the exact bounded request and supplied artifact identities/digests.
2. Derive the complete scoped governing-source inventory before judging categories. Start with supplied inputs; follow their direct authority/provenance references; include current accepted and settled-but-unaccepted specifications, program designs, decision records, contracts, and repository source-of-truth instructions that govern the same bounded component or behavior. Stop only when every discovered authority claim is classified as governing or non-governing and no unresolved source claims authority over the scoped design categories. If that denominator cannot be established, return blocked with the discovery gap and no classification value.
3. Inspect whether executing it would require any new or changed product obligation, owner/boundary, interface, state semantic, failure/recovery policy, concurrency/consistency decision, compatibility/cutover realization, trust control, or proof seam.
4. Return `implementation-mechanics-only` only when every design-bearing category is explicitly inapplicable to the requested change with source-backed basis. A category that is applicable but merely described as settled requires an accepted pair. Return `design-required` with the first applicable or unresolved semantic owner otherwise. If the input is insufficient to decide, return blocked invocation state with no classification result.

Completion: one immutable result identity covers the exact bounded request plus every load-bearing inspected source identity/digest/version and records its evidence basis and freshness; consumers preserve and verify that result rather than reclassifying the request or copying its conclusion into a second owner.

## All-Run Main Path

### 1. Resolve or create the workflow identity

IF this skill was directly invoked for one named runtime skill package and no `skills-creation` parent packet/result authorizes composition, route to `skills-creation` before creating workflow state. `skills-creation` may call this skill back with that explicit parent authority.

Resolve the authoritative record before creating state. Use an explicitly supplied record locator first; otherwise inspect supplied artifacts for a shared authoritative locator, then search the configured durable workflow-record home for a record whose workflow identity or bound artifact identities match. A locator is a pointer, not lifecycle truth.

If exactly one matching record exists, load it. If records or artifact pointers conflict, stop with every candidate locator and identity; never merge or choose by recency. If lifecycle-bearing artifacts name an identity but the record is missing or corrupt, enter source-backed reconstruction or return blocked with the missing evidence—never silently create a replacement. Create a new record only after the lookup proves that no matching workflow identity, artifact pointer, or lifecycle-bearing state exists.

After loading a terminal record, revalidate current artifact digests and every immutable governing-source coverage set before reusing its result. A `blocked` or `deferred` record remains terminal until its exact continuation input exists; then mark it `active`, invalidate changed coverage, and derive the earliest affected phase. An `accepted` record may return the existing accepted pair only when artifact digests, governing-source identities/digests/versions, authority statuses, and completeness bases are unchanged. Any change or newly discovered governing source invalidates acceptance and downstream results, marks the workflow `active`, and derives the earliest semantic owner affected by that change. Persist the re-entry transition before invoking the owner or returning.

Persist the canonical record after creation and after every transition, invalidation, remediation-state change, stop/defer decision, and acceptance update, before returning the corresponding terminal result. A failed persistence leaves the invocation blocked and cannot advance or claim acceptance.

Completion: the workflow has one discoverable canonical record at one authoritative locator, all supplied artifacts/results are inventoried, conflicts or reconstruction gaps are explicit, and the durable record contains the latest completed transition before the invocation returns.

### 2. Bind current artifact identity and freshness

Compute or verify current artifact digests. Bind every imported author or review result to the digests it actually covered. Reject a result whose source identity, digest, or prerequisites do not match current files.

Completion: every retained result proves exactly which artifact version it covers; stale or ambiguous results are marked invalid and cannot satisfy a transition.

### 3. Derive the next semantic owner

Use the state and transition rules below. Do not infer missing meaning in the orchestrator.

```text
missing or unsettled Why / What          -> specification-design
authoritative Why / What, missing How    -> program-design
missing/stale local-review classification -> spec-program-review classification entry
locally covered current pair             -> spec-program-review pair mode
specification-owned finding              -> specification-design
program-design-owned finding             -> program-design
remediation invalidated review           -> spec-program-review refresh
current pair, every accepted finding closed, ready review -> acceptance gate
```

Completion: exactly one next skill or one honest stop condition is recorded with its prerequisite evidence.

### 4. Invoke the owner and consume only its terminal result

Dispatch/invoke the selected phase skill using exact paths, digests, governing inputs, accepted decisions, open findings routed to that owner, and the required result shape. Generic agent mechanics remain governed by `manage-agents`.

The orchestrator may continue parent work while qualified subagent lanes run, but it may not replace a phase skill's result with its own prose.

Completion: the called skill's phase terminal result and invocation state are recorded separately and bound to exact inputs. `partial`, `blocked`, or `no-receipt` invocation state cannot advance the workflow without a verified semantic result.

### 5. Apply transition and invalidation rules

Import the verified result, recompute artifact digests, and apply invalidation before selecting the next phase.

Completion: no stale downstream result remains marked current and the next transition is derived from the updated record.

### 6. Close remediation rather than handing it off optionally

For each accepted review finding, route the correction to the semantic artifact owner. After each edit, invalidate affected local/pair results and require refreshed coverage. Continue until every accepted finding is `closed`; when correction cannot proceed, retain its remediation status as `open`, set the workflow result to `blocked`, and record the exact missing evidence or authorized decision in `stop / resume`.

Completion: every finding has a disposition, semantic owner, artifact revision, correction evidence or blocking input, and refresh effect.

### 7. Gate pair acceptance

Accept only when all acceptance predicates hold:

- current specification author result covers the current specification digest;
- current program-design author result covers the current pair and governing specification digest;
- fresh local reviews required by the shared review-requirement classification in `spec-program-review` cover current artifacts;
- pair review covers the exact current pair;
- every accepted finding is closed;
- every load-bearing user-chosen requirement, non-goal, constraint, or normative structural realization has a durable decision source or current confirmation from the authorized decision maker;
- contested material decisions are resolved by the authorized user/source;
- review says ready for planning and names no missing Why/What/How;
- current artifacts do not contradict the orchestration record.

Completion: the accepted pair and its covering results are atomically recorded, or the exact failed predicate selects the next phase.

### 8. Produce the planning handoff input

Return accepted artifact paths/digests, requirement identifiers, target component/owner/interface/state/failure contracts, concurrency/consistency policy, compatibility/cutover realization, trust/security/reliability controls, proof modalities/seams, remaining implementation constraints, and explicitly deferred non-design decisions.

Completion: a planner can choose tasks, exact files, order, commands, checkpoints, and evidence capture without inventing product meaning or architecture.

## State Transitions

```text
orient
  -> specification

specification
  -> blocked                       missing decision/evidence
  -> program-design                current locally covered specification

program-design
  -> specification                 requirement/authority gap
  -> blocked                       missing technical evidence/decision
  -> review                        current locally covered pair

review
  -> remediation-specification     accepted/open Why/What finding
  -> remediation-program           accepted/open How finding
  -> blocked                       incomplete review or user decision
  -> acceptance                    ready verdict, every accepted finding closed

remediation-specification
  -> program-design                specification semantics changed
  -> refresh                       non-semantic change; all text-bound receipts still refresh
  -> blocked                       missing correction evidence/decision; finding remains open

remediation-program
  -> refresh
  -> blocked                       missing correction evidence/decision; finding remains open

refresh
  -> review                        re-run invalidated local/pair coverage

acceptance
  -> accepted                      all predicates hold
  -> derived next state            failed predicate

blocked | deferred
  -> same terminal state           continuation input still missing
  -> derived active phase          continuation input present; freshness revalidated

accepted
  -> accepted                      artifacts and complete governing-source coverage unchanged
  -> derived active phase          artifact, source, authority, or completeness change invalidates acceptance
```

## Invalidation Rules

- A semantic specification edit invalidates its author/local-review results, the program-design result unless it is explicitly revalidated against the new digest, all pair reviews, and pair acceptance.
- A program-design edit invalidates its author/local-review results, all pair reviews, and pair acceptance.
- Any edit to reviewed text, including copy-only normalization, invalidates receipts that covered the prior text. Exact-digest freshness has no normalization exception.
- A classification result is bound to its complete covered set. Any change to the exact request or any load-bearing inspected source identity, digest, version, or authority status invalidates a local-review-requirement or planning-basis classification and requires fresh classification.
- A load-bearing user-decision confirmation is bound to the exact claim meaning it confirmed. A semantic change to that claim invalidates the confirmation; a copy-only edit does not alter its authority meaning but still invalidates text-bound review receipts.
- A new authoritative external constraint invalidates every result whose reasoning depends on the superseded constraint.
- Focused review results never substitute for the mandatory review mode that selected them.
- A result may be current for one artifact and stale for the pair; freshness is coverage-specific.

## Direct-Invocation Import Rules

Independent phase use remains first-class:

- import a `specification-design` result after verifying its artifact digest and local review coverage;
- import a `program-design` result only when its governing specification digest matches the workflow's current specification;
- import a `spec-program-review` result as advisory coverage; pair acceptance still runs through this orchestrator;
- never reinterpret `locally-ready` or review `ready` as `accepted`;
- when an imported result lacks a required local review, route to `spec-program-review` local mode rather than silently upgrading it.

## Delegation and Lane Policy

`spec-design` does not own authoring or review lanes. Its only potential delegation is bounded orchestration assistance such as artifact inventory or evidence lookup that does not decide meaning.

Any subagent call must:

- use `manage-agents` for pattern, capability, runtime, permissions, packet, and receipt mechanics;
- receive exact workflow/artifact identities and a non-widening authority boundary;
- return candidate evidence or a terminal phase result;
- remain subject to parent verification and reduction.

No fixed number of agents or fixed fan-out is required. Parallelism follows qualified independence, not a workflow brand.

## Proposed Runtime Skill Tree

```text
skills/spec-design/
  SKILL.md
  references/
    orchestration-record.md
    transitions-and-invalidation.md
    acceptance-and-planning-handoff.md
    direct-result-import.md
```

The main `SKILL.md` must retain the transaction-coordinator mental model, scan-visible all-run route, transition guard, semantic-owner routing, and completion boundary. References may own dense record fields and transition tables; they must not become alternate workflow owners.

## Depth and Call Architecture

Proposed all-run calls:

```text
MUST load `references/orchestration-record.md` and return the current normalized workflow state and freshness inventory before selecting a phase.

MUST load `references/transitions-and-invalidation.md` and return the next semantic owner plus invalidated results after every imported terminal result.

MUST load `references/acceptance-and-planning-handoff.md` and return the acceptance predicate result and planning-handoff input before any accepted claim.
```

Proposed branch call:

```text
IF an independently produced artifact or review result is supplied, load `references/direct-result-import.md` and return its verified coverage, freshness, and import decision.
```

These are ordinary references, not lanes. They are all parent-consumed lifecycle procedure.

## Planning Boundary

The accepted pair must already determine:

- target owners, component boundaries, and dependency direction;
- target interfaces and sources of truth;
- state ownership and transitions;
- normal, failure, partial-success, retry, cleanup, and recovery semantics;
- concurrency and consistency policy;
- compatibility and cutover realization;
- trust boundaries and security/reliability architecture;
- proof modalities and structural proof seams.

Planning owns:

- implementation task slices and exact write scopes;
- execution sequence, DAG, parallel lanes, checkpoints, and integration gates;
- exact tests, commands, red/green order, evidence capture, and freshness;
- implementation/deployment rollback procedure.

If the first list is missing, `spec-design` routes backward. It never asks planning to finish the design.

## Adjacent Skill Coexistence and Cutover

The old skills are not deleted or retired by this proposal. They contain useful source material and remain available for explicit legacy invocation. They cannot retain overlapping generic model-invocable descriptions when the four new skills ship, because two equally valid trigger owners would make routing nondeterministic.

Implementation through `skills-creation` must make this non-deletion coexistence cut in the same behavior-changing changeset:

- generic Why/What, structural How, closed lifecycle, and specification/program-design review prompts route to the four new skills;
- `spec-creation-swarm` and `spec-review-swarm` remain callable only when the user explicitly asks to run the named legacy workflow; authoring or evaluating either legacy skill package routes to `skills-creation`;
- the old skill files and their useful craft references remain on disk unless a separate future decision authorizes retirement;
- `plan-creation-swarm` changes its entry contract to require an accepted specification/program-design pair for design-bearing work, while preserving an explicit mechanical/no-program-design route;
- `plan-improve-repo` may audit for improvement opportunities, but it cannot turn unresolved requirement or structural-design choices into an implementation plan; plan writing consumes an accepted pair or an implementation-mechanics-only classification;
- every planning consumer preserves and checks the same entry classification: `accepted-pair` with exact pair/handoff identity, or a current `spec-design` planning-basis classification identity that returned `implementation-mechanics-only` for the exact bounded input;
- planning references stop choosing target ownership, interfaces, state semantics, failure/recovery policy, concurrency, trust boundaries, or proof seams; they consume those decisions and retain file mapping, tasks, sequence, commands, evidence capture, and rollout procedure;
- `docs-maintain` remains the documentation-lifecycle owner after product and structural decisions are settled; its description must exclude authoritative Why/What revision, structural How revision, and independent specification/program-design review;
- adjacent handoff/router descriptions are updated only as needed to point to the new semantic owners without duplicating their manuals.

The cutover is repository-wide executable routing, not frontmatter-only. Implementation must classify every current `spec-creation-swarm` or `spec-review-swarm` occurrence as an identity/provenance mention, an explicit legacy-only entry, or an executable route. Every executable route must cut to one new semantic owner in the same changeset. This baseline inventory is mandatory and any newly discovered routing home joins it:

| Current executable routing home | Required owner after cutover |
| --- | --- |
| `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`, plugin `README.md`, and `references/trigger-evals.md` | default prompts, public routing prose, and trigger cases route generic design/review to the four new owners; planning prompts require accepted-pair input or a current `spec-design` implementation-mechanics-only result; legacy names remain only as explicit legacy entries or provenance |
| repository `AGENTS.md` current-skill inventory and skill-work routing prose | list the four new skills and their semantic boundaries while retaining both old skill entries as explicit legacy workflows |
| `spec-design/SKILL.md`, `specification-design/SKILL.md`, `program-design/SKILL.md`, and `spec-program-review/SKILL.md` | each all-run path routes direct one-named-runtime-skill-package work to `skills-creation` unless an explicit `skills-creation` parent packet/result authorizes composition |
| `skill-audit/SKILL.md`, `agents/openai.yaml` | preserve portfolio-wide audit only; route creation, update, or evaluation of one named skill or accepted draft to `skills-creation` |
| `orchestrator-goal/SKILL.md`, `references/routing-map.md`, `references/goal-contract.md` | `spec-design` for lifecycle, `spec-program-review` for named review, planning only after accepted pair |
| `discuss-pathfinding/SKILL.md`, `references/question-craft.md` | route a converged Why/What need to `specification-design`, structural How to `program-design`, a closed lifecycle to `spec-design`, and independent review to `spec-program-review`; do not default to legacy swarm topology |
| `discuss-clarify-mental-models/SKILL.md` | `spec-design` or the directly named semantic author after reconvergence |
| `research-swarm/SKILL.md`, `references/evidence-ledger.md`, `references/lane-packets.md` | `spec-design` for a closed design workflow; direct author/reviewer only when the requested phase is explicit |
| `spec-handoff/SKILL.md` | `spec-program-review` for review; `spec-design` for acceptance/planning readiness |
| `plan-creation-swarm/SKILL.md`, `agents/openai.yaml`, and planning references | the scan-visible main path routes direct named-runtime-skill-package work to `skills-creation`; otherwise require and preserve an exact accepted-pair handoff or a current `spec-design` implementation-mechanics-only classification before task planning and route missing design backward rather than selecting ownership, interfaces, state, failure/recovery, concurrency/consistency, compatibility/cutover, trust, or proof seams |
| `plan-improve-repo/SKILL.md`, `agents/openai.yaml` | audits may discover unsettled design, but plan writing uses the same accepted-pair/current-`spec-design`-classification gate; the scan-visible main path routes named runtime skill-package work to `skills-creation` even under direct invocation |
| `plan-handoff/SKILL.md`, `agents/openai.yaml` | preserve accepted-pair/mechanics-only identity and basis in every portable plan packet; reject a design-bearing plan that lacks the accepted pair |
| `implementation-execute-plan/SKILL.md`, `agents/openai.yaml` | route direct execution of a named-runtime-skill-package update to `skills-creation`; otherwise validate the accepted-pair/mechanics-only provenance before execution and route a missing or contradicted design decision back through `spec-design` |
| `plan-review-swarm/SKILL.md`, `references/lanes/whole-plan-cohesion.md` | `spec-design` remediation, which routes the finding to `specification-design` or `program-design` |
| `implementation-review-swarm/SKILL.md`, `references/review-packet.md`, `references/lanes/deviation-routing.md` | `specification-design` or `program-design` for owned gaps, `spec-program-review` for review-only work, `spec-design` when lifecycle/acceptance must resume |
| `docs-maintain/SKILL.md` | the directly named new semantic owner; documentation maintenance starts only after decisions settle |
| `spec-creation-swarm/SKILL.md`, `agents/openai.yaml`, `references/swarm-packets.md` | preserve explicit legacy execution, but any next-work route leaves through the new semantic owner unless the user explicitly names the next legacy skill |
| `spec-review-swarm/SKILL.md`, `agents/openai.yaml`, `references/finding-schema.md`, `references/lanes/*.md` | preserve explicit legacy execution, but findings route to new semantic authors/orchestrator and planning requires new pair acceptance unless the user explicitly names another legacy step |

Identity headings, source-provenance discussions, and the explicit legacy trigger descriptions remain allowed. They are not executable routes.

The table is a baseline, not a closed allowlist. Implementation must also inventory every active `SKILL.md`, reference, `agents/openai.yaml`, plugin manifest/default prompt, README, trigger-evaluation case, repository instruction, command, and marketplace-facing description that can route design, review, handoff, planning, or execution. Each discovered executable entry receives one classified owner and the accepted-pair/mechanics-only planning gate where applicable.

This is a routing and ownership cutover, not old-skill deletion.

The cutover must use this exact planned trigger contract for `plan-creation-swarm`:

```yaml
description: Use when turning an accepted specification/program-design pair into an implementation plan, or when a current spec-design planning-basis classification returned implementation-mechanics-only for the exact bounded request. Not for creating, updating, or evaluating a named runtime skill package.
```

Its scan-visible all-run main path must route direct creation, update, evaluation, or implementation planning for one named runtime skill package to `skills-creation`, unless a `skills-creation` parent packet/result explicitly authorizes composition.

The cutover must use this exact planned trigger contract for `plan-improve-repo`:

```yaml
description: Use when auditing a repository for improvement opportunities, backlog-worthy refactors, quality gaps, or leverage points and, after design is settled, writing self-contained implementation plans. Plan writing requires an accepted specification/program-design pair, or a current spec-design planning-basis classification that returned implementation-mechanics-only for the exact bounded request. Not for creating, updating, or evaluating a named runtime skill package.
```

Its scan-visible all-run main path must also enforce direct invocation: a request to create, update, evaluate, or plan changes to one named runtime skill package routes to `skills-creation` before audit lanes or plan writing. The trigger exclusion alone is insufficient because explicit human invocation remains possible.

The cutover must use this exact planned trigger contract for `skill-audit`:

```yaml
description: Use when auditing a portfolio of skills, comparing admired upstream skill repositories, finding stale or duplicated behavior across skills, or deciding which skills to create, update, merge, or skip from real session evidence. Not for creating, updating, or evaluating one named skill or accepted draft; use skills-creation.
```

Every planning entry and handoff uses this shared provenance shape:

```text
planning basis: accepted-pair | implementation-mechanics-only
accepted-pair basis: exact specification digest, program-design digest, acceptance record, planning-handoff identity
implementation-mechanics-only basis: `spec-design` classification identity, exact covered input/digests, freshness, evidence basis, and no-unresolved-design predicate result
```

Missing or contradicted provenance routes to `spec-design`; no planning consumer may silently reclassify it.

The cutover must use this exact planned trigger contract for `docs-maintain`:

```yaml
description: Use when maintaining project documentation after its product and structural decisions are settled: cleaning, reconciling, archiving, promoting, or updating AGENTS.md, READMEs, changelogs, runbooks, architecture docs, and existing workflow artifacts. Not for defining or revising authoritative Why/What, structural How, or independently reviewing a specification, program design, or their pair.
```

The two retained legacy skills use these exact explicit-run descriptions:

```yaml
name: spec-creation-swarm
description: Use when the user explicitly asks to run spec-creation-swarm by name as the legacy spec/design creation workflow. Not for authoring or evaluating the skill package.
```

```yaml
name: spec-review-swarm
description: Use when the user explicitly asks to run spec-review-swarm by name as the legacy spec/design review workflow. Not for authoring or evaluating the skill package.
```

## Proof Plan

This design pass does not run pressure tests. Implementation through `skills-creation` must later define proof for these behavior claims:

| Claim | Static proof | Behavioral proof family |
| --- | --- | --- |
| trigger routes lifecycle asks without swallowing direct phase work | frontmatter boundary audit | true/near-miss invocation cases |
| resume finds exactly one record and derives the next phase from disk | record-locator/discovery/persistence and transition audit | interrupted workflow resume plus missing, duplicate, corrupt, and stale record cases |
| planning classification has one owner and complete freshness coverage | result-owner and covered-source inventory audit | unchanged request with changed governing source; settled-but-unaccepted design source |
| stale receipts cannot satisfy a transition | digest-binding audit | edit-after-review invalidation |
| specification findings return to the specification owner | route table audit | mixed finding remediation |
| review cannot accept the pair | authority audit across four skills | ready review imported without acceptance |
| a claimed user decision cannot self-authenticate | acceptance-record and authority-inventory audit | author recommendation mislabeled as user choice versus durable decision source/current confirmation |
| planning cannot receive missing structural How as accepted | handoff field audit | planning-readiness gap route-back |
| delegation is available without fixed fan-out | lane/call audit | small serial and substantial parallel examples |
| old skills coexist without trigger collision or deletion | adjacent-description and inventory audit | generic prompt versus explicit legacy invocation |
| repository-improvement planning cannot bypass structural design | `plan-improve-repo` and planning-entry description audit | unresolved-design audit prompt versus settled-design plan prompt |
| documentation maintenance cannot author or review design meaning | `docs-maintain` reciprocal-boundary audit | semantic design update/review versus settled-doc maintenance |
| standalone security-primary work does not collide with design review | `spec-program-review`/`ops-security-review` description audit | holistic design review with security concerns versus standalone scan/audit/threat model |

Static validation proves structure only. Behavioral proof is deferred to skill implementation and is not claimed by this specification.

## Acceptance Criteria for the Skill Implementation

- The trigger has a real lifecycle loading condition and adjacent phase boundaries.
- `SKILL.md` shows the all-run route in one scan and contains no phase craft.
- One canonical record owns lifecycle truth.
- The canonical record is durably discoverable, conflicts block instead of forking identity, and every transition is persisted before return.
- Every result is bound to exact artifact identities/digests.
- Direct phase results can be imported but cannot self-accept.
- Semantic edits invalidate downstream results deterministically.
- Review/remediation/refresh is mandatory for pair acceptance.
- Only `spec-design` records pair acceptance.
- Pair acceptance cannot rely on an artifact merely asserting that the user chose something; every load-bearing user-decision basis has durable source evidence or current authorized confirmation.
- Planning handoff cannot omit structural design decisions.
- Planning-basis classification is one immutable result covering the exact request and every load-bearing inspected source; lifecycle records and planning consumers never become second owners.
- Agent runtime mechanics remain in `manage-agents`.
- No fixed swarm topology is introduced.
- No old skill is deleted or retired by implementing this proposal without a separate cutover decision.
- Current plan creation and legacy spec skills do not remain competing generic owners after the cutover.

## Source Basis

This specification preserves useful behavior from the existing `spec-creation-swarm`, `spec-review-swarm`, and `plan-creation-swarm` while changing ownership and topology. The source-to-owner mapping and three-advisor reduction are recorded in [`2026-07-29-spec-design-source-classification.md`](../../wip/skills-authoring/2026-07-29-spec-design-source-classification.md).

`skills-creation` remains the implementation-time owner of trigger wording, `SKILL.md` shape, reference/lane placement, steering, platform mechanics, pruning, and proof design. `manage-agents` remains the owner of all generic agent coordination mechanics.
