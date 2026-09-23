# Skill Implementation Review

Review one of two targets. For implemented behavior-changing delivery, review after fitting proof and the user-facing main's source-backed assessment and before ship status advances; review consumes demonstrated behavior and does not substitute for missing proof. For an `evaluate` run over existing files, perform the source-only review before any new implementation commission, mark behavior `unverified/deferred`, and authorize no shipping. Mechanical changes and an explicit implementation-review skip do not enter this reference merely to fabricate coverage.

Return a verdict, changed-file coverage, accepted/rejected/unverified findings, smallest edits, targeted retest, and ship decision.

For final repo skill-work readiness, this reference supplies the bounded implementation-review packet, changed-file coverage, reduction, and targeted retest expectations. Runtime skill-package authoring stays here and does not route through the product `implementation-review` skill.

## Ordered Checks

The artifact is changed or existing skill files. The independent 🔎 Review Sidekick loads `lanes/lane-schema.md` and walks the checks selected by touched surface in its own session. Keep the order below so placement and rule agreement can see the entire change before the final proof claim comparison.

| Reviewed surface | Check references to load |
| --- | --- |
| `SKILL.md` body | `placement-and-calls`, `steering-strength`, `mental-model-fit`, `no-op-pruning`, `rule-agreement`, `depth-coverage` |
| Reference text | `rule-agreement`, `no-op-pruning`, `placement-and-calls`, `depth-coverage` |
| Frontmatter or description | `trigger-routing` |
| Behavior-proof claim | `claim-vs-evidence` |
| Sensitive surface | `sensitive-surface` |

Each name resolves to `lanes/<name>.md`. Deduplicate the selected set. For a scoped wording change, load the check that owns the targeted failure form and `rule-agreement`; record all other checks `complete` with `not selected: <reason>`. For an on-disk `evaluate` run, use current files as the reviewed surface and read them whole. A `create` run reviews new files. Sensitive-surface ownership stays in `../security-gate.md`.

The lead records `complete | partial | blocked` per check, verifies candidates against source, and returns the per-check status block before one reduced verdict. IF a changed surface adds an output or tool shape, load `../reference-lanes-design.md` for its consumers and owner. A check cannot dispatch another agent. Prescribed proof commands may go to a 🔧 Operator under the exact grant; the lead judges the observations.

## Verdicts

`lanes/lane-schema.md` owns the verdict labels. Here, `great` means the changed files are sound as they stand. Evaluating a shipped skill, `great` means the skill is sound as it stands, and `reject-or-restart` means the skill has no reusable job and should be retired rather than revised.

## Review Rubric

Covers what only a whole-change ship decision can judge:

- Every edited, added, or deleted source file is covered. Each file is reviewed semantically, marked source/static-only with its behavior status, or explicitly excluded by the accepted behavior-review boundary; deletions are verified through both absence and pointer inventory.
- The implemented diff matches the accepted spec and user constraints without crossing the accepted source, behavior, or ship boundary.
- For implemented behavior-changing delivery, fitting proof ran against the reviewed current files before this review; the main inspected the actual diff and proof against the original need, accepted spec/plan, ownership, complexity, and integration and returned `accepted-for-independent-review`. An `evaluate` run instead preserves the source-only, unverified/deferred behavior boundary above.
- Every added or changed check has one teaching owner, a complete stop condition, and a caller that loads it at the right step.
- Every added or changed output or tool schema satisfies the shared-shape and ownership contract returned by `../reference-lanes-design.md`; cite the returned contract rather than re-deriving its field or ownership rules.
- For review checks, award `great` only when `lanes/lane-schema.md` defines statuses, verdicts, finding fields, and reduction consumed by the review workflow.
- Check every added or changed term against the glossary, including cases where `glossary.md` stayed unchanged. Award a `great` verdict when each definition in scope is concrete, has one owner, and matches how `SKILL.md` and the references use the term.
- Guidance leads with the positive shape: the action to take, the result to produce, and the taste or judgment that distinguishes strong work. Use prohibitions only as bright-line boundaries for named failures, paired with the positive target.
- Each rule has one live owner, with no aliases, forwarding stubs, or duplicate prose preserving a retired ownership.
- Behavior rows in a source-only review are explicitly `unverified/deferred`; source or static review may authorize only the next proof step and cannot authorize ship.
- The four surfaces still line up: trigger, `SKILL.md`, references, proof.
- Sensitive surfaces, platform metadata, changelog, and cache decisions are handled when in scope.
- The smallest accepted edit is clear enough to implement without broadening into portfolio audit.

Cover each item with source-backed evidence. When a check result already covers an item, cite it rather than re-deriving it.

## Reduction

The executing review lead verifies candidate findings against source files, pressure output, and user constraints before accepting them. Reject findings that contradict the current scope, treat length alone as a blocker when the user scoped length out, or ask for broad `skill-audit` work during one-skill authoring. The orchestrator retains final disposition and author acceptance.

Accepted findings route back to the owning phase using the routing in the skills-creation step `Review the implementation, prune, and ship`; that is the live owner.

After accepted edits, rerun the narrowest fitting pressure and static proof that can catch the issue, then require fresh main assessment. Resume the same review lead to refresh affected check coverage only while fewer than three remediation passes have completed. End early on `great`. After remediation three, stop `remediation-limit-reached`; never start review or remediation four without explicit user permission.

At ship, reuse the semantically current review result when its changed-file coverage and proof remain current. Resume the same lead only when affected coverage needs refresh.

Complete when: the verdict carries one of the allowed labels, every changed file is accounted for as reviewed, static-only, or out-of-scope, and the ship decision is explicit.
