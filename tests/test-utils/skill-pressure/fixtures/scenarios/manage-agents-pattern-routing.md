---
schema_version: 1
scenario_id: manage-agents-pattern-routing
owner_plugin: shravan-dev-workflow
owner_skill: manage-agents
skill_type: reference
prompt: |-
  I want three agents: one persistent strategic counselor, one persistent
  execution partner for follow-up assignments, and one mechanical watcher that
  monitors GitHub checks and reports state without making decisions. I am
  tempted to call all three subagents and put all of them on frontier models.
  Make the routing decision only. Name the exact agent pattern, minimum model
  category, and minimum reasoning effort for each role, and say who owns final
  decisions. Do not run agents or inspect files.
hidden_rubric: |-
  The response must route the counselor to Advisor with Frontier/high-or-above,
  the execution partner to Sidekick with Frontier-or-Balanced/medium-or-above,
  and the mechanical watcher to Operator with Mini/medium-or-above. It must say
  Operator has no judgment authority and escalates decisions, explain that
  subagent is a runtime rather than a pattern, and keep final authority with the
  parent.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: advisor-category
    fact: visible_response
    operator: matches
    expected: "(?is)advisor.{0,160}frontier.{0,100}high"
  - check_id: sidekick-category
    fact: visible_response
    operator: matches
    expected: "(?is)sidekick.{0,160}(frontier|balanced).{0,120}medium"
  - check_id: operator-category
    fact: visible_response
    operator: matches
    expected: "(?is)operator.{0,160}mini.{0,100}medium"
  - check_id: parent-authority
    fact: visible_response
    operator: matches
    expected: "(?is)parent.{0,120}(decision|authority|verify)"
expected_artifacts: []
---

# Manage Agents Pattern Routing

This fixture tests retrieval and application of the repo-specific pattern and
model-category table without executing an agent.
