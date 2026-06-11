# Improvement Plan Template

Write one file per accepted improvement.

```markdown
# <Improvement Title>

Planned at: <git sha>
Repo: <absolute path>
Status: proposed

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

1. <small executable step>
2. <small executable step>
3. <small executable step>

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

## Handoff Prompt

```text
Use implementation-execute-plan on this plan.

Repo: <absolute path>
Plan: <absolute path>
Start by validating the plan against current git state before editing files.
Use bounded subagents only for independent slices. Parent owns integration and
final proof.
```
```

Also maintain a `plans/README.md` or local index when writing multiple plans:

```markdown
# Improvement Plans

| Status | Plan | Why now | Proof |
| --- | --- | --- | --- |
| proposed | <path> | <reason> | <primary gate> |
```
