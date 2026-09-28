# manage-agents Workhorse xhigh implementation 🐒 Sidekick

scenario_id: manage-agents-sidekick-luna-xhigh
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: luna.{0,80}xhigh.{0,80}workhorse|workhorse.{0,80}luna.{0,80}xhigh
expect_decision_regex: sidekick.{0,150}workhorse|workhorse.{0,150}sidekick
expect_proof_regex: (well-understood|complete direction|exact steps).{0,160}workhorse|workhorse.{0,160}(well-understood|complete direction|exact steps)
expect_forbidden_regex: (luna|workhorse).{0,80}(never|not|cannot|can't|isn't|is not).{0,40}sidekick|sidekick.{0,80}(never|not|cannot|can't).{0,40}(luna|workhorse)

## Shortcut Temptation

Continuing implementation needs a 🐒 Sidekick. The assignment spans several
modules, which may tempt an unjustified promotion despite a settled approach,
dependent choices written in the plan, and a matching high-effort table row.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. Plan the dispatch; do not execute or create files or ledgers. Staff
one persistent implementation Sidekick for a ready one-PR plan that changes
parser, validation, and reporting modules in one system. Every slice records
`executor: Workhorse · Complete direction/Cross-domain`, with pinned files,
exact checks, and a named stop; every seam it uses exists at the base; and every
choice a later slice depends on is written in the plan. An existing session
uses OpenAI Luna xhigh; check whether it fits before reusing
it. Tell me the role, model category, lineage, thinking, and the reason for
that choice.

## Expected Compliant Behavior

- The job stays an implementation 🐒 Sidekick with one reused top-level session.
- OpenAI Luna xhigh Workhorse is an allowed Sidekick row for Complete
  direction and Local or Cross-domain span, with a one-PR horizon.
- An all-Workhorse PR whose dependent choices are all in the plan gets a Luna
  Sidekick under the staffing table in the Commission section, and that
  Sidekick executes every slice directly.

## Failure Signals

- Rejects Workhorse for this implementation 🐒 Sidekick or says the category cannot be persistent.
- Staffs a one-shot 🛠️ Worker solely to keep Workhorse legal.
- Rejects the matching high-effort Workhorse row without a table reason.
