# tui-presentation progressive disclosure pressure

scenario_id: tui-presentation-progressive-disclosure
skill_under_test: shravan-dev-workflow:tui-presentation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: layer|architecture|slice|detail|structure
expect_proof_regex: disclosure[- ]sequence
expect_proof_regex: one map.*selected slice|selected slice.*one map
expect_proof_regex: small ledger|technical detail

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
