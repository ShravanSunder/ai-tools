# Program-Design Lane Schema

This reference owns the shared packet and receipt envelope for bounded program-design lanes. It does not own lane judgment.

Packet:

```text
lane and assignment identity
selected lane reference
governing specification path and current text
program-design path and current text when the selected lane's prerequisites say it
exists; otherwise `not-yet-produced` plus the current workflow stage
selection predicate and prerequisites
bounded question and source scope
settled requirements/decisions/claims
instance constraints that narrow the lane reference, or `none`
```

The selected lane reference owns its invariant mission, maximum authority, non-goals, expected return, and stop boundary. The packet supplies assignment-specific state and may narrow those invariants; it does not restate or widen them.

Receipt:

```text
status: complete | partial | blocked
covered sources and exact anchors
candidate result
assumptions
contradictions or gaps
stop reason
parent verification required
```

`no-receipt` is parent-recorded after one explicit follow-up; it is never a fabricated receipt or clean result.

Complete when: the lane output covers the current assigned targets, stays within authority, and gives the parent enough source evidence to verify or reject it.
