# Breakdown and review topology

Multi-run skill-change spec for the `shravan-dev-workflow` plugin. Revision **r5**, 2026-09-28. Status: **accepted-to-implement** (r5, verified 2026-09-28). r2 added the consumer disposition from the sweep; r3 applied the proposal review's six findings and its advice; r4 applies the verification's residuals (BF1, BF2, BF4) and BF7 (Spec-review record). Companion to `2026-09-27-workhorse-decomposition/spec.md` (Spec A) on the same branch and PR. No skill file changes before `accepted-to-implement`.

## Owner meaning (verbatim, 2026-09-27 and 2026-09-28)

- "sidekick does not make plans, sidekick executes. so maybe plans need to be moved from implementation orchestrator … and make apparent its up to main. then we have execution and wrapup in implementation"
- "the main agent does review (advisor if the project has one can help). but sidekicks and prs should be reviewed independently? how do we plan out this dag so it allows for independent prs?"
- "a large project should be broken down for prs and independent plans to execute (implementation plan — which is done by main agent with or without advisor)"
- "we design large plan we split work with planning and then assign to sidekicks based on work complexity. but complexity means architecture, not size (size means we should use workhorse and break it down within a pr). this doesn't mean tons of pr, pr are independent work"
- "pathfinding … is really to help the design and orchestrate design … It's not supposed to plan things out … We have implementation planning"
- "eventually i think planning would not be words, but a workflow like claude workflow with ts types and my own using the agent-collaboration with persistence; that's the eventual direction after"
- Accepted 2026-09-28 ("lets go" on the recommended list): each PR's plan is written when its PR is ready to start; one independent reviewer per stack judges each layer.

## Problem and evidence (current source at `c08ab7af`)

1. **Planning has two homes, neither of them "before execution".** `orchestrator-implementation-goal/SKILL.md:12,28` loads `plan-implementation` and authors the plan inside the implementation goal. `orchestrator-design/SKILL.md:78` also authors the plan and then commissions Sidekicks when continued delivery is requested.
2. **One plan spans many PRs.** `shared-references/canonical-implementation-plan.md:33-34` carries `delivery grouping` and `PR topology: not-applicable | one-pr | separate-prs` on a single plan. A Sidekick receives a plan written for several PRs, and a reviewer has no per-PR rail.
3. **No breakdown artifact and no independence test.** `plan-implementation/references/slice-and-proof-design.md:32-39` has advisory `parallel` edges between slices, not PRs; nothing tests whether a PR can be built and reviewed alone.
4. **No stacks.** No skill mentions stacked PRs; `gh stack` lives only in the global prompt.
5. **One independent review per goal.** `orchestrator-implementation-goal/SKILL.md:30,33` commissions "the persistent independent 🔎 Review Sidekick" after the whole goal's assessment.
6. **Evidence from delivery.** A Sol session received "your assignment = the PR A slices, A1–A13" and later split three slices into another lane (log audit, 2026-09-26). A blind replay of 29 test-hunt units found that the stops came from seams missing at the base (Spec A, D13), which is also what separates independent PRs from stacked ones.

Prior art (read at the pinned commits): pstack `poteto-mode/playbooks/multi-phase-plan.md` (`ecc249f`): "The plan is the deliverable", "One section per PR", a program checklist with "<PR> and <PR> are independent and first" and "<PR> touches only <glob>", linted by `scripts/check-plan.mjs`; `autopilot-full.md:7` runs independent PRs "in true parallel and never stack … one writer per branch, disjoint files", `autopilot-stack.md` serializes coupled PRs. Matt Pocock `skills/engineering/to-tickets` (`c55ee46`): tracer-bullet slices "demoable or verifiable on its own", each with blocking edges; wide refactors run expand, migrate in batches, contract; the user approves granularity and edges. Wayfinder resolves decisions and hands off; it does not break work down, which matches the owner's reading of `discuss-pathfinding`.

## Mental model

