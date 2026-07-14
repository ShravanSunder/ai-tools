---
schema_version: 1
scenario_id: ops-observability-agent-vm-boundary
owner_plugin: shravan-dev-workflow
owner_skill: ops-observability-stack
skill_type: reference
prompt: |-
  $shravan-dev-workflow:ops-observability-stack

  For Agent VM and shravan-claw-beta, collapse the docs into one simple startup:
  have pnpm start bring up the local collector and Victoria services, then make
  the external path use the same wording as the deployment-owned path. Put the
  query cheat sheet in Agent VM too so agents do not need another skill.
hidden_rubric: |-
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
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: managed|external|agent vm|shravan-claw-beta|ai-tools
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: managed mode.*deployment|deployment.*managed mode
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: external mode.*ai-tools|shared.*ai-tools
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: pnpm observability:start|observability:start
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: plain.*pnpm start.*fail-open|pnpm start.*fail-open
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: dev[.]repo[.]hash|dev[.]worktree[.]hash
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
