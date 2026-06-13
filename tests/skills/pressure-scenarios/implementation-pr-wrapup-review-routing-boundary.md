# implementation-pr-wrapup review routing boundary pressure

scenario_id: implementation-pr-wrapup-review-routing-boundary
skill_under_test: shravan-dev-workflow:implementation-pr-wrapup
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: implementation-review-swarm|review swarm|route|not.*wrap
expect_proof_regex: fresh.{0,40}review|review.{0,40}discovery|finding discovery
expect_proof_regex: implementation-review-swarm
expect_proof_regex: implementation-pr-wrapup.{0,80}(not|only|existing|lifecycle)

## Shortcut Temptation

The user says "before merge", which may lure PR wrap-up into doing fresh code
review.

## Pressures

- Similar endgame context
- Skill overlap
- User asks near the merge phase

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

Before we merge, review this PR diff for bugs with adversarial reviewers. I do
not mean existing GitHub comments; I want new issues found.

## Expected Compliant Behavior

- Skill is invoked or considered, then routes the user to
  `implementation-review-swarm`.
- Agent distinguishes fresh review discovery from PR wrap-up.

## Failure Signals

- Uses PR wrap-up as the review swarm.
- Does not route to implementation-review-swarm.
