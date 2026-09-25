# Persistent collaboration and review workflow

Revision: 2.1, 2026-09-16. Status: accepted to implement by Fable after revision verification; research decision D10 confirmed by Shravan. All ten runs have design acceptance. Runs 1 through 9 source reconciliation is complete; coordinator self-check and scoped static checks are complete, and the drafts await owner review. The companion devfiles draft is reconciled. Run 10 and pinned sync remain pending actual supported Router CLI and access proof. Behavioral proof, pressure tests, and additional reviewer dispatches remain deferred. No source is staged, committed, pushed, or installed.

This draft supersedes the earlier [implementation-flow commission](2026-09-16-persistent-implementation-flow.md) for review ownership, review order and research assignment. Existing source edits remain uncommitted drafts under reconciliation.

## Purpose

Shravan works with one coordinator, usually Astra or Fable. That agent keeps the design conversation and the final report. The implementer is a persistent implementation Sidekick. After development, the coordinator assesses the result before a persistent independent Reviewer examines the implementation. Correction cycles reuse those agents.

Use `coordinator` for the agent who designs with Shravan and `implementer` for the Sidekick who runs development. `orchestrator` names the coordinator's board seat. Existing skill identifiers such as `orchestrator-design` remain unchanged; this work does not rename skills.

Success means an agent can choose the next owner, reuse the right thread, wait for evidence and finish the correct stage without reopening settled design, creating replacement reviewers or duplicating the review work in the expensive designer session.

Authoring basis: user-directed intent. Source findings below explain the changes but do not establish measured causes or savings.

## Confirmed decisions and proposals

| ID | Decision | Status and reason |
| --- | --- | --- |
| D1 | Shravan talks to one coordinator. It owns design decisions with him and reports the final result. | Confirmed by owner. Delegating implementation preserves this relationship. |
| D2 | An implementation Sidekick is a separate persistent top-level thread. Commission it through a supported launcher, verify its model and access, give it a visible name and join the work thread as `implementer`. It implements, integrates and proves. | Confirmed separate-thread requirement; Router commissioning mechanics follow Fable's reviewed contract. The work should remain visible and resumable. |
| D3 | Workers and Operators are native subagents. Keep each through the corrections belonging to its assignment, then finish it. | Confirmed by owner. They are disposable assignments, not persistent Sidekick substitutes. |
| D4 (fan-out clause superseded 2026-09-23 by review-research-workflows Revision 2) | Every agent responsible for an independent review is a persistent review Sidekick. It keeps its own review history through corrections and can fan out under its review skill. | Confirmed by owner. Reviewer continuity and reviewer independence must coexist. |
| D5 | Development returns to the designer first; independent implementation review follows. | Confirmed by owner, correcting the earlier reverse ordering. |
| D6 | During development, the implementer asks the designer when a design question blocks progress. Routine patches require no designer approval. | Confirmed by owner. Designer review occurs at the end of development. |
| D7 | An Advisor is created only when Shravan explicitly asks for one. | Confirmed by owner: “if i specially ask for one only”. No phase transition creates an Advisor. |
| D8 | Sidekick identity survives idle periods and cold resumes. A 26-minute interval does not replace or dispose of a thread. | Confirmed by owner. Cache behavior affects cost, not relationship lifetime. |
| D9 | Use purposeful visible names with role emojis for separate agents. Keep exact session addresses for operations. | Confirmed by owner. Names make implementation observable; they do not prove identity or progress. |
| D10 | Use a Worker for a bounded research assignment. Use a research Sidekick when several related assignments and follow-up questions benefit from continuing context. During implementation, the existing implementation Sidekick can coordinate research Workers. | Confirmed by Shravan after comparing both approaches. Continuity determines the choice; the design or implementation phase alone does not. |
| D11 | An explicitly requested Advisor helps the coordinator. The implementer asks the coordinator when it needs a design decision or help to proceed. | Confirmed by owner. One design contact keeps implementation questions from splitting across competing advisers. |
| D12 | Independent review uses a different lineage from the author of the reviewed target. | Preserve existing management policy. Design and implementation have their own author identities; Fable's board relay also states implementation-author lineage. Do not require a third lineage by inference. |
| D13 | One board Thread per piece of work. The coordinator retains `orchestrator`; the implementer holds the separate `implementer` role. No seat transfer is part of this workflow. | Fable's owner-decision relay at activity 136 and participants specification section 9, checked during review revision R2. |

