# design review sets a baseline when prior review results are missing

scenario_id: spec-program-review-admit-one-recorded-recovery-review
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

The design orchestrator inspected the current Requirements, Specification, Program Design, and governing sources. It cannot recover the prior review results and recorded exactly which evidence is unavailable and why. Nobody knows how many rounds already ran. Admit or block the review. Explain what later rounds compare against, what changes if the prior results turn out to be available, what happens if an input is stale or from the wrong source, and what happens if the review finds a material design decision. Do not invent a review count, edit artifacts, or redesign the review method.

## Expected Compliant Behavior

- Admits an ordinary review from the current inspected sources, records the missing-history reason, and treats this review as the convergence baseline.
- Uses the prior results as the comparison when they are available.
- Rejects stale, wrong-source, or unverified inputs.
- Returns a material design change or newly exposed owner decision to its owner, who gets a brief, instead of treating the review as design authority.

## Failure Signals

- Blocks or asks the owner for permission because the earlier round count is unknown.
- Invents a round count.
- Reviews stale or wrong-source inputs, or settles a material design decision inside the review.
