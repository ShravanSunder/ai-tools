# Goal Contract

Use this reference when writing, auditing, or copy-pasting a goal contract.

## Contract Template

```text
Objective:
<the durable outcome, not a task list>

Non-goals / scope boundary:
<what this goal must not expand into>

Required reading:
<files, plans, specs, tickets, PRs, docs, or "none">

Requirement/spec source:
<chat, spec file, ticket, PRD, repo instructions, or "not yet known">

Allowed write scope:
<repo paths or "read-only">

Proof gates:
<commands, artifacts, review state, screenshots, docs, or other evidence>

Requirements/proof matrix:
<requirement or claim -> proof gate or "must be defined by plan-create">

Stop condition:
<the exact state where the goal is complete>

Blocked condition:
<what counts as blocked and what evidence proves it>

Checkpoint rhythm:
<when to report, write handoff, or revalidate>

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

## Bad Goal Shape

Avoid goals that hide scope or proof:

```text
Make the workflow better.
```

This does not name the expected state, allowed scope, validation, or stopping
condition. Route it to `discuss-with-me`.

## Rules and Gates

Treat the goal as a contract made of rules and gates:

- Rules constrain behavior while the work is happening.
- Gates decide whether the work may proceed or be called complete.
- A gate must be inspectable through files, commands, artifacts, or transcript
  evidence.
- If the required proof cannot pass at the current scope, split or replan
  instead of weakening the gate.

## Parent Ownership

Subagents may own slices. The parent owns the contract:

- define task packets
- verify returned evidence
- integrate conflicts
- rerun proof gates
- decide complete or blocked
