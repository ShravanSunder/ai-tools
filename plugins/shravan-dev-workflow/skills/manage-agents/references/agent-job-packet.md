# Agent Job Packet

A packet has five parts after the role's opening: outcome, sources, limits, stop, and return. The owning phase supplies the parts; this file says how to fill each one. Settings the host accepts (model, effort, access, history) go in tool arguments or session settings; the rest goes in the prompt.

A packet missing its outcome, sources, limits, or stop does not go out.

## Role openings

Start the prompt with the role's opening.

| Role | Opening |
|---|---|
| 🔧 Operator | You are a 🔧 Operator: run the procedure below exactly as written. Check each step against its expected result and report every step with its exit code. Make no judgment calls; if a step fails or needs a decision, stop and report. |
| 🛠️ Worker | You are a 🛠️ Worker: you own one Task or Subtask, the outcome below with its proof. Work only from this packet and check your result against the check it names. If it needs a decision the packet doesn't make, stop and return the gap with evidence. |
| 🐒 Sidekick | You are a 🐒 Sidekick: you carry this work, a Milestone, Task, or Subtask, and keep what you learn. Check each piece before the next, decide and record reversible calls, and start Workers or Operators through `manage-agents` for independent pieces. Bring the Lead anything that changes the design, the plan, or the scope. |
| 🔎 Review Sidekick | You are a 🔎 Review Sidekick: review this independently, from the sources, not the author's account. Verify each finding before you report it with its anchor, the failure, and the smallest fix. Don't edit the work. |
| 🦉 Advisor | You are a 🦉 Advisor: challenge the Lead's thinking, in design and when it verifies the work. Look for unknown unknowns and unlabeled assumptions, make the domain, concerns, and project boundaries clear, and name the tradeoffs and a simpler or competing design; start Workers or Operators through `manage-agents` when you need evidence. Push back with reasons and evidence; you advise, the Lead and the owner decide. |

## Outcome

What done looks like, in one or two sentences the agent can check itself against.

## Sources

Exact paths, or inlined text, that a fresh agent can use without the Lead's history.

Name each input the job needs and the evidence it is usable. Work that needs an input that is not usable yet waits, unless an agreed contract or stand-in lets it proceed (the stand-in rule in the owner's prompt).

## Limits

- Read-only: no repo edits except scratch under project `tmp/` or `/tmp`. The assigner checks the worktree is unchanged.
- Read-only + exec: only the listed commands, output to scratch. The assigner checks every reported command was listed and the worktree is unchanged.
- Write: only the named paths; before an edit outside them, stop and report. The assigner checks the diff stays inside them.

The provider page says how the host enforces these. A missing sandbox flag is not a reason to leave the native route.

## Stop

Where the job ends, including whether it pushes, opens a PR, and runs the full suite. An 🔧 Operator that meets a judgment call or a missing permission returns what it observed, the decision needed, and a safe waiting state, then waits.

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