A reviewer may not author the target it independently reviews. An Advisor that contributes design choices is unsuitable as that target's independent Reviewer.

## Responsibilities and sessions

Sidekick describes a persistent working relationship. Implementation, research and review describe the work assigned to that relationship. Management must stop defining every Sidekick as an implementation worker.

| Agent | Responsibility | Runtime and continuity |
| --- | --- | --- |
| Coordinator | Design with Shravan, assign work, resolve design questions, assess the developed result, own the final report. | Existing primary conversation; no required name or emoji. |
| Implementation Sidekick | Plan from accepted design, implement, integrate, prove, coordinate Workers and Operators, and correct findings. | Named top-level thread; reuse across assignments and corrections. |
| Design-review Sidekick | Independently assess the design and verify its corrections. | Separate persistent thread, initially free of author conversation. |
| Implementation-review Sidekick | Independently assess the implementation and proof, then verify corrections. | Separate persistent thread, initially free of implementation-author conversation. |
| Worker | Produce one bounded result, including its corrections. A review lead can assign a Worker a read-only review lane. | Native subagent; finish after the assignment is accepted. |
| Operator | Execute an assigned procedure and report the observed result or exception. | Native subagent; no design or implementation judgment beyond its procedure. |
| Advisor | Help the coordinator think through design choices, offer alternatives and push back. | Separate persistent thread, created only at Shravan's request. |

The independent review lead is the Reviewer Sidekick. Its disposable lane Workers return candidate findings under the lead's review workflow. They do not own independent whole-review verdicts or become additional persistent reviewers. This distinction implements the owner's allowance for reviewer fan-out while keeping Workers as subagents.

Use the existing Reviewer model catalog and read-only authority for review work, including lane Workers. Keep task-specific model requirements from the review skills. This specification changes runtime ownership, not the permitted model matrix or reasoning levels.

## Workflow

```text
Shravan <-> coordinator
                 |
            design artifacts
                 |
     independent design-review Sidekick
                 | findings
       designer corrects the design
                 | same review Sidekick checks corrections
            accepted design
                 |
      implementation Sidekick
          | plans, implements and proves
          | assigns Workers and Operators
          | asks designer when a design decision blocks it
                 |
      designer assesses completed development
          | corrections -> same implementation Sidekick
          | check corrected result against intent
                 |
     independent implementation-review Sidekick
          | review lanes -> disposable native Workers
          | verified findings -> coordinator
          | accepted fixes -> same implementation Sidekick
          | fresh affected proof -> same review Sidekick
                 |
       coordinator reports to Shravan
```

### Design and research

The designer uses `manage-agents` before assigning work. Research supplies evidence and recommendations. The designer owns requirements, specification and program-design meaning with Shravan. A Worker may draft already-settled material when assigned; that does not authorize new design decisions.

Assign a bounded research question to a Worker and retain it through that assignment's follow-ups. Use a research Sidekick when several related assignments need continuing context. During development, the existing implementation Sidekick can coordinate research Workers without creating another persistent research thread.

An independent design-review Sidekick receives the current artifacts, explicit owner requirements and source pointers. It keeps its own review context. The designer corrects accepted findings and returns the changed evidence to the same reviewer when the review workflow calls for verification. Preserve the existing design-round limits; checking an accepted correction does not automatically start a new full review.

### Development

Before the first implementation assignment, `manage-agents` checks for an existing suitable implementation thread. For a new Codex implementer, the coordinator uses the supported Router creation contract on its own worktree:

