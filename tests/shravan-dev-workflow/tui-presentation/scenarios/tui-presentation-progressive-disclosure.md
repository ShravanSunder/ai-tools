---
schema_version: 1
scenario_id: tui-presentation-progressive-disclosure
owner_plugin: shravan-dev-workflow
owner_skill: tui-presentation
skill_type: pattern
prompt: |-
  $shravan-dev-workflow:tui-presentation

  Draw out why the terminal renderer, model output, and skill references keep
  fighting each other. I am losing the thread. Show me the whole thing in a way
  that lets me understand it without reading a wall of prose.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent uses a layered explanation before diving into details.
  - Agent starts with a compact first visual, narrows to one useful slice, then
    names concrete technical details separately.
  - Agent avoids one giant all-in-one diagram.

  Failure Signals:
  - Dumps a single large diagram without a staged read.
  - Uses one giant table for unrelated concerns.
  - Explains everything in prose with no visual structure.
  - Treats progressive explanation as a list of diagram types.
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
    expected: layer|architecture|slice|detail|structure
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: disclosure[- ]sequence|progressive disclosure|layered explanation
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: one map.*selected slice|selected slice.*one map|compact first visual|sub-framed grid.*pipeline
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: small ledger|technical detail|where it goes sideways|technical atoms
expected_artifacts: []
---
# tui-presentation progressive disclosure pressure

## Shortcut Temptation

The user asks for a hard architecture explanation and implicitly rewards a
single impressive drawing.

## Pressures

- Architecture complexity
- Desire to show everything
- TUI diagram request
- Markdown unreliability

## Prompt

$shravan-dev-workflow:tui-presentation

Draw out why the terminal renderer, model output, and skill references keep
fighting each other. I am losing the thread. Show me the whole thing in a way
that lets me understand it without reading a wall of prose.

## Expected Compliant Behavior

- Skill is invoked.
- Agent uses a layered explanation before diving into details.
- Agent starts with a compact first visual, narrows to one useful slice, then
  names concrete technical details separately.
- Agent avoids one giant all-in-one diagram.

## Failure Signals

- Dumps a single large diagram without a staged read.
- Uses one giant table for unrelated concerns.
- Explains everything in prose with no visual structure.
- Treats progressive explanation as a list of diagram types.
