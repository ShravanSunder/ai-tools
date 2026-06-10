# Goal Handoff Prompts

Use this reference when the user needs a copy-paste prompt for another session,
agent, or CLI.

## Codex Prompt

```text
/goal <objective>

Scope:
<allowed write/read scope>

Non-goals:
<what not to do>

Required reading:
<files, docs, plans, tickets>

Proof gates:
<commands, artifacts, review state, docs, screenshots>

Stop condition:
<exact completion state>

Blocked condition:
<exact blocker state and required evidence>

Checkpoint rhythm:
<when to report or write handoff>

After setting the goal, use <next workflow skill> for the first phase.
```

## Claude Prompt

```text
/goal <objective>

Stay within:
<scope and non-goals>

Before claiming completion, make the proof visible in the transcript:
<commands with exit codes, files/artifacts, review or PR state, blockers>

If the goal becomes unclear, stop and ask for shared-understanding work instead
of broadening scope.

Use <next workflow skill or manual workflow> for the first phase.
```

## Generic Agent Prompt

```text
You are taking over a long-running goal. Do not rely on prior chat. Use this
contract as the source of truth.

Objective:
<objective>

Scope and non-goals:
<scope>

Required reading:
<artifacts>

Proof gates:
<evidence>

Stop condition:
<completion>

Blocked condition:
<blocked>

First workflow:
<next phase>

Report progress only with evidence. If the contract is unclear, do not start
execution; ask for clarification.
```
