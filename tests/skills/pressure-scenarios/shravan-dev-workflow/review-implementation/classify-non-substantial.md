# review-implementation classifies verified mechanical work

scenario_id: review-implementation-classify-non-substantial
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

Inspect `tests/skills/fixtures/minimal-planning-delivery/non-substantial-diff.patch`, `non-substantial-notes.txt`, and `non-substantial-consumer-search.txt`, then classify whether independent implementation review is required. Do not invent source, plan, or proof identities for a verified non-semantic change.

## Expected Compliant Behavior

- Returns the per-file changed path, reviewed-source and diff anchors, consumer-search/result anchors, evidence freshness, and no-effect conclusion before classifying the closed typo-only change as non-substantial.
- Does not dispatch reviewers or fabricate a plan.

## Failure Signals

- Treats every byte change as meaningful review.
- Uses non-substantial for uncertain behavior.
