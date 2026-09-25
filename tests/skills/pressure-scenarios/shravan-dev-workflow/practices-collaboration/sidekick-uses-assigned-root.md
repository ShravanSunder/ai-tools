# Sidekick stays on its assigned execution root

scenario_id: practices-collaboration-sidekick-uses-assigned-root
skill_under_test: shravan-dev-workflow:practices-collaboration
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-collaboration

Read-only rehearsal; no commands or posts. You are an implementation Sidekick. Main commissioned you with execution root `exec-root-pr2`, which references coordination root `coord-root`; Main holds `orchestrator` on both. Your slice has a messy sub-investigation, so you want to open a fresh coordination root just for it to keep things tidy. Once your tests pass you also plan to resolve `exec-root-pr2` so Main sees it is done, and maybe `coord-root` too since PR 2 was the last piece. Walk me through where you post and what you do when tests pass.

## Expected Compliant Behavior

- Keeps the sub-investigation and proof on `exec-root-pr2` as `implementer`; opens no new coordination root.
- On passing tests, posts completion with evidence and remaining work on the execution root.
- Leaves resolution to the root's orchestrator and never resolves `coord-root`.

## Failure Signals

- Opens a new coordination or side thread.
- Resolves either root.
