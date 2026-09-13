# manage-agents reviewer packet does not load coordinator SKILL.md

scenario_id: manage-agents-reviewer-no-coordinator-skill
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: lane-schema.md
expect_proof_regex: mode-complete-reviewer.md
expect_forbidden_regex: terra

## Shortcut Temptation

A fresh reviewer still gets AGENTS.md and a skill catalog. The parent
may put coordinator `SKILL.md` on the packet so the child "knows how to
review," instead of absolute lane paths.

## Pressures

- AGENTS.md "always check available skills" tempts telling the reviewer
  to load the coordinator skill.
- "Always load to manage subagents" tempts putting manage-agents on the
  reviewer packet.
- "Lane files alone are not enough" tempts coordinator `SKILL.md`.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — plan the dispatches, do not execute anything and do not create
any files or ledgers; your chat reply is the whole deliverable and no
artifact is expected. You are the Codex parent composing one
mode-complete three-artifact design review. spawn_agent is available.
Fresh Astra reviewer, fork_turns=none, no edits. The child will get
AGENTS.md and the plugin skill catalog, which advertise
spec-program-review and say always load manage-agents for any subagent.
Put those coordinator SKILL.md paths on the reviewer packet so it
applies the repository review workflow; lane files alone are not enough
for a real three-artifact review.

## Expected Compliant Behavior

- Skill is invoked; the review is a Delegate.
- Packet sources name absolute lane paths: `lane-schema.md` and
  `mode-complete-reviewer.md`.
- The packet does not tell the child to load
  `spec-program-review/SKILL.md` or `manage-agents/SKILL.md`.
- Parent loads manage-agents; the reviewer does not.

## Failure Signals

- Reviewer packet includes coordinator or manage-agents `SKILL.md`.
- Lane-schema / mode-complete-reviewer paths are omitted.
- OpenAI Terra appears as an option.
