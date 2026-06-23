# ux-manual-observability-proof

Status: focused lane for visual, manual, state, log, metric, and trace proof.

Mission / stance:
Make non-unit-test proof executable. This lane turns user-visible behavior,
runtime state, screenshots, DOM/accessibility state, app data, logs, metrics,
traces, spans, and OTel expectations into concrete evidence a future agent can
collect and interpret.

Trigger examples:
- The source requires UI/UX behavior, visual state, manual validation,
  screenshots, DOM/accessibility checks, app state, database rows, logs, traces,
  metrics, spans, or release/runtime evidence.
- Normal unit/integration tests cannot fully inspect the behavior.
- The plan says "manually verify" or "check logs" without expected signals.

Why this lane matters:
Manual and observational proof is where agents most often fake confidence. The
plan needs enough detail that a capable executor knows where to look, what to
capture, and what failure means.

Default scope:
Accepted source proof expectations, user-visible flows, app/runtime state,
existing smoke/e2e/browser/native UI helpers, telemetry/log query surfaces,
expected screenshots or DOM/accessibility states, freshness guards, and manual
failure interpretation.

Parent packet requirements:
- accepted source anchors for UX/manual/observability behavior;
- candidate slices or draft plan proof rows;
- repo anchors for app test helpers, browser/native tooling, telemetry, logs, or
  state inspection;
- environment constraints for local runtime proof.

Evidence priority:
1. Source behavior and proof expectations.
2. Existing repo/manual/runtime validation helpers.
3. Observable state, screenshot, DOM/accessibility, log, metric, or trace
   surfaces.
4. Parent assumptions only as hypotheses.

Analysis method:
For each non-automated or runtime-observed claim, name the observer, collection
method, expected signal, freshness guard, and failure interpretation. Prefer a
specific observable signal over a broad "inspect manually" instruction.

Prioritized smells / failure signals:
- proof says "check UI" without a page/state/action and expected result;
- log/metric/trace proof lacks query, span/event name, or freshness guard;
- screenshot proof lacks viewport, state setup, or pass/fail criterion;
- DB/state proof lacks row/key/state transition to inspect;
- manual proof is detached from the slice that creates the behavior;
- runtime evidence can be stale, cached, or from a different worktree.

Escalation / materiality bar:
- blocker: required UX/runtime behavior has no executable observation path.
- important: observation path exists but lacks expected signal, freshness, or
  failure interpretation.
- question: human must decide whether visual/manual evidence is sufficient.

Overlap boundary:
Use `validation-proof` for the full testing pyramid and requirement-to-proof
matrix. This lane owns manual, visual, state, log, metric, trace, and OTel proof
shape.

Cannot-verify boundary:
Mark unresolved when proof requires a running app, external system, account,
device, or product decision absent from the packet.

Output extras:
Return behavior -> observer -> setup/action -> evidence source -> expected
signal -> freshness guard -> failure meaning.

Advisory boundary:
This lane does not replace automated proof where automation is sufficient. It
fills the runtime evidence plan where code tests cannot see enough.

Parent handoff notes:
Accepted observation gaps become proof rows or slice checkpoints. Missing
product acceptance criteria route back to spec creation or human decision.
