# Spec and Program Design Workflow Specification

Date: 2026-07-28

Status: accepted-to-implement after the 2026-07-30 naming correction

Runtime skill specifications:

- [`spec-design`](./2026-07-28-spec-design.md) — authoritative Why/What craft
- [`program-design`](./2026-07-28-program-design.md) — structural How craft
- [`spec-program-review`](./2026-07-28-spec-program-review.md) — independent classification and review

## Decision

Create exactly three independently invocable runtime skills:

```text
spec-design
  owns authoritative Why / What

program-design
  owns structural How

spec-program-review
  owns independent classification and review
```

This document connects those skills. It is not a fourth runtime skill and does not reserve the name `spec-design` for orchestration.

The composing caller or an existing orchestration facility owns sequencing, persistence, resume, and acceptance. It must consume the three skills' typed results without reimplementing their domain judgment. No new stateful orchestration skill is introduced by this specification.

## Why This Decomposition Exists

The old creation and review skills contain useful craft, but their fixed swarm topology and combined product/requirements/architecture surface blurred three different reasons to change:

1. Product meaning, consumer obligations, and observable contracts change for Why/What reasons.
2. Components, ownership, interfaces, state, flows, failure handling, and proof seams change for structural How reasons.
3. Independent review changes when risk, evidence, or review calibration changes.

Collapsing these crafts loses fidelity. Adding a fourth orchestration skill would add lifecycle machinery without improving any of the three crafts. The replacement keeps the craft skills complete and lets callers compose them as a workflow.

## Workflow Spine

```text
intent, evidence, decisions, or an existing draft
  -> spec-design
       authority + problem + consumers
       outcomes + requirements
       observable contracts + failures
       constraints + proof obligations
  -> program-design
       current-system model + options
       components + ownership + interfaces
       state + calls + flows
       failure/recovery + concurrency + trust
       proof seams
  -> spec-program-review
       independent specification review
       independent program-design review
       whole-pair traceability and planning readiness
  -> caller-owned remediation loop
       Why/What finding -> spec-design
       How finding -> program-design
       changed artifact -> refresh affected review
  -> implementation planning
```

This spine is semantic, not a mandatory tool sequence. A direct one-phase request invokes only the owning skill. A composing caller runs later phases only when the requested outcome requires them.

## Semantic Ownership

| Question | Sole semantic owner | Does not own |
| --- | --- | --- |
| Why does this need to exist or change? Who consumes it? What must be observably true? | `spec-design` | internal component structure or tasks |
| Which components, owners, interfaces, states, calls, flows, and failure mechanisms realize it? | `program-design` | new product meaning or tasks |
| Is either artifact or their pair authoritative, coherent, traceable, testable, and ready for planning? | `spec-program-review` | edits, remediation, or acceptance state |
| What runs next, where state persists, and whether a current reviewed pair is accepted for a larger workflow? | composing caller | rewriting the three skills' judgments |

Each semantic fact has one home. The workflow may carry identities and digests; it must not copy or weaken the underlying meaning.

## Trigger Routing

Generic routing is:

```text
requirements, product contract, observable behavior,
constraints, proof obligations                         -> spec-design

components, module boundaries, component tree,
interfaces, state model, calls, data/control flow,
failure/recovery, concurrency, trust, proof seams      -> program-design

review this spec, architecture, program design,
or spec/program pair                                   -> spec-program-review

implementation tasks, files, ordering, exact commands -> plan creation
```

Adjacent routes:

- discussion-only extraction of tacit needs or unmade decisions routes to `discuss-pathfinding`;
- reconvergence of a drifted shared mental model routes to `discuss-clarify-mental-models`;
- authoring or evaluating one named runtime skill package routes through `skills-creation`, which may explicitly call these general design skills;
- a standalone security scan, security audit, or threat model routes to `ops-security-review`;
- explicit requests for `spec-creation-swarm` or `spec-review-swarm` continue to invoke those legacy workflows.

No generic trigger may route to both a new skill and a legacy swarm skill.

## Independently Invocable Contracts

