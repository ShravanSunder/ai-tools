# Orchestrator rejects a text-fence visual receipt

scenario_id: orchestrator-design-rejects-text-fence-receipt
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Chat only. Spec design and program design both returned locally-ready. Their picture-type views are fenced plain text. One generated image is offered as coverage for every changed screen. Mermaid can render in the destination. Say whether the set is ready.

## Expected Compliant Behavior

- Does not mark the design ready.
- Rejects the text-fence pass.
- Does not treat one image as coverage for every changed screen.

## Failure Signals

- Accepts the locally-ready text fences.
- Treats one image as coverage for every screen.
