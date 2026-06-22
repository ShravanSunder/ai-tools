# Controller Packets

Use these packet shapes when dispatching subagents. The controller reads the
plan; subagents receive curated slices.

Consume `../../references/lane-contract.md` as the shared lane packet contract.
This file only adds execution-controller overlays:
bounded implementation slices, proof obligations, controller verification, and
completion receipts.

For substantial execution swarms, preserve an inspectable artifact trail in the
existing execution/controller brief home. If execution artifacts live beside the
source plan workflow instead, the controller brief or parent ledger must point
to that source workflow and to each parent-written lane artifact path. Subagent
outputs are candidate evidence until controller-side parent verification
inspects changed files, diffs, and test output.

## Implementer Packet

```text
You are implementing one bounded slice from a validated plan.

Role / mode: implementation-scoped worker lane.
Reasoning effort: <medium | high | xhigh>
Edit boundary: only the allowed write scope below.
Bounded question: <the implementation slice this lane must complete>
Decision target: <parent controller decision or integration gate this lane informs>

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

security context: <applicable | not applicable>
- If not applicable: <short reason>
- If applicable: <pointer to parent security context plus lane deltas, or
  assets/entry points/untrusted inputs/trust boundaries/sensitive data/
  privileged actions/security non-goals/required proof>
- Forbidden broadening: no filesystem, network, subprocess, package-script, CI,
  MCP, plugin, agent, external-model, auth, or secret-boundary broadening beyond
  the validated plan.

Allowed write scope:
- <path or directory>

Do not touch:
- <paths/scope exclusions>

Relevant files to read:
- <path>: <why>

Inspect:
- <path, command output, docs, or tests>: <why>

Non-goals:
- <files, behaviors, or follow-up tasks this lane must not own>

Contradiction handling:
- Report conflicts with the plan, source requirements, live repo evidence, or
  sibling-lane changes before broadening scope.

Tests/verification:
- <command and expected result>
- <security proof command or manual check when applicable>

Proof obligations:
- <requirement or matrix row>: <proof modality, proof layer, evidence source, freshness guard, red/green requirement>

Artifact path:
- <lane artifact path, or "chat-only/no-files exception: <reason>">

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
- Artifact path
- Blockers
- Concerns separate from blockers
- completion receipt: answered | blocked, with plan anchors, source anchors,
  artifact path, changed paths, and command evidence
```

## Research Packet

```text
You are researching one bounded question for the controller.

Role / mode: read-only research lane.
Reasoning effort: <medium | high | xhigh>
Edit boundary: read-only.
Bounded question:
<specific question>

Question:
<specific question>

Decision target:
<implementation decision, proof gate, API behavior, source boundary, or blocker this answer informs>

Source class:
<local code | docs | tests | package/tooling | external docs | session evidence>

security context: <applicable | not applicable>
- If not applicable: <short reason>
- If applicable: <pointer to parent security context plus lane deltas, or
  assets/entry points/untrusted inputs/trust boundaries/sensitive data/
  privileged actions/security non-goals>

Inspect:
- <paths/docs/apis>

Do not edit files.

Non-goals:
- <decisions, implementation, or review verdicts this evidence lane must not own>

Contradiction handling:
- Report conflicts with source artifacts, live repo evidence, or sibling-lane
  evidence as uncertainty; the controller resolves them.

Return:
- candidate evidence answer
- Evidence paths or source sections
- How the evidence changes the controller decision
- Confidence
- Remaining uncertainty
- Proposed artifact path and candidate lane-file content, or
  "chat-only/no-files exception: <reason>"
- completion receipt: answered | blocked, with source anchors and proposed
  artifact path; controller writes lane files for read-only lanes
```

## Review Packet

```text
You are reviewing one completed implementation slice.

Role / mode: read-only implementation review lane.
Reasoning effort: <medium | high | xhigh>
Edit boundary: read-only.
Bounded question: <the review question this lane answers>
Decision target: <controller readiness decision this review informs>

Requested behavior:
<task text>

Plan anchors:
- task id / heading: <exact source>
- requirement/proof matrix rows: <row ids or source text>

Changed files:
- <paths>

Implementation proof provided:
- <commands, exit codes, red/green evidence, artifacts, blockers>

security context: <applicable | not applicable>
- If not applicable: <short reason>
- If applicable: <pointer to parent security context plus lane deltas, or
  assets/entry points/untrusted inputs/trust boundaries/sensitive data/
  privileged actions/security non-goals/required proof>

Focus:
<spec compliance | code quality | security | tests>

Inspect:
- <changed files, tests, command output, or artifacts to inspect and why>

Non-goals:
- Do not edit files, broaden the slice, or decide final readiness.

Contradiction handling:
- Report conflicts with plan anchors, source requirements, implementation
  proof, or sibling-lane evidence; the controller resolves them.

Verify by reading code and tests. Do not trust the implementer report.
For security review, include validation status: validated | unvalidated with proof gap | rejected.

Return:
- Verdict: ready | needs fixes | blocked
- candidate findings with severity, evidence, scenario, smallest fix, proof, and confidence
- Missing tests or proof
- Requirement/proof row status
- Proposed artifact path and candidate review-lane content, or
  "chat-only/no-files exception: <reason>"
- completion receipt: answered | blocked, with plan anchors, source anchors,
  proposed artifact path, and proof checked
```

## Controller Verification

The controller performs parent verification after every packet:

- inspect returned changed files and diffs
- verify candidate evidence against source anchors
- rerun or inspect proof commands and exit codes when they support completion
- map proof back to plan anchors and requirement/proof rows
- label results accepted, contested, open, rejected, or deferred
- record skipped proof layers only with a concrete blocker or approved exception
- make the final completion claim only from fresh controller-owned evidence
