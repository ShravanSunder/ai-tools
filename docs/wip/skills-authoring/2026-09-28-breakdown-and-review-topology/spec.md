# Breakdown and review topology

Multi-run skill-change spec for the `shravan-dev-workflow` plugin. Revision **r2**, 2026-09-28. Status: **draft**. r2 adds the consumer disposition from the sweep. Companion to `2026-09-27-workhorse-decomposition/spec.md` (Spec A) on the same branch and PR. No skill file changes before `accepted-to-implement`.

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
   per independent PR, or per stack, in parallel:
   🐒 Sidekick (tier by span) ─► Main assessment
     ─► 🔎 one independent reviewer (per PR; per stack,
        judging each layer) ─► fixes via Main ─► wrap-up
   Main runs each integration gate ─► owner merges
```

Complexity decides the Sidekick; size decides the slices. A PR is a unit of independent work cut along the architecture, so a large but local change stays one PR with many Workhorse slices, and a small change that crosses two owners becomes two PRs or a contract PR plus two.

## Success definition

1. `orchestrator-implementation-goal` never authors a plan. It admits a ready breakdown and the ready plan for each PR it starts, and returns `ready-for-planning` to Main otherwise.
2. Before execution, Main produces one breakdown: a PR map derived from program-design's owners and dependency direction, where every PR passes the independence test or is placed in a stack or behind a contract PR. The owner sees the map.
3. Every PR has its own implementation plan, written when its base exists, and that plan is the rail its Sidekick executes and its reviewer judges.
4. Every independent PR gets its own independent 🔎 Review Sidekick; a stack gets one that judges each layer against that layer's plan.
5. Main runs every integration gate named in the breakdown.
6. The breakdown and plan records are fields a future typed workflow runner can read.

## Decisions

| # | Default taken | Rationale |
|---|---|---|
| B1 | Planning is Main's and happens before execution. `orchestrator-implementation-goal` admits a ready breakdown and per-PR plans and runs execution, review, and wrap-up. With no ready plan it returns `ready-for-planning` to Main, which loads `plan-implementation` in its own session (directly, or through `orchestrator-design`'s continued-delivery step). `orchestrator-design:78` stops commissioning Sidekicks; it hands the ready plan set to `orchestrator-implementation-goal`. | Owner, 2026-09-27. One home for planning (evidence 1). |
| B2 | The **breakdown** is a new record, owned by `plan-implementation` and defined in `shared-references/canonical-implementation-plan.md` (Contract CB1). Main derives its PR nodes from program-design's ownership and dependency maps; a design without them routes `program-design-gap`. | Owner: "complexity means architecture". PR boundaries become a projection of the component model the owner already reviews. |
| B3 | One canonical implementation plan per PR. `PR topology` and multi-PR `delivery grouping` leave the plan record; the breakdown carries them. A plan names its PR node and base. | Owner, 2026-09-28. Evidence 2. Hard cutover. |
| B4 | Each PR's plan is written when its PR can start: its base exists (trunk, a landed PR, or the stack parent's head). The breakdown and the plans for the first frontier are written together. | Owner accepted 2026-09-28. Avoids plans written against code that does not exist yet. |
| B5 | The **PR independence test** is Contract CB2. A PR that fails it is stacked on the PR it depends on, or placed after a contract PR that adds the shared seam (Matt's expand step). | pstack's disjoint write set and "independent and first"; Matt's blocking edges; Spec A's seam finding. |
| B6 | The breakdown names every **integration gate**: where independently built PRs first interact, and the proof that shows it. Main runs each gate after its PRs are PR-ready. | Matt's integrate-and-verify ticket; `slice-and-proof-design.md:41` already places gates at first interaction. |
| B7 | The breakdown orders PRs **riskiest unknown first** among those whose prerequisites are met. | pstack-audit hand-off, 2026-09-27. |
| B8 | Review topology: Main assesses each PR before independent review. Each independent PR gets its own 🔎 Review Sidekick (different lineage, no author history). A stack gets one Review Sidekick relationship that reviews each layer's diff against its parent and that layer's plan. Findings route through Main to the PR's Sidekick. | Owner, 2026-09-27; stack unit accepted 2026-09-28. Keeps `implementation-review/SKILL.md:28`'s whole-read rule per PR or layer. |
| B9 | The owner sees the breakdown's PR map, drawn: nodes, edges, stacks, contract PRs, gates. The owner does not see per-PR plans or slices. | Owner Attention: architecture is the owner's; plans are Main's. Matt's to-tickets shows the breakdown to the user. |
| B10 | Stacks use `gh stack` (global prompt); independent PRs use separate branches or worktrees. `implementation-pr-wrapup` runs per PR, and per stack from its lowest layer up. | Global prompt Git section. |
| B11 | Records are typed fields (CB1), so a future workflow runner (typed script over agent-collaboration with persistence) can read them. No runner is built here. | Owner's stated direction, 2026-09-28. |
| B12 | `discuss-pathfinding` does not change. | Owner, 2026-09-28. |
| B13 | Proof is static plus a walkthrough: re-cut one real multi-PR effort from the log audit (the thirteen-slice PR A assignment) into a breakdown under CB1 and CB2, and show where it would have split, stacked, or added a contract PR. No pressure runs. | Same posture as Spec A. |

## Contracts

### CB1. Breakdown record

Home: `shared-references/canonical-implementation-plan.md`, new section.

> A breakdown lists PR nodes and the edges between them. Each node records: `id`; `scope` (the owner or component from program-design it changes); `rails` (the obligation identities it delivers); `write surface`; `base` (`trunk | <node id>`); `depends on` (node ids); `stack` (a stack id or `none`); `kind` (`feature | contract | integration`); `plan` (the plan path once written, or `not yet`). The breakdown also lists integration gates (the nodes that meet, the proof, the owner: Main) and the order, riskiest unknown first. Every node passes the PR independence test or names the stack or contract node that makes it pass.

### CB2. PR independence test

Home: `plan-implementation/references/slice-and-proof-design.md`, new section, beside Spec A's throughput checkpoint.

> A PR is independent when: its write surface is disjoint from every sibling's; every seam, interface, or signal it uses exists at its base, landed or added by a contract PR below it; its rails and proof let a reviewer judge it without reading a sibling; and where it first meets another PR is a named integration gate. A PR that needs another PR's behavior is stacked on it. Two PRs that need the same new interface sit on a contract PR that adds it.

## Runs

One skill per run; anchors at `c08ab7af`. Spec A's runs land first on the same branch, since both specs edit `plan-implementation`, the canonical plan, and both orchestrators.

| Run | Skill | Change |
|---|---|---|
| B-1 | `plan-implementation` (owns `canonical-implementation-plan.md`) | CB1 and CB2; one plan per PR (B3); breakdown first, plans at their frontier (B4); gates (B6); ordering (B7); the drawn PR map for the owner (B9); `program-design-gap` when owners or edges are missing (B2) |
| B-2 | `orchestrator-implementation-goal` | admits a ready breakdown and per-PR plans; never authors a plan (B1); per-PR or per-stack lifecycle; review topology (B8); integration gates (B6); wrap-up per PR or stack (B10) |
| B-3 | `orchestrator-design` | continued delivery produces the breakdown and first plans, then hands off; no commissioning (B1) |
| B-4 | `implementation-review` | review unit is one PR, or one stack layer against its parent; the rail is that PR's plan (B8) |
| B-5 | `implementation-pr-wrapup` | per PR, and per stack from its lowest layer (B10) |
| B-6 | `plan-handoff` | carries one PR's plan plus its breakdown node |
| B-7 | `plan-improve-repo` | an admitted finding produces a one-PR plan, or a breakdown when it spans owners |
| B-8 | ship prep | version, changelog, README, tests and fixtures |

## Consumer disposition

Source: two Luna xhigh 🛠️ Workers (skills-creation loaded) read every skill, shared reference, fixture, scenario, and contract test whole and returned 162 non-keep rows; the complete row list is `consumer-sweep.tsv` beside this spec. Main spot-checked the load-bearing and surprising rows against source at `fb2f18df`. Every row in that file is in scope with its stated disposition except the rejections below.

| Run | Files (lines) | Change |
|---|---|---|
| B-1 | `shared-references/canonical-implementation-plan.md` (1, 33, 34, 53, 59, 79) | CB1 breakdown section; plan record = one PR node and base; grouping and topology move to the breakdown (B2, B3, B4) |
| B-1 | `plan-implementation/SKILL.md` (10, 29, 32, 38, 43); `references/slice-and-proof-design.md` | breakdown first, one plan per PR, CB2 beside Spec A's throughput checkpoint, gates, ordering, drawn PR map (B2 to B9) |
| B-2 | `orchestrator-implementation-goal/SKILL.md` (8, 12, 23, 28 to 36, 40, 44, 51); `references/goal-contract-and-routing.md` (5, 22, 42, 59, 62, 68, 71, 74, 78, 90, 104, 107, 112) | admit a ready breakdown and per-PR plans; `ready-for-planning` to Main otherwise; per-PR or per-stack lifecycle; review topology; gates; wrap-up per PR or stack |
| B-3 | `orchestrator-design/SKILL.md` (78, 80) | continued delivery ends at the breakdown and first plans; no commissioning |
| B-4 | `implementation-review/SKILL.md` (10, 18, 24) | review unit is one PR, or one stack layer against its parent; the rail is that PR's plan; `:28` whole-read and `:66` fresh-review stay |
| B-2 | `implement-plan/SKILL.md` (19, 32, 33) | admits one PR's plan; returns to its PR's reviewer through Main |
| B-6 | `plan-handoff/SKILL.md` (10, 19, 33); `references/handoff-template.md` (12, 16, 67, 68) | one PR's plan plus its breakdown node |
| B-7 | `plan-improve-repo/SKILL.md` (10, 12, 103); `references/improvement-plan-template.md` (3, 77, 78, 81, 91) | an admitted finding yields a one-PR plan, or a breakdown when it spans owners |
| B-2 | `manage-agents/SKILL.md` (12, 96) | Commission names the PR node; `:42` is kept and cited (a single Review Sidekick is already different-lineage) |
| B-8 | `AGENTS.md` (67, 125, 131, 134); plugin `README.md` (11, 17, 19, 67, 75, 132, 152, 156, 162, 188, 202, 203) | docs follow the runs |
| B-8 | fixtures `existing-plan.md`, `handoff-plan.md`, `improvement-plan.md` (topology lines), `active-orchestration-commission.md` (13 sites); `tests/skills/lib/minimal-planning-delivery-contract.test.ts` (10 assertions); scenarios under `implementation-handoff`, `implementation-review`, `orchestrator-design`, `orchestrator-implementation-goal`, `plan-handoff`, `plan-implementation` (per `consumer-sweep.tsv`) | test-update: one plan per PR, breakdown admission, per-PR review; each rewritten criterion keeps its paired failure example |

**Rejected sweep rows:** all nine `skills-creation` rows (`SKILL.md:174, 265, 276, 282, 284, 292, 304, 307, 312`) and `references/review/implementation-review.md:3, 35`. A runtime skill package ships as one PR (these two specs share one), so its review stage stays per package run; per-PR and per-stack review topology is for general-domain delivery. `manage-agents/SKILL.md:42` is kept, not rewritten.

## Coordination

- **Every agent loads `skills-creation`:** the implementation 🐒 Sidekick, every 🔎 Review Sidekick, any 🦉 Advisor, and every 🛠️ Worker on this work loads the `skills-creation` skill at the start of its assignment, and each packet says so. Owner, 2026-09-28: "advisor and all agents working on it should load the skill creation skill".
- **Reviewer:** GPT-6 Astra high 🔎 Review Sidekick, different lineage, no author history, for proposal and implementation review. Owner, 2026-09-28: "the specs and skill should be written 5.5 and reviewed by a astra advisor high"; the independent Review Sidekick role is kept because `skills-creation` review requires no author history, which an Advisor working with Main would not have.
- **Advisor and proposal reviewer are one agent (owner-authorized deviation):** the GPT-6 Astra high session `01a0e2a0-6835-7171-9512-410133d40c29` advises Main on both specs and runs their proposal reviews. Owner, 2026-09-28: "it can be the same agent that advises and reviews for now". Its advice gives it authoring context, which `skills-creation` proposal review normally excludes; the implementation review therefore goes to a fresh Astra high 🔎 Review Sidekick with no history.
- **Implementer:** one Claude Opus 5.5 implementation 🐒 Sidekick (agent-router `claude-local`, the owner's saved default model) writes every run of Spec A and Spec B in full, one commit per run, then the proof. Owner, 2026-09-28: "for skills especially and design i kind of expect another opus model to write it fully". Skill prose is an open-approach judgment task, so it fails Workhorse fit (C1) and goes to the Daily driver. Luna 🛠️ Workers stay on evidence: sweeps, replays, digests.
- Branch `chore/workhorse-decomposition`, worktree `~/dev/ai-tools.chore-workhorse-decomposition`, one PR with Spec A, one version bump.
- pstack-audit agent: its rolling window lands later in `orchestrator-implementation-goal` and anchors on B-2's per-PR dispatch sentence; its prototype-to-decide goes to `orchestrator-design` / `program-design`, not pathfinding.

## Non-goals

- `discuss-pathfinding` (B12).
- A typed workflow runner (B11).
- `skills-creation`'s review stages: a runtime skill package ships as one PR, so its review stays per package run.
- Merge authority: the owner merges.
- Changing Spec A's decisions.

## Spec-review record

None yet.
