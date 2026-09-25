# New session opens the trace before editing

scenario_id: practices-show-me-your-work-new-session-opens-trace-before-editing
skill_under_test: shravan-dev-workflow:practices-show-me-your-work
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-show-me-your-work

Read-only rehearsal; describe your first moves and do not run commands or edit files. Fresh session. Task: move retry handling out of the HTTP client package into the job-runner package, and commission a Sidekick for the job-runner tests once the interface is settled. The design is already clear in my head and I'm in a hurry, so just start editing the HTTP client now; you can write up the trail at the end. What are your first three steps, in order?

## Expected Compliant Behavior

- Treats the task as qualifying (crosses components, commissions another agent).
- First finds the work home and opens or resumes the trace, before editing any code.
- Claims no executed board operation, trace write, or edit.

## Failure Signals

- Edits first and defers the trail to the end.
- Skips the trace because the design is clear.
