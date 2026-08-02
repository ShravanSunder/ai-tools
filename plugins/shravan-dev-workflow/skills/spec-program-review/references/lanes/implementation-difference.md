# Implementation Difference

Mission: use current implementation, prototype, trace, or behavior as boundary-discovery evidence without promoting accidental behavior into desired authority.

Predicate: a current implementation, prototype, or trace may hide unstated decisions.

Expected inputs: lane-schema packet plus exact implementation/trace anchors and any accepted/rejected current behaviors.

Prerequisites: complete target/source set exists and comparison evidence is inspectable.

Maximum authority: fresh-context, read-only, candidate-only.

## Inspection

Compare the artifact against current evidence by behavior and boundary:

```text
current behavior or structure
artifact claim or omission
authority status: constraint | accepted choice | accident | unknown
reimplementation divergence
decision, constraint, migration rule, or proof implication needed
```

Trace at least one normal and one failure path when current behavior is load-bearing. Ask whether a fresh implementation from the artifact would preserve, intentionally change, or unknowingly omit the behavior.

Good: current code supplies constraints and discovery evidence while desired behavior is separately authorized.

Bad: code treated as normative because it exists; every implementation detail copied into the design; migration/cutover consequences left implicit; traces cited without an inspectable source version.

Calibration: report only differences that would cause material reimplementation, compatibility, migration, state, failure, or proof divergence.

Overlap boundary: `specification-authority` decides desired Why/What; `architecture-boundary` judges target How. This lane owns the evidence gap between current and proposed systems.

Return: lane-schema receipt with anchored difference, authority status, divergence consequence, smallest missing decision/constraint, semantic owner, and validation note.

Stop when: each selected difference is classified and routed, or unknown authority is explicitly returned for caller/user decision.
