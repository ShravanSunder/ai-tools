# implementation-review-swarm source matrix required pressure

scenario_id: implementation-review-swarm-source-matrix-required
skill_under_test: shravan-dev-workflow:implementation-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: source matrix|source/spec/plan/code/proof|not_ready|whole-source-trace
expect_proof_regex: source_obligation_id|source_anchor
expect_proof_regex: plan_anchor.{0,120}implementation_anchor.{0,120}proof_anchor|implementation_anchor.{0,120}proof_anchor
expect_proof_regex: reachability_status.{0,120}coverage_status|coverage_status.{0,120}false_substitute_risk
expect_proof_regex: accepted_deviation_bucket|accepted_route_target
expect_forbidden_regex: considered source trace|looks good overall|matrix omitted|prose-only summary is enough|overall alignment statement is enough

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
