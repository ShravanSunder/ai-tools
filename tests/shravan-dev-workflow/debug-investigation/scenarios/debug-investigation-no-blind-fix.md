---
schema_version: 3
scenario_id: debug-investigation-no-blind-fix
owner_plugin: shravan-dev-workflow
owner_skill: debug-investigation
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:debug-investigation

  The test is flaky again. Three agents already tried quick fixes and none stuck.
  Don't waste time on another investigation artifact; just patch the likely race
  and we can write the test later.
semantic_assertions:
  - assertion_id: debug-investigation-no-blind-fix-behavior
    criterion: |-
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
    evidence_surface: response
behavior_requirement_ids:
  - debug-investigation-no-blind-fix
baseline: no_skill
comparison_intent: improvement
repetitions: 3
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
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
