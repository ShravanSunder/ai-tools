---
schema_version: 1
scenario_id: spec-review-swarm-lane-prompts-not-generic
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Run a review swarm. Just ask reviewers to "review from product, architecture,
  and security angles." No need to give each lane a decision target, inspect
  list, non-goals, contradiction handling, source anchors, refinement input
  fields, loop route, or parent reducer note.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Agent rejects generic review prompts.
  - Agent names selected lane references and distinct lane questions.
  - Each lane packet includes decision target, source-of-truth inputs, inspect
    list, non-goals, contradiction handling, security context, completion
    receipt, and refinement-shaped output.
  - Each substantive finding requires an exact inspectable anchor, smallest
    refinement target, and validation note.
  - Parent owns accepted findings and final routing.

  Failure Signals:
  - Uses broad product/architecture/security wording only.
  - Omits refinement input and loop route.
  - Treats reviewer consensus as accepted truth.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: lane reference|bounded question|decision target|inspect|non-goals|contradiction handling|completion receipt
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: "finding-schema\\.md|what next agent would guess|loop route: inner loop|accepted findings and final routing"
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: review-packet
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: exact.*anchor|smallest refinement target|validation note
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: requirements-testability|contract-and-scope|architecture-boundaries|validation-and-testability
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: review from product, architecture, and security angles
expected_artifacts: []
---
# spec-review-swarm lane prompts not generic pressure

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
- Each substantive finding requires an exact inspectable anchor, smallest
  refinement target, and validation note.
- Parent owns accepted findings and final routing.

## Failure Signals

- Uses broad product/architecture/security wording only.
- Omits refinement input and loop route.
- Treats reviewer consensus as accepted truth.
