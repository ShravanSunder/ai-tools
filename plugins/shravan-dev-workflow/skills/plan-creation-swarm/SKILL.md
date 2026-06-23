---
name: plan-creation-swarm
description: Use when turning an accepted spec, design, architecture decision, or product requirement into a written implementation plan before code changes begin, especially when sequencing, proof gates, or parallel work lanes must be designed.
---

# Plan Creation Swarm

Create an implementation plan from spec/design context. This is a planning
boundary: it turns the accepted spec contract into "how we will change the repo
and prove it." It does not redefine product intent, rewrite requirements, or
execute the plan. Non-trivial plans carry a
requirements/proof matrix; tasks whose required proof cannot pass at their size
are split before execution.
Large specs may produce one parent plan package with multiple large vertical
ticket or slice artifacts. The parent package owns whole-spec coverage and the
requirements/proof matrix across the ticket set; each ticket is independently
provable and carries source refs, write scope, proof rubric, advancement gate,
and stop/replan conditions.

The spec defines separability; this skill defines sequence. It turns accepted
product intent, requirements, boundaries, and contracts into ordered tasks,
parallel work lanes, disjoint write scopes, integration gates, validation
gates, and evidence requirements.

## Core Rules

- Stay read-only against product surfaces. Do not edit product code, tests,
  configs, or non-plan docs as part of plan creation.
- Write a plan artifact unless the user explicitly asks for chat-only output.
- Read the source spec/design/context before planning. If a source file exists,
  count lines and read all chunks.
- Treat the accepted spec/design/goal contract as the primary source for
  planning. Parent summaries are routing hints only; research ledgers, prior
  lane files, code/docs, logs, and command output are supporting evidence.
- Verify major assumptions against live repo evidence before turning them into
  tasks.
- Use subagents by default for substantial plan creation when codebase boundary,
  validation/proof, execution-order, security/reliability, or scope-and-proof-fit
  lanes can run independently. Plan-creation lanes use medium or high reasoning
  effort according to task complexity, latency cost, and risk. For tiny plans,
  name the smaller lane set used.
- Reject requests for low-effort planning lanes as a planning-quality shortcut.
  In the live response or plan artifact, name the lane reasoning-effort policy:
  medium for bounded/simple planning lanes, high for proof-heavy, security,
  reliability, cross-module, or complex sequencing lanes.
- Give each subagent a self-contained lane packet: role / mode, read-only or
  allowed write scope, exact planning question, primary source artifact paths
  the lane must load directly, compact binding excerpts, parent routing summary
  labeled as non-evidence, supporting evidence links, files/docs to inspect,
  decision target, non-goals, selected durable lane reference path, output
  schema, contradiction handling, uncertainty handling, confidence, the exact field
  `security context: applicable | not applicable`, and completion receipt with
  status `answered | blocked`, `primary_sources_loaded`,
  `supporting_evidence_checked`, `source_truth_distinction_checked`, `coverage_scope`,
  `cannot_verify_from_focused_packet`, source anchors, proposed artifact path,
  contradiction summary, confidence, and remaining uncertainty.
  Lane outputs are candidate evidence until the parent verifies source anchors
  and reduces them into the final plan.
- For substantial plan creation, create a parent plan ledger and per-lane
  artifacts unless the user asked for chat-only/no-files, the work is a single
  tiny local lane, or the tool surface cannot write artifacts. Record the
  exception in the completion receipt.
- Include task sequence, dependency graph, parallel work lanes, disjoint write
  scopes, integration gates, validation gates, rollout or rollback/recovery
  notes, risks, and open questions.
- For large specs, prefer one parent implementation-plan package with multiple
  large independently provable vertical ticket/slice artifacts over many
  unrelated plan files or tiny tickets. Each ticket must be big enough to
  deliver meaningful behavior, state, artifact, or operational evidence and
  small enough to prove in one execution pass.
- Use `whole-plan-coverage` as a conditional creation-side coverage lane for
  high-risk, multi-slice, multi-artifact, or source-to-plan
  coverage-sensitive planning. It helps draft plan coverage; it does not review
  the produced plan and does not satisfy plan-review-swarm's
  `whole-plan-cohesion` lane.
- Include a requirements/proof matrix for non-trivial plans: requirement or
  claim, source spec/requirement reference, owning task, proof modality, proof
  gate, proof layer, evidence source, freshness guard, whether red/green
  evidence is required, and whether the task is sized so that proof can pass
  inside the approved scope. Tiny plans may use a compact proof line and say why
  it is sufficient.
