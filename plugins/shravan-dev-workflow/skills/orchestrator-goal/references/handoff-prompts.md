# Goal Handoff Prompts

Use this reference when the user needs a copy-paste prompt for another session, agent, or CLI.

## Codex Prompt

```text
/goal <objective>

Required workflow skill:
Use `shravan-dev-workflow:orchestrator-goal` to honor this contract before
routing to the next workflow.

Scope:
<allowed write/read scope>

Non-goals:
<what not to do>

Required reading:
<exact plan/spec/handoff file paths and related files; do not say only "the plan">

Proof gates:
<commands, artifacts, review state, docs, screenshots>

Requirements/proof matrix:
<requirement or claim -> proof gate, evidence source, and freshness guard>

Stop condition:
<exact completion state>

Blocked condition:
<exact blocker state and required evidence>

Checkpoint rhythm:
<when to report or write handoff>

After setting the goal, use `shravan-dev-workflow:orchestrator-goal` to keep the
contract active, then use <next workflow skill> for the first phase. The parent
agent must verify subagent or driver evidence before claiming completion.
```

## Claude Prompt

```text
/goal <objective>

Required workflow skill:
Use `shravan-dev-workflow:orchestrator-goal` to honor this contract before
routing to the next workflow.

Stay within:
<scope and non-goals>

Required reading:
<exact plan/spec/handoff file paths and related files>

Before claiming completion, make the proof visible in the transcript:
<commands with exit codes, files/artifacts, review or PR state, blockers>

Carry the requirements/proof matrix in the transcript or cite the artifact that
contains it. Treat subagent, reviewer, UI-driver, and telemetry output as
evidence for the parent to verify, not completion by itself.

If the goal becomes unclear, stop and ask for shared-understanding work instead
of broadening scope.

Use <next workflow skill or manual workflow> for the first phase.
```

## Generic Agent Prompt

```text
You are taking over a long-running goal. Do not rely on prior chat. Use this
contract as the source of truth.

Required workflow skill:
Use `shravan-dev-workflow:orchestrator-goal` to honor this contract before
routing to the next workflow.

Objective:
<objective>

Scope and non-goals:
<scope>

Required reading:
<exact plan/spec/handoff file paths and related files>

Proof gates:
<evidence>

Requirements/proof matrix:
<requirement or claim -> proof gate, evidence source, and freshness guard>

Stop condition:
<completion>

Blocked condition:
<blocked>

First workflow:
<next phase>

Report progress only with evidence. If the contract is unclear, do not start
execution; ask for clarification.
```
