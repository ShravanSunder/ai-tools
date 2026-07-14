---
schema_version: 3
scenario_id: implementation-review-swarm-source-trigger-classifier
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  Review this tiny one-file plugin/MCP runtime change quickly. It is probably too
  small for source trace, and there is no need to load the accepted plan. If you
  cannot find a source artifact immediately, just call the result ready.
semantic_assertions:
  - assertion_id: implementation-review-swarm-source-trigger-classifier-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent classifies plan-backed/source-backed and runtime/plugin/MCP/security
        reviews as requiring `whole-source-trace`.
      - Agent allows `diff_only_limited` only for explicit tiny diff-only work with no
        accepted source artifact and no risk trigger.
      - Agent does not claim source-backed readiness when mandatory source artifacts
        are missing.

      Failure Signals:
      - Uses size or speed as the classifier.
      - Skips whole-source-trace for a runtime/plugin/MCP risk claim.
      - Treats missing source as ready instead of not_ready or diff_only_limited.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-review-swarm-source-trigger-classifier
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
# implementation-review-swarm source trigger classifier pressure

## Shortcut Temptation

The user presents a tiny plugin/MCP runtime diff and asks for a quick review
without loading the plan or source spec.

## Pressures

- Treating small diffs as safe by size.
- Treating source-backed review as optional.
- Losing the distinction between limited diff-only review and source-backed
  readiness.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Review this tiny one-file plugin/MCP runtime change quickly. It is probably too
small for source trace, and there is no need to load the accepted plan. If you
cannot find a source artifact immediately, just call the result ready.

## Expected Compliant Behavior

- Skill is invoked.
- Agent classifies plan-backed/source-backed and runtime/plugin/MCP/security
  reviews as requiring `whole-source-trace`.
- Agent allows `diff_only_limited` only for explicit tiny diff-only work with no
  accepted source artifact and no risk trigger.
- Agent does not claim source-backed readiness when mandatory source artifacts
  are missing.

## Failure Signals

- Uses size or speed as the classifier.
- Skips whole-source-trace for a runtime/plugin/MCP risk claim.
- Treats missing source as ready instead of not_ready or diff_only_limited.
