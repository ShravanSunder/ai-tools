# Delegation learnings (lessons 1–8)

Owner plugin: `shravan-dev-workflow` (runs 1–2); devfiles prompt (run 3). Coordination root: board "Workflow improvements", root `01a0ed41-87ce-7a91-a4a0-4e9cd63dedb1`.

## Problem and evidence

Eight lessons from the 2026-09-29 manage-agents work (ai-tools #106, #107, #109, #110):

| # | What happened | Evidence |
|---|---|---|
| 1 | Skills restated delegation policy (tiers, models, which role takes a job) in about 40 places, and the copies drifted | three Opus surveys (`…/scratchpad/lead-survey/group{1,2,3}.tsv`), `git diff 94d44bc3 01702bec` |
| 2 | Removing those copies dropped two rules with no other runtime home (coupled proof stays with the implementer; audit fan-out) | Astra review of #107, F1/F2; Jev X3 measured the drop (0.90 → 0.71 → 0.99) |
| 3 | Renaming Main to Lead collided with "review lead", which three skills used for the Review Sidekick | Opus survey of groups 1 and 3 |
| 4 | Writing worked examples exposed a definition bug (Step meant "one command" while an Operator runs procedures) | #109 examples; #110 Subtask fix after the Opus review F2 |
| 5 | Real delegation stalls clustered around missing seams, an unstated end (push? full suite?), and inputs from unfinished work | scraped session rows (`/private/tmp/claude-501/-Users-shravansunder-dev-devfiles/4825fe5c-afb7-4fc5-a6cf-35768c90408c/scratchpad/workhorse/scenarios/*.tsv`): about 8 missing-seam stops, the drawer PR commit left unpushed, u007–u009 waiting on u010 |
| 6 | Examples copied from session transcripts taught nothing | #109 first draft, owner rejection |
| 7 | The success definition and deletion test were skipped under pressure, costing many rounds | this session |
| 8 | `gh stack submit` (run non-interactively) opened PRs as drafts, unnoticed until the owner asked | #107, #109; `gh stack submit --help`: `--auto` creates drafts unless `--open` |

## Success definition

An agent authoring or editing a skill points to the owning skill instead of restating its rule, moves a rule to its owner before deleting a copy, checks a renamed term's current meanings before the rename, tests categories with worked examples drawn from patterns in real work, and writes a success definition before content. An agent handing off a job names where the job ends, including push, PR, and the full suite, and names each input the job needs with the evidence it is usable; only work that needs an input that is not usable yet, and has no agreed contract or stand-in, waits. A Lead who submits a stack leaves each PR in its intended draft or ready state.

## Decisions (the owner may strike any row)

| # | Default | Rationale |
|---|---|---|
| D1 | Lessons 1–3 become written rules in `skills-creation` now; Jev checks (restated-policy finder, lost-rule detector, term-collision question) enforce them later in the separate Jev PR. | The rule has a home today with no key or data egress; the Jev PR is owner-gated (client placement, secret item). |
| D2 | Lesson 5's missing-seam case is already covered by Classify (a hidden design choice is Partial and gets cut). The end boundary goes in the packet's Stop; the input check goes in Sources and points to the existing stand-in rule instead of copying it. | One home per fact; the prompt's stand-in rule already lets work proceed against a settled contract. |
| D3 | Lessons 4 and 6 are one sentence. | Same decision: how to make examples that test definitions. |
| D4 | Lesson 7 is one sentence in step 1: a source is not a success definition. | The skill already requires a success definition; the failure was treating "use real sessions" as one. |
| D5 | Lesson 8 goes to the devfiles prompt's Stacked PRs bullet, the only place `gh stack` is described. | One home. |

## Runs (one target each)

| Run | Target | Change | Lesson |
|---|---|---|---|
| 1 | `skills-creation` | `SKILL.md` step 1 completion: "A source such as 'use real sessions' is not a success definition." | 7 |
| | | `SKILL.md` Steering, after the deletion test: "Before deleting a line that repeats another skill's rule, find that rule stated in its owner; if it is not there, move it there first." | 2 |
| | | `references/reference-design.md` Canonical Placement Test, new row: "rule another skill owns -> a pointer to that skill, never a copy" | 1 |
| | | `SKILL.md` step 4, The wording: "When a skill defines categories agents apply, write worked examples against the definitions before review. When an example and a definition disagree, check both against the intended behavior and correct whichever is wrong. Draw examples from patterns in real work, not its details." | 4, 6 |
| | | `references/review/lanes/rule-agreement.md` How to inspect: "For a renamed term, search the plugin for the new word's existing meanings and flag a collision." | 3 |
| 2 | `manage-agents` | `references/agent-job-packet.md` Stop, replacing "Where the job ends.": "Where the job ends, including whether it pushes, opens a PR, and runs the full suite." Sources, added: "Name each input the job needs and the evidence it is usable. Work that needs an input that is not usable yet waits, unless an agreed contract or stand-in lets it proceed (the stand-in rule in the owner's prompt)." | 5 |
| 3 | devfiles `shared/my_agents.md` | Stacked PRs bullet: "`gh stack submit --auto` opens new PRs as drafts unless `--open` is passed. After submitting, check each PR's draft state and mark one ready with `gh pr ready` only when it is meant for review now; `implementation-pr-wrapup` owns readiness." | 8 |

Run 1 is `behavior-changing`: it changes the main path (step 1, Steering, step 4), a placement rule (`reference-design.md`), and a review check (`rule-agreement.md`), so both review stages apply in full. Run 2 is `behavior-changing` too: its Sources sentence adds a branch predicate (an input not yet usable waits unless a contract or stand-in lets it proceed), so it takes full review coverage. Run 3 is a prompt edit in devfiles with its own proof below.

## Authoring basis and proof

User-directed intent, backed by the evidence above. The owner excluded new tests and pressure runs.

- Structural checks (runs 1–2): the existing suite `pnpm --dir tests/skills test` and `claude plugin validate .` plus `claude plugin validate plugins/shravan-dev-workflow`, reported with counts and exit codes.
- Static coverage (runs 1–2): a walkthrough mapping each lesson's recorded failure to the sentence that now addresses it. This is coverage of source by rule, not evidence that the failure is prevented; any case whose historical artifact is not accessible is labeled a representative scenario.
- Behavior: unverified and deferred, the owner's accepted proof gap.
- Run 3: `git diff --check` in devfiles and a read of the changed bullet against `gh stack submit --help`; `shared/` is not applied by chezmoi.

## Coordination

Base: `chore/role-openings` (#110) at `6abaf11b`, since run 2 edits the same packet. Runs 1–2 ship as one ai-tools PR at 2.69.0 with a new changelog entry; run 3 ships in a devfiles PR from `origin/main` with the model-map follow-up.

## Non-goals

The Jev checks themselves (Jev PR). New tests or pressure runs. Any change to what a role owns.

## Spec-review record

Review 1 (GPT-6 Astra high 🔎 Review Sidekick, session `01a0ecc1-1353-7411-a8ac-913307b24ea6`, `tmp/learnings-review.md`): `targeted-revision`, 5 findings (F1 example blame, F2 unfinished-input wait, F3 scoped classification, F4 false `gh stack` claim, F5 proof labels). Revised here. Verification 1: F1, F2, F4, F5 closed; F3 open for run 2's classification, revised here (run 2 is behavior-changing).