```text
 DESIGN SIDE · Main (+ 🦉 Advisor if the project has one)
 ────────────────────────────────────────────────────────────
 discuss-pathfinding ─► spec-design ─► program-design
   (meaning, decisions)                 components · owners ·
                                        dependency direction
                    🔎 spec-program-review (independent)
                                              │
                                              ▼
 BREAKDOWN (PR map) ◄── derived from program-design's owners
   few PRs, independent by architecture          and edges
   contract PR where two PRs share an interface
   stacks where a PR needs another PR's behavior
   integration gates · riskiest unknown first
   ── owner sees the PR map (architecture of the work) ──
                                              │
 PLAN per PR, written when that PR can start  ▼
   slices · tiers (Spec A) · proof · Main review (C4)
 ═══════════════════════ handoff ══════════════════════════
 EXECUTION SIDE · orchestrator-implementation-goal
   per PR (a stack's layers in order, independent PRs in parallel):
   🐒 Sidekick, one PR each (tier by span) ─► Main assessment
     ─► 🔎 one independent reviewer (per PR; per stack,
        judging each layer) ─► fixes via Main ─► wrap-up
   Main runs each integration gate ─► owner merges
```

Complexity decides the Sidekick; size decides the slices. A PR is an independently buildable and reviewable outcome. Program design's owners and edges are the candidate cuts: a large local change stays one PR with many Workhorse slices; two disjoint features become two PRs; a behavior change that must land across two owners at once stays one PR, and its Sidekick follows Spec A's C1 and D16 (a Luna xhigh Sidekick when every slice fits and every dependent choice is in the plan; otherwise the Daily driver D16 selects by the failed signal, Sol medium or Opus); a contract PR exists only when a real shared seam lets two consumers proceed independently. The number of PRs follows independence, never owner or file count.

## Success definition

1. `orchestrator-implementation-goal` never authors a plan. It admits a ready breakdown and the ready plan for each PR it starts, and returns `ready-for-planning` to Main otherwise.
2. Before execution, Main produces one ready breakdown (CB1), even for a single PR: the PR map with planned dependencies, stacks, contract PRs, and integration gates, drawn from the admitted basis. A PR is executable only when its plan is written and CB2 passes against its actual base. The owner sees the map.
3. Every PR has its own implementation plan, written when its base exists, and that plan is the rail its Sidekick executes and its reviewer judges.
4. Every independent PR gets its own independent 🔎 Review Sidekick; a stack gets one that judges each layer against that layer's plan.
5. Main runs every integration gate named in the breakdown.
6. The breakdown and plan records are fields a future typed workflow runner can read.

## Decisions

