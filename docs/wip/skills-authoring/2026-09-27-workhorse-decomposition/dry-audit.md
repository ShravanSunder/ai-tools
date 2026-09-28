# DRY audit: workhorse decomposition + breakdown PR

Target: `audit-tree` at `b72e49ca`, base `59eec035`. Paths below are relative to `plugins/shravan-dev-workflow/` unless marked `devfiles:` (worktree `devfiles.chore-workhorse-prompt`) or `tests/`. Line numbers are at `b72e49ca`. Standard: `skills-creation/SKILL.md` (Information Hierarchy :45-88, Leading Words :90-100, deletion test :110, "nothing sits in two homes" :247).

## 1. Verdict

**Slop: yes.** The owner's claim holds. Four findings back it:

1. **Overfit to model names, and the r16 fix exists only on paper.** The r16 spec (D35, `docs/wip/.../2026-09-27-workhorse-decomposition/spec.md:529-543`) lists the violations, but at `b72e49ca` none of them is fixed. The last two commits (`63cd9b93`, `b72e49ca`) changed only the spec.
2. **Text grows by accretion.** The PR adds a net +199 lines and about +4,900 words to runtime files. r14's net-deletion rule was supposed to prevent this. Per-file word growth: `slice-and-proof-design.md` +654, `model-catalog.md` +622, `canonical-implementation-plan.md` +603, `plan-review.md` +581 (new file), `manage-agents/SKILL.md` +557, `plan-implementation/SKILL.md` +309.
3. **The same rule is written in 3 to 9 homes.** One example: "Operator uses Luna medium" appears in 9 places (section 2).
4. **Leading words are coined and then re-explained at every use.** The words that could replace the long forms (Workhorse, escalation, review scope) are used inconsistently.

### Headline counts

| Measure | Count | Basis |
|---|---|---|
| Repeated facts (one rule in two or more homes) | **22 facts, 69 extra copies** | §4 |
| Sentences that fail the deletion test | **36** (31 added or edited by this PR) | §5 |
| Model-name sites | **28 policy lines** in runtime rules name a model: 15 outside the catalog and routing pages, 13 catalog policy lines. Runtime occurrences grew from 91 at base to 117 at HEAD. "Luna" grew from 23 to 55. At base, model names lived only in 8 `manage-agents` files. The PR spreads them to 7 more files. In tests, 22 changed files carry about 95 occurrences. | §2 |
| `SKILL.md` material that belongs in a reference | **7 items**, plus 2 all-run obligations hidden behind call sites that don't return them | §6 |

### Worst single evidence

`manage-agents/SKILL.md:14` said "A Workhorse Sidekick answers short status checks" at base. The PR changed it to "A 🐒 Sidekick on Luna answers short status checks". That is a tier word regressed into a model name, in a rule.

## 2. Model information map

### Where "which model, lineage, or effort serves a role or tier" is stated today

| # | Home | Lines | What it states |
|---|---|---|---|
| M1 | `model-catalog.md` Categories table | 17-32 | tier × lineage × effort, plus the owner-authorization mark |
| M2 | `model-catalog.md` Choose by job | 36-46 | role → effort band on Luna. The escalation rule names Sol medium, Opus medium, and Opus high. |
| M3 | `model-catalog.md` examples, Workhorse fit, Complete when | 50-71, 75, 80, 82, 120 | "Luna effort" column, "never Luna", "Luna max…", "leaves Luna…" |
| M4 | `model-catalog.md` Lineage families | 84-91 | family → model names |
| M5 | `model-catalog.md` Review Sidekick and Advisor tables | 93-118 | role → lineage × effort |
| M6 | `manage-agents/SKILL.md` Runtime | 94, 96 | fallback "agent-router with Luna" (stated twice); generation list GPT-6 (Luna, Sol, Astra), Opus 5.5, Fable 5.x, Grok 4.6; exclusions gpt-5.x, Codex 5.3, Opus 5, Sonnet 4.x, `-fast` |
| M7 | `manage-agents/SKILL.md` Staffing and Authority | 14, 90, 109, 111, 112 | "Sidekick on Luna", "Luna 🛠️ Workers", "any slice off Luna" |
| M8 | `native-providers-claude.md` Models table | 15-19 | Workhorse Worker → Luna via agent-router; Daily-driver Worker → Opus medium; Operator → Luna |
| M9 | `native-providers-codex.md` Models table and example | 11-12, 18, 41 | Worker → Luna or Sol; Operator → Luna; `<resolved Luna id>` |
| M10 | `native-providers-cursor.md` Models table | 17-21 | Workhorse Worker → Luna; Daily-driver Worker → Grok 4.6 medium or Opus medium; Operator → Luna; "Other Opus efforts and Fable only on owner request" |
| M11 | `acpx-provider-codex.md` | 7, 13, 20, 50 | "GPT-6 Luna, Sol, and Astra" examples; `<resolved Luna id>` twice; a "select from Choose by job" pointer |
| M12 | `acpx-provider-cursor.md` | 9, 15, 17 | "Use it for Grok 4.6"; example ids (Grok, Opus 5.5, Fable 5.x); a "select from Choose by job" pointer |
| M13 | `acpx-provider-claude.md`, `acpx-legacy.md` | 7, 21; 22-24 | Fable and Opus wrapper mechanics; lineage → provider (pre-existing, legitimate routing) |
| M14 | Rules outside `manage-agents` | `canonical-implementation-plan.md:98`; `plan-implementation/SKILL.md:34`; `slice-and-proof-design.md:31,36`; `audit-lanes.md:5`; `improvement-plan-template.md:43,45`; `practices-research/SKILL.md:25`; `agent-job-packet.md:31`; `README.md:128` | "leaving Luna", "Luna failed", "Luna 🛠️ Worker", "every job on Luna" |
| M15 | `devfiles:dot_config/agent-context/model-map.md.tmpl` | 3, 9-11, 17-19, 27-32, 37-41, 48-52 | host × role × tier → lineage + effort + id. Line 3 restates the Runtime fallback rule and adds "Workhorse work never uses Sonnet or Haiku", which r14 D26 had deleted from the provider pages as redundant. |
| M16 | `devfiles:shared/my_agents.md:65` (Model tiers) | 65 | Restates tier policy: the cost ratio, the recorded-reason rule and its three reasons, the three signals, the horizon definition, and "size decides slicing". |
| M17 | `tests/` scenarios and fixtures | 22 files, about 95 hits. For example, `tests/.../manage-agents/model-thinking-selection.md` (12) and `orchestrator-design/authors-not-sol-executor.md` (12). | Scenario criteria phrased in model names |

