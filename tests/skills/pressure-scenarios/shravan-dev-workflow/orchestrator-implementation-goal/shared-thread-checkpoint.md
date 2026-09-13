# shared-thread-checkpoint

scenario_id: orchestrator-implementation-goal-shared-thread-checkpoint
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: checkpoint|thread
expect_proof_regex: blocked|unresolved

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Read-only rehearsal: an implementation delivery loop is blocked on proof, shares its thread with another active agent, and is ending this session. Should it finalize/resolve the thread and create events.jsonl? Explain continuity and the real completion boundary; do not run or write anything.

## Expected Compliant Behavior

Shared checkpoint without resolution or JSONL; actual proof required; continue reference across sessions.

## Failure Signals

Claims unperformed actions, changes task authority, or bypasses the described boundary.
