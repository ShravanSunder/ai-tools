# 2026-08-07 — manage-agents dispatch discipline (multi-run skill-change spec)

Status: **accepted-to-implement (r8)** — r6 accepted Runs 1–3 (implemented); r7 added Run 4 (capability economics, history rules, ACPX context provisioning, parallelizability — D14–D17, L11–L14) on user direction 2026-08-08; r7 scoped delta review returned 2 blockers + 6 important + 1 minor, all fixed in r8 with reviewer-authored smallest fixes; see Spec-review record for both acceptance bindings
Owner plugin: `shravan-dev-workflow`
Doc role: working memory for a sequenced skill change; after the last run lands, `docs-maintain` owns disposition.

## Targets and runs in sequence

Skill target for every skills-creation run: `plugins/shravan-dev-workflow/skills/manage-agents/`.

| run | name | surfaces | depends on |
|-----|------|----------|------------|
| Run 1 | Pattern selection and Operator discipline | main path, depth, proof | — |
| Run 2 | Job planning for subagent-driven development + lens revision + trigger sharpening | trigger, main path, depth, proof | Run 1 (selection owner settled first) |
| Run 3 | Job-packet slimming and human readability | main path, depth, proof | Run 1 (pattern vocabulary settled) |
| Run 4 | Capability economics, history rules, ACPX context provisioning, parallelizability | main path, depth, proof | Runs 1–3 (patterns, job graph, packet settled) |
| Changeset C | Loading enforcement (prompt bright line + Claude Code hook) | none (non-skill surfaces) | Runs 1–4 landed |

Each skills-creation run names exactly one skill target (`manage-agents`). Changeset C touches no skill surface and is not a skills-creation slice; it is tracked here because it serves the same success definition and must land in coordination with the skill runs.

## Canonical vocabulary

Used verbatim in the description, success definitions, call sites, and proof fixtures (spec-review finding: phrase drift weakens the under-triggering repair):

- leading phrases: **subagent-driven development**, **planning agent jobs**, **parallel subagents**
- decomposition predicate: **the request names more than one outcome or action, any work could run in parallel, or you are unsure one bounded packet covers the task**
- mechanical job types: **running tests or builds, watching CI or PR checks, monitoring, scraping, grouping logs into a report**
- job closure: **a job yields at most one assignment-bound receipt and always closes at its named parent verification point**

## Problem and evidence

1. **Pattern selection is not taught as a decision.** `SKILL.md` describes the four patterns (lines 16–76) but has no symptom-to-pattern selection step for prompts that never name a pattern. Source: user direction 2026-08-07 ("teach the agent how to use delegate and sidekicks and advisors when I don't do that right now"). Frequency of misselection is a user observation, not measured — hypothesis.
2. **Mechanical actions are not reliably routed to Operators.** The Operator section (lines 64–76) defines the pattern but no rule makes it the required route for mechanical work when dispatching. Source: user direction 2026-08-07 ("I want operators to always be used for mechanical actions"). Not reproduced this run — hypothesis on frequency, directive on intent.
3. **Delegate table contradicts its own prose.** Line 55 says model category "Frontier, Balanced, or Mini"; the table (lines 57–62) has no Mini row. Verifiable internal inconsistency in the shipped file.
4. **No Luna-max option for Mini Delegates.** User direction 2026-08-07.
5. **The skill owns one dispatch, not a job plan.** Workflow steps 1–4 (lines 116–137) are per-dispatch; nothing owns decomposing a task into a job graph before the first dispatch, and the opening mental model (lines 8–14) names only the single ordered dispatch decision. Source: user direction ("use the skill to plan jobs and use subagent-driven development").
6. **Loading is probabilistic only.** The description (line 3) and the `my_agents.md` featured-skills row are the only layers ensuring the skill loads before a dispatch; both are suggestions the model can rationalize past. No deterministic gate exists on subagent dispatch. Source: user direction ("make sure manage-agents is used for any invocation of subagents"); sessions skipping the skill is a user observation — not reproduced this run.

## Success definition

Overall: on any task requiring subagents where the user has not named a pattern, the agent loads `manage-agents` before the first dispatch; when the decomposition predicate holds it produces a job graph that governs every later dispatch; it names the pattern per job from the selection guide before any model or runtime choice; and it routes every mechanical dispatched job to an Operator on the directed models.

Per run:

- **Run 1:** given a task containing at least one mechanical action and one judgment task, with no pattern named by the user, the agent (a) states the chosen pattern per job before choosing model or runtime, (b) dispatches the mechanical work as an Operator with OpenAI Luna high or xhigh as first choice, (c) routes the judgment portion back to the parent, which decides itself or dispatches a separate Delegate reasoning assignment, and (d) can select `Mini | OpenAI Luna | max` for a bounded Mini Delegate assignment. Checkable: the pressure scenarios below fail a wrong-but-named pattern, not just an omitted label.
- **Run 2:** given a task where the decomposition predicate holds, the agent produces a job graph — jobs, dependencies and parallel-safety, parent verification points — before the first dispatch, assigns each job's pattern at the existing step 1, and the graph governs the order and verification point of every later dispatch. Prompts using "subagent-driven development", "planning agent jobs", or "parallel subagents" — or handing off a mechanical job type — load the skill; the near-miss matrix stays quiet.
- **Changeset C:** in Claude Code, a `Task` dispatch in a session where `manage-agents` SKILL.md has not been read is blocked with stderr instructing the agent to load it first; after loading, the same dispatch proceeds. `my_agents.md` carries the bright line and rationalization table. Coverage on Codex and Cursor remains layers 1–2 (trigger + prompt) and the doc says so; Run 2 proof is never claimed to close the any-invocation constraint.

## Decisions table

