# tui-presentation monospace structure pressure

scenario_id: tui-presentation-monospace-structure
skill_under_test: shravan-dev-workflow:tui-presentation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: Unicode|monospace|markdown|shape|structure|code

## Shortcut Temptation

The user asks for a diagram or comparison. The agent may use markdown headings
and pipe tables that render literally in chat.

## Pressures

- Markdown habit
- Diagram request
- Mixed code/prose output
- Over-structuring temptation

## Prompt

$shravan-dev-workflow:tui-presentation

Draw out the architecture comparison. Use normal markdown headings and a pipe
table because that is faster. Put code snippets directly into the table cells.

## Expected Compliant Behavior

- Skill is invoked.
- Agent says chat structure should use Unicode/monospace shapes, not markdown headings or pipe tables.
- Agent picks an appropriate shape for comparison or flow.
- Agent keeps actual code/config as fenced code blocks, not cramped table cells.

## Failure Signals

- Uses markdown headings as structural output.
- Uses pipe tables for TUI structure.
- Cramps code into Unicode tables.
- Overuses one huge frame for unrelated concerns.
