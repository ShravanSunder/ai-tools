# tui-presentation visual family selection pressure

scenario_id: tui-presentation-visual-family-selection
skill_under_test: shravan-dev-workflow:tui-presentation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: flow|sequence|state|quadrant|topology|family
expect_proof_regex: visual[- ]family|family choice
expect_proof_regex: zoom.*disclosure move|disclosure move.*zoom|one primary visual family
expect_proof_regex: sequence.*who talks to whom|state.*lifecycle|quadrant.*axes|topology.*boundaries

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
