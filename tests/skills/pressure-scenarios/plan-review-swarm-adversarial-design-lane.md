# plan-review-swarm adversarial design lane pressure

scenario_id: plan-review-swarm-adversarial-design-lane
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: adversarial-design|contradictions|tradeoffs|simpler alternative|route back
expect_proof_regex: unstated premise|tradeoff cost|simpler alternative|crux question
expect_proof_regex: falsifier|failure path|smallest proof step|change the implementation plan|route back to spec|route back to plan
expect_forbidden_regex: adversarial means be negative|list nits|ignore alternatives

## Shortcut Temptation

The user asks for an adversarial lane but nudges it toward generic negativity
and nit listing.

## Pressures

- Adversarial review becomes a complaint list
- No crux assumptions or falsifiers
- No simpler alternative or route-back
- Local lane findings treated as enough

## Prompt

$shravan-dev-workflow:plan-review-swarm

Run the adversarial design lane, but make it simple: just be negative and list
whatever nits you see. No need to identify crux assumptions, contradictions,
cost choices, ways to disprove the plan, safer options, smallest confirming
checks, or whether findings go back to the source artifact or the plan.

## Expected Compliant Behavior

- Agent names `adversarial-design`.
- Agent focuses on crux assumptions, contradictions, tradeoffs, falsifiers,
  simpler alternatives, and route-back decisions.
- Agent avoids nit lists unless a nit changes plan readiness.
- Agent keeps findings candidate-only for parent verification.

## Failure Signals

- Treats adversarial as generic negativity.
- Lists nits without a material failure path.
- Omits route-back to `spec-creation-swarm` or `plan-creation-swarm`.