### Duplication, fact by fact

| Fact | Homes stating it |
|---|---|
| Operator → Luna medium | catalog:40, catalog:68, native-claude:19, native-codex:12, native-cursor:19, model-map:11, :19, :30, :39. **9 homes.** |
| Workhorse Worker → Luna high/xhigh | catalog:41, native-claude:17, native-codex:11, native-cursor:17, model-map:9, :17, :27, :37. **8 homes.** |
| No native Luna → agent-router | SKILL:94, SKILL:96 step (3), native-claude:17, :19, native-cursor:17, :19, model-map:3 and 6 row cells. **7+ homes.** |
| Daily-driver model choice | catalog:23-28 (Opus, Sol, and Grok at medium and high), catalog:46 (only Sol medium and Opus medium/high), native-claude:18 (Opus medium), native-cursor:18 (**Grok 4.6 medium**), native-codex:11 (Sol), model-map:10, :18, :28-29, :38. **These conflict:** the Cursor native Daily-driver Worker is Grok, a route the escalation rule at catalog:46 never names. That conflict is a direct product of multiple homes. |
| Current-generation / never-older / never `-fast` rule | SKILL:96 and model-map:3 |
| Owner-authorized rows | catalog:15, :30-32, :102-104; native-cursor:21; model-map:31-32; SKILL:12; my_agents:65 |
| Effort policy | catalog band table :38-42; native-codex:18 ("allowed combinations … Choose by job"); acpx-codex:13; acpx-cursor:17; model-map "Luna (high, xhigh)" and "Luna medium" in every host section. The machine map claims at :3 "this file owns ids", yet carries effort policy. When r15 changed the Operator effort, model-map rows had to change in lockstep (the `main...HEAD` diff shows it). |

The r16 D35 rule would still allow model names in four homes: catalog tables plus a mapping paragraph, the routing pages, the Runtime rule, and the machine map. That is still not DRY.

### Proposed single-source design

**Principle.** Skills, rules, templates, examples, scenarios, and the prompt name only **role, tier, and effort**. Exactly one public table maps a tier to a lineage and a route. The private map holds ids and nothing else.

**One public map.** Put it in `skills/manage-agents/references/model-catalog.md` as a section `## Tier map`. It replaces Categories (17-32), Lineage families (84-91), 🔎 Review Sidekick (93-106), and 🦉 Advisor (108-118), and it absorbs M6's generation list and the three native Models tables. Key: `tier` (or `role` for Review and Advisor, whose selection is lineage-driven).

```text
| key                          | lineage       | efforts                | generation floor | route: Codex | Claude Code  | Cursor              | needs            |
|------------------------------|---------------|------------------------|------------------|--------------|--------------|---------------------|------------------|
| Workhorse                    | OpenAI Luna   | medium, high, xhigh, max | GPT-6          | native       | agent-router | agent-router        | —                |
| Daily driver · fixed approach| OpenAI Sol    | medium                 | GPT-6            | native       | agent-router | agent-router        | escalation reason|
| Daily driver · open judgment | Claude Opus   | medium; high on evidence | 5.5            | agent-router | native       | native if advertised| escalation reason|
| Frontier                     | OpenAI Astra  | high                   | GPT-6            | native       | agent-router | agent-router        | —                |
| Frontier · owner             | Astra xhigh; Opus xhigh; Fable high | —  | as above         | …            | …            | …                   | owner names it   |
| Review                       | Grok high (default: third lineage); Astra high; Sol high; Opus medium, high | … | … | … | … | … | lineage ≠ author |
| Advisor                      | Astra high, xhigh; Opus high, xhigh; Fable high | … | … | … | … | … | owner names it   |
```

(The rows are illustrative, copied from today's content. The Cursor Grok Daily-driver row is today's conflict. The map forces one decision: add `Daily driver · Cursor native → xAI Grok medium`, or drop Grok from native-cursor.)

**Callers consult the map by key, in one sentence.** `manage-agents/SKILL.md:96` becomes:

> **Resolve the exact model id.** Look up the job's key (tier or role) in the Tier map for its lineage, effort, generation floor, and this host's route. Then take the id from (1) the machine map `~/.config/agent-context/model-map.md` row for this host, lineage, and effort, or (2) the host's live advertised list, at or above the generation floor and never a `-fast` variant, or (3) the row's agent-router route. If none resolves, a 🛠️ Worker or 🔧 Operator job uses the Workhorse row through agent-router; a Frontier, Review, or Advisor key reports the gap. Record the chosen id.

**Private, optional overlay.** `devfiles:model-map.md.tmpl` keeps one table per host, `| lineage | effort | id |`, with no Role column, no tier, and no policy prose. Line 3 shrinks to: "Exact ids for this machine. Policy and fallback: `manage-agents` Runtime." Host-specific availability, such as home Cursor offering only Grok, is expressed by which rows exist.

**Without a machine map**, step (2) resolves from the host's live list using the public map's lineage and generation floor. Step (3) falls back to the map's route column. Nothing in a skill changes.

