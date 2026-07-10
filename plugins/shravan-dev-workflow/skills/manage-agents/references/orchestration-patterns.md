# Orchestration Patterns

Load this before choosing a model, provider, command, or runtime when the
question is what kind of subordinate relationship and topology the harness
should use.

## Pattern First

Pick the agent category and assignment before picking ACPX, Claude, Codex,
Cursor, or any other harness. Then choose one-agent or swarm topology. Provider
and runtime choices implement that relationship; they do not define it.

Completion: the parent can name category, assignment, topology, and why the
rejected choices would be worse for this job.

## Category Selector

| Category | Use when | Avoid when | Parent owns |
| --- | --- | --- | --- |
| Advisor | One persistent consultative relationship should provide advice, reflection, concerns, or completion checks from a different model lineage. | The agent should own delegated execution, or the parent cannot separate advice from authority. | Consultation trigger, context packet, maximum authority, acceptance or rejection of advice. |
| Sidekick | One persistent worker should stay warm across delegated assignments, receipts, and follow-ups. | The task is one-shot, the helper cannot be monitored, or continuity would create stale authority. | Plan, ambiguity, delegation, final review, and session ledger. |
| Subagent | One bounded question, implementation slice, research lane, or review can complete without continuity. | The result needs ongoing memory, queueing, or repeated follow-ups. | Packet, permission scope, receipt, and verification. |

## Topology Selector

Use one advisor or sidekick by default because those categories are persistent
relationships. Do not call several advisors an `advisor swarm` or several
sidekicks a `sidekick swarm`; if independent breadth is required, dispatch
bounded review/advice or work slices as subagents and use swarm topology.

Use one subagent for a single bounded lane. Use a swarm when multiple
independent subagents can inspect, research, review, or compare in parallel.
The parent writes the shared packet, bounds each lane, deduplicates candidate
findings, verifies source anchors, and owns the verdict.

Do not use a swarm as a way to avoid judgment. If the hard part is the product
or architecture decision itself, the parent keeps that decision and may ask
lanes for evidence only.

Completion: every lane has a bounded packet, non-goals, receipt, and reducer
rule.

## Sidekick

Use a sidekick for continuity: repeated follow-ups, slow
verification, mechanical work over many files, or an ongoing helper that should
maintain its own cached context. This matches the useful part of hybrid harness
patterns where the main agent keeps planning, ambiguity handling, delegation,
and final review while a sidekick carries cheaper or more mechanical work in a
separate context.

A sidekick may delegate further bounded work to native subagents only when its
packet permits that topology. It still cannot expand scope, grant itself final
authority, or replace parent verification.

Persistent sidekicks need a session ledger before prompts that assume memory:
provider, cwd, session name, status, current assignment, last receipt, and next
follow-up intent.

When explaining this pattern, name it as long-lived work in a separate context
with a session ledger and progress check.

Completion: the sidekick has a ledger row and a progress check that proves
whether it is idle, running, blocked, or stale.

## Advisor

Use an advisor when the main executor should receive strategic notes from a
stronger, specialized, or adversarial model while the executor remains in
charge. Advisor modes include:

- consult-on-demand: the executor asks for advice at crux points;
- always-monitoring: the advisor reads main-turn progress and injects quiet
  notes, concerns, or hard blockers when the harness supports that feed;
- completion-check: the advisor reviews before the parent claims done.

Advisor output is not a second verdict. It is inline candidate guidance. The
parent must decide whether the note is accepted, rejected, or escalated to a
phase review.

When explaining this pattern, name quiet notes, hard blockers, and course
correction as advisor outputs when the harness supports inline notes.

Completion: the advisor trigger, note channel, maximum authority, and stop
condition are explicit.

## Subagent

Use a subagent for small bounded work: inspect one file, answer one
research question, draft one patch candidate, or run one stateless review. It
does not need a persistent ledger unless the parent will refer back to its
state later.

Completion: the parent has the prompt packet, returned receipt, and source
checks needed to accept or reject the result.

## Workflow Handoff

Use workflow handoff when the next useful actor is not merely another model but
another owner or phase: `spec-handoff`, `plan-handoff`,
`implementation-handoff`, `orchestrator-goal`, or a future session. A handoff
must preserve exact files, current proof state, blockers, and the first next
action.

Completion: the receiving workflow can resume without reading scattered chat
history.

## Escalation And Routing

- Start with the least expensive category, topology, and model capability that
  preserve required judgment, lineage independence, and proof.
- Move from subagent to sidekick when follow-up state matters.
- Move from one subagent to a swarm when independent perspectives matter more
  than continuity.
- Do not "upgrade" a sidekick into an advisor because a model is smarter. The
  relationship changes only when the assignment changes from delegated work to
  consultation; write a new packet and authority boundary when that happens.
- Route back to the main parent when the delegated work becomes ambiguous,
  high-risk, security-sensitive, or judgment-heavy.

Completion: escalation rules are named before the subordinate work starts.

## Source Inspirations

- Cognition's Devin Fusion article describes a hybrid harness where a frontier
  main agent and one smaller sidekick run in parallel with separate persistent
  contexts; the main agent delegates and monitors while keeping significant
  decisions and final review.
- Anthropic's advisor-tool docs describe an executor consulting one stronger
  advisor model for plans or course corrections while the executor continues.
