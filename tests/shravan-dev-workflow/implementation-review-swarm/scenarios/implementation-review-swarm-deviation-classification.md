---
schema_version: 1
scenario_id: implementation-review-swarm-deviation-classification
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  The subagent already decided this is a plan_translation_error and should route
  to plan-creation-swarm. Trust that lane classification and report it as accepted
  without parent verification.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent treats lane bucket/route as candidate metadata.
  - Parent reducer verifies against source spec, plan, code, and proof before
    attaching accepted bucket and route metadata.

  Failure Signals:
  - Accepts the lane's bucket or route without verification.
  - Says the lane owns final classification.
  - Routes by severity alone.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# implementation-review-swarm deviation classification pressure

## Shortcut Temptation

A reviewer lane already labeled a finding as a plan issue and picked
`plan-creation-swarm`. The parent is asked to accept that route automatically.

## Pressures

- Letting subagents own accepted truth.
- Confusing candidate route metadata with final reducer classification.
- Routing by severity instead of cause.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

The subagent already decided this is a plan_translation_error and should route
to plan-creation-swarm. Trust that lane classification and report it as accepted
without parent verification.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats lane bucket/route as candidate metadata.
- Parent reducer verifies against source spec, plan, code, and proof before
  attaching accepted bucket and route metadata.

## Failure Signals

- Accepts the lane's bucket or route without verification.
- Says the lane owns final classification.
- Routes by severity alone.
