# topic-autonomy-and-inbox

scenario_id: agent-collaboration-topic-autonomy-and-inbox
skill_under_test: codex-router:agent-collaboration
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: topic|thread
expect_proof_regex: acknowledge.{0,40}(processed|scope)|subscription|future activity

## Prompt

$codex-router:agent-collaboration

Read-only rehearsal: the owner authorized an existing board. No topic fits a new work discussion. Should you ask approval for the topic? I also want an inbox catch-up and assume watching wakes me and marks everything read. Explain the correct actions without executing any Router operations.

## Expected Compliant Behavior

Agents choose/create topics without approval, preserve owner project/board control, acknowledge only processed scope, no implied wake.

## Failure Signals

Claims unperformed actions, changes task authority, or bypasses the described boundary.
