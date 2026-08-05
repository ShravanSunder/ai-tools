# Skill Implementation Review

Review the implemented skill change before proof is generated and before ship status advances. This reference audits the actual changed files, proof quality, pressure coverage, accepted spec constraints, and remaining ship risk.

Return a verdict, changed-file coverage, accepted/rejected/unverified findings, smallest edits, targeted retest, and ship decision.

For final repo skill-work readiness, this reference supplies the bounded implementation-review packet, changed-file coverage, reduction, and targeted retest expectations. It is usable without invoking a runtime review skill.

## Lanes

The artifact here is **changed files** on disk, so every applicable lane can run. Dispatch the union of every row whose surface the change touched. The rows are the four surfaces of the Great Skill Frame, plus the security gate:

| reviewed surface                     | lanes dispatched                                 |
| ------------------------------------ | ------------------------------------------------ |
| `SKILL.md` body (main path)          | placement-and-calls, steering-strength,          |
|                                      | mental-model-fit, no-op-pruning, rule-agreement, |
|                                      | depth-coverage                                   |
| reference text (depth)               | rule-agreement, no-op-pruning,                   |
|                                      | placement-and-calls, depth-coverage              |
| frontmatter or description (trigger) | trigger-routing                                 |
| a behavior-proof claim (proof)       | claim-vs-evidence                               |
| a sensitive surface                  | sensitive-surface                               |

Each lane named above is `lanes/<name>.md`: `lanes/placement-and-calls.md`, `lanes/steering-strength.md`, `lanes/mental-model-fit.md`, `lanes/no-op-pruning.md`, `lanes/rule-agreement.md`, `lanes/depth-coverage.md`, `lanes/trigger-routing.md`, `lanes/claim-vs-evidence.md`, `lanes/sensitive-surface.md`.

**Scoped changes** dispatch exactly two lanes instead of the union: the lane whose mission owns the failure form the wording change targets (a completion-criterion fix goes to `steering-strength`; a deleted no-op to `no-op-pruning`; a ceremony-only-depth fix to `depth-coverage`), plus `rule-agreement`, because wording in one home can still drift against the homes that cite it. The union rule governs every other change.

**Existing files** — evaluating a shipped skill nobody has edited — use the same table, with every row its current surfaces satisfy; there is no diff, so lanes read whole files. For classification `create`, the reviewed surface is the new files, not a diff.

Sensitive surfaces are the set owned by `../security-gate.md`; plugin manifests and versioning are not among them and route to `../platform-mechanics.md` instead.

MUST load `review-lane-workflow.md` to prepare dispatch and return the dispatch contract and receipt lifecycle before the first dispatch.

MUST load `lanes/lane-schema.md` to fill the shared shapes and return the review packet and parent reduction shape before the first dispatch.

IF the changed surface adds or changes a lane or shared shape, load `../reference-lanes-design.md` to verify lane qualification, authority, schema ownership, and real consumers and return the applicable contract before reduction.

Receipts are synthesized by the parent, not by another lane. `lanes/claim-vs-evidence.md` is the one most specific to this stage: it grades whether the evidence supports the claim being made.

If the user explicitly requests outside counsel and Codex authored the change, prefer a non-Codex provider for at least one lane. Otherwise keep review bounded to this reference and the current diff; do not invent a competing runtime route.

## Verdicts

`lanes/lane-schema.md` owns the verdict labels. Here, `great` means the changed files are sound as they stand. Evaluating a shipped skill, `great` means the skill is sound as it stands, and `reject-or-restart` means the skill has no reusable job and should be retired rather than revised.

## Review Rubric

Covers what only a whole-change ship decision can judge:

- Every edited, added, or deleted source file is covered. Each file is reviewed semantically, marked source/static-only with its behavior status, or explicitly excluded by the accepted behavior-review boundary; deletions are verified through both absence and pointer inventory.
- The implemented diff matches the accepted spec and user constraints without crossing the accepted source, behavior, or ship boundary.
- Every added or changed lane satisfies the returned lane contract: the work qualifies as a lane, its lane reference contains the complete bounded job contract, and caller authority stays equal to or narrower than the reference maximum.
- Every added or changed lane, output, or tool schema satisfies the shared-shape and ownership contract returned by `../reference-lanes-design.md`; cite the returned contract rather than re-deriving its field or ownership rules.
- For review lanes specifically, award a `great` verdict when `lanes/lane-schema.md` clearly and completely defines the status and verdict labels, review packet, lane receipt, lane finding, and parent reduction consumed by the review workflow.
- Check every added or changed term against the glossary, including cases where `glossary.md` stayed unchanged. Award a `great` verdict when each definition in scope is concrete, has one owner, and matches how `SKILL.md` and the references use the term.
- Guidance leads with the positive shape: the action to take, the result to produce, and the taste or judgment that distinguishes strong work. Use prohibitions only as bright-line boundaries for named failures, paired with the positive target.
- Each rule has one live owner, with no aliases, forwarding stubs, or duplicate prose preserving a retired ownership.
- Behavior rows in a source-only review are explicitly `unverified/deferred`; source or static review may authorize only the next proof step and cannot authorize ship.
- The four surfaces still line up: trigger, `SKILL.md`, references, proof.
- Sensitive surfaces, platform metadata, changelog, and cache decisions are handled when in scope.
- The smallest accepted edit is clear enough to implement without broadening into portfolio audit.

Cover each item with source-backed evidence. When a lane receipt already covers an item, cite the receipt rather than re-deriving it.

## Reduction

The parent verifies candidate findings against source files, pressure output, and user constraints before accepting them. Reject findings that contradict the current scope, treat length alone as a blocker when the user scoped length out, or ask for broad `skill-audit` work during one-skill authoring.

Accepted findings route back to the owning phase using the routing in the skills-creation step `Review the implementation`; that is the live owner.

After accepted edits, rerun the narrowest pressure scenario or static proof that could catch the issue. If the finding challenges proof quality, rerun the artifact-scoped scenario that produced the questionable proof. If the edit changes placement, call completeness, or reference retrieval, rerun the scenario that exercises the workflow spine or reference loading. When accepted findings cause edits, apply the re-dispatch and refresh rule in the skills-creation step `Review the implementation`: dispatch any lane whose reviewed text changed, refresh its coverage, and never reuse a receipt for text edited after it was written.

Complete when: the verdict carries one of the allowed labels, every changed file is accounted for as reviewed, static-only, or out-of-scope, and the ship decision is explicit.
