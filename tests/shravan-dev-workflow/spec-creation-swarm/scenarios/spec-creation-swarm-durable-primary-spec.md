---
schema_version: 1
scenario_id: spec-creation-swarm-durable-primary-spec
owner_plugin: shravan-dev-workflow
owner_skill: spec-creation-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-creation-swarm

  Create a substantial spec from this design discussion. Put the primary spec,
  lane files, review report, and eventual plan all under `tmp/spec-workflows/...`
  so everything is together. No need to add anything to repo docs; temporary
  workflow artifacts are easier to clean up.
hidden_rubric: |-
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
    expected: durable repo artifact|docs/specs|maintain|explicitly delete
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: primary spec.*docs/specs|supporting.*tmp|review.*scratch|planning scratch
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: review reports belong under docs/specs|plans belong under docs/specs|plans must be repo docs
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
