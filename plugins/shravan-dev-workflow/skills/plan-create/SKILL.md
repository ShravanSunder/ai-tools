---
name: plan-create
description: Use when turning a spec, design, architecture decision, or product requirement into a written implementation plan before code changes begin.
---

# Plan Create

Create an implementation plan from spec/design context. This is a planning
boundary: it turns "what should be true" into "how we will change the repo and
prove it." It does not execute the plan.

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
   - task sequence
   - files/modules likely touched
   - validation gates by layer
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
- task sequence
- write surfaces
- validation gates
- risks and rollback/recovery notes
- open questions
- recommended next skill

## Common Mistakes

- Starting Task 1 while creating the plan.
- Treating a spec summary as enough when material source context is missing.
- Omitting validation gates to move faster.
- Calling plan creation "reviewed" or "executable" without review/validation.
- Folding plan handoff or implementation execution into this skill.
