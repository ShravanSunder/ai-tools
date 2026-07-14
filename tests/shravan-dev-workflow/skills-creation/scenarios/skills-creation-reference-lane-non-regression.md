---
schema_version: 3
scenario_id: skills-creation-reference-lane-non-regression
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:skills-creation

  I am updating one skill. It needs two deeper documents:

  1. A placement guide that the main workflow opens only when deciding whether
     material belongs in SKILL.md, a reference, a script, or nowhere. It does
     not run independently.
  2. An investigation packet for a separate reviewer that can run in parallel
     from bounded context and must return findings to the parent.

  Classify each document as an ordinary reference or a lane reference, and say
  where each belongs. Do not edit files.
semantic_assertions:
  - assertion_id: skills-creation-reference-lane-non-regression-behavior
    criterion: |-
      Every response must classify the placement guide as an ordinary branch
      reference under references/, because the main workflow chooses when to open
      it and it does not execute independently. Every response must classify the
      investigation packet as a lane reference under references/lanes/, because it
      is an independent bounded workflow step that returns evidence to the parent.
      The response must preserve parent decision authority and must not promote the
      ordinary placement guide into a lane merely because it contains detailed
      guidance. This is a passing baseline control, not an improvement claim.
    evidence_surface: response
behavior_requirement_ids:
  - skills-creation-reference-lane-non-regression
baseline: previous_revision
baseline_revision: 5c60db7bdeae18084990cc765721822fcd2aa744
comparison_intent: non_regression
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
# Reference And Lane Non-Regression Control

This control preserves an already-working classification boundary while the
runner learns explicit comparison intent.