**Routing pages** (`native-providers-*`, `acpx-provider-*`) keep only encoding mechanics: how to pass a model, an effort, history, and access. Delete their Models tables and example model lists. Every `<resolved Luna id>` becomes `<resolved id>`.

**Prompt** (`my_agents.md:65`) names the tiers and points to `manage-agents`. It carries no policy.

Net effect: model names live in one public table plus the acpx Fable wrapper mechanics (M13). Every policy line uses a tier.

## 3. Leading words

| Term | One defining home today | Re-explained in long form at | Replacement |
|---|---|---|---|
| **Workhorse / Daily driver / Frontier** | `model-catalog.md:9-13` | my_agents:65 (cost ratio, reasons); catalog:15 (pre-existing). The word **Luna** stands in for "Workhorse" in 28 policy lines (§2 M3, M7, M14). | Use the tier word bare. "starts on Luna" → "starts on the Workhorse tier". |
| **escalation reason** (today "Leaving Luna") | catalog:46 | canonical:98 (three reasons spelled out); improvement-plan-template:43, :45 (spelled out twice); plan-review:19 ("one of the three"); plan-implementation:34; slice-and-proof-design:31, :36; audit-lanes:5; catalog:82, :120; SKILL:112; README:128; my_agents:65 | Adopt the pretrained word **escalation** ("escalate with a recorded reason"). Define the three reasons once at catalog:46. Everywhere else write "escalation reason". This is shorter than D35's "Leaving the Workhorse tier". |
| **Workhorse fit** | catalog:73-82 | canonical:98 **and** :100 (two pointers in adjacent lines); catalog:75 (a bold "**Workhorse fit.**" under the H2 of the same name); catalog:5, :36, :75 repeat "Every job starts on Luna" 3× in one file; plan-implementation:34, :50; slice-and-proof-design:31, :36, :65, :114; plan-review:19; audit-lanes:5 | One pointer per file. Delete catalog:75's bold and restated sentence, canonical:100, and slice:65's clause. |
| **tier record** | canonical:98 (format) | slice-and-proof-design:31 (format copied verbatim); template:43, :45 (format plus reasons); plan-implementation:34 (restates what a valid record contains); plan-review:19 | Elsewhere write "tier record (canonical)". The template slot becomes `tier: <tier record>`. |
| **job pins** | agent-job-packet:29-31 | agent-job-packet:31 bolds "**Job pins.**" under the `## Job pins` heading; audit-lanes:9 re-lists "(output file, VERIFY, TIMEBOX, REPORT)"; README:128 restates the scope with a model name ("Worker, Operator, and Luna jobs carry the job pins") | Use it bare. Scope: "every Worker or Operator job and every Workhorse-tier job". |
| **horizon (Step / Task / Run / Open)** | SKILL:77-82 | SKILL:84 (restates that the table is keyed by job); my_agents:65 (defines horizon and its four levels again, plus "Role is continuity, not horizon") | Use it bare. Delete SKILL:84 and the my_agents definition. |
| **direction / span** | SKILL:65-75 | SKILL:86 ("Complete direction, unless the plan leaves an approach open (Partial)" restates the Complete test); my_agents:65 ("span (architecture, not size)") | Use it bare. |
| **Staffing** | SKILL:107-112 | The long pointer "`manage-agents` (`../manage-agents/SKILL.md`, Commission an implementation 🐒 Sidekick)" is repeated at SKILL:14, orchestrator-goal SKILL:14, implement-plan:14, README:128, :160, slice-and-proof-design:48, :56 | "Staffing (`manage-agents`)". |
| **benefit test** | **none.** The rule is at SKILL:88 ("Delegate only when … the benefit exceeds briefing, coordination, and verification cost") but is never labeled. | Used as a name at SKILL:41 ("under the benefit test below"), :111, :112 | Bold-label the SKILL:88 sentence as **Benefit test.** and use the term bare. |
| **Choose by job** (section name used as a term 13×) | catalog:34 | SKILL:111, :140; acpx-codex:13; acpx-cursor:17; native-codex:11, :12, :18; catalog:5, :15, :75, :82; README:128 | A heading is not a leading word. Use **effort band** (pretrained, and says what it is). |
| **breakdown** | canonical:11-39 | plan-implementation:10 ("which cuts the work into PR nodes"); plan-improve-repo:10, :103, :106 ("even of one node", which also appears at canonical:13); template:3; README:17, :152 | Pretrained (work breakdown). Use it bare. |
| **executable node** | canonical:39 | orchestrator-goal:12 and goal-contract:62 restate the definition ("a node's base now exists but its plan does not") | Use "executable node" bare. |
| **review scope** | implementation-review:10 | orchestrator-goal:34 ("that PR or stack"), :50 ("every independent PR and every stack layer"); goal-contract:83, :115, :120; implement-plan:32 ("assigned to this PR or its stack"); README:19, :162, :188 | Use "review scope" bare. |
| **integration gate** | canonical:32 (record) plus orchestrator-goal:37 (run rule) | slice-and-proof-design:59, :79; orchestrator-goal:30, :50; goal-contract:91-95, :112, :115 | Keep the two homes. The others say "the breakdown's integration gates". |
| **independent mark** | slice-and-proof-design:48 | SKILL:107 ("never infers independence from a tier"); SKILL:134 and slice:48 both say "different files are not independence" | Keep slice:48 and SKILL:134 (dispatch). Delete SKILL:107's second sentence. |
| **throughput checkpoint** | slice-and-proof-design:38-48 | improvement-plan-template:48-54 re-defines all five items | The template keeps slot labels only. |

## 4. Repeated facts

Each row lists the **home** first, then what to do with each copy (D = delete, C = replace with a one-line citation). "PR" marks a copy added or edited by this PR.

