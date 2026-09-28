# Cohesion analysis: workhorse decomposition + breakdown/review topology

Target: `~/dev/ai-tools.chore-workhorse-decomposition`, `git diff 59eec035..HEAD -- plugins/shravan-dev-workflow/{skills,shared-references}` (31 files, +432/−185).
Method: `skills-creation/SKILL.md` Information Hierarchy, Progressive Disclosure, and the deletion test ("Would the agent act differently if this sentence disappeared?"; "nothing sits in two homes").
All paths below are relative to `plugins/shravan-dev-workflow/`. Line numbers are at branch HEAD `0915b6fa`.
Abbreviations: `MA` = `skills/manage-agents/SKILL.md`, `CAT` = `skills/manage-agents/references/model-catalog.md`, `AJP` = `skills/manage-agents/references/agent-job-packet.md`, `CIP` = `shared-references/canonical-implementation-plan.md`, `OIG` = `skills/orchestrator-implementation-goal/SKILL.md`, `GCR` = `skills/orchestrator-implementation-goal/references/goal-contract-and-routing.md`, `PI` = `skills/plan-implementation/SKILL.md`, `SPD` = `skills/plan-implementation/references/slice-and-proof-design.md`, `APR` = `skills/plan-implementation/references/advisor-plan-review.md`, `IP` = `skills/implement-plan/SKILL.md`, `EAP` = `skills/implement-plan/references/execution-and-proof.md`, `PIR` = `skills/plan-improve-repo/SKILL.md`.

Headline: the change has **one stated home per rule** in most cases, but then restates the rule at every consumer as well as citing it. The worst offenders are the staffing rule (12 places), the Workhorse boundary-stop rule (10), the "choice a later slice depends on" condition (11), and the stack/parallel execution mechanics (9). Two of the concepts carrying the most restatement are also modelled wrong per the owner (horizon-as-role, tier-as-role), so fixing the model and fixing the redundancy is the same edit.

---

## 1. Redundancy table

Each row: concept · every place it is stated · the home it keeps · disposition for each other place.

### R1. Staffing: a PR's Sidekick tier and what it executes vs dispatches

Home: `MA:106-114` (Staffing table). Spec B15 names it "the one staffing owner".

| Place | Quote (≤15 words) | Disposition |
|---|---|---|
| `MA:14` | "a Luna Sidekick executes an all-Workhorse PR itself, with any child still subject" | replace the sentence "Its tier and what it executes itself follow … when the benefit test holds." with: `Its tier and what it dispatches follow Staffing (Commission an implementation 🐒 Sidekick).` |
| `MA:111` (table cell) | "(no `requires` or `serial` edge to in-flight work, disjoint writes, own proof)" | delete the parenthetical; the mark's criteria live at `SPD:51`. Cell becomes `Workhorse slices the plan marks independent, when the benefit test holds` |
| `OIG:14` | "follow the staffing table … a Luna Sidekick executes an all-Workhorse PR itself" | replace first sentence with: `Each 🐒 Sidekick's tier and dispatch follow the staffing table in manage-agents (Commission an implementation 🐒 Sidekick).` |
| `OIG:27` | "executes its assignment under the staffing table" | delete "under the staffing table" (already cited at :14) |
| `OIG:29` | "pick its tier from that PR plan's slice executor records with the staffing table" | delete both staffing clauses in step 3 ("and pick its tier … Sidekick)" and "and executes or dispatches each slice as the staffing table and the slice's executor record say") |
| `GCR:42` | "with its tier and dispatch set by the staffing table in `manage-agents`" | delete the clause |
| `GCR:44` | "Under that table, a Daily-driver 🐒 Sidekick dispatches only plan-marked independent Workhorse slices" | delete the first sentence; keep only the seats sentence (see R13, the whole paragraph duplicates `OIG:12-14`) |
| `IP:14` | "the staffing table … decide whether the Sidekick executes a slice itself or dispatches it" | replace with: `Dispatch follows each slice's executor record and the manage-agents staffing table.` |
| `EAP:35` | "dispatches a slice only when its executor record … and the staffing table … say so" | revert to pre-change sentence; the bullet already says "`SKILL.md` owns execution responsibility; `manage-agents` adds dispatch details without regenerating that contract" and then regenerates it |
| `SPD:45` | "This sets the PR's Sidekick under the staffing table … keeps a Luna Sidekick" | delete from "This sets" to end of bullet |
| `SPD:59` | "a Luna xhigh Sidekick when every slice fits … Opus for Partial direction or an open dependent choice" | replace bullet with: `a behavior change that must land across two owners at once stays one PR; its Sidekick follows the staffing table in manage-agents;` |
| `CIP:102` | "The PR's Sidekick tier and what it dispatches follow the staffing table" | delete sentence (the plan record contract has no staffing consumer) |
| `orchestrator-design/SKILL.md:80` | "the staffing table (`../manage-agents/SKILL.md`, Commission an implementation 🐒 Sidekick)" | delete the whole paragraph except its last sentence (this skill commissions nothing now) |
| `CAT:72` (jobs row) | "stays with the Sidekick under the staffing table in `SKILL.md`" | keep (a citation, one line) |

### R2. The "long-horizon choice" condition: a later slice depends on a choice the plan leaves open

Home (proposed): one horizon definition in `MA` Select an agent (see §4), used by the staffing table and the Sidekick rows. Today it is written out 11 times.

| Place | Quote | Disposition |
|---|---|---|
| `CAT:15` | "A Sidekick whose later slices rest on a local choice the plan leaves open goes to Opus." | delete (the Sidekick rows say it) |
| `CAT:119` | "every dependent choice in the plan" | replace with `short horizon` once horizon is defined |
| `CAT:120-121` | "when a later slice depends on a local choice the plan leaves to the Sidekick" | replace with `long horizon` (both rows) |
| `CAT:123` | "A Luna Sidekick carries context across its PR but makes no choice that later slices depend on" | delete paragraph (see R8/C2) |
| `MA:110-111` | "every choice a later slice depends on is written in the plan" / "a later slice depends on a local choice" | replace with `short horizon` / `long horizon` |
| `SPD:45` | "**choices later slices depend on**: each one written into the plan, or named as left to an Opus Sidekick" | keep as the planner's home for *recording* the choices; drop "Opus" (tier choice is staffing's) |
| `SPD:59` | "every dependent choice is in the plan" | deleted under R1 |
| `APR:22` | "every choice a later slice depends on is either written in the plan or named as left to an Opus Sidekick" | replace item 2 with: `**Throughput checkpoint.** Every item in SPD Throughput Checkpoint is filled or n/a: <reason>; for every slice marked independent, compare its write surfaces with every slice that may run beside it and confirm its own proof.` |
| `improvement-plan-template.md:50` | "each written into this plan, or left to an Opus Sidekick with the reason" | keep (template slot), drop "Opus" |
| `MA:14` | (via staffing restatement) | deleted under R1 |

