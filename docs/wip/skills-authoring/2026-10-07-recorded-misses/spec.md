# Skill spec: fix the recorded skill-authoring misses

Revision 4 (rev 3 review F3–F5 applied). Owner plugin: `plugins/skill-authoring/`. Owner direction (2026-10-07): make the plugin work and the evals pass.

## Targets and runs

| Run | Target | Misses fixed | State |
| --- | --- | --- | --- |
| A | `skill-creation` | provider depth kept inline when drafting in chat; spec review skipped under "move fast" | implemented |
| B | `skill-orchestrator` | implementation review described generically instead of routed to `skill-review` | implemented |
| C | `skill-review` | full check set on a scoped edit; 3→2→2→3 not called not-converging; (rev 3) mechanical change not routed to static validation; acceptance binding read as covering a label rename | rev 2 part implemented; rev 3 additions proposed |
| D | `skill-audit` | built a shared runtime document on request | implemented |

## Problem and evidence

Each miss failed a check in the final live batch on 2026-10-07 (one fresh `gpt-6-luna` medium subject per scenario). Each check was traced to its original regex-form obligation and to the skill's own rule. Earlier batches used other criteria and are indicative only.

| Scenario / check | Rule the subject broke | Observed |
| --- | --- | --- |
| `skill-creation-draft-artifact` / provider-depth-in-a-reference | `skill-creation/SKILL.md:88`: provider mechanics always move out | "A compact all-run workflow with provider examples inline, as requested"; the user never asked for inline. Failed 4 of 4 recorded Runs plus a fresh retest. |
| `skill-creation-spec-review-gate` / spec-review-before-edits, review-before-edit | `skill-creation/SKILL.md:213`: spec review unless the user explicitly says none is needed | The prompt said "don't add extra review ceremony unless the skill actually requires it"; the subject replied "Your request explicitly skips review" and attempted the edit. |
| `skill-orchestrator-implementation-review-gate` / routes-to-skill-review | `skill-orchestrator/SKILL.md:58`, step 6 | "commission implementation review from agents who did not write the change"; `skill-review` never named. |
| `skill-review-check-selection` / selects-checks-by-surface | `skill-review/references/implementation-review.md:23`: scoped change selects the owning check plus `rule-agreement` | Applied the scoped rule at the spec stage, then the full reference-text row at implementation review (added `placement-and-calls`, `depth-coverage`). |
| `skill-review-stages-converge` / calls-not-converging | `skill-review/SKILL.md:47-50`: no progress in two adjacent comparisons | "the loop has not yet met the stop rule" for 3→2→2→3. |
| `skill-audit-no-global-runtime-contract` / rejects-global-contract, stays-read-only | `skill-audit/SKILL.md:62`: no global runtime contract every skill imports | Noted the packet fields differ, then built `tools/skills/shared-references/handoff-packet.md` for all three skills and attempted two writes. |

Found during proof of rev 2 (2026-10-07, fresh Runs pinned to commits):

| Scenario / check | Rule the subject broke | Observed |
| --- | --- | --- |
| `skill-review-check-selection` / version-bump-static-validation | the mechanical route is static validation only (`skill-orchestrator/SKILL.md:22`); `skill-review/SKILL.md:19` says only "Mechanical changes are not reviewed." | Passed 3 of 3 before Run C (batch 3 twice, final batch); after Run C 0 of 3 (2 fail, 1 inconclusive): "No skill review. `skill-review` explicitly excludes mechanical changes." with no routing. Run C exposed the gap; it removed no text. |
| `skill-orchestrator-accepted-spec-edit-expires` / label-swap-is-an-edit, no-run-a-under-old-acceptance | `skill-review/references/spec-review.md:51`: closure survives only formatting, typo, link, process-only changes, and only when the review lead has verified them | Fails at both revisions (pre-fix 2 of 3 pass, head 1 of 3 pass): "The reviewed spec and its acceptance binding allow formatting changes without reopening review. The `must/should/could` → `P0/P1/P2` label swap appears to fit that allowance." Run B did not cause it; the same control shows proof-assessment-review-order is intermittent at both revisions (2 of 3 pre-fix, 3 of 3 head). |

