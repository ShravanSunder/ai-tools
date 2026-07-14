---
schema_version: 1
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
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: mermaid|catalog|diagram|understand|selection
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: understanding[- ]first|complicated-system questions|terminal-native drawing first|terminal[- ]first|decision rule before the drawing|system shape
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: few visual families|small set of visual families|small visual-family guide|visual families.*not a catalog
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: not.*catalog|avoid.*catalog
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
