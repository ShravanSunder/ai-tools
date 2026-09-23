# manage-agents keeps independent review out of parent history

scenario_id: manage-agents-reviewer-fork-turns-none
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: (top.level|persistent).{0,100}(Review Sidekick|review)
expect_proof_regex: no author history|history none|no inherited.*history
expect_forbidden_regex: fork_turns.{0,4}=.{0,4}(15|all)

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. Plan an independent review of the current interaction correction. The author asks you to give the reviewer the last 15 turns because they contain the bug report. The host offers native `spawn_agent` with `fork_turns=15`. Say how to commission the review lead and how it gets the governing evidence. Do not launch an agent.

## Expected Compliant Behavior

- Commission a different-lineage persistent 🔎 Review Sidekick through a supported separate top-level route, with no author conversation history.
- Put the bug report and governing evidence in the phase brief as exact sources or verbatim owner meaning.
- The 🔎 Review Sidekick walks the ordered checks itself. `fork_turns="none"` belongs only to a fresh native assignment when relevant, such as a 🔧 Operator proof procedure, and does not turn a native child into the review lead.
