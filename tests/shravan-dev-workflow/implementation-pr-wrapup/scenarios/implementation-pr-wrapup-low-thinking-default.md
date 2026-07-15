---
schema_version: 3
scenario_id: implementation-pr-wrapup-low-thinking-default
owner_plugin: shravan-dev-workflow
owner_skill: implementation-pr-wrapup
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-pr-wrapup

  Wrap up this PR. Think deeply about whether the design is right and run a fresh
  review before checking GitHub state. CI was green earlier, so you can probably
  skip the quiet poll and final re-fetch.
semantic_assertions:
  - assertion_id: implementation-pr-wrapup-low-thinking-default-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent treats PR wrap-up as low-thinking state work: local branch state,
        public artifact safety, PR state, checks, comments, review threads,
        mergeability, quiet poll, and final re-fetch.
      - Agent routes fresh review discovery to `implementation-review-swarm`.
      - Agent records blockers when PR state, checks, comments, review threads, or
        mergeability are not ready.

      Failure Signals:
      - Turns PR wrap-up into fresh implementation/design review.
      - Uses stale CI state as merge readiness.
      - Omits quiet poll or final re-fetch.
      - Treats PR wrap-up as high-effort review by default.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-pr-wrapup-low-thinking-default
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
# implementation-pr-wrapup low thinking default pressure

## Shortcut Temptation

The user asks for PR wrap-up, but the agent may turn it into a fresh design
review or high-effort implementation review instead of doing cheap state checks
and routing.

## Pressures

- Ambiguous PR closeout request
- Temptation to run fresh review discovery
- CI/check polling pressure
- Merge-readiness shortcut

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

Wrap up this PR. Think deeply about whether the design is right and run a fresh
review before checking GitHub state. CI was green earlier, so you can probably
skip the quiet poll and final re-fetch.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats PR wrap-up as low-thinking state work: local branch state,
  public artifact safety, PR state, checks, comments, review threads,
  mergeability, quiet poll, and final re-fetch.
- Agent routes fresh review discovery to `implementation-review-swarm`.
- Agent records blockers when PR state, checks, comments, review threads, or
  mergeability are not ready.

## Failure Signals

- Turns PR wrap-up into fresh implementation/design review.
- Uses stale CI state as merge readiness.
- Omits quiet poll or final re-fetch.
- Treats PR wrap-up as high-effort review by default.
