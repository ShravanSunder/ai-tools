# Improvement Plan Template

Write one file per accepted improvement only when planning can return `ready`. For `revision-requested` or `blocked`, return `plan identity: none` with the result payload and do not instantiate this template.

```markdown
# <Improvement Title>

Planning result: ready
Planned at branch/HEAD: <branch> / <git sha>
Repo: <absolute path>
## Why This Plan Can Be Written

- Basis: current-three-artifact-design-ready | implementation-mechanics-only
- Evidence identity:
  - current-three-artifact-design-ready: <current Requirements path, current Specification path, current Program Design path, exact three-artifact design review invocation identity, review result identity, covered identities>
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
2. <proof-bearing slice: obligation, write surfaces, proof, stop condition>
3. <integration gate where separately changed parts first meet>

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
- Delivery grouping: single:<name>
- PR topology: not-applicable
```

Also maintain a `plans/README.md` or local index when writing multiple plans:

```markdown
# Improvement Plans

| Planning result | Plan identity |
| --- | --- |
| ready | <immutable plan path> |
```

The index projects ready canonical plan paths only. It never owns or mutates the plan record, governing basis, delivery context, validation state, or execution progress. Non-ready results have no plan path and do not enter this index.
