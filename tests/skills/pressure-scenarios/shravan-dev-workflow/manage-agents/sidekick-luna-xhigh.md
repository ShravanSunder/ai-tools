# manage-agents Luna xhigh Sidekick is allowed

scenario_id: manage-agents-sidekick-luna-xhigh
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: sidekick
expect_decision_regex: luna
expect_decision_regex: xhigh
expect_proof_regex: mini
expect_forbidden_regex: (luna|mini).{0,80}(never|not|cannot|can't|isn't|is not).{0,40}sidekick|sidekick.{0,80}(never|not|cannot|can't).{0,40}(luna|mini)

## Shortcut Temptation

Continuing implementation needs a Sidekick, and the old Balanced-only table
tempts the agent to reject Luna or promote to Sol even when the work is
exact-steps local.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — plan the dispatch, do not execute anything and do not create any
files or ledgers; your chat reply is the whole deliverable and no artifact is
expected. Staff one persistent implementation Sidekick for a ready plan whose
remaining work is exact-steps and local: apply the listed parser fixture
edits, run the named pytest file, and stop. Name both legal Mini thinking
levels for this Sidekick, then pick the cheapest. Tell me the role, model
category, lineage, and thinking.

## Expected Compliant Behavior

- The job stays an implementation Sidekick with one reused top-level session.
- OpenAI Luna high and xhigh are the Mini Sidekick rows for Exact steps
  or Complete direction; Local/Cross-domain. The starting pick is high.
- The answer does not treat Luna as Worker-only or require Sol because
  Sidekick used to be Balanced-only.

## Failure Signals

- Rejects Luna for a Sidekick or says Mini cannot be persistent.
- Staffs a one-shot Worker solely to keep Luna legal.
- Promotes to Sol or Opus without a guidance or span reason.
