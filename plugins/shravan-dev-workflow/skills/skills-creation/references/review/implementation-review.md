# Skill Implementation Review

Review the implemented skill change before proof is generated and before ship status advances. This reference audits the actual changed files, proof quality, pressure coverage, accepted spec constraints, and remaining ship risk.

Return a verdict, changed-file coverage, accepted/rejected/unverified findings, smallest edits, targeted retest, and ship decision.

For final repo skill-work readiness, `implementation-review-swarm` owns review orchestration and this reference supplies the skill-specific rubric, changed file coverage, and targeted retest expectations.

## Lanes

The artifact here is **changed files** on disk, so every applicable lane can run. Dispatch the union of every row whose surface the change touched. The rows are the four surfaces of the Great Skill Frame, plus the security gate:

| reviewed surface                     | lanes dispatched                                |
| ------------------------------------ | ----------------------------------------------- |
| `SKILL.md` body (main path)          | placement-and-calls, steering-strength,         |
|                                      | mental-model-fit, no-op-pruning, rule-agreement |
| reference text (depth)               | rule-agreement, no-op-pruning,                  |
|                                      | placement-and-calls                             |
| frontmatter or description (trigger) | trigger-routing                                 |
| a behavior-proof claim (proof)       | claim-vs-evidence                               |
| a sensitive surface                  | sensitive-surface                               |

**Existing files** — evaluating a shipped skill nobody has edited — use the same table, with every row its current surfaces satisfy; there is no diff, so lanes read whole files. For classification `create`, the reviewed surface is the new files, not a diff.

Sensitive surfaces are the set owned by `../security-gate.md`; plugin manifests and versioning are not among them and route to `../platform-mechanics.md` instead.

MUST load `lanes/lane-schema.md` to get the dispatch contract and shared shapes, and return the review packet and the parent reduction shape, before the first dispatch.

Receipts are synthesized by the parent, not by another lane. `lanes/claim-vs-evidence.md` is the one most specific to this stage: it grades whether the evidence supports the claim being made.

If the user explicitly requests outside counsel and Codex authored the change, prefer a non-Codex provider for at least one lane. When using `implementation-review-swarm`, use this reference as the skill-specific review input rather than a competing orchestration path.

## Verdicts

`lanes/lane-schema.md` owns the verdict labels. Here, `great` means the changed files are sound as they stand; evaluating a shipped skill, it means the skill is sound as it stands and `reject-or-restart` means the skill has no reusable job and should be retired rather than revised.

## Review Rubric

Covers what only a whole-change ship decision can judge:

- Every edited, added, or deleted source file is covered. Each file is reviewed semantically, marked source/static-only with its behavior status, or explicitly excluded by the accepted behavior-review boundary; deletions are verified through both absence and pointer inventory.
- The implemented diff matches the accepted spec and user constraints without crossing the accepted source, behavior, or ship boundary.
- Any lane or shared shape the change introduces satisfies `../reference-lanes-design.md`, which is the single owner of qualification, authority, and shape families.
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
