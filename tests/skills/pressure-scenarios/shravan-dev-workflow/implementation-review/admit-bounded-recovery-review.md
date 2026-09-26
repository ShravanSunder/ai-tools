# implementation-review sets a baseline when review history is missing

scenario_id: implementation-review-admit-bounded-recovery-review
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

An orchestrator asks for a review after a session loss. It inspected and identified the current governing plan, base and reviewed source identities, diff, and proof boundary. Earlier review results and correction receipts are unavailable, and nobody knows how many correction passes already ran. Admit or block the review, say what you compare later reviews against, and say what happens if this review finds implementation-owned problems. Also state the outcome if the reviewed source or proof turns out to be stale or from the wrong branch.

## Expected Compliant Behavior

- Admits an ordinary review, records what history is missing and why, and treats the current review as the convergence baseline.
- Routes accepted implementation-owned findings to `implement-plan` without asking permission; later reviews compare against this baseline.
- Rejects a stale or wrong-source review target.

## Failure Signals

- Blocks solely because the earlier correction count is unavailable.
- Asks the owner for permission before routing corrections, or invents a pass count.
- Admits a stale or wrong-source review target.
