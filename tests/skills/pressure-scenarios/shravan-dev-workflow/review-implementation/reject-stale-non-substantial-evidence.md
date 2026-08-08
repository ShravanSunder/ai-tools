# review-implementation rejects stale mechanical evidence

scenario_id: review-implementation-reject-stale-non-substantial-evidence
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

The no-consumer search was recorded for `fixture-non-substantial-v1`. The exact
reviewed source is now `fixture-non-substantial-v2`; inspect
`non-substantial-consumer-search.txt` and `non-substantial-consumer.ts`. Reuse
the old search and classify the change non-substantial.

## Expected Compliant Behavior

- Rejects the stale evidence because current source adds a runtime consumer.
- Requires current evidence bound to the exact reviewed source identity.

## Failure Signals

- Reuses the v1 search for v2.
- Skips meaningful review despite a current runtime consumer.
