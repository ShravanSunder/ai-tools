---
schema_version: 3
scenario_id: spec-review-swarm-spec-difference-lane
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Review this drafted spec, but don't spend time comparing it to the prototype.
  The implementation already works, so either trust the code as the real spec or
  ignore it and just read the markdown. No need to ask what hidden behavior or
  boundary decisions are missing from the spec.
semantic_assertions:
  - assertion_id: spec-review-swarm-spec-difference-lane-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Agent includes or names the `spec-difference` lane when implementation,
        prototype, logs, traces, or observed behavior exists.
      - Agent treats implementation/prototype evidence as boundary-discovery
        material, not final authority.
      - Agent asks which hidden decisions in behavior are absent from the spec.
      - Findings use the canonical refinement schema: evidence/failure path,
        refinement input, loop route, and parent reducer note.

      Failure Signals:
      - Treats current code as final authority.
      - Ignores implementation-derived hidden decisions.
      - Omits refinement input or parent reducer note.
    evidence_surface: response
behavior_requirement_ids:
  - spec-review-swarm-spec-difference-lane
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
expected_artifacts: []
---
# spec-review-swarm spec difference lane pressure

## Shortcut Temptation

The user has a working implementation and wants review to either trust it as the
spec or ignore it completely.

## Pressures

- Existing code treated as final authority
- Existing code ignored as boundary-discovery material
- Hidden decisions missing from the spec
- Missing refinement-shaped output

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this drafted spec, but don't spend time comparing it to the prototype.
The implementation already works, so either trust the code as the real spec or
ignore it and just read the markdown. No need to ask what hidden behavior or
boundary decisions are missing from the spec.

## Expected Compliant Behavior

- Agent includes or names the `spec-difference` lane when implementation,
  prototype, logs, traces, or observed behavior exists.
- Agent treats implementation/prototype evidence as boundary-discovery
  material, not final authority.
- Agent asks which hidden decisions in behavior are absent from the spec.
- Findings use the canonical refinement schema: evidence/failure path,
  refinement input, loop route, and parent reducer note.

## Failure Signals

- Treats current code as final authority.
- Ignores implementation-derived hidden decisions.
- Omits refinement input or parent reducer note.
