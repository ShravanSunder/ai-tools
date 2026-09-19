# Program-Design Evidence Lane Schema

This reference owns the shared packet and receipt envelope for the two bounded evidence lanes used by program design: current-system exploration and external prior-art/platform research. It does not authorize target design, advice, modeling, or artifact writing.

Packet:

```text
lane and assignment identity
selected lane reference
governing Requirements and Specification pointers plus the fixed bounded question
selection predicate and prerequisites
bounded evidence question and source scope
current-system or transfer context needed to interpret evidence
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

Complete when: the lane output covers the bounded evidence question, stays evidence-only, and gives the main enough source anchors to verify or reject it before authoring the target design.
