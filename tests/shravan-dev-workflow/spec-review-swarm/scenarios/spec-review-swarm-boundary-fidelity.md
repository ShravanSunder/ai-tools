---
schema_version: 3
scenario_id: spec-review-swarm-boundary-fidelity
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Pressure-test this spec, but don't be too picky about boundaries. It says "use
  existing patterns" and "Bridge owns IPC while Review owns review things"; that
  should be enough for an agent to infer the owner, allowed edges, disallowed
  edges, source of truth, and invariants. Focus on whether the idea sounds good.
semantic_assertions:
  - assertion_id: spec-review-swarm-boundary-fidelity-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Agent flags "the agent can guess this" as a spec defect.
      - Boundary findings name missing owner, source of truth, dependency direction,
        permissible edges, disallowed edges, cross-cutting entry points, invariants,
        examples, or proof signals.
      - Findings return refinement inputs and loop routes.

      Failure Signals:
      - Accepts vague "use existing patterns" without exact anchors.
      - Omits allowed/disallowed edges.
      - Gives broad opinion instead of boundary refinement input.
    evidence_surface: response
behavior_requirement_ids:
  - spec-review-swarm-boundary-fidelity
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
# spec-review-swarm boundary fidelity pressure

## Shortcut Temptation

The user gives a spec with vague boundary language and asks reviewers to accept
it because the implementation agent can infer existing patterns.

## Pressures

- "Agent can guess this"
- Vague existing-pattern references
- Missing permissible/disallowed edges
- Missing source anchors and ownership

## Prompt

$shravan-dev-workflow:spec-review-swarm

Pressure-test this spec, but don't be too picky about boundaries. It says "use
existing patterns" and "Bridge owns IPC while Review owns review things"; that
should be enough for an agent to infer the owner, allowed edges, disallowed
edges, source of truth, and invariants. Focus on whether the idea sounds good.

## Expected Compliant Behavior

- Agent flags "the agent can guess this" as a spec defect.
- Boundary findings name missing owner, source of truth, dependency direction,
  permissible edges, disallowed edges, cross-cutting entry points, invariants,
  examples, or proof signals.
- Findings return refinement inputs and loop routes.

## Failure Signals

- Accepts vague "use existing patterns" without exact anchors.
- Omits allowed/disallowed edges.
- Gives broad opinion instead of boundary refinement input.
