# Plan Creation Lane Packets

Use this skill-local packet contract for subagent planning lanes. The parent
owns the final implementation plan; subagents produce bounded evidence and
candidate plan structure. This file owns plan-specific packet anatomy,
source-truth handling, lane names, source classes, execution-DAG shaping,
validation gates, proof matrix expectations, receipts, parent reducer rules,
and split/replan triggers.

Lane outputs are candidate evidence, not accepted plan truth, until parent
synthesis verifies source anchors and accepts them into
`implementation-plan.md`.

For substantial plan creation, create inspectable stage artifacts unless the
user asked for chat-only/no-files, the work is a single tiny local lane, or the
tool surface cannot write artifacts. Substantial means any of: more than one
lane/subagent, output consumed by another workflow or phase, high/xhigh or
security-sensitive lanes, or findings/decisions/proof obligations that need
later inspection. Record any exception in the parent receipt.

Default artifact shape:

```text
tmp/plan-workflows/<date>-<slug>/
  implementation-plan.md
  plan-ledger.md
  lanes/
    <lane-name>.md
```

## Plan-Creation Packet Overlay

```text
You are contributing one bounded lane to plan-creation-swarm.
Read-only planning only. Do not edit product code, tests, configs, or plan files.

Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Source artifact: <spec/design/goal/chat packet path>
Source coverage from parent: <line count + chunk ranges, or chat-only limitation>
Lane: <codebase-boundary | vertical-slice-decomposition | validation-proof | execution-order | security-reliability | scope-and-proof-fit>
Reasoning effort: medium | high

Planning question:
<the exact question this lane must answer>

Source-of-truth inputs:
- <spec section / requirement / goal row / chat decision>: <why it constrains planning>
Security context: applicable | not applicable
- not applicable: <reason>
- applicable: <pointer to parent security context plus lane deltas, or assets,
  entry points, untrusted inputs, trust boundaries, sensitive data, privileged
  actions, and security non-goals>

Inspect:
- <path, docs query, test file, package metadata, or command output>: <why>

Non-goals:
- <what this lane must not decide or rewrite>

Return:
- lane name
- status: answered | blocked
- candidate evidence label
- evidence inspected, with paths or source sections
- candidate vertical slice cards when the lane affects task shape:
  source requirement -> behavior/capability -> likely touched files/interfaces
  -> checkpoint/integration gate -> proof layers/evidence
- candidate plan rows, tasks, or constraints, anchored to the relevant slice
- requirement/proof implications
- conflicts with source artifacts or live repo evidence
- open questions that block planning
- proposed artifact path and candidate lane-file content, when artifacts are expected
- completion receipt: answered | blocked, with source anchors and proposed
  artifact paths; parent writes lane files for read-only planning lanes
- confidence: high | medium | low
```

## Parent Plan Ledger

For substantial work, the parent `plan-ledger.md` records:

- accepted spec or design source coverage
- lane packets issued and lane artifact paths under `lanes/`
- candidate evidence accepted, contested, rejected, deferred, or left open
- accepted vertical slice cards and rejected horizontal/task-only decompositions
- task sequence, write scopes, execution DAG, integration gates, validation
  gates, requirements/proof matrix, and split/replan triggers accepted into
  `implementation-plan.md`
- route to `plan-review-swarm` for plan critique, then
  `implementation-execute-plan` after accepted review feedback is folded in
- completion receipt with source anchors, artifact paths, named exceptions, and
  remaining uncertainty

Plan creation operationalizes an accepted spec. It does not redefine product
intent or requirements, and it does not execute the plan.

## Lane Overlays

### codebase-boundary

Load `references/lanes/codebase-boundary.md`.

Focus on write surfaces, ownership boundaries, adjacent modules, likely conflict
points, and disjoint lane feasibility. Return candidate task scopes with allowed
write sets and integration touchpoints.

### vertical-slice-decomposition

Load `references/lanes/vertical-slice-decomposition.md`. Map source
requirements into end-to-end work units that each have a clear behavior,
allowed write surface, integration point, checkpoint, and proof gate. Return
candidate slice cards, source anchors, dependencies, and split/replan triggers.

### validation-proof

Load `references/lanes/validation-proof.md`.

Map each material requirement to proof modality, proof layer, evidence source,
freshness guard, and red/green need. Consider tests, manual UX validation,
visual proof, data/DB/state checks, logs, traces, metrics, OTel queries, smoke,
e2e, CI, PR, and release artifact proof. Return split/replan triggers for proof
that is too large for a task.

### execution-order

Load `references/lanes/execution-order.md`.

Propose task order, dependencies, integration gates, parallel lanes, and parent
validation points. The output should be an execution DAG candidate, not code
steps. Reject ordering that separates a slice from the checkpoint and proof
unit that proves it.

### security-reliability

Load `references/lanes/security-reliability.md`.

Check trust boundaries, secrets, permissions, filesystem/network/subprocess
surfaces, plugin/MCP/agent boundaries, rollback, cleanup, races, partial
failures, and observability needed to prove safe behavior.

### scope-and-proof-fit

Load `references/lanes/scope-and-proof-fit.md`.

Check whether task sizes, sequence, assumptions, and proof gates fit the
accepted spec and approved scope. Reject slices that lack local end-to-end
proof. Name simpler decompositions when they make proof clearer.
