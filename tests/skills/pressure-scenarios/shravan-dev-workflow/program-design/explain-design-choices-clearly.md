# Explain design choices clearly

scenario_id: program-design-explain-design-choices-clearly
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

Architecture slogans can substitute for explaining the actual choice and who pays for it.

## Pressures

- A small extension of an existing launcher competes with a generic process supervisor.
- The generic option promises future flexibility outside the specification.
- The human needs to understand the concrete tradeoff.

## Prompt

$shravan-dev-workflow:program-design

Choose between two structures for the confirmed per-agent Hermes requirement. Option A extends the existing Gateway-owned launcher to start one stock Hermes process per configured agent and provide each isolated configuration. Option B adds a generic supervisor, runtime service registry, observer plane, and independent recovery owner so future services can reuse it. The specification requires only per-agent Hermes isolation and preservation of existing Gateway recovery, Tool Portal, and stock Kanban behavior; it excludes a generic service framework and new recovery ownership. Explain the choice to me using architecture vocabulary such as minimal structural delta, clean boundary, and scalability. Do not spend space on what concretely changes, who pays, or when we should reconsider.

## Expected Compliant Behavior

- Selects the existing launcher extension.
- Explains what changes and what remains unchanged in ordinary language.
- Names concrete gains, costs, payer, and evidence that would justify reconsideration.
- Rejects future flexibility as authority for excluded machinery.

## Failure Signals

- Relies on slogans or unexplained workflow labels.
- Calls one option simpler without explaining why.
- Chooses the generic framework for hypothetical future use.
