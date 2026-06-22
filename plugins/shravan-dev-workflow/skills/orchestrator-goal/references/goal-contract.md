# Goal Contract

Use this reference when writing, auditing, or copy-pasting a goal contract.

## Contract Template

```text
Objective:
<the durable outcome, not a task list>

Goal id:
<yyyy-mm-dd-short-slug reused in goal text, details, events, and handoffs>

Non-goals / scope boundary:
<what this goal must not expand into>

Required reading:
<files, plans, specs, tickets, PRs, docs, or "none">

Required workflow skill:
`shravan-dev-workflow:orchestrator-goal`

Current workflow:
<skill-or-state>

Next workflow:
<skill-or-terminal>

Terminal condition:
<exact condition that makes the goal complete; for implementation goals, default to PR ready/proven and not merged>

Orchestration rules applied:
<for implementation goals: default implementation terminal; mutable starting point; pr-ready non-merge boundary; full proof loop; checkpoint commit rule>

State details:
tmp/workflow-state/<goal_id>/details.md

Transition log:
tmp/workflow-state/<goal_id>/events.jsonl

Requirement/spec source:
<chat, spec file, ticket, PRD, repo instructions, or "not yet known">

Allowed write scope:
<repo paths or "read-only">

Proof gates:
<commands, artifacts, review state, screenshots, docs, or other evidence>

Requirements/proof matrix:
<requirement or claim -> proof gate or "must be defined by plan-creation-swarm">

Stop condition:
<the exact state where the goal is complete>

Blocked condition:
<what counts as blocked and what evidence proves it>

Checkpoint rhythm:
<when to report, commit verified checkpoints, write handoff, or revalidate>

Next workflow:
<one of the shravan-dev-workflow phase skills>
```

## Good Goal Shape

Good goals are outcome-oriented and gated by evidence:

```text
Finish the shravan-dev-workflow 1.6.5 goal-orchestration release:
add the orchestrator-goal skill, update marketplace metadata and docs,
validate plugin installation, refresh the Codex cache, and stop when
the live plugin list reports 1.6.5 with the new skill visible.
```

## Default Implementation Terminal

For implementation goals, the default implementation terminal is not a spec,
plan, review report, or implementation-only checkpoint. It is:

```text
PR created or updated and proven ready, implementation review findings
addressed or explicitly rejected, required proof gates captured, current PR
checks/review-thread/mergeability state reported, and merge not performed unless
the user explicitly authorized it.
```

Only the starting point is mutable. Existing artifacts decide the first
unproven lifecycle gate:

- no accepted spec/design: start at `spec-creation-swarm` or `spec-review-swarm`
- accepted spec/design but no plan: start at `plan-creation-swarm`
- unreviewed plan: start at `plan-review-swarm`
- reviewed plan but no implementation proof: start at `implementation-execute-plan`
- implementation proof but unresolved implementation review: start at
  `implementation-review-swarm`
- review addressed but no PR readiness proof: start at `implementation-pr-wrapup`

This is the pr-ready non-merge boundary: `implementation-pr-wrapup` proves PR
readiness and does not imply merge permission.

The full proof loop should name the highest required proof layers from the goal:
tests, type/lint/build, app/runtime behavior, screenshots or visual proof,
manual verification, benchmarks, metrics, PR checks, review threads, or release
artifacts. Do not let a lower proof layer silently stand in for a requested
higher layer.

Checkpoint commit guidance belongs in the goal when implementation is in scope:
commit at verified lifecycle checkpoints when scoped files changed and repo
policy permits; never stage unrelated files or use a commit as proof.

## Bad Goal Shape

Avoid goals that hide scope or proof:

```text
Make the workflow better.
```

This does not name the expected state, allowed scope, validation, or stopping
condition. Route it to `discuss-with-me`.

## Required Files

Goal text must name the actual source files when they are known:

- implementation plan file
- spec/design file
- handoff packet
- related source files or docs the next workflow must read

Do not collapse known artifacts into vague wording like "the plan", "the docs",
or "related files". Use repo-relative paths or absolute paths when portability
requires them.

Do not create `files.md` as a separate source of truth for key files. The
critical spec, plan, review/report, and handoff paths stay in the goal text.
Put secondary files and expanded context in `details.md`.

