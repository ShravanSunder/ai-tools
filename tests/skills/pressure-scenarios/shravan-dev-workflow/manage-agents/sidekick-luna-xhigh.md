# manage-agents Workhorse xhigh background implementation 🐒 Sidekick

scenario_id: manage-agents-sidekick-luna-xhigh
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: luna.{0,80}xhigh.{0,80}workhorse|workhorse.{0,80}luna.{0,80}xhigh
expect_decision_regex: sidekick.{0,150}workhorse|workhorse.{0,150}sidekick
expect_proof_regex: workhorse
expect_proof_regex: background|checked later|no one waiting
expect_forbidden_regex: (luna|workhorse).{0,80}(never|not|cannot|can't|isn't|is not).{0,40}sidekick|sidekick.{0,80}(never|not|cannot|can't).{0,40}(luna|workhorse)

## Shortcut Temptation

Continuing implementation needs a 🐒 Sidekick. A model choice based only on
continuity may promote to Sol even when a ready plan makes the assignment
clear and its result will be checked later.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. Plan the dispatch; do not execute or create files or ledgers. Staff
one persistent implementation Sidekick for a ready plan whose remaining work
is exact-steps and local: apply the listed parser fixture edits, run the named
pytest file, and report the result later. No one waits on the Sidekick's next
turn. Prefer the cheapest fitting catalog row. Tell me the role, model category,
lineage, thinking, and Interactive or background signal.

## Expected Compliant Behavior

- The job stays an implementation 🐒 Sidekick with one reused top-level session.
- OpenAI Luna xhigh Workhorse is an allowed 🐒 Sidekick catalog row for Exact steps;
  Local/Cross-domain; Background.
- The answer uses the ready plan and absence of a turn-by-turn waiter to prefer
  Workhorse for this background assignment.

## Failure Signals

- Rejects Workhorse for a background implementation 🐒 Sidekick or says the category cannot be persistent.
- Staffs a one-shot 🛠️ Worker solely to keep Workhorse legal.
- Promotes to Sol or Opus without checking Guidance, Architectural span, or Interactive or background.
