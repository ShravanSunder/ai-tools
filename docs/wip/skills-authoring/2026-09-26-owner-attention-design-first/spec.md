# Owner attention goes to design

Multi-run skill-change spec for the `shravan-dev-workflow` plugin. Revision **r5**, 2026-09-26. Status: **accepted-to-implement** (owner accepted r5 on 2026-09-26, without a further lead check; D13 kept). No skill file changes before `accepted-to-implement`.

Work thread: project "Shravan development workflow", board "Workflow improvements", topic "Owner attention: design briefs, not procedural stops", root `01a0df28-abe6-7453-8ddf-fa03f653a22c`.

This plugin change stands alone. The brief shape and the convergence rule both live inside the plugin. The companion devfiles change to `shared/my_agents.md` (Owner Attention section, **Waiting on owner**, the persisted-data-format clarification) states the owner's preference and points to this plugin's `owner-decision-brief` reference for the shape. Either PR can land first.

Revision history: r2 was the first reviewable draft. r3 added anchors from a three-Worker conflict sweep. r4 applied the first review's findings F1 to F7. r5 applies the verification's two residual corrections, exactly as the lead prescribed them.

## Problem and evidence

A log audit covered 2026-09-25 18:00 to 2026-09-26 15:00: 13 Claude Code sessions and 252 Codex session files, scanned by four Luna-high Workers. Main verified the counts and spot-checked the decisive quotes in the raw logs. Findings are in Main's session scratchpad under `log-scrape/{claude,codex-am,codex-pm1,codex-pm2}/findings.md`. There were 72 owner-facing stops: 38 design, 25 procedural, and 9 mixed.

1. **Round caps produced permission prompts.** "May I have the same independent reviewer verify this final correction, then continue to an unmerged PR?" (codex-router quota, 09-26 07:43). "A reviewer check would be a third round — allow it?" (router-claude, 09-26 10:57). The IPC #364 correction stopped at the cap.
2. **Design decisions arrived as menus.** `AskUserQuestion` prompts bundled UX, stored-state behavior, reviewer choice, and proof timing, each with a preselected answer. The owner said "your requirements were not very human friendly" (IPC, 09-25 21:10) and "maybe you can draw it out so we're on the same page" (IPC, 09-25 18:46). The shape comes from `decision-needed`, which returns "the decision owner, options, evidence, and deferral consequence" (`spec-design/SKILL.md:91`, `program-design/SKILL.md:68`).
3. **Drawn models worked.** "your model fits how the command bar already works" (worktrees, 09-26 11:40), after a drawn menu flow. "i think i mostly agree with you" (pane-fixes, 09-26 09:54), after a side-by-side lifecycle comparison.
4. **Helpers asked the owner for a work home.** "Which Agent Router project/thread should this sidekick use?" was asked three times in one minute (bridge stability, 09-26 03:05), and a ci-tq lane asked twice in four seconds. The source is `practices-collaboration/SKILL.md:18`.
5. **PR topology reached the owner.** `plan-implementation/SKILL.md:29` and `shared-references/canonical-implementation-plan.md:53` both wait for an owner selection between groupings. This is a hypothesis linking to evidence 1: the audit counted "which PR" asks among the procedural stops, but did not attribute them to this rule.

External guidance supports the direction. OpenAI's "Rethinking skills and prompts for GPT-6 Astra" (2026-09-11), in Decision boundaries and Persistence, says ask-first language written for older models makes Astra stop where the owner wanted it to continue. Anthropic's "Getting the most out of Opus 5.5" (2026-09-22), in "Tell it which stops you want", says a model otherwise stops for "a list of choices that don't block the work".

## Mental model

```text
                    owner-facing contact
                            │
          ┌─────────────────┴──────────────────┐
       design                               procedure
  boundaries, ownership,              sequencing, PR grouping,
  contracts, behavior,                agent and model, review rounds,
  stored-state meaning                work home, in-lane seams
          │                                    │
  owner-decision brief                 decide, record in the trace,
  (shared reference)                   one line in the run summary
```

A review loop runs until it converges. If it stops converging, that points to a problem in the design or plan, so it reaches the owner as a brief. A correction that changes design meaning goes to the owner before any further review.

## Success definition

1. Every owner decision a skill raises is a brief built from `owner-decision-brief.md`. The owner never sees a bare option list.
2. No skill asks permission for another review or correction pass. Correction continues while it converges and inside the accepted boundary. Non-convergence and meaning changes both reach the owner as briefs.
3. A helper never asks the owner for a work home. Main names a missing home once under Waiting on owner.

## Decisions

Each row is a default with its rationale. Strike or change any row before review closes.

