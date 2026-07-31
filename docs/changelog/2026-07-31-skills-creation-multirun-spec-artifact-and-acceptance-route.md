# 2026-07-31 — skills-creation: multi-run spec artifact, acceptance binding, and slice-execution route

Plugin: `shravan-dev-workflow` 1.7.2 (shared with the same-day evaluate-route entry; one bump covers both changesets on this branch)

## Affected surfaces

- `plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md` (frontmatter description; Workflow spine; step 6; run-note template; completion blockers)
- `plugins/shravan-dev-workflow/skills/skills-creation/references/review/spec-review.md` (new Spec Artifact section; Lanes premise; blocker-override qualification; new Acceptance Binding subsection under Reduction)
- `plugins/shravan-dev-workflow/skills/skills-creation/references/review/lanes/lane-schema.md` (`proposal` artifact gloss)
- `docs/wip/AGENTS.md` (accepted-spec carve-out from the plan-promotion funnel)
- `tests/skills/pressure-scenarios/skills-creation-accepted-spec-edit-expires.md` (new scenario, authored not run)

## User-visible behavior changes

1. **Multi-run skill-change specs get an owned artifact form.** `spec-review.md` now states when a skill-change spec must become a spec doc instead of staying conversational (spans more than one update run, carries user decisions a later run must honor, or must survive a session boundary), the slot template it carries, and teaching for the judgment-bearing slots (defaults the user may strike, evidence-or-hypothesis labeling, the coordination slot's consumers, the dispatch-ready stop). The doc is explicitly working memory under `docs/wip/skills-authoring/`, not durable truth; wip lifecycle rules own its post-completion deletion or promotion, and `docs/wip/AGENTS.md` now scopes its plan-promotion funnel to raw-signal notes so an accepted spec doc is its own commission. Previously the reference asserted proposals exist "only in conversation".
2. **Acceptance binds to a revision label and content digest, and expires on any post-acceptance edit.** The new Acceptance Binding subsection owns the rule: the parent closes a review by writing the spec-review record and computing the digest over the whole doc with only the digest value excluded, so any later edit — body or record — changes the digest. A slice run verifies by recomputing the digest and stating both values, or confirming from version-control history that no commit or uncommitted working-tree change touched the doc since the record; a status line still reading accepted-to-implement is named as non-verification, and "keep going under the existing acceptance" is named as not an explicit review skip. An expired acceptance sends the delta back through spec review under the reference's own lane selection, re-binding to the revised doc's new revision and digest.
3. **Slice runs have an explicit intake and citation route.** A Workflow spine paragraph states that a slice run reads the accepted spec doc and quotes its step-1/step-2 returns (success definition, authoring basis, surface allocation, proof posture, decision rows) from it — the doc is the commission for that slice, one skill target per slice. Step 6 gains a literal load: verify the acceptance under the Acceptance Binding and return the verified revision and digest cited, instead of re-dispatching.
4. **The description gains the slice-execution trigger.** The description gains "including executing one run or slice of an accepted multi-run skill-change spec" — spec-review lanes showed slice-execution prompts otherwise misroute to `implementation-execute-plan`, whose description owns the execute/slice vocabulary, so the acceptance gate could never load.
5. **Consistency edits:** `lane-schema.md`'s `proposal` gloss no longer contradicts the doc-backed proposal form; the run-note gains citation and no-dispatch arms (`review lanes dispatched`, `lane receipts`), an `n/a (evaluate)` arm on `success definition`, and a `deviations` line answering spec-boundary and reviewer-runtime separately; the implementation completion blocker admits citation of an unexpired accepted spec; the one-named-skill blocker override is qualified per run for multi-run docs.

## Basis

User-directed intent (2026-07-31): after a cross-worktree review of spec-design and the user-focused-requirements multi-run spec, the user commissioned generalizing that artifact and its acceptance handling into skills-creation. Direct exemplar: `docs/wip/skills-authoring/2026-07-31-user-focused-requirements-update.md` (sibling worktree `ai-tools.spec-review-changes`) — a real multi-run spec with a strikeable decisions table, per-run allocation, coordination section, and revision-bound spec-review record. Two sibling review-record artifacts (`2026-07-31-spec-program-design-fable5-review-findings.md`, `2026-07-30-spec-program-design-implementation-review.md`) demonstrate the digest-binding and run-note practices the Acceptance Binding generalizes.

## Validation

- Spec review: four proposal lanes dispatched (mental-model-fit, trigger-routing, depth-coverage on Fable 5; rule-agreement cross-lineage on Sol), receipts complete x4; verdict `targeted-revision`; accepted blockers and importants incorporated in-session (inventory in the run note); one Sol finding rejected with basis; fresh parent reduction: accepted-to-implement.
- Implementation review round 1: eight lanes dispatched (placement-and-calls, steering-strength, mental-model-fit, no-op-pruning, rule-agreement, depth-coverage, trigger-routing on Fable 5; claim-vs-evidence cross-lineage on Sol), receipts complete x8; one convergent blocker (digest self-invalidation: the spec-review record write expired its own acceptance) fixed via the acceptance-act carve-out; accepted importants and minors fixed in-session.
- Implementation review round 2: all eight lanes re-dispatched on the fix delta, receipts complete x8; the convergent regression (step-6 expiry copy missing the carve-out's "other") and accepted residues (record-section digest-blind zone, verification-window anchor, citation-run run-note emission, scenario gate weaknesses) fixed in-session; closure verified by a final cross-lineage lane, recorded in the run note.
- Standards review (user-requested): one Sol-high lane graded the full branch diff against the skill's own succinctness, leading-word, steering, and call-grammar doctrine; the parent accepted all eight findings (digest coverage closing the record-section blind zone by excluding only the digest value, conversational-fallback reword, evaluate-spine call-grammar fix, evaluate arms in step-1 completion and the run note, a lane-receipts no-dispatch arm, two-domain deviations line, de-coining `strikeable`, one topic-sentence deletion) and the same lane confirmed the fixes.
- `claude plugin validate .`: passed clean on the post-round-1 text; re-run on the final text with the result recorded in the run note beside the closure receipt.
- New pressure scenario authored: `skills-creation-accepted-spec-edit-expires` (edit-expires-acceptance trap, status-line non-verification, "keep going" is-not-a-review-skip, truthful run-note fields). NOT executed: pressure-suite execution remains the explicitly user-accepted proof gap for this branch.

## Refresh status

Installed Codex/Claude caches not refreshed; source-only on branch `skills-creation-refinements`. No commit, push, or PR without explicit user authorization; the parent reduction ships with the run note and, when a PR is authorized, in its description.

## Follow-up

- `implementation-execute-plan`'s description could add a boundary clause ("Not for runs or slices of an accepted skill-change spec") so artifact-less slice prompts stop leaning on skills-creation's tokens alone; separate changeset, flagged by the round-1 trigger lane.
- Root `AGENTS.md` Skill Work SOP and the skills-creation table row still describe create/update/evaluate only; sync run/slice-execution language in the changeset that owns router text.
- The rule-agreement lane's external-claim check does not yet name plugin-level authoring canons (e.g. the planned diagram-vocabulary doc in the sibling branch) as an agreement surface; whether inline copies must cite their canon belongs to that branch's spec before this skill grows a rule.
