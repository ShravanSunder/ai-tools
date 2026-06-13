---
name: plan-create
description: Use when turning a spec, design, architecture decision, or product requirement into a written implementation plan before code changes begin.
---

# Plan Create

Create an implementation plan from spec/design context. This is a planning
boundary: it turns "what should be true" into "how we will change the repo and
prove it." It does not execute the plan. Non-trivial plans carry a
requirements/proof matrix; tasks whose required proof cannot pass at their size
are split before execution.

## Core Rules

- Stay read-only against product surfaces. Do not edit product code, tests,
  configs, or non-plan docs as part of plan creation.
- Write a plan artifact unless the user explicitly asks for chat-only output.
- Read the source spec/design/context before planning. If a source file exists,
  count lines and read all chunks.
- Verify major assumptions against live repo evidence before turning them into
  tasks.
- Include task sequence, write surfaces, dependencies, validation gates, rollout
  or rollback/recovery notes, risks, and open questions.
- Include a requirements/proof matrix for non-trivial plans: requirement or
  claim, owning task, proof owner, proof gate, proof layer, stale-proof guard,
  whether red/green evidence is required, and whether the task is sized so that
  proof can pass inside the approved scope. Tiny plans may use a compact proof
  line and say why it is sufficient.
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
   - requirement/spec source coverage
   - requirements/proof matrix, or compact proof line for tiny plans
   - proof owners and stale-proof guards for each non-trivial row
   - task sequence
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

## Output Shape

Return:

- source coverage
- implementation plan path or chat-only plan
- requirements/proof matrix with owners and stale-proof guards, or compact proof
  line for tiny plans
- task sequence
- write surfaces
- validation gates
- risks and rollback/recovery notes
- open questions
- recommended next skill
- full clickable artifact links (absolute path + line) for any plan artifacts
  the human is expected to open

## Common Mistakes

- Starting Task 1 while creating the plan.
- Treating a spec summary as enough when material source context is missing.
- Omitting validation gates to move faster.
- Listing validation commands without mapping them back to the requirements they
  prove.
- Dropping proof owners or stale-proof guards that came from a goal contract,
  spec, prior plan, or app-specific verifier.
- Treating a proof gate that is too large to pass as a skipped layer instead of
  splitting or replanning.
- Calling plan creation "reviewed" or "executable" without review/validation.
- Folding plan handoff or implementation execution into this skill.
