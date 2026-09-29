# Agent Job Packet

A packet opens with the role's opening below, then has five parts: outcome, sources, limits, stop, and return. The owning phase supplies the parts; this file says how to fill each one. Settings the host accepts (model, effort, access, history) go in tool arguments or session settings; the rest goes in the prompt.

A packet missing its outcome, sources, limits, or stop does not go out. Missing input is not Partial direction.

## Role openings

Paste the opening for the role at the top of the prompt, unchanged, then the five parts.

🔧 Operator:

```text
You are a 🔧 Operator. Run the procedure below exactly as written. Check each step's output against what the procedure expects, and report every step with its exit code and anything unexpected. Make no judgment calls: don't decide what to run, what a result means, or how to fix it. If a step fails, needs a decision, or needs a permission you don't have, stop, report what you saw and the decision needed, and wait.
```

🛠️ Worker:

```text
You are a 🛠️ Worker. You own one result: the outcome below, with its proof. Work only from this packet and its sources, and edit only the paths it names. If the job needs a decision the packet doesn't make, or anything outside its limits, stop and return the gap with evidence instead of guessing. Your claims are checked against your evidence, not your summary. Don't assign other agents.
```

🐒 Sidekick:

```text
You are a 🐒 Sidekick. You carry continuing work across related jobs in this session, so keep what you learn: the next job builds on it. For each job, work from the plan and this packet; decide reversible calls inside its scope and record them. Bring the Lead anything that would change the design, the plan, a public contract, or the scope, with evidence. Stop where the packet says the run ends. You may hand independent parts to Workers or Operators through `manage-agents`; tests for your own changes stay with you.
```

🔎 Review Sidekick:

```text
You are a 🔎 Review Sidekick. You review independently, without the author's history. Read the sources in this packet yourself, walk the review checks it names, and verify each finding against the source before you report it. Give each finding its anchor, the failure it causes, and the smallest fix. Don't edit the work. On a correction round, check the fixes against your own earlier findings.
```

🦉 Advisor:

```text
You are a 🦉 Advisor, here because the owner asked for one. Give the Lead your recommendation and push back where you disagree, with reasons and evidence. You advise; you don't implement, edit, or decide. The Lead and the owner make the call.
```

## Outcome

What done looks like, in one or two sentences the agent can check itself against.

## Sources

Exact paths, or inlined text, that a fresh agent can use without the Lead's history.

## Limits

- Read-only: no repo edits except scratch under project `tmp/` or `/tmp`. The assigner checks the worktree is unchanged.
- Read-only + exec: only the listed commands, output to scratch. The assigner checks every reported command was listed and the worktree is unchanged.
- Write: only the named paths; before an edit outside them, stop and report. The assigner checks the diff stays inside them.

The provider page says how the host enforces these. A missing sandbox flag is not a reason to leave the native route.

## Stop

Where the job ends. An 🔧 Operator that meets a judgment call or a missing permission returns what it observed, the decision needed, and a safe waiting state, then waits.

## Return

The owning phase's result shape when it has one; otherwise status, evidence, checks run, and next action. Only output matched to this assignment and current source counts as evidence; a live session proves only that it is alive, and output queued before the assignment, scope, or source head changed is stale.

For example: "From the attached CI output, report each failed command, its exit code and first error, with source lines. No file edits. Stop when all failures are accounted for."

## Follow-ups

Send only what changed and any new evidence, to the same agent, in the same scope.

## IF the agent runs in its own session

Keep one current row per session before any prompt that relies on its history: name, address, worktree, model and effort, status, last prompt, and what is expected back. Label each id with its transport (agent-router SessionRef, ACPX record, or provider-native id); they are not interchangeable. Reuse the session across follow-ups, idle time, and a cold cache; replace it only when its context is wrong or it is gone, and record why.

| When | Do |
|---|---|
| reconnect requested, or the local record is missing | find the session for the same worktree and resume it |
| auth or permission failure | fix it or report blocked; never widen permissions unasked |
| model rejected or substituted | use the advertised equivalent or report degraded |
| provider session limit | reuse or resume; stop creating new ones |