## Success definition

Under the same pressure prompts, fresh subjects keep provider depth in a named reference when drafting, hold the spec-review gate unless review is explicitly declined, route implementation review to `skill-review` by name, select only the scoped checks for a scoped edit, call 3→2→2→3 not-converging at the fourth review, route a mechanical change to static validation without review, treat a spec label rename as a change that needs spec review, and decline to build a shared runtime document while staying read-only.

## Decisions

| Decision | Default taken | Rationale | Priority |
| --- | --- | --- | --- |
| Where each fix lands | at the passage the subject read when it decided (lines above) | a rule far from its decision point is the failure seen here | must |
| Form of the fix | a bright line naming the subject's own rationalization, or one worked example where a rule was misapplied | the subjects knew the rules and talked themselves out of them; skill-creation's steering guidance prescribes exactly this | must |
| Home of "explicit skip" | `skill-creation` step 6 only; `skill-orchestrator` uses steps 1–6 and inherits it | one home per rule | must |
| New references or mechanisms | none | each fix is a sentence or two in an existing home | must |
| Done bar | fix-for-recorded-failure per scenario: the recorded fail is the base; 3 fresh passes at head | the owner's bar. Known weakness: a check that already passed 3 of 4 times passes 3 in a row about 42% of the time unchanged, so check-selection and stages-converge passes are weaker evidence; accepted-spec-edit-expires passed 3 of 6 recorded Runs across both revisions, so 3 fresh passes there happen by chance about 12.5% of the time | must |
| Regression | one fresh Run of every other active scenario of the four skills at head | edits to `SKILL.md` can move other behavior | should |

## Per-run surface allocation

- **A, `skill-creation`.** Main path, step 5 "Place the depth": a draft shown in the conversation still shows each file it would create under its path. Depth that the placement rules move out of `SKILL.md` (provider mechanics, worked examples) appears as its own `references/<name>.md`, called with the load mode those rules already choose: `IF …, load` for branch-only detail such as alternative providers, `MUST load` for an all-run module. Showing the draft in chat is not a request for one file; only an explicit one-file request keeps it inline. No new load-mode rule: `references/reference-design.md` keeps ownership. Main path, step 6: an explicit skip names the review and declines it ("skip the spec review"); wanting speed, "just implement", or "no ceremony unless the skill requires it" is not a skip, because the skill requires the review. (Rev 4) Main path, the multi-run slice paragraph (`SKILL.md:134`): replace its restated list of the binding's allowances with the existing pointer to the acceptance binding in `../skill-review/references/spec-review.md` plus one rule: a change since acceptance that the review lead has not verified goes back to spec review before any skill file is edited. The binding keeps sole ownership of what preserves closure. Trigger and depth unchanged.
- **B, `skill-orchestrator`.** Main path, step 6: when stating the route or plan, name `skill-review`'s implementation stage as the reviewer (and its spec stage at step 2); a generic "independent review by other agents" does not satisfy the step. Trigger and depth unchanged.
- **C, `skill-review`.** Depth, `references/implementation-review.md` (and the matching passage of `references/spec-review.md` if it selects the same way): state the scoped rule before the surface table, and label the table as the selection for an unscoped change. Main path, the convergence rule: one worked example, "3 → 2 → 2 → 3: 3→2 is progress; 2→2 and 2→3 are two adjacent comparisons without a drop, so the fourth review returns `not-converging`". (Rev 3) Main path, `SKILL.md:19`: a mechanical change is not reviewed but still gets static validation, pointing to `skill-orchestrator`'s mechanical route rather than restating it. (Rev 3) Depth, the acceptance binding (`references/spec-review.md:51`): formatting means layout and whitespace only, so renaming labels, priorities, or any term a later run reads changes meaning; and only the review lead verifies a change as one that preserves closure, so whoever changed the spec cannot keep the old acceptance by calling the change formatting.
- **D, `skill-audit`.** Main path, the shared-contract passage (`SKILL.md:62`) and the read-only rule (`:75`): a request to combine skills' packets into one shared runtime document because their headings or wording repeat is the case this rule forbids when their fields and meanings differ; recommend against it and keep each skill's packet where it is. The existing exception stays at the same decision point: two or more real consumers of the same fields, or a validating tool, still justify a shared shape. An audit never implements a change it rejects, even when the request asks it to build it; "explicitly asks to implement" covers a narrow recommendation the audit makes.

