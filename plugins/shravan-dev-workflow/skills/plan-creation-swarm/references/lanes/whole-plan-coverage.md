# whole-plan-coverage

Use when substantial planning needs a separate source-coverage pass, and always
for high-risk, multi-slice, or multi-artifact planning alongside the parent
reducer coverage pass.

## Owns

- Full source-to-plan coverage check.
- Dropped or invented obligations.
- Missing representation of requirements, boundaries, non-goals, global
  constraints, proof expectations, and open planning inputs.

## Leaves To Parent

- Final accepted plan edits.
- Whether coverage gaps route to spec creation, plan creation, or human
  decision.
- Final readiness claim.

## Method

1. Load the accepted source artifact directly.
2. Load the working plan artifact, slice map, or parent draft when one exists.
3. Trace source items to plan slices, matrix rows, command/manual proof rows,
   checkpoints, spec-return items, or human-decision items.
4. Identify dropped, invented, contradicted, or unproven obligations.
5. Return a compact coverage report and requested parent actions.

## Return Focus

- `primary_sources_loaded`
- working plan artifact checked
- source items covered
- source items missing, invented, deferred, or routed back
- coverage_scope
- `cannot_verify_from_focused_packet`
