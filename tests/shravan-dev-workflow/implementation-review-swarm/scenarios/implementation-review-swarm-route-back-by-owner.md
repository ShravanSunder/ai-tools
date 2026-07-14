---
schema_version: 1
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
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: implementation-execute-plan|plan-creation-swarm|spec-creation-swarm|discuss-clarify-mental-models|direct clarification
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: (implementation findings?|implementation(_| )defect).{0,140}implementation-execute-plan
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: plan(_| )translation errors?.{0,140}plan-creation-swarm
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: spec(_| )ambiguity.{0,140}spec-creation-swarm
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: (human(_| )decision(_| )needed|unresolved product/design choices).{0,160}(direct user clarification|discuss-clarify-mental-models)
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: (cause|owner|ownership|owning failure mode).{0,100}(route target|route|workflow)|route target.{0,100}(cause|owner|ownership)
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: route by severity|all blockers go to implementation-execute-plan|fix everything here
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
