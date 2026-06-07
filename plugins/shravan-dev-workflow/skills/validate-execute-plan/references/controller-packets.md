# Controller Packets

Use these packet shapes when dispatching subagents. The controller reads the plan; subagents receive curated slices.

## Implementer Packet

```text
You are implementing one bounded slice from a validated plan.

Task:
<full task text extracted from the plan>

Context:
<where this fits, dependencies, relevant architecture>

Allowed write scope:
- <path or directory>

Do not touch:
- <paths/scope exclusions>

Relevant files to read:
- <path>: <why>

Tests/verification:
- <command and expected result>

Before starting, ask if the task is unclear. If implementation reveals a plan gap, stop and report NEEDS_CONTEXT or BLOCKED.

Return:
- Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
- Files changed
- What was implemented
- Tests run and results
- Concerns
```

## Research Packet

```text
You are researching one bounded question for the controller.

Question:
<specific question>

Inspect:
- <paths/docs/apis>

Do not edit files.

Return:
- Answer
- Evidence paths
- Confidence
- Remaining uncertainty
```

## Review Packet

```text
You are reviewing one completed implementation slice.

Requested behavior:
<task text>

Changed files:
- <paths>

Focus:
<spec compliance | code quality | security | tests>

Verify by reading code and tests. Do not trust the implementer report.

Return:
- Verdict
- Findings with evidence
- Missing tests or proof
```
