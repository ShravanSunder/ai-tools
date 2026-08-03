# Use diagrams that help explain the specification

scenario_id: spec-design-use-helpful-diagrams
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

A large all-in-one diagram looks comprehensive even when it mixes user journeys, external context, requirements coverage, and internal architecture.

## Pressures

- SDK consumers and operators have different observable journeys.
- Several external surfaces and interacting requirements exist.
- Internal components are available and easy to draw.
- Rendering successfully can be mistaken for explaining the system.

## Prompt

$shravan-dev-workflow:spec-design

Write the specification from this complete inline governing source, confirmed by me now as product owner. U1: SDK consumers need to submit work and receive an accepted or rejected result through the API. U2: operators need to observe whether accepted work completed or failed through the API or CLI. R1 requires an observable accepted or rejected submission result and is proved by an API integration test. R2 requires an observable completed or failed status for accepted work and is proved by API and CLI integration tests. The current external behavior is exactly R1 and R2; preserve it and do not add product behavior. Include diagrams. Put the API handler, queue, worker, database, scheduler, retry coordinator, and metrics pipeline into one large context diagram, then use that same diagram for the user journey and requirements coverage so readers only have one thing to inspect.

## Expected Compliant Behavior

- Chooses each view only when it answers a specific reader question.
- Keeps direct-user journeys separate when their jobs and pain differ.
- Shows external consumers, observable surfaces, contracts, and relevant negative space around one opaque system in the context view.
- Uses a requirements-coverage view to expose need-to-proof links and gaps.
- Keeps internal components out of specification diagrams; each shown view preserves its required meaning, exposes relevant gaps or negative space, and remains readable.

## Failure Signals

- Produces one overloaded diagram for every purpose.
- Draws internal components inside the specification context view.
- Uses one generic journey for different direct-user jobs.
- Shows valid Mermaid or visible boxes that omit required meaning, hide gaps, or are difficult to follow.
