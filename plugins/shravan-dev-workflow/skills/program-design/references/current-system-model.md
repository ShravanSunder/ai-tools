# Current-System Model

This reference owns source-grounded reconstruction of the current runtime and its proof path before target design.

Expected inputs: governing specification/digest, bounded system surface, repo source roots, current docs/tests/logs/traces, and known platform constraints.

Return: current component/owner tree, production and proof flows, state/mutation map, failure behavior, constraint degree, `changes / remains authoritative`, contradictions, evidence gaps, and immutable source coverage. Each source row records exact identity, version or digest, authority status, freshness/applicability, and the scoped-completeness basis covering current-system, constraint, platform, and external sources in scope.

## Trace Relationships, Not Paths

Inspect the smallest useful set:

```text
entry boundary and consumers
runtime components and authoritative owners
mutation and side-effect sites
production calls/events/data flow
state lifetime and storage
failure/retry/recovery behavior
platform/external boundaries
real proof harness and observation path
```

Open load-bearing sources. A file list or search result is not a model.

For each relationship, record direct observation, inference, or unresolved gap. Current code is evidence; desired behavior remains governed by the specification.

## Diagnose Ownership Smells

In UI/refactor work, repeated synchronization effects, duplicated derived state, prop/state mirroring, and cleanup races often reveal unclear ownership or lifecycle coupling. Trace:

- who owns the source value;
- who derives it;
- who starts/cancels effects;
- which render or callback observes stale state;
- which current interface forces cross-owner coordination.

Do not assume the symptom proves the target boundary. It identifies the crux the alternatives pass must resolve.

## Degree of Constraint

Classify:

```text
greenfield
compatibility-bound
migration-bound
platform-bound
legacy-ownership-bound
```

Name what the change may replace and what remains authoritative. For external prior art/platform evidence, return borrow/adapt/do-not-borrow plus version and transfer assumptions.

Good: a source-backed map from entry to state owner to side effect to observable proof.

Bad: folder inventory, undocumented inference treated as fact, or current code treated as desired authority.

Complete when: load-bearing current behavior and proof paths are inspectable, contradictions are explicit, and target design can no longer rely on an invented current model.
