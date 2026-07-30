# Proof Obligations

This reference owns requirement-level proof modality. It does not choose implementation test files, commands, harness wiring, or evidence-capture procedure.

Expected inputs: material requirement inventory, observable contracts, cross-cutting obligations, and known proof constraints.

Return: requirement-to-modality coverage, unprovable or ambiguous obligations, and evidence gaps for program design or planning.

Evidence classes include:

```text
automated behavior
manual interaction or visual evidence
API or CLI transcript
state or data inspection
log, trace, or metric observation
security analysis or misuse case
performance measurement
release or runtime evidence
```

Choose the class that can observe the obligation at its actual boundary.

Good:

- a UI layout obligation requires manual or visual evidence at the supported viewport;
- an idempotency obligation requires observable side-effect/state evidence, not only a returned status;
- an authorization obligation requires allowed and denied actor cases at the enforcement boundary;
- a latency obligation names the measured boundary, workload class, and threshold;
- an operational alerting obligation requires metric/alert observation, not merely log existence.

Bad:

- “unit tests” for cross-process wiring;
- “manual test” without the behavior and observation;
- static schema validation for runtime ordering or recovery;
- mocked integration evidence presented as production wiring proof;
- naming an exact command before the program design exposes the necessary seam.

When no existing seam could provide the required evidence, return a program-design proof-seam question. Do not weaken the obligation to match the current harness.

Complete when: every material requirement has an evidence class that can distinguish pass from fail at the claimed boundary, and every remaining proof gap is explicit.
