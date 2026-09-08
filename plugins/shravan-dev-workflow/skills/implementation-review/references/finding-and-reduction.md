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
deletion test: without the questioned mechanism, do the confirmed obligations still hold?
mechanism necessity: is the proposed mechanism the smallest change that satisfies
  the quoted clause, or one of several ways to serve it?
scope effect: inside confirmed boundary | requires owner expansion decision
```

A category name is not an anchor: "the reliability requirement" fails this gate until the exact governing clause is opened and quoted. A candidate whose anchor fields cannot be filled from an inspectable source is `unverified`, never `accepted` — it is advice awaiting investigation, not implementation authority. When the deletion test says the obligations hold without the mechanism, prefer deletion over completing the mechanism's missing contracts.

Two kinds of scope expansion get two different dispositions, and confusing them is how a gold-plating reviewer ends up steering the verdict:

- A **reviewer candidate that proposes adding scope** with no rail anchor — a circuit breaker, a hardening layer, an abstraction for imagined consumers — is `rejected: scope expansion` and listed for the owner as an observation. It never produces `decision-needed`; a suggestion is not a decision the owner owes an answer to. Anchoring it one altitude up ("the spec says return a typed error on provider outage") does not rescue it when `mechanism necessity` says the mechanism is one of several ways to serve the clause — then the accepted finding, if any, names the unrealized obligation and its failure and routes to its owner; the mechanism choice is not the reviewer's to make and never rides into the handoff.
- A **delivered item the diff already contains** that dispel mapped `absent` (or spec-compliance classified `extra`/`scope overreach`) is never `rejected` as "non-defective" — being well built is not a disposition. Its only dispositions are `accepted` (removal, owner `implement-plan`) or `decision-needed` with deletion as the default recommendation when the owner may want to adopt it as a scope expansion.

When the parent's disposition contradicts dispel's correction class, record the quoted rail text that overrides it. A candidate is a mental-model break — not an ordinary design finding — when its correction cannot be expressed inside the current governing basis because an assumption the basis itself relies on is false: the design assumes an interface, ordering, ownership, or guarantee the current system does not provide. A defect the basis already forbids and can name the fix for routes to its semantic owner as usual; a break stops reduction and returns the failed assumption, evidence, and consequence to the user instead of being pushed through remediation. The bad signal is routing a break to `program-design` and continuing.

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

A proof claim whose proof-challenge lane returned only challenges — nothing executed because every command would write into the worktree or no grant was recorded — cannot support `ready` when that claim is the sole proof for a changed contract; it is `needs-revision` to `implement-plan` (supply runnable, scratchpad-safe proof) or `blocked-input`.

Accepted corrections to source or proof invalidate affected coverage. A remediation report, green proof, or focused-only result does not restore it; require a new meaningful review with fresh chunk coverage for the corrected source and affected proof. State which coverage became invalid and bind the new result to the corrected source.

Complete when: every candidate has one verified disposition; duplicates and conflicts are reduced; each accepted finding has every required field and one semantic owner; the result follows the labels above; uncovered boundaries are explicit; and no stale coverage supports `ready`.
