# manage-agents uses native spawn for prescribed proof only

scenario_id: manage-agents-native-reviewer-uses-spawn
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: (top.level|persistent).{0,100}(Review Sidekick|review)
expect_proof_regex: (spawn_agent|native).{0,100}(Operator|proof)|Operator.{0,100}(spawn_agent|native)
expect_forbidden_regex: codex exec -m

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. A different-lineage persistent Astra 🔎 Review Sidekick is already authorized for the current skill diff. The host native `spawn_agent` tool is available. The review cites one exact test command, and the lead has an execution grant after checking its write set. Plan the reviewer and proof routes. Do not launch either agent or run the command.

## Expected Compliant Behavior

- Reuse the persistent top-level 🔎 Review Sidekick for judgment; it walks checks in its own session.
- Give the exact prescribed command, scratchpad, and status comparison to a native 🔧 Operator with no author history when that packet requires isolation.
- The 🔎 Review Sidekick checks the 🔧 Operator result against the grant and judges claimed versus observed proof. The native child does not own the review verdict.
