# Review Lane Schema

This reference owns the packet and receipt envelope shared by the mode-complete reviewer and every focused reviewer. Lane missions and judgment stay in their lane references.

## Packet

```text
assignment identity
lane: mode-complete-reviewer | specification-authority | contract |
      architecture-boundary | failure-concurrency | security-trust |
      platform-harness | implementation-difference | proof |
      artifact-navigation
review mode: specification-only | program-only | pair
exact target paths/identities and review snapshot identifiers
governing-source identities/digests/versions, authority statuses, and freshness/applicability
governing-source coverage completeness basis
observable selection predicate
bounded review question
source scope
constraints and non-goals
risk predicates
mission
maximum authority
overlap boundary and non-goals
prerequisites and dependency state
stop condition
expected return
```

The mode-complete packet uses predicate `mandatory for every review invocation`. A focused packet names the exact predicate that selected it. Missing or ambiguous targets, snapshot identifiers, governing sources, or authority stop inspection and produce a blocked receipt. Snapshot metadata stays in packets and results; reviewers never add it to the artifacts under review.

## Authority Field

The packet records `maximum authority` using the exact selected lane reference as semantic owner. The caller may narrow that instance authority and may never widen it. The receipt may include the optional `candidate recommendation` slot only when the selected lane reference permits it.

## Receipt

Only these lane receipt states exist:

```text
complete
  assignment and covered review snapshot identifiers
  sources inspected and source gaps
  coverage performed
  reconstructed model or bounded model slice
  crux/probe evidence
  candidate findings
  what held
  remaining gaps
  stop reason
  candidate recommendation, mode-complete only

partial
  all complete fields available so far
  exact unfinished coverage
  reason work stopped
  evidence needed to complete

blocked
  blocker
  evidence for blocker
  missing input, decision, access, or state change needed
```

`no-receipt` is parent-recorded after explicit follow-up; it is not a reviewer receipt and carries no invented evidence. Every reviewer candidate finding MUST use the Finding shape in `../finding-and-reduction-schema.md`; disposition and final reduction remain parent-only.

Complete when: the packet is self-contained, the state matches the work actually performed, and the receipt stops at candidate evidence for parent reduction.