| # | Default taken | Rationale |
|---|---|---|
| D1 | Count caps become convergence, with no backstop pass cap. | A count is procedure, while a recurring finding is design evidence. The no-progress rule catches a slow drip of new findings. |
| D2 | The convergence definition is exactly the text in Contract C1. | This lets the rule be checked from existing review records (F2). |
| D3 | `not-converging` is a **loop result**. It replaces `remediation-limit-reached` in `implementation-review`'s result set and is added to `spec-program-review`'s result set. In `skills-creation` it is a stage outcome next to the lane verdicts, and `lane-schema.md` verdict labels are unchanged. It is not a phase return token. | A single review's verdict judges one artifact, while convergence judges the loop (F1, lane-schema). |
| D4 | Convergence has one definition home per review owner (Contract C1). Every other site cites it. | This gives one live owner per kind of review (F2). |
| D5 | The recovery-budget machinery is deleted: unknown counts, the fabricated-zero guard, one-time recovery admission, and permission before corrections. When prior review evidence is missing, the current review sets the baseline (C1). The stale-source and wrong-source checks stay. | That machinery existed only to protect the count (F1 says to keep the valid stale-source checks). |
| D6 | The brief shape has one owner: the new `shared-references/owner-decision-brief.md` (Contract C3). Skills load it at their owner-decision stops. The devfiles prompt points to it. | The plugin is public and must stand alone, and one owner prevents drift (F3). |
| D7 | `program-design` step 16 leads with a drawn component view and one drawn entry-to-effect path, then the tables. | The owner confirms what they can read (evidence 2). |
| D8 | The presentation skills' triggers add "putting a design decision in front of the owner". | A short question never met the "substantial response" bar. |
| D9 | No-home: a helper never asks the owner and returns `no-home` to its parent. Trace handling stays under the existing role-and-grant rules. Main names the gap once under Waiting on owner. | F6. |
| D10 | The owner skipped new pressure testing on 2026-09-26. Existing scenarios, grader criteria, catalogs, and static assertions that encode the old behavior are rewritten in the same run. The static suite and typecheck run. Rewritten scenarios are not run. | This is a hard cutover, so tests can't keep asserting removed text. Behavior is unevaluated, and that is named as a gap. |
| D11 | Everything lands in one PR with one minor version bump (2.63.0 to 2.64.0) across every version surface (Coordination) and one changelog entry. | The result rename crosses runs 5 to 10. |
| D12 | Merge authority, phase gates, unrunnable proof, and the pressure-testing default after non-reproduction are out of scope. | These are open owner questions. F5 removed the pressure-testing default from r3. |
| D13 | PR grouping and topology are procedure. The planner picks one, and records the choice, the alternatives, and the reason in the plan. | This matches the global prompt's procedure list. **Strike this row** if topology is yours to decide. |
| D14 | Owner-initiated direct contact with an implementation 🐒 Sidekick stays. Helpers don't *start* owner contact. | This is an existing feature (`orchestrator-design:78`, `orchestrator-implementation-goal:48`, plugin `README.md:128`). |
| D15 | Automatic further review rounds apply only to corrections inside the accepted boundary (Contract C2). | F4. |
| D16 | The plugin `README.md` and `tests/skills/pressure-scenarios/README.md` summaries are cut over at ship. | They restate the changed rules. |

## Contracts

### C1. Convergence

**Definition text.** It appears once in each home below. Other sites cite the home instead of restating it.

> After each correction pass, compare this review with the previous one using the existing finding identity (anchor plus failure form). Return `not-converging` when either holds:
> 1. **Recurrence.** A finding the lead verified closed in an earlier review is accepted again. A finding whose correction never closed is still open, which is not a recurrence.
> 2. **No progress.** The count of open accepted findings did not drop in two adjacent comparisons in a row: it stayed equal or rose from review N−1 to N, and again from N to N+1.
>
> When earlier review history is unavailable, the current review sets the baseline, and both conditions count from there. A correction outside the accepted boundary (C2) is not a pass.

**Worked cases** (open accepted findings per review):

| Sequence | Result |
|---|---|
| 5 → 3 → 1 → 0 | continues, then `ready` |
| 4 → 4 → 4 | `not-converging` at the third review (two adjacent non-drops) |
| 3 → 2 → 2 → 3 | `not-converging` at the fourth review (2→2, then 2→3) |
| 4 → 4 → 2 | continues (only one non-drop before a drop) |
| F7 verified closed in review 2, accepted again in review 4 | `not-converging` at review 4 (recurrence) |
| F2 corrected in pass 2 but still open in review 3, counts 3 → 2 → 1 | continues (F2 never closed, so it is not a recurrence) |