| # | Default taken | Rationale |
|---|---|---|
| B1 | Planning is Main's and happens before execution. `orchestrator-implementation-goal` admits a ready breakdown and the plan for each PR it starts, and runs execution, review, and wrap-up. It never authors or repairs a plan: a missing breakdown or frontier plan returns `ready-for-planning`, which Main resolves by the admitted basis (normally `plan-implementation`), and a plan defect returns `plan-defect`, which Main resolves through the plan's recorded `originating planner` (`plan-implementation` or `plan-improve-repo`), in Main's own session, while unaffected PRs continue. `orchestrator-design`'s continued-delivery step produces the breakdown and first plans and stops; it no longer commissions Sidekicks. Phases return tokens and never name an orchestrator (`AGENTS.md:112`). | Owner, 2026-09-27. One home for planning (evidence 1); review BF4. |
| B2 | The **breakdown** (CB1) is owned by `plan-implementation` and defined in `shared-references/canonical-implementation-plan.md`. Its authority follows the admitted basis: a reviewed design supplies Program Design's owners and dependency edges as candidate cuts; an admitted `implementation-mechanics-only` improvement supplies its current-source ownership and applicability evidence, with no Program Design invented. A real missing structural decision still returns `program-design-gap`. | Owner: "complexity means architecture". Review BF1 (candidates, not a count rule) and BF6 (keep the mechanics-only path). |
| B3 | One canonical implementation plan per PR node. A plan names its breakdown identity, its node id, and its concrete base (trunk commit or parent PR head) when written. `PR topology` and multi-PR `delivery grouping` leave the plan record; the breakdown carries them. | Owner, 2026-09-28. Evidence 2. Hard cutover. |
| B4 | The breakdown is written once, whole, with planned dependencies. Each PR's plan is written when that PR becomes executable (its base exists), so the breakdown lists nodes, never plan paths; plans point up to their node. The first frontier's plans are written with the breakdown. | Owner accepted 2026-09-28. Review BF2 and BF3: the breakdown never mutates as plans arrive. |
| B5 | The **PR independence test** (CB2) has two times. At breakdown, Main records planned structure: each node's rails, write surface, and dependencies, and whether it stacks on a node or waits for a contract node. At plan time, Main checks the node's **external prerequisites** against its actual base in source: every seam it takes from outside itself exists there and supports the observation it needs. Seams the PR itself adds under its plan are allowed; Spec A's C1 still decides, per slice, whether a slice that adds or uses a new seam is Workhorse or goes to a contract slice or the Daily driver. A node with an unmet external prerequisite stays pending or returns to its owner. | pstack disjoint writes; Matt's blocking edges; Spec A's seam finding; review BF3 and BF7. |
| B6 | The breakdown names every **integration gate**: where independently built PRs first interact, and the proof that shows it. Main runs each gate after its PRs are PR-ready. | Matt's integrate-and-verify ticket; `slice-and-proof-design.md:41` already places gates at first interaction. |
| B7 | The breakdown orders PRs **riskiest unknown first** among those whose prerequisites are met. | pstack-audit hand-off, 2026-09-27. |
| B8 | Review topology: Main assesses each PR before independent review. Each independent PR gets its own 🔎 Review Sidekick (different lineage, no author history). A stack gets one Review Sidekick relationship that reviews each layer's diff against its parent and that layer's plan. Findings route through Main to the PR's Sidekick. | Owner, 2026-09-27; stack unit accepted 2026-09-28. Keeps `implementation-review/SKILL.md:28`'s whole-read rule per PR or layer. |
| B9 | The owner sees the breakdown's PR map, drawn: nodes, edges, stacks, contract PRs, gates. The owner does not see per-PR plans or slices. | Owner Attention: architecture is the owner's; plans are Main's. Matt's to-tickets shows the breakdown to the user. |
| B10 | Stacks use `gh stack` (global prompt); independent PRs use separate branches or worktrees. `implementation-pr-wrapup` runs per PR, and per stack from its lowest layer up. | Global prompt Git section. |
| B11 | Records are typed fields (CB1), so a future workflow runner (typed script over agent-collaboration with persistence) can read them. No runner is built here. | Owner's stated direction, 2026-09-28. |
| B12 | `discuss-pathfinding` does not change. | Owner, 2026-09-28. |
| B13 | Proof is static plus walkthroughs: the review's cases (a large local change, two disjoint features, a two-owner atomic change, a contract with two consumers, a stack whose parent head moves, a mechanics-only single-owner improvement, a singleton plan-only request) and re-cut one real multi-PR effort from the log audit (the thirteen-slice PR A assignment) into a breakdown under CB1 and CB2, and show where it would have split, stacked, or added a contract PR. No pressure runs. | Same posture as Spec A. |
| B14 | Return tokens carry the breakdown. In `shared-references/phase-return-tokens.md`: `ready-for-planning` carries the admitted basis (reviewed design identities, or the admitted improvement pointer and basis class) and, for a later frontier, the breakdown identity and node id; `ready-for-implementation` carries the breakdown identity, node id, plan path, and base; `plan-defect` carries the breakdown identity and node id with its existing fields. Main resolves `ready-for-planning` by the admitted basis and `plan-defect` through the plan's recorded `originating planner`, each in its own session. | Review BF4: today's payloads cannot carry a node or an improvement basis. |
| B15 | After Spec A's runs, Spec B changes the container from goal-wide plan to per-PR plan and keeps Spec A intact: C4 runs for each newly written full PR plan; C2 stays per slice; D16's table in `manage-agents` stays the one staffing owner; the seam check stays at plan time as Spec A's per-slice Workhorse condition, and CB2 checks only external prerequisites; nothing restores "directly by default". | Review advice 5. |
| B16 | An integration gate records the exact PR heads it tested together. A change it discovers routes to the affected PR's Sidekick and reviewer through Main. Per-PR readiness is never reported as delivery readiness before the named gates pass. | Review advice 3. |
| B17 | A 🐒 Sidekick's assignment and horizon is one PR. The Lead owns a stack: it sequences the layers, commissions each layer as a one-PR assignment (the next layer may reuse the same Sidekick session with a new assignment), and integrates across PRs. The per-stack review relationship (B8) is unchanged. | Owner, 2026-09-28: "horizon is for sidekicks … we not in a stage where im gonna have long horizon task to a sidekick"; Spec A D18. |

