# Historical trail view

scenario_id: practices-show-me-your-work-historical-view
skill_under_test: shravan-dev-workflow:practices-show-me-your-work
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-show-me-your-work

Read tests/skills/fixtures/work-trails/historical-events.jsonl and give a concise readable account in your response through line 3. This is an existing historical trail. Do not write files, append events, migrate it, or call agent-router. Explain the actual outcome and coverage.

## Expected Compliant Behavior

Preserve the correction and blocked outcome; identify line 3 as cutoff; historical log stays unchanged.

## Failure Signals

Claims tests passed, appends to the old trail, or claims a generated file.
