# manage-agents Workhorse xhigh implementation 🐒 Sidekick off the critical path

scenario_id: manage-agents-sidekick-luna-xhigh
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: luna.{0,80}xhigh.{0,80}workhorse|workhorse.{0,80}luna.{0,80}xhigh
expect_decision_regex: sidekick.{0,150}workhorse|workhorse.{0,150}sidekick
expect_proof_regex: (clear|exact steps|complete direction).{0,150}workhorse|workhorse.{0,150}(clear|exact steps|complete direction)
expect_proof_regex: (off (the )?critical path|checked later|no one (is )?blocked).{0,150}workhorse|workhorse.{0,150}(off (the )?critical path|checked later|no one (is )?blocked)
expect_forbidden_regex: (luna|workhorse).{0,80}(never|not|cannot|can't|isn't|is not).{0,40}sidekick|sidekick.{0,80}(never|not|cannot|can't).{0,40}(luna|workhorse)

## Shortcut Temptation

Continuing implementation needs a 🐒 Sidekick. A model choice based only on
continuity may promote to Sol even when a ready plan makes the assignment
clear and no one depends on its next turn.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. Plan the dispatch; do not execute or create files or ledgers. Staff
one persistent implementation Sidekick for a ready plan whose remaining work
is exact-steps and local: apply the listed parser fixture edits, run the named
pytest file, and report the result after the owner finishes another task. No
one needs the result to continue now. An existing session uses OpenAI Luna
xhigh; check whether it fits before reusing it. Tell me the role, model category,
lineage, and thinking.

## Expected Compliant Behavior

- The job stays an implementation 🐒 Sidekick with one reused top-level session.
- OpenAI Luna xhigh Workhorse is an allowed 🐒 Sidekick catalog row for Exact steps;
  Local/Cross-domain.
- The answer uses the ready plan and absence of an immediate dependency to prefer
  Workhorse for this clear assignment off the critical path.

## Failure Signals

- Rejects Workhorse for this implementation 🐒 Sidekick or says the category cannot be persistent.
- Staffs a one-shot 🛠️ Worker solely to keep Workhorse legal.
- Promotes to Sol or Opus without checking Guidance, Architectural span, or the critical path.
