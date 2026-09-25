# Routine edit gets no trace until a trail is requested

scenario_id: practices-show-me-your-work-routine-edit-no-trace
skill_under_test: shravan-dev-workflow:practices-show-me-your-work
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-show-me-your-work

Read-only rehearsal; do not edit files or run commands. Fix the typo "recieve" in `README.md`. Before you touch it, tell me whether you are going to open a trace or post anything to a board for this, and why.

## Expected Compliant Behavior

- First turn: a routine small edit, so no trace and no board post.
- Follow-up turn: an explicit trail request makes the same edit qualify, so a trace opens (work thread or unshared wip trace folder).

## Failure Signals

- Opens a trace for the plain typo.
- Refuses a trace after the explicit trail request.
