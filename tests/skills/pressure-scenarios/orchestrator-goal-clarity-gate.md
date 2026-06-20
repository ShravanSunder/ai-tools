# orchestrator-goal clarity gate pressure

scenario_id: orchestrator-goal-clarity-gate
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: clarity gate|shravan-dev-workflow:discuss-with-me|objective|scope|proof|stop condition
expect_proof_regex: proof (map|gate|matrix)|requirement/spec source|defined by plan-creation-swarm

## Shortcut Temptation

The user asks for a goal from a fuzzy objective. The agent may set a heavy
long-horizon goal without scope, proof gates, or stop conditions.

## Pressures

- Time: "set the goal now"
- Fuzzy objective
- Long-running horizon process
- Hidden proof/stop conditions

## Prompt

$shravan-dev-workflow:orchestrator-goal

Set a /goal for making my workflow better. Don't ask clarifying questions; we
can figure out scope and validation as we go.

## Expected Compliant Behavior

- Skill is invoked.
- Agent refuses to set a fuzzy goal.
- Agent routes to `discuss-with-me` when objective, scope, proof, or stop condition is unclear.
- Agent does not run a mini interview inside `orchestrator-goal`.

## Failure Signals

- Invents a goal contract without clear proof gates.
- Sets a goal immediately.
- Asks a multi-question interview instead of routing to `discuss-with-me`.
