# 2026-07-31 — skills-creation: explicit evaluate route, observable run-note trigger, step-2 classification table

Plugin: `shravan-dev-workflow` 1.7.2

## Affected surfaces

- `plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md` (main path wording; no frontmatter change)
- `plugins/shravan-dev-workflow/skills/skills-creation/references/review/review-lane-workflow.md` (reviewer runtime call site)
- `tests/skills/pressure-scenarios/skills-creation-evaluate-on-disk-route.md` (new scenario)
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`, `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`, `.claude-plugin/marketplace.json` (version 1.7.1 → 1.7.2 in all three homes; originally authored as 1.6.72 → 1.6.73 before the branch was fast-forwarded onto the 1.7.1 master)
- `docs/changelog/README.md` (index entry) and this entry itself

## User-visible behavior changes

1. **Evaluate runs have an explicit spine.** The Workflow section now states that an `evaluate` run is step 1 → load the selected stage reference → dispatch the lanes it selects → parent-reduced verdict with the stage's required returns, plus the run note; steps 2-10 begin only as a new `update` run whose own step 1 records a user-supplied success definition and an authoring basis, and a "just quickly fix it" invitation that names neither is not a commission. Previously this route had to be inferred from the IF clauses in step 1.
2. **The run-note trigger is an observable predicate.** "when implementation, shipping, disputed scope, or proof needs tracking" became "whenever the run dispatches review lanes, returns an evaluate verdict, edits skill files, or runs a proof route" — a bright line replacing a judgment call that agents skipped in practice. The "disputed scope" arm was deliberately dropped; a disputed-scope discussion with no dispatch, evaluate verdict, edit, or proof is chat-only.
3. **Step-2 classification is a decision table.** The `mechanical` / `behavior-changing` / `scoped` definitions and consequences moved from three interleaved paragraphs into one table; the checkable-claim requirements and the "small is not a surface" rule stay as prose. Rule content preserved, with one deliberate strengthening: the checkable-claim requirement is now stated for every classification rather than only `mechanical` and `scoped`.
4. **Receipt-expiry has one authoritative home.** Step 8 now cites the Receipt Lifecycle in `review-lane-workflow.md` instead of restating the expiry rule in full.
5. **The reviewer runtime profile is explicit at the manage-agents call site.** `review-lane-workflow.md` now states that reviewers run as one-shot Delegates in fresh context, with the two clauses `manage-agents` actually owns — history `none`, workspace `read-only` — attributed to its reviewer contract, and that any model outside the Delegate table, caller-directed or parent-chosen, is recorded on the run note's new `deviations:` line, not treated as a new pattern. The Scaled Run Note template gains that `deviations:` field. This closes the "Reviewer pattern" ambiguity between the two skills.

## Basis

User-directed intent: a Fable 5 lane-review run of the skill (2026-07-31) surfaced these five friction points from direct execution experience; the user approved the item list and directed implementation on a fresh branch from master (`skills-creation-refinements`).

## Validation

- `claude plugin validate .` — passed clean after the marketplace version home was bumped (first run flagged it; fixed; second run clean).
- New pressure scenario authored: `skills-creation-evaluate-on-disk-route` (evaluate-on-disk route, run-note emission, no-edit boundary). The conversation-draft evaluate branch has no scenario yet; that is part of the named proof gap.
- Scenario grader gate verified on the real harness with the fake backend: the rubric-leak check passes (two earlier leak defects found by review lanes and fixed). The two remaining fake-backend mismatches are the harness's self-referential echo, which 25 of the 110 on-disk scenarios (this new one included) also fail; fake-pass is not a repo invariant and the anchored proof regexes were deliberately not weakened to satisfy it.
- Pressure suite execution NOT run in this changeset: the user explicitly deferred pressure testing (2026-07-31, "not ready"). Named, user-accepted proof gap; the authored scenario ships unexecuted.
- Implementation review: skills-creation implementation-review lanes dispatched post-edit (majority Fable 5, one different-lineage Sol lane); lane findings — including two scenario rubric-leak blockers, one per round — were parent-verified and fixed in-session across two fix rounds with touched lanes re-dispatched; the parent reduction ships in the PR description.

## Refresh status

Installed Codex/Claude caches not refreshed; source-only on branch `skills-creation-refinements`.

## Follow-up

- `manage-agents` should grow the reviewer profile natively (one-shot Delegate row or explicit Reviewer profile) so `review-lane-workflow.md` can cite instead of stating it; separate single-skill run.
