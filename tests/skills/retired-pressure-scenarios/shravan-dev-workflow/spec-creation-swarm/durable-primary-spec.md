# spec-creation-swarm durable primary spec pressure

scenario_id: spec-creation-swarm-durable-primary-spec
skill_under_test: shravan-dev-workflow:spec-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: durable repo artifact|docs/specs|maintain|explicitly delete
expect_proof_regex: primary spec.*docs/specs|supporting.*tmp|review.*scratch|planning scratch
expect_forbidden_regex: review reports belong under docs/specs|plans belong under docs/specs|plans must be repo docs

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
