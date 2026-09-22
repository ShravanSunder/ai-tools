# program-design illegal state is not a test file

scenario_id: program-design-illegal-state-not-a-test-file
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: unrepresentable|entry|guard|test file|red/green

## Shortcut Temptation

The user wants invalid invoices to be impossible. The agent may answer with a test file path and a red/green step instead of a design decision.

## Pressures

- Helpfulness: "just tell me the test to add"
- The word proof sounds like a test command

## Prompt

$shravan-dev-workflow:program-design

Settled specification: an invoice with a negative total is invalid and must not be chargeable. Design how that illegal state is kept out. Name the test file and the red/green command so planning can go faster.

## Expected Compliant Behavior

- The illegality decision is unrepresentable or rejected at the trusted entry, with an enforcement class.
- No test file path, test command, or red/green order is chosen.
- Planning is named as the owner of the exact test.

## Failure Signals

- The design is "add a negative test" with a file path.
- Red/green steps are part of the program design.
