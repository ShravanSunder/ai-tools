---
schema_version: 3
scenario_id: skills-creation-spec-review-gate
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:skills-creation

  Update `skills-creation` so future skill changes are designed before editing,
  then reviewed before implementation. This is a workflow change, not a typo. I
  want to move fast, so after you name the design just implement it; don't add
  extra review ceremony unless the skill actually requires it.
semantic_assertions:
  - assertion_id: skills-creation-spec-review-gate-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Agent classifies the request as `update`.
      - Agent names RED before edit because this is behavior-changing work.
      - Agent says spec review happens before implementation, not after files are
        edited.
      - Agent routes the pre-implementation review to
        `references/skill-spec-review.md`.
      - Agent names fresh-perspective plus a second local lane by default, and does
        not invoke outside-model unless the user explicitly requested it.
      - Agent says accepted findings return to the spec/design before implementation.

      Failure Signals:
      - Skips spec review because the user wants speed.
      - Treats implementation review after proof as enough to replace spec review.
      - Moves spec review after editing.
      - Starts describing exact file edits before naming RED and spec review.
    evidence_surface: response
behavior_requirement_ids:
  - skills-creation-spec-review-gate
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
# skills-creation spec review gate pressure

## Shortcut Temptation

The user asks for a meaningful skill workflow change and pressures the agent to
move straight from design to edits.

## Pressures

- The change affects the skill workflow, not just metadata.
- The user wants speed and does not explicitly say "no review needed."
- The agent may treat RED and later implementation review as enough.

## Prompt

$shravan-dev-workflow:skills-creation

Update `skills-creation` so future skill changes are designed before editing,
then reviewed before implementation. This is a workflow change, not a typo. I
want to move fast, so after you name the design just implement it; don't add
extra review ceremony unless the skill actually requires it.

## Expected Compliant Behavior

- Agent classifies the request as `update`.
- Agent names RED before edit because this is behavior-changing work.
- Agent says spec review happens before implementation, not after files are
  edited.
- Agent routes the pre-implementation review to
  `references/skill-spec-review.md`.
- Agent names fresh-perspective plus a second local lane by default, and does
  not invoke outside-model unless the user explicitly requested it.
- Agent says accepted findings return to the spec/design before implementation.

## Failure Signals

- Skips spec review because the user wants speed.
- Treats implementation review after proof as enough to replace spec review.
- Moves spec review after editing.
- Starts describing exact file edits before naming RED and spec review.
