---
name: plan-execute
description: Use when executing a written plan or design after first validating it against the current repo, especially when the user asks to validate and execute, implement a plan, continue from a handoff, or use subagents for bounded implementation slices.
---

# Plan Execute

Validate first, then execute. The main agent owns correctness even when subagents do bounded work.

## Core Rules

- Read the whole plan before execution. Show line count and chunk coverage for plan files.
- Validate against the current repo before editing: branch, diff, code paths, package layout, tests, and instructions.
- Stop before editing if the plan has critical gaps, stale assumptions, unsafe scope, or unclear ownership.
- Stop before editing if security assumptions or threat boundaries are missing or stale for sensitive work.
- Use subagents for parallelizable bounded slices only. The main agent remains responsible for context, integration, verification, and final claims.
- Do not ask subagents to read the giant plan. The controller extracts exact task packets and gives each subagent only what it needs.
- Verify subagent reports by inspecting changed files, diffs, and test output.
- Never claim complete without fresh verification evidence.

## Workflow

1. Load and validate the plan.
   - Resolve plan path or handoff packet.
   - Run `wc -l` for plan files.
   - Read all chunks and record coverage.
   - Compare major claims to live repo evidence.
   - Compare security assumptions to live repo evidence when sensitive surfaces are touched.
2. Decide execution mode.
   - Inline: tightly coupled work or no subagent support.
   - Sequential subagents: tasks share context or write surfaces.
   - Parallel subagents: tasks are independent with disjoint write sets, or are read-only research/review lanes.
3. Create a controller brief under:
   - `<repo-root>/tmp/plan-workflows/<yyyy-mm-dd>-<repo>-<branch>-<plan-slug>/validate-execute-brief.md`
4. Slice tasks.
   - Extract full task text.
   - Add scene-setting context.
   - Name allowed files or disjoint write set.
   - Add exact test/verification command.
5. Execute.
   - Do local blocking work yourself.
   - Dispatch bounded sidecars only when they can run without blocking the next local step.
   - Handle `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, and `BLOCKED` explicitly.
6. Review after each slice.
   - Spec compliance first.
   - Code quality/adversarial review second for meaningful implementation slices.
7. Verify final state.
   - Re-read requirements.
   - Inspect diffs.
   - Run targeted and full relevant checks.
   - Report commands, exit codes, and remaining blockers.

## Subagent Ownership

Subagents can produce patches, analysis, test output, and candidate findings. They do not own the final answer.

The main agent must:

- design the slices
- provide exact context
- review every returned diff
- reject unsupported claims
- integrate conflicting results
- rerun validation
- decide whether the plan is complete

## Progressive Disclosure

- Load `references/controller-packets.md` before dispatching implementer, reviewer, or research subagents.
- Load `references/validation-checklist.md` before claiming the plan is executable or complete.

## Stop Conditions

Stop and report instead of continuing when:

- the plan contradicts current code in a way that changes the design
- the required write scope is broader than the user approved
- subagents disagree on a blocker that requires design judgment
- validation reveals unrelated infrastructure failures
- execution would broaden permissions, network, filesystem, subprocess, plugin, MCP, or agent boundaries beyond the validated plan
- tests cannot be run and no substitute proof exists

## Final Report

Include:

- coverage evidence
- tasks completed
- files changed
- subagents used and what they contributed
- verification commands with results
- accepted risks and follow-ups
- exact blockers if incomplete
