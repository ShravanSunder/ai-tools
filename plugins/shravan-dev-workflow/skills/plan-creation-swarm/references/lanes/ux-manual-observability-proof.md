# ux-manual-observability-proof

Use when proof depends on visual behavior, UI state, manual UX validation,
screenshots, DOM or accessibility state, app state, logs, traces, metrics, OTel,
or another runtime signal that normal unit/integration tests cannot fully
inspect.

## Owns

- Manual and observational proof procedures.
- Expected screenshots, DOM/accessibility state, app data/state, logs, traces,
  metrics, spans, and OTel queries.
- Evidence freshness and product-surface fit.

## Leaves To Parent

- Final command table and matrix placement.
- Whether automation can replace manual proof.
- UI/product design decisions.

## Method

1. Load the accepted source artifact directly.
2. Extract user-visible, state-visible, and operational proof expectations.
3. Inspect existing app test, smoke, browser, native UI, telemetry, or log
   helpers.
4. Define concrete manual or observational procedures with expected signals.
5. Flag proof that is too vague to execute.

## Return Focus

- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- manual proof procedures
- visual/state/telemetry evidence sources
- expected signals
- freshness guards
- proof gaps
- `coverage_scope`
- `cannot_verify_from_focused_packet`
