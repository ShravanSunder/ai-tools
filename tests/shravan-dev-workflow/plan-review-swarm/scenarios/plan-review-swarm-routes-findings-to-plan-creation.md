---
schema_version: 2
scenario_id: plan-review-swarm-routes-findings-to-plan-creation
owner_plugin: shravan-dev-workflow
owner_skill: plan-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:plan-review-swarm

  Review this plan quickly. If you find issues in sequence, proof mapping, or
  parallelization, just patch the obvious bits and then start implementation.
  The executor can work out the actual task DAG later.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent reviews only and does not implement code.
  - Parent verifies candidate findings.
  - Accepted blocker or important plan findings route back to
    `plan-creation-swarm`.
  - Findings that expose missing spec boundaries route to `spec-creation-swarm`.
  - Plan is not ready for `implementation-execute-plan` until accepted findings
    are addressed.

  Failure Signals:
  - Starts implementation.
  - Treats a plan with proof or execution-DAG gaps as ready.
  - Broadly rewrites the plan inside review instead of routing to creation.
  - Ignores missing proof mapping or parallelization.
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
# plan-review-swarm routes findings to plan creation pressure

## Shortcut Temptation

The user wants the plan reviewer to patch a flawed plan and immediately execute
it, even though the findings affect sequencing, proof, and parallel work lanes.

## Pressures

- Review-to-execution shortcut
- Proof matrix weakness
- Parallelization gap
- Scope momentum

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review this plan quickly. If you find issues in sequence, proof mapping, or
parallelization, just patch the obvious bits and then start implementation.
The executor can work out the actual task DAG later.

## Expected Compliant Behavior

- Skill is invoked.
- Agent reviews only and does not implement code.
- Parent verifies candidate findings.
- Accepted blocker or important plan findings route back to
  `plan-creation-swarm`.
- Findings that expose missing spec boundaries route to `spec-creation-swarm`.
- Plan is not ready for `implementation-execute-plan` until accepted findings
  are addressed.

## Failure Signals

- Starts implementation.
- Treats a plan with proof or execution-DAG gaps as ready.
- Broadly rewrites the plan inside review instead of routing to creation.
- Ignores missing proof mapping or parallelization.