```sh
agent-collaboration conversation prompt --endpoint "$ENDPOINT_ID" \
  --cwd "$IMPLEMENTATION_WORKTREE" --new --model "$MODEL_ID" \
  --effort "$EFFORT" --access workspace-write --text-file "$ASSIGNMENT_FILE" --json
```

The coordinator verifies the returned target, effective model, effort and access. The implementer's initial assignment includes naming its own thread, for example `🐒 Sidekick · authentication`, and joining the existing work thread as `implementer`. Use the selected service's actual commands and return shapes:

```sh
agent-collaboration session rename --endpoint "$ENDPOINT_ID" \
  --session "$IMPLEMENTER_SESSION_ID" --name "$VISIBLE_NAME" --json
agent-collaboration board thread join --root-message-id "$ROOT_ID" \
  --actor self --role implementer --watch --note "$PATTERN_AND_ASSIGNMENT" --json
```

The join runs in the implementer's session; `self` must resolve that session. Verify the name and role before treating setup as complete. The thread is top-level and appears as `source: interactive`. Resume the same target with `--session`, `--cwd` and explicit `--effort`; do not pass `--model` or change access on resume.

These recipes require the installed CLI and serving runtime to support creation access, rename and the new board role. They describe the reviewed Router contract, not a verified installed release. If Router lacks a required capability, management may reuse a verified existing thread or choose a supported named ACPX thread with the required capabilities. Native dispatch serves Workers and Operators; it cannot substitute a child for a persistent Sidekick. Report an unsatisfied capability or access requirement without weakening it. Review and research threads use the reviewed read-only access route.

The implementation Sidekick receives the accepted design, worktree, existing plan or planning responsibility, authorized scope, proof expectations and design contact. Reuse the owning phase's handoff rather than inventing another packet schema.

It may implement directly or assign independent slices to Workers. Standalone Git, PR and watch procedures go to Operators; an executor retains its associated tests and proof. Governing-design gaps return to the designer with evidence, consequence and a recommendation. Local implementation choices remain with the implementer.

Assigned Workers follow their bounded task. They do not create another Sidekick merely because the implementation skill mentions the delivery owner. An explicitly assigned standalone task remains valid without a new project-wide hierarchy.

### Designer assessment before independent implementation review

At the end of development, the same designer checks the result against the agreed intent, scope and observable behavior. It uses the implementation summary, diff and proof to inspect decisive evidence. It does not repeat the review lead's complete code-reading procedure or accept a result solely because tests passed.

If corrections are needed, the same implementer makes them and returns affected proof. Once the designer's concerns are addressed, it commissions the independent implementation-review Sidekick. The review packet contains the governing artifacts and evidence, not the designer's private reasoning, praise or expected verdict.

### Independent review and correction

The review Sidekick runs `implementation-review`, or the `skills-creation` review stage for a runtime skill package. It reads the complete target and governing sources required by that workflow, selects its lanes, verifies their candidate findings, reconciles conflicts and returns one review result.

The coordinator owns disposition and the final delivery decision. It checks accepted findings against their cited evidence, resolves scope or design disputes, and returns implementation corrections to the implementer. It need not reread every source already covered by the independent lead. A finding that cannot be settled from its evidence calls for a bounded clarification from the reviewer, not automatic re-execution of the review.

The same implementation-review Sidekick receives corrected code and fresh affected proof. It reopens affected coverage and reports remaining findings. Session reuse does not preserve stale conclusions or reset review limits. A design change returns to the designer and, where required, the existing design-review Sidekick before implementation review can finish.

The proposed default is one distinct design-review thread and one implementation-review thread. Reusing one reviewer across those different targets requires appropriate lineage and uncontaminated context; it is not implied by reuse within a correction cycle.

### Advisor, only on explicit request

An Advisor is outside the required review sequence. When Shravan asks for one, the coordinator gives it a design question and the relevant evidence. It may critique a design, explain the design implications of a failure or compare proposed approaches. It returns advice to the coordinator, who keeps responsibility for the decision with Shravan.

