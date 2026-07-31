# Finding and Parent Reduction

This reference owns parent verification, candidate disposition, duplicate/conflict reduction, coverage accounting, and the final review result.

## Finding

```text
finding identity
review mode / lane
severity: blocker | important | minor | observation
artifact and source anchor
claim or rule
failure path or contradiction
behavior/design risk
what the next author/planner would guess
smallest semantic correction target
semantic owner: spec-design | program-design | caller
validation note
refresh / retest required
contested evidence
```

Severity follows consequence, not tone:

- blocker: wrong behavior/design can result or next phase cannot proceed;
- important: correctness depends on guessing or inconsistent interpretation;
- minor: intended model lands with avoidable ambiguity/cost;
- observation: no proven behavior effect.

## Parent Verification

For each candidate:

1. open the target and source anchor;
2. reproduce the contradiction or failure path;
3. accept, reject, mark contested, or mark unverified;
4. record one-line evidence rationale;
5. merge duplicates by root cause;
6. preserve conflicting evidence.

Missing evidence is `unverified`, not rejection. Style preference without behavior effect is rejected.

## Coverage-Bound Result

```text
mode and exact covered digests
governing-source coverage
lane terminal states
coverage gaps
accepted/rejected/contested/unverified findings
what held
verdict: ready | needs-revision | blocked | decision-needed
first required revision
correction verification and receipt refresh
planning-readiness boundary
non-edit / non-acceptance statement
```

`ready` requires a complete fresh mode-complete receipt, no required coverage gap, no open blocker/important accepted finding, and no remaining planner-owned semantic invention.

Produce exactly one verdict:

- `blocked`: a required artifact/source/access input is missing or stale, or required mode/lane coverage is partial, blocked, or `no-receipt`, so the review cannot truthfully judge the mode.
- `decision-needed`: required coverage is complete enough to isolate an unresolved user/authority-owned choice, and that choice—not missing evidence or author correction—is the first action needed.
- `needs-revision`: coverage is sufficient to judge the artifact and at least one accepted blocker/important finding requires `spec-design`, `program-design`, or caller correction; this takes precedence over `decision-needed` when revision is independently required.
- `ready`: the complete condition above holds.

When states mix, apply precedence `blocked -> needs-revision -> decision-needed -> ready`.

Complete when: every candidate and lane terminal state is accounted for, the verdict cannot exceed coverage, and the result is bound to current digests.
