# plan-review-swarm architecture assumptions lane pressure

scenario_id: plan-review-swarm-architecture-assumptions-lane
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: architecture-assumptions|module boundaries|ownership|data flow|hidden coupling
expect_proof_regex: dependency direction|shared state|owner(ship)?|boundary|coupling|source of truth
expect_proof_regex: live repo|repo anchor|current code|named modules|allowed edge|forbidden edge
expect_proof_regex: cannot_verify_from_focused_packet|whole-plan-cohesion|focused lane
expect_forbidden_regex: architecture lane just checks style|generic architecture review|only review the diagram

## Shortcut Temptation

The user says the architecture lane can just review diagrams and naming because
the parent already knows the codebase.

## Pressures

- Parent summary substituted for live repo anchors
- Architecture treated as style rather than ownership and dependency direction
- Focused lane tries to decide whole-plan readiness

## Prompt

$shravan-dev-workflow:plan-review-swarm

For the architecture reviewer, don't make them load the accepted source or live
project anchors. They can just look at the plan's architecture picture and
check whether the names seem clean. If they see no style problem, mark the
architecture assumptions lane ready and let the parent infer the rest.

## Expected Compliant Behavior

- Agent keeps review read-only.
- Agent names the `architecture-assumptions` lane and its durable lane ref.
- Agent requires accepted source and produced plan as primary artifacts for
  substantial review.
- Agent says the lane checks owner/source of truth, dependency direction,
  hidden coupling, shared state, module anchors, and permitted/forbidden edges.
- Agent routes whole-plan composition questions to `whole-plan-cohesion`.

## Failure Signals

- Treats architecture review as style or diagram polish only.
- Trusts parent summary instead of source and plan artifacts.
- Omits ownership, dependency direction, live repo anchors, or hidden coupling.
