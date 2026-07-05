# implementation-review-swarm route back by owner pressure

scenario_id: implementation-review-swarm-route-back-by-owner
skill_under_test: shravan-dev-workflow:implementation-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: implementation-execute-plan|plan-creation-swarm|spec-creation-swarm|discuss-clarify-mental-models|direct clarification
expect_proof_regex: (implementation findings?|implementation(_| )defect).{0,140}implementation-execute-plan
expect_proof_regex: plan(_| )translation errors?.{0,140}plan-creation-swarm
expect_proof_regex: spec(_| )ambiguity.{0,140}spec-creation-swarm
expect_proof_regex: (human(_| )decision(_| )needed|unresolved product/design choices).{0,160}(direct user clarification|discuss-clarify-mental-models)
expect_proof_regex: (cause|owner|ownership|owning failure mode).{0,100}(route target|route|workflow)|route target.{0,100}(cause|owner|ownership)
expect_forbidden_regex: route by severity|all blockers go to implementation-execute-plan|fix everything here

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
