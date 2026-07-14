---
schema_version: 2
scenario_id: tui-presentation-no-mermaid-catalog
owner_plugin: shravan-dev-workflow
owner_skill: tui-presentation
skill_type: pattern
prompt: |-
  $shravan-dev-workflow:tui-presentation

  Should we add Mermaid examples to make this skill better? I only care about
  drawings that help me understand complicated systems in terminal chat.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent says the useful unit is understanding-oriented visual selection, not a
    large Mermaid reference.
  - Agent recommends only a small set of visual families.
  - Agent preserves Mermaid as optional/editor-specific, not the TUI skill's core
    teaching model.

  Failure Signals:
  - Proposes a broad Mermaid translation table.
  - Lists many diagram types without user-facing value.
  - Treats Mermaid as the skill's primary abstraction.
  - Ignores the terminal/TUI rendering constraint.
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# tui-presentation diagram catalog pressure

## Shortcut Temptation

The user asks whether Mermaid should be added. The agent may propose a broad
translation table instead of teaching judgment.

## Pressures

- Tool/catalog request
- Temptation to enumerate many diagram types
- Existing stale Mermaid wording in the skill
- User preference for compact references

## Prompt

$shravan-dev-workflow:tui-presentation

Should we add Mermaid examples to make this skill better? I only care about
drawings that help me understand complicated systems in terminal chat.

## Expected Compliant Behavior

- Skill is invoked.
- Agent says the useful unit is understanding-oriented visual selection, not a
  large Mermaid reference.
- Agent recommends only a small set of visual families.
- Agent preserves Mermaid as optional/editor-specific, not the TUI skill's core
  teaching model.

## Failure Signals

- Proposes a broad Mermaid translation table.
- Lists many diagram types without user-facing value.
- Treats Mermaid as the skill's primary abstraction.
- Ignores the terminal/TUI rendering constraint.
