# Missing Visible Current/Proposed Call-Path Deltas

Date: 2026-07-31
Purpose: observed-failure evidence for `program-design` and `spec-program-review`; not an implementation contract

## Confirmed Failure

Recent program designs contain useful architecture and sequence material but do not give the human a source-anchored comparison of where the current call enters, how the proposed call path changes, and which owner, caller/callee, state/effect, and result/error edges are added, removed, changed, or intentionally preserved.

This is not the same as having no diagrams. The artifacts contain diagrams. The missing result is the current-to-proposed call-path delta an implementer and human reviewer can follow without reconstructing it from prose.

## Evidence Checked

### Customer eval program design

Source: `perseus-agent.spec-v2-data-guidance/docs/specs/2026-07-31-customer-eval-specification/2026-07-31-customer-eval-program-design.md`

- The execution sequence at lines 120-142 shows conceptual participants: Voyager/Vitest, preflight, runtime, factual evaluator, and semantic judge.
- The two minimal Voyager changes at lines 206-237 name `normalizeObservation`, PI `buildOutput`, `defineVoyagerEval`, and the proposed judge gate.
- The artifact does not show the current and proposed source-level call chains for either seam. The reader must infer where `consumerHandle` moves through the existing stack, where the new gate enters the assertion path, and which caller/callee and result/error edges change.

### Observability program design

Source: `perseus-agent.logging-llmops/docs/specs/2026-07-31-perseus-agent-observability/2026-07-31-perseus-agent-observability-program-design.md`

- Lines 82-105 explain current runtime facts and identify the synchronous `streamFn` execution scope as the crux.
- Lines 233-270 map current hooks to proposed lifecycle actions and define `runWithModelRequestContext`.
- The sequence at lines 396-424 gives a strong proposed cross-process path.
- The artifact still does not pair the current path with the proposed path or mark the exact added, removed, changed, and unchanged call/state/effect edges. A human must mentally diff the current-source prose, hook table, interface, and proposed sequence to find where the new scope enters the call stack.

## Current Skill Gap

The active `program-design` teaching is stronger than its visible-output gate:

- `references/state-calls-and-flows.md` requires every material requirement to have a source-anchored target entrypoint-to-effect call path and requires each target edge to name owner, operation/event, edge semantics, state/effect, result/error, and requirement.
- The `Required Views` table selects `call graph/sequence` only when control crosses owners or async boundaries.
- `references/artifact-and-self-review.md` applies the call-path semantics only after that view predicate fires.

Therefore a same-owner synchronous behavior change, or a design whose author believes the call order is “obvious,” can return an artifact with components and interfaces but no visible call-path result. Even when a proposed sequence exists, the current-to-proposed delta remains optional.

## Skill Requirements Derived From The Failure

1. Use the existing `call graph/sequence` view; do not create another call-stack view token.
2. Fire it when material runtime behavior adds, removes, or changes an entrypoint-to-effect path, when the path is needed to explain a material obligation, or when control crosses owners or async boundaries.
3. Return the source-anchored current path and proposed path. For a first design, return the proposed path and explicitly state that no predecessor exists.
4. Mark added, removed, changed, and intentionally unchanged owners, caller/callee edges, state reads/writes or external effects, and result/error propagation.
5. Allow requirements that share one call path to cite one delta instead of repeating it.
6. Render the selected result in the durable artifact and in the chat medium the user can inspect. Mermaid, table, plain text, or TUI is a rendering choice; the semantic call-path result is mandatory when the predicate fires.
7. `program-only` and `pair` review treat components/interfaces without an applicable visible call path as a core design gap, not a focused-review preference.

## Deferred Proof Scenarios

- Same-owner synchronous behavior changes while the old predicate would not fire: the artifact must still show current/proposed paths and the changed edge.
- Greenfield design: the artifact shows proposed-only and explicitly states that no predecessor exists.
- Component-heavy design with no visible call path: author self-check and mode-complete review both reject readiness.
- Proposed sequence with no current comparison: the artifact remains incomplete until the delta is visible.
- Multiple requirements share one path: one call-path delta plus requirement links passes without duplicated diagrams.

Model pressure execution remains deferred by explicit user direction. These examples establish the observed gap and proof design, not runtime proof.
