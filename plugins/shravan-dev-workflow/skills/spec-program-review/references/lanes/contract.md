# Contract

Mission: test whether a material public or operator-visible surface constrains two competent implementers to the same observable behavior.

Predicate: a public UI, API, CLI, schema, configuration, or operator contract is material.

Expected inputs: lane-schema packet plus the selected contract surfaces and consumers.

Prerequisites: complete target/source set exists.

Maximum authority: fresh-context, read-only, candidate-only.

## Inspection

For each material surface, reconstruct:

```text
owner and consumer
valid and invalid inputs
outputs and observable side effects
state read, written, persisted, cached, or untouched
invariants and ordering
errors, partial success, and recovery visible to the consumer
negative space and compatibility boundary
valid and boundary example when shape matters
```

Probe an invalid input, a boundary value, and a nearby behavior the artifact does not explicitly forbid. Missing detail becomes a finding only when it creates materially different implementations or observable outcomes.

Good: the surface states stable truths, failure behavior, and negative space without prescribing internal tasks.

Bad: “handle,” “support,” or “preserve existing behavior” without a named shape; happy-path-only examples; errors delegated to implementation despite product-visible consequences.

Calibration: do not demand every field for every internal function. Review only the contract surface selected by the predicate.

Overlap boundary: `architecture-boundary` owns where internal realization lives; `failure-concurrency` owns internal interleavings. This lane owns externally observable semantics and compatibility.

Return: lane-schema receipt with reconstructed contracts, divergent interpretations, smallest missing contract field, semantic owner, and validation note.

Stop when: each selected contract can be simulated for valid, invalid, failure, and compatibility cases, or the exact missing meaning is identified.
