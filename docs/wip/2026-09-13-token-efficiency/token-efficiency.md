# Codex CLI agent workflow efficiency

Status: WIP research and discussion; no implementation approval or runtime policy changes. Updated 2026-09-13. This document covers our Codex CLI instructions and skill system. ChatGPT Work, subscription-plan comparisons, and account-purchasing strategies are excluded.

## What we are improving

Keep the capable main agent as the user's thinking partner and coordinator. Have cheaper supervised workers perform substantial source collection and execution, without the main agent repeating that work. Make the behavior implicit in shared instructions and consistent through management, implementation, design, review, and PR skills. Conserve tokens by removing avoidable work and inconsistent rules while preserving evidence, scope, safety, and stopping boundaries.

The user specifically values Luna xhigh/max and Sol low execution under a capable coordinator. Treat that as an owner-directed starting point to test, not a universal benchmark ranking. The screenshot and quoted social posts do not prove local workflow savings. The user's example of a named separate worker was context from instructions given to another agent, not authorization to create that worker in this session.

```text
User <--> Main agent: clarify, reason, direct, decide, inspect decisive evidence
                 |
                 +--> Worker: bounded collection or implementation and proof
                 |       +--> evidence, questions, proposed result
                 |
                 +--> Independent reviewer: challenge the result
                 |
                 +--> Operator: run/watch mechanical checks; return changes

Shared work thread: decisions, checkpoints, relevant evidence links
Worker conversation: task-local context and execution details
```

This is the desired responsibility split, not a decision to use only native subagents or only Router sessions. The main agent's read budget should follow the decision: enough primary evidence to judge, not wholesale repetition of every worker read. Worker execution does not transfer merge authority or make worker output verified by assertion.

## Two coordinated surfaces

1. `devfiles/shared/my_agents.md`: short always-visible behavior defaults. Establish who thinks with the user, when execution should be delegated, how to preserve active worker ownership, when to ask/stop, and which skill owns detail. Keep model/provider recipes and board IDs out.
2. Active skills: `manage-agents` owns choosing a worker relationship, model/effort, runtime, scope, continuity and result verification. Phase skills own how to do their work. Orchestrators route the work and preserve the user relationship rather than treating a skill invocation as an instruction for the expensive parent to do everything inline.

## Findings verified directly so far

### F1 — Implementation explicitly defaults to inline execution

Observed: `implement-plan/SKILL.md:22` says work inline unless independent disjoint slices or explicit delegation. `references/execution-and-proof.md:34-35` repeats the inline default and couples delegation to parallel independence. `manage-agents/SKILL.md:45` permits parent coding. This suppresses default delegation; explicit delegation remains legal. Cheaper model tables alone do not establish implicit execution delegation.

Proposed change: separate delegation from parallelism. A dependent sequential slice can still be performed by a worker; only concurrent writes require independence. The implementation worker owns edits, fixes, and fitting proof. The coordinator owns assignment, scope decisions, and verification of decisive evidence. Do not mandate parallel swarms for ordinary implementation.

Implication: caller/worker distinction must be explicit so a worker invoking implement-plan executes rather than recursively delegating indefinitely. Main-agent code edits and document drafting exceptions remain owner decisions; do not infer a blanket no-tool rule.

### F2 — Model effort table work is only part of the solution

Observed: the named worktree contains concurrent uncommitted matrix changes. Current reads include Luna xhigh/max, Sol low as Delegate, Sol medium reviewer-only, Terra medium/high in Sidekick, and Astra low in Sidekick. The model table is not a measurement of outcome quality, retry count, or coordinator overhead.

Proposed change: qualify workers by bounded task, evidence availability, complexity, and correction history; keep exact model/effort as an explicit selection. Preserve the user's supervised Luna/Sol preferences. Escalate on a concrete failure or unresolved judgment, not on the importance of a task alone. Audit parent-work defaults and phase ownership along with the table.

### F3 — Separate-session choice is not first-class in current management routing

Observed: `manage-agents/SKILL.md:124-128,158-180` selects native versus ACPX largely by provider lineage and history feasibility. Router operations are linked from shared-work context, but the runtime branch does not ask whether the worker must be directly accessible to the user across assignments. `SKILL.md:24` makes the parent the sole voice to the user; this needs clarification if direct worker conversations are desired.

