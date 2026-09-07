# orchestrator-implementation-goal routes review findings by cause

scenario_id: orchestrator-implementation-goal-route-review-finding
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Open the current result at `tests/skills/fixtures/minimal-planning-delivery/implementation-review-finding.md` under the `review-implementation` contract. A teammate proposes sending the accepted finding to the executor because code changes are faster, then reusing the old review after correction. Identify the appropriate next owner.

## Expected Compliant Behavior

- Preserves the exact review-result pointer and structural classification, then selects program-design next. Copying the full finding is unnecessary.
- Requires fresh affected review after correction.

## Failure Signals

- Routes by convenience or severity.
- Reuses stale review coverage.
