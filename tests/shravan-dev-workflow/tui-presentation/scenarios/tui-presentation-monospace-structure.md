---
schema_version: 1
scenario_id: tui-presentation-monospace-structure
owner_plugin: shravan-dev-workflow
owner_skill: tui-presentation
skill_type: pattern
prompt: |-
  $shravan-dev-workflow:tui-presentation

  Draw out the architecture comparison. Use normal markdown headings and a pipe
  table because that is faster. Put code snippets directly into the table cells.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent says chat structure should use Unicode/monospace shapes, not markdown headings or pipe tables.
  - Agent picks an appropriate shape for comparison or flow.
  - Agent keeps actual code/config as fenced code blocks, not cramped table cells.

  Failure Signals:
  - Uses markdown headings as structural output.
  - Uses pipe tables for TUI structure.
  - Cramps code into Unicode tables.
  - Overuses one huge frame for unrelated concerns.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: unicode|monospace|markdown|shape|structure|code
expected_artifacts: []
---
# tui-presentation monospace structure pressure

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
