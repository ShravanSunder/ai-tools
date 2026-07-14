---
schema_version: 3
scenario_id: spec-creation-swarm-durable-primary-spec
owner_plugin: shravan-dev-workflow
owner_skill: spec-creation-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:spec-creation-swarm

  Create a substantial spec from this design discussion. Put the primary spec,
  lane files, review report, and eventual plan all under `tmp/spec-workflows/...`
  so everything is together. No need to add anything to repo docs; temporary
  workflow artifacts are easier to clean up.
semantic_assertions:
  - assertion_id: spec-creation-swarm-durable-primary-spec-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Agent distinguishes primary specs from supporting workflow artifacts.
      - Agent says the primary spec should be a durable repo artifact under
        `docs/specs/` because specs are maintained alignment contracts that future
        humans and agents revise or explicitly delete.
      - Agent keeps lane files, research evidence, review reports, and planning
        scratch in repo-local `tmp/` unless the user explicitly asks to promote them.
      - Agent does not claim plans must be repo docs.

      Failure Signals:
      - Puts the primary spec only under `tmp/spec-workflows`.
      - Promotes review reports or plans into the specs directory by default.
      - Treats specs, plans, reviews, and lane evidence as one lifecycle.
    evidence_surface: response
behavior_requirement_ids:
  - spec-creation-swarm-durable-primary-spec
baseline: no_skill
comparison_intent: improvement
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
# spec-creation-swarm durable primary spec pressure

## Shortcut Temptation

The user asks for a substantial spec and says it can live with the swarm
research, review report, and future plan under `tmp/` because everything is
just workflow output.

## Pressures

- Treating the primary spec as scratch
- Promoting review reports and plans just because the spec is promoted
- Forgetting that maintained specs have a different lifecycle from supporting
  research and review artifacts

## Prompt

$shravan-dev-workflow:spec-creation-swarm

Create a substantial spec from this design discussion. Put the primary spec,
lane files, review report, and eventual plan all under `tmp/spec-workflows/...`
so everything is together. No need to add anything to repo docs; temporary
workflow artifacts are easier to clean up.

## Expected Compliant Behavior

- Agent distinguishes primary specs from supporting workflow artifacts.
- Agent says the primary spec should be a durable repo artifact under
  `docs/specs/` because specs are maintained alignment contracts that future
  humans and agents revise or explicitly delete.
- Agent keeps lane files, research evidence, review reports, and planning
  scratch in repo-local `tmp/` unless the user explicitly asks to promote them.
- Agent does not claim plans must be repo docs.

## Failure Signals

- Puts the primary spec only under `tmp/spec-workflows`.
- Promotes review reports or plans into the specs directory by default.
- Treats specs, plans, reviews, and lane evidence as one lifecycle.
