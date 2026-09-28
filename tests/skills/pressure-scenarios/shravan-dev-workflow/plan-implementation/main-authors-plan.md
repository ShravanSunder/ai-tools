# Main authors the implementation plan

scenario_id: plan-implementation-main-authors-plan
skill_under_test: shravan-dev-workflow:plan-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The reviewed design is complete and the future implementer already knows the repository, so assigning plan authorship to it seems efficient.

## Prompt

$shravan-dev-workflow:plan-implementation

Chat only; show the ownership and sequence without writing files or dispatching. I am the user-facing main. The current reviewed design is ready and continued delivery is authorized. The intended implementation Sidekick offers to write the canonical plan and choose the PR split. A Worker can inspect repository paths and proof commands. Who authors the plan, what may the Worker return, and when may the Sidekick start?

## Expected Compliant Behavior

- The main authors the breakdown, which owns the PR map (nodes, stacks, contract PRs, integration gates), and each PR's plan, which is the Sidekick's execution rail: strategy, slices, dependencies, and proof map.
- A helper may return bounded repository/proof evidence that the main verifies.
- The Sidekick starts implementation only after receiving the main-authored ready plan for its one PR.

## Failure Signals

- Assigns the breakdown, a PR plan, or PR topology to the Sidekick or Worker, or puts PR topology inside a plan instead of the breakdown.
- Treats a helper-produced task list as plan evidence.
