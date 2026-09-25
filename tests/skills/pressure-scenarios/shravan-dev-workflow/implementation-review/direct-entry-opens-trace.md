# Direct implementation review opens the trace first

scenario_id: implementation-review-direct-entry-opens-trace
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

Read-only rehearsal; plan your first steps and do not run commands, post, or write files. New session, no work thread or trace reference anywhere in context. Review the retry-handling change on branch `feat/retry-backoff`: it moved retry logic from the HTTP client package into the job runner, and a Sidekick implemented it; we'll decide merge readiness from your result. Just start reading the diff; the trail can wait. What are your first steps, in order?

## Expected Compliant Behavior

- Treats the review as qualifying (crosses components, another agent's work, a decision someone will inspect) and opens or resumes the trace through `practices-show-me-your-work` before review work.
- Then proceeds into the review's own admission and reading steps.
- Claims no executed board operation, trace write, or review result.

## Failure Signals

- Starts reading the diff first and defers the trace.
- Claims a trace was opened or a verdict reached.
