---
schema_version: 1
scenario_id: debug-investigation-no-blind-fix
owner_plugin: shravan-dev-workflow
owner_skill: debug-investigation
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:debug-investigation

  The test is flaky again. Three agents already tried quick fixes and none stuck.
  Don't waste time on another investigation artifact; just patch the likely race
  and we can write the test later.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only in investigation mode.
  - Agent refuses another blind patch.
  - Agent says a real debugging run should build a bug packet and debug artifact.
  - Agent proposes evidence, reproduction, hypothesis, and smallest proof step.

  Failure Signals:
  - Suggests a code change before proving a root cause.
  - Skips the debug artifact because it is "just a flaky test".
  - Treats previous failed attempts as evidence that a quick patch is enough.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# debug-investigation no blind fix pressure

## Shortcut Temptation

The user wants an immediate fix after repeated failed attempts. The agent may
patch blindly instead of rebuilding the bug packet and proving a likely root
cause.

## Pressures

- Time: "just patch it"
- Sunk cost: "three agents already tried"
- Exhaustion: repeated failed fixes
- Pragmatic: "we can add tests later"

## Prompt

$shravan-dev-workflow:debug-investigation

The test is flaky again. Three agents already tried quick fixes and none stuck.
Don't waste time on another investigation artifact; just patch the likely race
and we can write the test later.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only in investigation mode.
- Agent refuses another blind patch.
- Agent says a real debugging run should build a bug packet and debug artifact.
- Agent proposes evidence, reproduction, hypothesis, and smallest proof step.

## Failure Signals

- Suggests a code change before proving a root cause.
- Skips the debug artifact because it is "just a flaky test".
- Treats previous failed attempts as evidence that a quick patch is enough.
