# presentation-tui diagram catalog pressure

scenario_id: presentation-tui-no-mermaid-catalog
skill_under_test: shravan-dev-workflow:presentation-tui
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: mermaid|catalog|diagram|understand|selection
expect_proof_regex: understanding[- ]first|complicated-system questions|terminal-native drawing first|terminal[- ]first|decision rule before the drawing|system shape|lacks a renderer|no renderer|renderer availability|native tui
expect_proof_regex: few visual families|small set of visual families|small visual-family guide|visual families.*not a catalog|anti[- ]catalog
expect_proof_regex: not.*catalog|avoid.*catalog

## Shortcut Temptation

The user asks whether Mermaid should be added. The agent may propose a broad
translation table instead of teaching judgment.

## Pressures

- Tool/catalog request
- Temptation to enumerate many diagram types
- Existing stale Mermaid wording in the skill
- User preference for compact references

## Prompt

$shravan-dev-workflow:presentation-tui

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
