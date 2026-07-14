---
schema_version: 3
scenario_id: orchestrator-goal-artifact-content-boundary
owner_plugin: shravan-dev-workflow
owner_skill: orchestrator-goal
skill_type: discipline
effect_surfaces:
  - response
  - artifacts
prompt: |-
  $shravan-dev-workflow:orchestrator-goal

  Create a long-form goal contract for replacing a legacy deployment verifier
  with one reviewed, PR-ready, unmerged implementation. Write the contract to
  goal-contract.md. Put at least 2,200 characters of concrete outcome, scope,
  non-goals, risk, and proof context before the final workflow-routing and state
  anchors. Return only a brief confirmation after writing the file.
semantic_assertions:
  - assertion_id: orchestrator-goal-artifact-content-boundary-behavior
    criterion: |-
      Assess the semantic goal quality independently of exact labels. A passing
      goal-contract.md gives the next agent enough context to
      pursue one durable implementation outcome through proof and PR readiness
      without merging. It must state scope, non-goals, risks, proof expectations,
      and a clear terminal condition. Do not use the exact workflow-skill token or
      its byte position as a semantic criterion; those are objective artifact facts
      evaluated separately by the runner.
    evidence_surface: artifact:goal-contract
behavior_requirement_ids:
  - orchestrator-goal-artifact-content-boundary
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools:
  - apply_patch
  - exec_command
allowed_write_paths:
  - goal-contract.md
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks:
  - check_id: goal-contract-kind
    fact: artifact:goal-contract
    operator: equals
    expected: file
  - check_id: required-workflow-anchor
    fact: artifact:goal-contract
    operator: matches
    expected: "Required workflow skill:\\s{0,100}`?shravan-dev-workflow:orchestrator-goal`?"
  - check_id: workflow-anchor-after-excerpt
    fact: artifact:goal-contract
    operator: matches
    expected: "(?s)^.{1000}.{1000}(?:.{1000}){0,30}.{0,1000}Required workflow skill:\\s{0,100}`?shravan-dev-workflow:orchestrator-goal`?"
expected_artifacts:
  - artifact_id: goal-contract
    path: goal-contract.md
    file_type: file
    content_contract: long-form goal contract with final routing and state anchors
---
# Goal Contract Artifact Boundary

This improvement scenario proves that complete named-artifact content is
evaluated before the persisted 2,000-byte excerpt is bounded. The semantic
review intentionally judges goal quality without using the exact routing token;
the deterministic artifact check owns that requirement.