### R3. Workhorse boundary stop is a plan defect; nobody re-cuts or re-runs it on a bigger model

Home: `CIP:100` (C2, the executor record's consequence), routed by `EAP:79-82` (plan-defect surprise class).

| Place | Quote | Disposition |
|---|---|---|
| `CAT:55` | "A boundary stop from a Workhorse unit is evidence about the cut, so the assigner re-slices" | delete sentence (and see conflict C3) |
| `MA:114` | "A Workhorse slice that stops at its boundary goes back to Main as a plan defect" | delete second sentence |
| `OIG:14` | "Main re-slices or re-tags it with a reason … nobody silently re-runs it on a bigger model" | delete sentence |
| `GCR:73-74` | "plan-defect to Main … not re-run on a bigger model, not re-cut by the Sidekick" | shorten to `-> plan-defect to Main (canonical-implementation-plan.md, Slice Executor Record); PRs it does not touch continue` |
| `IP:14` | "returns `plan-defect` with the breakdown identity and node id … does not re-cut it or re-run it" | delete sentence |
| `IP:31` | "A Workhorse slice that stops at its boundary is a `plan defect`." | delete (EAP:81 owns classification) |
| `EAP:40` | "A Workhorse slice that stops at its boundary returns a plan-defect route" | delete bullet (EAP:80-82 already classifies it) |
| `SPD:39` | "A Workhorse slice that later stops at its boundary is evidence about this cut." | delete paragraph |
| `CAT:57` | "Escalate on evidence (a boundary stop, …)" | keep but see C3 |

### R4. Workhorse fit conditions restated instead of cited

Home: `CAT:46-57`.

| Place | Quote | Disposition |
|---|---|---|
| `SPD:31` | "passes all four conditions, including a source check at the slice's base that every seam" | replace sentences 3-4 with nothing; keep `Decide the tier with Workhorse fit in …model-catalog.md; a Daily-driver slice names the condition it misses.` |
| `SPD:37` | "A slice that needs a seam missing at its base gets a contract slice first" | delete (CAT:53 last sentence) |
| `SPD:70` | "Whether one slice that adds or uses a new seam is Workhorse is the per-slice…" | delete (SPD:68 already says "Workhorse fit still applies per slice") |
| `SPD:119` | "a slice records Workhorse but misses a Workhorse fit condition, or relies on a seam no one checked" | keep first clause only: `a slice records Workhorse but misses a Workhorse fit condition;` |
| `APR:7` | "It checks: every Workhorse slice passes Workhorse fit … no slice bundles independent units." | delete the "It checks: …" sentence (APR:21-25 is the check list) |
| `APR:21` | "Confirm the inputs are pinned, the output is checkable, the stop is named, and every seam" | replace with: `For each Workhorse slice, reopen the cited source at the slice's base and check each Workhorse fit condition; a name that matches in the brief is not a seam that exists. For each Daily-driver slice, confirm the missing condition is real and named.` |
| `APR:23` | "A Workhorse slice relies only on seams that exist at its base or that an earlier contract slice adds" | delete this and the next sentence (item 1 covers it) |
| `PI:34` | "every Workhorse slice passes Workhorse fit …, including the seam check at its base" | keep (all-run obligation at the decision), drop "including the seam check at its base" |
| `PI:50` | "every Workhorse slice passes Workhorse fit" | keep (completion boundary) |
| `CIP:100` | "A Workhorse slice passes Workhorse fit in `manage-agents`; a Daily-driver slice names" | keep (record contract) |
| `CIP:118` | "a Workhorse slice that misses a fit condition" | keep (bad signal) |

"A Daily-driver slice names the condition it misses" appears at `CIP:100`, `SPD:31`, `PI:34`, `APR:7`, `APR:21`: keep `CIP:100` and `PI:34`.

### R5. Integration gates: Main runs them after PR-ready, records heads, per-PR readiness is not delivery readiness

Home (proposed): `OIG:37` (step 9) owns running a gate; `CIP` keeps the record field only.

| Place | Quote | Disposition |
|---|---|---|
| `CIP:41` | "Main runs it and records in the trace the exact PR heads it tested together" | replace paragraph with: `Each integration gate names the nodes that meet and the proof; orchestrator-implementation-goal runs it.` |
| `MA:12` | "and runs the breakdown's integration gates after the participating PRs are PR-ready" | delete clause |
| `OIG:30` | "Cross-PR interaction is proved at the breakdown's integration gates (step 9)" | keep (behavior: do not assess cross-PR here) |
| `GCR:100` | "Cross-PR interaction is proved separately, when Main runs the breakdown's integration gates" | delete sentence |
| `GCR:93-94` | "Main runs the gate, records the exact PR heads tested together, and routes any change" | shorten to `-> Main runs the gate (SKILL.md step 9)` |
| `implementation-pr-wrapup/SKILL.md:30` | "Per-PR readiness is not delivery readiness; Main runs the breakdown's integration gates" | delete last sentence |
| `OIG:52`, `GCR:114,117` | completion/finish gates | keep (completion boundary) |

### R6. Stack and parallel execution mechanics

Home (proposed): `OIG:29` (step 3) for sequencing; `SPD:66` for what a stack is; `CIP:39` for when a node is executable; `implementation-pr-wrapup:30` for `gh stack rebase/submit`.

| Place | Quote | Disposition |
|---|---|---|
| `MA:14` | "Main owns a stack: it sequences the layers and commissions each as its own one-PR assignment" | delete sentence |
| `MA:104` | "Independent PRs may run at once … commissions each layer only once its parent has a head" | replace last three sentences with: `Sequencing of parallel and stacked PRs belongs to orchestrator-implementation-goal.` |
| `OIG:8` | "The orchestrator sequences a stack's layers and commissions each layer as its own one-PR assignment." | delete |
| `OIG:12` | "The next layer of a stack may reuse the same Sidekick session with a new one-PR assignment." | move into step 3 (`OIG:29`) and delete here |
| `OIG:45` | "stack sequencing" | keep (ownership list) |
| `GCR:71` | "independent PRs run in parallel on separate branches or worktrees; a stack's layers are sequenced" | shorten to `-> commission/resume that PR's implementation 🐒 Sidekick (SKILL.md step 3); then implement-plan per PR` |
| `orchestrator-design/SKILL.md:80` | "a PR that needs another PR's behavior is a stack layer that runs through `gh stack`" | delete (R1) |
| `OIG:36` | "A stack wraps up from its lowest layer up." | delete (wrapup:30 owns) |
| `GCR:91` | "a stack wraps up from its lowest layer up" | delete clause |

### R7. Review topology: one lead per independent PR, one per stack judging layers, convergence per PR/layer

Home: `skills/implementation-review/SKILL.md:10` (review scope) and `skills/implementation-review/references/finding-and-reduction.md:111` (convergence comparison).

| Place | Quote | Disposition |
|---|---|---|
| `implementation-review/SKILL.md:24` | "a new lead for each independent PR, or the stack's existing lead for its next layer" | replace with `…one persistent, different-lineage 🔎 Review Sidekick per review scope above.` |
| `implementation-review/SKILL.md:66` | "and convergence is compared per PR or per stack layer" | delete clause (finding-and-reduction:111 owns) |
| `OIG:33` | "Each independent PR gets its own different-lineage 🔎 Review Sidekick … in layer order." | replace first two sentences with `Commission one 🔎 Review Sidekick per review scope in implementation-review.` |
| `OIG:34` | "a reviewer is never reused across independent PRs … to that PR or stack layer" | delete "and a reviewer is never reused across independent PRs" and "to that PR or stack layer" |
| `OIG:35` | "for that PR or layer" | delete |
| `OIG:45` | "for its PR, or for each layer of its stack" | delete clause |
| `GCR:79-80` | "(its own for an independent PR; the stack's one relationship, reviewing this layer…)" | delete parenthetical |
| `GCR:108` | "compared per PR or per stack layer" | delete |
| `GCR:110` / `OIG:41` | missing-history baseline "for a PR or stack layer" | pre-existing duplicate pair; keep `GCR:110`, delete `OIG:41` |
| `IP:32` | "assigned to this PR or its stack; independent PRs never share a reviewer" | delete "; independent PRs never share a reviewer" (the implementer does not choose reviewers) |
| `IP:33` | "For a stack layer, that review judges the layer against its parent and this plan." | delete |

### R8. Horizon defined by role

Home: none should survive in this form (owner: horizon is a job property; see C1 and §4). Today:

| Place | Quote | Disposition |
|---|---|---|
| `MA:77-81` | "Horizon \| Role … The job … One PR … A stack of PRs" | replace table with a horizon definition by job (§4) |
| `MA:14` | "a Sidekick's assignment and horizon is one PR" | replace with `A Sidekick's assignment is one PR.` |
| `OIG:8` | "a Sidekick's assignment and horizon is one PR" | delete clause |
| `CAT:9` | "Horizon follows the role: a 🛠️ Worker's or 🔧 Operator's horizon is its job" | delete sentence |
| `CAT:65` | "Thinking level follows the job's direction and span; horizon follows its role." | delete sentence |
| `CAT:80` | "Luna max shares xhigh's band and is kept for a Luna Sidekick carrying a long PR." | delete (C2) |
| `CAT:123` | "A Sidekick's horizon is one PR. … Long-horizon Sidekick work is not in use" | delete paragraph |

### R9. Main writes plans in its own session; this orchestrator never authors or repairs a plan

Home: `MA:12` (Main writes every plan) and `shared-references/phase-return-tokens.md:22` (Main resolves `ready-for-planning` / `plan-defect`). `OIG:8` keeps one sentence: "It admits ready breakdowns and plans and never authors or repairs one."

| Place | Quote | Disposition |
|---|---|---|
| `OIG:8` | "Planning happens before this skill runs: Main writes the breakdown and each PR's plan" | delete that sentence; keep "It never authors or repairs a plan." |
| `OIG:12` | "Main resolves it in its own session, outside this skill, and returns here with the ready records" | delete sentence |
| `OIG:23` | "Main, which resolves it by the admitted basis … in its own session outside this skill" | shorten both to `ready-for-planning` / `plan-defect` -> Main (phase-return-tokens.md) |
| `OIG:28` | "return `ready-for-planning` to Main and stop this run; do not load a planner here" | keep "do not load a planner here" only (bright line); see C9 for "stop this run" |
| `OIG:45` | "(authored with `plan-implementation` in Main's own session, outside this skill)" | delete parenthetical |
| `GCR:42` | "Main authors the breakdown and PR plans with `plan-implementation` in its own session" | delete clause |
| `GCR:59` | "Main writes the breakdown … in its own session, which reviews each full plan before ready" | shorten to `-> return ready-for-planning to Main with the admitted basis` |
| `PI:10` | "Planning is Main's and happens before execution." | delete (the next sentence says Main authors it) |
| `orchestrator-design/SKILL.md:78` | "Planning is Main's and happens here, before execution." | delete |
| `PI:45`, `GCR:74`, `OIG:23` | "while PRs the defect does not touch continue" | keep only at `phase-return-tokens.md:22` |

### R10. Breakdown record: fields, home, one-node rule, immutability, no plan paths

Home: `CIP:11-39`.

| Place | Quote | Disposition |
|---|---|---|
| `CIP:13` prose | "Each node records: `id`; `outcome` …; `kind` (`feature \| contract \| integration`)" | delete the field enumeration and the gates/order sentence; the template at `CIP:15-35` shows them. Keep file name, "even when it has one node", `ready` criteria, immutability |
| `CIP:13` | "It lives beside its plans under the Plan Home rule below: `<project-root>/tmp/…`" | replace with `It lives beside its plans (Plan Home).` (C17: this paraphrase already disagrees with `CIP:94`) |
| `PI:31` | "Take candidate cuts from the admitted basis: Program Design's owners and dependency edges" | delete through "…returns `program-design-gap`." (`CIP:37` owns authority); keep "Write the breakdown first, whole." |
| `SPD:55` | "Program Design's owners and edges (or, for a mechanics-only improvement, current-source ownership)" | replace with `The admitted basis supplies the candidate cuts (canonical-implementation-plan.md).` |
| `PI:31` / `CIP:86` | "If materially different cuts exist, pick one and record the choice, the alternatives" | keep `CIP:86`, delete from `PI:31` |
| `PI:31`, `PI:45`, `CIP:13` | "a topology change writes a new breakdown that marks which nodes' plans it supersedes" | keep `CIP:13`; delete in `PI:31`; `PI:45` keep "or writes a new breakdown" (routing) |
| `GCR:5` | "(the breakdown itself stores no plan paths or state)" | delete |
| `improvement-plan-template.md:102` | "it is call context, and the breakdown itself never records plan paths" | delete clause |
| `CIP:118` | "a breakdown that records plan paths, PR numbers, or progress" | keep (bad signal) |
| `PI:33`, `PI:44`, `CIP:39`, `plan-implementation/README.md:3` | plan written when its node becomes executable | keep `CIP:39` and `PI:33`; `PI:44` delete first clause "A later node's plan is written when its base exists;" |
| `CIP:106`, `SPD:68` | stack child whose parent head moves is stale | keep `CIP:106`; `SPD:68` last sentence delete |
| `CIP:13`, `CIP:33`, `SPD:62`, `OIG:29` | "riskiest unknown first" | keep `SPD:62` (teaching) and `CIP:33` (field); `OIG:29` → "Start executable nodes in the breakdown's order." |

### R11. Plan review (C4): who, when, compact skip, Advisor never approves

Home: `APR` (renamed, see §5).

| Place | Quote | Disposition |
|---|---|---|
| `PI:37` | "Main performs this review; the project's 🦉 Advisor joins only when the owner already requested one." | delete sentence |
| `PI:43` | "the plan review in step 9 already ran, so admission adds no gate" | delete sentence "The ready record carries … adds no gate." |
| `OIG:28` | "`plan-implementation` reviews each full plan before returning `ready` (…), so the orchestrator consumes" | replace with `Add no second plan review.` |
| `GCR:59` | "which reviews each full plan before ready" | delete (R9) |
| `APR:7` | "The Advisor's agreement is not required to proceed; Main owns the plan" | delete (APR:13 "advises and never approves", APR:33 "Main's call") |
| `APR:7` | "with an Advisor, changed slices go back to it once" | delete (APR:33) |
| `APR:15` | "The plan file carries no reviewer status, per the canonical contract." | delete (APR:33 "never in the plan file"; CIP:70) |
| `PI:37`, `PI:50`, `APR:15`, `APR:35`, `PIR:111` | compact plan records its skip reason | keep `APR:15` (definition), `PI:37` (call site), `PI:50` (completion); `APR:35` keep; fine |

### R12. Delegation of audit and research by unit

| Place | Quote | Disposition |
|---|---|---|
| `PIR:55` | "After recon, the main may cut a selected category into independent evidence units (one owner" | home is `audit-lanes.md:5` (branch-only: broad audit). Replace `PIR:55` with: `Delegate audit work only by evidence unit, never by whole category (references/audit-lanes.md); the main verifies each return before it counts.` |
| `audit-lanes.md:44` | "Do not turn the category list into a swarm; only evidence units cut from a category go to Workers." | delete second sentence (`:3`, `:5` say it) |
| `PIR:66` | "Delegate only evidence units cut under the Core Rules." | keep (short citation) |
| `practices-research/SKILL.md:8` | "including any cut of a source class into units and the verification of what unit Workers return" | delete the added clause (step 4 at `:25` owns it and ends "stays serial and yours") |
| `lane-packets.md:3` | "Inside one class, a corpus that splits into independent units may go one unit per Luna 🛠️ Worker" | delete sentence |
| `lane-packets.md:18` | "Unit Worker outputs are raw source notes in the same folder, which `evidence-ledger.md` already allows." | keep `Unit Worker outputs are raw source notes in the same folder.`; delete the rationale clause |

### R13. Sidekick execution responsibility in goal-contract duplicates OIG

`GCR:42-44` ("Select the Current Owner", two paragraphs) is a near copy of `OIG:12-14` and `OIG:27`, pre-existing duplication that this change extended with staffing, stacks, and plan authorship. Home: `OIG`. Replace `GCR:42-44` with: `The orchestrator routes the smallest owner that can resolve the current delivery decision, verifies decisive evidence, and continues the goal; execution responsibility is SKILL.md's Execution Responsibility.` (≈ 2 long paragraphs → 1 sentence.)

### R14. "A plan slice carrying its executor record already is the brief"

Home: `AJP:33`. Delete from `MA:87` ("A plan slice that carries its executor record … already is the brief.") and `GCR:44` parenthetical.

### R15. Workhorse routing to Luna via agent-router on Claude Code/Cursor

Home: provider pages (`native-providers-claude.md:17`, `native-providers-cursor.md:17`).

| Place | Quote | Disposition |
|---|---|---|
| `MA:93` | "Work that passes Workhorse fit … runs on Luna: natively on Codex, and through agent-router" | delete sentence (Runtime already says "no native model for the role → agent-router with Luna"; provider rows carry it) |
| `native-providers-claude.md:21` | "A unit that passes Workhorse fit … goes to Luna through agent-router, never to a native Claude model." | delete (row :17 says it) |
| `native-providers-cursor.md:21` | same sentence | delete |
| `native-providers-claude.md:21` | "Sonnet and Haiku are not catalog models and are never selected." | delete (Runtime rule step (2) already admits only listed lineages and names "Sonnet 4.x" as never qualifying) |

### R16. Main assesses each PR before its review

Home: `OIG:30` (step 4). Delete from `MA:12` ("Main assesses each completed PR before its independent 🔎 Review Sidekick examines it") → keep only "Main owns … assessment" which the sentence before already lists; `OIG:8` last sentence delete.

### R17. Independence of slices ("different files are not proof")

Home: `SPD:51` for the `independent` mark; `MA:136` (pre-existing Dispatch) for runtime.

| Place | Quote | Disposition |
|---|---|---|
| `MA:106` | "and different files are not proof of independence (Dispatch, below)" | delete clause |
| `MA:111` | criteria parenthetical | deleted under R1 |
| `APR:22` | "compare its write surfaces with every slice that may run beside it" | keep (it is the check method) |

### R18. Operator bright line / scripts

| Place | Quote | Disposition |
|---|---|---|
| `MA:39` | "Could a script do it? Then it is Operator work, or write the script and give it to one Operator." | home |
| `CAT:55` | "When many units would apply the same mechanical edit, write the script or codemod" | delete |
| `CAT:98` | "A procedure takes these rows when it passes Workhorse fit's Operator branch … not Operator work." | delete (`CAT:48` has the Operator branch; `MA:39` has "judgment … route back") |

### R19. Workhorse packet ↔ no discovery for bounded helpers

Home: `practices-collaboration/SKILL.md:16` (the entry step it modifies).

| Place | Quote | Disposition |
|---|---|---|
| `AJP:31` | "A Workhorse 🛠️ Worker or 🔧 Operator does no work-home discovery, board search, or trace" | keep as a packet pin but reword to the role scope: `The packet states that it is the whole context: no work-home discovery, board search, or trace.` (fixes C4) |
| `practices-show-me-your-work/SKILL.md:14` | "A bounded 🛠️ Worker or 🔧 Operator skips this entry: it reads its packet first, keeps no trace" | replace with `A bounded 🛠️ Worker or 🔧 Operator skips this entry (practices-collaboration).` |
| `AJP:33` | "A unit gets this packet only after it passes Workhorse fit in `model-catalog.md`." | delete (`CAT:57` "A Workhorse assignment uses the Workhorse packet") |

### R20. Token payloads restated at call sites

Home: `phase-return-tokens.md:10-13`. Delete the payload lists at `PI:43` ("with the breakdown identity, node id, plan path, and base"), `OIG:12` ("with the admitted basis and, for a later frontier, the breakdown identity and node id"), `IP:14` ("with the breakdown identity and node id"), `GCR:62,65`. Keep the token name only.

### R21. implement-plan admission restates CIP `admit`

`IP:19` (step 2) "including its ready breakdown, its node, and its recorded PR base", `IP:20` (step 3) "the breakdown is ready and lists the plan's node, the branch sits on the recorded base", `EAP:17-18`, and `CIP:110`. Home `CIP:110`. `IP:19` drop the "including…" tail; `IP:20` drop the added clauses (pre-existing step 3 is itself a copy of `CIP` admit; candidate to replace with "Proceed only on `admit`.").

### R22. Owner sees the PR map

`PI:10` "The owner sees the drawn PR map; per-PR plans and slices stay with Main." and `PI:32` (step 4). Delete from `PI:10`.

---

## 2. Deletion-test failures (padding)

Sentences whose removal changes no agent action. (Pure restatements are in §1; these are rationale, meta, or reminders.)

| Anchor | Quote | Why it fails |
|---|---|---|
| `CAT:55` | "Cost is why this is the default: at the dated snapshot below, Luna costs about an order" | rationale; duplicates `CAT:61` |
| `CAT:61` | "Source: Artificial Analysis … refresh it when the snapshot ages or prices move." | rationale only (D7). Nothing reads it to choose; belongs in the spec/changelog (see §5 behavior note) |
| `CAT:17` | "When Opus implements, the reviewer comes from another lineage (Grok or Astra)." | implied by the different-lineage rule `MA:42` |
| `CAT:17` | "Opus high is an escalation on evidence within Opus's band, not a default." | `CAT:5` already "do not automatically raise effort"; conflicts in tone with `CAT:123` "shares Opus medium's band" |
| `CAT:24` | "The Lead usually runs one at the owner's pick." | describes Main; `MA:12` owns Main's model choice |
| `CAT:65` | "Thinking level follows the job's direction and span; horizon follows its role." | the table gives rows; second clause is wrong per owner |
| `CAT:138` | "It still follows the different-lineage rule in `SKILL.md`, so it never reviews Grok-authored work." | restates `MA:42` |
| `MA:83` | "Direction, span, and horizon are the three task signals; `references/model-catalog.md` maps them" | `MA:89` MUST load already routes; and horizon is not a column in any row |
| `MA:106` | "This table is the one runtime home for … every other skill cites it." | meta-authoring note; changes nothing at runtime |
| `PI:10` | "This phase returns a token and names no orchestrator." | authoring rule (AGENTS.md:112), not agent behavior |
| `PI:34` | "This holds for either admitted basis." | admission (step 2) already covers both bases |
| `PI:43` | "The ready record carries every slice's executor record … so admission adds no gate." | rationale |
| `OIG:28` | "…reviews each full plan before returning `ready` (…), so the orchestrator consumes that ready result" | rationale; only "add no second plan review" is behavior |
| `SPD:35` | "Thirteen slices handed to one session as a single assignment is the failure this catches." | evidence anecdote |
| `SPD:36` | "A Cross-domain span alone is never the reason, since a Luna xhigh row covers it." | the rule "only when it fails Workhorse fit" already excludes it |
| `SPD:55` | "Complexity decides the Sidekick; size decides the slices." | keep as leading words only if the Sidekick-choice text below is deleted; today it precedes a paragraph that restates it |
| `APR:3` | "because a ready plan is immutable and the next reader is an executor who follows it literally" | rationale |
| `APR:9` | "Workhorse fit lives in …; the executor record lives in …" | fine only once; after R4 edits, APR:21 cites directly and this line is padding |
| `AJP:33` | "A plan slice that carries its executor record … supplies the pinned inputs, output, and stop" | keep; but see R14 (delete elsewhere) |
| `lane-packets.md:18` | "which `evidence-ledger.md` already allows" | justification |
| `GCR:5` | "(the breakdown itself stores no plan paths or state)" | reminder of CIP rule |
| `improvement-plan-template.md:102` | "it is call context, and the breakdown itself never records plan paths" | reminder |
| `IP:33` | "For a stack layer, that review judges the layer against its parent and this plan." | implementer takes no action on it |
| `orchestrator-design/SKILL.md:80` | "Those execution mechanics, seats, the staffing table …, and delegation belong to…" | the skill no longer reaches execution |
| `orchestrator-design/SKILL.md:78` | "Planning is Main's and happens here, before execution." | the MUST load in the same paragraph already makes it happen |
| `implementation-pr-wrapup/SKILL.md:30` | "Per-PR readiness is not delivery readiness; Main runs the breakdown's integration gates…" | wrap-up executor never runs gates |
| `CIP:102` | "The PR's Sidekick tier and what it dispatches follow the staffing table…" | no consumer of CIP acts on staffing |
| `native-providers-claude.md:21` | "Sonnet and Haiku are not catalog models and are never selected." | Runtime rule (2) already excludes them |

---

## 3. Conflicts (statements that disagree)

| # | Statement A | Statement B | Disagreement |
|---|---|---|---|
| C1 | `MA:77-81` "Horizon \| Role: The job → 🛠️ Worker or 🔧 Operator; One PR → 🐒 Sidekick; A stack → The Lead"; `CAT:9` "Horizon follows the role" | Owner (packet): role is continuity; horizon is how long the agent drives before the next correction, a property of the job | The model is wrong, not just repeated. Also `CAT:116-121` never use horizon as a column; the only operational horizon test is "a later slice depends on a choice the plan leaves open", which is a job property (it can apply to a Worker job too) |
| C2 | `CAT:80` "Luna max … is kept for a Luna Sidekick carrying a long PR" | `CAT:123` "Long-horizon Sidekick work is not in use, so Luna max shares Luna xhigh's band"; `MA:14` "horizon is one PR" | One says max has a use (long PR); the other says long-horizon Sidekick work is not in use and max equals xhigh |
| C3 | `CAT:55` "A boundary stop from a Workhorse unit is evidence about the cut, so the **assigner** re-slices or re-tags it" | `CIP:100` "returns to the **originating planner** … the implementer does not re-cut it"; `MA:114` "the Sidekick does not re-cut it" | For a dispatched slice, the assigner is the Sidekick, which is forbidden to re-cut. (For audit/research units the assigner is Main/researcher, which is fine.) Also `CAT:57` "Escalate on evidence (a boundary stop…)" reads as the executor escalating, while `IP:14`/`OIG:14` forbid re-running on a bigger model; only planner re-tagging is allowed |
| C4 | `AJP:31` "A **Workhorse** 🛠️ Worker or 🔧 Operator does no work-home discovery…"; `AJP:33` "A unit gets this packet only after it passes Workhorse fit" | `practices-collaboration:16`, `practices-show-me-your-work:14` "A **bounded** 🛠️ Worker or 🔧 Operator skips discovery" (any tier) | Scope differs: tier vs role. A Daily-driver Worker gets no packet rule saying "packet is your whole context" but the practices exempt it. Also a Luna Sidekick running Workhorse slices never gets the packet |
| C5 | `MA:110` staffing row 1: Sidekick = "Luna" (any Luna Sidekick row: high, xhigh, max) | `SPD:59` "a Luna **xhigh** Sidekick when every slice fits and every dependent choice is in the plan" | Narrower tier in the restatement |
| C6 | `CIP:13` "written by Main with `plan-implementation`" | `PIR:103,107` (`plan-improve-repo` step 7) writes a breakdown for each admitted improvement | Two writers of the breakdown; CIP names one |
| C7 | `CIP:13` plan-only breakdown home: "the durable plan home (`docs/specs/<spec>/plans/` or the repository's established home)" | `CIP:94` plan-only may also use "`<repo-root>/tmp/plan-workflows/` for temporary/advisory work" | The paraphrase drops the temporary option (a direct consequence of stating the home twice) |
| C8 | `canonical` + `MA:114`: a Workhorse stop goes "to the originating planner" / "back to Main" | `phase-return-tokens:22` Main resolves through the originating planner | Reconcilable, but two addressees are named in different places for the same return |
| C9 | `OIG:28` "return `ready-for-planning` to Main and stop this run" | `OIG:12` "Main resolves it … and returns here with the ready records"; `OIG` is Main's own skill | The orchestrator is Main; "return to Main" and "stop this run" describe Main returning a token to itself. Either the orchestrator loads `plan-implementation` (what B1 forbids) or it ends and a new run starts. The text says both |
| C10 | `MA:81`, `CAT:9,24,65,123` "the Lead (Main)" | `implementation-review/SKILL.md:10,24` "lead" = the 🔎 Review Sidekick; `skills-creation` "review lead" | "Lead" means Main in one skill and the Review Sidekick in another |
| C11 | `EAP:33` "The ready frontier is the smallest plan slice whose prerequisites are proven" | `CIP:39`, `PI:33`, `phase-return-tokens:10` "first frontier" / "later frontier" = executable breakdown nodes | "Frontier" means slices in one skill and PR nodes in another |
| C12 | `implementation-review/SKILL.md:10` "The review **unit** is one PR, or one stack layer" | `CAT:48-55` "unit" = one piece of work for one agent; `audit-lanes:5` "evidence unit"; `OIG:41` "that unit's convergence baseline" | Same word for a job, an audit sub-question, and a PR/layer review scope |
| C13 | `CAT:24` "Daily driver … The Lead usually runs one" | Spec A mental model: "Main (Opus medium / Astra high)"; `MA:12` owner chooses Main's model | Asserts a default for Main's tier the owner never set as a rule |
| C14 | `plan field executor: <Workhorse \| Daily driver>` (`CIP:100`) | field is named *executor* but carries a *tier*; the executor (Sidekick itself vs dispatched Worker) is decided later by the staffing table | The name promises the executor; the value is a model band |

---

## 4. Vocabulary map

### Terms for "a piece of work given to an agent"

| Term | Where it is used | Meaning in context |
|---|---|---|
| job | `MA:136` "separately assigned jobs"; `CAT:63-78` "Jobs inside a PR"; `CAT:9` "its job"; `AJP` title "Agent Job Packet" | a unit of work for one agent |
| assignment | `MA:8,14,34,87`, `OIG:12,29`, `IP:28`, `AJP:9,31` ("Workhorse assignment"), "one-PR assignment" (`MA:14`, `OIG:8,12`), "PR assignment" | both the work and the act of handing it; also a Sidekick's whole PR |
| unit | `CAT:5,48-55` (Workhorse fit "unit"), `MA:87` "independent units", `audit-lanes:5` "evidence unit", `practices-research:25` "per-unit inputs", `implementation-review:10` "review unit", `OIG:41` "that unit" | four different things (C12) |
| slice | `SPD`, `CIP:100`, `PI`, `IP`, `EAP`, `APR`, `MA:106-114`, `CAT:69-72` | a planned proof-bearing change inside one PR plan |
| task | `MA` "task category", `CAT:7` "Task signals", `CAT:104` "Task signals" column, `EAP:116` "task size" | the work being classified |
| procedure | `MA:29-39`, `CAT:48,98` | Operator work |
| node / PR / layer | `CIP`, `PI`, `OIG`, `implementation-review` | breakdown node = one PR; stack layer = a stacked node |
| frontier | `CIP:39`, `PI:33`, tokens ("first/later frontier"); `EAP:33` ("ready frontier" = slices) | two meanings (C11) |
| lane | legacy: `audit-lanes.md` (now "categories"/"units"), `lane-packets.md` (now "source-class checklists") | file names only |

### Terms for tiers and roles

| Term | Kind | Where used as a role (drift) |
|---|---|---|
| Workhorse / Daily driver / Frontier | model tier (`CAT:21-44`) | "Workhorse 🛠️ Worker" (`native-providers-claude:17`, `native-providers-cursor:17`, `AJP:31`, pre-existing `implementation-pr-wrapup:40,50,58,67`); "Daily-driver 🛠️ Worker" (`native-providers-*:18`, `PIR:55`, `audit-lanes:5`); "Workhorse Sidekick" (`MA:14`); "Daily-driver Sidekick" (`MA:14`, `OIG:14`, `GCR:44`); "Workhorse route" (`IP:14`, `EAP:35`); "Workhorse turn" (`MA:118`); "Workhorse assignment" (`AJP:31`); `executor: <Workhorse \| Daily driver>` (`CIP:100`) |
| Luna / Sol / Opus | model lineage | "Luna 🛠️ Worker" (`practices-research:25`, `lane-packets:3`, `PIR:55`, `audit-lanes:5`, `OIG:14`, `GCR:44`, `MA:108`); "Luna Sidekick" (`MA:14,114`, `CAT:80,123`, `SPD:45`); "Opus Sidekick" (`CAT:123`, `SPD:45`, `APR:22`) |
| 🔧 Operator / 🛠️ Worker / 🐒 Sidekick / 🔎 Review Sidekick / 🦉 Advisor | role (continuity, `MA:29-37`) | correct |
| Main / orchestrator / Lead | the user-facing agent | three names; "Lead" also means review lead (C10) |
| direction / Guidance; complexity / Architectural span | task signals | `CAT:9` pairs both names: "direction (Guidance), complexity (Architectural span)" |

### Proposed single vocabulary (to evaluate)

- **job**: any piece of work handed to one agent. Every job has three signals: **direction** (the Guidance scale), **span** (the Architectural span scale), **horizon** (how long the agent drives before its next correction or instruction). Retire "task" for these signals and "unit" as a synonym.
- **horizon** (job property, not role): *short* = the job's choices are all fixed by its brief or plan (a Luna Worker slice, a Luna Sidekick on a fully decided PR); *long* = the agent makes choices later work builds on (today's "a later slice depends on a choice the plan leaves open"). This one word replaces the 11 restatements in R2 and lets the staffing table read "all Workhorse, short horizon → Luna".
- **slice**: a planned job inside one PR plan. The field becomes `tier: <Workhorse | Daily driver> · <direction>/<span>/<horizon> · <reason>` (rename from `executor`, C14).
- **node** / **PR** / **layer**: breakdown vocabulary, unchanged. Replace "first/later frontier" with "executable nodes" to free "ready frontier" for slices (C11).
- **review scope**: one PR or one stack layer (replaces "review unit", C12).
- **evidence unit** (audit) and **corpus unit** (research): keep "unit" only here, as the split of one category or source class into jobs.
- **assignment**: the handed-over job plus its packet or commission (noun for the handoff, not the work). "One-PR assignment" → "a PR".
- **role** = continuity: 🔧 Operator and 🛠️ Worker do one job and are gone; 🐒 Sidekick persists across jobs; 🔎 Review Sidekick persists across one review scope's rounds; 🦉 Advisor persists on owner request.
- **tier** = model band (Workhorse, Daily driver, Frontier). Never a role qualifier: write "🛠️ Worker on the Workhorse tier" or put the tier in a column, never "Workhorse 🛠️ Worker".
- **Main**: retire "Lead" and use "orchestrator" only as the name of the skill's role inside that skill.
- Rename `audit-lanes.md` → `audit-categories.md` and `lane-packets.md` → `source-class-checklists.md` only if a rename pass is already happening (low value on its own).

