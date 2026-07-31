# Reviewing a Program Design

This reference owns `program-only` mode judgment.

Judge separately:

1. Is structural How internally coherent?
2. Does it realize the governing specification without changing meaning?

Inspect:

- current-system source grounding and constraint degree;
- alternatives, crux, tradeoff, debt, and revisit signals;
- component composition, depth, singular ownership, dependency direction;
- behavioral interfaces;
- state ownership/transitions;
- normal control/data/call flows;
- source-anchored current entrypoint-to-effect paths and proposed paths, or proposed-only paths with an explicit no-predecessor case;
- added, removed, changed, or intentionally unchanged owners, caller/callee edges, state reads/writes or effects, and result/error propagation for every applicable material runtime-behavior group;
- failure, retry, idempotency, partial success, cancellation, cleanup, recovery;
- concurrency, ordering, consistency, backpressure;
- trust/security/reliability/operability and other applicable qualities;
- migration/cutover authority;
- proof seams and enforcement classes;
- requirement-to-design traceability;
- plan leakage and hidden requirement invention.

Good: a reader can simulate normal/failure behavior and trace every obligation to one owner and proof seam.

Bad: architecture nouns without composition or visible call relationships, current paths as target tasks, hidden removed edges, signatures without contracts, generic retries/locks, or planner-owned missing How.

Route How corrections to `program-design`; missing/contradictory Why/What to `spec-design`; caller-state issues to the caller.

Complete when: internal coherence and specification satisfaction each have an evidence-backed result, and every applicable material runtime-behavior group has a visible current/proposed call-path delta or explicit no-predecessor case with all four edge statuses.
