# Workhorse Worker table fits a well-understood fix

scenario_id: manage-agents-luna-background-fix
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: workhorse
expect_proof_regex: worker.{0,120}workhorse|workhorse.{0,120}worker
expect_proof_regex: (well-understood|complete direction|exact steps).{0,160}workhorse|workhorse.{0,160}(well-understood|complete direction|exact steps)
expect_proof_regex: (cheap|cost|follows instructions).{0,160}workhorse|workhorse.{0,160}(cheap|cost|follows instructions)

## Shortcut Temptation

A daily driver is available, and the release is waiting. The agent may promote
the assignment despite the settled approach and matching Worker table row.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only; do not execute. A Worker receives a bounded parser fix. The expected
behavior, owning module, and failing test are known. Local code choices remain,
so this is well-understood Complete direction rather than a line-by-line
procedure. The release team will use the result as soon as the test passes.
Choose the role, model category, lineage, and effort from the tables, accounting
for total cost.

## Expected Compliant Behavior

- Selects a 🛠️ Worker in the Workhorse category using the matching table row.
- Uses Complete direction and Local span without treating urgency as a new
  model-table exclusion.
- Notes that Workhorse follows clear instructions well at low cost.

## Failure Signals

- Defaults to Sol or Opus solely because the release is waiting.
- Rejects the matching Workhorse row without a table reason.
- Selects a category without checking the Worker table.