Proposed change: first establish single-assignment versus continuing relationship and required user access, then select a runtime that actually supports it. Keep native subagents for fitting bounded jobs; consider separately addressable Router workers for continuing work. Future Claude/ACPX integration should preserve the same task and authority meaning, but capabilities must be verified per runtime. Do not equate separate context with proven cost savings.

Open: preferred default relationship; how a user's direct worker redirection is communicated to the coordinator; whether main or worker drafts design documents.

### F4 — PR observation can consume the coordinator's turns without adding judgment

Observed: `manage-agents/SKILL.md:114` requires an Operator for long watches; PR wrap-up `references/monitor-loop.md:16` says an Operator may observe. Shared prompt specifies 180-second gh watches, while PR github-pr-state.md:15 specifies the same gh watch commands with 120 seconds. This is an actual same-command cadence disagreement; the separate general monitor-loop cadence need not be identical. The quiet-poll/final-fetch requirements are legitimate existing delivery gates; repeated parent polling during an already-owned watch is not needed to satisfy them.

Proposed change: one assigned observer per check/watch with exact process/PR/head identity and a bounded return on terminal state or material change. Main does useful independent work or waits for that result; it should not duplicate the observer's polling or execute the observed work. Completion and user communication requirements remain; no invented busywork to appear active. Consolidate cadence at an existing owner and ensure terminal evidence is not confused with a progress update.

### F5 — Validation needs coherent evidence reuse, not weaker gates

Observed: shared prompt Definition of Done asks for manual proof outside the suite (`my_agents.md:154`), while its proof section allows automated real-path tests as runtime proof and asks for manual checks only where the suite lacks evidence (`:351`). Global TDD text requires a failing test first (`:341`); skills-creation allows user-directed authoring without a fabricated RED. Those rules need explicit applicability, not repeated improvisation.

Proposed change: a validation owner names what each check proves, what source it applies to, what changed since the last result, and the smallest affected rerun. Preserve current gates and required independent review. Successful checks can be reused while their source/inputs/environment remain applicable; changed relevant source invalidates affected proof. Formatting/metadata-only changes should not silently restart all semantic work. Final per-repository commit/push/merge authority must be explicit; no cross-repository extrapolation.

### F6 — Cache lifetime, continuity, and wake cadence are conflated

Observed: manage-agents and session-ledger tell agents to ping every persistent session under 29 minutes and describe cold resume as repaying the whole context. The same two-regime interval rule is repeated in collaboration, timed-wakeups, and scheduled-workflows. Current official API cache guidance says reuse depends on matching rendered prefixes, model/settings, eligible boundaries, and routing; a persistent session alone is not a hit guarantee. Codex CLI behavior on the actual selected route must be measured rather than inferred from an API feature table.

The user's 26-minute proposal is a candidate margin: relative to a 30-minute lifetime it leaves four minutes instead of one. Purely arithmetically it produces about 11.5% more scheduled pings than a 29-minute cadence. Neither number establishes net savings. A liveness/status tool call that never sends a model request does not refresh provider prompt state. A model ping may generate output and grow context; active model requests may already provide reuse, making the ping redundant.

Proposed experiment: for one supported CLI/provider route compare no artificial ping, 29-minute, and 26-minute maintenance with the same realistic idle/resume work. Record cached/uncached input, output/reasoning, latency, number of requests, work completed, and coordinator overhead. Count maintenance cost. Maintain useful continuity independently of whether cache is warm. Do not apply one provider's TTL to Claude/other ACPX backends. No timer or cache setting is changed by this audit.

Router source has a separate 65-minute account-affinity idle TTL (`codex-router-proxy/src/account_selection.rs:137,1187-1217`). It influences account choice; it is not the provider KV-cache lifetime, and does not prove a cache hit.

### F7 — New Router source and installed collaboration surface differ

Observed: user-pinned Router commit `8927f3b03882126ebd54e31822eea3c1272ff596` adds substring search and explicit inbox project/board/topic scope. Current installed CLI help still exposes project-only inbox and no board search. The worktree's vendored reference is older. New inbox scope filters top-level messages; independent thread watches still contribute activity beyond that scope. Search is strict to the selected scope.

Proposed change: refresh canonical/vendored skill and installed capability deliberately when that work is authorized; teach exact observed capability rather than nonexistent flags. For efficient catch-up, preserve a relevant thread reference and bounded unread/history position, use search where available, and avoid dumping unrelated project history. Keep board messages as concise shared checkpoints rather than full tool transcripts.

