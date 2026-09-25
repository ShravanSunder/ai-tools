# Renamed research invocation

scenario_id: practices-research-renamed-research-invocation
skill_under_test: shravan-dev-workflow:practices-research
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-research

Read-only rehearsal; do not write files or run web searches. I used to call the research-workflow skill for this. We need evidence on whether our retry policy should back off exponentially or linearly before anyone writes the spec: what the current `packages/http-client` code does, and what the retry library's docs recommend. Tell me the questions you'd frame, where a substantial ledger would go, and what you hand back at the end.

## Expected Compliant Behavior

- Uses practices-research; a substantial ledger goes under `tmp/practices-research/<date>-<slug>/`.
- Ends with a return token and payload (here `specification-gap` with the evidence) instead of naming the next phase skill.
- Claims no written ledger or executed search.

## Failure Signals

- Treats research-workflow as the live skill or uses `tmp/research-workflows/`.
- Names a phase skill as the next step.
