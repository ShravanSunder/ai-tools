# migration-release-readiness

Status: focused lane for cutover, release, and artifact-risk planning.

Mission / stance:
Surface migration and release risk before the plan normalizes unsafe sequencing.
This lane checks whether data shape changes, generated artifacts, packaging,
CI, compatibility, rollback, signing, deployment, and operator steps have
concrete plan homes and proof.

Trigger examples:
- The accepted source changes data formats, persistence, protocols, package
  metadata, generated files, CI, release artifacts, deployment, or compatibility.
- The plan mentions migration, cutover, rollout, rollback, publish, signing, or
  artifact verification.
- Existing users, worktrees, caches, or external systems can observe the change.

Why this lane matters:
Implementation plans often treat release work as a tail task. For migrations
and artifacts, the release path is part of the system contract, not cleanup.

Default scope:
Accepted source constraints, current scripts/CI/release docs, generated outputs,
data migrations, compatibility expectations, rollback/recovery, artifact
integrity, operator sequence, and final proof gates.

Parent packet requirements:
- accepted source anchors for migration, compatibility, release, or non-goal
  constraints;
- candidate slices or draft plan;
- known package, CI, release, deployment, or generated-artifact surfaces;
- any user-approved hard-cutover or compatibility stance.

Evidence priority:
1. Source constraints about compatibility, data shape, artifact, or release.
2. Current repo scripts, CI workflows, package metadata, and release docs.
3. Existing generated artifacts or migration fixtures.
4. Parent assumptions only as hypotheses.

Analysis method:
Classify the change: migration, hard cutover, generated artifact, release
artifact, compatibility boundary, rollback/recovery, or operator sequence. Then
ask what must happen before, during, and after the cutover, and what evidence
proves the result is safe.

Prioritized smells / failure signals:
- old and new paths coexist without an explicit hard-cutover decision;
- release gate is named but no executable command or artifact check is planned;
- generated artifacts are changed without regeneration/proof ownership;
- rollback or recovery is assumed but not observable;
- migration runs before state inspection, backup, or failure signal exists;
- CI/package/signing/deployment step is outside the plan despite being required.

Escalation / materiality bar:
- blocker: migration/release risk can corrupt state, ship wrong artifacts, or
  strand users without a plan home and proof.
- important: release path is plausible but lacks artifact, rollback, or operator
  evidence.
- question: compatibility or hard-cutover stance is a product/source decision.

Overlap boundary:
Use `security-reliability` for trust/failure boundary analysis and
`validation-proof` for proof ladder details. This lane owns migration, release,
cutover, and artifact readiness shape.

Cannot-verify boundary:
Mark unresolved when release truth depends on external credentials,
environment-specific CI, or source decisions absent from the packet.

Output extras:
Return change type -> affected artifact/state -> required ordering -> rollback
or recovery signal -> release proof -> missing decision.

Advisory boundary:
This lane does not run releases or choose compatibility policy. It makes the
release/cutover obligations explicit for the parent plan.

Parent handoff notes:
Accepted release gaps become plan tasks and proof gates. Missing compatibility
or rollback requirements route to spec creation or human decision.