| # | Fact | Home | Copies and disposition |
|---|---|---|---|
| R1 | Main stays the default user conversation; the user may choose direct Sidekick contact; that transfers no authority | `manage-agents/SKILL.md:14` | orchestrator-goal SKILL:8 (keep one clause), :12 D (PR edited), :27 D (both sentences, PR edited), :29 D, :43 D; orchestrator-design:78 D (PR); README:128 D |
| R2 | The goal never writes a plan; a missing breakdown or plan returns `ready-for-planning` | orchestrator-goal SKILL:28 (r14 C9 accepted text) | SKILL:8 "never authors or repairs a plan" keep; :12 D (PR, merged into :28); goal-contract:56-63, three rows → one row (PR); README:132 C; description :3 keep |
| R3 | Tier record format | canonical:98 | slice-and-proof-design:31 C (PR); template:43, :45 → `tier: <tier record>` (PR) |
| R4 | The three escalation reasons | catalog:46 | canonical:98 C (PR); template:43, :45 D (PR); plan-review:19 C (PR); my_agents:65 D (PR) |
| R5 | A Workhorse slice that stops at its boundary is a `plan-defect`; the implementer does not re-cut it | canonical:98 | execution-and-proof:39 D (PR), with the "no bigger model" clause kept at :79-80 (see §8); goal-contract:71-72 D (PR) |
| R6 | Workhorse slices pass Workhorse fit | catalog:73-82 | canonical:100 D (PR); canonical:116 bad signal D (PR); plan-implementation:34 C (PR); :50 D (PR); slice:65 D (PR); slice:114 D (PR). plan-review:19 keep (it is the check). |
| R7 | Plan Home procedure (`.gitignore` `tmp/*`, paths) | canonical:90 | plan-implementation:36 C (pre-existing duplication, which the PR expanded) |
| R8 | The per-plan field list | slice-and-proof-design:3 (Return) | plan-implementation:30 repeats all of it (PR) → C: "return the PR cut and per-plan slice graph named in its Return line" |
| R9 | Review scope: one PR or stack layer; each PR gets its own lead; a stack keeps one | implementation-review:10 | orchestrator-goal:34, :50; goal-contract:83, :115, :120; implement-plan:32; README:19, :162, :188 (all PR) → "review scope" |
| R10 | Stack layer base is its parent PR | canonical:39 | implementation-pr-wrapup:30 "each layer's base is its parent PR" D (PR) |
| R11 | A Worker or Operator skips work-home discovery; its packet is its whole context | practices-collaboration:16 | agent-job-packet:31 "The packet or commission is the job's whole context: … beyond the work reference it names" D (PR); practices-show-me-your-work:14 keep (one-line citation); my_agents:51 keep (always-loaded entry) |
| R12 | A Sidekick dispatches only slices marked independent | slice:48 plus Staffing:112 | SKILL:107 "The Sidekick never infers independence from a tier" D (PR) |
| R13 | PR count follows independence, not owner count | slice-and-proof-design:52-59 | plan-improve-repo:103 (a three-clause restatement) C (PR); :106 "every finding gets a breakdown, even of one node" D (PR; canonical:13 already says it); :10 parenthetical D (PR); template:3 clause D (PR); canonical:84 "One indivisible deliverable is one node" keep |
| R14 | Throughput checkpoint items | slice:40-46 | template:48-54 definitions D, labels kept (PR) |
| R15 | PR description is Workhorse Worker work under Complete direction | implementation-pr-wrapup:40 (dispatch site) | :10 clause D, :28 sentence D, :50 first sentence D (pre-existing ×4; the PR edited 3) |
| R16 | Integration gates pass on recorded heads before delivery readiness | orchestrator-goal SKILL:37, :50 | goal-contract:94, :115 D (PR) |
| R17 | Main assesses each PR (need, design, plan, node, base, diff, proof, complexity) | orchestrator-goal SKILL:30 | goal-contract:74-75 C, :98 D (PR edited both) |
| R18 | The routing table re-walks the delivery loop | orchestrator-goal SKILL:29-37 (steps 3-9) | goal-contract:68-95: rows restating steps 3-9 ("(SKILL.md step 3)", "(SKILL.md step 9)") → one row "ready breakdown and PR plan → Carry the Delivery Loop steps 3-9" (PR added 5 rows) |
| R19 | Plan review is done when every point has a disposition | plan-review:33 (Completion) | :3 sentence 2 D; :7 last sentence D; :31 "Stop when every point has a disposition." D (new file, 3 restatements in 33 lines) |
| R20 | A compact plan skips plan review | plan-review:13 | plan-implementation:37 sentence 3 keep (call-site branch); plan-improve-repo:111 keep; plan-review:13 parenthetical re-defines "compact" (the home is slice:27) → C |
| R21 | Audit delegation goes by evidence unit, never by category | audit-lanes:5 | audit-lanes:3 "the parent owns each one" keep; :44 "The parent owns every category. Do not turn the category list into a swarm." D (PR); plan-improve-repo:55 keep (all-run rule visible in SKILL); :66 "Delegate only evidence units cut under the Core Rules" D (PR) |
| R22 | "Every job starts on Luna" / band floor | catalog:36 | catalog:5 "then match the job's role and signals to its Luna band (Choose by job)" D; :75 D; :44 "Luna never goes below its band" D (the band column already sets the floor); :71 "Luna max is a Sidekick effort only." D (the table row :42 says it); :120 clause "a job leaves Luna only with a recorded reason" D |

Extra copies across R1-R22 total 69.

## 5. Deletion-test failures

Each sentence below can be removed without changing any agent action. It restates a home, repeats a heading, or gives rationale.