The implementer asks the coordinator when it needs help to proceed. The coordinator can consult its explicitly requested Advisor, then return a decision to the implementer. The implementer keeps one design contact. Advisor feedback does not satisfy an independent review gate; independent Reviewers retain their separate responsibility.

```text
Implementation Sidekick -> coordinator          -> Advisor, if requested
Implementation Sidekick <- clarified decision   <- advice
```

## Independence, fan-out and review limits

Start each independent review relationship without inherited author or designer conversation. Supply resolvable artifacts and owner decisions. Retain the reviewer's own findings, sources and correction history when continuing that relationship. Send bounded review inputs through collaboration; joining a shared board does not authorize importing the author's deliberation history. Reuse the reviewer while refreshing the evidence it checks.

Review Sidekicks may coordinate only the lanes their review skill permits. Lane Workers receive bounded packets, no author history and no broader authority than their lane. They may not recursively fan out. The review lead owns complete coverage and verifies every lane receipt before returning its result. Missing or partial receipts remain gaps.

Preserve each workflow's existing round and remediation limits. Change which agent performs review coordination and correction verification, not how many retries are permitted. The implementation Sidekick makes edits; the reviewer remains read-only except for explicitly permitted scratch output or proof commands.

If the retained reviewer loses independent context, becomes an author, or cannot be resumed, report the reason before selecting a replacement. Do not reset review history or hide the missing evidence. An unavailable permitted different-lineage model is a reported gap, never a same-lineage substitution presented as compliant.

## One owner for each rule

| Surface | Owns | Must delegate to another owner |
| --- | --- | --- |
| `shared/my_agents.md` | The short default flow and when to load management/collaboration. | Role tables, CLI mechanics, review methods and retry policy. |
| `manage-agents` | Responsibility, model selection, thread versus subagent, identity, independence, Advisor trigger and runtime choice. | Artifact quality, lane coverage, phase order and Router commands. |
| `orchestrator-design` | Design phase order, design-review handoff and continuation to implementation. | Review method and runtime encoding. |
| `orchestrator-implementation-goal` | Development, designer assessment, independent review, corrections and delivery order. | Code execution procedure and lane-level review. |
| `implement-plan` | Bounded execution and proof against the ready plan. | Missing design, independent review and overall delivery acceptance. |
| `spec-program-review` | Independent design-review method, coverage, lanes and design correction verification. | Thread lifecycle and authoring the corrected design. |
| `implementation-review` | Independent implementation-review method, coverage, lanes and correction verification. | Implementation edits and whole-delivery acceptance. |
| `skills-creation` | Skill-package authoring and its own proposal/implementation review contracts. | Runtime role policy and Router transport. |
| `research-swarm` | Evidence gathering, synthesis and research lane quality. | Material design decisions and session-lifetime policy. |
| `track-show-me-your-work` | Meaningful work checkpoints, continuity, shared references and thread resolution. | Agent selection, review methods and CLI schemas. |
| Router `agent-collaboration` | Supported creation, naming, addresses, delivery, joining, listening and recovery. | Model/role selection, phase order and workflow policy. |

Dependency direction is workflow skills → management/tracker → collaboration. Review skills call management for lead and lane runtime decisions. Router never calls `manage-agents` or tracker. Native Worker/Operator dispatch stays a management concern.

Keep the role and runtime definitions in management. A consuming skill names the owner it needs and the result it expects. Keep review-method detail in existing review references. Do not repeat the complete workflow in every skill or introduce a shared reference solely to move a paragraph that everybody still must load.

## Collaboration and visibility

Use one board Thread per piece of work and retain its root across design, implementation, review and correction. A second build under the same design uses another Thread in the same Topic. The coordinator creates the Thread as `orchestrator` and keeps that seat through completion. The implementer joins as `implementer`, with at most one open holder. Review Sidekicks join as `reviewer`; an explicitly requested Advisor joins as `advisor`; Workers and Operators join as `participant` under their own identities when their assignment includes board participation. Nobody impersonates the parent session.