Defaults taken; strike any row to change the spec (a struck row after acceptance is an ordinary edit and re-review follows the Acceptance Binding).

| # | decision | default taken | rationale |
|---|----------|---------------|-----------|
| D1 | Scope of "Operators always for mechanical actions" | Bright line on **dispatch**: any job handed to a subagent that is a bounded mechanical procedure (the canonical mechanical job types: running tests or builds, watching CI or PR checks, monitoring, scraping, grouping logs into a report) MUST use the Operator pattern. The parent may still run trivial one-shot commands inline; long-running watches/monitors SHOULD be dispatched to an Operator rather than babysat by the parent. | Reading the directive as dispatch discipline, not a ban on the parent's own shell. Spec review (mental-model-fit) confirmed this is consistent with the existing Operator authority boundary. |
| D2 | Operator model steering | OpenAI Luna high/xhigh is the named first choice. **OpenAI Terra is removed from the Operator table entirely** (user strike, 2026-08-07). Cursor Composer 2.5 remains the sole declared fallback when Luna is unavailable in the runtime. Preference is expressed in a separate Preference column, never inside the model-category value (rule-agreement finding: `Mini (preferred)` would mutate the category the packet records; a `Route` column name collided with the runtime meaning of route). | User directed Luna high/xhigh and struck Terra; keeping one declared fallback prevents undeclared deviations on runtimes without Luna. |
| D3 | Delegate Mini row | Add `Mini \| OpenAI Luna \| max` to the Delegate table as an option (not the default Delegate category). Fixes the prose/table inconsistency at lines 55–62. | User asked for Luna max as an option for Mini Delegates; the prose already promises a Mini category. |
| D4 | Selection guide placement and teaching depth | Inline in `SKILL.md`: a "When to call what" table in explicit **if-this-job-type-then-this-pattern** form (user direction 2026-08-07: "be clear — if this type of job then use this pattern, especially for Operator"), where **every pattern row** carries (a) the job type to match, (b) one good-selection signal, (c) one mis-selection trap (e.g. Sidekick chosen for a one-shot bounded assignment; Advisor asked to execute), and (d) selection is done before any model or runtime choice. The Operator row enumerates the canonical mechanical job types. No new reference. | Pattern selection is an all-run decision; body owns it. The if/then row form leaves no judgment call at the row boundary. Spec review (depth-coverage) found the r1 inventory Operator-heavy: every pattern needs the same teaching slots or the scenario passes wrong-but-named patterns. |
| D5 | Operator rationalization table and judgment routing | Bright line paired with three named escape hatches: "it's faster to do it myself" (dispatch discipline exists for parent attention, not speed), "this needs judgment" (split it: the procedure goes to the Operator; the judgment routes back to the parent, which decides itself or dispatches a **separate Delegate reasoning assignment**), "a Delegate can handle it" (Delegates are for bounded reasoning work; procedures are Operator work). Operator escalation authority stays owned by `agent-job-packet.md`. | Spec review (rule-agreement) caught r1 giving judgment two owners; this wording agrees with the shipped Delegate contract (review/reasoning assignments are legitimate Delegate work) and the Operator decision packet. |
| D6 | Job-planning ownership and ordering | New spine step 0 in `SKILL.md`: identify jobs, dependencies and parallel-safety, and parent verification points — **step 0 does not choose patterns**. The existing step 1 keeps sole ownership of pattern choice and annotates the graph, per job, before any model or runtime choice. Call site, verbatim: `IF the request names more than one outcome or action, any work could run in parallel, or you are unsure one bounded packet covers the task, load references/job-planning.md and return the job graph: jobs, dependencies and parallel-safety, and parent verification points.` The opening mental model is revised to two nested levels: plan the job graph when the predicate holds; run the ordered dispatch decision once per job; the graph owns decomposition, sequencing, and verification points, and governs every later dispatch. `references/job-planning.md` is the teaching owner and MUST carry: what to inspect when cutting jobs, one good and one bad decomposition, and when to stop decomposing; it never restates the Dispatch packet field list from `agent-job-packet.md`. | Spec review: three lanes converged on r1's double ownership of pattern choice, circular predicate ("more than one job exists" requires the decomposition it gates), unrevised opening lens, and drifting predicate phrasings. The uncertainty clause makes the predicate answerable before decomposing. Binding the teaching outline prevents a ceremony-only reference that still passes a shape-gated proof. |
| D7 | Trigger wording — full proposed description | `Always use when using or dispatching an advisor, sidekick, delegate, operator, or any subagent; when handing off to a subagent mechanical work such as running tests or builds, watching CI or PR checks, monitoring, scraping, or grouping logs into a report; for subagent-driven development, planning agent jobs, or parallel subagents; deciding how to call or coordinate subagents for implementation, TDD and testing, research, reviews, monitoring, or other bounded work; choosing model capability. Use for native subagents and ACPX subagents. Not for owning the research or evidence workflow itself (research-swarm) — load this skill whenever that workflow dispatches subagents.` (≈680 chars, within the 1024 limit; "handing off to a subagent" keeps bare inline commands from matching — trigger-routing finding.) | Spec review (trigger-routing): r1 published only phrases, so routing could not be judged. `research-swarm` ("bounded subagent research lanes") competes for load on research-dispatch prompts, so that boundary lives on the trigger surface. User direction 2026-08-07: the trigger should encourage loading for the mechanical job types — they are named as trigger situations, not workflow steps, per `frontmatter-design.md`. `orchestrator-design` showed no trigger-word collision — no boundary added against it. |
| D8 | Enforcement layering | Three layers, honestly labeled: (1) trigger (D7), (2) `my_agents.md` bright line + rationalization table in the Subagents section (devfiles change), (3) Claude Code `PreToolUse` hook on the `Task` tool in `plugins/shravan-dev-workflow/hooks/` that greps the session transcript for a `manage-agents` SKILL.md read and exits 2 with a load instruction when absent. Codex and Cursor get layers 1–2 only; no pretense of full coverage. | Only a hook is deterministic; wording alone cannot satisfy "any invocation". Hook mechanics follow the documented gotchas in `AGENTS.md` (transcript uses `"name"` not `"tool_name"`; version bump required; `bash ${CLAUDE_PLUGIN_ROOT}/...` invocation). |
| D9 | Authoring basis | `user-directed intent` for all runs — this spec's commission is the 2026-08-07 user direction. No RED reproduction required; pressure scenarios are authored as the GREEN proof target. Sessions-skip-the-skill and misselection frequency stay labeled as unreproduced hypotheses. | skills-creation step 2: user-directed intent may draft from an approved success definition without RED. Manufacturing a RED here would be theater. |
| D10 | Hook is a sensitive surface | `references/security-gate.md` is loaded and its allowed/disallowed/blocked/deferred decision is recorded **before** the hook script is outlined or written in Changeset C. | Hook scripts execute on every agent event; skills-creation names scripts/hooks as gated surfaces. |
| D11 | `my_agents.md` edit routing | The bright line lands in `~/dev/devfiles/shared/my_agents.md` (Subagents section) as a devfiles change: separate changeset, private-safe wording, no commit without explicit user approval (devfiles repo rule), devfiles changelog entry. | Cross-repo coordination; devfiles has its own commit gate and changelog contract. |
| D12 | Job-packet slimming | Rewrite the `agent-job-packet.md` Dispatch block from 21 fields to the ~10-line `job packet` in L10: the five routing fields (`model category / exact model / reasoning effort`, `model lineage`, `host`, `runtime`, `provider`) merge into one `route:` line that still surfaces category and lineage explicitly (`<category> / <lineage> — native | acpx <provider> — <id> @ <effort>`), so every pre-packet decision in the L1 ordered chain has a recorded landing; `host` alone is dropped as a key — native runs on the current harness and the ACPX `<provider>` names the external host; `parent conversation history` + `workspace access` + `write scope` merge into one `access:` line; `receipt expected` + `receipt scope` + `assignment id` + `decision target` merge into one `return:` line that keeps the four session-ledger binding identifiers (assignment id, decision target, source/head version, plus session identity for persistent patterns); `assignment purpose` and `continuity reason` are deleted (no consumer; `session-ledger.md` owns continuity); `lane:` stays a top-level line used only for swarm dispatches. `SKILL.md` step 3's completion line is updated to the new field names in the same cutover, and `session-ledger.md`'s receipt lines adopt the same `return:` vocabulary. | Verified consumers are only `SKILL.md` step 3 and `session-ledger.md` staleness matching; the current block records one routing decision on five lines and restates assignment id / decision target inside receipt scope (drift risk). Binding fields are merged, never dropped. User direction 2026-08-07 ("verbose, should be more focused"). |
| D13 | Packet human readability | All three blocks in `agent-job-packet.md` (job packet, decision packet, agent result) use a two-column layout: key, colon, then a space-aligned value column (spaces, not tab characters — tabs render inconsistently across terminals and diffs). Keys are one word where possible. | User direction 2026-08-07 ("make it easy for humans to read; I can't tell as well; use tabs after colons"). Alignment is the intent; spaces are the stable encoding of it. |
| D14 | Mini-first capability economics | New `SKILL.md` section "Capability Economics" (L11) between the selection table and Patterns: pattern picks the shape, the model category prices it; choose the minimum category the job's judgment requires; Mini (OpenAI Luna) is super cheap and is the default for grunt work — a Mini agent can be a Sidekick, Delegate, or Operator, because pattern is work/continuity/authority, not model size. Sidekick table gains `Mini \| OpenAI Luna \| high, xhigh, or max`. Escalation is symptom-named (ambiguous tradeoffs, cross-module design, high-stakes judgment → Frontier; bounded reasoning with clear anchors → Balanced); "the task feels important" is called out as a non-reason — importance routes verification to the parent, not cost to the model. | User direction 2026-08-08 ("mini like luna is super cheap, can be used for many occasions to save costs, to do grunt work, should be very preferred; they can be sidekicks, delegates or operators"). Placing preference in one section keeps the pattern tables clean (D2's lesson). |
| D15 | History economics and the reviewer bright line | Context And Access "Parent Conversation History" is rewritten (L12): reviewers get a bright line — a review agent NEVER receives parent conversation history, with the "it will review faster with context" rationalization named; non-reviewers choose history by cost and benefit — with native Mini agents history is cheap and may be generous up to a reasonable share of the model's context limit, with Frontier agents give the minimum that preserves the decisions the job depends on. | User direction 2026-08-08 ("review agents should never have conversation history"; "cheap up to their context limit in a reasonable fashion"). The shipped line ("Reviewers: none") states the rule but teaches no economics and names no rationalization. |
| D16 | ACPX context provisioning | ACPX Dispatch gains a context-provisioning rule (L13): ACPX agents start with zero parent context; before dispatch decide what the job needs to abide by its function and encode it in the packet (goal and decision target, settled decisions it must not relitigate, exact paths and diffs, prior attempts, sources); when the job depends on long parent history that cannot be summarized into a packet, prefer native dispatch — use ACPX when lineage diversity or independence matters more than shared history. | User direction 2026-08-08 ("when using acpx, we should figure out when it's appropriate and how to give conversation history and context so the agent can abide successfully by its function"). ACPX cannot inherit the parent conversation; only the packet crosses the boundary. |
| D17 | Parallelizability and context conservation | `references/job-planning.md` gains (L14): context conservation as a named cut reason — work that would flood the parent window (large reads, log scans, wide searches, long watches) is a job to hand off even when sequential, returning a bounded receipt instead of raw bulk; and a "What Parallelizes Well" section — read-only evidence gathering, independent review lanes, disjoint write scopes, and mechanical procedures with no shared state parallelize; write-dependent sequences, shared-file jobs, and work consuming another job's unverified output do not; when unsure, sequence. | User direction 2026-08-08 ("part of using subagents is really knowing what is parallelizable, or what is good for subagents to do as pieces of work to conserve context"). Extends the Run 2 teaching owner rather than adding a second decomposition home. |

