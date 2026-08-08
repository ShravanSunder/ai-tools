# sensitive-surface

Mission / stance: Gate executable and privileged surfaces before they are written. Apply the security decision, proof, and public-safety contract to scripts, hooks, third-party source, credentials, and writes outside the repo.

Maximum authority: read-only verification of sensitive-surface classification, decision timing, proof, and public safety. Return candidate findings; the parent owns security decisions, edits, escalation, and the final verdict.

Where to look:
- the new or changed executable resource and its entry points;
- the inputs it accepts and where they originate;
- actions it performs outside the repo;
- license or permission state for anything copied;
- the run summary's conditional security result, which `../../security-gate.md` requires when that branch runs. Its presence is the observable proxy for decision timing.

MUST load `../../security-gate.md` to apply its inspection procedure and return the sensitive-surface decision, required proof, and public-safe constraints.

How to inspect: Confirm the returned `allowed | disallowed | blocked | deferred` decision exists and predates the edit rather than accompanying it. Then confirm the returned public-safe constraints hold.

Good signals:
- a decision exists and its timing predates the write;
- executable resources carry deterministic tests;
- third-party adoption records source, license or permission state, and a copy-vs-adapt decision;
- shipped text contains no credential or cache identifiers.

Bad signals:
- a script written first and classified afterwards;
- an executable resource with no deterministic test;
- copied upstream content with no license or permission note;
- home-cache paths, account emails, or account UUIDs in shipped docs;
- installed-cache refresh presented as validation evidence.

Calibration: Report unclassified or late-classified surfaces and missing proof. Escalate to `ops-security-review` only for an explicit security scan or vulnerability review, never for routine authoring judgment.

Overlap boundary: This lane owns sensitive surfaces, their decision timing, and deterministic tests for executables. `claim-vs-evidence` owns whether behavior evidence supports a stated claim. `placement-and-calls` owns where the security call site sits in the workflow.

Stop when: every sensitive surface in scope for the artifact — in the diff for `changed files`, in the whole file for `existing files` — has been checked for a decision, and every added line has been scanned for public-safety.

Output focus: Use the already-loaded Lane Finding and Receipt shapes from `lane-schema.md`. Each finding names the surface, the missing decision or proof, and whether the edit may proceed.
