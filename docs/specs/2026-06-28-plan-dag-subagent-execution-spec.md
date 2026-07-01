# Plan DAG And Subagent Execution Spec

Status: current

## Product Intent

Implementation plans should look like work a capable engineer or Codex subagent
can execute. They should not be horizontal checklists that build schemas,
exports, wrappers, or tests while the real runtime path remains absent.

Success means an accepted spec becomes a dependency-aware plan of vertical or
explicitly contract-only slices, and implementation execution uses subagents
only where the parent can assign, verify, integrate, and prove the work.

## Boundary Map

```text
accepted spec
  owns: requirements, boundaries, contracts, proof expectations
  exposes: source anchors for planning

plan DAG
  owns: ticket-like slices, dependencies, serial/parallel edges, proof gates
  exposes: executable slice packets

parent implementation controller
  owns: dispatch, graph reduction, integration, verification, final claims
  writes: subagent lane ledger and proof matrix

subagent lane
  owns: bounded candidate work or evidence collection
  returns: diff, evidence, questions, proof output, completion receipt

parent verification
  owns: accepted/rejected evidence decision
```

## Slice Model

Every material plan task is one of:

- vertical runtime slice;
- contract-only slice;
- prefactoring slice tied to a named downstream vertical slice.

A vertical slice must name:

- source requirement and spec anchors;
- user-visible or runtime deliverable;
- owner boundary;
- allowed write scope;
- dependencies and blockers;
- acceptance criteria;
- proof gate by layer;
- valuable test rationale;
- false-green risk;
- split or replan trigger.

Contract-only and prefactoring slices must say what they do not prove and which
later vertical slice consumes them.

## Plan DAG Semantics

The plan must include a dependency graph. The graph identifies:

- what can run immediately;
- what depends on another slice;
- what blocks later work;
- what can run in parallel;
- what must serialize because it shares files, schema, migrations, state,
  runtime surfaces, or proof gates.

Edge vocabulary:

```text
requires       this slice needs output from another slice
blocks         later work cannot start until this slice lands
parallel-with  these slices can run at the same time
serial-with    these slices look independent but share a collision point
review-after   this slice needs review feedback before continuing
```

## Slice Card

```text
Ticket:
Source anchors:
Deliverable:
Runtime/user path:
Allowed scope:
Dependencies:
Acceptance:
Proof:
Valuable test rationale:
False-green risk:
Subagent use:
Parallelism:
Communication needs:
External review:
Split/replan trigger:
```

## Subagent Execution Ledger

Implementation execution must not launch and forget subagents. Every subagent
lane has a parent-owned ledger row:

```text
lane_id:
agent_id:
task_packet:
allowed_scope:
source_requirements:
expected_proof:
status:
returned_artifacts:
parent_verification:
integration_status:
open_concerns:
```

Minimum statuses:

```text
planned
assigned
running
needs_context
blocked
returned
accepted
accepted_with_concerns
rejected
integrated
verified
deferred
```

A returned subagent result is candidate evidence. It cannot satisfy a plan row
until the parent inspects the relevant diff, files, proof output, or source
anchors.

## Routing Rules

```text
small serial slice
  -> parent implements

bounded research, review, or helper task
  -> subagent lane

implementation slice
  + source anchors
  + explicit proof gate
  + disjoint write scope or serialized dependency edge
  -> implementation subagent or parent execution

Claude / agy / Gemini second opinion or review lane
  -> ACPX structured review transport

Codex app-server thread
  -> out of active scope
```

Parallel implementation subagents are allowed only when their write scopes and
integration points are disjoint or intentionally staged. Shared schemas,
migrations, runtime state, or one slice changing another slice's assumptions
must serialize or split smaller.

Subagent communication is parent-reduced. Codex subagents may send messages or
follow-up requests through the agent control plane, but the parent owns
decisions, graph updates, integration order, and final proof claims.

## Requirements

R1. Every material plan task must be a vertical slice, contract-only slice, or
prefactoring slice tied to a downstream vertical slice.

R2. Plans must include a DAG with dependency and parallelism edges.

R3. Every slice must define valuable tests that prove the behavior, boundary, or
invariant that could otherwise regress.

R4. Plans must name subagent suitability per slice.

R5. Plan review must verify traceability from source requirement to ticket to
deliverable to proof.

R6. Plan review must reject false-green proof, including wrong-surface tests,
schema-only proof for runtime behavior, or old e2e proof for a new path.

R7. Implementation execution must track subagent assignment, return,
verification, integration, and proof separately.

R8. If subagent work reveals a spec/plan contradiction, the lane stops as
`needs_context` or `blocked`; the parent routes to the correct workflow instead
of broadening implementation scope.

R9. Final implementation reports must summarize subagents used, what each
contributed, which evidence was parent-verified, and which lanes remain open.

R10. ACPX-backed external agents are review and second-opinion lanes, not
implementation owners.

## Non-Goals

- Do not require every tiny change to become a large ticket.
- Do not force rote positive/negative test pairs.
- Do not make subagents mandatory.
- Do not require app-server thread planning.
- Do not let subagents mark parent plan rows complete.

## Proof Expectations

- Pressure test where a horizontal schema/router/export plan is rejected because
  no vertical runtime path is proven.
- Pressure test where two slices cannot run in parallel because they share a
  schema, migration, or file ownership boundary.
- Pressure test where a returned subagent summary is rejected until the parent
  verifies source anchors and proof output.
- Pressure test where implementation reports distinguish returned, integrated,
  and verified.
