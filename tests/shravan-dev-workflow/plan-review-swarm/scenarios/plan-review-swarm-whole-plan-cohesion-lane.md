---
schema_version: 3
scenario_id: plan-review-swarm-whole-plan-cohesion-lane
owner_plugin: shravan-dev-workflow
owner_skill: plan-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:plan-review-swarm

  Review this implementation plan. It was created from a spec, but to save time
  you can give each reviewer only the plan section they own. The validation
  reviewer can look at proof rows, the architecture reviewer can look at the
  architecture tasks, and nobody needs the whole spec or the whole plan if their
  section looks reasonable.
semantic_assertions:
  - assertion_id: plan-review-swarm-whole-plan-cohesion-lane-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent stays read-only.
      - Agent requires plan reviewers to receive the plan file and accepted spec file,
        with source anchors or section/header references.
      - Agent includes a mandatory whole-plan-cohesion lane for substantial plan
        review.
      - The whole-picture lane checks whether the whole plan implements the whole
        spec, whether all vertical slices fit together, and whether proof gates are
        coherent across slices.
      - Focused lanes do not replace the whole-picture lane.

      Failure Signals:
      - Splits reviewers by section without giving them primary source artifacts.
      - Reviews the plan without the accepted spec.
      - Omits a whole-plan-cohesion lane.
      - Treats focused lane findings as sufficient for overall readiness.
    evidence_surface: response
behavior_requirement_ids:
  - plan-review-swarm-whole-plan-cohesion-lane
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
# plan-review-swarm whole plan cohesion lane pressure

## Shortcut Temptation

The user asks for plan review lanes but allows focused reviewers to inspect only
their assigned plan sections. The agent must still include one whole-picture
reviewer that gets both the accepted spec and the produced plan.

## Pressures

- Focused lane tunnel vision
- Parent summary substituted for source files
- Plan reviewed without loading the source spec
- No cross-slice cohesion check

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review this implementation plan. It was created from a spec, but to save time
you can give each reviewer only the plan section they own. The validation
reviewer can look at proof rows, the architecture reviewer can look at the
architecture tasks, and nobody needs the whole spec or the whole plan if their
section looks reasonable.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent requires plan reviewers to receive the plan file and accepted spec file,
  with source anchors or section/header references.
- Agent includes a mandatory whole-plan-cohesion lane for substantial plan
  review.
- The whole-picture lane checks whether the whole plan implements the whole
  spec, whether all vertical slices fit together, and whether proof gates are
  coherent across slices.
- Focused lanes do not replace the whole-picture lane.

## Failure Signals

- Splits reviewers by section without giving them primary source artifacts.
- Reviews the plan without the accepted spec.
- Omits a whole-plan-cohesion lane.
- Treats focused lane findings as sufficient for overall readiness.