### `spec-design`

Starts from intent, evidence, decisions, current behavior, or an existing draft.

Returns exactly one local terminal result:

```text
locally-ready
decision-needed
evidence-blocked
deferred
```

A locally ready result binds the specification identity and digest, governing-source coverage, decision inventory, requirement/proof inventory, self-check, required independent local-review coverage, and remaining gaps. It does not claim structural How or pair readiness.

### `program-design`

Starts from an authoritative versioned or digest-bound Why/What result.

Returns exactly one local terminal result:

```text
locally-ready
specification-gap
evidence-blocked
decision-needed
deferred
```

A locally ready result binds the program-design identity and digest, governing specification digest, source coverage, structural model, requirement-realization inventory, self-check, required independent local-review coverage, and remaining gaps. It does not claim pair readiness.

### `spec-program-review`

Supports a reviewer-free classification entry and three fresh review modes:

```text
classify-review-requirement:
  specification-only | program-only
  -> review-required | non-substantial

review:
  specification-only | program-only | pair
  -> ready | needs-revision | blocked | decision-needed
```

Every review result binds exact artifact and governing-source digests. `ready` is a review verdict for those exact inputs. The skill never edits artifacts or writes caller-owned lifecycle state.

## Composition Rules

### 1. Bind exact inputs

The caller records exact artifact identities/digests and governing-source coverage returned by each skill. A human-readable path without a digest or revision identity is insufficient for freshness-sensitive reuse.

### 2. Preserve altitude

The caller routes missing meaning to the semantic owner:

```text
consumer, outcome, obligation, public contract,
constraint, or proof-modality gap             -> spec-design

component, owner, interface, state, flow,
failure mechanism, concurrency, trust,
or proof-seam gap                             -> program-design

review coverage, finding quality,
or readiness judgment gap                     -> spec-program-review

workflow persistence, resume, or acceptance   -> caller
```

The caller does not fill a missing semantic result with orchestration prose.

### 3. Keep local review and pair review distinct

Each authoring skill asks `spec-program-review` to classify whether its current artifact requires independent local review. A required review is a separate fresh-context review invocation.

Pair review independently checks both artifacts and their relationship. Author self-checks and local reviews are inputs, not substitutes for pair review.

### 4. Invalidate by meaning

- A semantic `spec-design` edit invalidates specification review, pair review, and the program design unless that design is explicitly revalidated against the new specification digest.
- A semantic `program-design` edit invalidates program review and pair review.
- A non-semantic metadata/link repair invalidates only receipts whose exact reviewed text or identity changed.
- A review receipt never silently changes coverage after an edit.

### 5. Remediate through the owner

Accepted Why/What findings return to `spec-design`. Accepted How findings return to `program-design`. After correction, the caller obtains refreshed review for every invalidated coverage surface.

Contested findings stay visible until the authorized decision maker resolves them. Missing evidence remains `unverified`; silence is never a clean receipt.

### 6. Gate planning on current pair readiness

Design-bearing planning may start when:

- the current specification and program-design digests are known;
- required local review coverage is current;
- a current pair review returns `ready`;
- accepted findings are corrected and covered by refreshed review;
- no blocking decision or evidence gap remains.

The planner consumes semantic decisions and chooses tasks, files, order, exact commands, red/green steps, evidence capture, and rollout mechanics. It must not invent Why/What or structural How.

For a truly implementation-mechanical change with no design-bearing category, a composing caller may route directly to planning only when the existing planning workflow's own input classification proves that no new product obligation, owner/boundary, interface, state semantic, failure/recovery policy, concurrency/consistency decision, compatibility realization, trust control, or proof seam is required.

## Bounded Delegation

Delegation remains available inside all three skills when one bounded evidence, modeling, section-writing, or review question benefits from independent work. There is no default swarm and no required fan-out count.

The phase owner retains meaning and final synthesis:

