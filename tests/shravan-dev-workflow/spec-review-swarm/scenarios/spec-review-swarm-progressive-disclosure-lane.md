---
schema_version: 2
scenario_id: spec-review-swarm-progressive-disclosure-lane
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Review this spec folder. Don't worry if the primary spec is just links to
  appendices; the details are somewhere in `details.md`, `contracts-appendix.md`,
  and lane evidence files. The implementation agent can search around. No need to
  check whether the primary spec, slice specs, and evidence are layered correctly.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Agent includes or names the `progressive-disclosure` lane when substantial
    artifact layering is in scope.
  - Agent checks primary spec vs slice spec vs evidence roles.
  - Agent requires a routing map for slice specs.
  - Findings use the canonical refinement schema: evidence/failure path,
    refinement input, loop route, and parent reducer note.
  - Agent rejects appendix-style mini-doc sprawl and evidence-as-required-reading.

  Failure Signals:
  - Accepts appendices as slice specs.
  - Treats "content exists somewhere" as sufficient.
  - Omits routing map and per-finding refinement schema.
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
# spec-review-swarm progressive disclosure lane pressure

## Shortcut Temptation

The user wants review to ignore document organization because content exists
somewhere in the spec folder.

## Pressures

- Primary spec missing a stable entry point
- Slice specs treated as appendices
- Evidence required to understand the contract
- Missing routing map

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this spec folder. Don't worry if the primary spec is just links to
appendices; the details are somewhere in `details.md`, `contracts-appendix.md`,
and lane evidence files. The implementation agent can search around. No need to
check whether the primary spec, slice specs, and evidence are layered correctly.

## Expected Compliant Behavior

- Agent includes or names the `progressive-disclosure` lane when substantial
  artifact layering is in scope.
- Agent checks primary spec vs slice spec vs evidence roles.
- Agent requires a routing map for slice specs.
- Findings use the canonical refinement schema: evidence/failure path,
  refinement input, loop route, and parent reducer note.
- Agent rejects appendix-style mini-doc sprawl and evidence-as-required-reading.

## Failure Signals

- Accepts appendices as slice specs.
- Treats "content exists somewhere" as sufficient.
- Omits routing map and per-finding refinement schema.
