# Workhorse-first decomposition

Multi-run skill-change spec for the `shravan-dev-workflow` plugin. Revision **r5**, 2026-09-27. Status: **draft**. r3 applies the owner's hub model: Main plans and cuts, the plan is design-reviewed through Main, then Main hands the reviewed plan and delegation to the Sidekick (D1, D15, C2). r4 grounded every run in current source at `c08ab7af`, dropped review fan-out, and coordinated with the pstack comparison. r5 reads every touched file whole and every prior spec on delegation and tiers, and reconciles with those owner decisions (Prior decisions, D5, D10, D11, D16). No skill file changes before `accepted-to-implement`.

A companion devfiles change updates `shared/my_agents.md` (Model tiers and Main's role) and the machine model map. Either PR can land first; this plugin change stands alone.

## Problem and evidence

The owner's hub model (2026-09-27): "main talks to advisor and reviewer. sidekick who implements should go through main to review for design first. then main hand review and delegation back to sidekick." And: "sidekick doesn't make the plan."

The owner's picture (2026-09-26): "I'm using Opus Medium to do most of my planning and talking … Astra High X High for reviews … those would break down the work for the sidekick. The sidekick and work could be the workhorse, depending on work size, so we need to break down the work better. This means planning needs to be better and incentivize using managed agents to use the workhorse better." And: "for research and other workflows skills we could use workhorse as well and fan out more for things that matter."

Cost. Artificial Analysis's Intelligence-vs-cost chart (2026-09-22, read by eye): GPT-6 Luna runs about $0.01 to 0.06 per task across its effort levels (index 29 to 37). GPT-6 Sol runs about $0.13 to 1.05 (34 to 47), Claude Opus low about $0.55, and GPT-6 Astra high about $1.70. At matched catalog rows Luna is roughly 9 to 14× cheaper than Sol or Opus low, and Luna max outscores Sol low at about half its price. Raising Luna's effort costs cents.

A log audit of 2026-09-25 18:00 to 2026-09-26 22:00 covered 108 Luna, 64 Sol, and 25 Astra Codex sessions and 24 Claude Code sessions. Three Luna xhigh Workers read per-model digests; Main verified the decisive counts and quotes against the digests.

1. **Luna succeeds on well-cut work.** Log scraping 4/4 completed. Audit partitions (a test-hunt wave supervised by a 🐒 Sidekick) 30/34 completed; the strongest packets pinned checkout, HEAD, partition, output file, and done condition. The *executors* did not fail on judgment in the sample.
2. **Luna's implementation partials are planning misses.** 15 of 29 Luna implementation sessions ended partial, and nearly all were correct stops: the unit needed a production seam or signal outside its authorized write set ("Completing it requires a production signal … the unit forbids editing `Sources/`"). The slice crossed a boundary the plan did not name.
3. **Bigger models did Luna-shaped work.** 28 of 64 Sol sessions carried exact or fully specified local packets ("execute this brief", literal choreography tables, lint-fix briefs, CI measurement, single evidence lanes). Six packets bundled independent units, for example thirteen slices assigned to one session.
4. **On a Claude host the cheap path leaks off-catalog.** Claude Main launched 78 native Opus, 40 Sonnet, and 12 Haiku subagents; Sonnet and Haiku are not in the model catalog. Router-launched Luna appeared in 18 raw commands.
5. **The skills never route by piece.** Current source at `c08ab7af`:
   - `plan-implementation/references/slice-and-proof-design.md:18` sizes a slice as "the smallest coherent change that can earn evidence"; no slice field names an executor. The catalog's selection signals (Guidance × Architectural span, `manage-agents/SKILL.md`) are never produced by the planner.
   - `orchestrator-implementation-goal/SKILL.md:14`: "Each implementation 🐒 Sidekick executes its assigned change and associated proof directly by default. It may select bounded native Workers only for independent work, needed expertise, or large disposable output whose benefit exceeds briefing, coordination, and verification cost." The same default recurs at `:29` and `references/goal-contract-and-routing.md:42`, and the benefit gate at `:44`.
   - `plan-improve-repo/SKILL.md:55`: "Inspect audit categories in-parent by default", delegating only on explicit request or "one concrete independently verifiable evidence question".
   - `practices-research/SKILL.md:8`: "The assigned researcher owns the entire walk"; `:24` "Walk selected source classes one at a time"; `references/lane-packets.md:3` and `:18` repeat the serial walk and "source classes do not create separate packet or result files by default".
   - Already right and kept: Main authors every plan (`manage-agents/SKILL.md` Authority; `plan-implementation/SKILL.md:10,39`), review findings route through the orchestrator (`orchestrator-implementation-goal/SKILL.md:33`), and the 🦉 Advisor advises Main only (`manage-agents/SKILL.md:15`).

Prior art agrees (sources in the research record, Main's scratchpad `workhorse/out-prior-art.md`): 39% of multi-agent failures trace to specification and system design (MAST, 2025); planner/executor splits beat single models (Aider architect/editor 85% vs 79.7%; Anthropic's lead-plus-subagents research system); practitioners route "Luna when the change is contained and checkable locally; Sol when it traces or changes shared behavior". The same sources name the catch: verification is the bottleneck, so cheap executors must return artifacts a parent can check mechanically.

This spec was researched the way it proposes: Main cut 280 MB of transcripts into per-model digests with one question set each, and Luna xhigh Workers returned cited ledgers. The one failure was transport: `conversation prompt` hit its wait ceiling and cancelled the xhigh turns.

## Prior decisions this spec builds on or changes

Every row below was read in full at `c08ab7af`. A change to an owner decision is called out as such.

| Date | Source | Decision | This spec |
|---|---|---|---|
| 2026-08-07 | `05bbe238` (`plan-improve-repo/SKILL.md:55,66`, `references/audit-lanes.md:3,5,39`) | Audit categories are inspected in-parent; "Do not turn the category list into a default swarm." | Superseded by the 09-25 fan-out authorization below, which never reached this skill. Run 5 completes that cutover. |
| 2026-09-20 | `2026-09-20-efficient-delegation/spec.md` | The implementation 🐒 Sidekick executes directly "unless a bounded delegation has a concrete benefit", to prevent "a supervisor-of-supervisors pattern"; coupled implementation and proof stay with the executor. | Kept. D16: a PR whose slices are all Workhorse gets a Luna Sidekick, so no Daily-driver Sidekick becomes a relay; a Daily-driver Sidekick dispatches only independent Workhorse slices. |
| 2026-09-23 | `2026-09-23-luna-workhorse/proposal.md` | Tiers named Workhorse / Daily driver / Frontier; Guidance and Architectural span are the only task signals; Luna Sidekick rows exist; a Luna Sidekick takes only short owner status checks. | Kept and used: C1 is expressed in those two signals; D16 uses the existing Luna Sidekick rows. |
| 2026-09-23 | `2026-09-23-review-research-workflows/proposal.md`, PR #93 | Owner: "You should not be doing swarm stuff anymore." A 🔎 Review Sidekick walks every check itself; research is one ordered workflow by one researcher; `research-swarm` lanes removed. | Review: kept (D12). Research: kept, with one narrow addition that the owner decides (D10). |
| 2026-09-25 | `2026-09-25-capability-revamp/proposal.md` D163 | Native Worker per host: Claude Code Opus low; Cursor Grok 4.6 medium or Opus low; Codex Luna or Sol. Operator: Luna, native on Codex, else agent-router. With no native row for the catalog model, use agent-router with Luna, no native stand-in. | Kept. D5 narrows it: Workhorse-fit work on Claude Code and Cursor goes to agent-router Luna; the native Opus low and Grok rows stay for Daily-driver Workers. |
| 2026-09-25 | PR #101 (`manage-agents/SKILL.md` Select an agent; devfiles `my_agents.md` Concepts) | "Work that splits into many independent units (an audit, a migration, or a review across services or files) is pre-authorized to fan out: one 🛠️ Worker per unit." | The authority runs 4 and 5 apply. |
| 2026-09-26 | `2026-09-26-owner-attention-design-first/spec.md` | Owner attention goes to design; model and agent choice are Main's calls, recorded. | Tier per slice is recorded by Main in the plan, not asked. |
| 2026-09-27 | owner, this conversation | "Sidekick doesn't make the plan"; Main plans, the plan is design-reviewed through Main, then Main hands it to the Sidekick; Main is the only Advisor and Reviewer contact; no Sonnet or Haiku, use agent-router and Luna. | D1, D15, D5. |

## Mental model

```text
 Main (Opus medium / Astra high): owner talk, design, the plan
   │  the plan cuts work into slices; each records guidance × span
   │  → tier · reason (C2), and a Workhorse slice passes C1
   │
   │  design review of the plan ◄──► 🔎 Reviewer / 🦉 Advisor
   │  (Main is their only contact)
   │
   │  reviewed plan + delegation ─► 🐒 Sidekick (per PR; Luna when
   ▼                                 every slice is Workhorse, D16)
                                     runs coupled and Daily-driver
                                     slices itself; independent
                                     Workhorse slices → 🛠️ Luna Workers
 boundary stop ─► back to Main as a plan defect ─► Main re-slices
```

Decomposition is Main's design work, and the executor tier is a consequence of it. A small model fails loudly at a boundary the plan forgot, so a Luna stop is evidence about the plan. The same shape applies to audits (one Worker per category) and, if the owner accepts D10, to a research corpus that splits into independent units (one Worker per unit, inside the researcher's ordered walk). Synthesis, admission, and judgment stay with the researcher or Main. Independent review is the exception: its lead reads everything itself.

