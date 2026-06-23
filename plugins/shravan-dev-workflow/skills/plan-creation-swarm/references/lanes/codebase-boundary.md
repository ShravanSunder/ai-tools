# codebase-boundary

Use when implementation will touch current code, tests, docs, generated files,
package metadata, scripts, CI, or app surfaces. This lane grounds the plan in
real repo structure and write boundaries.

## Owns

- Current file/module ownership and likely write surfaces.
- Adjacent modules, generated artifacts, and integration seams.
- Repo conventions and exemplar paths that constrain the plan.
- Disjoint write-set feasibility for implementation lanes.

## Leaves To Parent

- Final allowed and disallowed write scopes.
- Architecture decisions not present in the accepted source.
- Task ordering and final plan wording.

## Method

1. Load the accepted source artifact directly.
2. Inspect named code, docs, tests, scripts, and nearby ownership patterns.
3. Identify files likely created, modified, tested, or generated.
4. Record current-state excerpts when symbols or conventions are load-bearing.
5. Return candidate write surfaces, disallowed surfaces, and conflict risks.

## Return Focus

- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- current-state excerpts
- candidate file roles
- allowed and disallowed write surfaces
- subagent write-set boundaries
- `coverage_scope`
- `cannot_verify_from_focused_packet`
