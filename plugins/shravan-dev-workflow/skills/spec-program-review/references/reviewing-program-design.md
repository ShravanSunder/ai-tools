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
- failure, retry, idempotency, partial success, cancellation, cleanup, recovery;
- concurrency, ordering, consistency, backpressure;
- trust/security/reliability/operability and other applicable qualities;
- migration/cutover authority;
- proof seams and enforcement classes;
- requirement-to-design traceability;
- plan leakage and hidden requirement invention.

Good: a reader can simulate normal/failure behavior and trace every obligation to one owner and proof seam.

Bad: architecture nouns without composition, current paths as target tasks, signatures without contracts, generic retries/locks, or planner-owned missing How.

Route How corrections to `program-design`; missing/contradictory Why/What to `spec-design`; caller-state issues to the caller.

Complete when: internal coherence and specification satisfaction each have an evidence-backed result.
