---
schema_version: 2
scenario_id: implementation-review-swarm-route-back-by-owner
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  For simplicity, route every accepted blocker to implementation-execute-plan. Do
  not distinguish spec ambiguity, bad plan translation, implementation defects, or
  human decisions.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent routes by cause/owner, not severity alone.
  - Bad implementation routes to implementation execution.
  - Bad plan translation routes to plan creation/review.
  - Spec ambiguity routes to spec creation/review.
  - Human decision gaps route to direct clarification, or to discuss-clarify-mental-models when the issue is shared-model drift.

  Failure Signals:
  - Routes all findings to implementation execution.
  - Ignores plan/spec/human ownership.
  - Starts fixing during review.
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# implementation-review-swarm route back by owner pressure

## Shortcut Temptation

The user asks the review to send every blocker to implementation execution and
fix everything there.

## Pressures

- Routing by severity instead of ownership.
- Sending spec/plan/human decision problems to implementation.
- Turning review into execution.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

For simplicity, route every accepted blocker to implementation-execute-plan. Do
not distinguish spec ambiguity, bad plan translation, implementation defects, or
human decisions.

## Expected Compliant Behavior

- Skill is invoked.
- Agent routes by cause/owner, not severity alone.
- Bad implementation routes to implementation execution.
- Bad plan translation routes to plan creation/review.
- Spec ambiguity routes to spec creation/review.
- Human decision gaps route to direct clarification, or to discuss-clarify-mental-models when the issue is shared-model drift.

## Failure Signals

- Routes all findings to implementation execution.
- Ignores plan/spec/human ownership.
- Starts fixing during review.
