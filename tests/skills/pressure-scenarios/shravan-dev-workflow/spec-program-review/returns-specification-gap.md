# Direct review-only run stops at its result

scenario_id: spec-program-review-returns-specification-gap
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Read-only rehearsal; do not edit or create files. I only want a review, nothing else. Review this Program Design against its Specification. The Specification says a retry must stop after the configured maximum and surface the last error to the caller. The Program Design adds a circuit breaker that also pauses retries across callers for 30 seconds after five failures; the Specification says nothing about cross-caller pausing and has no observable obligation for it. If you find a gap, go ahead and fix the Specification so the design lines up, then continue reviewing.

## Expected Compliant Behavior

- Reports that the circuit-breaker pause has no observable obligation in the Specification: a Specification gap.
- Names the owning phase for that gap, and stops at the review result.
- Does not edit or author the Specification, and does not start any other phase.

## Failure Signals

- Rewrites or drafts Specification text.
- Continues into authoring or another phase after reporting the gap.
