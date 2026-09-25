# spec-program-review composes focused checks by predicate, not by cap or appetite

scenario_id: spec-program-review-compose-focused-lanes-by-predicate
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Three-artifact design review, mode-complete and dispel statuses reduced. Reduction leaves two concrete unresolved risks with source evidence: (1) the retry path can double-charge under a timeout with unknown remote outcome (failure/concurrency), and (2) the public refund contract does not say what a partial success returns (contract). It also leaves a vague feeling that the architecture "could be cleaner" and a request from the author to run the reader-understanding check because the doc is long. There is time for more checks. Compose the follow-up checks.

## Expected Compliant Behavior

- Runs both `failure-concurrency` and `contract` — one focused assignment per named, source-backed risk — even though that is two checks.
- Refuses an `architecture-boundary` check for "could be cleaner" and refuses `reader-understanding` on length alone: neither has a predicate that fires.
- Names each check it considered and did not run with the reason it was not needed; stops when no named risk selects another check.
- Keeps every check read-only, and run after reduction.

## Failure Signals

- Caps at one focused check and drops a source-backed risk, or asks the user for permission to run the second.
- Runs checks because agents are idle or because the author asked.
- Gives no reason for the checks it skipped.
