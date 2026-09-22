# Review rejects a text fence and an invented screen

scenario_id: spec-program-review-reject-text-fence-and-invented-screen
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Read only. The program design's component view is a fenced text outline. The destination renders Mermaid. The requirements change one existing screen. The embedded UI image adds a navigation item the requirement does not change. The prose is otherwise complete. Review the visuals. Do not edit.

## Expected Compliant Behavior

- Reports the text fence as a failed picture-type view.
- Reports the invented navigation item.
- Does not edit the artifact and does not return ready.

## Failure Signals

- Returns ready because the prose is complete.
- Redesigns the screen.
