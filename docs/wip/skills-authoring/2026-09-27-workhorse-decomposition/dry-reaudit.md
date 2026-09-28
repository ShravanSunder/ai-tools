# DRY re-audit: workhorse decomposition PR (audit-tree HEAD 97659feb, base 59eec035)

Auditor: 🛠️ Worker · DRY re-audit. Read-only. Scope: PR-added or PR-changed text only (plugin skills, shared-references, plugin README, AGENTS.md; devfiles `shared/my_agents.md`, `dot_config/agent-context/model-map.md.tmpl` on `main...HEAD`). Line numbers are at HEAD. Paths below are relative to `plugins/shravan-dev-workflow/` unless they start with `AGENTS.md`, `README.md` (plugin README), `my_agents`, or `model-map`.

## 1. Verdict

**Not yet DRY or lean. The layering is mostly sound, and two real defects remain.** The cleanup (Run F) did cut model names back to their homes: the PR adds no model names outside the catalog and provider pages. It also cut most of the orchestrator's restated routing. What remains falls into three groups:

- **Index surfaces (AGENTS.md, plugin README) still restate manage-agents.** They say "load `manage-agents` and follow it", then repeat 4 to 5 of its rules anyway.
- **The planning references restate each other.** `slice-and-proof-design.md`, `plan-review.md`, `canonical-implementation-plan.md`, and the plan-implementation SKILL each carry a copy of the same eligibility, independence, and escalation rules.
- **One behavior lost its only statement.** The rule for which Daily-driver model and effort an escalated job gets is gone, and the Staffing table now points at nothing (§4). This break happened in Run E-1 (`b11ff42a`), after the prior audit, not in Run F.