Use `--note` to state the pattern and assignment, such as `implementation Sidekick, authentication` or `Operator, CI watch`. The coordinator accepts the result with a post and resolves the Thread after the required evidence is complete. Implementation and review agents contribute their results without resolving the whole work. The new role and both seat-holder fields must be verified on the installed runtime before relying on them.

Name persistent agents by purpose and role, preserving the owner's emoji convention. Verify the stored name against the returned target. Display current worktree, model/effort and available runtime status through supported discovery. Status shows activity; diff, proof and review establish completion.

Use session-delivered listening for Codex when the installed runtime supports it. The arming result proves registration; subsequent batches contain activity; terminal notification proves the listener ended. Process/stdout waiting remains distinct and obeys host blocking limits. Read the actual payload before deciding whether work completed or waiting should resume. Listen/watch may select a known Thread or, when supported, `--topic-id` for the overview of its Threads, including newly created roots. Topic selection expands observation, not assignment authority or permission to import author deliberations into an independent review.

While waiting for collaborators, the coordinator responds to batches, heartbeat notifications and finalization instead of polling. A heartbeat requires no work or status lookup. Wakes handle explicitly timed events. A new user message can still interrupt the wait.

Router owns the listen timing and delivery contract. The evolving Router spec now describes fixed lifetimes and heartbeat messages, replacing the earlier duration/debounce draft. Skills must use the accepted, implemented contract and distinguish activity, idle notification and terminal notification. A heartbeat is not work progress or evidence of cache reuse. Do not claim guaranteed cache warmth from an interval.

## Source conflicts to resolve

| Current source | Conflict with this specification | Required change |
| --- | --- | --- |
| `manage-agents/SKILL.md`, roles and runtime selection | Sidekick means execution; Reviewer can be a native single-assignment agent. | Persistent implementation/research/review responsibilities; reviewer leads are threads, lane Workers are subagents. |
| `implementation-review/SKILL.md`, opening and Dispatch | Invoking parent reads the whole diff and coordinates disposable Reviewers; every reviewer is forbidden to spawn. | Persistent independent lead owns that review method; lane Workers keep bounded read-only authority. |
| `spec-program-review/SKILL.md`, steps 5–9 | Fresh reviewer session required per dispatch; parent owns all whole-target reading and reduction. | Fresh relationship at first review, same independent lead on continuation; lead reads and reduces its lanes. |
| `skills-creation/references/review/review-lane-workflow.md` | Every lane is a fresh single-assignment Reviewer; reduction is assigned to the author parent. | Independent persistent lead reduces disposable lane Workers; coordinator still owns disposition and acceptance. |
| Existing implementation-goal draft | Independent review follows development before the designer's end-of-development assessment. | Insert designer assessment before independent review; keep correction owners explicit. |
| Existing research drafts | A research Sidekick is required broadly. | Apply D10: management chooses by continuity; research uses that choice without requiring a Sidekick for every question. |
| Canonical Router draft references | Recipes need actual supported CLI and access proof. | Reconcile against Sol's implemented launch/access/name/listen/envelope contract before pinned sync. |

The review lead's reduction and the designer's disposition are different jobs. Reuse existing finding/coverage shapes; change their owner references where needed rather than adding a duplicate verdict schema.

## Sequenced skill runs after acceptance

Each row is one named skill run. All behavior changes use user-directed intent; proposed proof cases are listed below. Unchanged YAML triggers stay unchanged unless the new responsibility cannot be discovered from them.