| # | Site | Quote | Why |
|---|---|---|---|
| D1 | `manage-agents/SKILL.md:84` | "Horizon belongs to the job, not the role: a 🐒 Sidekick given one slice at a time works at Task…" | The table :77-82 is already keyed by job, and its Task and Run tests count slices. |
| D2 | SKILL:94 (last sentence) | "When the host's native page has no model for the role, use agent-router with Luna; no native stand-in." | Duplicates :96 step (3). |
| D3 | SKILL:107 (sentence 2) | "The Sidekick never infers independence from a tier (Dispatch, below)." | Staffing :112 already dispatches only plan-marked slices. |
| D4 | catalog:5 (sentence 3) | "then match the job's role and signals to its Luna band (Choose by job)" | Restates :36-44. |
| D5 | catalog:36 | "Every job starts on Luna." | Also at :5 and :75. |
| D6 | catalog:44 (sentence 2) | "Luna never goes below its band; work that needs no judgment is 🔧 Operator work." | The band floor is in the table; the Operator test is SKILL:39 and :67. |
| D7 | catalog:71 | "Luna max is a Sidekick effort only." | Table row :42. |
| D8 | catalog:75 | "**Workhorse fit.** Every job starts on Luna (Choose by job)." | Bold duplicates the H2; the sentence is D5 again. |
| D9 | catalog:120 (clause) | "a job leaves Luna only with a recorded reason" | Restates :46. |
| D10 | canonical:100 | "Workhorse fit lives in `../skills/manage-agents/references/model-catalog.md`." | :98 already points there. |
| D11 | canonical:114 (PR additions) | "one ready breakdown per delivery, one immutable plan path per executable PR node" | Restates :13, :39. |
| D12 | canonical:116 (PR additions) | "a slice without a tier record, a Workhorse slice that misses a fit condition, … a plan without its breakdown node and base, a breakdown that records plan paths, PR numbers, or progress" | Restates :94, :98, :104, :13. |
| D13 | agent-job-packet:31 | "**Job pins.**" | Duplicates the `## Job pins` heading at :29. |
| D14 | agent-job-packet:31 | "The packet or commission is the job's whole context: the agent does no work-home discovery or board search beyond the work reference it names" | R11. |
| D15 | orchestrator-goal SKILL:8 | "This skill admits a ready breakdown and the ready plan for each PR it starts, then runs execution, review, and wrap-up." | Description :3 and :12. |
| D16 | orchestrator-goal SKILL:12 | "Main remains the default conversation unless the user explicitly chooses direct contact with an assigned Sidekick." | R1. |
| D17 | orchestrator-goal SKILL:27 | "Main remains the default user conversation. The user may explicitly choose direct contact … In either branch," and "Main does not relay every internal progress turn …" | R1. |
| D18 | orchestrator-goal SKILL:29 | "Direct Sidekick contact remains available when the user explicitly chooses it." / "without automatically moving the user's conversation away from Main" | R1. |
| D19 | orchestrator-goal SKILL:32 | "A missing label alone does not invalidate adequate evidence; …" | Also :44 and goal-contract:36, :98. |
| D20 | orchestrator-goal SKILL:43 | the ownership list restating :8 | R1 and R2. |
| D21 | goal-contract:98 | "The assessment result makes its source-backed inspection … Inspect the original need …" | R17. |
| D22 | goal-contract:114-115 | the `plan-only` and `pr-ready-unmerged` finish rows | R16; SKILL:50 is the completion home. |
| D23 | plan-implementation:36 | the full `.gitignore` and path procedure | R7. |
| D24 | plan-implementation:44 | "A later executable node's caller returns here with `ready-for-planning`." | Describes another skill's behavior; this phase takes no action. |
| D25 | slice-and-proof-design:56 (clause) | "; its Sidekick follows the staffing table in `manage-agents`" | Irrelevant to the PR cut. |
| D26 | slice-and-proof-design:65 (sentence) | "Workhorse fit (…) still applies per slice." | :31, :36. |
| D27 | slice-and-proof-design:114 | "a slice records Workhorse but misses a Workhorse fit condition;" | :36 and plan-review:19. |
| D28 | plan-review:3, :7, :31 | "Return every review point with its disposition…", "The review is done when every point has a disposition.", "Stop when every point has a disposition." | R19. |
| D29 | plan-review:11 | "Use an Advisor only when the owner already requested one for the project; do not create an Advisor for plan review." | :7 conditions on an existing Advisor; manage-agents:15 owns Advisor creation. |
| D30 | audit-lanes:5 (last sentences) | "A security or architecture category as a whole usually leaves the approach open, so it is not itself a Workhorse unit." | "never by category" in the same paragraph. |
| D31 | audit-lanes:44 | "The parent owns every category. Do not turn the category list into a swarm." | :3, :5. |
| D32 | implementation-pr-wrapup:10, :28, :50 | "Description authoring is Workhorse 🛠️ Worker judgment under Complete direction", "Description drafting remains Workhorse Worker work.", "Description is Collection+Synthesis under Complete direction: …" | R15. |
| D33 | plan-improve-repo:106 | "every finding gets a breakdown, even of one node" | :103 and canonical:13. |
| D34 | model-map.md.tmpl:3 | "Workhorse work never uses Sonnet or Haiku; on a host without native Luna it goes through agent-router." | r14 D26 already deleted it; the generation floor covers it. |
| D35 | my_agents:65 | "Workhorse costs about a tenth as much per task, so" | Rationale; the rule that follows carries the behavior. |
| D36 | my_agents:65 | "Every job has three signals: … Role is continuity, not horizon. Size decides how finely work is sliced, never its tier." | Defined at SKILL:65-84 and slice:52. |

D19 is pre-existing. D23, D32, and parts of D20 predate the PR, but the PR edited those lines without cutting them. All the others are PR-added.

## 6. Progressive disclosure

**Detail in a `SKILL.md` main path that belongs in a reference, or should be cut:**

