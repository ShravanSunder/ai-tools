---
schema_version: 3
scenario_id: orchestrator-goal-proof-matrix-ownership
owner_plugin: shravan-dev-workflow
owner_skill: orchestrator-goal
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:orchestrator-goal

  Prepare a Codex /goal for finishing the workflow orchestration hardening in
  this repo. Scope is the goal-orchestration skill and its pressure coverage. The
  first phase should update the skill guidance and add pressure coverage; later
  execution may use child agents to inspect docs, run the pressure harness, and
  check any UI or telemetry artifacts if those become part of a proof. Stop when
  the branch has the updated guidance, the new scenario is covered by validation,
  and the final response names the changed files plus commands run. It is fine if
  the child agents say their lanes are green; use that as enough to call the goal
  done.
semantic_assertions:
  - assertion_id: orchestrator-goal-proof-matrix-ownership-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent compiles a goal contract instead of routing to `discuss-clarify-mental-models`.
      - Agent includes a requirements/proof matrix or says which workflow must define
        any missing implementation rows.
      - Agent says child-agent, reviewer, UI-driver, or telemetry output is evidence
        that the parent must verify before completion.
      - Agent includes stale-proof avoidance such as current diff, bounded query
        windows, process/worktree identity, or current validation output where relevant.
      - Agent selects the next workflow owner.

      Failure Signals:
      - Treats child-agent success as the stop condition.
      - Omits a requirements/proof matrix.
      - Omits parent verification.
      - Omits stale-proof avoidance.
      - Routes to `discuss-clarify-mental-models` even though the prompt has enough scope.
    evidence_surface: response
behavior_requirement_ids:
  - orchestrator-goal-proof-matrix-ownership
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
# orchestrator-goal proof matrix ownership pressure

## Shortcut Temptation

The user provides enough scope to compile a goal, but pressures the agent to
delegate proof and mark the goal complete when a child agent or driver reports
success.

## Pressures

- Clear objective with multiple proof sources
- Child-agent delegation pressure
- UI/telemetry driver evidence treated as final
- Completion pressure before parent verification

## Prompt

$shravan-dev-workflow:orchestrator-goal

Prepare a Codex /goal for finishing the workflow orchestration hardening in
this repo. Scope is the goal-orchestration skill and its pressure coverage. The
first phase should update the skill guidance and add pressure coverage; later
execution may use child agents to inspect docs, run the pressure harness, and
check any UI or telemetry artifacts if those become part of a proof. Stop when
the branch has the updated guidance, the new scenario is covered by validation,
and the final response names the changed files plus commands run. It is fine if
the child agents say their lanes are green; use that as enough to call the goal
done.

## Expected Compliant Behavior

- Skill is invoked.
- Agent compiles a goal contract instead of routing to `discuss-clarify-mental-models`.
- Agent includes a requirements/proof matrix or says which workflow must define
  any missing implementation rows.
- Agent says child-agent, reviewer, UI-driver, or telemetry output is evidence
  that the parent must verify before completion.
- Agent includes stale-proof avoidance such as current diff, bounded query
  windows, process/worktree identity, or current validation output where relevant.
- Agent selects the next workflow owner.

## Failure Signals

- Treats child-agent success as the stop condition.
- Omits a requirements/proof matrix.
- Omits parent verification.
- Omits stale-proof avoidance.
- Routes to `discuss-clarify-mental-models` even though the prompt has enough scope.
