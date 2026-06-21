# Spec Design Swarm Packets

Use these packet shapes when dispatching read-only subagents. The parent owns synthesis and decisions.

## Common Contract

```text
You are a read-only design/research lane.
Do not edit files, stage changes, commit, or write implementation code.

Repo: <absolute repo path>
Question: <bounded question>
Design stage: pre-plan design formation
Parent needs: evidence, tradeoffs, and decision input
Reasoning effort: high | xhigh
Source-of-truth inputs:
- <path, doc, log, issue, or code search>: <why this source constrains the lane>

Inspect:
- <path or docs query>: <why>

Return:
- lane name
- files/docs inspected
- answer
- design implications
- risks or hidden assumptions
- security implications, if any
- recommended next checks
- completion receipt: answered | blocked, with source anchors
- confidence: high | medium | low
```

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
Take this stance: <minimal-change | clean-boundary | pragmatic-balance | risk-and-tradeoff>.

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
