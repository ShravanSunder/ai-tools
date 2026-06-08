# Validation Checklist

Use this before execution and before completion claims.

## Before Editing

- Plan file or handoff packet fully loaded.
- Coverage evidence recorded.
- Branch/worktree state known.
- Relevant project instructions loaded.
- Major plan claims checked against live code/docs.
- Scope and write boundaries clear.
- Validation commands identified.
- Stop conditions considered.

## Before Dispatching Subagents

- Task is bounded and self-contained.
- Write set is disjoint or subagent is read-only.
- Packet includes full task text; subagent does not need the whole plan.
- Expected output and status vocabulary are explicit.
- Controller has a local non-overlapping next step.

## After Subagents Return

- Read the returned summary.
- Inspect changed files and diff.
- Verify tests or evidence independently.
- Resolve conflicts between subagent outputs.
- Do not accept DONE_WITH_CONCERNS as done until concerns are evaluated.

## Before Final Answer

- Re-read original plan requirements.
- Run targeted tests.
- Run full relevant project validation when feasible.
- Report command, exit code, and result.
- Label verification precisely: unit, integration, real VM integration, and smoke/e2e are not interchangeable.
- Separate fixed now, blockers, and follow-ups.