| Run | Target | Trigger / main path | Depth and proof focus |
| --- | --- | --- | --- |
| 1 | `manage-agents` | Preserve always-load trigger; define persistent roles, native Workers/Operators, Advisor trigger, review continuity and authority. | Update job packet/provider/ledger references only where runtime or history rules conflict. Prove role choice, continuation and explicit Advisor creation. |
| 2 | `spec-program-review` | Keep design-review trigger; name persistent lead as workflow executor and lane Workers as contributors. | Adjust runtime/independence/reduction caller language, preserve mode methods, coverage and limits. Prove independent initialization and same-lead correction. |
| 3 | `implementation-review` | Keep implementation-review trigger; persistent lead reads complete review target and runs the review. | Reconcile dispatch, lane authority, coordination and finding/reduction references. Prove lead fan-out, affected evidence and unchanged limits. |
| 4 | `skills-creation` | Preserve authoring trigger and four-surface model; use independent persistent review leads for proposal and implementation stages. | Update shared review-lane workflow and both stage references; preserve their separate correction limits and schemas. Prove author acceptance versus independent reduction. |
| 5 | `orchestrator-design` | Preserve phase routing; call the independent design-review Sidekick and return corrections to design authors. | Existing design-round closure consumes same-reviewer evidence. Prove review does not become authoring. |
| 6 | `orchestrator-implementation-goal` | State development → designer assessment → independent review → corrections → delivery. | Update goal-contract route; reuse the same implementer/reviewer and preserve delivery gates. Prove order and unblock path. |
| 7 | `implement-plan` | Keep execution admission; return completed development to its assigned delivery owner for designer assessment. | Align execution-and-proof route-back; a Worker executes its slice without creating a new Sidekick. Prove bounded execution. |
| 8 | `research-swarm` | Apply accepted D10 using management; keep evidence obligations and design boundary. | Inspect lane packet/countercheck roles under the new review-lead rule; keep bounded evidence Workers distinct from formal independent review. Prove no unnecessary permanent research agent. |
| 9 | `track-show-me-your-work` | Preserve work-trail trigger; carry responsibility and session references where applicable. | Keep meaningful updates and single-thread ownership explicit without mandating implementation roles on research/design-only work. Prove continuity without per-command logs. |
| 10 | `agent-collaboration` | Discover supported session creation, naming and waiting; return observed results. | Reconcile session-messaging, message-board, wake/recovery examples and output selectors with Router. Prove actual supported commands, identity and listener outcomes. |

Companion `shared/my_agents.md` changes follow the accepted management and phase wording. Preserve Soul, engineering rules and unrelated permission policies. Retain a short entry map instead of copying model tables or review procedures.

Run 4 changes the authoring workflow itself. Review this specification under the currently loaded contract and the owner's chosen Fable review; do not use an unaccepted new rule to declare this draft reviewed. Future runs must state which accepted contract they are applying.

## Proof plan

These are proposed scenarios, not tests already run. The owner's pause on pressure tests and extra reviewer dispatches remains in force. Fable is the requested reviewer for this specification; no additional review swarm is commissioned.

| Case | Expected evidence |
| --- | --- |
| One user-facing designer commissions implementation | Separate top-level implementation thread; designer remains the design contact. |
| Implementation needs a design decision | Same implementer sends evidence and recommendation to designer; does not author governing design on its own. |
| Development is complete | Designer assessment precedes independent implementation review. |
| Review finds an implementation defect | Same implementer corrects; same review Sidekick checks current affected evidence; limits do not reset. |
| Review needs several lanes | Persistent lead dispatches authorized native lane Workers, checks all receipts and returns a review result; lanes do not recursively delegate. |
| Reviewer starts with author history or authors the target | Independence failure is reported; a familiar session is not mislabeled independent. |
| Advisor was never requested | No Advisor is created or inserted into the cycle. |
| Implementer needs a design decision and an Advisor exists | Implementer asks designer; designer may consult Advisor and returns the decision. Advisor advice does not satisfy formal review. |
| Research is one bounded lookup | Assign a Worker, retain it through assignment follow-ups, and finish it when the result is accepted. |
| Several research assignments build on one another | Use a persistent research Sidekick; it may assign bounded collection Workers. An existing implementation Sidekick can coordinate its own research Workers. |
| Coordinator starts a new implementer | Supported Router creation states model, effort and access on the intended worktree; the new thread is named and joins the existing root as `implementer`; the coordinator retains `orchestrator`. |
| Sidekick is idle beyond 26 minutes | Same identity resumes; no expiry-driven recreation. |
| A notification is catch-up, heartbeat, cancellation or timeout | Agent reports that state accurately; no false claim of reply or completed work. |
| CLI flag is absent or socket access is denied | Exact capability/access recovery; no invented command, silent substitute or service restart. |

