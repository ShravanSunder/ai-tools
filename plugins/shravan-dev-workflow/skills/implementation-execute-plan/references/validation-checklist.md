# Validation Checklist

Use this before execution and before completion claims.

## Before Editing

- Plan file or handoff packet fully loaded.
- Coverage evidence recorded.
- Branch/worktree state known.
- Relevant project instructions loaded.
- Major plan claims checked against live code/docs.
- Security assumptions checked against live code/docs when sensitive surfaces are touched.
- Scope and write boundaries clear.
- Validation commands identified.
- Requirements/proof matrix identified, or the plan explains why a compact proof line is sufficient.
- Evidence sources and freshness guards identified for non-trivial matrix rows.
- Required proof gates are sized so they can pass inside the approved scope; if not, split or replan before editing. Missing proof has either a concrete external blocker, a user-approved exception, or a split/replan route.
- Stop conditions considered.

## Before Dispatching Subagents

- Task is bounded and self-contained.
- Write set is disjoint or subagent is read-only.
- Packet includes full task text; subagent does not need the whole plan.
- Packet includes security invariants and forbidden permission/network broadening when applicable.
- Expected output and status vocabulary are explicit.
- Controller has a local non-overlapping next step.

## After Subagents Return

- Read the returned summary.
- Inspect changed files and diff.
- Verify tests or evidence independently.
- Cross-check the relevant matrix rows before treating subagent, reviewer, UI-driver, telemetry, or other delegated evidence as complete.
- Resolve conflicts between subagent outputs.
- Do not accept DONE_WITH_CONCERNS as done until concerns are evaluated.

## Before Final Answer

- Re-read original plan requirements.
- Re-read the requirements/proof matrix.
- Confirm evidence sources, freshness guards, and open proof gaps.
- Run targeted tests.
- Run full relevant project validation when feasible.
- Report command, exit code, and result.
- Label verification precisely: unit, integration, real VM integration, and smoke/e2e are not interchangeable.
- For sensitive changes, report authz regression, secret non-exposure, command/path safety, dependency/package-script safety, and scan/report status when applicable.
- Separate fixed now, blockers, and follow-ups.
- Report implementation proof: requirement/task coverage, changed files, red/green evidence or exception, evidence sources, freshness guards, unsatisfied proof gates, blockers, and proof split status.