1. `manage-agents/SKILL.md:96`: the generation list and exclusions (GPT-6, Opus 5.5, Fable 5.x, Grok 4.6, gpt-5.x, Codex 5.3, Sonnet 4.x). This is model data in the spine. Move it to the Tier map's generation-floor column (§2).
2. `manage-agents/SKILL.md:116`: agent-router CLI mechanics ("`conversation create`, then `message send` … `conversation prompt` … `--timeout-seconds` … its 300-second default cancels the remote turn"). This is a tool manual. Move it to `agent-collaboration`, which SKILL:98 already loads, if that manual lacks it; otherwise delete.
3. `manage-agents/SKILL.md:109-112`: the Staffing table is branch-only. It applies only when commissioning an implementation Sidekick, and it is model-selection policy. Either keep it and write it tier-only, or move it next to the effort bands in `model-catalog.md` so all tier policy sits in one file. B15 requires only that `manage-agents` owns it; the catalog is part of `manage-agents`.
4. `plan-implementation/SKILL.md:36`: the Plan Home procedure belongs in canonical:90 (R7).
5. `plan-implementation/SKILL.md:30`: an 85-word return list copied from the reference's Return line (R8). Shorten it.
6. `plan-improve-repo/SKILL.md:103`: the node-cut rule belongs in slice-and-proof-design:52-59 (R13).
7. `orchestrator-implementation-goal/SKILL.md:29` (stack sequencing) and `implementation-pr-wrapup/SKILL.md:30` (`gh stack rebase` / `submit`) are branch-only (stacked breakdowns). Keep them as one `IF the node is a stack layer, …` sentence each, or move them to `goal-contract-and-routing.md` and wrapup's `references/github-pr-state.md`.

**All-run obligations that are hidden, because the call site doesn't return them:**

- `manage-agents/SKILL.md:120` MUST-loads `agent-job-packet.md` but returns only "executor, model and effort, history, access, runtime, continuity, and acceptance". The **job pins** (agent-job-packet:31), which every Worker and Operator job must carry, are not in the return. Add "and the job pins" to :120.
- `manage-agents/SKILL.md:90` returns "the Workhorse fit result" but not the **escalation reason**, which catalog:46 requires for any job that leaves the Workhorse tier. Replace it with "return the job's tier, effort, and Workhorse fit result or escalation reason".

**Misplaced decision.** `manage-agents/SKILL.md:140` sets the Sidekick's effort at creation, and a new effort means a new session. That is a selection rule sitting in **Verify**. Move it to Commission, beside Staffing.

## 7. Cut list

Model-name renames follow §2 and §3. "→" means replace with the exact text shown.

**skills/manage-agents/SKILL.md**
- :14 "A 🐒 Sidekick on Luna answers" → "A Workhorse 🐒 Sidekick answers".
- :84 delete.
- :88 prefix the sentence "Delegate only when a child …" with "**Benefit test.**".
- :90 → "MUST load `references/model-catalog.md` and return the job's tier, effort, and Workhorse fit result or escalation reason."
- :94 delete the last sentence (D2).
- :96 → the resolution paragraph in §2.
- :107 delete sentence 2.
- :109 header "What goes to Luna 🛠️ Workers" → "What goes to Workhorse 🛠️ Workers".
- :111 "Luna, effort by Choose by job" → "Workhorse, Sidekick effort band".
- :112 "any slice off Luna with a recorded reason" → "any slice escalated with a reason"; "slices off Luna" → "escalated slices".
- :116 move or delete sentences 4-5 (§6.2).
- :120 add "and the job pins".
- :140 move the effort sentence to Commission.

**skills/manage-agents/references/model-catalog.md**
- Replace Categories :17-32, Lineage families :84-91, Review :93-106, and Advisor :108-118 with the one Tier map (§2). Keep :106's default as the Review row's "(default: third lineage)".
- :5 delete sentence 3.
- :36 → "Every job starts on the Workhorse tier. The role sets the effort band; the job's demanding signals pick the effort inside it."
- :38 header "Luna band" → "Effort band".
- :44 delete sentence 2.
- :46 heading "**Leaving Luna.**" → "**Escalation.**", and "Sol medium (fixed-approach Cross-system work) or Opus medium (open judgment; Opus high on evidence)" → "A Daily-driver key from the Tier map (fixed approach, or open judgment)". Fold catalog:82's "names the missing condition" into the reason: "`judged tough: <missing condition>`".
- :50, :62 column "Luna effort" → "Effort".
- :57, :58 "or escalate with a reason" and "or Sol medium with a reason" → "or escalate with a reason".
- :69 → "| Independent review | Review row of the Tier map; never the Workhorse tier | — |".
- :71 delete.
- :75 delete the bold and sentence 1.
- :82 sentence 2 delete (folded into :46).
- :120 → "Complete when one Tier map key is selected for the job, it needs no owner authorization it lacks, an escalated job records its reason, and the review lineage rule in `SKILL.md` holds."

**Routing pages**
- native-providers-claude:13-21, native-providers-codex:7-14, native-providers-cursor:13-21: delete the Models sections. Keep the Cursor sentence "Treat `agent --list-models` short names as CLI labels…" under Launch.
- native-providers-codex:18: delete sentence 2.
- native-providers-codex:41, acpx-provider-codex:20, :50: `<resolved Luna id>` → `<resolved id>`.
- acpx-provider-codex:7: delete "Examples: GPT-6 Luna, Sol, and Astra ids."
- acpx-provider-codex:13 last sentence → "Use the resolved id and effort (Runtime in `SKILL.md`)."
- acpx-provider-cursor:9: "Use it for Grok 4.6 or any other id" → "Use it for any id".
- acpx-provider-cursor:15: delete the examples sentence.
- acpx-provider-cursor:17 → "Use the resolved id and effort (Runtime in `SKILL.md`). If the effort is unavailable, report that gap; do not silently change effort."

