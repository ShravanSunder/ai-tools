---
schema_version: 3
scenario_id: manage-agents-pattern-selection
owner_plugin: shravan-dev-workflow
owner_skill: manage-agents
skill_type: reference
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:manage-agents

  Chat only. I am designing a generic coding-agent harness, not only ACPX.
  Explain when I should use a swarm, a persistent helper that stays warm, an
  advisor that watches the main doer and interrupts with notes, a throwaway
  helper for one bounded question, or a workflow handoff to the next phase. Do
  not give provider command recipes yet.
semantic_assertions:
  - assertion_id: manage-agents-pattern-selection-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent chooses the orchestration pattern before any provider or command.
      - Agent distinguishes swarm breadth from persistent sidekick continuity.
      - Agent describes advisor notes as candidate guidance, not final authority.
      - Agent distinguishes ephemeral one-shot subagents from workflow handoffs.
      - Agent does not give ACPX command recipes.

      Failure Signals:
      - Starts with `acpx` commands or provider setup.
      - Treats advisor, sidekick, swarm, and ephemeral helper as synonyms.
      - Gives the advisor final authority instead of parent-owned reduction.
      - Omits workflow handoff as a separate pattern.
    evidence_surface: response
behavior_requirement_ids:
  - manage-agents-pattern-selection
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
# manage-agents pattern selection pressure

## Shortcut Temptation

The user asks for a generic multi-agent harness model, but the existing skill
has many ACPX details. The agent may jump straight to provider commands instead
of explaining which subordinate-agent pattern fits.

## Pressures

- The user names swarms, sidekicks, advisors, ephemeral subagents, and workflow
  handoffs in one messy request.
- The skill has ACPX references and examples nearby.
- The agent may treat every helper as a persistent sidekick or every
  multi-agent task as a swarm.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. I am designing a generic coding-agent harness, not only ACPX.
Explain when I should use a swarm, a persistent helper that stays warm, an
advisor that watches the main doer and interrupts with notes, a throwaway
helper for one bounded question, or a workflow handoff to the next phase. Do
not give provider command recipes yet.

## Expected Compliant Behavior

- Skill is invoked.
- Agent chooses the orchestration pattern before any provider or command.
- Agent distinguishes swarm breadth from persistent sidekick continuity.
- Agent describes advisor notes as candidate guidance, not final authority.
- Agent distinguishes ephemeral one-shot subagents from workflow handoffs.
- Agent does not give ACPX command recipes.

## Failure Signals

- Starts with `acpx` commands or provider setup.
- Treats advisor, sidekick, swarm, and ephemeral helper as synonyms.
- Gives the advisor final authority instead of parent-owned reduction.
- Omits workflow handoff as a separate pattern.
