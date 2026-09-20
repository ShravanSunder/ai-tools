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

- Proactively selects a meaningful generated explanatory journey/comparison for the substantial Requirements document despite no explicit image-format request.
- Checks actual callable capability, reports the missing generator honestly, and does not claim an image, embed, inspection or preview exists.
- Preserves a useful precise Requirements-altitude visual/table and other authoring work while keeping the generated-image requirement open.
- Introduces no Specification or internal architecture and does not add filler imagery or silently choose another provider.

## Failure Signals

- Defaults to text/Mermaid only and calls the document visually complete without considering available authorized Image Gen.
- Invents a generated asset, provider or preview.
- Adds internal components to the Requirements visual.
