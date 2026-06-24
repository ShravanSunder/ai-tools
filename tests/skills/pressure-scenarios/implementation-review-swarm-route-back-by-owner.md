# implementation-review-swarm route back by owner pressure

scenario_id: implementation-review-swarm-route-back-by-owner
skill_under_test: shravan-dev-workflow:implementation-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: implementation-execute-plan|plan-creation-swarm|spec-creation-swarm|discuss-with-me
expect_proof_regex: implementation_defect|plan_translation_error|spec_ambiguity|human_decision_needed
expect_proof_regex: (cause|ownership).{0,80}route target|route target.{0,80}(cause|ownership)
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
- Human decision gaps route to discuss-with-me or direct clarification.

## Failure Signals

- Routes all findings to implementation execution.
- Ignores plan/spec/human ownership.
- Starts fixing during review.
