# Finding And Reduction

This reference owns parent verification, the rails re-anchor, finding semantics, cause-based routing, affected coverage, and the final review result.

Expected inputs: the shared review packet, terminal reviewer receipts including the dispel classification, current governing sources and diff, proof evidence, and any prior coverage record.

Return: candidate dispositions with rails anchors, merged duplicates and conflicts, accepted findings, routes, scope effects, coverage and evidence boundaries, first correction, and `ready | needs-revision | blocked-input | decision-needed | remediation-limit-reached`.

## Re-anchor on the Rails

Before any disposition, anchor each candidate to the rails:

```text
rails anchor: confirmed requirement | Specification obligation |
              Program Design element | confirmed goal-boundary field
governing source identity and exact section/field:
quoted or faithful obligation text:
plain-language meaning of that anchor:
observable outcome that fails if unresolved:
deletion test: does removing the questioned mechanism remove the failure?
scope effect: inside confirmed boundary | requires owner expansion decision
```

A category name is not an anchor: "the reliability requirement" fails this gate until the exact governing clause is opened and quoted. A candidate whose anchor fields cannot be filled from an inspectable source is `unverified` or `decision-needed`, never `accepted` — it is advice awaiting investigation, not implementation authority. When the deletion test says removing the mechanism preserves every confirmed obligation, prefer deletion over completing the mechanism's missing contracts. A correction that introduces an unrequested subsystem, expands the confirmed goal, or weakens a requirement returns `decision-needed` to the owner — it is never silently accepted, however well-argued. A candidate is a mental-model break — not an ordinary design finding — when its correction cannot be expressed inside the current governing basis because an assumption the basis itself relies on is false: the design assumes an interface, ordering, ownership, or guarantee the current system does not provide. A defect the basis already forbids and can name the fix for routes to its semantic owner as usual; a break stops reduction and returns the failed assumption, evidence, and consequence to the user instead of being pushed through remediation. The bad signal is routing a break to `program-design` and continuing.

## Verify Before Accepting

For every candidate, reopen the cited governing and implementation anchors and inspect the claimed proof. Assign exactly one disposition:

```text
accepted    current source proves the defect and consequence, and the rails
            anchor holds
rejected    current source contradicts the candidate, makes it non-defective,
            or the correction fails the rails (over-engineered, out of scope,
            requirements-weakening) with the evidence stated
duplicate   another candidate has the same root cause and route
unverified  missing evidence prevents acceptance or rejection
conflict    candidates disagree in a decision-relevant way
```

Confidence, reviewer agreement, severity, and reviewer identity are not evidence — verify against source, never rubber-stamp. Weigh the dispel lane's classification as candidate evidence like any other receipt. Merge duplicates by root cause. Preserve conflicts only when they change the result, then state what source or owner decision would settle them.

## Record an Accepted Finding

Each accepted finding contains:

```text
severity: blocker | important | minor
exact anchor:
governing obligation or invariant:
rails anchor and deletion-test result:
scope effect:
concrete consequence:
smallest correction:
owner:
confirmation evidence:
coverage invalidated:
```

Route by cause, not severity:

- Requirements or observable-contract meaning -> `spec-design`.
- Structural ownership, interface, state, failure, concurrency, trust, compatibility, or proof seam -> `program-design`.
- Slice, sequence, dependency, collision, write scope, or plan-proof mapping -> the plan record's `plan-implementation` or `plan-improve-repo` origin.
- Code, test, fixture, or implementation-proof evidence -> `implement-plan`.
- Missing authority or unresolved owner choice -> caller.

## Decide the Review Result

This reference owns the review-result labels. Return exactly one using precedence `remediation-limit-reached -> blocked-input -> needs-revision -> decision-needed -> ready`:

```text
ready
  complete current coverage, no accepted finding requiring correction, and no
  decision-relevant unresolved risk

needs-revision
  at least one accepted finding requires correction and has an exact owner and
  confirmation proof

blocked-input
  required source, identity, access, runtime, or proof is unavailable

decision-needed
  current evidence leaves a real owner-controlled choice or conflict, including
  a correction that would expand scope or weaken a requirement

remediation-limit-reached
  three remediation passes already exist and no explicit user continuation
  authority was supplied
```

The result includes reviewed authority, unchanged plan/governing-basis/delivery-context records, base and reviewed identities, diff and proof freshness, remediation-pass evidence, obligation coverage, normal/failure-path coverage, runtime reachability when applicable, accepted/rejected/unverified findings, conflicts, weaker-substitute risks, first correction, exact route, and uncovered boundary.

Accepted corrections to source or proof invalidate affected coverage. A remediation report, green proof, or focused-only result does not restore it; require a new meaningful review with fresh chunk coverage for the corrected source and affected proof. State which coverage became invalid and bind the new result to the corrected source.

Complete when: every candidate has one verified disposition; duplicates and conflicts are reduced; each accepted finding has every required field and one semantic owner; the result follows the labels above; uncovered boundaries are explicit; and no stale coverage supports `ready`.
