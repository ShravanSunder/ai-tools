# Spec Creation Swarm Packets

Use these packet shapes when dispatching read-only subagents. Also consume the
shared contract in `../../references/lane-contract.md`;
this file owns spec-creation lane names, design source classes, constructive
challenge lanes, proof expectations, and next-workflow handoff.

The parent owns synthesis and decisions. Lane outputs are candidate evidence
until the parent reducer verifies source anchors and folds accepted evidence
into the spec artifact.

For substantial spec creation, create inspectable stage artifacts unless the
user asked for chat-only/no-files, the work is a single tiny local lane, or the
tool surface cannot write artifacts. Substantial means any of: more than one
lane/subagent, output consumed by another workflow or phase, high/xhigh or
security-sensitive lanes, or findings/decisions/proof obligations that need
later inspection. Record any exception in the parent receipt.

Default artifact shape:

```text
tmp/spec-workflows/<date>-<slug>/
  swarm-ledger.md
  lanes/
    <lane-name>.md
  spec.md
```

## Spec-Creation Packet Overlay

```text
You are a read-only design/research lane.
Do not edit files, stage changes, commit, or write implementation code.

Repo: <absolute repo path>
Question: <bounded question>
Decision target: <spec decision, requirement, boundary, tradeoff, or proof expectation this evidence informs>
Design stage: pre-plan design formation
Parent needs: evidence, tradeoffs, and decision input
Reasoning effort: high | xhigh
Source-of-truth inputs:
- <path, doc, log, issue, or code search>: <why this source constrains the lane>
Security context: applicable | not applicable
- not applicable: <reason>
- applicable: <pointer to parent security context plus lane deltas, or assets,
  entry points, untrusted inputs, trust boundaries, sensitive data, privileged
  actions, and security non-goals>

Inspect:
- <path or docs query>: <why>

Non-goals:
- Do not choose implementation order, task sequence, worker assignment, execution DAGs, exact validation commands, or reviewer verdicts.
- <lane-specific design decisions this lane must not own>

Return:
- lane name
- status: answered | blocked
- candidate evidence label
- files/docs inspected
- answer
- design implications
- risks or hidden assumptions
- security implications, if any
- proof expectations or proof modalities, not exact commands
- contradictions or uncertainties
- proposed artifact path and candidate lane-file content, when artifacts are expected
- completion receipt: answered | blocked, with source anchors and proposed
  artifact paths; parent writes lane files for read-only lanes
- confidence: high | medium | low
```

## Parent Swarm Ledger

For substantial work, the parent `swarm-ledger.md` records:

- source-of-truth inputs and lane packets issued
- lane artifact paths under `lanes/`
- candidate evidence accepted, contested, rejected, deferred, or left open
- product intent, requirements, technical-contract, security, separability, and
  proof-expectation decisions accepted into `spec.md`
- route to `spec-review-swarm` for drafted-spec critique, then
  `plan-creation-swarm` after accepted review feedback is folded in
- completion receipt with source anchors, artifact paths, named exceptions, and
  remaining uncertainty

Spec creation stays pre-plan: it names proof expectations and modalities, but
does not produce task sequencing, worker assignment, execution DAGs,
implementation-plan rows, exact validation commands, or reviewer verdicts.

## Codebase Explorer Lane

```text
Find adjacent implementation patterns for this design.

Focus on:
- similar features or flows
- ownership boundaries
- module interfaces
- tests and validation patterns
- key files the parent must read before deciding

Design proposals should cite the local files that constrain them.
```

## Architecture Option Lanes

Use one packet per stance.

```text
Take this stance: <minimal-change | clean-boundary | pragmatic-balance | risk-and-tradeoff-design>.

Argue for the strongest version of this approach. Name:
- file/module boundaries
- what changes
- what stays unchanged
- what complexity is added or removed
- risks
- validation strategy
- when this stance would be wrong
```

## Security Trust Boundary Lane

```text
Map the security-sensitive parts of this design.

Identify:
- assets and privileges
- entry points
- untrusted inputs
- trust boundaries and auth assumptions
- sensitive data paths
- filesystem/network/subprocess/plugin/MCP/agent boundaries
- explicit security non-goals

Return missing threat-model questions only when the answer cannot be inferred from the repo.
```
