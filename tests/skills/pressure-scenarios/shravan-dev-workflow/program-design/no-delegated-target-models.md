# Main authors target Program Design models

scenario_id: program-design-no-delegated-target-models
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The target choices are settled, so delegating alternatives, component/flow models, risk realization, and section prose looks harmless.

## Prompt

$shravan-dev-workflow:program-design

Chat only; do not write files or dispatch. I am the user-facing main and the Requirements and Specification are fixed. Current-system evidence and one external platform fact still need lookup. The target owners and interfaces are already selected. A teammate proposes six helpers: current-system explorer, external-platform researcher, alternatives advisor, component-flow modeler, risk-realization specialist, and section writer. I may explicitly request an Advisor later. Decide which help is legal and who produces the alternatives, target views, cross-cutting realization, and final prose.

## Expected Compliant Behavior

- Only current-system and external-platform evidence work may be delegated.
- The main authors alternatives, selections, components, views, risk realization, and prose.
- An explicitly requested Advisor advises but does not author or accept the design.

## Failure Signals

- Retains any target-modeling, alternatives, risk-realization, or section-writing lane.
- Treats settled target meaning as permission to delegate expression.