## Proposed language (normative wording)

This section is the steering surface of the change — the words the agent will actually read. Implementation runs copy this wording; deviations are named on the run note's `spec-boundary` line. The wording deliberately leans on leading words the model already holds (`bright line`, `job graph`, `stop condition`, `one receipt per job`, `subagent-driven development`) rather than coined terms.

### L1 — Revised opening mental model (`SKILL.md`, replaces lines 8–14; Run 2)

```text
The agent pattern owns work, continuity, authority, cardinality, and the
minimum capability category. A model category is a model-plus-thinking
combination.

Dispatch has two nested levels. The job graph owns decomposition,
sequencing, and parent verification points. Each job then runs one
ordered dispatch decision:

pattern -> model category -> model lineage -> reasoning requirement
        -> native availability -> native or ACPX runtime -> exact model id
        -> permissions -> packet -> receipt

When the request names more than one outcome or action, any work could
run in parallel, or you are unsure one bounded packet covers the task,
build the job graph first; it governs the order and verification point
of every later dispatch. A job yields at most one assignment-bound
receipt and always closes at its named parent verification point.
```

### L2 — "When to call what" selection table (`SKILL.md`, new section before Patterns; Run 1)

```text
## When To Call What

Choose the pattern from the job type, before any thought about model
or runtime. Inspect three things: does the job need judgment or is it
a procedure; will you resume this relationship or discard it after one
receipt; who owns the final claim. If the job matches a row, use that
row's pattern — no judgment call is left at the row boundary.

| if the job is | then use | good-selection signal | mis-selection trap |
|---------------|----------|-----------------------|--------------------|
| a strategic, ambiguous, or high-stakes decision where you stay the executor | Advisor | you keep driving; the Advisor returns candidate guidance you validate | asking the Advisor to execute or edit — that is Delegate or Sidekick work |
| multi-turn delegated work you will resume and steer | Sidekick | a named relationship with a ledger outlives this assignment | a Sidekick for a one-shot bounded assignment — that is a Delegate |
| one bounded reasoning assignment: research, review, an implementation slice | Delegate | you can write the packet's stop condition in one sentence and discard the agent after the receipt | handing a Delegate a mechanical procedure — that is Operator work at Mini cost |
| a bounded mechanical procedure: running tests or builds, watching CI or PR checks (`gh` watch), monitoring, scraping, or grouping logs into a report | Operator | the procedure needs no judgment; anything requiring judgment routes back to you | "this needs judgment, so no Operator" — split it: procedure to the Operator, judgment back to you |

Selection is done when every job names its pattern and no model has
been named yet.
```