## Contracts

### CB1. Breakdown record

Home: `shared-references/canonical-implementation-plan.md`, new section beside the plan record.

> A breakdown is one Markdown file per delivery, `<yyyy-mm-dd>-<slug>-breakdown.md`, written by Main with `plan-implementation`, even when it has one node. It lives beside its plans under the canonical Plan Home rule: `<project-root>/tmp/plan-workflows/` for a delivery plan, or the durable plan home (`docs/specs/<spec>/plans/` or the repository's established home) for plan-only work. It records its admitted basis (reviewed design identities, or an admitted improvement pointer and basis class). Each node records: `id`; `outcome` (what this PR makes true, in the owner's words); `scope` (the owner or component, from Program Design or current-source ownership); `rails` (the obligation identities it delivers); `write surface`; `depends on` (node ids, planned); `stack` (a stack id or `none`); `kind` (`feature | contract | integration`). It also lists integration gates (the nodes that meet, the proof, Main as owner) and the order, riskiest unknown first. It is `ready` when node ids are unique, dependencies are acyclic, every obligation of the admitted basis belongs to exactly one node or gate, every stack is linear, and every contract node names its consumers. A ready breakdown is immutable: a topology change writes a new breakdown and marks which nodes' plans it supersedes. Plans point up to their node; the breakdown never records plan paths, PR numbers, or progress.

### CB2. PR independence test

Home: `plan-implementation/references/slice-and-proof-design.md`, new section beside Spec A's throughput checkpoint.

> **Planned (at breakdown).** A node is independent of its siblings when its write surface is disjoint from theirs, its rails and proof let a reviewer judge it without depending on an unmerged sibling change, and where it first meets another node is a named integration gate. A node that needs another node's behavior is stacked on it; nodes that need the same new interface wait for a contract node that adds it. "C is executable now; X and Y wait for C's interface" is a correct planned state.
>
> **Eligible (at plan time).** When Main writes a node's plan, it checks the node's actual base in source: every seam, interface, or signal the node takes from outside itself exists there and supports the observation it needs. Seams the node adds under its own plan are its work, not prerequisites; Spec A's Workhorse fit still applies per slice. A node with an unmet external prerequisite stays pending, or its gap returns to its owner (`plan-defect`, or `program-design-gap` for a missing structural decision). A stack child whose parent head moves after its plan was written follows the existing freshness and plan-defect rules.

## Runs
## Runs

One skill per run; anchors at `c08ab7af`. Spec A's runs land first on the same branch, since both specs edit `plan-implementation`, the canonical plan, and both orchestrators.

| Run | Skill | Change |
|---|---|---|
| B-1 | `plan-implementation` (owns `canonical-implementation-plan.md` and, here, the token payloads in `phase-return-tokens.md`) | CB1 and CB2; one plan per PR bound to its node and base (B3); breakdown whole, plans at their frontier (B4); gates (B6, B16); ordering (B7); the drawn PR map (B9); authority per admitted basis (B2); token payloads (B14); returns tokens and never names an orchestrator (B1) |
| B-2 | `orchestrator-implementation-goal` | admits a ready breakdown and each started PR's plan; never authors or repairs a plan, and maps `ready-for-planning` and `plan-defect` back to Main, which keeps the originating planner (B1, B14); per-PR Sidekick lifecycle, with the Lead sequencing a stack's layers (B17); review topology (B8); gates (B6, B16); wrap-up per PR or stack (B10); description, `agents/openai.yaml`, and README match |
| B-2a | `implement-plan` | admits one PR's plan with its node and base; a boundary stop returns `plan-defect` with the node |
| B-2b | `manage-agents` | the Commission section names the PR node and base; the D16 table stays the staffing owner (B15) |
| B-3 | `orchestrator-design` | continued delivery ends at the ready breakdown and first plans, then hands off; no commissioning (B1) |
| B-4 | `implementation-review` | review unit is one PR, or one stack layer against its parent; the per-PR plan partitions the work while Requirements, Specification, Program Design, and the goal stay the rails; `:28` whole-read and consumer coverage stay; convergence is compared per layer (B8) |
| B-5 | `implementation-pr-wrapup` | per PR, and per stack from its lowest layer (B10) |
| B-6 | `plan-handoff` | carries one PR's plan plus its breakdown node |
| B-7 | `plan-improve-repo` | an admitted finding yields a single-node breakdown and one plan, or more nodes when it truly spans independent outcomes (B2) |
| B-8 | ship prep | version, changelog, README, tests and fixtures |

