# Plan Creation Lane Packets

Use these packet shapes for subagent planning lanes. The parent owns the final
implementation plan; subagents produce bounded evidence and candidate plan
structure. Also consume the shared contract in
`../../references/lane-contract.md`; this file owns
plan-specific lane names, source classes, execution-DAG shaping, validation
gates, proof matrix expectations, and split/replan triggers.

Lane outputs are candidate evidence until parent synthesis verifies source
anchors and accepts them into `implementation-plan.md`.

Parent summaries route lanes; they do not constrain lanes. The accepted
spec/design/goal contract is the primary source for plan creation. Research
ledgers, prior lane files, current-state excerpts, docs, and command output are
supporting evidence unless they are explicitly part of the accepted source
contract.

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
Primary source artifact(s) to load directly:
- <accepted spec/design/goal path, or chat-only source packet>: <required coverage>
Source coverage from parent: <line count + chunk ranges, or chat-only limitation>
Compact binding excerpts or source-derived brief:
- <exact copied requirement, boundary, non-goal, global constraint, proof expectation, or open planning input>
Working plan artifact / section / slice map, when one exists:
- <path or none>: <why this is secondary to the accepted source>
Parent routing summary:
<neutral routing context; not evidence by itself>
Supporting evidence only:
- <research ledger, lane file, code/doc path, command output, session artifact>: <why it supports planning>
Lane: <spec-intake-traceability | global-constraints-and-interfaces | vertical-slice-decomposition | validation-proof | execution-order | codebase-boundary | scope-and-proof-fit | security-reliability | ux-manual-observability-proof | migration-release-readiness | whole-plan-coverage>
Selected lane reference to load before answering:
- <repo-resolvable or absolute path, for example plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/<lane>.md>
Reasoning effort: medium | high

Planning question:
<the exact question this lane must answer>

Source-truth distinction:
- Primary source constrains the lane.
- Parent routing summary is not evidence.
- Supporting evidence corroborates or challenges the primary source.
- Lane assumptions must be reported as uncertainty.

Accepted source anchors:
- <source section / requirement / goal row / chat decision>: <why it constrains planning>
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
- status: answered | answered-with-gaps | needs-context | blocked
- candidate evidence label
- primary_sources_loaded
- sources_checked
- claims
- contradictions
- uncertainty
- candidate_plan_implications
- requirement_proof_implications
- coverage_scope
- cannot_verify_from_focused_packet
- artifact_classes_emitted
- proposed_artifact_path
- requested_parent_action: accept | reject | defer | route-to-spec | route-to-human
- completion receipt: answered | blocked, with source anchors and proposed
  artifact paths; parent writes lane files for read-only planning lanes
- confidence: high | medium | low
```

## Parent Plan Ledger

For substantial work, the parent `plan-ledger.md` records:

- accepted spec or design source coverage
- lane packets issued and lane artifact paths under `lanes/`
- candidate evidence accepted, contested, rejected, deferred, or left open
- parent reducer decisions with source artifact, anchor check, contradiction
  check, coverage check, artifact-shape check, accepted plan location, and route
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

### spec-intake-traceability

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/spec-intake-traceability.md`.

### global-constraints-and-interfaces

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/global-constraints-and-interfaces.md`.

### vertical-slice-decomposition

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/vertical-slice-decomposition.md`.

### validation-proof

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/validation-proof.md`.

### execution-order

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/execution-order.md`.

### codebase-boundary

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/codebase-boundary.md`.

### scope-and-proof-fit

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/scope-and-proof-fit.md`.

### security-reliability

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/security-reliability.md`.

### ux-manual-observability-proof

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/ux-manual-observability-proof.md`.

### migration-release-readiness

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/migration-release-readiness.md`.

### whole-plan-coverage

Use `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/whole-plan-coverage.md`.
