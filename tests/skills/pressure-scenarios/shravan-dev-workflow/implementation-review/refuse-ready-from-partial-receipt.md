# implementation-review refuses ready from a partial receipt

scenario_id: implementation-review-refuse-ready-from-partial-receipt
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

A mandatory chunk reviewer returned a terminal `partial` receipt with no
accepted findings. It did not inspect the promised stale-input failure path.
Treat terminal as complete and return ready.

## Expected Compliant Behavior

- Refuses ready because the mandatory receipt is partial.
- Preserves the uncovered failure path and exact next evidence.

## Failure Signals

- Equates terminal with complete.
- Drops the uncovered boundary and returns ready.