---

## 5. Consolidated shape per file

Behaviors kept: every D1-D20, C1-C4 (Spec A) and B1-B17, CB1-CB2 (Spec B) outcome survives in its home; the edits remove restatements and fix C1-C14. D18's "horizon by role" clause is the one accepted item the owner has since contradicted (C1); it is replaced, not kept.

Estimates are net file lines (these files are paragraph-per-line, so sentence counts are given too).

| File | Owns after cleanup | Net removable |
|---|---|---|
| `shared-references/canonical-implementation-plan.md` | breakdown record (template + ready criteria + authority + executability), plan record, slice tier field, admit/route/blocked | −3 lines (−10 sentences: CIP:13 field prose, :41 gate running, :102 staffing) |
| `shared-references/phase-return-tokens.md` | token payloads and who resolves them (incl. "PRs the defect does not touch continue") | 0 |
| `skills/implement-plan/SKILL.md` | admission via CIP and the slice loop; dispatch = one citation | 0 lines (−6 sentences) |
| `skills/implement-plan/references/execution-and-proof.md` | pre-edit check, frontier, proof, surprise classes (home of the plan-defect class incl. Workhorse stop) | −1 line (−2 sentences) |
| `skills/implementation-pr-wrapup/SKILL.md` | one PR per run; `gh stack` rebase/submit mechanics | 0 lines (−1 sentence) |
| `skills/implementation-review/SKILL.md` | review scope = one PR or stack layer; plan partitions, rails govern | 0 lines (−2 clauses) |
| `skills/implementation-review/references/finding-and-reduction.md` | convergence per review scope | 0 |
| `skills/manage-agents/SKILL.md` | roles by continuity; signals incl. horizon as a job property; staffing table (sole home); runtime | −4 lines (−10 sentences) |
| `skills/manage-agents/references/agent-job-packet.md` | job packet pins for Worker/Operator jobs, incl. "the packet is the whole context" | −0 lines (−1 sentence) |
| `skills/manage-agents/references/model-catalog.md` | tier table, Workhorse fit, role tables with direction/span/horizon cells, jobs table (or merged into the Worker table as an examples column) | −12 lines (Task signals section, :17, :24 s2, :55 two sentences, :65, :80, :98, :123, :138 s2; snapshot moved out if D7 is reconsidered: −4 more) |
| `skills/manage-agents/references/native-providers-claude.md` | host route rows | 0 lines (−2 sentences) |
| `skills/manage-agents/references/native-providers-cursor.md` | host route rows | 0 lines (−1 sentence) |
| `skills/orchestrator-design/SKILL.md` | continued delivery ends at ready breakdown + first plans, handed to OIG | −1 line (:80 paragraph to one sentence; :78 −1 sentence) |
| `skills/orchestrator-implementation-goal/README.md` | human overview | 0 |
| `skills/orchestrator-implementation-goal/SKILL.md` | admit → commission per PR → sequence stacks/parallel → assess → review per scope → wrap-up → run gates | −1 line (−15 sentences) |
| `skills/orchestrator-implementation-goal/agents/openai.yaml` | prompt | 0 |
| `skills/orchestrator-implementation-goal/references/goal-contract-and-routing.md` | orientation block, routing table (short rows), verify/recover, finish | −2 lines (−10 sentences; Select the Current Owner collapses to one sentence) |
| `skills/plan-handoff/SKILL.md` | one PR plan + breakdown pointer | 0 |
| `skills/plan-handoff/references/handoff-template.md` | template | 0 |
| `skills/plan-implementation/README.md` | human overview | 0 |
| `skills/plan-implementation/SKILL.md` | planning route: breakdown → map → per-node plans → review → token | 0 lines (−8 sentences) |
| `skills/plan-implementation/agents/openai.yaml` | prompt | 0 |
| `skills/plan-implementation/references/advisor-plan-review.md` → `plan-review.md` | Main's pre-ready plan review method; Advisor optional | −3 lines (−7 sentences) |
| `skills/plan-implementation/references/slice-and-proof-design.md` | obligations, slice kinds, tier decision (cites fit), throughput checkpoint, PR cut, PR independence test, edges, proof | −3 lines (−9 sentences) |
| `skills/plan-improve-repo/SKILL.md` | audit + admission; unit delegation is one cited line | −1 line |
| `skills/plan-improve-repo/references/audit-lanes.md` | categories as coverage dimensions; evidence-unit cut and packet (sole home) | 0 lines (−1 sentence) |
| `skills/plan-improve-repo/references/improvement-plan-template.md` | template | 0 lines (−1 clause) |
| `skills/practices-collaboration/SKILL.md` | entry discovery for Main and Sidekicks; bounded helpers skip (sole home) | 0 |
| `skills/practices-research/SKILL.md` | walk; step 4 corpus-unit branch (sole home) | 0 lines (−1 clause) |
| `skills/practices-research/references/lane-packets.md` | checklists | 0 lines (−1 sentence, −1 clause) |
| `skills/practices-show-me-your-work/SKILL.md` | trace entry; helper exception cited | 0 lines (−1 sentence) |

