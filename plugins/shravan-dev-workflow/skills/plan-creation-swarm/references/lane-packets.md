# Plan Creation Lane Packets

Use these packet shapes for subagent planning lanes. The parent owns the final
implementation plan; subagents produce bounded evidence and candidate plan
structure.

## Shared Packet Skeleton

```text
You are contributing one bounded lane to plan-creation-swarm.
Read-only planning only. Do not edit product code, tests, configs, or plan files.

Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Source artifact: <spec/design/goal/chat packet path>
Source coverage from parent: <line count + chunk ranges, or chat-only limitation>
Lane: <codebase-boundary | validation-proof | execution-order | security-reliability | scope-and-proof-fit>
Reasoning effort: medium | high

Planning question:
<the exact question this lane must answer>

Source-of-truth inputs:
- <spec section / requirement / goal row / chat decision>: <why it constrains planning>

Inspect:
- <path, docs query, test file, package metadata, or command output>: <why>

Non-goals:
- <what this lane must not decide or rewrite>

Return:
- lane name
- status: answered | blocked
- evidence inspected, with paths or source sections
- candidate plan rows, tasks, or constraints
- requirement/proof implications
- conflicts with source artifacts or live repo evidence
- open questions that block planning
- completion receipt: answered | blocked, with source anchors
- confidence: high | medium | low
```

## Lane Overlays

### codebase-boundary

Focus on write surfaces, ownership boundaries, adjacent modules, likely conflict
points, and disjoint lane feasibility. Return candidate task scopes with allowed
write sets and integration touchpoints.

### validation-proof

Map each material requirement to proof modality, proof layer, evidence source,
freshness guard, and red/green need. Consider tests, manual UX validation,
visual proof, data/DB/state checks, logs, traces, metrics, OTel queries, smoke,
e2e, CI, PR, and release artifact proof. Return split/replan triggers for proof
that is too large for a task.

### execution-order

Propose task order, dependencies, integration gates, parallel lanes, and parent
validation points. The output should be an execution DAG candidate, not code
steps.

### security-reliability

Check trust boundaries, secrets, permissions, filesystem/network/subprocess
surfaces, plugin/MCP/agent boundaries, rollback, cleanup, races, partial
failures, and observability needed to prove safe behavior.

### scope-and-proof-fit

Check whether task sizes, sequence, assumptions, and proof gates fit the
accepted spec and approved scope. Name simpler decompositions when they make
proof clearer.
