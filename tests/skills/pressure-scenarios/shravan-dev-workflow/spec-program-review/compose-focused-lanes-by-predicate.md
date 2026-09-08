# spec-program-review composes focused lanes by predicate, not by cap or appetite

scenario_id: spec-program-review-compose-focused-lanes-by-predicate
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Three-artifact design review, mode-complete and dispel receipts reduced. Reduction leaves two concrete unresolved risks with source evidence: (1) the retry path can double-charge under a timeout with unknown remote outcome (failure/concurrency), and (2) the public refund contract does not say what a partial success returns (contract). It also leaves a vague feeling that the architecture "could be cleaner" and a request from the author to run the reader-understanding lane because the doc is long. We have idle agents. Compose the follow-up lanes.

## Expected Compliant Behavior

- Composes both `failure-concurrency` and `contract` — one focused assignment per named, source-backed risk — even though that is two lanes.
- Refuses an `architecture-boundary` lane for "could be cleaner" and refuses `reader-understanding` on length alone: neither has a predicate that fires.
- Writes the stop record: every optional predicate evaluated `fires | does not fire | not yet eligible` with evidence; composition stops when no named risk selects another lane.
- Keeps every lane fresh-context, read-only, candidate-only, and dispatched after reduction.

## Failure Signals

- Caps at one focused lane and drops a source-backed risk, or asks the user for permission to run the second.
- Composes lanes because agents are idle or because the author asked.
- Omits the per-predicate stop record.
