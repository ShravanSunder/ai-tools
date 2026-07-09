# Glossary

This file owns term meanings for `manage-agents`. It does not define workflow
rules, packet fields, provider commands, or proof policy.

## Agent Roles And Patterns

- Parent: the session that owns scope, permissions, reduction, verification,
  and the final claim.
- Subordinate agent: any model-backed helper whose output the parent must
  verify before accepting.
- Swarm: a set of bounded independent lanes used for breadth, comparison,
  research, review, or adversarial coverage.
- Persistent sidekick: a long-lived helper with its own context and a ledgered
  session for follow-ups.
- Advisor: a consultative helper that gives strategic notes, concerns, or
  blockers while another agent executes.
- Ephemeral subagent: a throwaway helper for one bounded question, patch
  candidate, or stateless review.
- Workflow handoff: a packet that transfers work to another phase skill, future
  session, machine, or long-running goal.

## Control Terms

- Prompt: a normal subordinate-agent request.
- Exec: a one-shot subordinate run that should not preserve session state.
- Queue: a follow-up that runs after the current turn finishes.
- Steer: an immediate intervention in the current turn, only where the runtime
  or adapter exposes that capability.
- Cancel: a cooperative request to stop in-flight subordinate work.
- Status: liveness or process/session state, not proof of task success.
- History: previous turn content or receipts used to inspect what happened.

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
