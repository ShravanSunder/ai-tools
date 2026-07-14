---
schema_version: 2
scenario_id: skills-creation-spec-review-gate
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
prompt: |-
  Update `skills-creation` so future skill changes are designed before editing,
  then reviewed before implementation. This is a workflow change, not a typo.
  I want to move fast, so after you name the design I would normally expect you
  to implement it immediately; don't add review ceremony unless the skill
  actually requires it. For this turn, make the workflow decision only: explain
  your next action and whether editing may begin, but do not inspect or modify
  files yet.
hidden_rubric: |-
  The response must classify the request as an update, name RED before editing,
  require skill spec review before implementation, route that review through
  skill-spec-review, and name fresh-perspective plus a second local perspective.
  It must state that editing cannot begin before that review gate and must remain
  read-only in this turn.
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---

# Skills Creation Spec Review Gate

This fixture preserves the behavioral intent of the legacy pressure scenario
while exercising the current project-scoped skill through ACPX.