## Consumer disposition

Source: two Luna xhigh 🛠️ Workers (skills-creation loaded) read every skill, shared reference, fixture, scenario, and contract test whole and returned 162 non-keep rows; the complete row list is `consumer-sweep.tsv` beside this spec. Main spot-checked the load-bearing and surprising rows against source at `fb2f18df`. Every row in that file is in scope with its stated disposition except the rejections below; rows 20, 37, 60, 72, 76 to 80, 135, and 145 were corrected in r4 and r5 to match BF1, BF2, and B1.

| Run | Files (lines) | Change |
|---|---|---|
| B-1 | `shared-references/canonical-implementation-plan.md` (1, 33, 34, 53, 59, 79) | CB1 breakdown section; plan record = one PR node and base; grouping and topology move to the breakdown (B2, B3, B4) |
| B-1 | `plan-implementation/SKILL.md` (10, 29, 32, 38, 43); `references/slice-and-proof-design.md` | breakdown first, one plan per PR, CB2 beside Spec A's throughput checkpoint, gates, ordering, drawn PR map (B2 to B9) |
| B-2 | `orchestrator-implementation-goal/SKILL.md` (8, 12, 23, 28 to 36, 40, 44, 51); `references/goal-contract-and-routing.md` (5, 22, 42, 59, 62, 68, 71, 74, 78, 90, 104, 107, 112) | admit a ready breakdown and per-PR plans; `ready-for-planning` to Main otherwise; per-PR or per-stack lifecycle; review topology; gates; wrap-up per PR or stack |
| B-3 | `orchestrator-design/SKILL.md` (78, 80) | continued delivery ends at the breakdown and first plans; no commissioning |
| B-4 | `implementation-review/SKILL.md` (10, 18, 24) | review unit is one PR, or one stack layer against its parent; the rail is that PR's plan; `:28` whole-read and `:66` fresh-review stay |
| B-2a | `implement-plan/SKILL.md` (19, 32, 33) | admits one PR's plan with node and base; returns to its PR's reviewer through Main |
| B-6 | `plan-handoff/SKILL.md` (10, 19, 33); `references/handoff-template.md` (12, 16, 67, 68) | one PR's plan plus its breakdown node |
| B-7 | `plan-improve-repo/SKILL.md` (10, 12, 103); `references/improvement-plan-template.md` (3, 77, 78, 81, 91) | an admitted finding yields a breakdown of one node, or one node per independent outcome, with its plans; owner count does not decide |
| B-2b | `manage-agents/SKILL.md` (12, 96) | Commission names the PR node; `:42` is kept and cited (a single Review Sidekick is already different-lineage) |
| B-1 | `shared-references/phase-return-tokens.md` (`ready-for-planning`, `plan-defect`, `ready-for-implementation` rows) | payloads per B14 |
| B-2 | `orchestrator-implementation-goal/SKILL.md:3` (description), `:23` (token map), `agents/openai.yaml:4`, `README.md:3-17` (mermaid shows "Main authors plan" inside the goal) | rewrite per B1 and B14 |
| B-1 | `plan-implementation/agents/openai.yaml:4`, `README.md:3` | "one repo-grounded implementation plan" becomes a breakdown and per-PR plans |
| B-8 | `AGENTS.md` (67, 125, 131, 134); plugin `README.md` (11, 17, 19, 67, 75, 132, 152, 156, 162, 188, 202, 203) | docs follow the runs |
| B-8 | fixtures `existing-plan.md`, `handoff-plan.md`, `improvement-plan.md` (topology lines), `active-orchestration-commission.md` (13 sites); `tests/skills/lib/minimal-planning-delivery-contract.test.ts` (10 assertions, plus `:61` "invokes `implement-plan`" and `:85-86` "Write one file per accepted improvement"; assert the plan and breakdown sections separately, node and base binding, and rejection of a mismatched fixture); a new breakdown fixture beside the per-PR fixtures; scenarios under `implementation-handoff`, `implementation-review`, `orchestrator-design`, `orchestrator-implementation-goal`, `plan-handoff`, `plan-implementation` (per `consumer-sweep.tsv`) | test-update: one plan per PR, breakdown admission, per-PR review; each rewritten criterion keeps its paired failure example |

