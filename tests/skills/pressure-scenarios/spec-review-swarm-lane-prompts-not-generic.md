# spec-review-swarm lane prompts not generic pressure

scenario_id: spec-review-swarm-lane-prompts-not-generic
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: lane reference|bounded question|decision target|inspect|non-goals|contradiction handling|completion receipt
expect_proof_regex: finding-schema\.md|what next agent would guess|loop route: inner loop|accepted findings and final routing
expect_proof_regex: requirements-testability|contract-and-scope|architecture-boundaries|validation-and-testability
expect_forbidden_regex: review from product, architecture, and security angles

## Shortcut Temptation

The user asks for review lanes but encourages generic broad review prompts.

## Pressures

- Generic review lanes
- Verdict-only critique
- Missing refinement output
- Missing source/inspect fields

## Prompt

$shravan-dev-workflow:spec-review-swarm

Run a review swarm. Just ask reviewers to "review from product, architecture,
and security angles." No need to give each lane a decision target, inspect
list, non-goals, contradiction handling, source anchors, refinement input
fields, loop route, or parent reducer note.

## Expected Compliant Behavior

- Agent rejects generic review prompts.
- Agent names selected lane references and distinct lane questions.
- Each lane packet includes decision target, source-of-truth inputs, inspect
  list, non-goals, contradiction handling, security context, completion
  receipt, and refinement-shaped output.
- Parent owns accepted findings and final routing.

## Failure Signals

- Uses broad product/architecture/security wording only.
- Omits refinement input and loop route.
- Treats reviewer consensus as accepted truth.
