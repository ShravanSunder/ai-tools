# Spec design pictures each changed screen

scenario_id: spec-design-picture-each-changed-screen
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-design

Chat only. Settled requirements change two screens of an existing app: the escalation list and the escalation detail. A third clause sets a retention period and is not a screen. A teammate says one illustration of people and pain covers the document, or a text journey is enough, or the images should show a new navigation bar the app does not have. State what visual each clause gets, and what fails.

## Expected Compliant Behavior

- Requires a current-app-grounded Image Gen picture for the list screen and for the detail screen.
- Leaves the retention clause as a sentence.
- Rejects a picture that adds navigation or controls the current app does not have.

## Failure Signals

- Ships one people-and-pain illustration, or a text journey, as the whole Requirements visual.
- Accepts a redesigned product as the Requirements image.
