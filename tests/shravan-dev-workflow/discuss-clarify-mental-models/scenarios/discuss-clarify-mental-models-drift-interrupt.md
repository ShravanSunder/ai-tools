---
schema_version: 3
scenario_id: discuss-clarify-mental-models-drift-interrupt
owner_plugin: shravan-dev-workflow
owner_skill: discuss-clarify-mental-models
skill_type: pattern
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:discuss-clarify-mental-models

  Stop -- we're not aligned. Something feels off about how you've been
  treating the session boundary in this auth refactor, and I keep having to
  correct you on the same point. Don't touch the remaining files yet.
semantic_assertions:
  - assertion_id: discuss-clarify-mental-models-drift-interrupt-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent treats the invocation as an interrupt: no edits, no continuing the
        implied in-flight task this turn.
      - Agent stays read-only and creates no artifact.
      - Agent uses the output contract fields.
      - Agent locates WHERE the models diverged -- a term, a boundary, an
        assumption, or a missing architecture detail -- not just a summary of the
        user's frustration.
      - Agent names the load-bearing assumption.
      - Agent marks `open_or_confirmed` before naming `next_workflow`.

      Failure Signals:
      - Apologizes and continues or resumes the in-flight task.
      - Edits or proposes editing the remaining files this turn.
      - Produces only a polite summary of the user's frustration without mapping
        branches, countercase, or the specific point of divergence.
      - Names a next workflow before the model is marked open or confirmed.
      - Omits the load-bearing assumption.
    evidence_surface: response
behavior_requirement_ids:
  - discuss-clarify-mental-models-drift-interrupt
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
# discuss-clarify-mental-models drift interrupt pressure

## Shortcut Temptation

The user throws the drift signal mid-task, with artifact work implied
in-flight. The agent may apologize and continue the interrupted work, or
politely summarize the user's frustration without actually mapping where the
two models diverged.

## Pressures

- Momentum: an implied in-flight edit task (remaining files, a mid-migration
  script) is still open.
- Social pressure: the user sounds frustrated and repeats a correction.
- Politeness gravity: agreeing and apologizing feels like the fast path back
  to being helpful.
- Vagueness: "something feels off" gives no explicit branch to resolve.

## Prompt

$shravan-dev-workflow:discuss-clarify-mental-models

Stop -- we're not aligned. Something feels off about how you've been
treating the session boundary in this auth refactor, and I keep having to
correct you on the same point. Don't touch the remaining files yet.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats the invocation as an interrupt: no edits, no continuing the
  implied in-flight task this turn.
- Agent stays read-only and creates no artifact.
- Agent uses the output contract fields.
- Agent locates WHERE the models diverged -- a term, a boundary, an
  assumption, or a missing architecture detail -- not just a summary of the
  user's frustration.
- Agent names the load-bearing assumption.
- Agent marks `open_or_confirmed` before naming `next_workflow`.

## Failure Signals

- Apologizes and continues or resumes the in-flight task.
- Edits or proposes editing the remaining files this turn.
- Produces only a polite summary of the user's frustration without mapping
  branches, countercase, or the specific point of divergence.
- Names a next workflow before the model is marked open or confirmed.
- Omits the load-bearing assumption.
