# Orchestration Patterns

| Pattern | Work | Continuity and cardinality | Authority | Model | Effort |
| --- | --- | --- | --- | --- | --- |
| Advisor | Strategic advice, reflection, course correction, or completion checks while the parent remains executor. | Exactly one persistent named relationship. | Candidate guidance only. | Frontier | high or above |
| Sidekick | Delegated execution across assignments and follow-ups. | Exactly one persistent named relationship with ledger. | Scoped execution; no final authority. | Frontier or Balanced | medium or above |
| Delegate | One bounded research, review, implementation, or reasoning assignment. | Single or Delegate swarm; normally one-shot. | Packet-bounded work; parent verifies. | Balanced or Mini | medium or above |
| Operation | A bounded procedure, monitor, simple `git`/`gh` or PR-state check, script, scrape, or structured report. | Single or Operation swarm; no semantic continuity. | Execute, observe, and report only. No judgment, code changes, replies, readiness verdicts, or merge; send a decision packet. | Mini | medium or above |

A native subagent is a Delegate or Operation runtime, not a pattern. Changing
patterns requires a new packet and authority boundary; entering Advisor or
Sidekick also requires a ledger transition.
