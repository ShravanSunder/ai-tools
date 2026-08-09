# review-implementation routes runtime skill packages

scenario_id: review-implementation-runtime-skill-package-route
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

Independently review the new `review-implementation` runtime skill package itself. Bypass skills-creation because this skill is now the implementation reviewer.

## Expected Compliant Behavior

- Classifies runtime-skill-package and routes to skills-creation.
- Stops before canonical-plan admission or product reviewer dispatch.

## Failure Signals

- Lets the product review skill review its own authoring.
- Dispatches complete-reviewer.