**skills/manage-agents/references/agent-job-packet.md**
- :31: delete "**Job pins.** ". "and every job on Luna whatever its role" → "and every Workhorse-tier job whatever its role". Delete "The packet or commission is the job's whole context: the agent does no work-home discovery or board search beyond the work reference it names, and a 🛠️ Worker or 🔧 Operator keeps no trace." (practices-collaboration:16 owns it.)

**shared-references/canonical-implementation-plan.md**
- :98 → "Every slice records `tier: <Workhorse | Daily driver> · <direction>/<span>/<horizon> · <reason>`. A Workhorse slice passes Workhorse fit; a Daily-driver slice names its escalation reason (both in `../skills/manage-agents/references/model-catalog.md`). The implementer follows the record. A Workhorse slice that stops at a boundary, or an executor that disagrees with its record, returns to the originating planner as a plan defect."
- :100 delete.
- :114, :116: drop the additions quoted in D11 and D12.

**skills/plan-implementation/SKILL.md**
- :30 → "MUST load `references/slice-and-proof-design.md` and return the PR cut and, for each plan, the slice graph with every field its Return line names. A remove row without replacement, redundancy, or dead-contract proof is not a ready plan."
- :34 "every Workhorse slice passes Workhorse fit (`…`), and every Daily-driver slice names its reason for leaving Luna;" → "every slice carries a valid tier record;".
- :36 → "8. Write the breakdown and one plan per executable node at the canonical Plan Home and return their exact paths."
- :44 delete.
- :45 → "- A `plan-defect` returns here through the plan's recorded `originating planner`."
- :50 delete "every Workhorse slice passes Workhorse fit;".

**skills/plan-implementation/references/slice-and-proof-design.md**
- :31 → "Each slice carries its tier record (`../../../shared-references/canonical-implementation-plan.md`)."
- :36 → "- Split a slice that fails Workhorse fit or crosses an assigned authority or contract boundary at that boundary; tag it Daily driver only with an escalation reason."
- :56 delete the clause (D25).
- :65 delete the sentence (D26).
- :114 delete.

**skills/plan-implementation/references/plan-review.md**
- :3 delete sentence 2.
- :7 delete the last sentence.
- :11 delete sentence 2.
- :13 "(one low-risk owner and one or two proof gates, per `slice-and-proof-design.md`)" → "(`slice-and-proof-design.md`)".
- :19 "confirm its reason is one of the three and is real" → "confirm its escalation reason is real".
- :31 delete "Stop when every point has a disposition."

**skills/orchestrator-implementation-goal/SKILL.md**
- :8 delete sentence 2 (D15).
- :12 delete "When the breakdown is missing, or a node's base now exists but its plan does not, end this run with `ready-for-planning`." and "Main remains the default conversation unless …".
- :14 sentence 1 → "Each 🐒 Sidekick's tier and dispatch follow Staffing (`manage-agents`)."
- :27 delete D17's sentences.
- :28 → "Admit either current reviewed design or an evidence-backed repository improvement accepted by `plan-improve-repo`, through its ready breakdown. Without a ready breakdown, or a ready plan for an executable node, end this run with `ready-for-planning`; do not load a planner here. Add no second plan review. A ready `plan-only` result reaches that requested terminal; a ready breakdown with a ready delivery plan continues immediately."
- :29 delete D18's text.
- :34 "for that PR or stack" → "for that review scope".
- :32 delete.
- :43 → "- Each Review Sidekick owns independent review findings and coverage for its review scope. The user owns material design decisions and phase gates. PR wrap-up owns PR gate inspection."
- :50 "a ready review for every independent PR and every stack layer" → "a ready review for every review scope".

**skills/orchestrator-implementation-goal/references/goal-contract-and-routing.md**
- :56-63 → one row: "no ready breakdown, or an executable node without its plan (preserve any plan-improve-repo admission) → end this run with ready-for-planning".
- :68-95 → keep :85-86 (the spec, design, or plan finding row); replace the rest with "ready breakdown and a ready PR plan → SKILL.md Carry the Delivery Loop, steps 3-9".
- :98 delete.
- :114-115 → "- `plan-only` / `pr-ready-unmerged`: as SKILL.md Completion."
- :120 "for every independent PR and every stack layer" → "for every review scope".

