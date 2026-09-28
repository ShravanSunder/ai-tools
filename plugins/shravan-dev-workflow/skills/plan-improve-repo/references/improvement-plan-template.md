# Improvement Plan Template

Each accepted improvement gets one breakdown under the canonical contract's breakdown record (`../../../shared-references/canonical-implementation-plan.md`): one node, or one per independent outcome, and owner count does not decide. Write one plan file per breakdown node only when planning can return `ready`. For `revision-requested` or `blocked`, return `plan identity: none` with the result payload and do not instantiate this template.

```markdown
# <Improvement Title>

Planning result: ready
Planned at branch/HEAD: <branch> / <git sha>
Repo: <absolute path>
## Why This Plan Can Be Written

- Basis: current-three-artifact-design-ready | implementation-mechanics-only
- Evidence identity:
  - current-three-artifact-design-ready: <current Requirements path, current Specification path, current Program Design path, the current three-artifact design review result (mode, covered targets, result, and coverage statement) or a pointer to it, covered identities>
  - implementation-mechanics-only: <classification result identity and inspected-source identities>
- Current review coverage: <evidence that review still covers all three artifacts>

## Problem

<What is wrong, why it matters, who pays the cost.>

## Current Evidence

- `<path>:<line>`: <observed fact>
- Command: `<command>` -> <result or limitation>

## Non-Goals

- <what this plan will not change>

## Scope

Write surfaces:
- `<path>`: <expected change>

Read-only context:
- `<path>`: <why it matters>

## Task Sequence

1. <proof-bearing slice: obligation, write surfaces, proof, stop condition>
   tier: <Workhorse | Daily driver> · <direction>/<span>/<horizon> · <reason>
2. <proof-bearing slice: obligation, write surfaces, proof, stop condition>
   tier: <Workhorse | Daily driver> · <direction>/<span>/<horizon> · <reason>
3. <integration gate where separately changed parts first meet>

## Throughput Checkpoint

- Choices later slices depend on: <each written into this plan, or left to the Sidekick with the reason, or n/a: reason> (owner: Throughput Checkpoint in `../../plan-implementation/references/slice-and-proof-design.md`)
- Blocking first steps: <slices or n/a: reason>
- Independent workstreams: <disjoint files, services, or layers, or n/a: reason>
- Shared mutable state: <state several slices write, or n/a: reason>
- Smallest safe decomposition: <fewest executors; if one, why>

## Dependencies And Collisions

- `requires`: <only when one slice cannot start or prove before another>
- `serial`: <overlapping write/state/fixture collision>
- `parallel`: <advisory only, after named prerequisites>

## Obligation And Proof Mapping

| Obligation | Slice | Evidence source | Focused proof | Integration/manual proof | Freshness/stop guard |
| --- | --- | --- | --- | --- | --- |
| <identity> | <slice> | <source> | <command/check> | <if required> | <guard> |

## Proof Gates

- Red/green proof: <test or approved exception>
- Focused validation: `<command>`
- Full validation: `<command>`
- Manual/artifact check: <if needed>

## Stop Conditions

- Stop if <assumption breaks>.
- Stop if <validation failure is outside scope>.

## Risks

- <risk and mitigation>

## Delivery Context

- Requested terminal: plan-only
- Breakdown: <breakdown path>
- Node: <node id>
- Base: <trunk commit | parent PR head>
```

Also maintain a `plans/README.md` or local index when writing multiple plans, pointing each plan back to its breakdown node:

```markdown
# Improvement Plans

| Planning result | Breakdown · node | Plan identity |
| --- | --- | --- |
| ready | <breakdown path> · <node id> | <immutable plan path> |
```

The index projects ready canonical plan paths and their breakdown nodes only. It never owns or mutates the plan record, governing basis, delivery context, validation state, or execution progress. Non-ready results have no plan path and do not enter this index.