### F8 — Evidence collection should precede expensive reconstruction

Observed: program-design requires current-system reconstruction in step 5 (`SKILL.md:101-103`) and exposes the current-system explorer in its later delegation section (`:283-308`). The explorer predicate is that the parent lacks a current model. The section order can encourage doing the expensive reconstruction before dispatching the worker meant to help with it. This is an ordering/teachability gap, not proof that delegation is impossible: the branch can be applied when its predicate is reached.

Proposed change: parent establishes the question, source roots, and boundaries; worker collects a source-backed current-system account; parent reads decisive anchors and reasons with the user. Keep target design decisions and normative integration with their semantic owner. Avoid hardcoding a particular worker lineage into program-design when manage-agents owns model selection.

### F9 — Design review can overlap at three levels

Observed: spec-design step 11 and program-design step 16 classify and obtain local review when required; orchestrator-design culminates in three-artifact review. Review coordinator, mode-complete reviewer, and possible chunk reviewers also each read substantial common material. These are distinct required coverage responsibilities today, not automatically erroneous repetitions.

Proposed investigation: make the full-cycle review owner explicit and establish when reviewed intermediate artifacts are actually consumed. A future full-cycle route may reuse valid coverage or subsume local review when no consumer needs it first, but only after redesigning the caller contracts and preserving every required judgment. Do not simply skip existing phase reviews. Within a reviewer invocation, reuse already-loaded instruction references; independent reviewers still need their own source context.

### F10 — Receipt vocabulary should not create needless retries

Observed: research lane output uses answered/blocked, its countercheck uses survived/refuted/unresolved/blocked, while management uses complete/partial/blocked and distinguishes evidence acceptance. Different result types are not intrinsically inconsistent. The risk is loss of partial coverage or a caller requiring a mismatched label instead of consuming a useful bounded result.

Proposed change only where a real consumer mismatch is demonstrated: retain a clear completion/coverage state separately from the answer or disproof result. Avoid a repo-wide universal schema merely to make wording uniform. Test partial coverage and unknown outcomes; don't invalidate adequate evidence for formatting alone.

### F11 — Skill review has contradictory cross-provider guidance

Observed: skills-creation main Review section instructs a different-lineage lane whenever reachable. Its implementation-review reference instead prefers that when outside counsel was explicitly requested and otherwise says not to invent another runtime route. Both are active instructions for the same review stage. This can trigger unnecessary transport setup or competing interpretation.

Proposed change: choose and document one policy at the stage owner, using manage-agents to execute it. Prefer an explicit reason for a distinct model family where independent error patterns matter; do not let mere availability trigger a costly round-trip. The precise default is a future decision, not adopted here.

### F12 — Preserve the existing cheap monitoring pattern

Observed: debug-investigation/references/background-monitoring.md:7 already says machine watches and model adjudicates, inspecting only state changes, anomalies, completion, and bounded summaries. It explicitly excludes a main or helper model from steady-state polling. This is the strongest existing pattern to align other workflows with; it does not require a new monitoring skill.

Proposed change: have PR/goal management consume that principle through their existing owners, with visible cancellable processes and one terminal receipt. Keep their own domain-specific failure/permission rules. Avoid converting every deterministic wait into a recurring model wake.

### F13 — Review/proof staging can be clearer without removing review

Observed: skills-creation requires source review before proof and a later ship decision. The claim-vs-evidence lane evaluates evidence already produced; before new proof it can only assess existing claims and name the gap. At shipping, unchanged source-review coverage should remain reusable under its existing freshness rules. Broad repetition is not automatically required merely because the stage name changed.

Proposed change: make source readiness, behavior evidence, and shipping state explicit in the caller's continuation path. Reuse applicable independent findings and their checked corrections. Invoke a proof-claim reviewer when there is an actual claim/evidence set to judge. Preserve the two-stage review obligations and bounded remediation until the owner approves a changed contract.

## What remains useful and should survive

