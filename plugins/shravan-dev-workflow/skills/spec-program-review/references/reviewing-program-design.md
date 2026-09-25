# Reviewing a Program Design

This reference owns `program-only` mode judgment.

Judge separately:

1. Is structural How internally coherent?
2. Does it realize the governing specification without changing meaning?

Inspect:

- current-system source grounding and constraint degree;
- alternatives, crux, tradeoff, debt, and revisit signals;
- entity binding: every Specification entity (`E`) has a row giving a semantic owner that is a component, a package or module home marked `new | modified | existing` (with the code name on existing rows), a schema/type home, `persisted | derived | cached`, and the type convention followed or `none found`;
- boundary shapes: every entity or message that crosses a process, service, storage, or queue boundary has a shape in the found convention, or a field list with name, discriminant, fields, nullability, and schema home;
- existing code: a code type with a different name is recorded as the binding, not as a second schema or a renamed entity;
- component composition, depth, singular ownership, dependency direction;
- behavioral interfaces, with result and decision contracts as closed variants carrying bounded reason sets;
- state ownership/transitions;
- normal control/data/call flows;
- source-anchored current entrypoint-to-effect paths and proposed paths, or proposed-only paths with an explicit no-predecessor case;
- added, removed, and changed owners, caller/callee edges, state reads/writes or effects, and result/error propagation for every applicable material runtime-behavior group, plus unchanged edges whose preservation is requirement-critical, safety-critical, or contested;
- failure, retry, idempotency, partial success, cancellation, cleanup, recovery;
- concurrency, ordering, consistency, backpressure;
- trust/security/reliability/operability and other applicable qualities;
- migration/cutover authority;
- proof seams and enforcement classes;
- requirement-to-design traceability;
- plan leakage and hidden requirement invention.

Check the binding table against the Specification's entity table one entity at a time. Prose that mentions an entity is not a binding, and an entity missing from the table is a finding even when the components around it are sound.

Good: a reader can simulate normal/failure behavior, find where each entity lives and what crosses each boundary, and trace every obligation to one owner and proof seam.

Bad: architecture nouns without composition or visible call relationships, current paths as target tasks, hidden removed edges, signatures without contracts, a Specification entity with no binding row, a payload described without fields or schema home, a package named as the semantic owner, a result or reason as an open string, variant lists in prose, generic retries/locks, or planner-owned missing How.

Route How corrections, including missing bindings, prose shapes, and open contracts, to `program-design`; missing/contradictory Why/What, including an entity the design needs that the Specification never defined, to `spec-design`; caller-state issues to the caller.

Complete when: internal coherence and specification satisfaction each have an evidence-backed result; every entity binding and boundary shape was checked against the Specification's entity table; result and decision contracts are closed variants with bounded reasons; and every applicable material runtime-behavior group has a visible current/proposed call-path delta or explicit no-predecessor case with added/removed/changed edges and any preservation-critical or contested unchanged edge.
