---
schema_version: 1
scenario_id: spec-creation-swarm-spec-folder-chunking
owner_plugin: shravan-dev-workflow
owner_skill: spec-creation-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-creation-swarm

  Make a spec folder, but split it into `requirements-appendix.md`,
  `contracts-appendix.md`, `details.md`, `misc.md`, and `part-2.md` so no file is
  too dense. The primary file can just link to those appendices. No need for a
  routing map; agents can inspect the appendices if they need detail.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Agent rejects appendix-style splitting by reading depth.
  - Agent keeps one durable primary repo spec file with PRD/product intent,
    requirements overview, core technical contract, proof expectations, and open
    decisions.
  - Agent keeps supporting lane/research/review scratch under `tmp/` unless
    explicitly promoted.
  - Agent allows slice specs only for vertical slices, app protocols, ownership
    boundaries, domain boundaries, or shared lower-level contracts.
  - Agent includes a routing map that names which slice spec to read for each
    touched boundary.
  - Agent enforces a hard 2000-line cap per spec artifact file.

  Failure Signals:
  - Uses generic appendix names.
  - Hides core PRD/requirements/contract in supporting files.
  - Creates many tiny files with no vertical slice or ownership reason.
  - Omits a routing map.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# spec-creation-swarm spec folder chunking pressure

## Shortcut Temptation

The user suggests splitting the spec into generic appendices and many tiny
files because the primary spec might get long.

## Pressures

- Appendix-style split by reading depth
- Mini-file sprawl
- Missing routing map
- Core requirements hidden outside the primary spec

## Prompt

$shravan-dev-workflow:spec-creation-swarm

Make a spec folder, but split it into `requirements-appendix.md`,
`contracts-appendix.md`, `details.md`, `misc.md`, and `part-2.md` so no file is
too dense. The primary file can just link to those appendices. No need for a
routing map; agents can inspect the appendices if they need detail.

## Expected Compliant Behavior

- Agent rejects appendix-style splitting by reading depth.
- Agent keeps one durable primary repo spec file with PRD/product intent,
  requirements overview, core technical contract, proof expectations, and open
  decisions.
- Agent keeps supporting lane/research/review scratch under `tmp/` unless
  explicitly promoted.
- Agent allows slice specs only for vertical slices, app protocols, ownership
  boundaries, domain boundaries, or shared lower-level contracts.
- Agent includes a routing map that names which slice spec to read for each
  touched boundary.
- Agent enforces a hard 2000-line cap per spec artifact file.

## Failure Signals

- Uses generic appendix names.
- Hides core PRD/requirements/contract in supporting files.
- Creates many tiny files with no vertical slice or ownership reason.
- Omits a routing map.