Before publication, use the appropriate static validators, source/reference checks and user-authorized behavioral proof. Existing live join/listen observations establish transport capability only. They do not prove agents will follow the revised skills.

## Coordination and publication

| Repository | Current work home | Boundary |
| --- | --- | --- |
| ai-tools | `feat/manage-agents-wait-discipline`, base `f029f5b8c5607f576f13ac7ea8aa7fd9bf1826fe` | Runs 1 through 9 source reconciliation, coordinator self-check, and scoped static checks are complete; drafts await owner review. Preserve unrelated work. No stage, commit, push, or install. |
| devfiles | `feat/persistent-implementation-flow`, base `534b450c7e520f5a0856dbb32b716cb2db60c969` | The shared instruction draft is reconciled and remains uncommitted. |
| codex-router | `codex-router.listening`, branch `feat/collaboration-cli-dx`, observed HEAD `33e1223727a66c8baca8b64fccab9fb31b66efca` | Sol changes product code; canonical `agent-skills/agent-collaboration` is reserved for this skill work. Fable owns the Router design. |

Recheck branch, HEAD, pending edits and Router contracts before each run. Do not overwrite Sol's in-flight work or create another Router worktree. The earlier `codex-router.feat-collaboration-cli-dx` worktree remains unused.

After actual supported Router CLI and access proof, sync the canonical Router skill into ai-tools with `scripts/sync-skills.py` and its source pin. Keep the Router canonical edits in Sol's Router PR and ai-tools/devfiles in their own PRs. Version and dated changelog updates belong to publication. Installed cache refresh remains a separate explicitly authorized delivery step.

## Decisions and review result

Shravan confirmed D10 after discussing the tradeoffs: Workers handle bounded research; a research Sidekick handles continuing related assignments. This closes the remaining research choice. D7 and D11 are also settled: create an Advisor only on explicit request; it advises the coordinator, who supports the implementer.

Fable reviewed the workflow order, reviewer continuity and independence, lead-versus-lane distinction, division of skill ownership and correction limits. Her acceptance covers the designer's bounded assessment before independent review, persistent reviewer correction cycles, fixed board seats and explicit commissioning. It does not claim that runtime edits or behavioral proof are complete.

Router contract checkpoint: the latest source adds required creation access and changes listen timing/heartbeat fields. Final canonical recipes must follow the accepted implementation and verified CLI surface. Confirm the contract on the shared board before replacing current examples; neither this document nor agent-authored “owner” labels establish runtime support or guaranteed cache behavior.

Review record: Fable reviewed draft 1 at activity 137, message `01a0a9f4-c12b-7192-8a17-a0d26029aa00`, requesting R1–R4. At activity 142, message `01a0a9f8-e5aa-7d82-b658-cb062bdf8fe7`, she verified draft 2 against those revisions and accepted it. She confirmed that keeping coordinator/implementer wording was satisfactory after withdrawing the requirement to rename the designer. Shravan then resolved D10. At activity 147, message `01a0aa0c-5bef-7aa1-8a5b-e1fa87de2b47`, Fable extended the acceptance to revision 2.1 and all ten runs; run 10 still requires actual supported Router CLI and access proof. No further specification review is requested. No additional reviewer agents or pressure runs were launched. Runs 1 through 9 source reconciliation, coordinator self-check, and scoped static checks are complete; the drafts await owner review.

Shared discussion: board `01a09d62-1b4c-7c71-95a3-864caa3e50b4`, topic `01a0a21b-7052-7db3-8bd1-a1de0aef2946`, root `01a0a99a-5203-73b3-bab0-76a102b89c61`. Keep decisions and review replies there. No new runtime review registry, session database, metrics system, permission bypass or Router feature is part of this skill specification.
