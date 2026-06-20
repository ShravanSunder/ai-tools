---
name: implementation-execute-plan
description: Use when executing a written implementation plan after first validating it against the current repo, especially when the user asks to validate and execute, implement a plan, continue from a plan handoff, or use subagents for bounded implementation slices.
---

# Implementation Execute Plan

Validate first, then execute. This is controller-owned execution: subagents may do bounded worker slices, but the main agent validates the plan against reality, integrates results, and owns correctness.

## Core Rules

- Read the whole implementation plan before execution. Show line count and chunk coverage for plan files.
- Do not execute directly from a spec or design. Use `plan-creation-swarm` first when
  no written implementation plan exists.
- Validate against the current repo before editing: branch, diff, code paths, package layout, tests, and instructions.
- Stop before editing if the plan has critical gaps, stale assumptions, unsafe scope, or unclear ownership.
- Stop before editing if security assumptions or threat boundaries are missing or stale for sensitive work.
- Use subagents whenever work is parallelizable into bounded disjoint slices.
  Inline execution is for tiny, serial, unsafe-to-delegate, or unsupported-tool
  cases; record that reason. The main agent remains responsible for context,
  integration, verification, and final claims.
- Do not ask subagents to read the giant plan. The controller extracts exact task packets and gives each subagent only what it needs.
- Verify subagent reports by inspecting changed files, diffs, and test output.
- Preserve implementation proof as you work: requirement/task coverage, changed
  files, proof commands with exit codes, red/green evidence for behavior
  changes, proof owners, stale-proof guards, skipped proof layers with reasons,
  and blockers.
- If a required proof gate cannot pass inside the approved scope, stop and
  return to `plan-creation-swarm` or split the work into smaller provable slices.
- A skip reason must be a concrete external blocker: missing environment,
  out-of-scope infrastructure, or a user-approved exception. Time pressure,
  task size, confidence, manual spot-checks, or "CI will catch it" are not
  skip reasons — they are split/replan triggers.
- Never remove, weaken, disable, or relabel a test or proof lane to make a
  gate pass; a failing required gate is a split/replan trigger, not an editing
  target.
- Never claim complete without fresh verification evidence.

## Workflow

1. Load and validate the plan.
   - Resolve implementation plan path or plan handoff packet.
   - Run `wc -l` for plan files.
   - Read all chunks and record coverage.
   - Compare major claims to live repo evidence.
   - Compare security assumptions to live repo evidence when sensitive surfaces are touched.
2. Decide execution mode.
   - Inline: tightly coupled work or no subagent support.
   - Sequential subagents: tasks share context or write surfaces.
   - Parallel subagents: tasks are independent with disjoint write sets, or are read-only research/review lanes.
   - If the plan includes an execution DAG, use it to choose lanes, integration
     gates, and validation gates.
3. Create a controller brief under:
   - `<repo-root>/tmp/plan-workflows/<yyyy-mm-dd>-<repo>-<branch>-<plan-slug>/implementation-execute-plan-brief.md`
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
   - These slice-level checks do not replace the later
     `implementation-review-swarm` gate unless implementation review is
     explicitly out of scope.
7. Verify final state.
   - Re-read the requirements/proof matrix or the plan's compact proof line.
   - Re-read requirements.
   - Inspect diffs.
   - Run targeted and full relevant checks.
   - Verify each matrix row's owner, gate, and stale-proof guard before treating
     it as satisfied.
   - Report commands, exit codes, red/green evidence or exception, skipped
     proof layers, proof split status, and remaining blockers.

## Subagent Ownership

Subagents can produce patches, analysis, test output, and candidate findings. They do not own the final answer.

The main agent must:

- design the slices
- provide exact context
- review every returned diff
- reject unsupported claims
- integrate conflicting results
- rerun validation
- cross-check matrix rows whose evidence came from subagents, reviewers, UI
  drivers, telemetry, or stale artifacts
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
- implementation proof: requirement/task coverage, commands, exit codes,
  red/green evidence or exception, proof owners, stale-proof guards, skipped
  proof layers, blockers
- proof split status: all required proof passed, or the work was
  split/replanned because proof could not pass at the current scope
- accepted risks and follow-ups
- exact blockers if incomplete
- full clickable artifact links (absolute path + line) for any plans, reports,
  handoffs, or artifacts the human is expected to open
