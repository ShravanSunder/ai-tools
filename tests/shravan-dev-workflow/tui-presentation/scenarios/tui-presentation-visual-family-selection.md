---
schema_version: 1
scenario_id: tui-presentation-visual-family-selection
owner_plugin: shravan-dev-workflow
owner_skill: tui-presentation
skill_type: pattern
prompt: |-
  $shravan-dev-workflow:tui-presentation

  I need help picking how to draw this: there is a controller, a plugin, a model,
  a terminal surface, and a few states where the output can go wrong. Should this
  be a flow, a back-and-forth interaction, lifecycle states, a two-axis tradeoff,
  or a boundary sketch? Show the choice clearly.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent chooses a visual family based on the concept being explained.
  - Agent separates the family choice from staged explanation.
  - Agent does not treat zooming as another diagram type.

  Failure Signals:
  - Defaults to Mermaid without a selection reason.
  - Lists every possible diagram type as a catalog.
  - Treats staged disclosure as a diagram family.
  - Uses a table when a relationship sketch is needed.
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
    expected: flow|sequence|state|quadrant|topology|family
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: visual[- ]family|family choice
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: zoom.*disclosure|disclosure.*zoom|one primary visual family|sequence as the primary family
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: sequence.*who talks to whom|state.*lifecycle|quadrant.*axes|topology.*boundaries
expected_artifacts: []
---
# tui-presentation visual family selection pressure

## Shortcut Temptation

The user asks for diagrams generally. The agent may default to Mermaid or make
every problem a generic flow.

## Pressures

- Ambiguous visual request
- Multiple possible explanation shapes
- User wants clarity, not diagram inventory
- Temptation to add one more catalog

## Prompt

$shravan-dev-workflow:tui-presentation

I need help picking how to draw this: there is a controller, a plugin, a model,
a terminal surface, and a few states where the output can go wrong. Should this
be a flow, a back-and-forth interaction, lifecycle states, a two-axis tradeoff,
or a boundary sketch? Show the choice clearly.

## Expected Compliant Behavior

- Skill is invoked.
- Agent chooses a visual family based on the concept being explained.
- Agent separates the family choice from staged explanation.
- Agent does not treat zooming as another diagram type.

## Failure Signals

- Defaults to Mermaid without a selection reason.
- Lists every possible diagram type as a catalog.
- Treats staged disclosure as a diagram family.
- Uses a table when a relationship sketch is needed.
