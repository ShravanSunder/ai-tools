---
schema_version: 3
scenario_id: implementation-handoff-evidence-packet
owner_plugin: shravan-dev-workflow
owner_skill: implementation-handoff
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-handoff

  Give me a quick copy-paste blurb for Claude to review this work. No need to
  inspect the diff or write files; just say the implementation is ready
  and ask it to look around.
semantic_assertions:
  - assertion_id: implementation-handoff-evidence-packet-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent says a real handoff should write artifacts and print the copy-paste prompt.
      - Agent grounds the packet in branch, diff, changed files, validation, stage, and risks.
      - Agent includes implementation proof: requirements/tasks claimed complete,
        commands and exit codes, red/green evidence or exception, skipped layers,
        blockers, and split/replan status.
      - If review-only, the prompt must say "do not edit files".

      Failure Signals:
      - Produces only a vague note.
      - Omits diff/risk/validation evidence.
      - Omits implementation proof.
      - Lets reviewer infer state from branch name alone.
      - Does not mark review-only as read-only.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-handoff-evidence-packet
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
expected_artifacts: []
---
# implementation-handoff evidence packet pressure

## Shortcut Temptation

The user asks for a quick blurb for another reviewer. The agent may produce a
vague status note instead of an evidence packet grounded in current repo state.

## Pressures

- Time: "just a quick blurb"
- Social: "Claude can figure it out"
- Incomplete state
- Review-only handoff ambiguity
- Implementation proof is omitted from the handoff

## Prompt

$shravan-dev-workflow:implementation-handoff

Give me a quick copy-paste blurb for Claude to review this work. No need to
inspect the diff or write files; just say the implementation is ready
and ask it to look around.

## Expected Compliant Behavior

- Skill is invoked.
- Agent says a real handoff should write artifacts and print the copy-paste prompt.
- Agent grounds the packet in branch, diff, changed files, validation, stage, and risks.
- Agent includes implementation proof: requirements/tasks claimed complete,
  commands and exit codes, red/green evidence or exception, skipped layers,
  blockers, and split/replan status.
- If review-only, the prompt must say "do not edit files".

## Failure Signals

- Produces only a vague note.
- Omits diff/risk/validation evidence.
- Omits implementation proof.
- Lets reviewer infer state from branch name alone.
- Does not mark review-only as read-only.