- Use the testing pyramid as proof vocabulary, not as a rote checklist. For
  each requirement, aspect, or ticket, define a proof rubric: risk or failure
  mode, why the proof is valuable, smallest useful red proof, selected pyramid
  layer or layers, higher runtime/user/release proof when needed, expected
  signal, freshness guard, and tests deliberately not written because they would
  only freeze implementation details.
- Select pyramid layers by the source requirement and risk. Unit tests fit fast
  deterministic logic, integration tests fit real boundaries, smoke tests fit
  the owned runnable surface, e2e fits full user/runtime paths, and PR/release
  gates fit merge or artifact readiness. Lower layers remain explicit when a
  higher layer exists, but not every ticket needs every layer.
- Add the proof modalities required by the spec and product surface: automated
  tests, manual UX validation, visual evidence for visual systems, data or DB
  state checks, logs, traces, metrics, OTel queries, release artifacts, or
  operational smoke proof. Name these as concrete validation modalities when
  planning or rejecting a shortcut that tries to collapse proof to one check.
- Use TDD for behavior changes when feasible: identify or add the smallest
  failing proof tied to a requirement, watch it fail for the expected reason,
  implement, then make it pass and climb the proof pyramid only as needed.
- Valuable TDD proves behavior, contract, state, boundary, user-visible
  outcome, or operational evidence. Reject proof rows that only assert
  implementation shape, deleted files/configs, or symmetric positive/negative
  cases unless the accepted spec makes that absence, shape, or branch a contract
  or security invariant.
- If the source is a goal contract, preserve known matrix rows from that
  contract and define any missing implementation rows here instead of leaving
  evidence definition to the executor.
- A red/green exception is valid only when recorded in the matrix with the
  user's explicit approval noted; an agent-authored waiver is not an exception.
- If a task's required proof cannot pass at its current size, split the task
  before execution and make the proof route explicit.
- Capture security assumptions when the plan touches auth, secrets, parsing,
  filesystem, network, subprocesses, plugins, MCP, CI, package scripts, agents,
  or external services.
- When rejecting a shortcut that skips security or proof detail, still name
  security assumptions or security context as part of the eventual plan.
- When a shortcut prevents dispatching lanes in the current run, still name the
  intended lane packet shape, medium/high reasoning effort assignment,
  candidate evidence rule, parent synthesis rule, `implementation-plan.md`,
  `plan-ledger.md`, and `lanes/<lane-name>.md` in the response.
- Do not review the plan here. Use `plan-review-swarm`.
- Do not execute the plan here. Use `implementation-execute-plan` after the plan
  exists and is validated.
- If the user only wants to transfer spec/design context, use `spec-handoff`.

## Workflow

1. Resolve the source:
   - spec/design artifact
   - product requirement
   - chat decision
   - existing architecture docs
2. Establish source coverage:
   - line count and chunk ranges for files
   - packet files for handoffs
   - limitations for chat-only input
3. Inspect current repo evidence:
   - relevant files/modules
   - existing tests and commands
   - package/tooling layout
   - security-sensitive surfaces
4. Write or prepare the implementation plan:
   - goal and non-goals
   - product intent, requirements, and spec source coverage
   - requirements/proof matrix, or compact proof line for tiny plans
   - plan package shape for large specs: parent plan plus large vertical tickets
     or slice artifacts when that keeps coverage readable
   - evidence sources and freshness guards for each non-trivial row
   - proof rubrics tied back to source requirements, selected pyramid layers,
     and the reason each proof is valuable
   - task sequence
   - execution DAG with parallel lanes and integration gates
   - files/modules likely touched
   - validation gates by layer
   - split/replan triggers when proof cannot pass at the planned scope
   - rollback/recovery and risk notes
   - open questions
5. Route next:
   - `plan-review-swarm` when the plan needs review
   - `plan-handoff` when another agent should consume the plan
   - `implementation-execute-plan` only after the written plan exists and is
     ready to validate against the repo

## Default Planning Lanes

For substantial plans, dispatch bounded lanes where tool support exists:

- `spec-intake-traceability`: verifies accepted spec coverage, freshness,
  drift, source anchors, and missing planning inputs.
- `global-constraints-and-interfaces`: extracts binding constraints and
  cross-slice interfaces from the accepted source and current repo.
- `vertical-slice-decomposition`: proposes end-to-end slice boundaries and
  flags horizontal chunks; for large specs it can propose a parent plan package
  with large independently provable ticket/slice artifacts.
