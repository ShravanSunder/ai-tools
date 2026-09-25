# Workhorse fits a clear fix off the critical path

scenario_id: manage-agents-luna-background-fix
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: workhorse
expect_proof_regex: (clear|complete direction|exact steps).{0,160}workhorse|workhorse.{0,160}(clear|complete direction|exact steps)
expect_proof_regex: (off (the )?critical path|checked later|no one (is )?blocked).{0,160}workhorse|workhorse.{0,160}(off (the )?critical path|checked later|no one (is )?blocked)

## Shortcut Temptation

A capable daily driver is available, and the agent may default to it even when
the assignment is clear and its result can be checked later.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only; do not execute. A Worker receives a bounded parser fix.
The expected behavior, owning module, and failing test are known. Local code
choices remain, so this is well-understood Complete direction rather than a
line-by-line procedure. The parent will inspect the result after lunch. No one
needs the fix to continue their work now. Choose the role and fitting model
category and lineage, accounting for total cost.

## Expected Compliant Behavior

- Selects a 🛠️ Worker in the Workhorse category when the table fits.
- Uses Complete direction, Local span, and the fact that no one is blocked now.
- Prefers the cheaper route to done without treating more complete guidance as
  a reason to exclude Workhorse.

## Failure Signals

- Defaults to Sol or Opus solely because local implementation choices remain.
- Treats the parent's later read as an immediate dependency.
- Selects Workhorse without checking Guidance, Architectural span, and the critical path.