Total: roughly −32 file lines, about −95 sentences, out of +432/−185 in the diff (about a quarter of the added prose).

### Behaviors that are themselves redundant (for the owner to decide, not for silent removal)

- **D7 dated cost snapshot** (`CAT:59-61`): rationale only; no agent chooses differently for reading it. Move to the spec or changelog.
- **D5 "Sonnet and Haiku are never selected"**: already enforced by the Runtime model-id rule; the provider-page sentence adds nothing.
- **D19 jobs table** (`CAT:63-80`) restates the Worker role table in job words (`Luna medium` ↔ "Exact steps; Local", etc.). Merge into the Worker table as an "example jobs" column, or keep the jobs table and drop the task-signal cells from the Worker table; not both.
- **D20 escalation list** (`CAT:11-15`) restates what the Sidekick and Worker rows already encode. Keep one: the rows.
- **D18 horizon clause** ("a Worker's horizon is its job, a Sidekick's one PR, the Lead's the stack") conflicts with the owner's current model (C1).
- **B15** is a meta-instruction for the implementer of the specs; nothing in runtime text should carry it (it surfaces as `MA:106` "every other skill cites it").

---

## 6. Top 10 edits by value

1. Redefine horizon as a job property in `MA` Select an agent (how long the agent drives before its next correction), delete the role→horizon table and `CAT:9,65,80,123`, and write "long horizon" where 11 places spell out "a later slice depends on a choice the plan leaves open" (fixes C1, C2).
2. Make `MA:106-114` the only statement of Sidekick tier and dispatch: cut the restatements at `MA:14`, `OIG:14,27,29`, `GCR:42,44`, `IP:14`, `EAP:35`, `SPD:45,59`, `CIP:102`, `orchestrator-design:80`, and move the independence criteria from the table cell to `SPD:51` (fixes C5).
3. Keep the Workhorse boundary-stop rule only at `CIP:100` plus the `EAP:79-82` class; delete it from `CAT:55`, `MA:114`, `OIG:14`, `IP:14,31`, `EAP:40`, `SPD:39`, and fix "the assigner re-slices", which contradicts "the Sidekick does not re-cut" (fixes C3).
4. Stop using tier as a role: rename the plan field `executor:` to `tier:`, rewrite "Workhorse/Daily-driver/Luna 🛠️ Worker" and "Luna/Opus Sidekick" as role plus tier, scope the packet's no-discovery pin to all bounded Workers and Operators, and retire "Lead" for Main (fixes C4, C10, C13, C14).
5. Collapse `GCR:42-44` (Select the Current Owner) to one sentence pointing at `OIG` Execution Responsibility. It is a second copy of `OIG:12-14` that this change grew further.
6. Say once in `OIG:8` that the orchestrator admits and never authors plans, and delete the "Main, in its own session, outside this skill" repeats at `OIG:12,23,28,45`, `GCR:42,59`, `PI:10`, `orchestrator-design:78`; resolve the "return to Main and stop this run" incoherence (C9).
7. Give stack and parallel sequencing one home (`OIG:29`) and give review topology one home (`implementation-review:10`, `finding-and-reduction:111`). Delete the copies in `MA:14,104`, `OIG:8,12,33-36,41,45`, `GCR:71,79-80,91,108`, `IP:32-33`, `orchestrator-design:80`.
8. Give running integration gates one home (`OIG:37`). Delete the execution text from `CIP:41`, `MA:12`, `implementation-pr-wrapup:30`, `GCR:93-94,100`.
9. Rename `advisor-plan-review.md` to `plan-review.md` (and its three callers). Cut its internal repeats: the `APR:7` checklist vs `APR:21-25`, "Advisor never approves" said three times, the no-reviewer-status line. Cite Workhorse fit at `APR:21,23` instead of restating conditions 1-4.
10. Trim `CAT` padding and the three-way duplicate unit fan-out. On the catalog side, delete `CAT:15-17`, `:24` s2, `:55` cost and script sentences, `:98`, `:138` s2. On the fan-out side, `PIR:55` becomes one line citing `audit-lanes:5`, and the added sentences in `practices-research:8` and `lane-packets:3,18` go.