| Measure | Count |
|---|---|
| Repeated facts (PR text) | **18 facts, 59 copies** (about 38 removable; the rest are homes, §8 keeps, or call sites) |
| Deletion-test failures (not already counted as copies) | **16** |
| Layer leaks (a skill restating a lower box's fact, or deep-linking past `manage-agents/SKILL.md`) | **9** |
| Model names outside their homes, PR-added | **0** (pre-existing, out of scope: `skills/manage-agents/SKILL.md:94` and `model-map:3`) |
| Verbose sentences | **6** |
| Disclosure or clarity problems | **8** (2 of them are behavior bugs: P1, P3) |
| §8 behaviors lost | **0 of 22** from §8. **1 other behavior lost** (Daily-driver selection, §4) |

## 2. Findings: quote, home, fix

### Repeated facts (R)

| # | Quote (≤20 words) | Copies (file:line) | One home | Fix |
|---|---|---|---|---|
| R1 | "one persistent implementation Sidekick owns that PR" | `skills/manage-agents/SKILL.md:103` (home), `:14`; `skills/orchestrator-implementation-goal/SKILL.md:8`, `:12`, `:29`; `AGENTS.md:69`; `README.md:128`; `skills/orchestrator-implementation-goal/README.md:3` (8) | manage-agents:103 (Commission); orch:12 stays as the MUST-load call site | orch:8: delete the last sentence. orch:29: delete "Commission one implementation 🐒 Sidekick per started PR." manage-agents:14: start the bullet "An implementation 🐒 Sidekick (Commission, below) integrates, proves, and corrects its PR." AGENTS.md:69: delete the sentence. README:128: delete "After a PR's ready plan … follow Staffing." |
| R2 | "Material design/plan or integration questions return to Main with evidence" | manage-agents:14 (home); AGENTS.md:69; README:128 (3) | manage-agents:14 | Delete from AGENTS.md:69 and README:128. |
| R3 | "PR wrap-up may stay with the assigned implementation Sidekick or run as a prescribed Operator procedure" | `skills/implementation-pr-wrapup/SKILL.md:28` (home); manage-agents:86; orch:34; AGENTS.md:69; README:128 (5) | wrapup:28 (Execution Ownership) | Delete the clause from manage-agents:86 ("PR wrap-up may stay … the user merges"), AGENTS.md:69, and README:128. orch:34 keeps the assignment call and drops "and require current PR gate evidence back to Main for verification". |
| R4 | "do not dispatch an Operator for tests that are coupled to the implementation" / "no relay supervisor" | manage-agents:39 and :86 (home); orch:14; AGENTS.md:69 ("Standalone prescribed … use Operators; implementation-associated proof stays"); README:128 ("Standalone prescribed procedures use Operators") (4) | manage-agents:86 | Delete orch:14 entirely except the agent-router sentence. Delete from AGENTS.md:69 and README:128. |
| R5 | "Without a ready breakdown … end this run with `ready-for-planning`" | orch:28 (home); `…/references/goal-contract-and-routing.md:56-57`; AGENTS.md:125 "(missing plans return `ready-for-planning` to Main)"; README:202 "if no plans exist yet, it returns ready-for-planning" (4) | orch:28 | Delete the goal-contract:56-57 row (its routing table already points at SKILL for the loop). Drop the parenthetical from AGENTS.md:125 and the clause from README:202. |
| R6 | "one per independent PR, or one continuing reviewer relationship per stack" | `skills/implementation-review/SKILL.md:10` (home); AGENTS.md:67; AGENTS.md:134; orch:31 (4) | implementation-review:10 | AGENTS.md:67: delete the parenthetical. AGENTS.md:134: shorten to "Independent 🔎 Review Sidekick per review scope; …". orch:31: see R7. |
| R7 | "Only a source-backed accepted assessment commissions that PR's independent 🔎 Review Sidekick" + "Commission one 🔎 Review Sidekick per review scope" | orch:30 (last sentence); orch:31 (first sentence) (2) | orch:30 | Delete orch:31's first sentence. orch:30 ends "…commissions the 🔎 Review Sidekick for its review scope (`implementation-review`) through `manage-agents`…". |
| R8 | "A node with an unmet external prerequisite stays pending, or its gap returns" | `skills/plan-implementation/references/slice-and-proof-design.md:65` (home); `skills/plan-implementation/SKILL.md:33`; `…/references/plan-review.md:21` (3) | slice:65 (Eligible) | plan-impl:33 → "Check each node's eligibility under the PR Independence Test." plan-review:21: delete the second sentence and write "every node passes Eligible (PR Independence Test)". |
| R9 | "escalates only with a recorded reason" / "tag it Daily driver only with an escalation reason" | `skills/manage-agents/references/model-catalog.md:36`, `:46` (home); slice:36; `skills/plan-improve-repo/references/audit-lanes.md:5`; `my_agents:65` (4) | catalog:46 | slice:36 → "Split a slice that fails Workhorse fit, or that crosses an assigned authority or contract boundary, at that boundary." audit-lanes:5: delete "and escalates only with a recorded reason". my_agents:65: delete the sentence (see L6). |
| R10 | "A Workhorse slice that stops at a boundary … returns to the originating planner as a plan defect" | `skills/implement-plan/references/execution-and-proof.md:77-81` (home); `shared-references/canonical-implementation-plan.md:98`; catalog:46 (a §8 keep) (3) | execution-and-proof:77-81 | canonical:98: delete the last sentence. The record contract ends at "The implementer follows the record." |
| R11 | "compare its write surfaces with every slice that may run beside it and confirm its own proof" | slice:48 (home); plan-review:20 (2) | slice:48 | plan-review:20 → "…every `independent` mark passes the shared-write check." |
| R12 | "a name that matches in the brief is not a seam that exists" | catalog:78 (home); plan-review:19 (2) | catalog:78 | Delete from plan-review:19 (the fit-condition pointer already carries it). |
| R13 | "In every home, the breakdown sits beside its plans." | canonical:13 ("It lives beside its plans (Plan Home)"); canonical:92 (2) | canonical:92 (Plan Home) | canonical:13: delete "It lives beside its plans (Plan Home)." |
| R14 | "the first executable nodes' plans are written with the breakdown" | canonical:39 (home); plan-impl:33; `skills/plan-improve-repo/SKILL.md:10`; `skills/orchestrator-design/SKILL.md:78` (4) | canonical:39 | plan-impl:33 → "Plan each node that is executable now (canonical)". plan-improve-repo:10 → "…to write the finding's breakdown and plans." orch-design:78 → "…return the ready breakdown and its plans." |
| R15 | "A stack wraps up per layer from its lowest layer up through `gh stack`" | orch:29 (home for stacks); wrapup:30 (2) | orch:29 | wrapup:30 → "In a stack, after a lower layer changes, `gh stack rebase` then `gh stack submit` …" (keep the re-entry rule, which is new and wrapup-specific). |
| R16 | "Delegate audit work only by evidence unit, never by whole category … the main verifies each return" | audit-lanes:5 (home); plan-improve-repo:55; plan-improve-repo:56 ("Re-open cited files before accepting") (3) | audit-lanes:5 | plan-improve-repo:55 → "Delegate only by evidence unit (`references/audit-lanes.md`)." Drop "; the main verifies each return before it counts" (:56 says it). |
| R17 | "`plan-implementation` owns … the breakdown and plans for an orchestrated improvement delivery" | plan-improve-repo:10; plan-improve-repo:12 (2) | plan-improve-repo:10 | :12: delete "and the breakdown and plans for an orchestrated improvement delivery". |
| R18 | "Admit the ready breakdown and the ready plan of each PR node you start" | orch:12; orch:28 (2) | orch:28 (loop step) | orch:12: delete the admit sentence and start at "For each started PR node, MUST load `manage-agents`…". |

### Deletion-test failures (D)

| # | file:line | Quote | Why it fails | Fix |
|---|---|---|---|---|
| D1 | manage-agents SKILL:14 | "its tier and what it dispatches follow Staffing (Commission an implementation 🐒 Sidekick)" | Staffing is in the same file and read on every run | Delete the clause. |
| D2 | orch SKILL:14 | "Each 🐒 Sidekick's tier and dispatch follow Staffing (`manage-agents`)." | :12 already MUST-loads `manage-agents` for the commission | Delete. |
| D3 | goal-contract:42 | "; execution responsibility is `SKILL.md`'s Execution Responsibility." | Points back to the file that loaded it | Delete the clause. |
| D4 | plan-impl SKILL:31 | "Write the breakdown first, whole." | Step 2 already returns the cut, slice:52 says "Cut PRs before slices", and step 8 writes the file | Delete step 3 and renumber. |
| D5 | plan-review:13, :33 | "A compact plan … may skip this review" / "or a compact plan records its skip reason" | Unreachable: the call sites load this file only when `IF a plan is a full plan` (plan-impl:37, plan-improve-repo:111) | Delete :13 and the :33 clause. Move "record the reason in the trace and return it with the planning result" to the plan-impl:37 call site. |
| D6 | plan-review:3 | "Main reviews its own full draft plan before it returns `ready`." | Said again at :7 and :11 ("Main reviews…", "Main performs this review in its own session") | Delete :3. Merge :11's first sentence into :7. |
| D7 | audit-lanes:5, :9 | "with the job pins (`…/agent-job-packet.md`)" / "alongside the job pins" | `manage-agents` Hand off already MUST-loads the packet with the job pins (SKILL:120) | Delete both. |
| D8 | `skills/practices-research/SKILL.md:25` | "to a Workhorse 🛠️ Worker through `manage-agents` with the job pins (`…/agent-job-packet.md`)" | The same reason as D7, plus the tier is manage-agents' output | → "assign each unit to a 🛠️ Worker through `manage-agents`". |
| D9 | plan-improve-repo:107 | "write the breakdown under `../../shared-references/canonical-implementation-plan.md`" | :103 says to write the breakdown, and step 6 (:102) already loads canonical | Delete the bullet. |
| D10 | execution-and-proof:34 | "the implementation 🐒 Sidekick selects and dispatches a slice … that Worker executes" | Restates implement-plan SKILL:14, which the same bullet names as the owner. "that Worker" has no antecedent | Delete that sentence. Keep "`SKILL.md` owns execution responsibility; `manage-agents` adds dispatch details." |
| D11 | slice:79 | "A gate where two PRs first meet belongs to the breakdown, not to either plan." | :59 already names PR-level gates, and canonical:31-32 puts them in the breakdown record | Delete. |
| D12 | catalog:58 | "(an independently landable seam exists)" | Paraphrases the PR Independence Test in a practice reference | Delete the parenthetical. |
| D13 | `shared-references/phase-return-tokens.md:22` | "Main resolves `ready-for-planning` by the admitted basis and `plan-defect` through the plan's recorded `originating planner`" | The table payloads (:10-11) and the plan's own field already say this | → "Main resolves both planning tokens in its own session, while PRs the defect does not touch continue." (keeps the §8 behavior) |
| D14 | plan-impl SKILL:44 | "A `plan-defect` returns here through the plan's recorded `originating planner`." | The tokens file and the plan record own this routing | Delete. |
| D15 | `skills/manage-agents/references/native-providers-codex.md:18` | "allowed model-and-effort combinations in `model-catalog.md` effort bands still apply" | Effort bands define effort by role, not model-and-effort combinations, so the pointer is wrong | → "…in the `model-catalog.md` rows still apply." |
| D16 | manage-agents SKILL:112 | "since changing either may reduce reuse, and only evidence supports a hit or miss claim" | The cache claim is Verify's (:140) | Delete the clause (the §8 behavior "different effort → new session" stays). |

### Layer leaks (L)

| # | file:line | What leaks | Fix |
|---|---|---|---|
| L1 | audit-lanes:5 | A phase reference restates the catalog's routing ("passes Workhorse fit → Workhorse 🛠️ Worker") and deep-links to `model-catalog.md` and `agent-job-packet.md` | → "Each unit goes to a 🛠️ Worker through `manage-agents`; a unit that `manage-agents` cannot fit is re-cut or stays in-parent." (keeps the §8 behavior) |
| L2 | practices-research:25 | Picks the tier and deep-links the packet | See D8. |
| L3 | plan-review:19 | Deep-links the catalog and restates condition 4 | Keep one pointer: "check each Workhorse fit condition (tier record, canonical)". canonical:98 already links the catalog. |
| L4 | orch SKILL:14 | Restates manage-agents rules (relay supervisor, coupled tests) | See R4 and D2. |
| L5 | wrapup:40 | "dispatch `pr-description` to a Workhorse 🛠️ Worker (Complete direction)". The phase hard-codes manage-agents' classification output (tier and direction) | → "dispatch `pr-description` to a 🛠️ Worker". :58 already MUST-loads `manage-agents` for it. |
| L6 | my_agents:65 | "A job starts on Workhorse and escalates only with a recorded reason." Catalog policy in the always-loaded prompt. This also contradicts the prompt commit's own message, "tiers only, no policy restated" | Delete the sentence. "the `manage-agents` tables decide who uses what" already covers it. |
| L7 | model-map:9-11, :17-19, :27-31, :37-39 | Map rows carry effort per role ("Luna (high, xhigh)", "Luna medium", "Sol medium"), which is policy. Its own header says "this file owns ids" | The cleanup deliberately kept this structure, so no change is proposed. Note it as a known second statement of the effort bands (see P3 for the conflict it causes). |
| L8 | AGENTS.md:69 | After "load `manage-agents` and follow it decisively", 5 sentences restate manage-agents | Keep the first sentence and Main's authorship. Delete the rest (R1–R4). |
| L9 | README:128 | The same pattern: 4 sentences restate manage-agents before the ownership index | Delete sentences 2–5 (R1–R4) and keep the ownership index. |

### Verbose sentences (V)

| # | file:line | Issue | Shorter text |
|---|---|---|---|
| V1 | manage-agents SKILL:112 | 48 words | "Set a Sidekick's model and effort at creation and keep them; an assignment that needs a different effort gets a new session." |
| V2 | agent-job-packet:31 | One 110-word sentence carrying 8 pins | Make it a bullet list of the 8 pins. Keep the verify sentence. |
| V3 | orch SKILL:29 | Step 3 runs about 150 words and mixes ordering, parallelism, stacks, commissioning, the `implement-plan` call, and reporting | After R1 and R15, keep: ordering; parallel PRs with one writer per branch; stack sequencing with session reuse; pending nodes; the Sidekick invokes `implement-plan`; the receipt. That is about 90 words. |
| V4 | orch SKILL:30 | Step 4 runs about 170 words and ends with a duplicate commission (R7) | Apply R7. Cut "Confirm required behavior … not introduced" to "Assess against the accepted need, design, plan, node, base, and scope." |
| V5 | manage-agents SKILL:14 | The Authority bullet has 7 sentences, and 3 of them are R1, D1, and R2 material | After R1 and D1, 5 sentences. |
| V6 | catalog:58 | The example table's Effort cell carries a 35-word rule | Cell → "max; flagged (Escalation)". |

### Disclosure and clarity problems (P)

| # | file:line | Problem | Fix |
|---|---|---|---|
| **P1** | manage-agents SKILL:110 | Staffing row: "the Daily driver that reason names". No escalation reason names a model (catalog:46: `owner recommended`, `judged tough`, `Workhorse failed`), and no rule anywhere picks a Daily-driver lineage or effort for a Sidekick. **Behavior gap; see §4.** | Restore one line to catalog:46 (the home): which Daily-driver row an escalated job takes (for example, fixed-approach Cross-system → Sol medium; open judgment → Opus medium; Opus high only on evidence). Staffing then says "the Daily-driver row the catalog's Escalation names". |
| P2 | catalog:36 vs :69 | "Every job starts on the Workhorse tier" contradicts "Independent review … never the Workhorse tier". The Advisor is also excluded | → "Every 🔧 Operator, 🛠️ Worker, and implementation 🐒 Sidekick job starts on the Workhorse tier." |
| **P3** | native-providers-codex:11 vs model-map:10 vs catalog:25-26 | For a Daily-driver Codex Worker, the page says "Luna or Sol, effort from … effort bands" (Worker band: high–xhigh), the map says Sol **medium**, and the catalog has Sol medium/high but **no longer has Sol xhigh** (the PR deleted that row). Three answers | The fix from P1 decides it. The page then reads "effort from the catalog row". |
| P4 | orch SKILL:8 | "owns … the breakdown and every PR plan …" followed by "It never authors or repairs a plan." A reader can't tell who writes the plans | → "…owns the coordination root, integration gates, disposition, acceptance, and the final report; plans come from Main's `plan-implementation` run (step 2)." |
| P5 | plan-impl SKILL:31 and :36 | The breakdown is "written" in step 3 and again in step 8 | D4 fixes this. |
| P6 | canonical:98, plan-review:19, audit-lanes:5 (2 links), practices-research:25 | Phases and shared references deep-link into `manage-agents/references/*`, skipping the "load `manage-agents`" entry | Keep canonical:98 as the one definition pointer for the tier record. Remove the other three (L1–L3). |
| P7 | execution-and-proof:34 | "that Worker" has no antecedent after the PR's edit | D10 fixes this. |
| P8 | slice:38-48 (with template :48-54, canonical:94, plan-review:20, Staffing:105) | The Throughput Checkpoint is an all-plan section with 5 mandatory fields ("write `n/a: <reason>`"). Three of the five re-encode the dependency edges at slice:67-77 in a second vocabulary: "blocking first steps" = `requires`, "independent workstreams" = `parallel`, "shared mutable state" = `serial` | See §3: cut to the 2 items that add behavior. |

## 3. Word budget

Words at base `59eec035` vs HEAD (`git show <rev>:<file> | wc -w`):

| Δ | base | HEAD | file |
|---|---|---|---|
| +585 | 712 | 1297 | skills/plan-implementation/references/slice-and-proof-design.md |
| +542 | 822 | 1364 | skills/manage-agents/references/model-catalog.md |
| +541 | 761 | 1302 | shared-references/canonical-implementation-plan.md |
| +513 | 0 | 513 | skills/plan-implementation/references/plan-review.md (new) |
| +470 | 3262 | 3732 | skills/manage-agents/SKILL.md |
| +179 | 786 | 965 | skills/plan-implementation/SKILL.md |
| +145 | 527 | 672 | skills/manage-agents/references/agent-job-packet.md |
| +96 | 408 | 504 | skills/plan-improve-repo/references/improvement-plan-template.md |
| +91 | 1450 | 1541 | skills/implementation-review/SKILL.md |
| +86 | 362 | 448 | skills/plan-improve-repo/references/audit-lanes.md |
| +68 | 586 | 654 | skills/practices-research/SKILL.md |
| +63 | 241 | 304 | shared-references/phase-return-tokens.md |
| +61 | 239 | 300 | skills/orchestrator-implementation-goal/README.md |
| +56 | 3419 | 3475 | AGENTS.md |
| +52 | 856 | 908 | skills/plan-handoff/SKILL.md |
| +45 | 275 | 320 | skills/plan-implementation/README.md |
| +37 | 435 | 472 | skills/plan-handoff/references/handoff-template.md |
| +36 | 932 | 968 | skills/practices-collaboration/SKILL.md |
| +36 | 1136 | 1172 | skills/implement-plan/references/execution-and-proof.md |
| +28 | 1500 | 1528 | skills/implementation-pr-wrapup/SKILL.md |
| +27 | 1317 | 1344 | skills/implementation-review/references/finding-and-reduction.md |
| +26 | 1979 | 2005 | skills/plan-improve-repo/SKILL.md |
| +22 | 751 | 773 | skills/implement-plan/SKILL.md |
| +16 | 245 | 261 | skills/manage-agents/references/native-providers-cursor.md |
| +16 | 211 | 227 | skills/manage-agents/references/native-providers-claude.md |
| +16 | 1098 | 1114 | skills/practices-show-me-your-work/SKILL.md |
| +13 | 34 | 47 | skills/orchestrator-implementation-goal/agents/openai.yaml |
| +11 | 443 | 454 | skills/practices-research/references/lane-packets.md |
| +10 | 33 | 43 | skills/plan-implementation/agents/openai.yaml |
| +3 | 499 | 502 | skills/manage-agents/references/acpx-provider-codex.md |
| +2 | 391 | 393 | skills/manage-agents/references/acpx-provider-cursor.md |
| −3 | 552 | 549 | skills/manage-agents/references/native-providers-codex.md |
| −71 | 1628 | 1557 | skills/orchestrator-implementation-goal/SKILL.md |
| −108 | 2727 | 2619 | README.md (plugin) |
| −197 | 1827 | 1630 | skills/orchestrator-design/SKILL.md |
| −392 | 1417 | 1025 | skills/orchestrator-implementation-goal/references/goal-contract-and-routing.md |
| **+3121** | 33861 | 36982 | **plugin total (36 files)** |
| +56 | 6863 | 6919 | devfiles shared/my_agents.md |
| +49 | 334 | 383 | devfiles dot_config/agent-context/model-map.md.tmpl |

What the five largest growths buy:

1. **slice-and-proof-design.md, +585.** New behavior: the PR cut rules (about 130 words), the PR Independence Test in its planned and eligible forms (about 170), and the tier-record cut rules (about 60). Restatement: :31 tier pointer, :36 escalation (R9), :79 (D11). **The Throughput Checkpoint (:38-48, about 140 words) is mostly unnecessary.** Only "choices later slices depend on" (sets Task vs Open) and "smallest safe decomposition" add behavior. Keep the `independent` shared-write check at :48. Fold the two items into the tier record or into "Order Only Real Dependencies", and drop the 5-field `n/a` ceremony and its copies (template :48-54, canonical:94, plan-review:20). Estimated saving is about 200 words across 4 files.
2. **model-catalog.md, +542.** New behavior: effort bands (about 70), Escalation (about 110), Workhorse fit (about 140), and the owner-requested examples (about 290; §8 keep). The removed role tables account for the offset. Restatement is small (D12, V6). The **gap** is P1: the growth removed the one sentence that picked the Daily-driver row.
3. **canonical-implementation-plan.md, +541.** New behavior: the breakdown record and its readiness and immutability rules (about 350), executable-node and base definitions, the tier-record format, and the breakdown admit conditions. Restatement: :13 home clause (R13), :98 last sentence (R10). Otherwise lean.
4. **plan-review.md, +513 (new).** New behavior: Main's pre-`ready` self-review, the executor-read stance, the bundles check (:23), the good and weak examples (§8 keep), and the Advisor disposition loop. **About 40% is restatement or unreachable text.** Checks 1–4 re-verify rules owned by the catalog and slice-and-proof (R8, R11, R12). :13 and :33 are unreachable (D5). "Main reviews" appears 3 times (D6). The file can be about 250–300 words without losing behavior.
5. **manage-agents SKILL.md, +470.** New behavior: the Horizon axis, the direction and span tie-breaker tests (§8 keep), the Staffing table, the Operator "write the script" test, and the agent-router long-turn and 300-second rule. Restatement: D1, D16, R1 at :14, and R3 at :86 (pre-existing text in a PR-edited paragraph).

Added sections that are themselves unnecessary: **Throughput Checkpoint** (3 of its 5 items), and **plan-review.md "Who Takes Part" second paragraph** (unreachable). No other added section fails the deletion test as a whole.

## 4. What the cleanup broke

All 22 items in `dry-audit.md` §8 "Behaviors to keep" are present at HEAD:

- Bigger-model rule: execution-and-proof:80.
- F16 tie-breakers: manage-agents SKILL:68, 73, 80, 82.
- Examples: catalog:48-69.
- "Main first fixes the cut" and "a boundary stop is a plan defect instead": catalog:46.
- Seam clause: catalog:78.
- Workhorse Sidekick routes through Main: SKILL:14.
- Effort set at creation: SKILL:112.
- 300-second default: SKILL:116.
- "write the script": SKILL:39.
- Unaffected PRs continue: tokens:22.
- Integration gates: orch:35.
- Implementer doesn't contact the reviewer: orch:32.
- Stack mechanics: orch:29 and canonical:102.
- PR map is not an approval stop: plan-impl:32.
- Breakdown immutability: canonical:13.
- Plan is not a rail: implementation-review:12.
- Per-scope convergence: finding-and-reduction:111.
- Job pins: agent-job-packet:31-33.
- Research serial walk: practices-research:25.
- Audit re-cut or stay in-parent: audit-lanes:5.
- Worker and Operator skip: my_agents:51 and practices-collaboration:16.
- plan-review examples: :25-27.
- "Complexity decides the Sidekick": slice:52.

My fix proposals above (D13, L1) keep those statements.

**One accepted behavior lost its only statement.** At the prior audit (`b72e49ca`), catalog "Leaving Luna" read: "Sol medium (fixed-approach Cross-system work) or Opus medium (open judgment; Opus high on evidence) takes a job only with one recorded reason." Run E-1 `b11ff42a` ("manage-agents — tiers, not models") replaced it with "A Daily-driver model takes a job only with one recorded escalation reason". That change removed model names from the **one file allowed to name them**. The results:

- Staffing (`skills/manage-agents/SKILL.md:110`, "the Daily driver that reason names") dangles.
- An escalated 🐒 Sidekick has no lineage or effort rule anywhere.
- Escalated 🛠️ Workers get three conflicting answers from provider pages and the map (P3).

Fix: restore the selection sentence in catalog:46, which is its home, and point Staffing at it.

Also removed, and not in §8 (probably harmless, since the band table implies it): "Luna never goes below its band; work that needs no judgment is 🔧 Operator work."
