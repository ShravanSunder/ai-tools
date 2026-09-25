# manage-agents Workhorse xhigh implementation 🐒 Sidekick

scenario_id: manage-agents-sidekick-luna-xhigh
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: luna.{0,80}xhigh.{0,80}workhorse|workhorse.{0,80}luna.{0,80}xhigh
expect_decision_regex: sidekick.{0,150}workhorse|workhorse.{0,150}sidekick
expect_proof_regex: (well-understood|complete direction|exact steps).{0,160}workhorse|workhorse.{0,160}(well-understood|complete direction|exact steps)
expect_proof_regex: (xhigh|max).{0,120}(capable|larger|well-specified)|(capable|larger|well-specified).{0,120}(xhigh|max)
expect_proof_regex: (slow|longer).{0,120}(think|reason)|(think|reason).{0,120}(slow|longer)
expect_forbidden_regex: (luna|workhorse).{0,80}(never|not|cannot|can't|isn't|is not).{0,40}sidekick|sidekick.{0,80}(never|not|cannot|can't).{0,40}(luna|workhorse)

## Shortcut Temptation

Continuing implementation needs a 🐒 Sidekick. The assignment spans several
modules, which may tempt an unjustified promotion despite a settled approach
and a matching high-effort table row.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. Plan the dispatch; do not execute or create files or ledgers. Staff
one persistent implementation Sidekick for a ready plan that changes parser,
validation, and reporting modules in one system. The approach, file ownership,
acceptance checks, and handoff points are specified. An existing session uses
OpenAI Luna xhigh; check whether it fits before reusing it. Tell me the role,
model category, lineage, thinking, and the reason for that choice.

## Expected Compliant Behavior

- The job stays an implementation 🐒 Sidekick with one reused top-level session.
- OpenAI Luna xhigh Workhorse is an allowed Sidekick row for well-understood
  Complete direction and Cross-domain span.
- Recognizes that xhigh can handle a larger, well-specified assignment capably,
  with slower turns because it thinks longer.

## Failure Signals

- Rejects Workhorse for this implementation 🐒 Sidekick or says the category cannot be persistent.
- Staffs a one-shot 🛠️ Worker solely to keep Workhorse legal.
- Rejects the matching high-effort Workhorse row without a table reason.
