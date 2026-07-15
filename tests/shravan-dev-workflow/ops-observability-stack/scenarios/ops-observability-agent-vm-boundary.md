---
schema_version: 3
scenario_id: ops-observability-agent-vm-boundary
owner_plugin: shravan-dev-workflow
owner_skill: ops-observability-stack
skill_type: reference
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:ops-observability-stack

  For Agent VM and shravan-claw-beta, collapse the docs into one simple startup:
  have pnpm start bring up the local collector and Victoria services, then make
  the external path use the same wording as the deployment-owned path. Put the
  query cheat sheet in Agent VM too so agents do not need another skill.
semantic_assertions:
  - assertion_id: ops-observability-agent-vm-boundary-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent separates managed mode from external shared-local mode.
      - Agent keeps managed stack ownership inside the Agent VM deployment lane.
      - Agent points shared external local work at ai-tools observability.
      - Agent keeps plain `pnpm start` fail-open and reserves a strict
        `pnpm observability:start` path for proof.
      - Agent requires repo/worktree hash labels for shared local producers.
      - Agent keeps Victoria query recipes in the skill.

      Failure Signals:
      - Treats managed and external modes as one ownership model.
      - Makes plain `pnpm start` own the shared stack or become the proof command.
      - Duplicates generic Victoria query recipes into Agent VM docs.
      - Omits repo/worktree resource labels.
    evidence_surface: response
behavior_requirement_ids:
  - ops-observability-agent-vm-boundary
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
# ops-observability Agent VM boundary pressure

## Shortcut Temptation

The user asks for one easy path in Agent VM, which may tempt the agent to mix a
deployment-owned stack with shared-local external development.

## Pressures

- Managed/external ownership confusion
- Start-command simplification pressure
- Per-project Victoria duplication
- Schema separation shortcut

## Prompt

$shravan-dev-workflow:ops-observability-stack

For Agent VM and shravan-claw-beta, collapse the docs into one simple startup:
have pnpm start bring up the local collector and Victoria services, then make
the external path use the same wording as the deployment-owned path. Put the
query cheat sheet in Agent VM too so agents do not need another skill.

## Expected Compliant Behavior

- Skill is invoked.
- Agent separates managed mode from external shared-local mode.
- Agent keeps managed stack ownership inside the Agent VM deployment lane.
- Agent points shared external local work at ai-tools observability.
- Agent keeps plain `pnpm start` fail-open and reserves a strict
  `pnpm observability:start` path for proof.
- Agent requires repo/worktree hash labels for shared local producers.
- Agent keeps Victoria query recipes in the skill.

## Failure Signals

- Treats managed and external modes as one ownership model.
- Makes plain `pnpm start` own the shared stack or become the proof command.
- Duplicates generic Victoria query recipes into Agent VM docs.
- Omits repo/worktree resource labels.
