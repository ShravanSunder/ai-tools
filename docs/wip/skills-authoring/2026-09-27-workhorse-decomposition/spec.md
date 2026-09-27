# Workhorse-first decomposition

Multi-run skill-change spec for the `shravan-dev-workflow` plugin. Revision **r8**, 2026-09-27. Status: **draft**. r3 applies the owner's hub model: Main plans and cuts, the plan is design-reviewed through Main, then Main hands the reviewed plan and delegation to the Sidekick (D1, D15, C2). r4 grounded every run in current source at `c08ab7af`, dropped review fan-out, and coordinated with the pstack comparison. r5 reads every touched file whole and every prior spec on delegation and tiers, and reconciles with those owner decisions (Prior decisions, D5, D10, D11, D16). r6 applies the proposal review's six accepted findings; r7 applies the verification's residuals and F7 and the agreed pstack-audit items; r8 applies the owner's answer on plan review: Main writes the plan, an 🦉 Advisor reviews it (D1, D17, C4). No skill file changes before `accepted-to-implement`.

A companion devfiles change updates `shared/my_agents.md` (Model tiers; Main's role; the Roles line "a 🦉 Advisor exists only when the owner asks" gains the standing plan-review request; Practices steps 1 and 2 apply to Main and Sidekicks, not bounded Workers) and the machine model map. Either PR can land first; this plugin change stands alone.

## Problem and evidence

The owner on plan review (2026-09-27): "usually main makes implementation plan. then advisor should review."

The owner's hub model (2026-09-27): "main talks to advisor and reviewer. sidekick who implements should go through main to review for design first. then main hand review and delegation back to sidekick." And: "sidekick doesn't make the plan."

The owner's picture (2026-09-26): "I'm using Opus Medium to do most of my planning and talking … Astra High X High for reviews … those would break down the work for the sidekick. The sidekick and work could be the workhorse, depending on work size, so we need to break down the work better. This means planning needs to be better and incentivize using managed agents to use the workhorse better." And: "for research and other workflows skills we could use workhorse as well and fan out more for things that matter."

Cost. The owner supplied an image of Artificial Analysis's Intelligence-vs-cost chart (data 2026-09-22); Main read it by eye, and the figures are not independently verified: GPT-6 Luna runs about $0.01 to 0.06 per task across its effort levels (index 29 to 37). GPT-6 Sol runs about $0.13 to 1.05 (34 to 47), Claude Opus low about $0.55, and GPT-6 Astra high about $1.70. At matched catalog rows Luna is roughly 9 to 14× cheaper than Sol or Opus low, and Luna max outscores Sol low at about half its price. Raising Luna's effort costs cents.

A log audit of 2026-09-25 18:00 to 2026-09-26 22:00 covered 108 Luna, 64 Sol, and 25 Astra Codex sessions and 24 Claude Code sessions. Three Luna xhigh Workers read per-model digests; Main verified the decisive counts and quotes against the digests.

1. **Luna succeeds on well-cut work.** Log scraping 4/4 completed. Audit partitions (a test-hunt wave supervised by a 🐒 Sidekick) 30/34 completed; the strongest packets pinned checkout, HEAD, partition, output file, and done condition. The *executors* did not fail on judgment in the sample.
2. **Luna's partials include boundary stops.** 15 of 29 Luna implementation sessions ended partial. Several were correct stops at a write boundary (u011: "Completing it requires a production signal … the unit forbids editing `Sources/`"); others were external gates (an approval policy rejecting a merge or a bulk deletion). The session digests cannot say which stops were mis-cut slices, so D13 replays at unit level.
3. **Bigger models did Luna-shaped work.** 28 of 64 Sol sessions carried exact or fully specified local packets ("execute this brief", literal choreography tables, lint-fix briefs, CI measurement, single evidence lanes). Six packets bundled independent units, for example thirteen slices assigned to one session.
4. **On a Claude host the cheap path leaks off-catalog.** Claude Main launched 78 native Opus, 40 Sonnet, and 12 Haiku subagents; Sonnet and Haiku are not in the model catalog. Router-launched Luna appeared in 18 raw commands.
5. **The skills never route by piece.** Current source at `c08ab7af`:
   - `plan-implementation/references/slice-and-proof-design.md:18` sizes a slice as "the smallest coherent change that can earn evidence"; no slice field names an executor. The catalog's selection signals (Guidance × Architectural span, `manage-agents/SKILL.md`) are never produced by the planner.
   - `orchestrator-implementation-goal/SKILL.md:14`: "Each implementation 🐒 Sidekick executes its assigned change and associated proof directly by default. It may select bounded native Workers only for independent work, needed expertise, or large disposable output whose benefit exceeds briefing, coordination, and verification cost." The same default recurs at `:29` and `references/goal-contract-and-routing.md:42`, and the benefit gate at `:44`.
   - `plan-improve-repo/SKILL.md:55`: "Inspect audit categories in-parent by default", delegating only on explicit request or "one concrete independently verifiable evidence question".
   - `practices-research/SKILL.md:8`: "The assigned researcher owns the entire walk"; `:24` "Walk selected source classes one at a time"; `references/lane-packets.md:3` and `:18` repeat the serial walk and "source classes do not create separate packet or result files by default".
   - Already right and kept: Main authors every plan (`manage-agents/SKILL.md` Authority; `plan-implementation/SKILL.md:10,39`), review findings route through the orchestrator (`orchestrator-implementation-goal/SKILL.md:33`), and the 🦉 Advisor advises Main only (`manage-agents/SKILL.md:15`).

Prior art points the same way (Main's scratchpad `workhorse/out-prior-art.md`; its figures come from search snippets and are not verified against every primary source): 39% of multi-agent failures trace to specification and system design (MAST, 2025); planner/executor splits beat single models (Aider architect/editor 85% vs 79.7%; Anthropic's lead-plus-subagents research system); practitioners route "Luna when the change is contained and checkable locally; Sol when it traces or changes shared behavior". The same sources name the catch: verification is the bottleneck, so cheap executors must return artifacts a parent can check mechanically.

This spec was researched the way it proposes: Main cut 280 MB of transcripts into per-model digests with one question set each, and Luna xhigh Workers returned cited ledgers. The one failure was transport: `conversation prompt` hit its wait ceiling and cancelled the xhigh turns.

## Prior decisions this spec builds on or changes

Every row below was read in full at `c08ab7af`. A change to an owner decision is called out as such.

| Date | Source | Decision | This spec |
|---|---|---|---|
| 2026-08-07 | `05bbe238` (`plan-improve-repo/SKILL.md:55,66`, `references/audit-lanes.md:3,5,39`) | Audit categories are inspected in-parent; "Do not turn the category list into a default swarm." | Kept for categories. Run 5 adds delegation by C1-passing evidence unit under the 09-25 authorization (D11); the category list never becomes the dispatch unit. |
| 2026-09-20 | `2026-09-20-efficient-delegation/spec.md` | The implementation 🐒 Sidekick executes directly "unless a bounded delegation has a concrete benefit", to prevent "a supervisor-of-supervisors pattern"; coupled implementation and proof stay with the executor. | Kept. D16: a PR whose slices are all Workhorse gets a Luna Sidekick, so no Daily-driver Sidekick becomes a relay; a Daily-driver Sidekick dispatches only independent Workhorse slices. |
| 2026-09-23 | `2026-09-23-luna-workhorse/proposal.md` | Tiers named Workhorse / Daily driver / Frontier; Guidance and Architectural span are the only task signals; Luna Worker and Sidekick rows cover "Exact steps or well-understood Complete direction; Local/Cross-domain"; a Luna Sidekick takes only short owner status checks. | Kept, except the span: Luna rows narrow to Local (D2), so cross-domain work goes to the Daily driver. C1 is expressed in the two signals; D16 uses the Luna Sidekick rows. |
| 2026-09-23 | `2026-09-23-review-research-workflows/proposal.md`, PR #93 | Owner: "You should not be doing swarm stuff anymore." A 🔎 Review Sidekick walks every check itself; research is one ordered workflow by one researcher; `research-swarm` lanes removed. | Review: kept (D12). Research: kept, with one narrow addition that the owner decides (D10). |
| 2026-09-25 | `2026-09-25-capability-revamp/proposal.md` D163 | Native Worker per host: Claude Code Opus low; Cursor Grok 4.6 medium or Opus low; Codex Luna or Sol. Operator: Luna, native on Codex, else agent-router. With no native row for the catalog model, use agent-router with Luna, no native stand-in. | Kept. D5 narrows it: Workhorse-fit work on Claude Code and Cursor goes to agent-router Luna; the native Opus low and Grok rows stay for Daily-driver Workers. |
| 2026-09-25 | PR #101 (`manage-agents/SKILL.md` Select an agent; devfiles `my_agents.md` Concepts) | "Work that splits into many independent units (an audit, a migration, or a review across services or files) is pre-authorized to fan out: one 🛠️ Worker per unit." | The authority runs 4 and 5 apply. |
| 2026-09-26 | `2026-09-26-owner-attention-design-first/spec.md` | Owner attention goes to design; model and agent choice are Main's calls, recorded. | Tier per slice is recorded by Main in the plan, not asked. |
| 2026-09-27 | owner, this conversation | "Sidekick doesn't make the plan"; "main should make implementation plan and give it to sidekick"; "usually main makes implementation plan. then advisor should review"; Main is the only Advisor and Reviewer contact; no Sonnet or Haiku, use agent-router and Luna. | D1, D15, D17, D5. |

## Mental model

```text
 Main (Opus medium / Astra high): owner talk, design, the plan
   │  the plan cuts work into slices; each records guidance × span
   │  → tier · reason (C2), and a Workhorse slice passes C1
   │
   │  design reviewed first (existing gate)
   │  draft plan ◄──► 🦉 Advisor review (C4); Main answers each point
   │  (Main is the only Advisor and Reviewer contact)
   │
   │  plan + delegation ─► 🐒 Sidekick (per PR, D16 table)
   ▼                        all Workhorse → Luna Sidekick, runs it all
                            mixed → Daily driver runs its own and coupled
                            slices; plan-marked independent Workhorse
                            slices → 🛠️ Luna Workers
 boundary stop ─► back to Main as a plan defect ─► Main re-slices
```

Decomposition is Main's design work, and the executor tier is a consequence of it. A small model fails loudly at a boundary the plan forgot, so a Luna stop is evidence about the plan. The same shape applies to audits (one Worker per independent evidence unit that passes C1, never per whole category) and, if the owner accepts D10, to a research corpus that splits into independent units (one Worker per unit, inside the researcher's ordered walk). Synthesis, admission, and judgment stay with the researcher or Main. Independent review is the exception: its lead reads everything itself.

