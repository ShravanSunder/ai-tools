# Current-System Model

This reference owns source-grounded reconstruction of the current runtime and its proof path before target design.

Expected inputs: governing specification/digest, bounded system surface, repo source roots, current docs/tests/logs/traces, and known platform constraints.

Return: current component/owner tree, production and proof flows, state/mutation map, failure behavior, constraint degree, `changes / remains authoritative`, contradictions, evidence gaps, and immutable source coverage. Each source row records exact identity, version or digest, authority status, freshness/applicability, and the scoped-completeness basis covering current-system, constraint, platform, and external sources in scope.

## Trace Relationships, Not File Lists

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

## Reconstruct Representative Call Paths

For each load-bearing behavior, start at a concrete user, API, event, job, CLI, or test entrypoint and follow the real caller/callee chain to the state mutation, side effect, or external boundary. Then trace the result, error, event, or observable state back to its consumer.

If no current implementation or call path exists, record the source-backed greenfield basis and applicable platform, external-boundary, and proof-harness constraints instead of inventing frames or edges.

Use source navigation and tests as the baseline. When runtime stack traces, distributed traces, logs, profiles, or debugger captures exist, parse them to validate which dynamic path actually ran. A stack trace is point-in-time evidence, not the whole program model: normalize it into the relevant call chain and keep recursion, framework frames, generated code, callbacks, async continuations, event hops, and process boundaries explicit when they affect ownership or behavior.

Record each representative path as:

```text
entrypoint -> caller -> callee/owner -> mutation or side effect
           <- result | error | event | observable state
edge semantics: sync | async | callback | event | job | external
evidence anchors: source plus runtime/test evidence when available
```

Good: a source-anchored entrypoint-to-effect chain that distinguishes observed runtime frames from inferred edges and exposes where ownership, state, failure, or proof crosses a boundary.

Bad: a raw stack dump, a list of function names, or a diagram that omits the return/error path and state/side effect.

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

Complete when: load-bearing current behavior has a normalized entrypoint-to-effect call path with return/error behavior and evidence anchors, or its absence is bound to a source-backed greenfield basis; proof paths are inspectable; contradictions are explicit; and target design can no longer rely on an invented current model.
