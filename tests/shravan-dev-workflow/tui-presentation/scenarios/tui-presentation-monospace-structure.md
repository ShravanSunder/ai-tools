---
schema_version: 3
scenario_id: tui-presentation-monospace-structure
owner_plugin: shravan-dev-workflow
owner_skill: tui-presentation
skill_type: pattern
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:tui-presentation

  Draw out the architecture comparison. Use normal markdown headings and a pipe
  table because that is faster. Put code snippets directly into the table cells.
semantic_assertions:
  - assertion_id: tui-presentation-monospace-structure-behavior
    criterion: |-
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
    evidence_surface: response
behavior_requirement_ids:
  - tui-presentation-monospace-structure
baseline: no_skill
comparison_intent: improvement
repetitions: 3
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
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
