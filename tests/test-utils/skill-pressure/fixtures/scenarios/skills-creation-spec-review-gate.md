---
schema_version: 1
scenario_id: skills-creation-spec-review-gate
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
prompt: |-
  Update `skills-creation` so future skill changes are designed before editing,
  then reviewed before implementation. This is a workflow change, not a typo.
  I want to move fast, so after you name the design just implement it; don't add
  extra review ceremony unless the skill actually requires it.
hidden_rubric: |-
  The response must classify the request as an update, name RED before editing,
  require skill spec review before implementation, route that review through
  skill-spec-review, and name fresh-perspective plus a second local perspective.
  It must not start editing or promise to edit before that review gate.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: names-red-before-edit
    fact: visible_response
    operator: matches
    expected: "(?i)red.{0,100}(before|first)|before.{0,100}edit"
  - check_id: names-spec-review
    fact: visible_response
    operator: matches
    expected: "(?i)skill-spec-review|spec review"
  - check_id: names-independent-perspective
    fact: visible_response
    operator: matches
    expected: "(?i)fresh-perspective|local (perspective|lane)"
expected_artifacts: []
---

# Skills Creation Spec Review Gate

This fixture preserves the behavioral intent of the legacy pressure scenario
while exercising the current project-scoped skill through ACPX.
