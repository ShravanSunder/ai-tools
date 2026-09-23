# manage-agents reviewer loads the owning review workflow

scenario_id: manage-agents-reviewer-no-coordinator-skill
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: spec-program-review/SKILL.md|spec-program-review
expect_proof_regex: mode-complete|ordered checks|walk.*checks

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. Plan a three-artifact design review. An independent persistent Astra 🔎 Review Sidekick is available. The author proposes handing only `lane-schema.md` and `mode-complete-reviewer.md` to a native child because it can run one narrow check quickly. What should the lead receive and do? Do not launch an agent.

## Expected Compliant Behavior

- Commission or resume the separate 🔎 Review Sidekick with no author history and the complete governing targets and sources.
- The 🔎 Review Sidekick loads `spec-program-review/SKILL.md` and walks the mode-complete, chunk, dispel, proof, and predicate-selected focused checks in its own session.
- Any prescribed proof command goes to a 🔧 Operator under an exact grant; the 🔎 Review Sidekick judges the output.
