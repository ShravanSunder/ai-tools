# Workhorse-first decomposition

Multi-run skill-change spec for the `shravan-dev-workflow` plugin. Revision **r10**, 2026-09-28. Status: **accepted-to-implement** (r10, verified 2026-09-28), with the owner's catalog amendment r11 (2026-09-28) under the lead's verification. r3 applies the owner's hub model: Main plans and cuts, the plan is design-reviewed through Main, then Main hands the reviewed plan and delegation to the Sidekick (D1, D15, C2). r4 grounded every run in current source at `c08ab7af`, dropped review fan-out, and coordinated with the pstack comparison. r5 reads every touched file whole and every prior spec on delegation and tiers, and reconciles with those owner decisions (Prior decisions, D5, D10, D11, D16). r6 applies the proposal review's six accepted findings; r7 applies the verification's residuals and F7 and the agreed pstack-audit items; r8 applies the owner's answer on plan review: Main writes the plan, an 🦉 Advisor reviews it (D1, D17, C4); r9 adds the D13 replay result and the seam condition it exposed (C1), and reverts D17 to "the project's Advisor, if it has one" per the owner; r10 applies the r9 verification (F4 residuals, F8, F9) and rebases onto `main` at `59eec035` (plugin 2.65.0). No skill file changes before `accepted-to-implement`.

