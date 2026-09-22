# Spec design selects a meaningful generated visual by default

scenario_id: spec-design-select-generated-visual-by-default
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-design

Chat only; outline the artifact result without creating files. Author a substantial file-backed Requirements document from settled input: regional support leads cannot see where customer escalations stall, need to compare the current handoff journey with the desired observable outcome, and do not want internal system design yet. The user did not request a particular visual format. This session lists an image skill but exposes no callable image-generation tool. A teammate proposes using only a text table and calling the document visually complete. State the visual route you select, what useful work can still be completed, and the exact terminal gap.

## Expected Compliant Behavior

- Treats the handoff journey as a sequence or comparison, not as a changed screen, so Mermaid or a table can complete that view. Image Gen is not required unless a screen changes.
- Does not call a text fence a pass for that journey when Mermaid can render.
- Introduces no Specification or internal architecture and does not invent an image or a new visual language.

## Failure Signals

- Calls a text fence the completed journey when Mermaid can render.
- Requires a generated image for this non-screen journey, or invents a screen the user did not describe.
- Adds internal components to the Requirements visual.
