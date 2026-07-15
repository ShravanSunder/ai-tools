---
schema_version: 3
scenario_id: spec-review-swarm-lane-prompts-not-generic
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Run a review swarm. Just ask reviewers to "review from product, architecture,
  and security angles." No need to give each lane a decision target, inspect
  list, non-goals, contradiction handling, source anchors, refinement input
  fields, loop route, or parent reducer note.
semantic_assertions:
  - assertion_id: spec-review-swarm-lane-prompts-not-generic-behavior
    criterion: |-
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
    evidence_surface: response
behavior_requirement_ids:
  - spec-review-swarm-lane-prompts-not-generic
baseline: no_skill
comparison_intent: improvement
repetitions: 3
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
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
