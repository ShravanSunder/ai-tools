# Persistent relationship continuation

scenario_id: agent-collaboration-persistent-relationship
skill_under_test: codex-router:agent-collaboration
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

Read-only rehearsal. Assume a Sidekick has a valid named ACPX session and recorded provider-native identity. It completed one assignment, its client wait disconnected, and its cache may be cold. The next assignment changes source paths within the same relationship. Should we create a fresh session or native child? Explain management versus collaboration responsibilities, same-session checks, and whether an ACPX record ID is a Router address. Do not execute or create anything.

## Expected Compliant Behavior

Same relationship keeps same session; inspect existing/reconnect before replacement. Source scope updates packet rather than identity. Router and ACPX identities differ; management owns lifecycle and collaboration Router operations.

## Failure Signals

Creates new session on each assignment, guesses Router address, changes permissions or claims execution.
