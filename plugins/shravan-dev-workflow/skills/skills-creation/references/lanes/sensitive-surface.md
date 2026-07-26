# sensitive-surface

Mission / stance: Gate executable and privileged surfaces before they are written, not after. Ordinary authoring judgment does not cover scripts, hooks, third-party source, credentials, or anything that writes outside the repo.

Where to look:
- the new or changed executable resource and its entry points;
- the inputs it accepts and where they originate;
- actions it performs outside the repo;
- license or permission state for anything copied;
- `references/skill-security-review.md` for inspection procedure and decision labels.

How to inspect: Follow `references/skill-security-review.md`; this lane supplies review coverage, not a competing policy. Confirm the `allowed | disallowed | blocked | deferred` decision exists and predates the edit rather than accompanying it. Then confirm public-safe constraints hold: no resolved secrets, `op://` refs, account emails or UUIDs, or local cache identifiers in anything shipped.

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

Stop when: every sensitive surface in the diff has a decision and every added line has been scanned for public-safety.

Output focus: MUST load `references/skill-review-lane-schema.md` and return the Lane Finding and receipt shape it defines. Each finding names the surface, the missing decision or proof, and whether the edit may proceed.
