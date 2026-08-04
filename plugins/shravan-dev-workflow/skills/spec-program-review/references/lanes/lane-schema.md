# Review Lane Schema

This reference owns the packet and receipt envelope shared by the mode-complete reviewer and every focused reviewer. Lane missions and judgment stay in their lane references.

## Packet

```text
assignment identity
lane: mode-complete-reviewer | specification-authority | contract |
      architecture-boundary | failure-concurrency | security-trust |
      platform-harness | implementation-difference | proof |
      artifact-navigation | reader-understanding
selected lane reference
review mode: specification-only | program-only | pair
complete target paths/identities and current workspace state
governing-source identities/versions, authority statuses, and freshness/applicability
governing-source coverage completeness basis
confirmed goal boundary and accepted requirements set, or exact authority gap
structural-realization confirmation for program-only or pair, or exact owner decision needed
prior review coverage and semantic-change record when coverage is reused
observable selection predicate
bounded review question
source scope
assignment-specific constraints that narrow the lane reference, or `none`
risk predicates
prerequisites and dependency state
```

The selected lane reference owns its invariant mission, maximum authority, overlap/non-goal boundary, expected return, and stop boundary. The packet carries assignment-specific evidence and constraints and may narrow those invariants; it does not restate or widen them.

The mode-complete packet uses predicate `mandatory for every review invocation`. A focused packet names the exact concrete unresolved risk that selected it and why the mode-complete receipt did not settle it. Missing or ambiguous targets, governing sources, accepted requirements, or authority stop inspection and produce a blocked receipt.

## Authority Field

The selected lane reference is the semantic owner of maximum authority. The caller may narrow that authority through assignment-specific constraints and may never widen it. The receipt may include the optional `candidate recommendation` slot only when the selected lane reference permits it.

## Receipt

Only these lane receipt states exist:

```text
complete
  assignment and covered targets
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

When the review involves simplification, baseline recovery, or requirement subtraction, `coverage performed` returns one compact row per stable identity with `covered | owner-authorized supersession | gap` plus its anchor. Identities may share a row only when every member identity is enumerated and all share the same disposition and anchor; a bare "coverage intact" assertion is not a result in those cases. Unrelated reviews do not invent a universal ledger.

`no-receipt` is parent-recorded after explicit follow-up; it is not a reviewer receipt and carries no invented evidence. Every reviewer candidate finding MUST use the Finding shape in `../finding-and-reduction-schema.md`; disposition and final reduction remain parent-only.

Complete when: the packet is self-contained, the state matches the work actually performed, and the receipt stops at candidate evidence for parent reduction.
