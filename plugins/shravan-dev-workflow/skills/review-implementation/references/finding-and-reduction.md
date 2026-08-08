# Finding And Reduction

This reference owns parent verification, finding semantics, cause-based routing, affected coverage, and the final review result.

Expected inputs: the shared review packet, terminal reviewer receipts, current governing sources and diff, proof evidence, and any prior coverage record.

Return: candidate dispositions, merged duplicates and conflicts, accepted findings, routes, coverage and evidence boundaries, first correction, and `ready | needs-revision | blocked | decision-needed`.

## Verify Before Accepting

For every candidate, reopen the cited governing and implementation anchors and inspect the claimed proof. Assign exactly one disposition:

```text
accepted    current source proves the defect and consequence
rejected    current source contradicts the candidate or makes it non-defective
duplicate   another candidate has the same root cause and route
unverified  missing evidence prevents acceptance or rejection
conflict    candidates disagree in a decision-relevant way
```

Confidence, reviewer agreement, severity, and reviewer identity are not evidence. Merge duplicates by root cause. Preserve conflicts only when they change the result, then state what source or owner decision would settle them.

## Record an Accepted Finding

Each accepted finding contains:

```text
severity: blocker | important | minor
exact anchor:
governing obligation or invariant:
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

Return exactly one using precedence `blocked -> needs-revision -> decision-needed -> ready`:

```text
ready
  complete current coverage, no accepted finding requiring correction, and no
  decision-relevant unresolved risk

needs-revision
  at least one accepted finding requires correction and has an exact owner and
  confirmation proof

blocked
  required source, identity, access, runtime, or proof is unavailable

decision-needed
  current evidence leaves a real owner-controlled choice or conflict
```

The result includes reviewed authority, the unchanged plan and approval records, base and reviewed identities, diff and proof currency, obligation coverage, normal/failure-path coverage, runtime reachability when applicable, accepted/rejected/unverified findings, conflicts, false-substitute risks, first correction, exact route, and uncovered boundary.

Accepted corrections to source or proof invalidate affected coverage. A remediation report, green proof, or focused-only result does not restore it; require a new meaningful review and complete-reviewer result for the corrected source and affected proof. State which coverage became invalid and bind the new result to the corrected source.

Complete when: every candidate has one verified disposition; duplicates and conflicts are reduced; each accepted finding has every required field and one semantic owner; the result follows the labels above; uncovered boundaries are explicit; and no stale coverage supports `ready`.
