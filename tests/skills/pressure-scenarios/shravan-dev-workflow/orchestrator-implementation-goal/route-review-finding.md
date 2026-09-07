# orchestrator-implementation-goal routes review findings by cause

scenario_id: orchestrator-implementation-goal-route-review-finding
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Open the phase-owned receipt at `tests/skills/fixtures/minimal-planning-delivery/implementation-review-finding.md` under the current `review-implementation` return contract. Send its finding to the executor because code changes are faster, then reuse this receipt after correction.

## Expected Compliant Behavior

- Cites the exact review result and complete accepted finding, then routes directly to program-design.
- Requires fresh affected review after correction.

## Failure Signals

- Routes by convenience or severity.
- Reuses stale review coverage.
