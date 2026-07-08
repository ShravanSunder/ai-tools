# Orchestration Patterns

Load this before choosing a provider, command, or runtime when the question is
what kind of subordinate agent relationship the harness should use.

## Pattern First

Pick the agent relationship before picking ACPX, Claude, Codex, Cursor, Devin,
or any other harness. A provider command is an implementation detail; the
pattern decides context lifetime, authority, interruption behavior, and proof.

Completion: the parent can name the selected pattern and why the rejected
patterns would be worse for this job.

## Pattern Selector

| Pattern | Use when | Avoid when | Parent owns |
| --- | --- | --- | --- |
| Swarm | Independent lanes can inspect, research, review, or compare options in parallel. | The work needs continuous shared context, tight serial integration, or one agent's evolving memory. | Packet, lane selection, reduction, accepted findings. |
| Persistent sidekick | A helper should stay warm across turns with its own context, receipts, and follow-ups. | The task is one-shot, the helper cannot be monitored, or context continuity would create stale authority. | Plan, ambiguity, delegation, final review, session ledger. |
| Advisor | A stronger or different model should watch or be consulted for strategic course correction while another agent executes. | The harness cannot expose the main transcript or inline notes, every turn needs the advisor model, or advice cannot be separated from authority. | When advice is requested, which notes are blockers, and whether to continue. |
| Ephemeral subagent | A bounded question or patch can be answered without later continuity. | The result needs ongoing memory, queueing, or long-running progress checks. | Prompt packet, receipt, verification. |
| Workflow handoff | The next unit of work belongs to another phase skill, future session, machine, or long-running goal. | The current parent still owns active integration or the handoff would hide unresolved decisions. | Handoff contract, exact files, proof state, resumption point. |

## Swarm

Use a swarm for breadth: multiple bounded lanes, independent evidence, or
adversarial review. The parent writes one shared packet, dispatches lanes,
deduplicates candidate findings, verifies source anchors, and owns the verdict.

Do not use a swarm as a way to avoid judgment. If the hard part is the product
or architecture decision itself, the parent keeps that decision and may ask
lanes for evidence only.

Completion: every lane has a bounded packet, non-goals, receipt, and reducer
rule.

## Persistent Sidekick

Use a persistent sidekick for continuity: repeated follow-ups, slow
verification, mechanical work over many files, or an ongoing helper that should
maintain its own cached context. This matches the useful part of hybrid harness
patterns where the main agent keeps planning, ambiguity handling, delegation,
and final review while a sidekick carries cheaper or more mechanical work in a
separate context.

Persistent sidekicks need a session ledger before prompts that assume memory:
provider, cwd, session name, status, current assignment, last receipt, and next
follow-up intent.

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

Completion: the advisor trigger, note channel, maximum authority, and stop
condition are explicit.

## Ephemeral Subagent

Use an ephemeral subagent for small bounded work: inspect one file, answer one
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

- Start with the cheapest pattern that preserves required judgment and proof.
- Upgrade from ephemeral to persistent when follow-up state matters.
- Upgrade from persistent sidekick to swarm when independent perspectives
  matter more than continuity.
- Upgrade from sidekick to advisor when the doer needs strategic correction,
  not extra hands.
- Route back to the main parent when the delegated work becomes ambiguous,
  high-risk, security-sensitive, or judgment-heavy.

Completion: escalation rules are named before the subordinate work starts.

## Source Inspirations

- Cognition's Devin Fusion article describes a hybrid harness where a frontier
  main agent and a smaller sidekick run in parallel with separate persistent
  contexts; the main agent delegates and monitors while keeping significant
  decisions and final review.
- Anthropic's advisor-tool docs describe a faster executor consulting a stronger
  advisor model mid-generation for plans or course corrections while the
  executor continues the task.
