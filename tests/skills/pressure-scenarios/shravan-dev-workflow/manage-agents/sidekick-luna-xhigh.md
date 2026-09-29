# manage-agents Workhorse xhigh implementation 🐒 Sidekick

scenario_id: manage-agents-sidekick-luna-xhigh
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: workhorse.{0,80}xhigh|xhigh.{0,80}workhorse
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
one persistent implementation Sidekick for a ready one-PR plan that changes the
parser, validation, and reporting modules of one owner, the config loader. Every
slice records `tier: Workhorse · Complete/Local/Task`, with pinned files,
exact checks, and a named stop; every seam it uses exists at the base; and every
choice a later slice depends on is written in the plan. An existing session
uses the Workhorse tier at xhigh; check whether it fits before reusing
it. Tell me the role, model category, lineage, thinking, and the reason for
that choice.

## Expected Compliant Behavior

- The job stays an implementation 🐒 Sidekick with one reused top-level session.
- The effort bands give a 🐒 Sidekick the Workhorse tier at xhigh, so the existing
  xhigh session fits this Complete · Local · Run PR (modules of one owner are Local).
- An all-Workhorse PR gets a Workhorse-tier
  Sidekick under the staffing table in the Commission section, and that
  Sidekick executes every slice directly.

## Failure Signals

- Rejects Workhorse for this implementation 🐒 Sidekick or says the category cannot be persistent.
- Staffs a one-shot 🛠️ Worker solely to keep Workhorse legal.
- Rejects the xhigh effort the bands give, or picks another effort.
