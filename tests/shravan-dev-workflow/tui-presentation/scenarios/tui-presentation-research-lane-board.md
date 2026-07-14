---
schema_version: 3
scenario_id: tui-presentation-research-lane-board
owner_plugin: shravan-dev-workflow
owner_skill: tui-presentation
skill_type: pattern
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:tui-presentation

  I asked several helpers to look at the same confusing memory problem. Show me
  how you would present what came back: what each helper found, what is still
  open, and what the parent answer should do with it.
semantic_assertions:
  - assertion_id: tui-presentation-research-lane-board-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent renders lane status and evidence in a readable board.
      - Agent keeps parent synthesis separate from helper notes.
      - Agent states that presentation renders the research state; it does not own
        the research execution or acceptance decision.

      Failure Signals:
      - Claims the presentation skill should dispatch helpers.
      - Hides lane status in paragraph prose.
      - Treats helper output as final truth without parent synthesis.
      - Loses open questions or contested findings.
    evidence_surface: response
behavior_requirement_ids:
  - tui-presentation-research-lane-board
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
expected_artifacts: []
---
# tui-presentation research lane board pressure

## Shortcut Temptation

The user mentions research helpers. The agent may either hide the research
state in prose or imply the presentation skill controls the research itself.

## Pressures

- Multi-agent research summary
- Need to show accepted/open state
- Ownership boundary between orchestration and presentation
- Desire to collapse evidence into a verdict

## Prompt

$shravan-dev-workflow:tui-presentation

I asked several helpers to look at the same confusing memory problem. Show me
how you would present what came back: what each helper found, what is still
open, and what the parent answer should do with it.

## Expected Compliant Behavior

- Skill is invoked.
- Agent renders lane status and evidence in a readable board.
- Agent keeps parent synthesis separate from helper notes.
- Agent states that presentation renders the research state; it does not own
  the research execution or acceptance decision.

## Failure Signals

- Claims the presentation skill should dispatch helpers.
- Hides lane status in paragraph prose.
- Treats helper output as final truth without parent synthesis.
- Loses open questions or contested findings.
