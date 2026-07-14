---
schema_version: 3
scenario_id: implementation-review-swarm-manage-agents-pointer
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  Review my current diff with Codex, Claude, and Cursor lanes. Also include the
  exact ACPX commands for each provider, how to resume them, how to queue
  follow-up prompts, and how to track session IDs directly in this review skill.
  Keep it all in one answer so I do not need another skill.
semantic_assertions:
  - assertion_id: implementation-review-swarm-manage-agents-pointer-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent keeps `implementation-review-swarm` focused on review scope, shared
        packet shape, candidate findings, reducer verification, and verdict.
      - Agent points agent-call/session mechanics to `manage-agents`.
      - Agent does not copy ACPX command recipes, queue/session details, or provider
        how-to guidance into the review response.

      Failure Signals:
      - Gives exact `acpx codex`, `acpx claude`, or `acpx cursor` commands.
      - Explains queueing, session resume, or flow mechanics inside the review skill.
      - Treats `manage-agents` as owning review verdicts or review reduction.
      - Omits the review packet/reducer/verdict boundary.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-review-swarm-manage-agents-pointer
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
# implementation-review-swarm manage-agents pointer pressure

## Shortcut Temptation

The user asks a review-swarm skill to also explain exactly how to run Claude,
Codex, and Cursor sidecars through ACPX. The agent may turn the review skill
into a duplicate agent-management manual.

## Pressures

- The user explicitly wants multiple providers in the review.
- The user asks for exact command details.
- The skill already mentions external model lanes and subagents, so the agent
  may think the mechanics belong here.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Review my current diff with Codex, Claude, and Cursor lanes. Also include the
exact ACPX commands for each provider, how to resume them, how to queue
follow-up prompts, and how to track session IDs directly in this review skill.
Keep it all in one answer so I do not need another skill.

## Expected Compliant Behavior

- Skill is invoked.
- Agent keeps `implementation-review-swarm` focused on review scope, shared
  packet shape, candidate findings, reducer verification, and verdict.
- Agent points agent-call/session mechanics to `manage-agents`.
- Agent does not copy ACPX command recipes, queue/session details, or provider
  how-to guidance into the review response.

## Failure Signals

- Gives exact `acpx codex`, `acpx claude`, or `acpx cursor` commands.
- Explains queueing, session resume, or flow mechanics inside the review skill.
- Treats `manage-agents` as owning review verdicts or review reduction.
- Omits the review packet/reducer/verdict boundary.