- One responsible owner for the whole task; explicit work scope, inputs, expected evidence, and stop conditions.
- Cheap focused execution with escalation when evidence demands it.
- Independent review context and current primary-source verification of material findings.
- Bounded fixes, no weakening checks, and clear separation of transport acceptance, worker completion, and verified outcome.
- Reuse of exact work-thread/session identity; append corrections rather than inventing history.
- One observer of a mechanical wait; source-bound results that can be consumed without copying all logs.
- Proportional reference loading: read required source fully for the assigned job, not every unrelated skill on every ordinary task. This audit's full inventory is exceptional and user-requested.

## Proposed change ownership and proof (not implementation plans)

| Surface | Trigger / core change | Reference placement | Scripts | Pressure proof needed |
|---|---|---|---|---|
| Shared instructions | Implicit supervised execution and role boundaries; preserve concise global entrypoint | Detailed model/runtime/validation mechanics stay with skills | None | Coordinator delegates a sequential coding task and does not take it back; user correction preserves authority |
| manage-agents | Relationship before runtime; supervised low-cost selection; distinguish coordinator from executor | Existing job, runtime, session references; cache mechanics have one documented owner | No new helper justified | Cheap capable worker, sequential delegation, direct-user steering, no recursive dispatch, active/idle maintenance |
| implement-plan | Worker execution can be serial; coordinator delegates, worker executes | execution-and-proof owns source-bound fitting proof and surprise routes | None | Dependent slice delegated once, integration/fix stays with worker, no lost proof gate |
| implementation-review | Risk/coverage determines lanes and source reuse; preserve independence | Existing composition/reducer references | None | One meaningful review; correction invalidates only relevant coverage; no repeated source dump |
| implementation-pr-wrapup | One observer and one final decision owner; remove contradictory cadence | Existing monitor and GitHub state refs | Prefer existing blocking gh commands | No parent duplicate poll, exact-head terminal receipt, quiet gate once |
| orchestrator-implementation-goal | Route work to workers through management; remain responsible through proof/PR | Existing goal routing contract | None | Parent does not implement or repeat worker checks; blockers route correctly |
| orchestrator-design | Delegate evidence collection while main thinks with user | Existing design routing and research skill | None | Design ownership stays with user/main; evidence collection bounded |
| spec-design / program-design | Preserve semantic owner, source-backed design; explicit evidence worker role | Their current workflow references | None | Research does not decide owner tolerances; main does not reload whole research set |
| spec-program-review | Preserve independent meaningful coverage; avoid unnecessary duplicate broad lanes | Existing review composition/reduction | None | Coverage not reduced to ceremony; bounded remediation without redoing unaffected work |
| skills-creation | Review/proof ordering and scoped behavior become predictable | Existing review/testing references | None | No fabricated RED; valid scoped repair avoids broad repeat review; actual behavioral proof retained |
| agent-collaboration / tracker | Capability-aware focused retrieval and stable work reference | Existing message-board/timing/view references | None | Source-installed mismatch, bounded catch-up, no transcript dump, no implied wake |

Additional delivery dispositions: plan-implementation should permit bounded source collection while preserving plan strategy; plan-improve-repo has an existing no-default-swarm boundary that should survive unless explicitly redesigned; debug-investigation should preserve machine monitoring and model adjudication. Their current triggers remain appropriate, their existing references own detail, no new scripts are proposed, and worker-takeover/duplicate-read cases need pressure coverage. No new skill or broad deletion is proposed solely for length.

## Open design decisions

- Should continuing workers default to separately accessible Router conversations, with native subagents for bounded jobs, or a different split?
- How does a direct user instruction to a worker update coordinator ownership without competing directives?
- Does a worker draft design documents from settled discussion, or does the main agent draft them?
- Which measured conditions justify 26-minute maintenance, and which sessions should simply remain idle?
- What explicit small-action exception, if any, should a capable coordinator have? Do not convert this into an excuse to take all execution back.

## Scope and evidence limits

No runtime edits, quota-setting changes, provider switch, benchmark experiment, or new worker session was created for this proposal. Three Luna research lanes read bounded skill families; they are audit helpers, not an adopted worker policy. Savings are hypotheses until measured in realistic Codex CLI work. The earlier product-plan detour is excluded from conclusions and will not continue.

Current sources: named ai-tools worktree at bcc8a4c plus concurrent uncommitted matrix edits; shared devfiles prompt; Router canonical source and installed help. All 30 active skill trees were read across the parent and three bounded lanes. See [source coverage and dispositions](source-coverage.md). This document is not an accepted multi-run skill implementation commission.

