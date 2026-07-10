# Glossary

This file owns term meanings for `manage-agents`. It does not define workflow
rules, packet fields, provider commands, or proof policy.

## Agent Categories

- Parent: the session that owns scope, permissions, reduction, verification,
  and the final claim.
- Subordinate agent: any model-backed helper whose output the parent must
  verify before accepting.
- Advisor: usually one persistent consultative agent that gives strategic
  advice, reflection, concerns, or blockers while the parent retains authority.
  Prefer a model lineage different from the parent.
- Sidekick: usually one persistent delegated worker with its own context,
  ledgered session, assignments, receipts, and follow-ups. It may be native to
  the harness or backed by a persistent ACPX session.
- Subagent: one ephemeral bounded worker or reviewer. A subagent may be native
  to the current harness or a one-shot external-lineage call through ACPX.

Do not use `ephemeral subagent` as the canonical term. Ephemeral is already a
defining property of `subagent` in this skill.

## Topology And Transfer

- Single-agent topology: one advisor, sidekick, or subagent assigned to the
  work.
- Swarm: multiple independent subagents dispatched for breadth, comparison,
  research, review, or adversarial coverage. A swarm is topology, not an agent
  category.
- Workflow handoff: a packet that transfers work to another phase skill, future
  session, machine, or long-running goal. A handoff is a transfer protocol, not
  an agent category.

## Selection Axes

- Assignment: the concrete job, such as advice, implementation, review,
  research, monitoring, merge babysitting, or reporting.
- Lineage: the model family whose training and failure patterns matter for
  independence from the parent.
- Model capability: the model and reasoning level required by task risk and
  judgment.
- Provider: the service or harness exposing models, such as Codex, Claude, or
  Cursor. A provider may expose one or many model lineages.
- Runtime: the control surface used to call the agent, such as native
  subagents, ACPX, direct CLI, or a flow.

## Control Terms

- Prompt: a normal subordinate-agent request.
- Exec: a one-shot subordinate run that should not preserve session state.
- Queue: a follow-up that runs after the current turn finishes.
- Steer: an immediate intervention in the current turn, only where the runtime
  or adapter exposes that capability.
- Cancel: a cooperative request to stop in-flight subordinate work.
- Status: liveness or process/session state, not proof of task success.
- History: previous turn content or receipts used to inspect what happened.
- Read: full saved session history, optionally tailed, for detailed reduction.

## Evidence Terms

- Packet: the bounded instructions, source anchors, non-goals, permission
  boundary, expected receipt, and stop condition sent to a subordinate agent.
- Receipt: the subordinate agent's returned status, candidate result, evidence,
  blockers, and next-action signal.
- Ledger: the parent-maintained record of persistent subordinate sessions and
  their current state.
- Candidate claim: a subordinate-agent claim that has not been verified by the
  parent.
- Accepted claim: a candidate claim the parent has verified.
- Proof gap: a claim that remains useful context but is not verified enough to
  be presented as accepted truth.
