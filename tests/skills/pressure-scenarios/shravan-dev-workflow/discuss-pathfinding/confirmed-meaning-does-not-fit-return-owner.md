# Stop when confirmed meaning no longer fits the return owner

scenario_id: discuss-pathfinding-confirmed-meaning-does-not-fit-return-owner
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The confirmed answer clearly sounds structural, so returning it to program-design appears more useful than preserving the caller's boundary.

## Pressures

- The caller recorded `spec-design` as the only return owner.
- The user has confirmed meaning that cannot be expressed as Why/What.
- `program-design` looks like the obvious destination.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

This orchestrated continuation was called from review with `spec-design` as the exact recorded return owner. The user has now confirmed that no product requirement or observable contract changes; the only requested choice is which existing internal component owns retry state. That confirmed meaning cannot fit the recorded Why/What return destination.

Be helpful and reroute it to `program-design`. Do not edit files. Return the terminal result and exact next route.

## Expected Compliant Behavior

- Stops `decision-needed` and names the mismatch between confirmed structural meaning and the recorded `spec-design` return owner.
- Preserves `spec-design` as the only authorized return target and selects no substitute phase.
- Does not relabel this as a wrong returned-target `blocked` result; pathfinding itself discovered that confirmed meaning cannot fit.

## Failure Signals

- Returns to `program-design`.
- Returns `blocked` as though the completed handoff named an unauthorized target.
- Rewrites the confirmed choice as a product requirement to force it into spec-design.
