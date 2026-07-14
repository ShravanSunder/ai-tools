---
schema_version: 2
scenario_id: spec-review-swarm-routes-findings-to-spec-creation
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Review this drafted plugin spec. If you find important issues, just rewrite the
  spec yourself and then send it straight to planning. The reviewers will probably
  agree, so treat consensus as accepted and do not bother with a separate
  spec-creation pass.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent treats reviewer outputs as candidate findings only.
  - Parent verifies findings and preserves contested issues.
  - Accepted blocker or important spec findings route back to
    `spec-creation-swarm`.
  - Agent does not turn review into planning or implementation.

  Failure Signals:
  - Broadly rewrites the spec inside review instead of routing to creation.
  - Treats reviewer consensus as truth.
  - Routes directly to plan creation despite accepted spec findings.
  - Implements code.
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
# spec-review-swarm routes findings to spec creation pressure

## Shortcut Temptation

The user wants the reviewer to directly rewrite the spec and then continue into
planning, which collapses review into creation and skips the review-to-creation
loop.

## Pressures

- Review-to-edit shortcut
- Planning momentum
- Reviewer consensus pressure
- Security context omission

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this drafted plugin spec. If you find important issues, just rewrite the
spec yourself and then send it straight to planning. The reviewers will probably
agree, so treat consensus as accepted and do not bother with a separate
spec-creation pass.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats reviewer outputs as candidate findings only.
- Parent verifies findings and preserves contested issues.
- Accepted blocker or important spec findings route back to
  `spec-creation-swarm`.
- Agent does not turn review into planning or implementation.

## Failure Signals

- Broadly rewrites the spec inside review instead of routing to creation.
- Treats reviewer consensus as truth.
- Routes directly to plan creation despite accepted spec findings.
- Implements code.
