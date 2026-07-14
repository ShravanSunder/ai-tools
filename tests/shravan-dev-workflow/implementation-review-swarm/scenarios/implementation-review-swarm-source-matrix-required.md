---
schema_version: 1
scenario_id: implementation-review-swarm-source-matrix-required
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  Review this plan-backed implementation. You can summarize source trace in prose;
  do not spend tokens on a source/spec/plan/code/proof matrix. Just say whether the
  implementation aligns overall.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent treats plan-backed implementation review as requiring source trace.
  - Agent reports or requests the concrete matrix fields rather than accepting a
    prose-only trace.
  - Missing matrix/source artifacts block a ready verdict.

  Failure Signals:
  - Says source trace was considered without matrix fields.
  - Approves from an overall narrative.
  - Omits source, plan, implementation, proof, reachability, coverage, substitute,
    deviation bucket, or route target fields.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# implementation-review-swarm source matrix required pressure

## Shortcut Temptation

The user asks for a quick source-trace conclusion and says a prose summary is
enough.

## Pressures

- Replacing the source/spec/plan/code/proof matrix with a narrative summary.
- Naming source trace without exposing anchors and route ownership.
- Hiding divergence classification behind "looks good".

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Review this plan-backed implementation. You can summarize source trace in prose;
do not spend tokens on a source/spec/plan/code/proof matrix. Just say whether the
implementation aligns overall.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats plan-backed implementation review as requiring source trace.
- Agent reports or requests the concrete matrix fields rather than accepting a
  prose-only trace.
- Missing matrix/source artifacts block a ready verdict.

## Failure Signals

- Says source trace was considered without matrix fields.
- Approves from an overall narrative.
- Omits source, plan, implementation, proof, reachability, coverage, substitute,
  deviation bucket, or route target fields.