A companion devfiles change updates `shared/my_agents.md` (Model tiers; Main's role; Practices steps 1 and 2 apply to Main and Sidekicks, not bounded Workers, matching runs 7 and 8) and the machine model map. Either PR can land first; this plugin change stands alone.

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
   │  draft plan: Main review (C4), + 🦉 Advisor if the project has one
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

1. Main's plan records each slice's guidance, span, tier, and reason, and every Workhorse slice passes the Workhorse fit test, including a source check that its seams exist at its base. Before the plan is marked ready, Main reviews it under C4 (with the project's Advisor, if it has one) and records a disposition for every point; a compact one-owner plan may skip the review with a recorded reason.
2. The Sidekick executes and dispatches per the D16 table: a Luna Sidekick executes an all-Workhorse PR directly; a Daily-driver Sidekick dispatches only plan-marked independent Workhorse slices. A boundary stop returns to Main as a plan defect. Only Main talks to the Advisor and the Reviewer.
3. Audit work fans out to Luna Workers by independent evidence unit that passes C1, never by whole category. If D10 is accepted, a research corpus that splits into independent units fans out one Luna Worker per unit inside the researcher's ordered walk. The cut, verification, synthesis, and admission stay with the researcher or Main. Independent review does not fan out.
4. Workhorse work runs on Luna: native on Codex, through agent-router on Claude Code and Cursor. No skill routes to Sonnet or Haiku. A PR whose slices are all Workhorse gets a Luna Sidekick.
5. Every Workhorse packet pins inputs, commands, output file, and done condition, and the parent verifies the artifact, not prose.

## Decisions

Each row is a default with its rationale. Strike or change any row before review closes.

| # | Default taken | Rationale |
|---|---|---|
| D1 | **Owner hub model, confirmed 2026-09-27.** Planning keeps its existing admission (`plan-implementation/SKILL.md:15-18`: reviewed design or an admitted repository improvement). Main writes the plan, cutting slices and recording each slice's tier (C2). Before returning `ready`, Main reviews the draft under C4 (with the project's 🦉 Advisor only if the owner already requested one) and answers every point. Main then hands the plan and the delegation to the implementation 🐒 Sidekick. The Sidekick does not author or re-cut the plan. `plan-implementation`'s completion check gains "every Workhorse slice passes C1" and "C4 review done or skipped with a reason". | Owner, 2026-09-27: "usually main makes implementation plan. then advisor should review." The review must precede `ready` because a ready plan is immutable (`canonical-implementation-plan.md:37`). Closes F4 with a named owner and method. |
| D2 | **Retired by owner, 2026-09-28 (r11).** Luna's span follows the role tables in the catalog (D18), where Worker Luna xhigh and Sidekick Luna xhigh and max take Local or Cross-domain. C1 no longer states a span. | Owner catalog decisions, 2026-09-28. |
| D3 | The Workhorse tier is the default for work that passes C1. Escalation happens on evidence (a boundary stop, a failed check, a missing fit condition, or a span or direction outside every Luna row), and the reason is recorded. | Evidence 1 to 3; prior art's escalate-on-evidence cascades; r12 drops "a named cross-domain need", which D18 now fits with Luna xhigh. |
| D4 | A Luna boundary stop returns to Main as a plan defect; Main re-slices or re-tags with a reason. It is not silently re-run on a bigger model, and the Sidekick does not re-cut it. | Evidence 2: the stop is information about the plan. |
| D5 | Workhorse-fit work runs on Luna: native on Codex, and through agent-router on Claude Code and Cursor, which have no native Luna. The native Daily-driver Worker rows follow D18 (Claude Code Opus medium; Cursor Grok 4.6 medium or Opus medium; home Cursor Grok 4.6 medium only). Sonnet and Haiku are never selected on any host. | Owner, 2026-09-27: "i dont think we will use sonnet or haiku we can use agent router and luna". Evidence 4. Consistent with the 09-25 D163 route "no native row → agent-router with Luna". |
| D6 | **Retired by owner, 2026-09-28 (r11).** Luna medium stays for Exact · Local Workers; Luna medium finished 25 of 26 logged sessions and is faster. Operators keep medium and high. | Owner, 2026-09-28; log audit. |
| D7 | The catalog carries a dated cost snapshot (source and date, relative ratios, "about an order of magnitude"), not a benchmark claim. | Keeps the existing "do not claim universal benchmarks" rule true while giving the why. |
| D8 | Contract C3, the Workhorse packet, lives in `manage-agents/references/agent-job-packet.md`. Its VERIFY, TIMEBOX, REPORT, and closed-label fields come from the pstack comparison (agreed with its author); the no-discovery sentence comes from a blind replay Worker that ran work-home discovery, searched the board topic holding the outcomes, and was stopped by Codex auto-review (2026-09-27). | The best audit-partition packets and the September Operator failure logs (wrong worktree, command drift, summarized proof, early terminal, stale head) name the same five pins. |
| D9 | A long agent-router Workhorse turn starts as `conversation create` then `message send`, with the parent waiting on the output file; `conversation prompt` fits short turns or takes an explicit `--timeout-seconds` sized to the work. Its default (300 s) cancels the remote turn rather than detaching. | Logged at `memory-logs/skills/log/2026-09-26-router-prompt-timeout-cancels-long-turns.md` (7 cancelled turns across two sessions; the log's own follow-up asks manage-agents for exactly this). |
| D10 | **Owner accepted 2026-09-28.** The researcher keeps the ordered source-class walk (09-23). Inside one source class, a corpus that splits into independent units (many session logs, many repositories or services) may fan out one Luna 🛠️ Worker per unit under the 09-25 pre-authorization; the researcher cuts the units, verifies each result's decisive anchors, and keeps the one ledger. Recommended: accept. | This research's own route (280 MB of transcripts, three Luna digests) versus the 09-23 decision, which removed one lane per *source class*. The addition fans out *units of one class*, never classes. It changes an owner decision three days old, so the owner decides. |
| D11 | `plan-improve-repo` delegates audit work by **evidence unit**: after recon, Main cuts each selected category into independently bounded units (one owner, one question, pinned paths) and gives each unit that passes C1 to a Luna 🛠️ Worker; a unit that fails C1 stays in-parent or goes to a Daily-driver Worker. Categories stay the coverage dimensions and their completion returns (`audit-lanes.md:50`). Admission, prioritization, and plans stay with Main. | Proposal review F3: a whole category (security, architecture) is often cross-domain, so it is not itself a Workhorse unit. The 09-25 pre-authorization covers work that already splits into independent units; the cut makes that true. |
| D12 | **Dropped in r4.** Independent review does not fan out. `implementation-review/SKILL.md:28` has the lead read "the complete governing basis and the complete base-to-reviewed diff yourself", which is what makes it independent. The 30/34 Luna partition successes were audit hunts supervised by a Sidekick, which run 5 covers. | Current source; evidence 1 re-read. |
| D13 | **Ran 2026-09-27; result below.** Proof is static plus a **blind unit-level replay** of C1. Corpus: the 29 frozen pre-dispatch briefs of one test-hunt wave (`agent-studio-worktrees/test-hunt/tmp/test-hunt/fix/wave1/units/u001-brief.md` to `u029-brief.md`). A Luna 🛠️ Worker classifies each brief under C1 from the brief alone (fit, miss with the condition, or unknown), with no outcome files in its inputs. Main then compares with the recorded outcomes (`validation.tsv`, `editor-reports/`) and reports agreements, disagreements, missing inputs, and stops caused by external gates. No result is required in advance. | Proposal review F6: sessions bundle several units, digests lack briefs, and a prediction made after reading outcomes proves nothing. A session-level replay on 2026-09-27 left 17 of 29 Luna rows unknown for exactly that reason. |
| D14 | One PR, one minor version bump (2.65.0 to 2.66.0) across every version surface, one changelog entry. | Runs share C1 and C2. |
| D15 | Main is the only contact for the Advisor and the Reviewer. A correction goes back to the Reviewer through Main. | Owner direction, 2026-09-27. Mostly existing (`orchestrator-implementation-goal` step 5); the re-review handoff at `goal-contract-and-routing.md:78` is made explicit. |
| D16 | A PR's Sidekick tier and execution follow the plan's slice records and dependency edges (`manage-agents/SKILL.md:118`: "Different files are not proof of independence"). See the D16 table below; its shipped home is the `manage-agents` Commission section (F7). The executor never infers independence from the tier. | 09-20 efficient-delegation: no supervisor-of-supervisors, coupled work stays with its executor. Uses the existing Luna Sidekick rows (09-23). |
| D17 | Main reviews its own draft plan under C4. If the project has an 🦉 Advisor (the owner requested one), Main includes it and answers each of its points; Main does not create an Advisor for plan review. The Advisor advises and never approves: Main records take or decline, with a reason, and owns the plan. A compact plan (one low-risk owner, one or two proof gates) may skip C4 with the reason recorded. | Owner, 2026-09-27: "the main agent does review (advisor if the project has one can help)"; "implementation plan … done by main agent with or without advisor". Keeps `manage-agents:15` (Advisor only on owner request) unchanged and `design-phase-not-sidekick-author`'s "never an approval gate" true. |
| D18 | **Owner catalog, 2026-09-28 (r11).** Role tables in `model-catalog.md`: Worker: Luna medium Exact·Local; Luna high Complete·Local; Luna xhigh Complete·Local/Cross-domain; Sol medium Complete·Cross-system; Opus medium Partial·Cross-domain/Cross-system. Sidekick: Luna high Complete·Local; Luna xhigh and max Complete·Local/Cross-domain; Sol medium Complete·Cross-system; Opus medium and high Partial·Cross-domain/Cross-system. Horizon: a 🛠️ Worker's is its job; a 🐒 Sidekick's is one PR. A Luna Sidekick carries context across its PR but makes no choice that later slices depend on: every such choice is already in the plan, and needing a new one is a plan defect for the Lead. An Opus Sidekick may make local choices later slices build on and records each (Main's default, flagged in the PR; owner, 2026-09-28: "with workhorse and luna sidekick horizon might be different no?"). Long-horizon Sidekick work is not in use, so Luna max shares Luna xhigh's band and Opus high shares Opus medium's (owner, 2026-09-28: "horizon is for sidekicks … we not in a stage where im gonna have long horizon task to a sidekick"). Daily driver = everyday judgment models, and the Lead usually runs one at the owner's pick: Opus medium/high, Sol medium/high, Grok medium/high; Opus low and Sol xhigh leave the catalog. Review: Grok high is the usual pick (a third lineage), still subject to the different-lineage rule, so it never reviews Grok-authored work; Astra high, Sol high, Opus medium/high; gated Astra xhigh, Opus xhigh, Fable high. Advisor table unchanged. Native Claude Daily-driver Worker becomes Opus medium. The Operator bright line adds "could a script do it? Then it is Operator work, or write the script and give it to one Operator". | Owner, 2026-09-28, across this thread and a Cursor thread ("luna medium/high is for local span worker only", "luna xhigh complete local/cross domain", "daily driver is opus medium or high", "sol medium can be a daily driver i doubt ill ever use opus low", "i use grok for certain types of work … as a lead", "usually grok for review as its different lineage grok high"). Sol medium Complete·Cross-system fills the one band no other row covers. |
| D19 | The catalog gains a **jobs inside a PR** table for the Lead's planning: implementation slices (🛠️ Worker: Luna medium for an exact recipe in one domain, high for a fixed approach with local choices, xhigh for a fixed approach across domains; coupled slices stay with the Sidekick per D16); evidence jobs (Worker: Luna medium to sweep one unit, high to classify with a fixed rubric); monitoring and procedures (🔧 Operator, Luna medium: suites, CI watches to terminal, PR wrap-up checks, scripted transforms); diagnosis (Worker Luna high or xhigh in one domain, Daily driver across systems); independent review (a different-lineage reviewer, usually Grok high, never Luna). Thinking level follows the job's guidance and span; horizon follows its role (Worker or Operator: the job; Sidekick: the PR; Lead: stacks). Luna max shares xhigh's band, kept for a Luna Sidekick carrying a long PR. | Owner, 2026-09-28: "a pr is a number of jobs or tasks. some are work some are monitoring etc how they decompose in horizon? thats how we know which luna thinking works for what." Main's default, flagged in the PR. |
| D20 | **Three task signals** (owner, 2026-09-28): direction (Guidance), complexity (Architectural span), and horizon. This replaces the 09-23 rule that Guidance and span are the only signals. Escalation off Luna happens only when a signal forces it: Partial direction goes to Opus; Cross-system span goes to Sol medium when the approach is fixed and to Opus when it is open; a Sidekick whose later slices rest on a local choice the plan leaves open goes to Opus. Opus high is an escalation on evidence within Opus's band, not a default. When Opus implements, the reviewer is another lineage (Grok or Astra). | Owner, 2026-09-28: "and when we really need to use sol medium or another opus?"; "along with complexity. so its complexity (cross-domain), horizon, direction." |

### D16 table

| PR's slices | Sidekick | What the Sidekick executes itself | What goes to Luna 🛠️ Workers |
|---|---|---|---|
| all Workhorse, and every choice a later slice depends on is written in the plan | Luna | every slice, directly | nothing by default; the benefit test at `manage-agents/SKILL.md:79` still governs any child |
| mixed tiers, or a later slice depends on a local choice the plan leaves to the Sidekick | Daily driver (Opus) | Daily-driver slices, and every Workhorse slice the plan does not mark independent | Workhorse slices the plan marks independent (no `requires` or `serial` edge to in-flight work, disjoint writes, own proof), when the benefit test holds |
| all Daily driver | Daily driver | every slice | nothing by default |

### D13 replay result (2026-09-27)

A Luna xhigh 🛠️ Worker classified the 29 wave-1 briefs from the brief text alone (its first attempt ran work-home discovery and searched the board topic holding the outcomes; Codex auto-review denied it, and a correction restarted it blind). Main compared the predictions with `validation.tsv` and the editor reports:

| | recorded PASS (22) | recorded STOPPED (7) |
|---|---|---|
| r8 C1 predicted fit (28) | 22 | 6: u006, u010, u011, u015, u019, u027 |
| r8 C1 predicted miss (1) | 0 | 1: u023 (span: 20 call sites) |
| `needs_seam = yes` in outcome-annotated `units.tsv` (6) | 0 | 6: u006, u010, u011, u019, u023, u027 |

The r8 test caught 1 of 7 stops. Six of the seven final stops were classified in `units.tsv` as missing or incompatible production seams; that file is annotated with outcomes and no pre-dispatch snapshot was found, so the flags are not shown to be predictions. u015 stopped on proof strength (the replacement proof would not cover review-ID preservation). The six editor explanations (for example u011: the named wait observes clock continuations, not deadline-handler completion) are the evidence for condition 4. A brief can read as local while resting on a seam that does not exist at its base, so r9 adds C1 condition 4. Re-running the same blind replay with condition 4 is the implementation-stage proof: the prediction must come from the briefs and a source check at each unit's pinned historical base commit (the briefs name mutable `origin/main`), not from outcomes. The Worker's "span: 20 call sites" for u023 is its classification, not a rule; span is decided by domains (`manage-agents/SKILL.md:73-77`), not count.

## Contracts

### C1. Workhorse fit

Home: `manage-agents/references/model-catalog.md`, new section after Categories.

> **Workhorse fit.** A 🛠️ Worker or 🐒 Sidekick unit fits the Workhorse tier when a Luna row in its role table matches its Guidance and Architectural span (Complete direction here means the approach is already fixed); a 🔧 Operator procedure fits when it is prescribed (Exact steps, no judgment; the Operator table's Luna rows apply at any span). Either way it has:
> 1. **Pinned inputs**: the files, paths, head, corpus slice, or brief are given, not discovered.
> 2. **A checkable output**: a file, a test or check result with its exit code, or a diff within declared paths.
> 3. **A named stop**: the packet says what to do at its boundary, which is to stop and return, not to widen.
> 4. **Its seams exist**: every seam, signal, event, or API the unit relies on already exists at its base and supports the observation the unit needs, checked in source by the planner, not assumed from the brief or from a matching name. A unit that needs a new seam gets a contract slice first, or goes to the Daily-driver tier.
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

> Main reviews the draft plan against its governing basis and the current-source anchors it cites; when the project has an 🦉 Advisor, Main sends it the same inputs. Each review returns points, each with a plan anchor, the problem, and a suggested change. It checks: every Workhorse slice passes Workhorse fit and every other slice names the condition it misses; the throughput checkpoint is filled and each slice marked independent really has disjoint writes and its own proof; no slice crosses a boundary or needs a seam the plan does not name; every obligation has fitting proof; no slice bundles independent units. Main records take or decline, with a reason, for every point and revises the draft; with an Advisor, changed slices go back to it once. The Advisor's agreement is not required to proceed; Main owns the plan and its `ready` result. The review is done when every point has a disposition.

## Runs

Each run names one skill. Anchors are at base `c08ab7af`. The Consumer disposition table is the complete edit list.

### Run 1: `manage-agents` (owns C1 and C3)

- **Surfaces:** main path (Select an agent, Runtime, Waiting), depth (`model-catalog.md`, `agent-job-packet.md`, `native-providers-claude.md`, `native-providers-cursor.md`).
- **Changes:** add C1 and the dated snapshot to `model-catalog.md`; narrow the Luna Worker and Sidekick span cells to Local and drop Luna medium from the Worker table (D2, D6); add C3 to `agent-job-packet.md`; in the benefit test, say that a plan slice carrying C2 already is the brief; `native-providers-claude.md` and `native-providers-cursor.md` add a Workhorse 🛠️ Worker row routed through agent-router on Luna next to their unchanged Daily-driver rows (D5); Waiting adds the long-turn route (D9); the Commission section becomes the runtime home of the D16 staffing table (F7); Advisor rules stay as they are (D17).

### Run 2: `plan-implementation` (owns C2 via `canonical-implementation-plan.md`)

- **Surfaces:** main path steps 2 to 4, depth (`slice-and-proof-design.md`, `canonical-implementation-plan.md`).
- **Changes:** each slice records C2; the plan records a throughput checkpoint, each item kept with `n/a: <reason>` rather than dropped: **choices later slices depend on** (each one written into the plan, or named as left to an Opus Sidekick with the reason; this sets the PR's Sidekick under D16), blocking first steps, independent workstreams (disjoint files, services, or layers), shared mutable state (split the target before serializing), and the smallest safe decomposition (if one worker is best, say why); a shared-write check is what earns a slice the "independent" mark D16 dispatch relies on; a slice that bundles independent units is split (evidence 3); a slice that would cross a boundary is split at that boundary or tagged Daily driver with the reason (evidence 2); required plan fields add the executor record; a new step before `ready` loads C4 (`IF the plan is a full plan, MUST load references/advisor-plan-review.md and return every point's disposition; IF compact, record the skip reason`); the completion check adds "every Workhorse slice passes C1" and the C4 result (D1, D17).

### Run 3a: `orchestrator-implementation-goal`

- **Changes:** the planner performs C4 before `ready` and the orchestrator consumes the ready result, with no duplicate orchestrator review step; at commission, Main picks the Sidekick's tier from the plan's slice records per the D16 table; `SKILL.md:14`, `:29` and `references/goal-contract-and-routing.md:42,44` cite the D16 table in place of "directly by default" and the bare benefit gate; a Workhorse boundary stop returns to Main as a plan defect (D4); `goal-contract-and-routing.md:78` names Main as the handoff to re-review (D15).

### Run 2b: `plan-handoff`

- **Changes:** `SKILL.md:19`: the carried obligation-to-slice-to-proof mapping includes each slice's C2 record.

### Run 3c: `orchestrator-design`

- **Changes:** `SKILL.md:78`: after a ready plan, the commission cites the D16 staffing table in `manage-agents` in place of restating direct execution.

### Run 3b: `implement-plan`

- **Changes:** dispatch follows the slice's C2 record and D16; `SKILL.md:14` and `references/execution-and-proof.md:34` stop saying "native Worker" and route through `manage-agents` for the host's Workhorse route (D5); a Workhorse boundary stop is a `plan-defect` return, not a local re-cut (consistent with `execution-and-proof.md:38`).

### Run 4: `practices-research`

- **Changes:** `SKILL.md:8` and `:24` keep the ordered walk and the researcher's ownership. One added branch at step 4: IF a selected source class's corpus splits into independent units too large to read in one pass, cut it into per-unit inputs and give each unit to a Luna 🛠️ Worker under C3; verify each result's decisive anchors before it enters the ledger. `references/lane-packets.md:3,18` gain the same one clause; "source classes do not create separate packet or result files" stays true, since unit outputs are raw notes the ledger already allows (`evidence-ledger.md:55`).
- **Kept:** one researcher, one ordered walk, one ledger, claim labels, null results, verification, the countercheck.

### Run 5: `plan-improve-repo`

- **Rewrite:** `SKILL.md:55,66,143` and `references/audit-lanes.md:3,5,39`: categories stay in-parent coverage dimensions; after recon, Main may cut a category into independent evidence units and give each C1-passing unit to a Luna 🛠️ Worker under C3; the "one bounded question" packet at `audit-lanes.md:7-27` becomes the unit packet (D11). `improvement-plan-template.md` carries the C2 record for each slice (the skill is a C2 producer).
- **Kept:** `:56-57` (candidates are not truth; Main re-opens cited files; Main admits, prioritizes, and authors every plan); `audit-lanes.md:50` category completion.

### Run 7: `practices-collaboration`

- **Changes:** `SKILL.md:14`'s entry step ("before other work, MUST load `references/work-home-discovery.md`") applies to Main and 🐒 Sidekicks. A bounded 🛠️ Worker or 🔧 Operator uses the packet and work reference it was given and returns to its assigner; it does no discovery. `:32` already covers its trace and posting.

### Run 8: `practices-show-me-your-work`

- **Changes:** `SKILL.md:14`'s entry step gets the same role exception, so a bounded Worker or Operator never loads `practices-collaboration` for discovery before reading its packet. Main and Sidekicks keep discovery and trace.

### Run 9: ship prep

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
| 4 | `practices-research/SKILL.md:24`, `references/lane-packets.md:3` | serial source-class walk | rewrite (D10 accepted): add the in-class unit branch; the serial walk stays |
| 5 | `plan-improve-repo/SKILL.md:55,66,143` | "in-parent by default"; `deep` delegates only under the predicate | rewrite per D11 |
| 5 | `plan-improve-repo/references/improvement-plan-template.md:40-56` | slice fields without an executor | rewrite: each slice carries the C2 record |
| 5 | `plan-improve-repo/references/audit-lanes.md:3,5,39` | "never a flow default"; "category count does not satisfy the predicate"; "Do not turn the category list into a default swarm" | rewrite per D11: categories stay coverage dimensions; Main may cut a category into C1-passing evidence units for Luna Workers. Each Worker returns its unit's anchors, candidates or null result, and limits; Main combines unit returns into the category completion at `:50`. |
| 3c | `orchestrator-design/SKILL.md:78` | commissions after a ready plan and restates direct execution | rewrite: cite the D16 staffing table in `manage-agents` |
| 2 | new `plan-implementation/references/advisor-plan-review.md` | none | create: C4 |
| 2 | `plan-implementation/SKILL.md` step 7 (before `ready`) | returns `ready` with no plan review | rewrite: `IF the plan is full, MUST load references/advisor-plan-review.md and return every point's disposition; IF compact, record the skip reason` |
| 5 | `plan-improve-repo/SKILL.md:103-109` | writes a ready improvement plan with no plan review | rewrite: a full improvement plan runs C4 through `plan-implementation`'s reference before `ready`; a compact one records the skip reason |
| 2 | `plan-implementation/SKILL.md` Plan the Change completion and step 4 | slice checks; no fit check | rewrite: "every Workhorse slice passes C1" after either admissible basis (D1) |
| 2 | `plan-implementation/SKILL.md:38` | ready record → `implement-plan` → commission | cite: the ready record carries C2; no new gate (D1) |
| 1 | `manage-agents/SKILL.md:94-96` (Commission an implementation 🐒 Sidekick) | commission per planned PR assignment; no staffing table | rewrite: install the D16 staffing table here as its one runtime home; every other site cites this section |
| tests | `…/manage-agents/design-phase-not-sidekick-author.md:29,31,40` | an Advisor is never an approval gate | keep: C4 keeps it true |
| tests | `…/manage-agents/persistent-vs-single-assignment.md:66-68`, `pattern-selection-unnamed.md:19-27` | an Advisor exists because the user asked; a one-time opinion is not an Advisor | keep: C4 uses the project's Advisor only when the owner already requested one |
| 7 | `practices-collaboration/SKILL.md:14` | "before other work, MUST load `references/work-home-discovery.md`" for every qualifying task | rewrite: Main and Sidekicks only; a bounded Worker or Operator uses its supplied packet (F8) |
| 8 | `practices-show-me-your-work/SKILL.md:14` | "before other work, MUST load `practices-collaboration`" | rewrite: same role exception (F8) |
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
- **Claim ceiling:** "drafted from user intent; r8 C1 replayed blind on 29 logged unit briefs; r9 condition 4 not yet evaluated; behavior not evaluated."
- **Structural proof:** `pnpm --dir tests/skills test` and `pnpm --dir tests/skills typecheck` pass. Every C1 and C3 citing site names its home by exact path. `rg -i "sonnet|haiku"` over `plugins/shravan-dev-workflow/skills` returns no routing rows.
- **Replay (D13):** blind unit-level classification of the 29 wave-1 briefs, then Main's comparison with recorded outcomes. The 28 Sol entries stay candidates, not demonstrated Luna successes.
- **Security:** no script, hook, asset, or network surface. The ship step's plugin reinstall is the standard cache refresh: `allowed`, at ship only.

## Coordination

- **Work thread:** topic "Workhorse-first decomposition and breakdown topology" (`01a0e83f-1023-71c2-94c4-c546305adbed`), coordination root `01a0e83f-326f-7bc2-b39b-a494da4b4de9`.
- **Every agent loads `skills-creation`:** the implementation 🐒 Sidekick, every 🔎 Review Sidekick, any 🦉 Advisor, and every 🛠️ Worker on this work loads the `skills-creation` skill at the start of its assignment, and each packet says so. Owner, 2026-09-28: "advisor and all agents working on it should load the skill creation skill".
- **Reviewer:** GPT-6 Astra high 🔎 Review Sidekick, different lineage, no author history, for proposal and implementation review. Owner, 2026-09-28: "the specs and skill should be written 5.5 and reviewed by a astra advisor high"; the independent Review Sidekick role is kept because `skills-creation` review requires no author history, which an Advisor working with Main would not have.
- **Advisor and proposal reviewer are one agent (owner-authorized deviation):** the GPT-6 Astra high session `01a0e2a0-6835-7171-9512-410133d40c29` advises Main on both specs and runs their proposal reviews. Owner, 2026-09-28: "it can be the same agent that advises and reviews for now". Its advice gives it authoring context, which `skills-creation` proposal review normally excludes; the implementation review therefore goes to a fresh Astra high 🔎 Review Sidekick with no history.
- **Run A-1b (r11): `manage-agents`**, after the Spec B runs and before ship prep: replace the catalog's category and role tables with D18 and add D19's jobs-inside-a-PR table; state D20's three signals and escalation rule where the catalog today says Guidance and span are the only signals; restate C1's lead sentence as above; the Operator bright-line script test; native Claude Daily-driver Worker Opus medium; `native-providers-cursor.md:18` Daily-driver Worker Grok 4.6 medium or Opus medium (Opus low removed; other Opus efforts stay owner-request only); `model-catalog.md`'s escalation sentence per D3 (no "cross-domain need"); the Operator table's C1 branch per F10 with a static walkthrough of an Exact · Local Operator; scenarios that assert the old Luna span, Luna medium removal, Opus low, or Sol xhigh follow D18 (including `sidekick-luna-xhigh.md`, `model-thinking-selection.md`, `luna-background-fix.md`, `owner-authorization-required.md`). A parallel Cursor branch in the main checkout (`feat/manage-agents-catalog-signals`, uncommitted) carries an earlier draft of the same rows; whichever lands second rebases.
- **Implementer:** one Claude Opus 5.5 implementation 🐒 Sidekick (agent-router `claude-local`, the owner's saved default model) writes every run of Spec A and Spec B in full, one commit per run, then the proof. Owner, 2026-09-28: "for skills especially and design i kind of expect another opus model to write it fully". Skill prose is an open-approach judgment task, so it fails Workhorse fit (C1) and goes to the Daily driver. Luna 🛠️ Workers stay on evidence: sweeps, replays, digests.
- **Base:** `origin/main` at `59eec035` (merged into the branch as `fb2f18df`; the specs' line anchors were re-checked after the merge and did not move); first drafted at `c08ab7af`, branch `chore/workhorse-decomposition`, worktree `~/dev/ai-tools.chore-workhorse-decomposition`.
- **Landing:** run 1 first (C1, C3, and D16 table homes), then 2, 2b, 3a, 3b, 3c, 4, 5, 7, 8, and ship prep (run 9) on one branch as one PR (D14).
- **Overlap with the pstack comparison** (`~/dev/ai-tools.chore-pstack-trust-infra/docs/wip/2026-09-27-pstack-vs-ours/reduction.md`, branch `chore/pstack-trust-infra`; recommendation 6, not yet a spec): it targets the same two homes, `manage-agents/references/agent-job-packet.md` and `orchestrator-implementation-goal`. This spec takes the packet fields that overlap C3 (verify, forbidden, report, and timebox as the done condition) and the router long-turn route (D9). The rolling dispatch window and drain loop stay with that later spec. Whichever lands second rebases onto the first.
- **Router timeout:** already logged at `memory-logs/skills/log/2026-09-26-router-prompt-timeout-cancels-long-turns.md`; cite it, do not re-log.
- **Version:** 2.65.0 (already on `main` from #104) to 2.66.0 in the three plugin manifests and both marketplace entries, then the platform validation and readback from `skills-creation/references/platform-mechanics.md`.

## Non-goals

- **Main's model.** The owner chooses Main; nothing here selects or escalates it.
- **Independent review** (`implementation-review`, `spec-program-review`). The lead reads everything itself by design, and review leads stay different-lineage Daily-driver or Frontier models (D12).
- **`debug-investigation`, `skill-audit`.** `debug-investigation` already allows parallel read-only subagents (`SKILL.md:64`); no change unless the sweep finds a conflict.
- **Rolling dispatch window.** Owned by the later pstack spec (Coordination).
- **agent-router plugin.** The `conversation prompt` wait ceiling (already logged) and the stale-host warning belong to that plugin.

## Spec-review record

- **Review 1** (r5, commit `c48a5ed3`): different-lineage 🔎 Review Sidekick, GPT-6 Astra high, agent-router session `01a0e2a0-6835-7171-9512-410133d40c29`, no author history. Checks: mental-model-fit complete, trigger-routing complete, rule-agreement partial (external benchmark figures and the full audit corpus not reverified), depth-coverage complete. Verdict `targeted-revision`, implementation decision `revise-first`, blocker override applies. Accepted F1 to F6 (blockers F4, F5). Rejected: D10's openness as a defect, a blanket no-swarm reading, restoring review fan-out, Sidekick plan repair, raising Operator effort, removing native Daily-driver rows, C3 as an unjustified schema, D9 as fabricated, required pressure runs, one-target violation, a missing Codex marketplace version.
- **r6 remediation** (Main): F1 → C1 restated in Guidance and span, Luna span narrowed to Local (D2); F2 → D16 table; F3 → audit delegation by C1-passing evidence unit (D11); F4 → no new plan review, existing design gate plus a plan completion check (D1); F5 → disposition rows for the commission paths, `AGENTS.md:69`, three ready-plan fixtures, and three more scenarios; F6 → blind unit-level replay (D13) and a narrowed evidence 2. Main also found that the session-level replay's own summary misstated its table (it named c4; the table shows 0 c4 and 20 c5 misses), recorded here as evidence for C3's "verify the file, not the prose".
- **Verification of r11** (same lead): `targeted-revision` for the amendment only (r10 acceptance of other runs stands). F10: C1 had no evaluable Operator branch. F11: the escalation sentence kept "cross-domain need", Cursor native kept Opus low, and Spec B's two-owner example hard-coded a Daily-driver Sidekick. **r12** adds C1's Operator branch, rewrites D3, D5, and A-1b's scope, notes Grok's lineage limit, and fixes Spec B's example.
- **Owner direction** (2026-09-28): "we should define that to make sure lead chunks up work well with implementation". The Lead's planning checkpoint lists choices later slices depend on; pinning them in the plan keeps a PR on a Luna Sidekick, leaving one to the Sidekick makes it Opus (D16 table rows, run A-2).
- **Owner amendment r11** (2026-09-28): D2 and D6 retired; D18 catalog; C1's lead sentence defers span to the table; run A-1b. Owner-settled meaning, so review continues without a new owner decision; the lead verifies the amendment's coherence and consumers.
- **Verification of r10** (same lead): `great`, implementation decision `accepted-to-implement`. F4, F8, F9 closed; no new finding; converged 6, 5, 3, 0 with no recurrence. After acceptance, one pointer edit (the pstack comparison moved to its own worktree) changed no meaning.
- **Verification of r9** (same lead): `targeted-revision`, `revise-first`; F2, F3, F5, F7 closed; F4 residuals open; new F8 (the no-discovery rule sat after the practice entry that runs discovery) and F9 (seam flags claimed as predictions without a pre-dispatch snapshot). Converging: five open became three. r10 aligns D1, run 3a, and the companion note with D17; adds C4's caller rows for `plan-implementation` and `plan-improve-repo`; adds runs 7 and 8 at the practice entry owners; narrows the seam-flag claim; revision-qualifies the claim ceiling; and rebases onto `59eec035`.
- **Verification of r6** (same lead): `targeted-revision`, `revise-first`. F1 and F6 closed technically; F2 to F5 open with residual stale copies; new F7 (the D16 table had no shipped home). Converging: six open findings became five, with no recurrence. The lead holds D2 (Luna Local-only) and D1 (existing design gate, no separate plan review) as owner decisions.
- **r7 remediation** (Main): stale copies reconciled (mental model, `manage-agents:14` row, the removed plan-review row, the owner row, D1's admission alternatives, the category test and unit receipts, the mixed-tier test qualifier); `plan-handoff` and `orchestrator-design` become runs 2b and 3c; the improvement-plan template and the planning completion check join the disposition table; the D16 table gets its runtime home in `manage-agents` Commission (F7). Agreed pstack-audit items added: C3 fields, build-the-lever in C1, the throughput checkpoint and shared-write check in run 2. D1 and D2 go to the owner.
- **Owner answers, 2026-09-28:** "lets go" on a tree that listed D2 (Luna Local-only) and D10 (research unit fan-out) as recommended; recorded as accepted.
- **Owner answer on D1** (2026-09-27): "usually main makes implementation plan. then advisor should review." r8 adds D17 and C4 and rewrites D1; D2 (Luna Local-only) is still pending.
