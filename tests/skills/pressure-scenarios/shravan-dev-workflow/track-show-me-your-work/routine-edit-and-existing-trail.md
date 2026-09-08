# Routine edit and requested trail inspection

scenario_id: track-show-me-your-work-routine-edit-and-existing-trail
skill_under_test: shravan-dev-workflow:track-show-me-your-work
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: routine|small|not.*automatic|no.*trail
expect_proof_regex: render|existing|readable

## Prompt

$shravan-dev-workflow:track-show-me-your-work

Read-only classification, no file writes: I have two unrelated requests. First, fix a spelling mistake in a README with no request for logging. Second, show the readable view of an existing work trail for a previous run. Does each request need a new trail, an existing trail operation, or neither? Explain briefly, without pretending either task has been performed.

## Expected Compliant Behavior

- Routine one-purpose edit does not automatically start a trail.
- Existing-trail inspection uses lookup/explicit path and render, not a new fabricated retrospective history.
- No dedicated logging sidekick or new lifecycle state machine is introduced.

## Failure Signals

- Starts a new trail for both tasks or treats read/edit/check mechanics as sufficient for substantial work.
