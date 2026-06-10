---
name: orchestrator-goal
description: Use when starting, refining, resuming, auditing, or handing off a Codex or Claude /goal session, especially when the user asks for a long-horizon goal, durable objective, completion condition, goal-backed workflow, or copy-paste goal prompt.
---

# Orchestrator Goal

Compile a clear long-horizon goal contract, then route the work to the right
workflow skill. This skill does not replace design, planning, review, execution,
or docs skills. It decides whether the goal is clear enough to run and then
connects the goal to those skills.

## Core Rule

There are only two paths:

1. If the intent is clear, orchestrate the goal.
2. If the intent is not clear, use `discuss-with-me` before setting or preparing
   the goal.

Do not run a mini interview inside this skill. Goals are heavy, long-running
horizon processes; fuzzy goals need shared-understanding work first.

## Clarity Gate

The goal is clear only when these are known:

- objective
- non-goals or scope boundary
- required reading or source artifacts
- allowed write scope
- proof gates or validation evidence
- stop condition
- blocked condition
- checkpoint or handoff rhythm

If any of these materially affect the work and are missing, route to
`discuss-with-me`.

## Workflow

1. Identify target surface:
   - Codex `/goal`
   - Claude `/goal`
   - copy-paste prompt for another agent
   - current-session goal audit or resume
2. Run the clarity gate.
3. If clear, compile the goal contract.
4. Select the next workflow:
   - early design or architecture: `spec-design-swarm`
   - plan/design/spec packet for another agent: `plan-handoff`
   - adversarial plan review: `plan-review-swarm`
   - validated implementation from a plan: `implementation-execute-plan`
   - code, diff, branch, commit, or PR review: `implementation-review-swarm`
   - continuation or reviewer packet after implementation work:
     `implementation-handoff`
   - docs/source-of-truth cleanup: `docs-maintain`
   - explicit security scan: `ops-security-review`
   - bug or failure diagnosis: `debug-investigation`
5. Set the goal only when the user explicitly asked for a goal-backed session
   and the host surface supports it. Otherwise, prepare the goal prompt or
   contract artifact.
6. Report the contract, selected workflow, and first verification checkpoint.

## Host Rules

- Codex: create or update goal state only when explicitly goal-backed. Do not
  invent a token budget. Mark complete only after current verification. Mark
  blocked only under the host's repeated-blocker rules.
- Claude: phrase the goal as transcript-visible completion evidence because the
  evaluator judges the conversation, not hidden filesystem state.
- Other agents: produce a copy-paste prompt with the goal contract and required
  proof gates.

The parent agent owns the goal. Subagents can perform bounded research,
implementation, or review slices, but their outputs are evidence to verify, not
completion by themselves.

## Progressive Disclosure

- Load `references/goal-contract.md` when writing or auditing the contract.
- Load `references/codex-goal.md` when setting, resuming, completing, or blocking
  a Codex goal.
- Load `references/claude-goal.md` when preparing a Claude goal or copy-paste
  Claude prompt.
- Load `references/routing-map.md` when deciding which workflow skill should
  own the next phase.
- Load `references/handoff-prompts.md` when producing a copy-paste prompt for
  Codex, Claude, ChatGPT, or another agent.

## Output Shape

For a clear goal:

```text
Goal contract:
<objective, scope, proof, stop, blocked, checkpoint>

Host:
<Codex / Claude / copy-paste / audit>

Next workflow:
<skill name and why>

First checkpoint:
<evidence required before claiming progress>
```

For an unclear goal:

```text
Goal status:
Not clear enough to set as /goal.

Missing:
<load-bearing unknowns>

Next workflow:
discuss-with-me
```
