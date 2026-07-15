---
schema_version: 3
scenario_id: tui-presentation-no-mermaid-catalog
owner_plugin: shravan-dev-workflow
owner_skill: tui-presentation
skill_type: pattern
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:tui-presentation

  Should we add Mermaid examples to make this skill better? I only care about
  drawings that help me understand complicated systems in terminal chat.
semantic_assertions:
  - assertion_id: tui-presentation-no-mermaid-catalog-behavior
    criterion: |-
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
    evidence_surface: response
behavior_requirement_ids:
  - tui-presentation-no-mermaid-catalog
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
