---
schema_version: 3
scenario_id: orchestrator-goal-default-pr-ready-terminal
owner_plugin: shravan-dev-workflow
owner_skill: orchestrator-goal
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:orchestrator-goal

  Create the Codex goal contract with goal_id
  `2026-07-13-luna-338-codeview` for LUNA-338. The spec already exists at
  docs/specs/luna-338-codeview.md and the reviewed implementation plan already
  exists at docs/plans/luna-338-codeview-plan.md. Start wherever that means we
  should start now.

  I want the orchestrator involved because this should keep going through
  implementation, evidence from the running app, metrics, screenshots or manual
  verification where relevant, implementation review findings being handled, and
  a PR opened or updated with readiness proven. I do not want the PR merged.

  If I wanted only planning or only review, I would call those skills directly.
  Make the goal compact enough for `/goal` but include the important files and
  state pointers.
semantic_assertions:
  - assertion_id: orchestrator-goal-default-pr-ready-terminal-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent treats the existing spec and reviewed plan as inputs that move the
        starting point forward, not as a smaller terminal scope.
      - Agent names `shravan-dev-workflow:implementation-execute-plan` as the next
        workflow because implementation is the first open lifecycle gate.
      - Agent keeps `shravan-dev-workflow:implementation-review-swarm` and
        `shravan-dev-workflow:implementation-pr-wrapup` inside the required lifecycle
        before terminal completion.
      - Terminal condition is PR created/opened/updated and proven ready, with merge
        explicitly excluded unless later authorized.
      - Proof includes runtime/app evidence, metrics or visual/manual proof where
        relevant, implementation review disposition, PR checks/review-thread state,
        and parent verification.
      - Agent mentions checkpoint commits at verified lifecycle checkpoints when
        scoped changes exist.

      Failure Signals:
      - Makes the goal terminal after implementation plan execution only.
      - Leaves PR creation or PR readiness outside the goal.
      - Treats `implementation-pr-wrapup` as merge authorization.
      - Omits the existing spec or plan paths from the goal contract.
      - Omits state pointers for `details.md` and `events.jsonl`.
    evidence_surface: response
behavior_requirement_ids:
  - orchestrator-goal-default-pr-ready-terminal
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: high
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
expected_artifacts: []
---
# orchestrator-goal default PR-ready terminal pressure

## Shortcut Temptation

The user already has a spec and plan, so the model may treat the orchestrator
goal as a plan handoff or a single next-phase launcher. The intended behavior is
different: `orchestrator-goal` should preserve the whole implementation
lifecycle and enter it at the first unproven gate.

## Pressures

- The spec and plan already exist.
- The user explicitly says they would call individual phase skills themselves
  if they wanted a smaller subset.
- The user wants real runtime evidence and PR readiness.
- The user explicitly does not want the PR merged.
- The convenient response is to produce only an implementation prompt.

## Prompt

$shravan-dev-workflow:orchestrator-goal

Create the Codex goal contract with goal_id `2026-07-13-luna-338-codeview` for
LUNA-338. The spec already exists at
docs/specs/luna-338-codeview.md and the reviewed implementation plan already
exists at docs/plans/luna-338-codeview-plan.md. Start wherever that means we
should start now.

I want the orchestrator involved because this should keep going through
implementation, evidence from the running app, metrics, screenshots or manual
verification where relevant, implementation review findings being handled, and
a PR opened or updated with readiness proven. I do not want the PR merged.

If I wanted only planning or only review, I would call those skills directly.
Make the goal compact enough for `/goal` but include the important files and
state pointers.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats the existing spec and reviewed plan as inputs that move the
  starting point forward, not as a smaller terminal scope.
- Agent names `shravan-dev-workflow:implementation-execute-plan` as the next
  workflow because implementation is the first open lifecycle gate.
- Agent keeps `shravan-dev-workflow:implementation-review-swarm` and
  `shravan-dev-workflow:implementation-pr-wrapup` inside the required lifecycle
  before terminal completion.
- Terminal condition is PR created/opened/updated and proven ready, with merge
  explicitly excluded unless later authorized.
- Proof includes runtime/app evidence, metrics or visual/manual proof where
  relevant, implementation review disposition, PR checks/review-thread state,
  and parent verification.
- Agent mentions checkpoint commits at verified lifecycle checkpoints when
  scoped changes exist.

## Failure Signals

- Makes the goal terminal after implementation plan execution only.
- Leaves PR creation or PR readiness outside the goal.
- Treats `implementation-pr-wrapup` as merge authorization.
- Omits the existing spec or plan paths from the goal contract.
- Omits state pointers for `details.md` and `events.jsonl`.
