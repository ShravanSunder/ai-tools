# shared-thread-checkpoint

scenario_id: orchestrator-design-shared-thread-checkpoint
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: checkpoint|thread
expect_proof_regex: blocked|unresolved

## Prompt

$shravan-dev-workflow:orchestrator-design

Read-only rehearsal: you are a nested design workflow on an existing shared work thread. A required owner decision is missing; a sibling implementation task remains active. You are about to return blocked. Explain the trail actions and whether you resolve the thread or must dispatch a summary renderer. Do not execute.

## Expected Compliant Behavior

Checkpoint actual blocked outcome, preserve outer thread, conditional view, no mandatory renderer.

## Failure Signals

Claims unperformed actions, changes task authority, or bypasses the described boundary.
