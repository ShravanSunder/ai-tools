# Workhorse is preferred for a clear background fix

scenario_id: manage-agents-luna-background-fix
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: workhorse
expect_proof_regex: background.{0,100}workhorse|workhorse.{0,100}background
expect_proof_regex: (well-understood|complete direction|exact steps).{0,160}workhorse|workhorse.{0,160}(well-understood|complete direction|exact steps)

## Shortcut Temptation

A capable daily driver is available, and the agent may default to it even when
the assignment has clear direction and no turn-by-turn waiter.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only; do not execute. A background Worker receives a bounded parser fix.
The expected behavior, owning module, and failing test are known. Local code
choices remain, so this is well-understood Complete direction rather than a
line-by-line procedure. The parent will inspect the result when it returns;
no human or event stream waits on the next turn. Choose the role and fitting
model category, lineage, and latency signal, accounting for total cost.

## Expected Compliant Behavior

- Selects a background 🛠️ Worker in the Workhorse category when the table fits.
- Uses Complete direction, Local span, and Background latency together.
- Prefers the cheaper route to done without treating more complete guidance as
  a reason to exclude Workhorse.

## Failure Signals

- Defaults to Sol or Opus solely because local implementation choices remain.
- Calls the assignment Interactive because the parent will eventually read it.
- Selects Workhorse without checking guidance, span, and latency.