**Homes:**

| Review owner | Definition home | Citing sites |
|---|---|---|
| `implementation-review` | `references/finding-and-reduction.md`, next to the result labels and precedence | `implementation-review/SKILL.md`, `implement-plan`, `orchestrator-implementation-goal` |
| `spec-program-review` | `references/finding-and-reduction-schema.md`, next to the result set and after-round record at line 120 | `spec-program-review/SKILL.md`, `orchestrator-design` |
| `skills-creation` | `SKILL.md`, Review section (line 134) | step 6, step 10, `references/review/spec-review.md`, `references/review/implementation-review.md` |

**Result precedence.** In `implementation-review`, `not-converging` takes the old top slot: `not-converging -> blocked-input -> needs-revision -> decision-needed -> ready`. In `spec-program-review`, the result set becomes `ready | needs-revision | blocked | decision-needed | not-converging`, with `not-converging` first in precedence.

### C2. Stop or re-review boundary

It appears in the same three homes, next to C1:

> A correction is inside the accepted boundary when it changes no design meaning, scope, contract, or owner decision. Only those corrections get further review rounds automatically. A correction that changes, or might change, any of those returns to Main, which brings the owner a brief. Once the owner settles it, review continues under C1 without a permission prompt.

Walkthrough the implementer must check for each home: (a) an in-boundary wording fix continues automatically; (b) a fix that adds a new public field goes to a brief first; (c) a fix whose effect on scope is uncertain goes to a brief first.

### C3. Owner-decision brief

New file `plugins/shravan-dev-workflow/shared-references/owner-decision-brief.md`, owned by `program-design` (run 4). Its full proposed text:

```markdown
# Owner-decision brief

Use this when a skill needs the owner to decide something about design: domain boundaries, storage boundaries (what is stored, where, who owns it, what it means), architecture, contracts between parts, product behavior, the shape of the design itself (how it decomposes and which abstractions carry weight), or a correction that would change any of them. Procedure (sequencing, PR grouping, agent or model choice, review rounds, work home) is decided and recorded, never briefed.

Return one brief per decision, in this order:

1. **The decision in one sentence**, in the owner's words where possible.
2. **The current model, drawn.** Load `presentation-tui` or `presentation-webui` for the host and draw what exists today: the parts, who owns what, and the path that matters.
3. **Each option, drawn as a change to that picture**, with what it gains, what it costs, and who bears the cost.
4. **Your recommendation and why.**
5. **What happens if the owner defers**: what stays blocked and what continues.

Good briefs look like the ones owners accept quickly: one picture of today, one picture per option, a clear pick. Bad briefs are option menus with a preselected answer, several unrelated decisions bundled into one prompt, and internal jargon the owner has not used.

A question tool may carry the final pick only after the brief is on screen. Ask once. Later updates point back to the open brief in one line instead of asking again.

Complete when the owner can decide from the brief alone, without opening a file.
```

**Call sites.** Each uses the grammar `IF <stop condition>, load ../../shared-references/owner-decision-brief.md and return the brief`:

| Skill | Stop condition |
|---|---|
| `spec-design` (lines 91, 196) | returning `decision-needed`, or asking a load-bearing decision in step 4 |
| `program-design` (line 68, step 16) | returning `decision-needed` |
| `orchestrator-design` (line 51, and the break stop at line 57) | `not-converging`, or a mental-model break or unmade meaning |
| `orchestrator-implementation-goal` (line 35, and step 4's break stop at line 30) | `not-converging`, or a design break from an implementer or reviewer |
| `docs-maintain` (line 37, `references/workflows.md:39`) | code and docs disagree and the driver is not obvious |
| `skills-creation` (Review section, consumed by steps 6 and 10) | a semantic change outside the accepted boundary (C2), or the review loop returns `not-converging`. The reviewer returns the stop to Main, and Main loads the reference and renders the brief. The reviewer stays read-only. |

## Runs

Each run names one skill. **Failure** cites the evidence it serves. Anchors are at base `52d40a44`. The Consumer disposition table below is the complete list of what each run edits. The run sections show the load-bearing before and after text.

### Run 1: `presentation-tui`

- **Surfaces:** trigger.
- **Failure:** evidence 2 (wrong invocation).
- **Line 3:** `…or multi-section response on a monospace terminal…` becomes `…or multi-section response, or when putting a design decision in front of the owner, on a monospace terminal…`. The rest is unchanged.

### Run 2: `presentation-webui`

- **Surfaces:** trigger.
- **Failure:** evidence 2.
- **Line 3:** the same insertion after `multi-section response`.

### Run 3: `spec-design`

- **Surfaces:** main path.
- **Failure:** evidence 2 (wrong output shape).
- **Line 91:** `…return the decision owner, options, evidence, and deferral consequence.` becomes `…return the decision owner and evidence, and IF returning decision-needed, load ../../shared-references/owner-decision-brief.md and return the brief.`
- **Line 196:** `Ask one load-bearing decision at a time with options, recommendation, evidence, gain, cost, foreclosed choices, and consequence of deferral.` becomes `Ask one load-bearing decision at a time: load ../../shared-references/owner-decision-brief.md and return the brief, including foreclosed choices.`
- **Line 260:** `…basis, block, or permission requirement is recorded` becomes `…basis or block is recorded`.

### Run 4: `program-design` (owns `shared-references/owner-decision-brief.md`)

- **Surfaces:** main path, and depth (the new shared reference).
- **Failure:** evidence 2.
- **Create** `shared-references/owner-decision-brief.md` with the text in C3.
- **Line 68:** `…return the decision owner, alternatives, tradeoffs, falsifiers, and deferral consequence.` becomes `…return the decision owner and falsifiers, and load ../../shared-references/owner-decision-brief.md and return the brief.`
- **Step 16, lines 254 to 261:** `Show these in the response body:` becomes `Lead with pictures the owner can read, then the tables:`. The fence becomes: component view drawn; one representative entry-to-effect path drawn; binding table; trace table; deviations and unresolved decisions (none or a list). Line 263's reuse rule keys on the same five items.
- **Line 289:** `…basis, block, or permission requirement is recorded` becomes `…basis or block is recorded`.

### Run 5: `implementation-review` (C1 and C2 home for implementation)

- **Surfaces:** main path, depth, README, and proof per D10.
- **Failure:** evidence 1 (a known rule turned into an owner stop).
- **`references/finding-and-reduction.md`:** C1 and C2 are added next to the result labels. `remediation-limit-reached` becomes `not-converging` in the return set (line 7), the precedence (line 79), and the definition (lines 98 to 100).
- **`SKILL.md:20`:** `Reject recovery when three or more remediation passes are known, … return remediation-limit-reached unless the user explicitly authorized continuation after seeing that stop.` becomes `When prior review evidence is missing, inspect the current source and proof, record what is missing, and review against the current baseline (see references/finding-and-reduction.md). Reject a stale or wrong source or proof.`
- The other anchors in this run are listed in the consumer table.

### Run 6: `implement-plan` (C1 consumer)

- **Surfaces:** main path.
- **Failure:** evidence 1.
- **Line 32:** the three-pass condition and the `review/remediation four` sentence become `apply the smallest correction and fresh proof. In an orchestrated project flow, return the affected proof through orchestrator disposition to the same 🔎 Review Sidekick. When the review returns not-converging, stop correcting and return it to the orchestrator.`
- **Line 41:** deleted.
- **Line 43:** `…and no fourth remediation occurred` becomes `…and no correction continued after not-converging`.

### Run 7: `orchestrator-implementation-goal` (C1 consumer, brief call site)

- **Surfaces:** main path, depth, README.
- **Failure:** evidence 1.
- **Line 35:** `7. Repeat correction, proof, and review while accepted findings remain and fewer than three … unless the user explicitly authorizes continuation.` becomes `7. Repeat correction, proof, and review while accepted findings remain. IF the review returns not-converging, load ../../shared-references/owner-decision-brief.md and return a brief of what keeps failing and why.`
- **Lines 40 to 45 (Bounded Recovery):** collapse to `If prior review evidence is unavailable, inspect the current source and proof boundary, record what is missing, and route an ordinary review; the current review sets the convergence baseline.`

### Run 8: `spec-program-review` (C1 and C2 home for design review)

- **Surfaces:** main path, depth, proof per D10.
- **Failure:** evidence 1.
- **`references/finding-and-reduction-schema.md`:** C1 and C2 are added. The result set at line 63 gains `not-converging`, and the precedence near line 113 gains it at the top. Line 120's second-round and third-review sentences are replaced by a citation of C1.
- **`SKILL.md:56-57`:** `admit the one permitted second normal round…` and `any third normal review stops review-permission-required…` become `run further rounds for concrete source-backed substantive issues inside the accepted boundary until the review is ready or not-converging (see references/finding-and-reduction-schema.md); reject a rerun based only on pedantry, style, an already-satisfied finding, confidence, or generic freshness`.

### Run 9: `orchestrator-design` (C1 consumer, brief call site)

- **Surfaces:** main path.
- **Failure:** evidence 1.
- **Line 51:** `…Allow a second only for … Ask before a third.` becomes `Prefer one review-and-correction round. Further rounds follow spec-program-review's convergence rule. Pedantic, stylistic, or already-satisfied findings do not justify another round. IF the review returns not-converging, load ../../shared-references/owner-decision-brief.md and return a brief of what keeps failing.`
- **Line 64:** the recovery and allowance sentences become `If prior review results are unavailable, verify current artifacts and governing sources, record why, and run an ordinary review; the current review sets the baseline. Route design breaks to their owner.`

### Run 10: `skills-creation` (C1 and C2 home for its two review stages)

- **Surfaces:** main path, depth, proof per D10.
- **Failure:** evidence 1. This skill's own caps would stop the next skill change.
- **Line 134:** replaced by `Proposal review prefers one independent review and one remediation; the same lead verifies corrected anchors.` followed by C1 and C2, then `IF a review stage returns not-converging or a semantic change outside the accepted boundary, Main loads ../../shared-references/owner-decision-brief.md and returns the brief; the review lead returns the stop to Main and stays read-only.` Steps 6 and 10 consume this call instead of restating it.
- **Step 6 (line 237):** `Expanded or uncertain semantic change stops review-permission-required instead of automatically dispatching another proposal review.` becomes `A remediation inside the accepted boundary gets another proposal round under the Review section's convergence rule. An expanded or uncertain semantic change returns to Main for an owner brief first (C2).` The clause `a second review requires explicit user permission` is deleted.
- **Step 10:** `…only while fewer than three remediation passes have completed. After remediation three, stop remediation-limit-reached; do not start review or remediation four without explicit user permission.` becomes `…until the result is great or the loop returns not-converging under the Review section's rule; on not-converging, bring the owner a brief.`
- **`references/testing/pressure-testing.md`:** unchanged (F5).

### Run 11: `practices-collaboration`

- **Surfaces:** main path.
- **Failure:** evidence 4.
- **Line 18:** `…ask the owner once which project to use or create, naming the candidates or the gap. The owner controls projects and boards; do not create one without that answer. In the same turn, return no-home: <gap> to the caller and continue the work.` becomes `…a helper does not ask the owner; it returns no-home: <gap> to its parent and handles its trace under the role and grant rules below. Main names the candidates or the gap once under Waiting on owner in its next report and keeps working. The owner controls projects and boards; do not create one without that answer.` The rest of the line is unchanged.

### Run 12: `plan-implementation` (owns `shared-references/canonical-implementation-plan.md`)

- **Surfaces:** main path and depth.
- **Failure:** evidence 5 (hypothesis) and D13.
- **`SKILL.md:29`:** `…present concrete choices with recommendation/tradeoffs and obtain the owner selection before finalizing.` becomes `…pick one and record the choice, the alternatives, and the reason in the plan.`
- **`canonical-implementation-plan.md:53`:** `…presents concrete choices, a recommendation, and tradeoffs, then waits for the owner selection before returning ready.` becomes `…picks one, records the choice, the alternatives, and the reason in the plan, and returns ready.`

### Run 13: `docs-maintain` (brief call site)

- **Surfaces:** main path and depth.
- **Failure:** evidence 2.
- **`SKILL.md:37`:** `…ask the user if it is not obvious.` becomes `…IF it is not obvious, load ../../shared-references/owner-decision-brief.md and return a brief of both versions.`
- **`references/workflows.md:39`:** `If unclear, ask the user directly` becomes `If unclear, return the brief from SKILL.md`.

## Consumer disposition

This is every active site that must change, verified at `52d40a44`. The disposition labels are **rewrite** (new text per the run and contract), **cite** (replace with a citation of the C1 or C3 home), **delete**, and **rename**. Anything not listed keeps its current text, including the stale-source and wrong-source checks (D5).

| Run | Site | Current obligation | Disposition |
|---|---|---|---|
| 5 | `implementation-review/SKILL.md:10` | "may remediate at most three times" | delete the sentence |
| 5 | `implementation-review/SKILL.md:18` | returns `admit \| blocked-input \| remediation-limit-reached`, takes consumed passes from the record | rewrite: `admit \| blocked-input`, and take earlier findings as the C1 baseline |
| 5 | `implementation-review/SKILL.md:20` | recovery and count rules | rewrite (run 5) |
| 5 | `implementation-review/SKILL.md:22` | completion names count evidence and `remediation-limit-reached` | rewrite: prior-findings evidence or the missing-evidence reason; `admit \| blocked-input` |
| 5 | `implementation-review/SKILL.md:24` | "remediation-limit exit commissions no lead" | delete "remediation-limit" |
| 5 | `implementation-review/SKILL.md:59` | a design break returns to the user | rewrite: returns to the orchestrator for an owner brief |
| 5 | `implementation-review/SKILL.md:61` | result set includes `remediation-limit-reached` | rename to `not-converging` |
| 5 | `implementation-review/SKILL.md:66-69` | remediation one or two, stop after three, missing receipt, budget-unknown permission | rewrite as one bullet citing C1 and C2 in `references/finding-and-reduction.md`; keep "Do not persist counters, ledgers, hashes, or review state in the plan" |
| 5 | `implementation-review/SKILL.md:84` | "exceeds the three-remediation boundary" | rewrite: "continues after not-converging" |
| 5 | `implementation-review/README.md:34, 38` | three-remediation limit, "remediation limit reached" | rewrite and rename |
| 5 | `implementation-review/references/finding-and-reduction.md:7, 79, 98-100` | label set, precedence, definition | rename, and add C1 and C2 |
| 5 | `tests/skills/lib/minimal-planning-delivery-contract.test.ts:115-121, 135-138` | test named "keeps design and implementation review limits separate"; `implementationReview` reads only `implementation-review/SKILL.md` and asserts the cap | add a reader for `implementation-review/references/finding-and-reduction.md` and assert the C1 and C2 definition text there; keep a body assertion that `SKILL.md` cites that reference; rename the test to "review loops converge under one owner each" |
| 5 | `tests/.../implementation-review/stops-before-fourth-remediation.md` and its `cases.ts` entry (scenario id at 286-291) | stops at pass four | rename to `stops-when-not-converging`, rewrite criteria |
| 5 | `tests/.../implementation-review/admit-bounded-recovery-review.md` and `cases.ts:405-410` | one-time recovery, count preservation | rewrite to a missing-history baseline review |
| 6 | `implement-plan/SKILL.md:32, 41, 43` | three-pass condition, receipts, no fourth remediation | rewrite, delete, rewrite (run 6) |
| 7 | `orchestrator-implementation-goal/SKILL.md:34` | "preserves the existing remediation limit" | rewrite: "applies the convergence rule" |
| 7 | `orchestrator-implementation-goal/SKILL.md:35, 40-45` | cap step, Bounded Recovery | rewrite (run 7) |
| 7 | `orchestrator-implementation-goal/SKILL.md:55` | "repeated recovery, or fourth remediation" | rewrite: "or continuing after not-converging" |
| 7 | `orchestrator-implementation-goal/README.md:24` | three-pass cap, bounded recovery | rewrite; keep the merge sentence |
| 7 | `orchestrator-implementation-goal/references/goal-contract-and-routing.md:77` | route condition "remediation count below three" | rewrite: "review has not returned not-converging" |
| 7 | `…/goal-contract-and-routing.md:98, 100-108, 120` | cap, recovery steps, "bounded recovery/remediation rules are intact" | cite C1; collapse recovery; rewrite `:120` to "review returned ready, or not-converging reached the owner as a brief" |
| 8 | `spec-program-review/SKILL.md:27` | one second round | rewrite (run 8) |
| 8 | `spec-program-review/SKILL.md:45` | result set lacks `not-converging` | add it |
| 8 | `spec-program-review/SKILL.md:56-57` | one permitted second round, third-review permission | rewrite (run 8) |
| 8 | `spec-program-review/SKILL.md:92` | status set including "explicit user permission for a third review" and "one orchestrator-authorized recovery request" | rewrite: `no prior review \| prior rounds with their findings \| earlier results unavailable` |
| 8 | `spec-program-review/SKILL.md:95` | one orchestrator-authorized recovery, preserve limits and unknown history | rewrite: when prior results are unavailable, inspect the current target and sources, record the reason, and review against the current baseline (C1); keep the wrong-source rejection |
| 8 | `spec-program-review/SKILL.md:105` | completion names recovery admission | rewrite: "any missing-history baseline is recorded with its reason" |
| 8 | `spec-program-review/SKILL.md:107, 127` | second-round admission, third review needs permission | cite C1 |
| 8 | `spec-program-review/SKILL.md:251-252` | third-review and recovery completion blockers | rewrite as one blocker: "a round ran after not-converging, or outside the accepted boundary without an owner brief" |
| 8 | `spec-program-review/references/finding-and-reduction-schema.md:63, 113, 120` | result set, precedence, round admission | add `not-converging`; add C1 and C2 |
| 8 | `tests/.../spec-program-review/one-review-one-remediation.md` | one round plus one remediation | rewrite to a converging multi-round case |
| 8 | `tests/.../spec-program-review/cases.ts:237, 247-255` | third-round approval, recovery without reset, correction and recovery limits | rewrite criteria to C1 and C2 and the missing-history baseline |
| 8 | `tests/.../spec-program-review/admit-one-recorded-recovery-review.md` | one-time recovery | rewrite to a missing-history baseline review |
| 8 | `tests/skills/lib/minimal-planning-delivery-contract.test.ts:116, 129-132` | `designReview` reads only `spec-program-review/SKILL.md`, and asserts the permitted-round and third-review text | add a reader for `spec-program-review/references/finding-and-reduction-schema.md` and assert the C1 and C2 definition text there; keep a body assertion that `SKILL.md` cites it |
| 9 | `orchestrator-design/SKILL.md:51, 64, 70` | round admission, recovery allowance, "within the allowed rounds" | rewrite, rewrite, delete the phrase |
| 9 | `tests/skills/lib/minimal-planning-delivery-contract.test.ts:133-134` | "Ask before a third" | rewrite to the run 9 sentence |
| 9 | `tests/.../orchestrator-design/cases.ts:62, 70, 94, 138-146` | third-review permission, single permitted remediation, remediation allowance, one-time recovery, preserve correction capacity | rewrite criteria to C1 and C2 and the missing-history baseline |
| 9 | `tests/.../orchestrator-design/stops-before-second-review.md` | third-review approval | rename to `continues-while-converging.md`, rewrite |
| 9 | `tests/.../orchestrator-design/recovers-missing-review-evidence-once.md` | one-time recovery | rewrite to a missing-history baseline review |
| 10 | `skills-creation/SKILL.md:134` (C1, C2, and the C3 call), `237, step 10, 290, 297-298` | caps, permission stop, one-remediation reuse clause, permission blockers | rewrite per run 10; line 290 becomes "proposal coverage was reused after a semantic change outside the accepted boundary"; lines 297 and 298 merge to "a further round ran after not-converging, or outside the accepted boundary without an owner brief" |
| 10 | `skills-creation/references/review/spec-review.md:58, 62` | "at most one remediation", "one permitted remediation", `review-permission-required` | cite C1 and C2 in `SKILL.md`; closure verification by the same lead stays |
| 10 | `skills-creation/references/review/implementation-review.md:55` | stop after remediation three | cite C1 |
| 10 | `skills-creation/references/review/lanes/lane-schema.md:17` | verdict labels | unchanged (D3) |
| 10 | `tests/skills/lib/minimal-planning-delivery-contract.test.ts:139-141` | proposal cap, three passes, remediation four | rewrite to assert the C1 definition and the C3 call in `skills-creation/SKILL.md` (its body is the home) |
| 10 | `tests/.../skills-creation/separate-review-remediation-limits.md` and its `cases.ts` entry | separate caps | rename to `review-stages-converge`, rewrite |
| 5, 8, 9, 10 | `tests/skills/lib/minimal-planning-delivery-contract.test.ts:174-184` | file-existence list of the renamed scenarios | update the renamed paths |
| 5, 9, 10 | `tests/skills/pressure-scenarios/README.md:93, 181, 199` | scenario catalog rows | rename ids, rewrite descriptions |
| 11 | `practices-collaboration/SKILL.md:18` | ask the owner once | rewrite (run 11) |
| 11 | `tests/.../practices-collaboration/cases.ts:15`, `no-board-owner-away-continues.md:17` | "Asks the owner once" | rewrite: Main names the gap under Waiting on owner; a helper returns `no-home` |
| 11 | `tests/.../practices-show-me-your-work/cases.ts:145` | "says it asks the owner once" | rewrite to the same wording |
| 12 | `plan-implementation/SKILL.md:29`, `shared-references/canonical-implementation-plan.md:53` | owner selection of topology | rewrite (run 12) |
| 3, 4, 13 | `spec-design:91, 196, 260`, `program-design:68, 254-263, 289`, `docs-maintain:37`, `workflows.md:39` | bare decision payloads, permission requirement | rewrite (runs 3, 4, 13) |

After implementation, the cutover grep in the proof plan checks this table; it does not replace it.

## Authoring basis and proof plan

- **Authoring basis:** `observed failure`, from the log audit. Reproduction was not attempted because the owner skipped pressure testing (D10), so no RED is claimed.
- **Claim ceiling:** "drafted from user intent; behavior not evaluated."
- **Structural proof:** `pnpm --dir tests/skills test` and `pnpm --dir tests/skills typecheck` pass. `rg "remediation-limit-reached|review-permission-required|three remediation|three-remediation|remediation four|fourth remediation|Ask before a third|approval for a third|third normal review|single permitted remediation|permission requirement|owner selection|asks the owner once|ask the owner once|remediation count below three|one-time recovery|recovery allowance"` over `plugins/shravan-dev-workflow/` and `tests/skills/` returns nothing. Every C1 and C3 call site loads its home by exact path. Each rewritten scenario keeps a criterion paired with its failure example.
- **Source walkthroughs (no execution):** C1's worked cases walked against all three homes. C2's three cases walked against all three homes. The run 11 walkthrough for Main, a Sidekick with a trace grant, a Sidekick without one, a read-only reviewer, and a Worker or Operator.
- **Behavior gap:** no run has behavior evidence. The rewritten scenarios are defined but not run.
- **Security:** no script, hook, asset, or network surface. The ship step's plugin reinstall is an installed-cache refresh, which is listed in `security-gate.md`. Decision: `allowed` through the standard refresh, at ship only.

## Coordination

- **Base:** `origin/main` at `52d40a44`, branch `chore/owner-attention-design-first`, worktree `~/dev/ai-tools.chore-owner-attention-design-first`.
- **Pending edits:** only this spec.
- **Landing:** runs commit in order on one branch as one PR (D11). Run 4 lands before runs 3, 7, 9, and 13, which load its reference.
- **Version (D11), 2.63.0 to 2.64.0 in every surface:** `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`, `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`, `plugins/shravan-dev-workflow/.cursor-plugin/plugin.json`, `.claude-plugin/marketplace.json` (the `shravan-dev-workflow` entry, line 26), and `.cursor-plugin/marketplace.json` (line 27). Then run the platform validation and readback from `skills-creation/references/platform-mechanics.md`.
- **Changelog:** one entry in `docs/changelog/` with its README index row.
- **Plugin README (D16):** `README.md:128` narrows direct contact to owner-initiated. `:130` drops the recovery-review sentence for convergence. `:134` says Main names the gap under Waiting on owner and helpers return `no-home`.
- **Refresh:** reinstall the plugin in Claude Code and Codex, reported separately from behavior proof.

## Non-goals

- **Merge authority, phase gates, unrunnable proof.** "Stop at PR-ready and unmerged", "the user owns … phase gates", and proof-gate permissions are unchanged. These are open owner questions.
- **Pressure-testing default after non-reproduction.** `pressure-testing.md:18` and `skills-creation/SKILL.md:183, 187, 286` are unchanged (F5).
- **Interview mode.** `discuss-pathfinding` (SKILL.md:84 and 102, question-craft.md:40 and 74 to 80) keeps its question-driven interview. The owner invokes it to be asked. A structural decision found there goes back to `program-design`, which briefs it.
- **Other plugins.** The `ai-scaffold` wizard (`scaffold-project/SKILL.md:16,54,64-66`, `commands/scaffold-project.md:28-34`) and the `agent-router` SessionRef fallback (`agent-collaboration/SKILL.md:47`) belong to other plugins. They are follow-ups if they cause stops.
- **Global-prompt safety permissions.** `rm` on directories, merging, and weakening a proof gate remain owner authorizations.
- **Historical docs.** Specs under `docs/wip/skills-authoring/` keep the old text.

## Spec-review record

- **Review 1** (r3): different-lineage 🔎 Review Sidekick, GPT-6 Astra high, session `01a0df2b-73ea-74b1-b334-96c068b0b55f`. Checks mental-model-fit, trigger-routing, rule-agreement, and depth-coverage were all `complete`. Verdict `targeted-revision`, implementation decision `revise-first`. Accepted F1 to F7 (blockers F1, F4, F6). Rejected: numeric backstop, mandatory pressure execution, "13 runs violate one-skill", broadening to non-goals, quote-offset-only nits. Its first turn on r2 was aborted by a Router stream overflow before any verdict.
- **Remediation** (r4): applied F1 to F7 as described in the Decisions (D2 to D6, D9, D11, D12, D15), Contracts, and Consumer disposition sections.
- **Remediation verification** (same lead, on r4): F2, F4, F5, F6, and F7 closed. Two residuals, inside F1 and F3: the static test reads SKILL.md bodies while C1 and C2 live in references, and `skills-creation` stops lacked a C3 call. Verdict `targeted-revision`, `revise-first`. No new independent defect. Pressure skip, no-cap policy, and non-goals were not reopened.
- **r5:** applies exactly the two corrections the lead prescribed. Under the current `spec-review.md:62`, another look by the lead needs explicit owner permission.
- **Acceptance:** the owner accepted r5 on 2026-09-26 and declined a further lead check. D13 (PR grouping is procedure) is kept. Implementation decision: `accepted-to-implement`.
- **Owner amendment (2026-09-26, after acceptance):** the C3 first sentence now names the owner's design list: domain boundaries, storage boundaries, architecture, contracts, product behavior, and the shape of the design. This is owner-directed wording with no change to structure or to any call site.