**Rejected sweep rows:** all nine `skills-creation` rows (`SKILL.md:174, 265, 276, 282, 284, 292, 304, 307, 312`) and `references/review/implementation-review.md:3, 35`. This A+B delivery ships as one PR, so `skills-creation`'s review stage stays per package run here; per-PR and per-stack review topology is scoped to general-domain delivery. `skills-creation/SKILL.md:274` still handles several PR assignments with integrated source identities, and none of its full-diff or assessment obligations is waived. `manage-agents/SKILL.md:42` is kept, not rewritten.

## Coordination

- **Work thread:** topic "Workhorse-first decomposition and breakdown topology" (`01a0e83f-1023-71c2-94c4-c546305adbed`), coordination root `01a0e83f-326f-7bc2-b39b-a494da4b4de9`.
- **Every agent loads `skills-creation`:** the implementation 🐒 Sidekick, every 🔎 Review Sidekick, any 🦉 Advisor, and every 🛠️ Worker on this work loads the `skills-creation` skill at the start of its assignment, and each packet says so. Owner, 2026-09-28: "advisor and all agents working on it should load the skill creation skill".
- **Reviewer:** GPT-6 Astra high 🔎 Review Sidekick, different lineage, no author history, for proposal and implementation review. Owner, 2026-09-28: "the specs and skill should be written 5.5 and reviewed by a astra advisor high"; the independent Review Sidekick role is kept because `skills-creation` review requires no author history, which an Advisor working with Main would not have.
- **Advisor and proposal reviewer are one agent (owner-authorized deviation):** the GPT-6 Astra high session `01a0e2a0-6835-7171-9512-410133d40c29` advises Main on both specs and runs their proposal reviews. Owner, 2026-09-28: "it can be the same agent that advises and reviews for now". Its advice gives it authoring context, which `skills-creation` proposal review normally excludes; the implementation review therefore goes to a fresh Astra high 🔎 Review Sidekick with no history.
- **Implementer:** one Claude Opus 5.5 implementation 🐒 Sidekick (agent-router `claude-local`, the owner's saved default model) writes every run of Spec A and Spec B in full, one commit per run, then the proof. Owner, 2026-09-28: "for skills especially and design i kind of expect another opus model to write it fully". Skill prose is an open-approach judgment task, so it fails Workhorse fit (C1) and goes to the Daily driver. Luna 🛠️ Workers stay on evidence: sweeps, replays, digests.
- Branch `chore/workhorse-decomposition`, worktree `~/dev/ai-tools.chore-workhorse-decomposition`, one PR with Spec A, one version bump.
- pstack-audit agent: its rolling window lands later in `orchestrator-implementation-goal` and anchors on B-2's per-PR dispatch sentence; its prototype-to-decide goes to `orchestrator-design` / `program-design`, not pathfinding.

## Non-goals

- `discuss-pathfinding` (B12).
- A typed workflow runner (B11).
- `skills-creation`'s review stages: this delivery ships as one PR, so its review stays per package run.
- Merge authority: the owner merges.
- Changing Spec A's decisions.

## Spec-review record

- **Lead correction after implementation** (2026-09-28): CB1's home follows the canonical Plan Home rule, beside its plans, so a durable plan-only plan never points up to a tmp breakdown (implementer's open gap 1).
- **Owner amendment** (2026-09-28): B17, a Sidekick's horizon is one PR and the Lead owns stacks; owner-settled meaning, applied without a new review round.
- **Superseded by Spec A r14** (2026-09-28): B17's horizon clause. Horizon is a property of the job (Spec A D21), not of the role. B17's assignment scope stands: a Sidekick's assignment is one PR, and Main owns a stack. Spec A's cohesion amendment also gives B-rule restatements one home each (its D25).

