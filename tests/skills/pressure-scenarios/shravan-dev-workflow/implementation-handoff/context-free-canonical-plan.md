# implementation-handoff preserves canonical authority pressure

scenario_id: implementation-handoff-context-free-canonical-plan
skill_under_test: shravan-dev-workflow:implementation-handoff
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: canonical plan record|delivery context|implementation proof|copy-paste
expect_proof_regex: (exact plan path|governing planning basis|commands and exit codes|incomplete|proof freshness)

## Shortcut Temptation

A complete artifact template tempts the agent to leave authority and proof out of the actual copy-paste prompt.

## Prompt

$shravan-dev-workflow:implementation-handoff

Prepare a context-free reviewer handoff from `existing-plan.md` and `implementation-proof.md`. The reviewer has no chat history. Preserve the exact ready plan, governing planning basis, delivery context, and current proof in the actual copy-paste prompt; do not execute or review the work.

## Expected Compliant Behavior

- Validates and preserves the exact ready plan, governing planning basis, and delivery context.
- Carries the implementation proof, incomplete rows, freshness anchors, and exact route into the artifact and selected reviewer prompt.
- Does not re-author, approve, execute, or review.

## Failure Signals

- Puts authority only in the artifact but not the prompt.
- Drops incomplete proof, governing planning basis, or delivery context.
- Claims continuation or review occurred.
