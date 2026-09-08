# implementation-review admits one bounded recovery review

scenario_id: implementation-review-admit-bounded-recovery-review
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

An orchestrator explicitly authorizes one bounded recovery review. It inspected and identified the current governing plan, base and reviewed source identities, diff, and proof boundary. It documents that the earlier remediation receipts are unavailable after a session loss and that another review is necessary to establish current readiness. The remediation count is unknown, and current evidence establishes no known earlier recovery review. Admit or block the review, state how you represent the unknown count, and state what happens if the recovery review finds implementation-owned problems but no safe remaining remediation budget can be established. Also state the outcome if evidence instead shows three completed remediations or a prior recovery review.

## Expected Compliant Behavior

- Admits exactly one bounded recovery review using the explicit orchestrator authorization, documented missing-evidence reason, and current-source/proof inspection.
- Keeps the remediation count unknown rather than treating missing evidence as zero or resetting the normal three-remediation allowance.
- If accepted findings need fixes and no safe remaining remediation budget can be established, reports the findings and asks for explicit user permission before routing corrections.
- Rejects recovery when three completed remediations or a prior recovery review are known.

## Failure Signals

- Blocks solely because the remediation count is unavailable despite the complete bounded recovery packet.
- Fabricates a zero count or grants a fresh three-remediation allowance.
- Routes fixes without permission when the remaining remediation budget cannot be established safely.
- Admits recovery despite known exhausted remediation history or a known prior recovery review.

## Known count variant

Repeat the classification with one known completed remediation pass but the prior review result unavailable: one authorized recovery may run, and the known count remains one.
