# Improvement Plan Template

Write one file per accepted improvement.

```markdown
# <Improvement Title>

Planning result: draft | revision-requested | blocked
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

## Result Payload

- `draft`: later explicit owner approval must name the exact completed plan path and current meaning.
- `revision-requested`: <exact correction and owner>.
- `blocked`: <blocker identity, evidence, and unblock owner>.
```

Also maintain a `plans/README.md` or local index when writing multiple plans:

```markdown
# Improvement Plans

| Planning result | Plan identity |
| --- | --- |
| draft \| revision-requested \| blocked | <immutable plan path> |
```

The index projects the canonical result and plan path. It never owns or mutates the plan record, approval evidence, validation state, or execution progress.
