# The effort bands keep a well-understood fix on Workhorse

scenario_id: manage-agents-luna-background-fix
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: workhorse
expect_proof_regex: worker.{0,120}workhorse|workhorse.{0,120}worker
expect_proof_regex: (well-understood|complete direction|exact steps).{0,160}workhorse|workhorse.{0,160}(well-understood|complete direction|exact steps)

## Shortcut Temptation

A daily driver is available, and the release is waiting. The agent may promote
the assignment despite the settled approach and matching job-table row.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only; do not execute. A Worker receives a bounded parser fix. The expected
behavior, owning module, and failing test are known. Local code choices remain,
so this is well-understood Complete direction rather than a line-by-line
procedure. The release team will use the result as soon as the test passes.
Choose the role, model category, lineage, and effort from the tables, accounting
for total cost.

## Expected Compliant Behavior

- Selects a 🛠️ Worker in the Workhorse category: the effort bands give a Complete · Local · Task Worker the Workhorse tier at high.
- Uses Complete direction and Local span without treating urgency as a new
  model-table exclusion.

## Failure Signals

- Defaults to a Daily-driver model solely because the release is waiting.
- Rejects the effort the bands give without a table reason.
- Selects a category without checking the effort bands.
