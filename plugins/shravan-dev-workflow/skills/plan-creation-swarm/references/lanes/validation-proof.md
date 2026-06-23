# validation-proof

Use when the plan must map requirements to concrete proof. This lane turns spec
proof expectations into commands, manual procedures, evidence sources,
freshness guards, and testing-pyramid layers.

## Owns

- Requirement-to-proof mapping.
- Testing-pyramid coverage: unit, integration, smoke, e2e, PR/release as needed.
- Manual UX, visual, data/state, logs, traces, metrics, OTel, artifact, and CI
  proof where the product surface requires them.
- Red/green expectations for behavior changes.

## Leaves To Parent

- Final command table shape.
- Whether a proof gap routes to spec creation or plan splitting.
- Execution sequencing.

## Method

1. Load the accepted source artifact directly.
2. Extract proof expectations and material requirements.
3. Inspect repo-local test, lint, build, smoke, e2e, and release commands.
4. Map each requirement to the cheapest sufficient proof ladder.
5. Flag tasks whose proof is too large and should be split before execution.

## Return Focus

- `primary_sources_loaded`
- candidate requirements/proof matrix rows
- command/manual proof rows with expected signals
- proof layer and evidence source
- freshness guard and red/green requirement
- split/replan triggers