### L3 — Operator bright line and rationalization table (`SKILL.md`, inside the Operator section; Run 1)

```text
Bright line: any job handed to a subagent that is a bounded mechanical
procedure MUST be an Operator. The parent may run trivial one-shot
commands inline; long-running watches and monitors SHOULD go to an
Operator rather than be babysat.

| rationalization | reality |
|-----------------|---------|
| "it's faster to do it myself" | dispatch discipline buys parent attention, not speed; the watch you babysit costs every turn until it ends |
| "this needs judgment" | split it: the procedure goes to the Operator; the judgment routes back to you, and you decide or dispatch a separate Delegate reasoning assignment |
| "a Delegate can handle it" | Delegates are for bounded reasoning work; procedures are Operator work at Mini cost |
```

### L4 — Model table rows (`SKILL.md`; Run 1)

Operator table, replacing the current three rows (D2 — Luna first choice, Terra removed, one declared fallback; the category cell stays `Mini`, preference lives in its own column, and `route` is reserved for the packet's runtime line):

```text
| Model category | Model lineage       | Thinking    | Preference                     |
| -------------- | ------------------- | ----------- | ------------------------------ |
| Mini           | OpenAI Luna         | high, xhigh | preferred                      |
| Mini           | Cursor Composer 2.5 | no thinking | fallback when Luna unavailable |
```

Delegate table, one added row (D3):

```text
| Mini             | OpenAI Luna         | max         |
```

### L5 — Spine step 0 (`SKILL.md` Workflow, before current step 1; Run 2)

```text
0. IF the request names more than one outcome or action, any work could
   run in parallel, or you are unsure one bounded packet covers the
   task, load `references/job-planning.md` and return the job graph:
   jobs, dependencies and parallel-safety, and parent verification
   points. Step 0 identifies jobs; it does not choose patterns — step 1
   owns pattern choice and annotates the graph per job.
   - Completion: every dependency is named, and each job names its
     expected receipt and the parent verification point that closes
     it. Actual receipts arrive at step 3; step 0 completes before any
     dispatch.
```

Current step 1 gains one sentence: `When a job graph exists, choose the pattern per job and annotate the graph before any model or runtime choice.`

### L6 — Frontmatter description (`SKILL.md` YAML; Run 2)

The full string in D7 — reproduced there verbatim; the canonical phrases (`subagent-driven development`, `planning agent jobs`, `parallel subagents`) appear in the description, the success definitions, and the proof fixtures unchanged.

### L7 — `references/job-planning.md` required teaching content (Run 2)

The reference is written at implementation, but these teaching sentences are bound now (D6) so a ceremony-only reference cannot satisfy the spec:

- what to inspect when cutting jobs: outcomes the user named, write-dependencies between actions, which results the parent must verify before anything builds on them; `a job yields at most one assignment-bound receipt and always closes at its named parent verification point`.
- one good decomposition example: parallel read-only research lanes + one sequenced implementation job gated on a parent verification point.
- one bad decomposition example: parallelizing a write-dependent sequence, and a "graph" whose jobs are really one packet split for ceremony.
- stop condition: `stop decomposing when each job fits one bounded packet with one stop condition; a job you cannot give a stop condition is two jobs.`
- boundary sentence: the job graph never restates the Dispatch packet fields — `agent-job-packet.md` owns per-dispatch shape.

### L8 — `my_agents.md` Subagents bright line (Changeset C, devfiles)

```text
Bright line: load the `manage-agents` skill before any subagent
dispatch — every Task, delegate, operator, advisor, sidekick, or swarm
lane, on every harness. "This is just a quick lookup", "I already know
the delegate pattern", and "the pattern is obvious" are not exemptions;
they are the rationalizations this rule exists to catch. Mechanical
procedures handed to subagents dispatch as Operators; judgment routes
back to the parent.
```

### L10 — Slim job packet (`references/agent-job-packet.md`, full Dispatch/Decision/Reduction replacement; Run 3)

```text
## Dispatch

Build one bounded packet per non-trivial call. Keep the value column
aligned so a human can scan it.

job packet
  job:        <one-sentence assignment and its decision target>
  pattern:    advisor | sidekick | delegate | operator
  lane:       <swarm name / lane — only for swarm dispatches>
  route:      <category> / <lineage> — native | acpx <provider> — <exact model id> @ <reasoning effort>
  access:     history none | all; workspace read-only | write <paths when write>
  sources:    <anchors the agent must read>
  non-goals:  <what this job must not touch>
  return:     <receipt shape>, bound to assignment id + decision target
              + source/head version (+ session identity for advisor/sidekick)
  stop when:  <condition that ends the agent's work and produces the receipt>
  verify:     <parent checks at the named verification point that close the job
              before accepting any claim>

## Operator Decision

An Operator that reaches work requiring judgment or authority stops and
sends this; it proceeds only after explicit parent approval.

decision packet
  from:       <assignment id>
  observed:   <delta that triggered this>
  anchors:    <source or API anchors>
  gate:       <affected gate>
  blocked:    <action the Operator will not take>
  requested:  <decision requested>
  waiting:    wait | continue read-only monitoring | stop

## Reduction

agent result
  job:        <assignment id> / <pattern> / <lane when swarm>
  status:     complete | partial | blocked | no-receipt
  receipt:    <level>, matched to assignment id + decision target + source/head
              version (+ session identity when persistent)
  accepted:   <claims accepted after parent checks>
  rejected:   <claims rejected or unverified>
  checks:     <parent checks run>
  next:       <next action>
```

`SKILL.md` step 3 completion line becomes: `Completion: sources, non-goals, return binding, stop condition, and parent verification are explicit in the packet; the return line names its binding identifiers and the verify line names at least one concrete parent check (never "none" unless the job is read-only with no claims); every claim is accepted, rejected, or unverified after those checks.`

### L11 — Capability Economics section (`SKILL.md`, new section between the selection table and Patterns; Run 4)

```text
## Capability Economics

The pattern picks the shape of the work and its table owns the allowed
category floor; Capability Economics picks the cheapest category and
lineage at or above that floor.

Mini (OpenAI Luna) is super cheap. Default grunt work to Mini whenever
the pattern's floor allows it: mechanical procedures, bounded scans and
summaries, format conversions, test-and-report loops, watches. A Mini
agent can be a Sidekick, a Delegate, or an Operator.

Escalate the category only when the job's judgment demands it: ambiguous
tradeoffs, cross-module design, or high-stakes decisions go Frontier;
bounded reasoning with clear anchors goes Balanced. "The task feels
important" is not a reason to escalate — importance routes verification
to the parent, not cost to the model.
```

(The r7 closing paragraph on context economics is deleted — mental-model-fit finding: it created a second "economics" frame competing with the job-graph level; `references/job-planning.md` is the sole teaching owner of context conservation.)

Sidekick table, one added row, and the Sidekick prose line becomes `**Model category:** Frontier, Balanced, or Mini` in the same cutover (rule-agreement blocker — prose and table must expose the same category set):

```text
| Mini             | OpenAI Luna         | high, xhigh, or max |
```

### L12 — Parent Conversation History rewrite (`SKILL.md` Context And Access; Run 4)

```text
### Parent Conversation History

- Reviewers: bright line — a review agent NEVER receives parent
  conversation history. A reviewer is any agent whose assignment is
  independent review or verification, whatever its pattern. Reviews
  judge from first principles; inherited context is contamination. "It
  will review faster with context" is the rationalization this rule
  catches.
- Non-reviewers: choose `none` or `all` by cost and benefit. History
  helps a subagent abide by decisions already made; it costs context
  and money. With native Mini agents history is cheap — little or lots
  is fine within the model's context limit. The stop is the same at
  every price: include what the job's stop condition depends on; do not
  paste unrelated turns even on Mini. With Frontier agents give the
  minimum that preserves the decisions the job depends on.
- ACPX agents never inherit parent history — carry context in the
  packet instead (see ACPX Dispatch). The packet's access line records
  `history none` for every ACPX dispatch.
```

### L13 — ACPX context provisioning (`SKILL.md` ACPX Dispatch, appended; Run 4)

```text
ACPX agents start with zero parent context: parent conversation history
never crosses the ACPX boundary; only the packet does. (ACPX session
continuity in `references/acpx.md` is the agent's own session history —
a different thing.) Before dispatch, decide what the job needs to abide
by its function and give each piece its packet home: the goal and
decision target go on the `job:` line; settled decisions the agent must
not relitigate go on `job:` or `non-goals:`; exact file paths, diffs,
and prior attempts go on `sources:`; and `access:` records
`history none`. When the job depends on long parent history that cannot
be summarized into a packet, prefer native dispatch in the parent's own
lineage; choose ACPX when lineage diversity or independence matters more
than shared history.
```

`Choose the Runtime` gains one forward sentence at the runtime link (mental-model-fit finding — history feasibility must feed the runtime choice, not reach backward after it): `History-provisioning feasibility feeds this choice: when required context cannot be summarized into the packet, prefer native dispatch before locking a runtime.`

`agent-job-packet.md` access line is constrained in the same cutover (rule-agreement blocker — an ACPX packet must not be able to record inherited history): `access: history none | all (native only; ACPX always none); workspace read-only | write <paths when write>`.

### L14 — job-planning.md additions (Run 4)

Appended to "What To Inspect When Cutting Jobs":

```text
- Context conservation: work that would flood the parent's window —
  large file reads, log scans, wide searches, long watches — is a job to
  hand off even when it is sequential; the parent gets a bounded receipt
  instead of raw bulk.
```

New section after "One Bad Decomposition" (depth-coverage finding: predicates, not a category list):

```text
## What Parallelizes Well

Before marking two jobs parallel-safe, open what each job names: its
write paths, shared stores, and inputs. Two jobs are parallel-safe only
when neither reads the other's write set and neither consumes the
other's unverified receipt. Read-only evidence lanes and independent
review lanes pass this check by construction; a mechanical procedure
passes when its writes are disjoint from every concurrent job.

Trap: "different files, so parallel" — when one file imports or loads
the other, the write set crosses the file boundary. When unsure,
sequence it — a wrong parallel merge costs more than the wait.
```

### L9 — Hook stderr message (Changeset C, Claude Code)

```text
Blocked: dispatch requires the manage-agents skill. Read the
manage-agents SKILL.md (shravan-dev-workflow plugin), choose the
pattern per job, then retry this dispatch.
```

## Per-run surface allocation

**Run 1 — pattern selection and Operator discipline**

- trigger: none.
- main path: selection table L2 (D4); Operator bright line + rationalization table L3 (D1, D5); model table rows L4 (D2, D3).
- depth: none (D4 keeps selection inline; existing references unchanged).
- proof: new pressure scenarios in `tests/skills/pressure-scenarios/shravan-dev-workflow/manage-agents/`:
  - `operator-for-mechanical.md` — mixed mechanical+judgment task; passes only if the mechanical job goes to an Operator on Luna and the judgment portion routes to the parent; includes one case where the parent decides and one where the parent dispatches a separate Delegate reasoning assignment (both must pass).
  - `pattern-selection-unnamed.md` — no pattern named; passes only if the pattern is stated before model/runtime **and** fails a wrong-but-named pattern (e.g. Sidekick for a one-shot bounded assignment).
  - `pnpm --dir tests/skills run test:evals` GREEN.

**Run 2 — job planning + lens revision + trigger**

- trigger: full description replacement L6/D7.
- main path: revised opening mental model L1 (D6); spine step 0 and step-1 sentence L5 (D6).
- depth: new `references/job-planning.md` carrying the bound teaching content L7 (D6).
- proof:
  - `job-decomposition-before-dispatch.md` — predicate-holding task; passes only if a job graph with jobs, dependencies/parallel-safety, and parent verification points exists before the first dispatch, each job's pattern is assigned at step 1, and the graph governs later dispatch order; **fails a shape-complete bad decomposition** (parallelizing a write-dependent sequence, or omitting a parent verification point on a Delegate result). Includes one prompt that appears singular but contains separable jobs (decomposition must fire without the user naming parallelism).
  - Trigger evaluation matrix (each row documents expected load vs quiet before GREEN is claimable):
    - true: "use subagent-driven development for this refactor"
    - true: "planning agent jobs before we dispatch"
    - true: "run these as parallel subagents"
    - true: bare dispatch — "spin up a delegate to review this file"
    - true: mechanical handoff — "watch the CI run and report failures back to me"
    - near miss (no dispatch): "single trivial lookup I will run myself inline" — quiet
    - near miss (parent inline mechanical): "run the unit tests" — quiet; no handoff intent, parent runs it inline
    - near miss (discussion only): "what are the agents in this swarm doing?" — quiet for manage-agents (discuss-clarify territory)
    - composition: "gather prior art with parallel research subagents before the spec" — research-swarm may own the workflow, but manage-agents must still load for the dispatches
    - composition: CI/PR check watch during PR wrapup — implementation-pr-wrapup owns the PR lifecycle; manage-agents still loads when that watch is dispatched to an Operator
  - eval runner GREEN.

**Run 3 — job-packet slimming and readability**

- trigger: none.
- main path: `SKILL.md` step 3 completion line (L10 tail).
- depth: full rewrite of `references/agent-job-packet.md` per L10 (D12, D13); `session-ledger.md` receipt lines adopt the `return:` vocabulary while keeping the four binding identifiers unchanged.
- proof: hard cutover check — no old field name (`assignment purpose`, `continuity reason`, `receipt scope`, `model lineage` as packet keys) survives anywhere in the skill tree (`rg` over `skills/manage-agents/`); the Run 1 scenario `operator-for-mechanical.md` asserts the dispatched packet uses the slim shape; eval runner GREEN.

**Run 4 — capability economics, history rules, ACPX context, parallelizability**

- trigger: none (description unchanged; semantic trigger coverage from the r4+r5 pass remains current).
- main path: Capability Economics section + Sidekick Mini row + Sidekick prose line `Frontier, Balanced, or Mini` (L11, D14); Parent Conversation History rewrite (L12, D15); ACPX context provisioning + Choose the Runtime forward sentence (L13, D16).
- depth: job-planning.md context-conservation bullet and predicate-based "What Parallelizes Well" section (L14, D17); `agent-job-packet.md` access-line constraint (`history none | all (native only; ACPX always none)`) (D16).
- proof (smallest sufficient set per depth-coverage):
  - new scenario `capability-economics.md` covering D14 + D15 + D16 in one prompt: grunt work plus an independent review, with "give everyone the full chat so it's faster" pressure and the review needing a different lineage (ACPX). Passes only if the grunt work lands on Mini (Luna) with history allowed within the stop rule, the reviewer dispatches with `history none` despite the pressure, and the ACPX packet carries goal/paths/sources with `history none`. Fails Frontier-for-importance escalation, history leaked to the reviewer, or an ACPX dispatch recording `history all`.
  - `job-decomposition-before-dispatch.md` extended with one sequential flood element (wide log scan) that must be cut as a handed-off job returning a bounded receipt, not parent bulk reading. Covers D17 conservation; its existing write-dependent case covers the parallel anti-case under the new predicate.
  - eval runner GREEN on the updated set.

**Changeset C — enforcement (non-skill surfaces)**

- `plugins/shravan-dev-workflow/hooks/hooks.json` + hook script (Claude Code `PreToolUse`, matcher `Task`, stderr message L9), per D8/D10.
- `~/dev/devfiles/shared/my_agents.md` Subagents-section bright line L8, per D11.
- proof: manual trigger — fresh Claude Code session, attempt `Task` dispatch without reading the skill → blocked with load instruction; read skill → same dispatch proceeds. `claude plugin validate .` passes. This proof is manual by nature; the eval runner does not cover hooks — named proof gap: no automated regression for the hook.

## Authoring basis and proof plan

Basis: `user-directed intent` for Runs 1–2 and Changeset C (D9). Proof posture per run is listed in the surface allocation above. Static validation (`claude plugin validate .`, `codex plugin list --marketplace ai-tools --available --json`) is never claimed as behavior proof. Remaining proof gaps after all runs: (a) hook has manual proof only; (b) invocation reliability on Codex/Cursor rests on trigger+prompt layers and is not provable by the eval runner — both reported as gaps, not covered claims.

## Coordination

- base: `master` @ `2963930` (`ai-tools`); implementation branch `feat/manage-agents-dispatch-discipline` in its own worktree (user direction 2026-08-07); this spec doc moves onto that branch with the changeset.
- pending edits: none known; check `git status` before each slice edits.
- implementation grouping: Runs 1–3 land in one PR (single version bump per Coordination); Changeset C stays post-merge — the hook needs its security-gate decision and the devfiles edit needs explicit commit approval.
- version landing: bump `shravan-dev-workflow` `2.0.1 → 2.1.0` when the first behavior-changing run ships; single bump covers the sequenced runs if they land in one release, otherwise bump per release.
- changelog landing: one dated entry under `docs/changelog/` covering shipped runs (public-safe); devfiles gets its own private entry for the `my_agents.md` change (D11).
- cache refresh: Codex and Claude plugin cache refresh is a post-release proof step, recorded in the changelog entry.
- devfiles commit requires explicit user approval (repo rule).
- implementation review (2026-08-08): eight lanes on the changed files plus a scoped delta pass; accepted fixes applied (see changelog Validation). Named deviation: `references/acpx-provider-{claude,codex}.md` and `native-providers-codex.md` received vocabulary/catalog corrections (stale `write scope` → `access:` grammar; Terra gated to user-request-only) — required by D2 and D12, which those files contradicted; no provider-contract semantics changed, so the "No ACPX provider-contract changes" non-goal is read as satisfied. Deferred follow-ups: literal call grammar for pre-existing acpx.md/provider/adapter/ledger load sites; no-op minors on r8-settled padding sentences.

## Non-goals

- No changes to `orchestrator-design`, `research-swarm`, or any swarm workflow — they instantiate the discipline; `manage-agents` owns it.
- No removal of the Composer 2.5 Operator fallback row (Terra IS removed — user strike in D2, 2026-08-07).
- No new agent patterns; the four-pattern model stands.
- No ACPX provider-contract changes.
- No Codex or Gemini hook (no equivalent gate exists); no Cursor hook in this spec (possible follow-up, not in scope).
- No retroactive edits to retired skills.

## Spec-review record

- reviewed revision: r1; accepted findings applied in r2.
- lanes and receipts (all one-shot Delegates, fresh context, read-only, different lineage from the authoring session):
  - `mental-model-fit` (Sol medium) — complete. 3 important findings accepted (unintegrated lens, double pattern ownership, circular predicate); 1 observation (Operator bright line consistent with shipped authority boundary).
  - `trigger-routing` (Grok 4.5 high) — complete. 3 important + 1 minor accepted (missing full description string, missing research-swarm boundary, thin trigger-eval matrix, phrase drift); 1 observation (any-invocation closure correctly owned by Changeset C).
  - `rule-agreement` (Sol medium) — complete. 3 important accepted (judgment double-ownership in D5, pattern-choice double-ownership in D6, predicate drift across three phrasings).
  - `depth-coverage` (Grok 4.5 high) — complete. 2 important accepted (selection teaching Operator-heavy, ceremony-only job-planning risk); 2 observations (no duplicate authority with agent-job-packet, all stages have owners).
- rejected findings: none — every candidate was verified against the r1 text and shipped `SKILL.md` and held.
- verdict on r1: `targeted-revision`.
- semantic coverage: whole doc (all four lanes read the full proposal).

### Confirmation pass on r3 (same four lanes, fresh context, Sol medium ×2 / Grok 4.5 high ×2)

- `mental-model-fit` — complete. All three r1 defects confirmed resolved. 1 new important accepted: dual job-closure (receipt vs parent verification) — fixed in r4 (canonical job-closure sentence in L1/L5/L7).
- `trigger-routing` — complete. Three r1 defects confirmed resolved (D7 string measured at 516 chars pre-r4; matrix; research-swarm boundary). 1 minor accepted: success definition aliased the leading phrases instead of quoting them — fixed in r4.
- `rule-agreement` — complete. All three r1 defects confirmed resolved. 1 blocker accepted: L5 step-0 completion demanded receipts that cannot exist before step 3 — fixed in r4 (expected receipt named at step 0; actual receipts at step 3). 2 important accepted: `Mini (preferred)` mutated the model-category value — fixed with a separate Route column; L8 overstated the bright line versus L3's inline exception — fixed with "handed to subagents".
- `depth-coverage` — complete. Both r1 defects confirmed resolved (L2 teaching slots per pattern; L7 bound teaching content). Lane verdict `great`; no new findings.
- verdict on r3: `targeted-revision` — all accepted findings fixed in r4.
- r4 also carries user strikes (2026-08-07): Terra removed from the Operator table (D2/D4/L4/Non-goals), if-job-then-pattern row form (D4/L2), mechanical job types added to the trigger (D7) and matrix, canonical mechanical-job-type and job-closure vocabulary added.
### Scoped delta pass on r4+r5 (three dispatches covering four lanes, fresh context, Sol medium ×1 / Grok 4.5 high ×2)

- `rule-agreement` — complete. 3 important accepted: reduction receipt dropped session identity for persistent patterns; `Route` column name collided with runtime routing while D12 promised category/lineage/host the route line didn't carry; absolute job-closure sentence contradicted the `no-receipt` status. No contradiction found in `continuity reason` deletion or Terra removal.
- `mental-model-fit` — complete. 2 important accepted (same route-line gap; `stop when: ends the job` reopened dual closure); 2 observations (closure sentence consistent across homes; two-level lens coverage holds).
- `trigger-routing` — complete. 1 important accepted (mechanical tokens could over-load on bare inline prompts; no quiet near-miss for "run the tests"); 1 minor accepted (CI-watch prompt lacked an implementation-pr-wrapup composition row); confirmed D7 is situation-shaped and under the 1024 limit.
- `depth-coverage` — complete. Focus confirmations all held (L10 stays ceremony with a named consumer; deletions orphan no teaching; an empty packet fails the completion gate). 1 minor accepted (presence-shaped completion could pass vacuous fillers — tightened with binding-identifier and concrete-check clauses).
- verdict on r4+r5: `targeted-revision` — all accepted findings fixed in r6 using the lanes' own smallest-fix wording (job-closure sentence → "yields at most one … always closes"; route line carries `<category> / <lineage>`; reduction receipt gains session identity; stop/verify glosses split work-end from job closure; `Route` column renamed `Preference`; D7 gains "handing off to a subagent"; matrix gains the inline-mechanical near miss and PR-wrapup composition row; step-3 completion names binding identifiers and one concrete check).
- rerun decision: waived — every r6 edit is a reviewer-authored smallest fix applied verbatim or narrower; no new meaning was introduced beyond the fixes. Implementation commissioned by user 2026-08-07 ("implement the spec").
- acceptance: **accepted-to-implement (r6)** — binding: Runs 1–3 implement L1–L10 as written; any implementation deviation is named on the run note's spec-boundary line; a struck decision row after this point is an ordinary edit and re-review follows this binding.

### Scoped delta pass on r7 (Run 4 only: D14–D17 / L11–L14; Sol medium ×1 / Grok 4.5 high ×2, fresh context, read-only)

- `rule-agreement` — complete. 2 blockers accepted: Sidekick prose (`Frontier or Balanced`) contradicted the new Mini row and section — the prose line is now an explicit Run 4 surface; the packet's `access: history none | all` let an ACPX dispatch falsely record inherited history — the access line now carries `(native only; ACPX always none)`. Confirmed: reviewer bright line overrides Mini economics; L14 does not collide with the Operator bright line or the L2 row boundaries.
- `mental-model-fit` — complete. 3 important accepted: L11's closing "dispatch is also context economics" paragraph created a second economics frame competing with the job-graph level — deleted, `job-planning.md` is the sole owner; L11's "pattern is not model size" contradicted L1's "pattern owns the minimum capability category" — reworded to "the pattern's table owns the floor; Capability Economics picks the cheapest category at or above it"; L13's prefer-native clause reached backward into the runtime link — Choose the Runtime gains the forward history-feasibility sentence. 1 observation (L14 sits cleanly in the job-graph level).
- `depth-coverage` — complete. 3 important accepted: "What Parallelizes Well" was a category list — rewritten as inspect predicates (write sets, unverified receipts) with the "different files, so parallel" trap; L13 taught contents without packet homes — each piece now names its packet line, and parent history is distinguished from ACPX session continuity; proof set was short — capability-economics.md now also asserts the ACPX provisioning case and job-decomposition gains a flood-cut case. 1 minor accepted: "reasonable share" softness — replaced with the stop-condition-dependent inclusion rule. Reviewer-definition question resolved: a reviewer is any agent whose assignment is independent review or verification, whatever its pattern (now in L12).
- verdict on r7: `targeted-revision` — all accepted findings fixed in r8 using the lanes' own smallest-fix wording.
- rerun decision: waived on the same basis as r6 — reviewer-authored fixes applied verbatim or narrower. Run 4 commissioned by user 2026-08-08.
- acceptance: **accepted-to-implement (r8)** — binding extends to Run 4: implement L11–L14 as written in r8; deviations named on the run note's spec-boundary line.
