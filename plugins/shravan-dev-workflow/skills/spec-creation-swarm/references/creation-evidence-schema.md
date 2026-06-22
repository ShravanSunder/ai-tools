# Creation Evidence Schema

Use this schema for every substantive spec-creation lane observation before any
lane-specific context.

```text
- claim:
- source anchor:
- evidence class: direct observation | source summary | inference | contradiction | unresolved
- decision bucket: supports | refutes | complicates | unresolved
- design implication:
- boundary impact: preserves existing boundary | changes boundary | creates new boundary | unresolved
- proof modality: test | log | trace | metric | screenshot | data/db/state | manual UX | schema | unresolved
- counterfactual or failure path:
- parent reducer note:
- confidence: high | medium | low
```

Rules:

- Prefer one strong decision-shaping observation over several weak observations.
- Mark unverifiable claims as `unresolved`; do not invent a design to close the
  gap.
- Put lane-specific details after the schema fields.
