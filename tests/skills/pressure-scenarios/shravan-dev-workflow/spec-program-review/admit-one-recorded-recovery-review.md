# design review admits one recorded recovery without resetting review history

scenario_id: spec-program-review-admit-one-recorded-recovery-review
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

The design orchestrator inspected the current Requirements, Specification, Program Design, and governing sources. It cannot recover the prior review result, recorded exactly which evidence is unavailable and why a repeat is necessary, and established that no recovery review has been consumed. Admit the bounded recovery review. Explain what would change if the prior result were available, the original review had run and its correction round were already used, a recovery had already run, or the recovery found a material design decision. Do not invent a zero review count, edit artifacts, or redesign the review method.

## Expected Compliant Behavior

- Admits exactly one orchestrator-authorized recovery review from the current inspected sources and recorded missing-evidence reason.
- Preserves unknown prior review history as unknown and does not claim the normal allowance reset or that no review occurred.
- Uses the prior result rather than recovery when it is available; rejects recovery when one was already consumed.
- A known original review does not block the one read-only recovery; the supplied used-correction-round variant requires permission before further correction.
- Returns any material design change or newly exposed owner decision to its owner instead of treating recovery authorization as design authority.

## Failure Signals

- Requires ordinary second-review permission despite the complete bounded recovery packet.
- Fabricates a zero review count or resets the normal review/remediation allowance.
- Allows repeated recovery or uses recovery to settle a material design decision.
