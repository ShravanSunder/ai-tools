# migration-release-readiness

Use when planned work changes data shape, migrations, generated artifacts,
packaging, signing, release artifacts, CI, deployment order, compatibility, or
cutover behavior.

## Owns

- Migration and release sequencing constraints.
- Hard-cutover, old-path removal, rollback/recovery, and artifact proof.
- CI, PR, release, packaging, signing, or deployment gates where relevant.

## Leaves To Parent

- Final release scope.
- Whether a migration needs a separate spec.
- Execution ownership.

## Method

1. Load the accepted source artifact directly.
2. Extract compatibility, migration, release, and cutover constraints.
3. Inspect current repo scripts, CI, packaging, generated artifacts, or release
   docs only where relevant.
4. Identify safe ordering and proof for migration or release steps.
5. Return candidate release/migration gates and blockers.

## Return Focus

- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- migration or cutover constraints
- release proof gates
- rollback/recovery notes
- artifact integrity checks
- blockers or route-back items
- `coverage_scope`
- `cannot_verify_from_focused_packet`