- **Review 1** (r2, commit `3fe81561`): GPT-6 Astra high, session `01a0e2a0` (the owner-authorized advisor and reviewer for both specs), skills-creation loaded. Verdict `targeted-revision`, `revise-first`, blocker override applies. Accepted BF1 (owner boundaries became a PR-count rule), BF2 (ready breakdown lacked a contract), BF3 (CB2 could not certify future nodes), BF4 (tokens, descriptions, READMEs, and two contract-test lines kept the old routing; a phase must not name an orchestrator), BF5 (B-2 held other skills' semantic edits), BF6 (the mechanics-only planning path was dropped). Rejected: expanding B8 into `skills-creation` (kept as scope, reworded); B8 weakening review (the whole-read rule stays).
- **Verification of r5** (same lead): `great`, implementation decision `accepted-to-implement`; BF1 closed; no new finding; converged 6, 4, 1, 0 with no recurrence.
- **Verification of r4** (same lead): `targeted-revision`; BF2, BF4, BF7 closed; BF1 open in two adjacent sweep rows (79, 80) that kept an owner-count breakdown trigger. Converging: four open became one. **r5** rewrites both rows to outcome-based nodes with a breakdown for every finding; a search of the sweep for owner-count phrasing finds no other copy.
- **Verification of r3** (same lead): `targeted-revision`, `revise-first`. BF3, BF5, BF6 closed; BF1, BF2, BF4 open as residual copies (sweep rows still adopted; plan-defect bypassed the originating planner); new BF7 (CB2 widened Spec A's Workhorse seam condition into a gate on every PR). Converging: six open became four.
- **r4 remediation** (Main): corrected sweep rows 20, 37, 60, 72, 76 to 78, 135, 145 and B-7's disposition to independent outcomes, plans pointing up, and token returns (BF1, BF2, BF4A); `plan-defect` resolves through the recorded originating planner (BF4B); CB2 and B5 check only external prerequisites, leaving per-slice Workhorse fit to Spec A (BF7).
- **r3 remediation** (Main): mental model and success 2 (BF1); CB1 rewritten with identity, home, basis, validity, readiness, immutability, and plans pointing up (BF2); CB2 split into planned and eligible (BF3); B14 token payloads, B1 routing, and the missed surfaces and assertions (BF4); runs B-2a and B-2b (BF5); B2 authority per admitted basis (BF6); advice adopted as B15 (A+B composition), B16 (integration evidence), and the planned-versus-executable wording in CB2.

## Implementation record

- **Implementation:** one Claude Opus 5.5 implementation 🐒 Sidekick (agent-router `claude-local`, session `9ae4f9d1`), skills-creation loaded; Spec A runs A-1 to A-8 and A-1b, Spec B runs B-1 to B-7, fixes for the owner's amendments (r11 to r13, B17), and one ship-prep commit (2.66.0). Receipt: `tmp/workhorse-breakdown-receipt.md` (worktree scratch).
- **Proof:** `pnpm --dir tests/skills test` 17 files, 125 tests passing; `tsc --noEmit` clean; `claude plugin validate` passing for the marketplace and plugin; Codex quick-validate on the 12 changed skills; cutover searches clean. Spec A D13 blind replay with condition 4 on 29 unit briefs at pinned base `d6d6e7e2`: 22 of 29 agreements; condition 4 caught 2 of 6 recorded seam stops, missing 4 where a same-named signal existed without the needed observation. The Lead applies condition 4 at planning and C4 re-checks it in source; a stronger per-slice seam record is a follow-up design item. Spec B B13 walkthroughs hold, including the thirteen-slice PR A re-cut into 7 nodes.
- **Lead assessment:** proof re-run independently; decisive homes read in source; one correction (the breakdown home follows the Plan Home rule).
- **Implementation review:** fresh GPT-6 Astra high 🔎 Review Sidekick (session `01a0e891`), no history. `targeted-revision` with F1 (plan review rejected a Daily-driver slice adding its named seam), F2 (improvement template missed the fifth checkpoint item), F3 (two tests and a reference implied only Daily-driver Sidekicks may delegate). Fixes `928bae17`, `eeb1c6c1`, `051dedb4`; the same lead verified `great`, no new findings.
- **Deletion test:** new teaching text in `model-catalog.md` and `advisor-plan-review.md` checked sentence by sentence; nothing removable without changing behavior.
- **Proof boundary:** static plus the replay and walkthroughs; behavior under pressure is not evaluated (owner choice). Several commits are unsigned (1Password signer unavailable).
