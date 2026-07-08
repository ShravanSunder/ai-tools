# Property-Driven Development

Use property thinking when examples share a rule that is more important than
any one example. A property can be tested with a table, a few hand-picked
examples, or a property-based generator when the project already has a suitable
framework or the risk justifies adding one.

## When To Use

- many examples share the same invariant;
- state transitions must preserve constraints;
- domain values have validity rules that should be unrepresentable or guarded;
- IO, parsing, or external events can introduce invalid states;
- parser/serializer/normalizer behavior has round trips;
- permissions, filtering, ordering, de-duplication, or idempotency are
  load-bearing;
- concurrency or ordering can produce unexpected interleavings.

## Property Families

- Round trip: encode/decode, serialize/parse, save/load.
- Idempotence: applying an operation twice equals once.
- Monotonicity: adding input cannot remove allowed output unless a rule says so.
- Conservation: totals, counts, identities, or permissions are preserved.
- Ordering: sort, priority, timestamp, or queue rules remain valid.
- Commutativity/associativity: use only where the domain actually supports it.
- State-machine transitions: only valid transitions occur; invalid transitions
  fail predictably.
- Boundary rejection: invalid external input is rejected before it becomes a
  trusted domain value.
- Representation: impossible states are prevented by project-native types,
  schemas, constructors, or value objects rather than checked everywhere later.
- Metamorphic relations: related inputs produce predictably related outputs.

## Choosing Table Or Generator

Use table-driven examples when:

- the property is clear in 3-8 examples;
- edge cases are known;
- adding a generator would add more framework work than proof value.

Use property-based generators when:

- the project already uses a generator framework;
- the input space is too large for hand examples;
- shrinking/finding counterexamples materially improves debugging;
- generated examples can still use a clear oracle.

## Reporting Shape

```text
property:
domain_boundary:
critical_invariants:
illegal_state_strategy:
guard_or_precondition_points:
io_boundary_cases:
example_family:
oracle:
table_or_generator:
why_this_level_is_enough:
```
