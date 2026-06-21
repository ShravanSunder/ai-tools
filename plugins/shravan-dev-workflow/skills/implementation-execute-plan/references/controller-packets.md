# Controller Packets

Use these packet shapes when dispatching subagents. The controller reads the plan; subagents receive curated slices.

## Implementer Packet

```text
You are implementing one bounded slice from a validated plan.

Reasoning effort: <medium | high | xhigh>

Task:
<full task text extracted from the plan>

Plan anchors:
- task id / heading: <exact source>
- requirement/proof matrix rows: <row ids or source text>
- source requirement/spec refs: <sections or links>

Execution DAG position:
<parallel lane, serial step, dependency, integration gate, and validation gate>

Context:
<where this fits, dependencies, relevant architecture>

Security invariants:
- <assets, entry points, untrusted inputs, trust boundaries, sensitive data,
  privileged actions, forbidden permission/network broadening, or "not security-sensitive">

Allowed write scope:
- <path or directory>

Do not touch:
- <paths/scope exclusions>

Relevant files to read:
- <path>: <why>

Tests/verification:
- <command and expected result>
- <security proof command or manual check when applicable>

Proof obligations:
- <requirement or matrix row>: <proof modality, proof layer, evidence source, freshness guard, red/green requirement>

Before starting, ask if the task is unclear. If implementation reveals a plan gap, stop and report NEEDS_CONTEXT or BLOCKED.
Do not read the whole plan unless the controller explicitly says this slice
requires it.

Return:
- Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
- Files changed
- What was implemented
- Proof commands run, exit codes, and relevant output summary
- Red/green evidence status or approved exception source
- Requirement/proof rows satisfied
- Evidence freshness status
- Blockers
- Concerns separate from blockers
- Completion receipt: answered | blocked, with plan anchors
```

## Research Packet

```text
You are researching one bounded question for the controller.

Reasoning effort: <medium | high | xhigh>

Question:
<specific question>

Decision target:
<implementation decision, proof gate, API behavior, source boundary, or blocker this answer informs>

Source class:
<local code | docs | tests | package/tooling | external docs | session evidence>

Inspect:
- <paths/docs/apis>

Do not edit files.

Return:
- Answer
- Evidence paths or source sections
- How the evidence changes the controller decision
- Confidence
- Remaining uncertainty
- Completion receipt: answered | blocked, with source anchors
```

## Review Packet

```text
You are reviewing one completed implementation slice.

Reasoning effort: <medium | high | xhigh>

Requested behavior:
<task text>

Plan anchors:
- task id / heading: <exact source>
- requirement/proof matrix rows: <row ids or source text>

Changed files:
- <paths>

Implementation proof provided:
- <commands, exit codes, red/green evidence, artifacts, blockers>

Focus:
<spec compliance | code quality | security | tests>

Verify by reading code and tests. Do not trust the implementer report.
For security review, include validation status: validated | unvalidated with proof gap | rejected.

Return:
- Verdict
- Findings with severity, evidence, scenario, smallest fix, proof, and confidence
- Missing tests or proof
- Requirement/proof row status
- Completion receipt: answered | blocked, with plan anchors
```
