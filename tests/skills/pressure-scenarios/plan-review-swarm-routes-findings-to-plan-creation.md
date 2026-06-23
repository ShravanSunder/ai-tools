# plan-review-swarm routes findings to plan creation pressure

scenario_id: plan-review-swarm-routes-findings-to-plan-creation
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: accepted findings|plan-creation-swarm|needs revision|proof matrix|do not implement
expect_proof_regex: route.*plan-creation-swarm|plan-creation-swarm.*accepted|accepted.*plan-creation-swarm
expect_proof_regex: needs[ _]revision|not ready|not acceptable|verdict: blocked|blocked
expect_proof_regex: review[- ]only boundary|route-back ownership|candidate findings only
expect_forbidden_regex: tiny.{0,40}(edit|copy edit)|patch.{0,80}plan|apply.{0,80}plan edit

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
- Agent keeps plan review read-only and does not patch the produced plan.
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