## Success definition

1. Main's plan records each slice's guidance, span, tier, and reason, and every Workhorse slice passes the Workhorse fit test. The plan is design-reviewed through Main before the Sidekick is commissioned.
2. The Sidekick executes Daily-driver slices and dispatches Workhorse slices to Luna 🛠️ Workers as the plan records. A boundary stop returns to Main as a plan defect. Only Main talks to the Advisor and the Reviewer.
3. Audit categories fan out to Luna Workers, one per category. If D10 is accepted, a research corpus that splits into independent units fans out one Luna Worker per unit inside the researcher's ordered walk. The cut, verification, synthesis, and admission stay with the researcher or Main. Independent review does not fan out.
4. Workhorse work runs on Luna: native on Codex, through agent-router on Claude Code and Cursor. No skill routes to Sonnet or Haiku. A PR whose slices are all Workhorse gets a Luna Sidekick.
5. Every Workhorse packet pins inputs, commands, output file, and done condition, and the parent verifies the artifact, not prose.

## Decisions

Each row is a default with its rationale. Strike or change any row before review closes.

| # | Default taken | Rationale |
|---|---|---|
| D1 | **Owner hub model.** Main's plan cuts the work and records each slice's tier (Contract C2). Main gets the plan design-reviewed through the 🔎 Reviewer or 🦉 Advisor, then hands the reviewed plan and the delegation to the implementation 🐒 Sidekick. The Sidekick does not author or re-cut the plan. | Owner direction, 2026-09-27 ("sidekick doesn't make the plan"). Tier chosen after the breakdown, by the executor, is where mis-sized slices came from (evidence 2 and 5). Adds one field to the canonical plan contract. |
| D2 | Workhorse fit is exactly Contract C1, owned by `manage-agents/references/model-catalog.md`. Every other site cites it. | One live owner for the test that planners, Sidekicks, research, and audits all apply. |
| D3 | The Workhorse tier is the default for work that passes C1. Escalation happens on evidence (a boundary stop, a failed check, a named cross-domain need), and the reason is recorded. | Evidence 1 to 3; prior art's escalate-on-evidence cascades. |
| D4 | A Luna boundary stop returns to Main as a plan defect; Main re-slices or re-tags with a reason. It is not silently re-run on a bigger model, and the Sidekick does not re-cut it. | Evidence 2: the stop is information about the plan. |
| D5 | Workhorse-fit work runs on Luna: native on Codex, and through agent-router on Claude Code and Cursor, which have no native Luna. The existing native Daily-driver Worker rows stay (Claude Code Opus low; Cursor Grok 4.6 medium or Opus low). Sonnet and Haiku are never selected on any host. | Owner, 2026-09-27: "i dont think we will use sonnet or haiku we can use agent router and luna". Evidence 4. Consistent with the 09-25 D163 route "no native row → agent-router with Luna". |
| D6 | Luna runs at high or above for 🛠️ Workers and 🐒 Sidekicks; the Worker default is xhigh. 🔧 Operators keep medium and high. | Effort costs cents on Luna. The sample shows no outcome difference by effort, so this rests on cost, not measured quality. |
| D7 | The catalog carries a dated cost snapshot (source and date, relative ratios, "about an order of magnitude"), not a benchmark claim. | Keeps the existing "do not claim universal benchmarks" rule true while giving the why. |
| D8 | Contract C3, the Workhorse packet, lives in `manage-agents/references/agent-job-packet.md`. | The best audit-partition packets and the September Operator failure logs (wrong worktree, command drift, summarized proof, early terminal, stale head) name the same five pins. |
| D9 | A long agent-router Workhorse turn starts as `conversation create` then `message send`, with the parent waiting on the output file; `conversation prompt` fits short turns or takes an explicit `--timeout-seconds` sized to the work. Its default (300 s) cancels the remote turn rather than detaching. | Logged at `memory-logs/skills/log/2026-09-26-router-prompt-timeout-cancels-long-turns.md` (7 cancelled turns across two sessions; the log's own follow-up asks manage-agents for exactly this). |
| D10 | **OPEN, owner decision (brief).** The researcher keeps the ordered source-class walk (09-23). Inside one source class, a corpus that splits into independent units (many session logs, many repositories or services) may fan out one Luna 🛠️ Worker per unit under the 09-25 pre-authorization; the researcher cuts the units, verifies each result's decisive anchors, and keeps the one ledger. Recommended: accept. | This research's own route (280 MB of transcripts, three Luna digests) versus the 09-23 decision, which removed one lane per *source class*. The addition fans out *units of one class*, never classes. It changes an owner decision three days old, so the owner decides. |
| D11 | `plan-improve-repo` applies the 09-25 fan-out authorization it never received: one Luna Worker per selected audit category, returning evidence and candidates. A category small enough for one read stays in-parent. Admission, prioritization, and plans stay with Main. | Cutover completion of PR #101. The 08-07 in-parent rule predates it. |
| D12 | **Dropped in r4.** Independent review does not fan out. `implementation-review/SKILL.md:28` has the lead read "the complete governing basis and the complete base-to-reviewed diff yourself", which is what makes it independent. The 30/34 Luna partition successes were audit hunts supervised by a Sidekick, which run 5 covers. | Current source; evidence 1 re-read. |
| D13 | Proof is static plus a replay walkthrough: C1 applied to the 29 logged Luna implementation units and the 28 Sol candidates must mark the boundary-stop units as misses and the completed ones as fits. No new pressure scenarios. | A cheap, grounded check of the one new judgment rule. The owner can strike this row to ask for pressure testing. |
| D14 | One PR, one minor version bump (2.64.0 to 2.65.0) across every version surface, one changelog entry. | Runs share C1 and C2. |
| D15 | Main is the only contact for the Advisor and the Reviewer. A correction goes back to the Reviewer through Main. | Owner direction, 2026-09-27. Mostly existing (`orchestrator-implementation-goal` step 5); the re-review handoff at `goal-contract-and-routing.md:78` is made explicit. |
| D16 | A PR's Sidekick tier follows its slices (`manage-agents/SKILL.md:118`: "Different files are not proof of independence"). When every slice is Workhorse, Main commissions a Luna 🐒 Sidekick for the PR. A Daily-driver Sidekick dispatches a Workhorse slice to a Luna Worker only when the plan marks it independent (disjoint writes, its own proof); a coupled Workhorse slice stays with the Sidekick. No Sidekick exists only to relay Workers. | 09-20 efficient-delegation: no supervisor-of-supervisors, coupled work stays with its executor. Uses the existing Luna Sidekick rows (09-23). |

## Contracts

### C1. Workhorse fit

Home: `manage-agents/references/model-catalog.md`, new section after Categories.

> **Workhorse fit.** A unit of work fits the Workhorse tier when all five hold:
> 1. **One objective** with a done condition a reader can check.
> 2. **Pinned inputs**: the files, paths, head, corpus slice, or brief are given, not discovered.
> 3. **One domain**: it changes or reads one owner and does not trace or change shared behavior across a boundary.
> 4. **Checkable output**: a file, a test or check result with its exit code, or a diff within declared paths.
> 5. **A named stop**: the packet says what to do at its boundary, which is to stop and return, not to widen.
>
> A unit that misses one is split until its parts fit, or it goes to the Daily-driver tier with the missing condition as the reason. Cost is why this is the default: at the dated snapshot below, Luna costs about an order of magnitude less per task than Sol or Opus low, and its highest effort still costs cents. A boundary stop from a Workhorse unit is evidence about the cut, so the assigner re-slices or re-tags it with a reason.

### C2. Slice executor record

Home: `shared-references/canonical-implementation-plan.md`.

> Every slice records `executor: <Workhorse | Daily driver> · <guidance>/<span> · <reason>`. A Workhorse slice passes Workhorse fit in `manage-agents`; a Daily-driver slice names the fit condition it misses. The implementer follows the record. A Workhorse slice that stops at a boundary, or an executor that disagrees with its record, returns to the originating planner as a plan defect; the implementer does not re-cut it.

### C3. Workhorse packet

Home: `manage-agents/references/agent-job-packet.md`, new section after Dispatch.

> **Workhorse packet.** A Workhorse assignment pins: the absolute worktree and head; the exact commands or allowed command set; the output file path; the done condition, including the terminal state for a watch; and the return, which is the output path plus a few headline lines. Raw evidence stays in the output file, not in the summary. The parent verifies the file, exit codes, and diff scope, not the prose.

## Runs

Each run names one skill. Anchors are at base `c08ab7af`. The Consumer disposition table is the complete edit list.

### Run 1: `manage-agents` (owns C1 and C3)

- **Surfaces:** main path (Select an agent, Runtime, Waiting), depth (`model-catalog.md`, `agent-job-packet.md`, `native-providers-claude.md`, `native-providers-cursor.md`).
- **Changes:** add C1 and the dated snapshot to `model-catalog.md`; drop Luna medium from the Worker and Sidekick tables (D6); add C3 to `agent-job-packet.md`; in the benefit test, say that a plan slice carrying C2 already is the brief; `native-providers-claude.md` and `native-providers-cursor.md` add a Workhorse 🛠️ Worker row routed through agent-router on Luna next to their unchanged Daily-driver rows (D5); Waiting adds the long-turn route (D9).

### Run 2: `plan-implementation` (owns C2 via `canonical-implementation-plan.md`)

- **Surfaces:** main path steps 2 to 4, depth (`slice-and-proof-design.md`, `canonical-implementation-plan.md`).
- **Changes:** each slice records C2; a slice that bundles independent units is split (evidence 3); a slice that would cross a boundary is split at that boundary or tagged Daily driver with the reason (evidence 2); required plan fields add the executor record.

### Run 3a: `orchestrator-implementation-goal`

- **Changes:** a design-review step for the plan runs through Main before the Sidekick commission (D1); the commission carries the reviewed plan and delegation, and Main picks the Sidekick's tier from its slices (D16); `SKILL.md:14`, `:29` and `references/goal-contract-and-routing.md:42,44` ("directly by default", "native Workers only for … benefit exceeds briefing") become: Daily-driver and coupled slices directly, independent Workhorse slices to Luna Workers under C3 as the plan records; a boundary stop returns to Main as a plan defect (D4); `goal-contract-and-routing.md:78` names Main as the handoff to re-review (D15).

### Run 3b: `implement-plan`

- **Changes:** dispatch follows the slice's C2 record and D16; `SKILL.md:14` and `references/execution-and-proof.md:34` stop saying "native Worker" and route through `manage-agents` for the host's Workhorse route (D5); a Workhorse boundary stop is a `plan-defect` return, not a local re-cut (consistent with `execution-and-proof.md:38`).

### Run 4: `practices-research` (waits on D10)

- **Changes:** `SKILL.md:8` and `:24` keep the ordered walk and the researcher's ownership. One added branch at step 4: IF a selected source class's corpus splits into independent units too large to read in one pass, cut it into per-unit inputs and give each unit to a Luna 🛠️ Worker under C3; verify each result's decisive anchors before it enters the ledger. `references/lane-packets.md:3,18` gain the same one clause; "source classes do not create separate packet or result files" stays true, since unit outputs are raw notes the ledger already allows (`evidence-ledger.md:55`).
- **Kept:** one researcher, one ordered walk, one ledger, claim labels, null results, verification, the countercheck.

### Run 5: `plan-improve-repo`

- **Rewrite:** `SKILL.md:55` ("in-parent by default") becomes: one Luna 🛠️ Worker per selected audit category under C3, returning evidence and candidates; a category small enough to inspect in one read stays in-parent (D11).
- **Kept:** `:56-57` (candidates are not truth; Main re-opens cited files; Main admits, prioritizes, and authors every plan).

### Run 6: ship prep

- Version surfaces, changelog, plugin `README.md` lines that restate the changed rules.

## Consumer disposition

Source: three Luna xhigh 🛠️ Workers read 60+ files whole (planning, agent management, research and review) and returned 229 rows; Main re-checked every row below against source at `c08ab7af`. Paths are under `plugins/shravan-dev-workflow/skills/` unless they start with `shared-references/` or `tests/`. Labels: **rewrite**, **cite** (point to C1/C2/C3), **test-update**. Anything not listed keeps its text.

| Run | Site | Current text (short) | Disposition |
|---|---|---|---|
| 1 | `manage-agents/SKILL.md:14` | Sidekick "implements, integrates, proves, and corrects its scope directly" | rewrite per D16: directly for coupled and Daily-driver slices; plan-marked independent Workhorse slices to Luna Workers |
| 1 | `manage-agents/SKILL.md:79` | benefit test ("benefit exceeds briefing, coordination, and verification cost") | rewrite: a plan slice carrying C2 already is the brief; the rest of the test stays |
| 1 | `manage-agents/SKILL.md:118` | "Different files are not proof of independence. When one agent can own a bounded result, do not split it." | keep; D16 cites it as the independence rule |
| 1 | `manage-agents/references/model-catalog.md` Categories, `:58` Worker Luna medium, Sidekick table | tiers without a why; Worker Luna medium | rewrite: add C1 and the dated snapshot; drop Luna medium from Worker (D6); Operator table unchanged |
| 1 | `manage-agents/references/agent-job-packet.md` after Dispatch | no Workhorse pins | rewrite: add C3 |
| 1 | `manage-agents/references/native-providers-claude.md:17`, `native-providers-cursor.md:17` | Worker rows Opus low / Grok 4.6 medium only | rewrite: add a Workhorse Worker row via agent-router on Luna; keep the Daily-driver rows (D5) |
| 1 | `manage-agents/SKILL.md` Waiting | no long-turn route | rewrite per D9 |
| 2 | `plan-implementation/references/slice-and-proof-design.md:18,45` | slice = smallest provable change; per-slice fields omit executor | rewrite: per-slice C2 record; split bundles; split or tag at a boundary |
| 2 | `shared-references/canonical-implementation-plan.md:63` | required plan fields | rewrite: add the per-slice executor record (C2) |
| 2 | `plan-handoff/SKILL.md:19` | handoff carries the obligation-to-slice-to-proof mapping | cite: the mapping carries each slice's C2 record |
| 3a | `orchestrator-implementation-goal/SKILL.md:14,29` | "executes … directly by default"; native Workers only past the benefit gate | rewrite per D16 and D1 |
| 3a | `orchestrator-implementation-goal/references/goal-contract-and-routing.md:42,44,78` | same default and gate; re-review handoff implicit | rewrite per D16; `:78` names Main as the re-review handoff (D15) |
| 3a | new step before commission | no plan design review through Main | rewrite: add it (D1) |
| 3b | `implement-plan/SKILL.md:14`, `references/execution-and-proof.md:34` | "native Worker" | rewrite: follow C2 and D16; route through `manage-agents` for the host's Workhorse route (D5) |
| 4 | `practices-research/SKILL.md:24`, `references/lane-packets.md:3` | serial source-class walk | rewrite (only if D10 is accepted): add the in-class unit branch; the serial walk stays |
| 5 | `plan-improve-repo/SKILL.md:55,66,143` | "in-parent by default"; `deep` delegates only under the predicate | rewrite per D11 |
| 5 | `plan-improve-repo/references/audit-lanes.md:3,5,39` | "never a flow default"; "category count does not satisfy the predicate"; "Do not turn the category list into a default swarm" | rewrite per D11; the category-pass completion at `:50` stays and becomes each Worker's return |
| tests | `tests/skills/pressure-scenarios/shravan-dev-workflow/manage-agents/no-relay-supervisor.md:31,33` | coupled parser slice stays with the Sidekick; benefit gate | test-update: keep both; add that a plan-marked independent Workhorse slice goes to a Luna Worker |
| tests | `…/manage-agents/main-default-after-ready-plan.md:34` | Sidekick "implements and proves directly by default" | test-update per D16 |
| tests | `…/orchestrator-implementation-goal/cases.ts:243,244` | "keeps implementation and associated proof direct"; "Keeps the Sidekick direct by default" | test-update per D16 |
| tests | `…/orchestrator-design/cases.ts:194` | coupled work direct; children only on the benefit gate | test-update per D16 |
| tests | `…/implement-plan/cases.ts:146` | colliding edits serial and inline | keep the collision rule; test-update to add the C2 dispatch case |
| tests | `…/plan-handoff/cases.ts:93` | handoff preserves the plan record | test-update: include the C2 record |
| tests | `…/plan-improve-repo/cases.ts:66,72`, `deep-no-default-delegation.md:29` | in-parent audit; "category count … as delegation authority" is a failure | test-update per D11 (the failure becomes delegating a category too small for its own Worker, or accepting a candidate unverified) |

**Rejected sweep rows** (with reason): wide-review collection fan-out (`orchestrator-implementation-goal/SKILL.md:33`; D12); host-specific Main rows (`orchestrator-design/SKILL.md:76`, `manage-agents/SKILL.md:12`; non-goal, the owner chooses Main); a high effort floor for 🔧 Operators and `luna-interactive-seat.md:31` (D6 keeps Operator medium); rewriting "There is no default swarm" / "no fixed swarm" in `spec-design/SKILL.md:285` and `program-design/SKILL.md:111,320` (D10 fans out units inside one class, never source classes, and neither skill changes); rewriting `skills-creation/SKILL.md:57` and `review/lanes/placement-and-calls.md:22` (a source class stays a loaded step; a unit Worker is a `manage-agents` assignment, not a Call Grammar form); scoping D6 to Claude hosts only (it applies on every host). `practices-research/…/substantial-stage-artifacts.md:48` stays: the serial walk survives D10.

## Authoring basis and proof plan

- **Authoring basis:** `user-directed intent`, with the log audit and prior art as supporting evidence. No RED is claimed.
- **Claim ceiling:** "drafted from user intent; C1 replay-checked against logged units; behavior not evaluated."
- **Structural proof:** `pnpm --dir tests/skills test` and `pnpm --dir tests/skills typecheck` pass. Every C1 and C3 citing site names its home by exact path. `rg -i "sonnet|haiku"` over `plugins/shravan-dev-workflow/skills` returns no routing rows.
- **Replay walkthrough (D13):** apply C1 to the logged Luna implementation units and Sol candidates; report fits, misses, and the missed condition, compared with each session's recorded outcome.
- **Security:** no script, hook, asset, or network surface. The ship step's plugin reinstall is the standard cache refresh: `allowed`, at ship only.

## Coordination

- **Base:** `origin/main` at `c08ab7af`, branch `chore/workhorse-decomposition`, worktree `~/dev/ai-tools.chore-workhorse-decomposition`.
- **Landing:** run 1 first (C1, C3 homes), then 2, 3a, 3b, 4, 5, 6 on one branch as one PR (D14).
- **Overlap with the pstack comparison** (`docs/wip/2026-09-27-pstack-vs-ours/reduction.md`, recommendation 6, not yet a spec): it targets the same two homes, `manage-agents/references/agent-job-packet.md` and `orchestrator-implementation-goal`. This spec takes the packet fields that overlap C3 (verify, forbidden, report, and timebox as the done condition) and the router long-turn route (D9). The rolling dispatch window and drain loop stay with that later spec. Whichever lands second rebases onto the first.
- **Router timeout:** already logged at `memory-logs/skills/log/2026-09-26-router-prompt-timeout-cancels-long-turns.md`; cite it, do not re-log.
- **Version:** 2.64.0 to 2.65.0 in the three plugin manifests and both marketplace entries, then the platform validation and readback from `skills-creation/references/platform-mechanics.md`.

## Non-goals

- **Main's model.** The owner chooses Main; nothing here selects or escalates it.
- **Independent review** (`implementation-review`, `spec-program-review`). The lead reads everything itself by design, and review leads stay different-lineage Daily-driver or Frontier models (D12).
- **`debug-investigation`, `skill-audit`.** `debug-investigation` already allows parallel read-only subagents (`SKILL.md:64`); no change unless the sweep finds a conflict.
- **Rolling dispatch window.** Owned by the later pstack spec (Coordination).
- **agent-router plugin.** The `conversation prompt` wait ceiling (already logged) and the stale-host warning belong to that plugin.

## Spec-review record

None yet.
