# Skill spec: fix the six recorded skill-authoring misses

Revision 1. Owner plugin: `plugins/skill-authoring/`. Owner direction (2026-10-07): make the plugin work and the evals pass.

## Targets and runs

| Run | Target | Misses fixed | State |
| --- | --- | --- | --- |
| A | `skill-creation` | provider depth kept inline when drafting in chat; spec review skipped under "move fast" | proposed |
| B | `skill-orchestrator` | implementation review described generically instead of routed to `skill-review` | proposed |
| C | `skill-review` | full check set on a scoped edit; 3→2→2→3 not called not-converging | proposed |
| D | `skill-audit` | built a shared runtime document on request | proposed |

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

## Success definition

Under the same pressure prompts, fresh subjects keep provider depth in a named reference when drafting, hold the spec-review gate unless review is explicitly declined, route implementation review to `skill-review` by name, select only the scoped checks for a scoped edit, call 3→2→2→3 not-converging at the fourth review, and decline to build a shared runtime document while staying read-only.

## Decisions

| Decision | Default taken | Rationale | Priority |
| --- | --- | --- | --- |
| Where each fix lands | at the passage the subject read when it decided (lines above) | a rule far from its decision point is the failure seen here | must |
| Form of the fix | a bright line naming the subject's own rationalization, or one worked example where a rule was misapplied | the subjects knew the rules and talked themselves out of them; skill-creation's steering guidance prescribes exactly this | must |
| Home of "explicit skip" | `skill-creation` step 6 only; `skill-orchestrator` uses steps 1–6 and inherits it | one home per rule | must |
| New references or mechanisms | none | each fix is a sentence or two in an existing home | must |
| Done bar | fix-for-recorded-failure per scenario: the recorded fail is the base; 3 fresh passes at head | the owner's bar. Known weakness: a check that already passed 3 of 4 times passes 3 in a row about 42% of the time unchanged, so check-selection and stages-converge passes are weaker evidence | must |
| Regression | one fresh Run of every other active scenario of the four skills at head | edits to `SKILL.md` can move other behavior | should |

## Per-run surface allocation

- **A, `skill-creation`.** Main path, step 5 "Place the depth": a draft shown in the conversation still shows each file it would create under its path; provider-, case-, or example-specific depth appears as its own `references/<name>.md` with the `IF …, load` call in `SKILL.md`, unless the user explicitly asks for one file. Main path, step 6: an explicit skip names the review and declines it ("skip the spec review"); wanting speed, "just implement", or "no ceremony unless the skill requires it" is not a skip, because the skill requires the review. Trigger and depth unchanged.
- **B, `skill-orchestrator`.** Main path, step 6: when stating the route or plan, name `skill-review`'s implementation stage as the reviewer (and its spec stage at step 2); a generic "independent review by other agents" does not satisfy the step. Trigger and depth unchanged.
- **C, `skill-review`.** Depth, `references/implementation-review.md` (and the matching passage of `references/spec-review.md` if it selects the same way): state the scoped rule before the surface table, and label the table as the selection for an unscoped change. Main path, the convergence rule: one worked example, "3 → 2 → 2 → 3: 3→2 is progress; 2→2 and 2→3 are two adjacent comparisons without a drop, so the fourth review returns `not-converging`".
- **D, `skill-audit`.** Main path, the shared-contract passage (`SKILL.md:62`) and the read-only rule (`:75`): a request to make one shared runtime document that several skills load is the case this rule forbids; recommend against it, keep each skill's packet where it is, and stay read-only even when the request asks you to build it. "Explicitly asks to implement" covers a narrow recommendation the audit makes, not a change the audit rejects.

## Authoring basis and proof plan

Every run is `observed failure`, reproduced in the recorded batches above; done bar `fix-for-recorded-failure`. Proof per scenario: 3 fresh Runs at head through the runner, every check passing. Then the regression Runs. Static: `claude plugin validate .`, runner `lint` on `plugins/skill-authoring/skills`, `validate` on each changed skill.

## Coordination

Base: branch `skill-eval-runner` at `ebc90af7` (PR #116). No pending edits to these skills on any other branch. Version: `skill-authoring` 0.1.0 → 0.1.1 in all three manifests. Changelog: one dated entry for the four runs, landing with the last run.

## Non-goals

No change to `shravan-dev-workflow`. No runner changes. No token-usage work. No new references, checks, or scenarios. Criteria of the six checks stay as they are.

## Run status

A proposed · B proposed · C proposed · D proposed

## Review record

Spec review: pending.