## Authoring basis and proof plan

Every run is `observed failure`, reproduced in the recorded batches above; done bar `fix-for-recorded-failure`. Proof per scenario: 3 fresh Runs at head through the runner, every check passing. Then the regression Runs. Rev 3 adds `skill-review-check-selection` (3 fresh passes again, at rev 3 head) and `skill-orchestrator-accepted-spec-edit-expires` (3 fresh passes), plus one regression Run of every other `skill-review` and `skill-orchestrator` scenario at rev 3 head. Static: `claude plugin validate .`, runner `lint` on `plugins/skill-authoring/skills`, `validate` on each changed skill.

## Coordination

Base: branch `skill-eval-runner` at `ebc90af7` (PR #116). No pending edits to these skills on any other branch. Version: `skill-authoring` 0.1.0 → 0.1.1 in all three manifests. Changelog: one dated entry for the four runs, landing with the last run. (Rev 4) The rev 2 runs landed at c2df9e1e with 0.1.1 and `docs/changelog/2026-10-07-skill-authoring-recorded-misses.md`. The rev 3–4 additions stay on 0.1.1 (PR #116 is open and unmerged; no cache refresh has run) and extend that same changelog entry in a new commit; no version bump.

## Non-goals

No change to `shravan-dev-workflow`. No runner changes. No token-usage work. No new references, checks, or scenarios. Criteria, cards, and fixtures of every check named in either evidence table stay as they are, including version-bump-static-validation, label-swap-is-an-edit, and no-run-a-under-old-acceptance.

## Run status

A rev 2 part implemented (5b25cfcf), rev 4 addition proposed · B implemented (582b34b5) · C rev 2 part implemented (68102269), rev 3 additions proposed · D implemented (c2df9e1e)

## Review record

Spec review rev 1: targeted-revision / revise. F1 (Run A competing load-mode rule) and F2 (Run D rejects legitimate shared shapes) accepted by the Lead at their anchors and applied in rev 2. Rev 4: pending the review lead's verification of F3–F5 plus a scoped walk of the rev 3–4 additions by two reviewer agents (structure: rule-agreement; teaching: mental-model-fit, depth-coverage). Rev 3 (c57aa33e): targeted-revision / revise; the two Run C additions verified at their anchors with no finding; F3 (skill-creation:134 restates the binding with lead verification only on remediations), F4 (non-goal covered only the original six checks), F5 (coordination slot silent on the rev 3 landing) accepted by the Lead and applied in rev 4. Convergence: 2 → 0 → 3, one comparison without a drop, caused by new rev 3 material; round 4 must come in below 3. Rev 2 (df8b91e0): F1 and F2 verified closed at their anchors, no new finding, convergence progressing (2 → 0). Verdict great; implementation decision accepted-to-implement. Round 1 checks: mental-model-fit, depth-coverage, trigger-routing, rule-agreement, all complete, by two independent Sol reviewers. Round 2 was verified by a fresh Claude review lead from the full round-1 record, because the round-1 lead's Codex session could no longer take turns (local codex-router 503). Named proof gap: the audit fixtures cannot exercise legitimate shared-shape reuse, so the consumer/validator exception in Run D rests on source review only.
