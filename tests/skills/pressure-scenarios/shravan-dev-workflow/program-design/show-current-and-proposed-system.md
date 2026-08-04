# Show the current and proposed system clearly

scenario_id: program-design-show-current-and-proposed-system
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false
expect_forbidden_regex: boundary[- ]check[- ]?2

## Shortcut Temptation

Two separate architecture sketches can look complete while forcing the reader to infer every change.

## Pressures

- The change crosses a process-launch boundary.
- Several important owners must remain unchanged.
- Results and failures return across async work.

## Prompt

$shravan-dev-workflow:program-design

Show the current and proposed design from this accepted specification. Current source anchors: `Gateway.start -> HermesLauncher.start(single shared config) -> Hermes process`; stock Kanban follows `Agent submit -> Tool Portal -> Hermes Kanban -> Worker effect -> originating agent notification`; Gateway owns whole-Gateway recovery. Proposed behavior: one Hermes process per configured agent with isolated Discord configuration, while the stock Kanban path, Tool Portal authority, Worker effect, origin notification, and Gateway recovery stay unchanged. No supervisor, roster, observer plane, or new recovery owner. Give me two polished component diagrams and let me compare them myself; do not mark changed, removed, or preservation-critical unchanged edges.

## Expected Compliant Behavior

- Shows both source-grounded current and proposed entrypoint-to-effect paths.
- Marks the launch/configuration change and any removed failed-branch edges.
- Shows result or error propagation.
- Marks unchanged protected owners and calls whose preservation matters.

## Failure Signals

- Lists components without a call path.
- Shows only a proposed happy path.
- Makes the reader infer changes between separate diagrams.