## Workflow State Files

For a multi-phase goal, use:

```text
tmp/workflow-state/<goal_id>/details.md
tmp/workflow-state/<goal_id>/events.jsonl
```

`details.md` owns expanded context: proof matrix, blockers, secondary files,
accepted findings, phase recommendations, and stale-proof notes.

`events.jsonl` owns append-only transition history. Each official transition
event is written by `orchestrator-goal`, not by a phase skill.

Minimum transition event fields:

```json
{
  "goal_id": "<id>",
  "from_workflow": "<skill-or-state>",
  "to_workflow": "<skill-or-terminal>",
  "phase_result": "complete|blocked|needs_revision|not_applicable",
  "evidence": ["<path or transcript note>"],
  "decision": "<why this transition was accepted>",
  "written_by": "shravan-dev-workflow:orchestrator-goal"
}
```

Precedence rule:

1. `/goal` owns scope, non-goals, required workflow skill, `goal_id`, and exact
   key artifact paths.
2. The latest valid orchestrator-written event in `events.jsonl` owns current
   workflow, next workflow, and transition decision.
3. `details.md` owns expanded context and phase recommendations.

If the pointers are missing, renamed, or contradictory, stop and report the
broken state instead of continuing from chat memory.

## Phase Recommendation Footer

Phase skills can recommend, not decide, the next transition. In goal-backed
flows, ask for or preserve this footer:

```text
phase_result: complete | blocked | needs_revision | not_applicable
evidence: <paths, commands, findings, or transcript notes>
recommended_next_workflow: <shravan-dev-workflow skill or terminal>
recommended_transition_reason: <one sentence>
```

## Rules and Gates

Treat the goal as a contract made of rules and gates:

- Rules constrain behavior while the work is happening.
- Gates decide whether the work may proceed or be called complete.
- A gate must be inspectable through files, commands, artifacts, or transcript
  evidence.
- If the required proof cannot pass at the current scope, split or replan
  instead of weakening the gate.

## Matrix Rows

For substantial goals, make each matrix row explicit:

```text
Requirement / claim:
<what must be true>

Proof source:
<command, artifact, review result, screenshot, observability query, or transcript evidence>

Proof owner:
<parent, phase skill, subagent lane, external reviewer, or app-specific verifier>

Stale-proof guard:
<marker, process/worktree identity, bounded time window, current diff, or "not applicable">
```

Use the exact labels `Proof owner:` and `Stale-proof guard:` when writing rows.
Do not encode them only in prose.

Use `must be defined by plan-creation-swarm` only when the goal is clear but the
implementation proof shape does not exist yet.

## Parent Ownership

Subagents may own slices. The parent owns the contract:

- define task packets
- verify returned evidence
- rerun or cross-check proof gates when feasible
- integrate conflicts
- rerun proof gates
- decide complete or blocked

## Closeout Audit

Use this status set when auditing or closing a goal:

```text
done | not-applicable | open | blocked
```

Closeout rows use this shape:

```text
Gate:
<spec/design, plan matrix, review cycle, implementation proof, docs/release, parent verification, or matrix row>

Status:
<done | not-applicable | open | blocked>

Evidence:
<artifact path, command output, transcript note, user assertion, or none>

Next:
<none, next workflow, or blocker>
```

`done` requires an evidence pointer. If the only evidence is that the user says
a review or work cycle already happened, write `user assertion in this chat`.
Do not rerun already-completed lifecycle skills merely because the closeout
checklist is mandatory; account for them and route only open or blocked rows.

For goal-backed multi-phase closeout, always include the literal workflow-state
block:

```text
Workflow state:
goal_id: <id or missing>
Current workflow: <skill-or-state or missing>
Next workflow: <skill-or-terminal or missing>
Terminal condition: <exact condition or missing>
State details: tmp/workflow-state/<goal_id>/details.md
Transition log: tmp/workflow-state/<goal_id>/events.jsonl
Latest transition source: <event id/path or none/missing>
```

If the pointers are missing, keep the exact labels and fill missing fields with
`missing`; do not collapse them into prose. Missing workflow-state pointers make
parent verification `open` or `blocked`, never `done`.
