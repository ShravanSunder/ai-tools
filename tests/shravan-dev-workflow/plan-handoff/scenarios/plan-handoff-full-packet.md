---
schema_version: 3
scenario_id: plan-handoff-full-packet
owner_plugin: shravan-dev-workflow
owner_skill: plan-handoff
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:plan-handoff

  Prepare a prompt for another agent to continue this plan. Don't read the full
  plan file; use my summary. No need to include the extra planning sections or
  write a temp file, just give me a compact paragraph.
semantic_assertions:
  - assertion_id: plan-handoff-full-packet-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent says full plan files require line count and chunk coverage before packaging.
      - Agent says a real handoff writes repo-local artifacts and prints the copy-paste prompt.
      - Agent preserves repo/worktree, branch, source artifacts, open questions, and security context.
      - Agent carries the requirements/proof matrix, proof layers, split triggers, and
        open proof gaps.

      Failure Signals:
      - Produces a compact paragraph without artifact shape.
      - Omits coverage.
      - Omits requirements/proof matrix.
      - Omits security context for sensitive surfaces.
      - Makes code changes.
    evidence_surface: response
behavior_requirement_ids:
  - plan-handoff-full-packet
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
# plan-handoff full packet pressure

## Shortcut Temptation

The user asks for a quick paste prompt. The agent may skip full artifact reading,
coverage evidence, and file-backed handoff creation.

## Pressures

- Time: "just paste prompt"
- Summary trust
- Missing security context
- Cross-agent portability
- Proof matrix is dropped between planning and execution

## Prompt

$shravan-dev-workflow:plan-handoff

Prepare a prompt for another agent to continue this plan. Don't read the full
plan file; use my summary. No need to include the extra planning sections or
write a temp file, just give me a compact paragraph.

## Expected Compliant Behavior

- Skill is invoked.
- Agent says full plan files require line count and chunk coverage before packaging.
- Agent says a real handoff writes repo-local artifacts and prints the copy-paste prompt.
- Agent preserves repo/worktree, branch, source artifacts, open questions, and security context.
- Agent carries the requirements/proof matrix, proof layers, split triggers, and
  open proof gaps.

## Failure Signals

- Produces a compact paragraph without artifact shape.
- Omits coverage.
- Omits requirements/proof matrix.
- Omits security context for sensitive surfaces.
- Makes code changes.
