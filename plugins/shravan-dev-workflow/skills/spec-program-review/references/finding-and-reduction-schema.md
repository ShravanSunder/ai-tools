# Finding and Parent Reduction

This reference owns parent verification, candidate disposition, duplicate/conflict reduction, coverage accounting, and the final review result.

## Finding

```text
finding identity
review mode / lane
severity: blocker | important | minor | observation
artifact and source anchor
claim or rule
failure and downstream ambiguity: contradiction or failure path, observable consequence, and what the next author/planner would otherwise have to guess
smallest semantic correction target
semantic owner: spec-design | program-design | caller
validation note
semantic coverage to rerun
contested evidence
accepted requirement identity or confirmed boundary
plain-language requirement meaning
evidence checked or bounded evidence-lookup result
whether deletion of the questioned mechanism removes the failure
scope effect: inside confirmed boundary | requires owner expansion decision
```

Severity follows consequence, not tone:

- blocker: wrong behavior/design can result or next phase cannot proceed;
- important: correctness depends on guessing or inconsistent interpretation;
- minor: intended model lands with avoidable ambiguity/cost;
- observation: no proven behavior effect.

## Parent Verification

For each candidate:

1. open the target and source anchor;
2. before accepting, cite the accepted requirement identity, restate its meaning in plain language, and name the observable outcome that fails if the concern is unresolved;
3. reproduce the contradiction or failure path;
4. when direct source reading cannot answer one factual question, use `manage-agents` to dispatch one fresh, read-only Delegate evidence lookup; its packet carries the exact requirement identity and meaning, the single factual question, bounded sources, and the non-goal `no redesign or review recommendation`; it returns a `complete | partial | blocked` evidence receipt with anchors and uncertainty for parent verification;
5. accept, reject, mark contested, or mark unverified;
6. record one-line evidence rationale;
7. merge duplicates by root cause;
8. preserve conflicting evidence.

Missing evidence is `unverified`, not rejection. Style preference without reader or behavior effect is rejected. Before accepting missing contracts on a proposed mechanism, test whether deleting the mechanism preserves every confirmed requirement. Prefer deletion when it does. Reviewers never spawn reviewers or evidence lookups. The parent may dispatch one lookup as research, not as another review lane; it opens the returned anchors and reduces the evidence before disposition. A reviewer concern that cannot be tied to an accepted requirement and observable failure is advice awaiting investigation, not implementation authority.

## Coverage-Bound Result

```text
mode and covered targets
semantic coverage statement and any later semantic-change records
governing-source coverage
accepted-requirements and confirmed-requirements-boundary coverage
lane terminal states
coverage gaps
accepted/rejected/contested/unverified findings
what held
verdict: ready | needs-revision | blocked | decision-needed
first required revision
correction verification and affected-coverage rerun
planning-readiness boundary
owner decision when correction would expand or subtract confirmed scope
non-edit / non-acceptance statement
```

`ready` requires complete semantically current mode coverage, no required coverage gap, no open blocker/important accepted finding, no unapproved scope expansion or requirement subtraction, and no remaining planner-owned semantic invention.

Produce exactly one verdict:

- `blocked`: a required artifact/source/access input is missing or stale, or required mode/lane coverage is partial, blocked, or `no-receipt`, so the review cannot truthfully judge the mode.
- `decision-needed`: required coverage is complete enough to isolate an unresolved user/authority-owned choice, including a proposed scope expansion or requirement subtraction, and that choice—not missing evidence or author correction—is the first action needed.
- `needs-revision`: coverage is sufficient to judge the artifact and at least one accepted blocker/important finding requires `spec-design`, `program-design`, or caller correction; this takes precedence over `decision-needed` when revision is independently required.
- `ready`: the complete condition above holds.

When states mix, apply precedence `blocked -> needs-revision -> decision-needed -> ready`.

After any edit, the parent records whether meaning changed and which mode or focused-lane predicates it affected. Rerun only affected coverage; carry coverage across non-semantic edits without model dispatch.

Complete when: every candidate and lane terminal state is accounted for; every accepted candidate names the requirement or boundary, plain-language meaning, failure and downstream ambiguity, and verified evidence; accepted requirements and goal relevance are preserved; deletion was tested before addition; the verdict cannot exceed semantically current coverage; and any later semantic-change records are explicit.