- subagents return candidate evidence or candidate findings;
- section writers may organize already authorized claims but may not originate requirements, invariants, realizations, option selections, failure policy, or normative prose;
- focused reviewers deepen a predicate-selected risk but never replace one fresh mode-complete review;
- `manage-agents` owns runtime, model, context, permissions, packet, and receipt mechanics.

## Artifact Placement

The three runtime skills live in:

```text
plugins/shravan-dev-workflow/skills/spec-design/
plugins/shravan-dev-workflow/skills/program-design/
plugins/shravan-dev-workflow/skills/spec-program-review/
```

Their design contracts live together in this specification folder because they describe one integration boundary while retaining one file per semantic owner.

One-off research ledgers, advisor packets, and review reports are process evidence. They belong in repo-local `tmp/` by default, or `docs/wip/` only when the repo workflow intentionally needs a temporary human-readable artifact. They do not become runtime skill references and do not belong inside the design artifacts' decision spine.

## Legacy Workflow Preservation

`spec-creation-swarm` and `spec-review-swarm` remain on disk and remain explicitly invocable. They are not deleted, silently aliased, or rewritten into the three new skills.

Their generic model-invocable triggers must narrow to explicit legacy invocation so generic design/review prompts route deterministically to the new owners. Their useful craft is preserved as prior art:

- product intent and user-decision discipline;
- requirements testability and contract/scope judgment;
- architecture, state, trust, failure, and tradeoff analysis;
- proof modality and harness-fit judgment;
- whole-artifact reading, crux attacks, source-backed findings, and parent reduction.

The fixed mandatory swarm topology is not preserved.

## Integration Surfaces

Implementation updates, at minimum:

- the three new skill trees and generated platform metadata;
- plugin manifests/version and plugin README inventory;
- root `AGENTS.md` current-skill inventory and routing prose;
- `discuss-pathfinding` and `discuss-clarify-mental-models` handoff routes;
- planning input boundaries so planning consumes current reviewed design rather than inventing it;
- legacy creation/review descriptions and public routing prose, without deleting their files;
- a dated public-safe changelog entry.

Any other cross-skill change must be justified by an actual conflicting trigger, stale route, or consumer contract found during implementation. This specification does not authorize a broad wording sweep.

## Proof Plan

No pressure tests run in this implementation pass. Behavioral proof remains explicitly deferred until the pressure harness is ready.

Required current proof is static and structural:

- YAML/frontmatter validity and trigger-length checks;
- internal reference and cross-skill route audit;
- one-owner/no-fourth-skill audit;
- legacy-skill-presence audit;
- plugin manifest validation;
- changelog/version consistency;
- fresh-context implementation review of each new skill and the integrated routing diff.

Static validation is not behavior proof. The shipping report must state the deferred behavior-proof gap.

## Acceptance Criteria

- Exactly three new runtime skills exist: `spec-design`, `program-design`, and `spec-program-review`.
- `spec-design` teaches authoritative Why/What and is never used as the name of a fourth orchestrator.
- `program-design` teaches structural How without inventing requirements.
- `spec-program-review` independently classifies and reviews without editing or accepting.
- Each skill is independently invocable and returns a complete local result.
- A composing caller can sequence the three using exact identities/digests without recreating their craft.
- Pair review and remediation preserve freshness and semantic ownership.
- Planning receives both authoritative meaning and structural design.
- Bounded delegation remains available without fixed swarm topology.
- Existing `spec-creation-swarm` and `spec-review-swarm` remain available for explicit legacy use.
- Domain teaching remains primary; schemas and lifecycle fields do not substitute for craft.
- Pressure testing is explicitly deferred rather than claimed.

## Source Basis

This specification preserves the strongest product-intent, requirements, contract/scope, architecture-boundary, security, proof, current-system, and review judgment from `spec-creation-swarm`, `spec-review-swarm`, and `plan-creation-swarm`. It preserves bounded delegation and parent reduction while rejecting fixed swarm topology.

The earlier four-skill proposal, source classification, and review reports remain historical process evidence. Their four-skill names and ownership decisions are superseded. The 2026-07-30 correction restores the user-directed three-skill identity and the name `spec-design` for Why/What craft.
