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
gates, and proof ownership.

## Core Rules

- Stay read-only against product surfaces. Do not edit product code, tests,
  configs, or non-plan docs as part of plan creation.
- Write a plan artifact unless the user explicitly asks for chat-only output.
- Read the source spec/design/context before planning. If a source file exists,
  count lines and read all chunks.
- Verify major assumptions against live repo evidence before turning them into
  tasks.
- Use subagents by default for substantial plan creation when codebase boundary,
  validation/proof, execution-order, security/reliability, or adversarial plan
  lanes can run independently. For tiny plans, state why a full swarm was
  skipped.
- Include task sequence, dependency graph, parallel work lanes, disjoint write
  scopes, integration gates, validation gates, rollout or rollback/recovery
  notes, risks, and open questions.
- Include a requirements/proof matrix for non-trivial plans: requirement or
  claim, source spec/requirement reference, owning task, proof owner, proof
  gate, proof layer, stale-proof guard, whether red/green evidence is required,
  and whether the task is sized so that proof can pass inside the approved
  scope. Tiny plans may use a compact proof line and say why it is sufficient.
- Use the testing pyramid as the default proof shape: unit for fast deterministic
  logic, integration for real boundaries, smoke for the owned runnable surface,
  e2e for full user/runtime paths, and PR/release gates for merge or artifact
  readiness. Do not skip lower layers just because a higher layer exists.
- Use TDD for behavior changes when feasible: identify or add the smallest
  failing proof tied to a requirement, watch it fail for the expected reason,
  implement, then make it pass and climb the proof pyramid only as needed.
- If the source is a goal contract, preserve known matrix rows from that
  contract and define any missing implementation rows here instead of leaving
  proof ownership to the executor.
- A red/green exception is valid only when recorded in the matrix with the
  user's explicit approval noted; an agent-authored waiver is not an exception.
- If a task's required proof cannot pass at its current size, split the task
  before execution instead of documenting skipped proof.
- Capture security assumptions when the plan touches auth, secrets, parsing,
  filesystem, network, subprocesses, plugins, MCP, CI, package scripts, agents,
  or external services.
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
   - proof owners and stale-proof guards for each non-trivial row
   - testing-pyramid/TDD strategy tied back to source requirements
   - task sequence
   - execution DAG with parallel lanes and integration gates
   - files/modules likely touched
   - validation gates by layer
   - split/replan triggers when proof cannot pass at the planned scope
   - rollback/recovery and risk notes
   - open questions
5. Route next:
   - `plan-review-swarm` when the plan needs adversarial review
   - `plan-handoff` when another agent should consume the plan
   - `implementation-execute-plan` only after the written plan exists and is
     ready to validate against the repo

## Default Planning Lanes

For substantial plans, dispatch bounded lanes where tool support exists:

- `codebase-boundary`: checks write surfaces, ownership, adjacent modules, and
  likely conflicts.
- `validation-proof`: maps source requirements to proof layers, red/green
  needs, stale-proof guards, pyramid coverage, and split triggers.
- `execution-order`: proposes dependency order, parallel lanes, integration
  gates, and handoff points.
- `security-reliability`: checks trust boundaries, secrets, permissions,
  rollback, cleanup, races, and partial failures.
- `adversarial-plan`: attacks sequencing, scope, assumptions, and simpler
  alternatives.

Subagents return evidence and candidate plan structure. The parent verifies
claims and owns the final plan.

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
- requirements/proof matrix with source spec/requirement references, owners,
  proof layers, and stale-proof guards, or compact proof line for tiny plans
- task sequence
- execution DAG and parallel work lanes, or a serial-work rationale
- write surfaces
- validation gates
- risks and rollback/recovery notes
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
- Dropping proof owners or stale-proof guards that came from a goal contract,
  spec, prior plan, or app-specific verifier.
- Treating a proof gate that is too large to pass as a skipped layer instead of
  splitting or replanning.
- Calling plan creation "reviewed" or "executable" without review/validation.
- Folding plan handoff or implementation execution into this skill.
