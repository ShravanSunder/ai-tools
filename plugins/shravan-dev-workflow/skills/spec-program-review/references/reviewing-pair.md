# Reviewing the Specification and Program-Design Pair

This reference owns `pair` mode judgment.

Pair review independently repeats load-bearing local checks; it does not trust author self-checks or prior local review as the only evidence.

Before pair-specific integration checks, MUST load `reviewing-specification.md` and return its complete specification-mode judgment for the current specification snapshot. Then MUST load `reviewing-program-design.md` and return its complete program-mode judgment for the current program-design and governing-specification snapshots. Pair judgment consumes both results and may not replace either with author or prior-review summaries.

Inspect:

- every material specification obligation has one design realization;
- every material design element traces to an obligation, constraint, failure policy, or proof need;
- terms and boundary altitude agree;
- design does not narrow, broaden, or contradict observable behavior;
- proof modality and structural seam form a sufficient chain;
- non-goals and compatibility survive realization;
- security/reliability and other applicable qualities map to owner, mechanism, failure/degradation, and proof;
- all coverage is semantically current for the current artifacts, with any post-review non-semantic changes recorded by the parent;
- a planner can choose tasks/order/commands without inventing meaning or How.

If local results are missing, pair `ready` requires independently repeating and recording the missing local checks. Missing prerequisites may still yield bounded findings, never false readiness.

Use the pretend planner:

```text
may decide: tasks, files, order, DAG, exact commands, red/green steps,
            evidence capture, checkpoints, rollout
must consume: requirements/contracts, components/owners/interfaces,
              state/flows/failure/concurrency/cutover/trust/proof seams
```

Complete when: cross-artifact traceability is bidirectional, contradictions are resolved or blocked, and planning has no semantic design decisions left.
