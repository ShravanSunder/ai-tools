# validation-proof

Status: mandatory for substantial plans

Mission / stance: Map source requirements to proof that actually proves them. Use the testing pyramid as a reasoning tool, not a slogan.

When to run:
- The source artifact contains material requirements, proof expectations, UX/API behavior, state changes, security boundaries, or release/PR gates.
- The plan could be tempted to use one final validation pass for everything.

Call timing: Run after source requirements and proof expectations are visible. It can run in parallel with `codebase-boundary` when the source artifact is clear enough. Its output feeds vertical-slice decomposition and scope/proof fit.

Prerequisites:
- accepted source requirements and proof expectations
- known product surfaces and non-goals
- current test/proof patterns when available

Where to look:
- requirements and proof expectations in the source artifact
- existing unit/integration/smoke/e2e/manual/proof harnesses
- logs, traces, metrics, data/state, visual, PR, CI, or release evidence paths

How to think: For each requirement, ask what evidence would make a skeptical reviewer believe the behavior works. Choose the smallest proof layers that prove the obligation, then note any higher layer needed by the user/runtime surface.

Collection contribution:
- requirements/proof matrix candidates
- proof layer and evidence source per requirement
- red/green needs or approved exception requirement
- freshness guards
- split/replan triggers when proof is too large for a task

Output focus: Return proof rows anchored to source requirements, with proof modality, pyramid layer, evidence source, freshness guard, and whether red/green is required.