- `validation-proof`: maps source requirements to proof layers, red/green
  needs, proof rubrics, valuable evidence sources, freshness guards, pyramid
  layer selection, noise-test rejection, and split triggers.
- `execution-order`: proposes dependency order, parallel lanes, integration
  gates, and handoff points.
- `codebase-boundary`: checks write surfaces, ownership, adjacent modules, and
  likely conflicts.
- `scope-and-proof-fit`: checks whether task size, sequence, parallel lanes,
  assumptions, and proof gates fit the accepted spec and approved scope, and
  whether tickets are neither unprovable epics nor pedantic microtasks.

Conditional lanes:

- `security-reliability`: required when auth, credentials, permissions, data
  loss, network boundaries, concurrency, availability, or privacy are material.
- `ux-manual-observability-proof`: required when proof depends on visual, UI,
  state, logs, traces, metrics, or manual product behavior.
- `migration-release-readiness`: required when the work changes data shape,
  release artifacts, packaging, CI, deployment, or migration order.
- `whole-plan-coverage`: required when planning is high-risk, multi-slice,
  multi-artifact, or source-to-plan coverage-sensitive. This is creation-side
  coverage and remains distinct from plan-review-swarm's
  `whole-plan-cohesion` review lane.

Subagents return evidence and candidate plan structure. The parent verifies
claims and owns the final plan.

Load `../../references/lane-contract.md` and `references/lane-packets.md`
before dispatching planning lanes or writing copy-paste prompts for
plan-creation subagents.
Load the durable reference file for each selected lane from
`plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/<lane>.md`.
A lane is not valid for dispatch when its durable reference file is missing.

## Required Execution Diagram

Every substantial plan includes an execution DAG:

```text
Execution DAG

gate 0: validate repo state and source artifacts
  |
  +-- lane A: <scope/files/proof>
  |
  +-- lane B: <scope/files/proof>
  |
  +-- lane C: <scope/files/proof>
  |
integration gate: parent reviews diffs and resolves conflicts
  |
targeted validation gate
  |
full relevant validation gate
  |
implementation-review-swarm
```

If the work is genuinely serial, say so and replace the lane fan-out with a
serial chain plus the reason parallelization is unsafe or impossible.

## Output Shape

Return:

- source coverage
- implementation plan path or chat-only plan
- plan package shape when large specs become a parent plan plus ticket/slice
  artifacts
- source-truth packet status: primary sources loaded, supporting evidence used,
  parent summaries treated as routing only, and selected lane references loaded
- requirements/proof matrix with source spec/requirement references, owning
  tasks, proof modalities, evidence sources, selected proof layers, proof
  rubrics, noise-test exclusions, and freshness guards, or compact proof line
  for tiny plans
- task sequence
- execution DAG and parallel work lanes, or a serial-work rationale
- lane reasoning-effort assignments: medium/high by complexity and risk
- write surfaces
- validation gates
- risks and rollback/recovery notes
- security assumptions or security context when sensitive surfaces are touched
- open questions
- recommended next skill
- full clickable artifact links (absolute path + line) for any plan artifacts
  the human is expected to open

## Common Mistakes

- Starting Task 1 while creating the plan.
- Omitting the execution DAG and forcing the executor to invent
  parallelization later.
- Treating a spec summary as enough when material source context is missing.
- Letting planning lanes use a parent summary instead of loading the accepted
  source artifact directly.
- Advertising stable planning lanes without durable lane references.
- Treating `whole-plan-coverage` as plan review or as a substitute for
  `whole-plan-cohesion`.
- Omitting validation gates to move faster.
- Listing validation commands without mapping them back to the requirements they
  prove.
- Inventing a testing strategy that does not trace back to the spec's
  requirements and proof expectations.
- Treating "pyramid TDD" as a command to add unit, integration, smoke, and e2e
  tests for every ticket regardless of risk or value.
- Adding positive/negative tests, deleted-config tests, or implementation-shape
  tests that do not prove a source requirement, contract, boundary, user
  behavior, state transition, or operational signal.
- Treating one high-level smoke/e2e check as a substitute for lower pyramid
  layers without an explicit reason.
- Dropping evidence requirements or freshness guards that came from a goal
  contract, spec, prior plan, or app-specific verifier.
- Treating a proof gate that is too large to pass as acceptable instead of
  splitting or replanning.
- Calling plan creation "reviewed" or "executable" without review/validation.
- Folding plan handoff or implementation execution into this skill.