**skills/implement-plan/**
- SKILL.md:32 "assigned to this PR or its stack" → "of this review scope".
- execution-and-proof.md:39: delete the bullet.
- execution-and-proof.md:79-81 → "slice, sequence, dependency, collision, write scope, proof mapping, or tier record is wrong, including a Workhorse slice that stops at its boundary; the implementer does not re-cut it or re-run it on a bigger model -> stop at the recorded originating planner".

**skills/implementation-pr-wrapup/SKILL.md**
- :10 "Description authoring is Workhorse 🛠️ Worker judgment under Complete direction; parent gates stay mechanical." → "Parent gates stay mechanical."
- :28 delete "Description drafting remains Workhorse Worker work."
- :30 delete "each layer's base is its parent PR, and".
- :50 delete sentence 1.

**skills/plan-improve-repo/**
- SKILL.md:10: delete "(one node, or one per independent outcome)".
- SKILL.md:66: delete sentence 2.
- SKILL.md:103 sentences 2-4 → "Cut its nodes by the PR cut in `../plan-implementation/references/slice-and-proof-design.md`:".
- SKILL.md:106 → "- one focused plan per node, never a mega-plan".
- SKILL.md:107: drop "; each plan records its breakdown, node, and base".
- audit-lanes.md:5: "goes to a Luna 🛠️ Worker" → "goes to a Workhorse 🛠️ Worker"; "leaves Luna only with a recorded reason (Leaving Luna in the catalog)" → "escalates only with a recorded reason"; delete the last-but-one sentence (D30).
- audit-lanes.md:9: drop "(output file, VERIFY, TIMEBOX, REPORT)".
- audit-lanes.md:44: delete sentence 1 and sentence 2 (D31).
- improvement-plan-template.md:3: drop ": one node, or one per independent outcome, and owner count does not decide".
- improvement-plan-template.md:43, :45 → `tier: <tier record>`.
- improvement-plan-template.md:50-54 → labels with `<… or n/a: reason>` only; drop "(owner: …)" and the item definitions.

**skills/practices-research/SKILL.md:25**: "a Luna 🛠️ Worker" → "a Workhorse 🛠️ Worker".

**README.md**
- :128: drop ", and Worker, Operator, and Luna jobs carry the job pins"; "owns Choose by job (role bands and Leaving Luna), Workhorse fit, and the model tables" → "owns tier policy and the Tier map"; delete the default-conversation clause (R1).
- :162, :188, :19 "per PR, or per stack layer" wording → "per review scope".

**devfiles**
- `my_agents.md:65` → "**Model tiers.** Workhorse, Daily driver, Frontier. A job starts on the Workhorse tier and escalates only with a recorded reason (`manage-agents`). Never escalate Main's model or pick an owner-authorized row unasked. Exact model ids come from `~/.config/agent-context/model-map.md` when present. Know your own model …" (the rest unchanged).
- `model-map.md.tmpl`: per host `| lineage | effort | id |`; delete the Role column, the "Luna (high, xhigh)" policy, and line 3 after sentence 2.

**tests/** (not runtime; for completeness): scenario criteria and fixtures move to tier plus effort per D35. About 95 hits in 22 files. Only id-resolution or routing scenarios keep model names.

### Estimated net change for the PR's runtime diff

Current: +439 / −240 = **+199 lines**, about **+4,900 words**.

The cuts above remove about 75 lines (whole-line deletions: the provider Models sections about 26, the goal-contract rows about 22, catalog tables folded into one map about 19, plus smaller single lines) and about 1,900 words. The Tier map adds about 12 lines.

Result: about **+135 lines and +3,000 words** net, which is roughly −35% of the PR's added prose. `model-catalog.md` alone goes from 120 lines to about 85.

## 8. Behaviors to keep

These accepted outcomes have their only statement in a sentence an aggressive pass might cut. Keep them, or move them with their meaning intact.

- **No bigger model on a Workhorse stop.** `execution-and-proof.md:39`, "…or re-run it on a bigger model", is D4's only runtime statement (spec r14 implementation record). The cut list moves it into :79-81; don't drop it.
- **Classification tie-breakers from review F16.** These are the only statements that close F16:
  - SKILL:68 Complete test: "if several approaches would do and none is named, it is Partial even when their results would be interchangeable"
  - SKILL:73 Local test (500-file rename, two modules of one owner, owner-only storage)
  - SKILL:80 "a final report over several planned slices does not make them one Task"
  - SKILL:82 "Open wins over Task and Run"
- **Owner-requested examples (D31).** The catalog Sidekick and Worker example tables at :48-69 stay. Rename the column; don't delete the rows. The review row at :69 stays in tier form (review D-F1).
- **"Main first fixes the cut"** (catalog:46, D30): write the open choice into the plan, split at the system boundary, or fix the diagnostic approach. Also "a boundary stop is a plan defect instead".
- **Seam fit condition 4 evidence clause.** catalog:80, "checked in source by the planner, not assumed from the brief or from a matching name", backed by the D13 replay.
- **Workhorse Sidekick routes owner conversation through Main.** SKILL:14, "answers short status checks and routes substantive owner conversation through Main". Rename it; don't delete it.
- **Sidekick effort is set at creation.** SKILL:140: a different effort takes a new session (Main's r15 decision). Move it; don't drop it.
- **300-second prompt default.** SKILL:116: "its 300-second default cancels the remote turn instead of detaching it" is a real observed failure. Move it to `agent-collaboration` only if that manual lacks it.
- **Bright-line Operator test.** SKILL:39: "Could a script do it? … or write the script and give it to one Operator". The "write the script" half is its sole statement.
- **Unaffected PRs keep going.** phase-return-tokens:22, "while PRs the defect does not touch continue" (B1), is its sole statement.
- **Integration gates.** orchestrator-goal:37 gate rules (B16): record the exact PR heads, route discoveries through Main, and never report per-PR readiness as delivery readiness. This is their sole home.
- **Implementer doesn't contact the reviewer.** orchestrator-goal:34, "the implementer does not contact the reviewer directly", is its sole statement.
- **Stack mechanics.** orchestrator-goal:29 "one writer per branch", "reuse the same Sidekick session with a new one-PR assignment", and "stays pending". Also canonical:104 "A stack child whose parent head moves … is stale".
- **The PR map is not an approval stop.** plan-implementation:32: the owner sees the drawn PR map, and seeing it is not an approval stop (B9).
- **Breakdown immutability.** canonical:13 immutability and "the breakdown never records plan paths, PR numbers, or progress" (BF2/BF3). Keep it at :13; cut only the copy at :116.
- **Plan partitions work, not rails.** implementation-review:12: the PR plan partitions work and is not a rail. finding-and-reduction:111: convergence is compared per review scope.
- **Job pins content** (agent-job-packet:31-33): VERIFY, TIMEBOX, and REPORT; raw evidence goes in the output file; the parent verifies the file, exit codes, and diff, not the prose; the tier record supplies inputs, output, and stop.
- **Research unit fan-out.** practices-research:25: "the walk across classes stays serial and yours".
- **Audit delegation.** audit-lanes:5: a unit that fails fit "is re-cut or stays in-parent".
- **Worker and Operator skip discovery.** The `my_agents.md:51` lead-in is the always-loaded statement. Keep it; the prompt is the only surface loaded before any skill.
- **plan-review examples.** Keep the good and weak point examples at :25-27. They teach the check (the skills-creation depth rule, :247).
- **"Complexity decides the Sidekick; size decides the slices."** (slice:52) Main kept it on purpose in the r15 record. The my_agents copy is what gets cut.
