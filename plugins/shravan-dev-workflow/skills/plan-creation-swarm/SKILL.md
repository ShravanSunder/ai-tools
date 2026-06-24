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
  allowed write scope, exact planning question, source-of-truth inputs,
  files/docs to inspect, non-goals, lane-specific checklist, output schema,
  uncertainty handling, confidence, the exact field
  `security context: applicable | not applicable`, and completion receipt.
  Lane outputs are candidate evidence until the parent verifies source anchors
  and reduces them into the final plan.
- For substantial plan creation, create a parent plan ledger and per-lane
  artifacts unless the user asked for chat-only/no-files, the work is a single
  tiny local lane, or the tool surface cannot write artifacts. Record the
  exception in the completion receipt.
- Include task sequence, dependency graph, parallel work lanes, disjoint write
  scopes, integration gates, validation gates, rollout or rollback/recovery
  notes, risks, and open questions.
- Include a requirements/proof matrix for non-trivial plans: requirement or
  claim, source spec/requirement reference, owning task, proof modality, proof
  gate, proof layer, evidence source, freshness guard, whether red/green
  evidence is required, and whether the task is sized so that proof can pass
  inside the approved scope. Tiny plans may use a compact proof line and say why
  it is sufficient.
- Use the testing pyramid as the default proof shape: unit for fast deterministic
  logic, integration for real boundaries, smoke for the owned runnable surface,
  e2e for full user/runtime paths, and PR/release gates for merge or artifact
  readiness. Lower layers remain explicit when a higher layer exists.
- Add the proof modalities required by the spec and product surface: automated
  tests, manual UX validation, visual evidence for visual systems, data or DB
  state checks, logs, traces, metrics, OTel queries, release artifacts, or
  operational smoke proof. Name these as concrete validation modalities when
  planning or rejecting a shortcut that tries to collapse proof to one check.
- Use TDD for behavior changes when feasible: identify or add the smallest
  failing proof tied to a requirement, watch it fail for the expected reason,
  implement, then make it pass and climb the proof pyramid only as needed.
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
   - vertical slice cards for substantial plans, each mapping source
     requirement -> behavior/capability -> likely touched files/interfaces ->
     checkpoint/integration gate -> proof layers/evidence
   - evidence sources and freshness guards for each non-trivial row
   - testing-pyramid/TDD strategy tied back to source requirements
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

- `codebase-boundary`: checks write surfaces, ownership, adjacent modules, and
  likely conflicts. Reference:
  `references/lanes/codebase-boundary.md`.
- `vertical-slice-decomposition`: maps source requirements into end-to-end
  work units with owned proof, checkpoints, and integration gates. Reference:
  `references/lanes/vertical-slice-decomposition.md`.
- `validation-proof`: maps source requirements to proof layers, red/green
  needs, evidence sources, freshness guards, pyramid coverage, and split
  triggers. Reference: `references/lanes/validation-proof.md`.
- `execution-order`: proposes dependency order, parallel lanes, integration
  gates, and handoff points. Reference: `references/lanes/execution-order.md`.
- `security-reliability`: checks trust boundaries, secrets, permissions,
  rollback, cleanup, races, and partial failures. Reference:
  `references/lanes/security-reliability.md`.
- `scope-and-proof-fit`: checks whether task size, sequence, parallel lanes,
  assumptions, and proof gates fit the accepted spec and approved scope.
  Reference: `references/lanes/scope-and-proof-fit.md`.

Subagents return evidence and candidate plan structure. The parent verifies
claims and owns the final plan.

Substantial plans are organized around source-owned vertical slices, not
horizontal buckets such as "backend", "frontend", and "tests" unless those
labels are nested under an end-to-end slice. Every material slice carries its
own local proof unit: the checkpoint and proof layers that show the source
requirement works at that point. Terminal validation can compose slices, but it
does not replace slice-level proof.

Load `references/lane-packets.md` before dispatching planning lanes or writing
copy-paste prompts for plan-creation subagents. Load the selected
`references/lanes/*.md` files before dispatching those lanes; each lane
reference states call timing, prerequisites, and collection contribution.

## Lane Orchestration Order

The parent owns planning sequence and collection. Run independent lanes in
parallel where the tool surface supports it, but preserve these information
dependencies:

1. Source coverage and current repo re-anchor:
   - Parent loads the accepted source artifact first.
   - Run `codebase-boundary` early to identify owners, write surfaces,
     integration points, and conflict risks.
   - Run `security-reliability` in the first batch when sensitive surfaces are
     in scope.
2. Proof shaping:
   - Run `validation-proof` after source requirements and proof expectations
     are visible. It can run in parallel with `codebase-boundary` when the
     source artifact already names the material requirements.
3. Slice shaping:
   - Run `vertical-slice-decomposition` after source coverage exists and at
     least initial codebase/proof evidence is available.
   - This lane creates candidate source-owned work units.
4. Sequence shaping:
   - Run `execution-order` after candidate slices exist. It orders slices,
     identifies parallelizable lanes, and places checkpoints/integration gates.
5. Fit check:
   - Run `scope-and-proof-fit` after candidate slices, proof implications, and
     execution order exist. It catches too-large tasks, missing local proof, and
     scope drift before the parent writes the final plan.
6. Parent collection pass:
   - Verify lane evidence against the accepted source and live repo anchors.
   - Reduce candidate slice cards, proof rows, DAG edges, write scopes, and
     split/replan triggers into the implementation plan.
   - Record accepted, contested, rejected, deferred, and open items in
     `plan-ledger.md`.

Each selected lane reference states when to call it, prerequisites, and what it
contributes to collection. If prerequisites are missing, run the prerequisite
lane or mark the planning lane blocked instead of asking a subagent to infer.

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
- vertical slice cards for substantial plans, each with source anchors,
  behavior/capability, likely touched files/interfaces, checkpoint/integration
  gate, proof layers/evidence, dependencies, and split/replan trigger
- requirements/proof matrix with source spec/requirement references, owning
  tasks, proof modalities, evidence sources, proof layers, and freshness guards,
  or compact proof line for tiny plans
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
- Omitting validation gates to move faster.
- Listing validation commands without mapping them back to the requirements they
  prove.
- Inventing a testing strategy that does not trace back to the spec's
  requirements and proof expectations.
- Treating one high-level smoke/e2e check as a substitute for lower pyramid
  layers without an explicit reason.
- Dropping evidence requirements or freshness guards that came from a goal
  contract, spec, prior plan, or app-specific verifier.
- Treating a proof gate that is too large to pass as acceptable instead of
  splitting or replanning.
- Calling plan creation "reviewed" or "executable" without review/validation.
- Folding plan handoff or implementation execution into this skill.
