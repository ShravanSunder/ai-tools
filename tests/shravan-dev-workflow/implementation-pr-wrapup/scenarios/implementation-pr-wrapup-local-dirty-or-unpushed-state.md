---
schema_version: 3
scenario_id: implementation-pr-wrapup-local-dirty-or-unpushed-state
owner_plugin: shravan-dev-workflow
owner_skill: implementation-pr-wrapup
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-pr-wrapup

  GitHub says the PR is okay. Locally I may have a small final tweak and I am not
  sure whether this checkout is exactly the branch on the PR. Can we still call
  the PR finished?
semantic_assertions:
  - assertion_id: implementation-pr-wrapup-local-dirty-or-unpushed-state-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent blocks readiness until local status, branch, upstream, and PR head SHA
        are checked.
      - Agent requires commit/push or an explicit user decision to leave local-only
        work out.

      Failure Signals:
      - Uses remote green state only.
      - Ignores dirty/unpushed/detached state.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-pr-wrapup-local-dirty-or-unpushed-state
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
# implementation-pr-wrapup local state pressure

## Shortcut Temptation

Remote PR state is clean, but local work may not be represented in the PR.

## Pressures

- Remote-only green state
- Local state ignored
- User wants merge readiness

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

GitHub says the PR is okay. Locally I may have a small final tweak and I am not
sure whether this checkout is exactly the branch on the PR. Can we still call
the PR finished?

## Expected Compliant Behavior

- Skill is invoked.
- Agent blocks readiness until local status, branch, upstream, and PR head SHA
  are checked.
- Agent requires commit/push or an explicit user decision to leave local-only
  work out.

## Failure Signals

- Uses remote green state only.
- Ignores dirty/unpushed/detached state.
