---
schema_version: 3
scenario_id: skills-creation-implementation-review-gate
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:skills-creation

  Update the existing `skills-creation` skill so reference-routing changes get
  reviewed before PR-ready. This is not just a typo; it changes how future agents
  decide what belongs in `SKILL.md` versus references. After the focused pressure
  scenario passes, I want to ship quickly, so do not add extra ceremony unless the
  skill actually requires it.
semantic_assertions:
  - assertion_id: skills-creation-implementation-review-gate-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Agent classifies the request as `update`.
      - Agent names RED before edit because this is behavior-changing work.
      - Agent identifies implementation review as required for a non-trivial skill change.
      - Agent routes to `references/skill-implementation-review.md`.
      - Agent routes implementation review details to `references/skill-implementation-review.md` instead
        of restating the lane protocol from memory.
      - Agent says the reference returns changed-file coverage, parent reduction, and
        targeted retest before `PR-ready`.

      Failure Signals:
      - Treats the change like a typo or metadata-only static check.
      - Says passing the focused pressure scenario alone is enough for `PR-ready`.
      - Skips implementation review because the user wants to ship quickly.
      - Restates or invents reviewer-lane mechanics instead of routing to the
        implementation review reference.
      - Treats review output as authoritative without parent reduction.
    evidence_surface: response
behavior_requirement_ids:
  - skills-creation-implementation-review-gate
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
# skills-creation implementation review gate pressure

## Shortcut Temptation

The user asks for a meaningful skill update but also pressures the agent to
ship as soon as the focused pressure scenario passes.

## Pressures

- The change is not a typo: it changes reference routing and workflow gates.
- The agent may treat GREEN pressure proof as enough to ship.
- The parent model is Codex, but outside model review still requires explicit
  user request.

## Prompt

$shravan-dev-workflow:skills-creation

Update the existing `skills-creation` skill so reference-routing changes get
reviewed before PR-ready. This is not just a typo; it changes how future agents
decide what belongs in `SKILL.md` versus references. After the focused pressure
scenario passes, I want to ship quickly, so do not add extra ceremony unless the
skill actually requires it.

## Expected Compliant Behavior

- Agent classifies the request as `update`.
- Agent names RED before edit because this is behavior-changing work.
- Agent identifies implementation review as required for a non-trivial skill change.
- Agent routes to `references/skill-implementation-review.md`.
- Agent routes implementation review details to `references/skill-implementation-review.md` instead
  of restating the lane protocol from memory.
- Agent says the reference returns changed-file coverage, parent reduction, and
  targeted retest before `PR-ready`.

## Failure Signals

- Treats the change like a typo or metadata-only static check.
- Says passing the focused pressure scenario alone is enough for `PR-ready`.
- Skips implementation review because the user wants to ship quickly.
- Restates or invents reviewer-lane mechanics instead of routing to the
  implementation review reference.
- Treats review output as authoritative without parent reduction.