## Success definition

1. Main's plan records each slice's guidance, span, tier, and reason, and every Workhorse slice passes the Workhorse fit test. Before the plan is marked ready, an 🦉 Advisor reviews the draft and Main records a disposition for every point; a compact one-owner plan may skip the review with a recorded reason.
2. The Sidekick executes and dispatches per the D16 table: a Luna Sidekick executes an all-Workhorse PR directly; a Daily-driver Sidekick dispatches only plan-marked independent Workhorse slices. A boundary stop returns to Main as a plan defect. Only Main talks to the Advisor and the Reviewer.
3. Audit work fans out to Luna Workers by independent evidence unit that passes C1, never by whole category. If D10 is accepted, a research corpus that splits into independent units fans out one Luna Worker per unit inside the researcher's ordered walk. The cut, verification, synthesis, and admission stay with the researcher or Main. Independent review does not fan out.
4. Workhorse work runs on Luna: native on Codex, through agent-router on Claude Code and Cursor. No skill routes to Sonnet or Haiku. A PR whose slices are all Workhorse gets a Luna Sidekick.
5. Every Workhorse packet pins inputs, commands, output file, and done condition, and the parent verifies the artifact, not prose.

## Decisions

Each row is a default with its rationale. Strike or change any row before review closes.

| # | Default taken | Rationale |
|---|---|---|
| D1 | **Owner hub model, confirmed 2026-09-27.** Planning keeps its existing admission (`plan-implementation/SKILL.md:15-18`: reviewed design or an admitted repository improvement). Main writes the plan, cutting slices and recording each slice's tier (C2). Before returning `ready`, Main has an 🦉 Advisor review the draft under C4 and answers every point. Main then hands the plan and the delegation to the implementation 🐒 Sidekick. The Sidekick does not author or re-cut the plan. `plan-implementation`'s completion check gains "every Workhorse slice passes C1" and "C4 review done or skipped with a reason". | Owner, 2026-09-27: "usually main makes implementation plan. then advisor should review." The review must precede `ready` because a ready plan is immutable (`canonical-implementation-plan.md:37`). Closes F4 with a named owner and method. |
| D2 | **Pending owner confirmation.** Workhorse fit is exactly Contract C1, owned by `manage-agents/references/model-catalog.md`, and is stated in the catalog's own signals (Guidance and Architectural span). The Luna Worker and Sidekick rows' span cells narrow from "Local/Cross-domain" to "Local", so the table and C1 agree. Every other site cites C1. | Proposal review F1. Narrowing the span changes a 09-23 owner row; the basis is the owner's 2026-09-26 words ("There's something about a bigger model that does things a lot better—cross-domain and domain stuff") and model choice being Main's call under Owner Attention. |
| D3 | The Workhorse tier is the default for work that passes C1. Escalation happens on evidence (a boundary stop, a failed check, a named cross-domain need), and the reason is recorded. | Evidence 1 to 3; prior art's escalate-on-evidence cascades. |
| D4 | A Luna boundary stop returns to Main as a plan defect; Main re-slices or re-tags with a reason. It is not silently re-run on a bigger model, and the Sidekick does not re-cut it. | Evidence 2: the stop is information about the plan. |
| D5 | Workhorse-fit work runs on Luna: native on Codex, and through agent-router on Claude Code and Cursor, which have no native Luna. The existing native Daily-driver Worker rows stay (Claude Code Opus low; Cursor Grok 4.6 medium or Opus low). Sonnet and Haiku are never selected on any host. | Owner, 2026-09-27: "i dont think we will use sonnet or haiku we can use agent router and luna". Evidence 4. Consistent with the 09-25 D163 route "no native row → agent-router with Luna". |
| D6 | Luna runs at high or above for 🛠️ Workers and 🐒 Sidekicks; the Worker default is xhigh. 🔧 Operators keep medium and high. | Effort costs cents on Luna. The sample shows no outcome difference by effort, so this rests on cost, not measured quality. |
| D7 | The catalog carries a dated cost snapshot (source and date, relative ratios, "about an order of magnitude"), not a benchmark claim. | Keeps the existing "do not claim universal benchmarks" rule true while giving the why. |
| D8 | Contract C3, the Workhorse packet, lives in `manage-agents/references/agent-job-packet.md`. Its VERIFY, TIMEBOX, REPORT, and closed-label fields come from the pstack comparison (agreed with its author); the no-discovery sentence comes from a blind replay Worker that ran work-home discovery, searched the board topic holding the outcomes, and was stopped by Codex auto-review (2026-09-27). | The best audit-partition packets and the September Operator failure logs (wrong worktree, command drift, summarized proof, early terminal, stale head) name the same five pins. |
| D9 | A long agent-router Workhorse turn starts as `conversation create` then `message send`, with the parent waiting on the output file; `conversation prompt` fits short turns or takes an explicit `--timeout-seconds` sized to the work. Its default (300 s) cancels the remote turn rather than detaching. | Logged at `memory-logs/skills/log/2026-09-26-router-prompt-timeout-cancels-long-turns.md` (7 cancelled turns across two sessions; the log's own follow-up asks manage-agents for exactly this). |
| D10 | **OPEN, owner decision (brief).** The researcher keeps the ordered source-class walk (09-23). Inside one source class, a corpus that splits into independent units (many session logs, many repositories or services) may fan out one Luna 🛠️ Worker per unit under the 09-25 pre-authorization; the researcher cuts the units, verifies each result's decisive anchors, and keeps the one ledger. Recommended: accept. | This research's own route (280 MB of transcripts, three Luna digests) versus the 09-23 decision, which removed one lane per *source class*. The addition fans out *units of one class*, never classes. It changes an owner decision three days old, so the owner decides. |
| D11 | `plan-improve-repo` delegates audit work by **evidence unit**: after recon, Main cuts each selected category into independently bounded units (one owner, one question, pinned paths) and gives each unit that passes C1 to a Luna 🛠️ Worker; a unit that fails C1 stays in-parent or goes to a Daily-driver Worker. Categories stay the coverage dimensions and their completion returns (`audit-lanes.md:50`). Admission, prioritization, and plans stay with Main. | Proposal review F3: a whole category (security, architecture) is often cross-domain, so it is not itself a Workhorse unit. The 09-25 pre-authorization covers work that already splits into independent units; the cut makes that true. |
| D12 | **Dropped in r4.** Independent review does not fan out. `implementation-review/SKILL.md:28` has the lead read "the complete governing basis and the complete base-to-reviewed diff yourself", which is what makes it independent. The 30/34 Luna partition successes were audit hunts supervised by a Sidekick, which run 5 covers. | Current source; evidence 1 re-read. |
| D13 | Proof is static plus a **blind unit-level replay** of C1. Corpus: the 29 frozen pre-dispatch briefs of one test-hunt wave (`agent-studio-worktrees/test-hunt/tmp/test-hunt/fix/wave1/units/u001-brief.md` to `u029-brief.md`). A Luna 🛠️ Worker classifies each brief under C1 from the brief alone (fit, miss with the condition, or unknown), with no outcome files in its inputs. Main then compares with the recorded outcomes (`validation.tsv`, `editor-reports/`) and reports agreements, disagreements, missing inputs, and stops caused by external gates. No result is required in advance. | Proposal review F6: sessions bundle several units, digests lack briefs, and a prediction made after reading outcomes proves nothing. A session-level replay on 2026-09-27 left 17 of 29 Luna rows unknown for exactly that reason. |
| D14 | One PR, one minor version bump (2.64.0 to 2.65.0) across every version surface, one changelog entry. | Runs share C1 and C2. |
| D15 | Main is the only contact for the Advisor and the Reviewer. A correction goes back to the Reviewer through Main. | Owner direction, 2026-09-27. Mostly existing (`orchestrator-implementation-goal` step 5); the re-review handoff at `goal-contract-and-routing.md:78` is made explicit. |
| D16 | A PR's Sidekick tier and execution follow the plan's slice records and dependency edges (`manage-agents/SKILL.md:118`: "Different files are not proof of independence"). See the D16 table below; its shipped home is the `manage-agents` Commission section (F7). The executor never infers independence from the tier. | 09-20 efficient-delegation: no supervisor-of-supervisors, coupled work stays with its executor. Uses the existing Luna Sidekick rows (09-23). |
| D17 | The owner's words are a **standing request** for an Advisor at plan review, so `manage-agents`' "an Advisor exists only when Shravan explicitly requests one" gains that case. The plan-review Advisor defaults to GPT-6 Astra high from the Advisor table; the owner may name another row per goal, and Main reuses one Advisor session across a goal's plans. The Advisor advises and never approves: Main records take or decline, with a reason, for each point, and still owns the plan. "Usually": a full plan gets the review; a compact plan (one low-risk owner, one or two proof gates, per `slice-and-proof-design.md`) may skip it with the reason recorded. | Owner, 2026-09-27 (plan review) and 2026-09-26 ("Astra High X High for reviews"). Keeps `design-phase-not-sidekick-author`'s "an Advisor is never an approval gate" true. The Astra default is Main's reading of the 09-26 words; the owner may strike it. |

### D16 table

| PR's slices | Sidekick | What the Sidekick executes itself | What goes to Luna 🛠️ Workers |
|---|---|---|---|
| all Workhorse | Luna | every slice, directly | nothing by default; the benefit test at `manage-agents/SKILL.md:79` still governs any child |
| mixed tiers | Daily driver | Daily-driver slices, and every Workhorse slice the plan does not mark independent | Workhorse slices the plan marks independent (no `requires` or `serial` edge to in-flight work, disjoint writes, own proof), when the benefit test holds |
| all Daily driver | Daily driver | every slice | nothing by default |

## Contracts

### C1. Workhorse fit

Home: `manage-agents/references/model-catalog.md`, new section after Categories.

> **Workhorse fit.** A unit of work fits the Workhorse tier when its Guidance is Exact steps, or Complete direction with the approach already fixed, its Architectural span is Local, and it has:
> 1. **Pinned inputs**: the files, paths, head, corpus slice, or brief are given, not discovered.
> 2. **A checkable output**: a file, a test or check result with its exit code, or a diff within declared paths.
> 3. **A named stop**: the packet says what to do at its boundary, which is to stop and return, not to widen.
>
> A unit that misses any of these is split until its parts fit, or it goes to the Daily-driver tier with the missing condition as the reason. A packet that fixes the outcome but leaves the approach open is Partial direction and does not fit. Cost is why this is the default: at the dated snapshot below, Luna costs about an order of magnitude less per task than Sol or Opus low, and its highest effort still costs cents. A boundary stop from a Workhorse unit is evidence about the cut, so the assigner re-slices or re-tags it with a reason. When many units would apply the same mechanical edit, write the script or codemod and give it to one 🔧 Operator instead of many Workers.

### C2. Slice executor record

Home: `shared-references/canonical-implementation-plan.md`.

> Every slice records `executor: <Workhorse | Daily driver> · <guidance>/<span> · <reason>`. A Workhorse slice passes Workhorse fit in `manage-agents`; a Daily-driver slice names the fit condition it misses. The implementer follows the record. A Workhorse slice that stops at a boundary, or an executor that disagrees with its record, returns to the originating planner as a plan defect; the implementer does not re-cut it.

### C3. Workhorse packet

Home: `manage-agents/references/agent-job-packet.md`, new section after Dispatch.

> **Workhorse packet.** A Workhorse assignment pins: the absolute worktree and head; the exact commands or allowed command set; VERIFY, the exact commands that check the result (a repository's own verification or harness command is a valid VERIFY value); the output file path; a closed label set when the output classifies; the done condition, including the terminal state for a watch; TIMEBOX, after which the Worker returns partial findings; and REPORT: status, head, commands actually run, deviations, then the output path and a few headline lines. Raw evidence stays in the output file, not in the summary. A Workhorse 🛠️ Worker or 🔧 Operator does no work-home discovery, board search, or trace; the packet is its whole context. The parent verifies the file, exit codes, and diff scope, not the prose.

### C4. Advisor plan review

Home: `plan-implementation/references/advisor-plan-review.md` (new teaching reference), called from `plan-implementation` before step 7 returns `ready`.

> Main sends the 🦉 Advisor the draft plan, its governing basis, and the current-source anchors it cites. The Advisor reads them and returns points, each with a plan anchor, the problem, and a suggested change. It checks: every Workhorse slice passes Workhorse fit and every other slice names the condition it misses; the throughput checkpoint is filled and each slice marked independent really has disjoint writes and its own proof; no slice crosses a boundary or needs a seam the plan does not name; every obligation has fitting proof; no slice bundles independent units. Main records take or decline, with a reason, for every point, revises the draft, and sends changed slices back to the same Advisor once. The Advisor's agreement is not required to proceed; Main owns the plan and its `ready` result. The review is done when every point has a disposition.

## Runs

Each run names one skill. Anchors are at base `c08ab7af`. The Consumer disposition table is the complete edit list.

### Run 1: `manage-agents` (owns C1 and C3)

- **Surfaces:** main path (Select an agent, Runtime, Waiting), depth (`model-catalog.md`, `agent-job-packet.md`, `native-providers-claude.md`, `native-providers-cursor.md`).
- **Changes:** add C1 and the dated snapshot to `model-catalog.md`; narrow the Luna Worker and Sidekick span cells to Local and drop Luna medium from the Worker table (D2, D6); add C3 to `agent-job-packet.md`; in the benefit test, say that a plan slice carrying C2 already is the brief; `native-providers-claude.md` and `native-providers-cursor.md` add a Workhorse 🛠️ Worker row routed through agent-router on Luna next to their unchanged Daily-driver rows (D5); Waiting adds the long-turn route (D9); the Commission section becomes the runtime home of the D16 staffing table (F7); Authority (`SKILL.md:15`) and the Agent Roles row (`:37`) add the standing plan-review request, and `model-catalog.md:101` names the Astra high default for it (D17).

### Run 2: `plan-implementation` (owns C2 via `canonical-implementation-plan.md`)

- **Surfaces:** main path steps 2 to 4, depth (`slice-and-proof-design.md`, `canonical-implementation-plan.md`).
- **Changes:** each slice records C2; the plan records a throughput checkpoint, each item kept with `n/a: <reason>` rather than dropped: blocking first steps, independent workstreams (disjoint files, services, or layers), shared mutable state (split the target before serializing), and the smallest safe decomposition (if one worker is best, say why); a shared-write check is what earns a slice the "independent" mark D16 dispatch relies on; a slice that bundles independent units is split (evidence 3); a slice that would cross a boundary is split at that boundary or tagged Daily driver with the reason (evidence 2); required plan fields add the executor record; a new step before `ready` loads C4 (`IF the plan is a full plan, MUST load references/advisor-plan-review.md and return every point's disposition; IF compact, record the skip reason`); the completion check adds "every Workhorse slice passes C1" and the C4 result (D1, D17).

### Run 3a: `orchestrator-implementation-goal`

- **Changes:** step 2's plan authoring includes the C4 Advisor review before `ready` (cite `plan-implementation`); at commission, Main picks the Sidekick's tier from the plan's slice records per the D16 table; `SKILL.md:14`, `:29` and `references/goal-contract-and-routing.md:42,44` cite the D16 table in place of "directly by default" and the bare benefit gate; a Workhorse boundary stop returns to Main as a plan defect (D4); `goal-contract-and-routing.md:78` names Main as the handoff to re-review (D15). No new review step (D1).

### Run 2b: `plan-handoff`

- **Changes:** `SKILL.md:19`: the carried obligation-to-slice-to-proof mapping includes each slice's C2 record.

### Run 3c: `orchestrator-design`

- **Changes:** `SKILL.md:78`: after a ready plan, the commission cites the D16 staffing table in `manage-agents` in place of restating direct execution.

### Run 3b: `implement-plan`

- **Changes:** dispatch follows the slice's C2 record and D16; `SKILL.md:14` and `references/execution-and-proof.md:34` stop saying "native Worker" and route through `manage-agents` for the host's Workhorse route (D5); a Workhorse boundary stop is a `plan-defect` return, not a local re-cut (consistent with `execution-and-proof.md:38`).

### Run 4: `practices-research` (waits on D10)

- **Changes:** `SKILL.md:8` and `:24` keep the ordered walk and the researcher's ownership. One added branch at step 4: IF a selected source class's corpus splits into independent units too large to read in one pass, cut it into per-unit inputs and give each unit to a Luna 🛠️ Worker under C3; verify each result's decisive anchors before it enters the ledger. `references/lane-packets.md:3,18` gain the same one clause; "source classes do not create separate packet or result files" stays true, since unit outputs are raw notes the ledger already allows (`evidence-ledger.md:55`).
- **Kept:** one researcher, one ordered walk, one ledger, claim labels, null results, verification, the countercheck.

### Run 5: `plan-improve-repo`

- **Rewrite:** `SKILL.md:55,66,143` and `references/audit-lanes.md:3,5,39`: categories stay in-parent coverage dimensions; after recon, Main may cut a category into independent evidence units and give each C1-passing unit to a Luna 🛠️ Worker under C3; the "one bounded question" packet at `audit-lanes.md:7-27` becomes the unit packet (D11). `improvement-plan-template.md` carries the C2 record for each slice (the skill is a C2 producer).
- **Kept:** `:56-57` (candidates are not truth; Main re-opens cited files; Main admits, prioritizes, and authors every plan); `audit-lanes.md:50` category completion.

### Run 6: ship prep

- Version surfaces, changelog, plugin `README.md` lines that restate the changed rules.

## Consumer disposition

Source: three Luna xhigh 🛠️ Workers read 60+ files whole (planning, agent management, research and review) and returned 229 rows; Main re-checked every row below against source at `c08ab7af`. Paths are under `plugins/shravan-dev-workflow/skills/` unless they start with `shared-references/` or `tests/`. Labels: **rewrite**, **cite** (point to C1/C2/C3), **test-update**. Anything not listed keeps its text.

| Run | Site | Current text (short) | Disposition |
|---|---|---|---|
| 1 | `manage-agents/SKILL.md:14` | Sidekick "implements, integrates, proves, and corrects its scope directly" | rewrite: cite the D16 staffing table in its new home (below): a Luna Sidekick executes an all-Workhorse PR directly; a Daily-driver Sidekick executes its own and coupled slices and dispatches only plan-marked independent Workhorse slices when the benefit test holds |
| 1 | `manage-agents/SKILL.md:79` | benefit test ("benefit exceeds briefing, coordination, and verification cost") | rewrite: a plan slice carrying C2 already is the brief; the rest of the test stays |
| 1 | `manage-agents/SKILL.md:118` | "Different files are not proof of independence. When one agent can own a bounded result, do not split it." | keep; D16 cites it as the independence rule |
| 1 | `manage-agents/references/model-catalog.md` Categories, `:58` Worker Luna medium, Sidekick table | tiers without a why; Worker Luna medium | rewrite: add C1 and the dated snapshot; drop Luna medium from Worker (D6); Operator table unchanged |
| 1 | `manage-agents/references/agent-job-packet.md` after Dispatch | no Workhorse pins | rewrite: add C3 |
| 1 | `manage-agents/references/native-providers-claude.md:17`, `native-providers-cursor.md:17` | Worker rows Opus low / Grok 4.6 medium only | rewrite: add a Workhorse Worker row via agent-router on Luna; keep the Daily-driver rows (D5) |
| 1 | `manage-agents/SKILL.md` Waiting | no long-turn route | rewrite per D9 |
| 2 | `plan-implementation/references/slice-and-proof-design.md:18,45` | slice = smallest provable change; per-slice fields omit executor | rewrite: per-slice C2 record; split bundles; split or tag at a boundary |
| 2 | `shared-references/canonical-implementation-plan.md:63` | required plan fields | rewrite: add the per-slice executor record (C2) |
| 2b | `plan-handoff/SKILL.md:19` | handoff carries the obligation-to-slice-to-proof mapping | rewrite: the mapping carries each slice's C2 record |
| 3a | `orchestrator-implementation-goal/SKILL.md:14,29` | "executes … directly by default"; native Workers only past the benefit gate | rewrite per the D16 table |
| 3a | `orchestrator-implementation-goal/references/goal-contract-and-routing.md:42,44,78` | same default and gate; re-review handoff implicit | rewrite per D16; `:78` names Main as the re-review handoff (D15) |
| 3b | `implement-plan/SKILL.md:14`, `references/execution-and-proof.md:34` | "native Worker" | rewrite: follow C2 and D16; route through `manage-agents` for the host's Workhorse route (D5) |
| 4 | `practices-research/SKILL.md:24`, `references/lane-packets.md:3` | serial source-class walk | rewrite (only if D10 is accepted): add the in-class unit branch; the serial walk stays |
| 5 | `plan-improve-repo/SKILL.md:55,66,143` | "in-parent by default"; `deep` delegates only under the predicate | rewrite per D11 |
| 5 | `plan-improve-repo/references/improvement-plan-template.md:40-56` | slice fields without an executor | rewrite: each slice carries the C2 record |
| 5 | `plan-improve-repo/references/audit-lanes.md:3,5,39` | "never a flow default"; "category count does not satisfy the predicate"; "Do not turn the category list into a default swarm" | rewrite per D11: categories stay coverage dimensions; Main may cut a category into C1-passing evidence units for Luna Workers. Each Worker returns its unit's anchors, candidates or null result, and limits; Main combines unit returns into the category completion at `:50`. |
| 3c | `orchestrator-design/SKILL.md:78` | commissions after a ready plan and restates direct execution | rewrite: cite the D16 staffing table in `manage-agents` |
| 2 | new `plan-implementation/references/advisor-plan-review.md` | none | create: C4 |
| 2 | `plan-implementation/SKILL.md` Plan the Change completion and step 4 | slice checks; no fit check | rewrite: "every Workhorse slice passes C1" after either admissible basis (D1) |
| 2 | `plan-implementation/SKILL.md:38` | ready record → `implement-plan` → commission | cite: the ready record carries C2; no new gate (D1) |
| 1 | `manage-agents/SKILL.md:15,37`; `references/model-catalog.md:101` | Advisor "exists only when Shravan explicitly requests one"; owner chooses every Advisor model | rewrite per D17: standing request at plan review; Astra high default for it, owner may override |
| 1 | `manage-agents/SKILL.md:94-96` (Commission an implementation 🐒 Sidekick) | commission per planned PR assignment; no staffing table | rewrite: install the D16 staffing table here as its one runtime home; every other site cites this section |
| tests | `…/manage-agents/design-phase-not-sidekick-author.md:29,31,40` | an Advisor is never an approval gate | keep: C4 keeps it true |
| tests | `…/manage-agents/persistent-vs-single-assignment.md:66-68`, `pattern-selection-unnamed.md:19-27` | an Advisor exists because the user asked; a one-time opinion is not an Advisor | keep: the plan-review Advisor is persistent across a goal and exists by the owner's standing request |
| ship | `AGENTS.md:69` | repo operating instruction repeats "directly by default" and the benefit wording | rewrite in ship prep (repo doc companion) |
| fixtures | `tests/skills/fixtures/minimal-planning-delivery/existing-plan.md:23-39`, `handoff-plan.md:23-36`, `improvement-plan.md:21-24` | ready plans with no C2 record | test-update: add a C2 record per slice so canonical admission still admits them |
| tests | `…/implement-plan/cases.ts:13-16,35-37` | admits the exact unchanged `existing-plan.md` | test-update: stays true once the fixture carries C2 |
| tests | `…/orchestrator-implementation-goal/continue-ready-plan-without-approval.md:18-21` | commission and direct execution | test-update per the D16 table; no approval step added (D1) |
| tests | `…/manage-agents/sidekick-luna-xhigh.md:23-40` | Luna xhigh allowed for a Cross-domain Sidekick | test-update per D2: the scenario's parser/validation/reporting plan becomes Local, or the expected tier becomes Daily driver |
| tests | `tests/skills/pressure-scenarios/shravan-dev-workflow/manage-agents/no-relay-supervisor.md:31,33` | coupled parser slice stays with the Sidekick; benefit gate | test-update: keep both; add that under a mixed-tier Daily-driver Sidekick, a plan-marked independent Workhorse slice goes to a Luna Worker when the benefit test holds |
| tests | `…/manage-agents/main-default-after-ready-plan.md:34` | Sidekick "implements and proves directly by default" | test-update per D16 |
| tests | `…/orchestrator-implementation-goal/cases.ts:243,244` | "keeps implementation and associated proof direct"; "Keeps the Sidekick direct by default" | test-update per D16 |
| tests | `…/orchestrator-design/cases.ts:194` | coupled work direct; children only on the benefit gate | test-update per D16 |
| tests | `…/implement-plan/cases.ts:146` | colliding edits serial and inline | keep the collision rule; test-update to add the C2 dispatch case |
| tests | `…/plan-handoff/cases.ts:93` | handoff preserves the plan record | test-update: include the C2 record |
| tests | `…/plan-improve-repo/cases.ts:66,72`, `deep-no-default-delegation.md:29` | in-parent audit; "category count … as delegation authority" is a failure | test-update per D11: the criterion becomes "delegates only evidence units that pass C1 and verifies each return"; the failure becomes dispatching a whole category, or a unit that fails C1, to a Luna Worker |

**Rejected sweep rows** (with reason): wide-review collection fan-out (`orchestrator-implementation-goal/SKILL.md:33`; D12); host-specific Main rows (`orchestrator-design/SKILL.md:76`, `manage-agents/SKILL.md:12`; non-goal, the owner chooses Main); a high effort floor for 🔧 Operators and `luna-interactive-seat.md:31` (D6 keeps Operator medium); rewriting "There is no default swarm" / "no fixed swarm" in `spec-design/SKILL.md:285` and `program-design/SKILL.md:111,320` (D10 fans out units inside one class, never source classes, and neither skill changes); rewriting `skills-creation/SKILL.md:57` and `review/lanes/placement-and-calls.md:22` (a source class stays a loaded step; a unit Worker is a `manage-agents` assignment, not a Call Grammar form); scoping D6 to Claude hosts only (it applies on every host). `practices-research/…/substantial-stage-artifacts.md:48` stays: the serial walk survives D10.

## Authoring basis and proof plan

- **Authoring basis:** `user-directed intent`, with the log audit and prior art as supporting evidence. No RED is claimed.
- **Claim ceiling:** "drafted from user intent; C1 replayed blind on 29 logged unit briefs; behavior not evaluated."
- **Structural proof:** `pnpm --dir tests/skills test` and `pnpm --dir tests/skills typecheck` pass. Every C1 and C3 citing site names its home by exact path. `rg -i "sonnet|haiku"` over `plugins/shravan-dev-workflow/skills` returns no routing rows.
- **Replay (D13):** blind unit-level classification of the 29 wave-1 briefs, then Main's comparison with recorded outcomes. The 28 Sol entries stay candidates, not demonstrated Luna successes.
- **Security:** no script, hook, asset, or network surface. The ship step's plugin reinstall is the standard cache refresh: `allowed`, at ship only.

## Coordination

- **Base:** `origin/main` at `c08ab7af`, branch `chore/workhorse-decomposition`, worktree `~/dev/ai-tools.chore-workhorse-decomposition`.
- **Landing:** run 1 first (C1, C3, and D16 table homes), then 2, 2b, 3a, 3b, 3c, 4, 5, 6 on one branch as one PR (D14).
- **Overlap with the pstack comparison** (`/Users/shravansunder/dev/ai-tools/docs/wip/2026-09-27-pstack-vs-ours/reduction.md` in the main checkout, uncommitted; recommendation 6, not yet a spec): it targets the same two homes, `manage-agents/references/agent-job-packet.md` and `orchestrator-implementation-goal`. This spec takes the packet fields that overlap C3 (verify, forbidden, report, and timebox as the done condition) and the router long-turn route (D9). The rolling dispatch window and drain loop stay with that later spec. Whichever lands second rebases onto the first.
- **Router timeout:** already logged at `memory-logs/skills/log/2026-09-26-router-prompt-timeout-cancels-long-turns.md`; cite it, do not re-log.
- **Version:** 2.64.0 to 2.65.0 in the three plugin manifests and both marketplace entries, then the platform validation and readback from `skills-creation/references/platform-mechanics.md`.

## Non-goals

- **Main's model.** The owner chooses Main; nothing here selects or escalates it.
- **Independent review** (`implementation-review`, `spec-program-review`). The lead reads everything itself by design, and review leads stay different-lineage Daily-driver or Frontier models (D12).
- **`debug-investigation`, `skill-audit`.** `debug-investigation` already allows parallel read-only subagents (`SKILL.md:64`); no change unless the sweep finds a conflict.
- **Rolling dispatch window.** Owned by the later pstack spec (Coordination).
- **agent-router plugin.** The `conversation prompt` wait ceiling (already logged) and the stale-host warning belong to that plugin.

## Spec-review record

- **Review 1** (r5, commit `c48a5ed3`): different-lineage 🔎 Review Sidekick, GPT-6 Astra high, agent-router session `01a0e2a0-6835-7171-9512-410133d40c29`, no author history. Checks: mental-model-fit complete, trigger-routing complete, rule-agreement partial (external benchmark figures and the full audit corpus not reverified), depth-coverage complete. Verdict `targeted-revision`, implementation decision `revise-first`, blocker override applies. Accepted F1 to F6 (blockers F4, F5). Rejected: D10's openness as a defect, a blanket no-swarm reading, restoring review fan-out, Sidekick plan repair, raising Operator effort, removing native Daily-driver rows, C3 as an unjustified schema, D9 as fabricated, required pressure runs, one-target violation, a missing Codex marketplace version.
- **r6 remediation** (Main): F1 → C1 restated in Guidance and span, Luna span narrowed to Local (D2); F2 → D16 table; F3 → audit delegation by C1-passing evidence unit (D11); F4 → no new plan review, existing design gate plus a plan completion check (D1); F5 → disposition rows for the commission paths, `AGENTS.md:69`, three ready-plan fixtures, and three more scenarios; F6 → blind unit-level replay (D13) and a narrowed evidence 2. Main also found that the session-level replay's own summary misstated its table (it named c4; the table shows 0 c4 and 20 c5 misses), recorded here as evidence for C3's "verify the file, not the prose".
- **Verification of r6** (same lead): `targeted-revision`, `revise-first`. F1 and F6 closed technically; F2 to F5 open with residual stale copies; new F7 (the D16 table had no shipped home). Converging: six open findings became five, with no recurrence. The lead holds D2 (Luna Local-only) and D1 (existing design gate, no separate plan review) as owner decisions.
- **r7 remediation** (Main): stale copies reconciled (mental model, `manage-agents:14` row, the removed plan-review row, the owner row, D1's admission alternatives, the category test and unit receipts, the mixed-tier test qualifier); `plan-handoff` and `orchestrator-design` become runs 2b and 3c; the improvement-plan template and the planning completion check join the disposition table; the D16 table gets its runtime home in `manage-agents` Commission (F7). Agreed pstack-audit items added: C3 fields, build-the-lever in C1, the throughput checkpoint and shared-write check in run 2. D1 and D2 go to the owner.
- **Owner answer on D1** (2026-09-27): "usually main makes implementation plan. then advisor should review." r8 adds D17 and C4 and rewrites D1; D2 (Luna Local-only) is still pending.
