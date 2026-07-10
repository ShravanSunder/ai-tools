# Orchestration Patterns

| Pattern | Role | Continuity | Model category | Reasoning effort |
| --- | --- | --- | --- | --- |
| Advisor | Gives strategic advice, reflection, course correction, or completion checks while the parent remains executor. Candidate guidance only. | One persistent named relationship with trigger, authority, and stop condition. | Frontier | high or above |
| Sidekick | Owns delegated execution across assignments and follow-ups without final authority. | One persistent named relationship with ledger and progress checks. | Frontier or Balanced | medium or above |
| Delegate | Completes one bounded research, review, implementation, monitoring, or reporting assignment. | One packet and receipt; normally one-shot. | Balanced or Mini | medium or above |

## Assignment Routes

| Route | Pattern | Work | Boundary |
| --- | --- | --- | --- |
| Reasoning | Advisor, Sidekick, or Delegate | Analysis, synthesis, review, implementation, or judgment within delegated authority. | Parent verifies accepted claims. |
| Operator | Delegate | Process/test/CI/log/health monitoring; simple `git`, `gh`, and PR state checks; scripts and predefined procedures; site/file/log scraping; structured reporting. | Mini only. No judgment, code changes, replies, readiness verdicts, or merge. Send a decision packet when authority is needed. |

## Topology

| Topology | Rule |
| --- | --- |
| Single | One pattern instance owns the assignment. |
| Swarm | Multiple independent Delegates inspect the same assignment or decision target. The parent bounds lanes, verifies evidence, and decides. |

Several Sidekicks with distinct long-lived assignments are separate
relationships, not a swarm. A native subagent is a Delegate runtime, not a
pattern.

Changing Delegate to Sidekick or Sidekick to Advisor requires a new packet,
authority boundary, and ledger transition. Workflow handoff transfers phase
ownership; it is not an agent pattern.
