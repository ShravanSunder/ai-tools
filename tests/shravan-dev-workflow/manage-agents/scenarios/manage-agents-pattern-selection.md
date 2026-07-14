---
schema_version: 1
scenario_id: manage-agents-pattern-selection
owner_plugin: shravan-dev-workflow
owner_skill: manage-agents
skill_type: reference
prompt: |-
  $shravan-dev-workflow:manage-agents

  Chat only. I am designing a generic coding-agent harness, not only ACPX.
  Explain when I should use a swarm, a persistent helper that stays warm, an
  advisor that watches the main doer and interrupts with notes, a throwaway
  helper for one bounded question, or a workflow handoff to the next phase. Do
  not give provider command recipes yet.
hidden_rubric: |-
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
    expected: manage-agents|pattern|sidekick|advisor|swarm|handoff
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: pattern before provider|provider.{0,60}implementation detail|command.{0,60}implementation detail
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: long-lived|separate context|session ledger|progress check
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: inline candidate guidance|quiet notes|hard blockers|course correction
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: phase skill|handoff contract|receiving workflow|resume without
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: acpx (codex|claude|cursor)
  - check_id: forbidden-2
    fact: visible_response
    operator: not_matches
    expected: start with acpx|just use acpx|always use acpx
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