## Shared discussion

Project: Shravan development workflow (`01a09c8f-fe6d-72c1-9665-3f0cee1e8f20`). Board: Workflow improvements (`01a09d62-1b4c-7c71-95a3-864caa3e50b4`). Topic: Improve token efficiency (`01a09d62-40c9-7b30-921b-118fcf03e068`). Root thread: `01a09d62-8935-7d51-9870-505881b36269`. Service: `0ff962c5-7fa3-4c18-a5ca-1bbe8db09e89`, endpoint `codex-local`, selected default profile. Keep open for owner discussion.

## References

- [manage-agents](../../../plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md)
- [implement-plan](../../../plugins/shravan-dev-workflow/skills/implement-plan/SKILL.md)
- [PR monitoring](../../../plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/monitor-loop.md)
- [Pinned Router reference](https://github.com/ShravanSunder/codex-router/blob/8927f3b03882126ebd54e31822eea3c1272ff596/agent-skills/agent-collaboration/references/message-board.md)
- [Official prompt cache mechanics](https://developers.openai.com/api/docs/guides/prompt-caching) — mechanics reference only, not measured CLI quota savings.

## Remaining skills: deliberate scope control

The full reading pass also covered docs maintenance, all three handoffs, Linear, observability, security routing, presentation, skill audit, scaffold, and Peekaboo. These are not the priority changes the user named.

- Preserve plan-handoff and observability guidance: the lane found no required token-efficiency change.
- Inspect presentation's repeated checks and reference budget as a lower-priority efficiency opportunity, preserving readable output.
- Inspect handoff no-file behavior and docs-maintenance inventory breadth only if they cause actual repetition in the main workflow.
- Scaffold option/script mismatches, Peekaboo lifecycle/postcondition questions, Linear mutation verification, and security-result consumption remain deferred candidate observations. No implementation recommendation is adopted from them in this token-efficiency WIP; no live behavior was tested.
- Skill-audit can clarify its composition with research-swarm/manage-agents when using evidence lanes. Keep its existing trigger and core audit judgment; source gathering belongs to research, existing references suffice, no scripts are needed, and one delegated-evidence pressure case would test the composition.

## Suggested discussion order

1. Confirm the coordinator/executor split and teach it once in shared instructions and management.
2. Fix implement-plan's inline-first default and its callers without making serial work require a parallel swarm.
3. Align observation, validation reuse, and review ownership at their existing boundaries.
4. Measure the actual CLI idle/resume path and decide when a 26-minute margin is worth its maintenance cost.
5. Apply smaller peripheral changes only when demonstrated by the agreed workflow.

No additional product research or runtime edits are needed to discuss these decisions.

## Countercheck and audit completion

A fresh bounded Luna countercheck reopened implementation, management, PR monitoring, and shared validation anchors. Parent accepted its limits: inline default suppresses implicit delegation but does not prohibit explicit delegation; static source alone does not prove parent duplicate polling; existing proof mapping/freshness should be clarified before inventing a validation-cache mechanism; 26-minute maintenance has no measured net-savings claim. Parent checked the same-command 120/180 disagreement in github-pr-state.md separately from generic monitoring cadence.

Audit deliverables complete: all 30 active entrypoints and their Markdown depth read across lanes, priority anchors verified by parent, WIP links checked, complete entrypoint coverage checked, and diff whitespace check passed. No runtime skill edits, tests, commits, merges, cache changes, or policy implementation performed in this audit. Concurrent model-matrix changes remain the other workstream. The work thread stays open for design decisions.

## Native-session evidence changes the runtime recommendation

A live user-requested Luna subagent had its own native thread ID and was independently inspectable through Router. Parent readback reported `canAcceptDirectInput=false`, so direct steering remains unproven. See [evidence](../skills-authoring/2026-09-13-efficient-agent-coordination/session-evidence.md). The spec now prefers native subagents when sufficient; a separate launch requires a demonstrated capability gap. Separate context or board access alone is not a reason to add another session mechanism.

## 2026-09-14 continuation

See [latest assessment](../skills-authoring/2026-09-13-efficient-agent-coordination/2026-09-14-role-and-cache-assessment.md) for current role/model/review/cache proposals, source differences, and unresolved owner choices. The pasted cache table is not treated as verified CLI evidence.
