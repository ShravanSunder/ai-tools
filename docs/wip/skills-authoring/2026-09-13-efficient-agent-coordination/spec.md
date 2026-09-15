# Efficient agent coordination for Codex CLI

Revision: draft B, 2026-09-13. Status: prepared for owner-led pressure testing and independent proposal review; not accepted to implement. User requested this specification and will arrange review with another agent. No review agents are dispatched for this document.

## 1. Purpose and success

Make efficient supervised delegation the normal behavior of the shared agent instructions and development skills. The capable main agent remains the user's thinking partner and coordinator; cheaper workers perform substantial source collection, drafting, implementation, integration, fixes, and proof execution. The main agent verifies the evidence needed for decisions without repeating the worker's entire workflow or becoming a polling loop.

Success means a real Codex CLI task follows this split without the user repeatedly saying “delegate,” preserves engineering quality and task authority, and produces less unnecessary coordinator work. Task outcome, actual model usage, retries, context growth, and time to completion must be measured separately. No fixed savings percentage or universal model ranking is claimed.

This specification concerns two coordinated surfaces:

- **Devfiles:** `shared/my_agents.md`, the general entrypoint and policy defaults.
- **Skills:** management, collaboration, research, design, implementation, review, proof, handoffs, and PR coordination that implement those defaults.

The research basis is the [30-skill audit](../../2026-09-13-token-efficiency/token-efficiency.md) and [source coverage](../../2026-09-13-token-efficiency/source-coverage.md). Those records preserve observations and caveats; this document specifies the proposed resulting behavior.

## 2. Authority and proposed decisions

“Confirmed direction” below comes from the user's instructions. “Proposed default” is a concrete recommendation included for review, not an assertion that the user already selected it. Acceptance may change or strike any proposed row. Implementation requires an accepted revision and a separate instruction to execute it.

| ID | Decision | Status and rationale |
|---|---|---|
| D1 | Main agent thinks through design with the user and delegates source/research collection. | Confirmed direction; preserve the valuable conversation while moving bulk collection off the coordinator. |
| D2 | Implementation and related orchestrators consistently use manage-agents; efficient delegation is implicit. | Confirmed direction; model tables alone do not change inline execution defaults. |
| D3 | Luna xhigh/max and Sol low are preferred candidates for supervised execution where their capability fits. | Confirmed preference; owner experience supports trying these, not claiming they are best for every job. Honor exact user model choices and verified runtime capabilities. |
| D4 | Projects and boards remain owner-controlled; agents organize topics and work threads. | Confirmed direction; preserve the existing shared-trail policy. |
| D5 | Prefer native subagents when they meet continuity, access, and control needs. Use a separately launched conversation only for a demonstrated capability gap. Both may use shared boards when identity/access are available. | Revised proposed default after the native-session check below: a subagent already has its own session identity. Extra session management must justify its cost. |
| D6 | A coordinator does not make implementation edits, including integration/fix/test-code edits, while directing worker-owned work. It assigns those changes to the worker. | Proposed default; prevents “tiny integration” exceptions from pulling execution back into the expensive conversation. Directly user-assigned solo execution is a different role, not an inferred exception. |
| D7 | A worker drafts design documents from settled decisions; main agent verifies fidelity and resolves design questions with the user. | Proposed default; separates document production from authoritative design judgment. |
| D8 | Direct user steering takes precedence. Worker communicates material scope/approach changes to the coordinator; coordinator reads them before issuing conflicting instructions. | Proposed default; user can enter worker conversations without a formal take-over/hand-back ceremony. Material contradictions pause dependent work. |
| D9 | A 26-minute maintenance point replaces the 29-minute target only for eligible idle conversations on a verified route where preserving a useful cached prefix is worthwhile. | Proposed conditional policy; user requested investigation of a larger margin. Does not assert a universal TTL, guaranteed cache hit, or net savings. |
| D10 | A worker executes its assignment rather than automatically spawning another worker. Helpers require explicit bounded authority and a concrete benefit. | Proposed default; prevents recursive delegation and context multiplication. |
| D11 | Validation/review evidence is reused while applicable; rerun the affected proof when relevant inputs change. Never remove required coverage merely to lower cost. | Confirmed direction and existing quality boundary. |
| D12 | No implementation, commits, pushes, merges, installations, Router restart, or home activation is authorized by writing/reviewing this spec. | Current task boundary. Publication and merge authority must name the repository; permission for Router is not permission for ai-tools or devfiles. |

## Evidence-driven correction: native subagents are sessions

The previous draft treated native subagents and separately addressable conversations as too distinct. A user-requested live Luna xhigh check established that a native child has its own `CODEX_THREAD_ID` and Router can inspect it as that same session. The parent independently repeated the inspection. Exact child/parent addresses and observed results are in [session evidence](session-evidence.md).

Observed parent readback: child ID differs from parent, `threadSource=subagent`, `source.subAgent.thread_spawn` identifies its parent, status idle, and `canAcceptDirectInput=false`. The child's earlier summary reported that field null; the parent readback is the stronger current observation. No direct message was sent. Therefore we have proven session identity and Router inspection, not direct input, board participation, UI access, or persistence beyond parent lifecycle.

Revised rationale: keep native subagents as the first candidate rather than adding separate-session machinery for identity alone. Test actual access/control requirements before selecting another transport. The cost-reduction goal remains Frontier conversation with cheaper worker execution; a transport choice does not itself deliver savings.

## 3. The working model

```text
User <--> Main coordinator
             | frames the job; makes decisions; verifies material evidence
             |
             +--> Persistent worker conversation (native when sufficient)
             |      implementation, integration, fixes, test execution
             |      <--> user may enter and steer
             |
             +--> Bounded research helper
             |      source collection or one focused investigation
             |
             +--> Independent reviewer
             |      fresh context; candidate findings
             |
             +--> Operator / visible deterministic watch
                    collects terminal state and material changes

Shared board thread: goal, decisions, blockers, checkpoints, evidence links
Worker conversation: working context and execution detail
Repository artifacts: authoritative specs/plans/code and their proof
```

A role and a transport are separate choices. Sidekick means a continuing relationship; Delegate means one bounded assignment; Operator means scriptable execution/observation; Advisor means persistent guidance under the existing permission boundary. Any supported runtime must preserve the role's authority and result meaning.

A board thread is neither the worker conversation nor a scheduler. A saved message does not prove the recipient saw it, acted, or completed the job. Only the whole-work owner or explicit successor resolves the shared work thread after checking completion.

## 4. Worker selection and runtime behavior

`manage-agents` owns the decision sequence:

1. Determine the work and its current responsible agent: coordinator or assigned executor.
2. Decide whether the relationship ends with this assignment or needs continuity and direct user access.
3. Select the cheapest capable model/effort permitted by the accepted matrix and owner constraints. Distinguish mechanical collection from interpretive research and implementation judgment.
4. Select a runtime that supplies the required identity, continuation, visibility, model controls, and access boundary.
5. Assign the job with its goal, scope, current sources, constraints, permitted communication, proof obligations, and stop/escalation conditions.
6. Consume the result, verify decisive evidence, and continue or correct the same work without duplicate execution.

| Job | Proposed relationship/runtime choice | Completion evidence |
|---|---|---|
| Continuing implementation area | Sidekick using native continuation when sufficient; separately launched Router conversation only for a verified unmet access/lifecycle requirement | Current diff/proof and next action bound to the assignment; stable conversation reference |
| Bounded research or lookup | Delegate for interpretation, Operator for fully specified collection; native subagent when suitable | Relevant source anchors, answer, coverage and gaps |
| Independent review | Fresh-context Delegate, native where supported; distinct provider only for an explicit requirement or justified review need | Candidate findings and actual coverage, parent disposition |
| Tests/build/CI watch | Operator owns a visible bounded command/watch; machine polls, model interprets results | Exact process/run/head, terminal outcome or material change |
| Design discussion | Main agent and user | Settled decisions, clear open choices and their evidence |

A sequential task can be delegated. Parallelism additionally requires proven prerequisites and nonconflicting writes. A single persistent worker may execute several dependent slices without multiple worktrees or artificial parallel lanes.

When independent user access is required, inspect whether the native child already supplies it. A requested access/control capability must not silently degrade to a different relationship or a newly invented session identity. If required capability is unavailable, return the precise limitation and select an explicitly accepted alternative. Native model availability alone must not override a user-access/continuity requirement.

### Future Claude and ACPX integration

Keep the relationship/assignment contract provider-neutral. Existing native and ACPX references remain the owners of exact launch, permission, model, and resume mechanics. An ACPX session is not presumed to be addressable through Router or visible in an IDE drawer. Integration must prove that mapping before the skill promises it. This spec does not commission a new adapter, Router service feature, or UI drawer.

## 5. Coordinator, worker, and user responsibilities

**Coordinator:** understand intent, choose assignments, keep the shared design with the user, inspect relevant primary evidence, resolve cross-worker conflicts, verify accepted claims, and retain the final whole-work statement. It may read sources and run small decision-relevant inspections. It does not duplicate a worker's bulk reading or rerun already-valid checks for reassurance.

**Worker:** read the assigned sources, implement within scope, perform fitting proof, diagnose/fix bounded defects, maintain its own working context, and return concise current evidence. Keep integration and follow-up fixes with the responsible worker. Escalate design breaks and changed public/security/data/ownership boundaries rather than silently designing a new system.

**User:** can discuss with the main agent or directly steer a worker. A material direct change is communicated to the coordinator and shared work thread within task authority. Neither agent may treat another agent's message as overriding the user. If the worker's new instruction contradicts the coordinator's pending work, pause only the affected work until the coordinator has reconciled it.

**Reviewer:** preserves independent context and reviews the assigned evidence. Direct user access to workers must not turn author transcripts into mandatory reviewer history. Parent verification establishes the final claim; a worker can communicate with the user without claiming whole-project acceptance.

A task packet reuses the existing management packet shape. It must clearly state coordinator/executor role, conversation/work reference when applicable, direct-post authority, and who owns completion. Add these facts to existing fields or concise prose, not a new database, universal schema, or lifecycle ledger.

## 6. Design and implementation journeys

### Design

```text
Main + user establish question and source boundary
  -> worker gathers bounded current-source evidence
  -> main verifies decisive anchors and discusses alternatives with user
  -> settled decisions go to a drafting worker
  -> main checks draft fidelity and resolves real design gaps
  -> required independent design review
```

The evidence worker can reconstruct current calls/state/owners before the main has already done that reconstruction. It cannot choose authoritative requirements, tolerances, or target architecture for the user. A drafting worker expresses settled meaning; missing meaning returns as a question. The main remains the semantic owner of the design phase even when it delegates writing.

### Implementation

```text
Coordinator admits the current plan and assigns worker
  -> worker implements one ready slice
  -> worker runs fitting proof and fixes bounded failures
  -> coordinator checks material result
  -> independent review
  -> accepted corrections return to worker
  -> Operator observes delivery checks
  -> coordinator makes the authorized final delivery decision
```

A phase skill invoked by a coordinator routes execution through management. The same skill invoked by the assigned worker executes. An invocation is not permission to spawn recursively. Goal orchestration retains continuity through corrections and proof; it does not reclaim coding when a worker encounters a failure.

## 7. Validation, review, stopping, and waiting

### Evidence and repeat work

- Each required check has an obligation, source/input/environment applicability, observed outcome, and responsible executor. Use existing proof records rather than inventing a validation cache service.
- Automated real-path tests may supply runtime evidence for behavior they actually demonstrate. Manual/UI/operational checks cover what the automated path does not. Align the shared Definition of Done wording with this rule.
- Code behavior changes retain scenario-first/TDD where required. Prompt work follows skills-creation's explicit user-intent versus reproduced-failure posture; never manufacture RED.
- Rerun after a relevant source, dependency, fixture, environment, or command change, a failure, or a concrete unresolved concern. A phase transition or changed prose label alone is not a rerun trigger.
- Reviewers independently read required evidence. The coordinator verifies load-bearing findings and coverage rather than copying all reviewer contexts. Do not remove existing required whole-artifact/lane coverage in this change.
- Source review, behavior proof, and ship readiness are different stages. A proof-claim lane judges actual available claims/evidence; before execution it reports unverified behavior, not a reason to duplicate the complete review afterward.
- Retain current review limits and required phase-local reviews. Possible consolidation of specification/program/three-artifact review is deferred until a separate proposal proves equivalent coverage and addresses intermediate consumers.

### Observation and idle time

One Operator owns a given long-running command/watch, including its process handle and terminal receipt. A command or runtime notification does the waiting. The parent must not run a second polling loop over the same job. The main performs useful independent work, discusses an actual decision with the user, or waits without generating speculative work. Required progress updates remain concise and material.

Use the shared 180-second default for the same `gh ... --watch --interval` commands; preserve explicit user cadence and existing slower-system overrides. General event collection, provider quota backoff, and model-cache maintenance are different clocks. Do not use one interval to control all three. Preserve required quiet/final-fetch merge gates, but run each observation window once under a named owner rather than duplicate it between agents.

### Stop boundaries

| Condition | Action |
|---|---|
| Bounded implementation/fixture defect within agreed behavior | Worker diagnoses, fixes at existing owner, reruns affected proof |
| Worker needs an unmade design/authority decision | Return evidence and the exact choice; pause affected work |
| Worker/session reports progress but not completion | Continue existing assignment; no new worker merely for liveness |
| Tool wait ended without terminal evidence | Inspect the same operation/session before retry or failure claim |
| Required proof fails | Preserve failure, diagnose; never weaken the gate |
| Required access or coordination is unavailable | Report exact blocker; continue only independent work |
| Task is actually complete | Verify whole-work evidence; publish outcome; resolve the work thread deliberately |
| No work requires model attention | Avoid model polling; keep useful relationship context without inventing busywork |

## 8. Cache-aware CLI coordination

`manage-agents` owns whether a continuing relationship merits maintenance. `agent-collaboration` owns executing an authorized timed message. Provider references own verified capability facts. `session-ledger.md` records the necessary identity and last relevant activity without creating a second cost ledger.

The proposed 26-minute target is conditional: use it for an idle continuing worker only when the selected CLI/provider route has a verified applicable cache lifetime, a useful stable prefix is expected to be reused soon, the maintenance action actually performs the model request needed for reuse, and measured benefit exceeds its cost. Active qualifying requests reset the relevant activity time; do not send redundant pings while work is already active. A status read or waiting tool call does not itself refresh provider model state.

If cache behavior or cost is unknown, label it unknown and prefer useful follow-ups or event-driven completion. Do not create background services, modify production Router, change models/effort, or alter user-requested business schedules just to preserve cache. Useful session continuity survives a cold cache.

Prove the policy on the actual Codex CLI route before rollout: compare no artificial maintenance, 29-minute, and 26-minute maintenance under equivalent work. Record total input/cached input/output or available equivalents, request count, elapsed time, retries, and task correctness. Count coordinator and maintenance work. If route telemetry cannot distinguish cache reuse or cost, keep net savings unverified. Do not copy Codex cache assumptions into Claude/other ACPX providers. Router account affinity is not provider cache retention.

This spec does not require model/plan pricing research, a quota dashboard, or a new budget-enforcement service.

## 9. Information placement

The shared prompt stays short: role split, implicit delegation, user authority, one observer, fitting proof, and routes to skills. It contains no board names/IDs or provider commands.

`manage-agents/SKILL.md` retains its mental model, role selection, all-run selection spine, escalation, and completion boundaries. Existing runtime references carry commands. Add one ordinary reference `references/worker-relationships.md` if the relationship/user-steering detail obscures the core; it teaches source inputs, selection examples, capability gaps, continuity, and completion. It is not a new agent lane or shared schema.

Proposed call from management: “IF the assignment needs continuity or direct user access, load `references/worker-relationships.md` and return the selected relationship, proven runtime capabilities, direction owner, and exact continuation reference or gap.”

Phase skills route through management with their bounded assignment and consume its result. They do not duplicate the model table, cache interval policy, or provider command recipes. Their own references keep phase-specific proof, authority, and failure teaching.

`research-swarm` handles broad source collection; it may use cheaper workers before expensive parent reconstruction after the parent identifies source roots and questions. Distinguish partial coverage from the answer/disproof outcome; do not unify every status vocabulary without a real consumer need.

## 10. Sequenced skill runs

Each run has exactly one named skill target. All are behavior-changing and based on user-directed intent. Existing source failures inform pressure cases; no reproduced historical RED is claimed. Triggers remain both model- and user-invocable unless a row explicitly narrows them. Runtime changes ship as a coordinated cutover, not as two competing live workflows.

| Run | Owner / target | Trigger and core promise | Depth and proof |
|---|---|---|---|
| S1 | shravan-dev-workflow / manage-agents | Manage worker relationships, not only native child dispatch. Distinguish coordinator/executor; supervised cheap choices; separate delegation from parallelism. | Existing job/runtime/session references plus conditional worker-relationships; tests P1-P5/P8/P9. |
| S2 | codex-router / agent-collaboration | Router-backed worker communication, discovery, catch-up and timed attention, without taking ownership of assignment design. | Canonical session-messaging/message-board/timing refs; verified capabilities only; P2/P3/P8/P11. |
| S3 | shravan-dev-workflow / research-swarm | Delegate bounded collection before parent repeats it; main synthesizes and verifies decisive anchors. | Existing lane-packets/evidence-ledger; completion versus answer semantics; P1/P6/P10. |
| S4 | shravan-dev-workflow / implement-plan | Coordinator delegates serial or parallel implementation; assigned executor implements and proves. Remove unconditional inline-parent default. | execution-and-proof; preserve plan admission, write scopes and corrective routes; P1/P4/P7. |
| S5 | shravan-dev-workflow / orchestrator-implementation-goal | Assign and continue workers through implementation, integration, fixes and proof; main owns whole delivery. | goal-contract-and-routing; keep terminal and review limits; P1/P4/P7/P9/P12. |
| S6 | shravan-dev-workflow / orchestrator-design | Delegate evidence gathering, keep design reasoning with user, coordinate drafting and existing review gates. | Existing routing spine; call research/management before redundant reconstruction; P6/P10/P12. |
| S7 | shravan-dev-workflow / spec-design | Main owns authoritative Why/What; evidence and settled-expression drafting can be delegated. | Existing evidence, section-writing, and self-review references; no worker invention of normative meaning; P6/P10. |
| S8 | shravan-dev-workflow / program-design | Current-system explorer can help before full parent reconstruction; main owns structural decisions with user. | current-system-model and existing explorer/section-writer lanes; replace phase-specific model bias with management selection; P6/P10. |
| S9 | shravan-dev-workflow / implementation-review | Choose capable independent reviewers through management; clear source coverage and correction-specific freshness. | Existing composition/reduction refs; retain mandatory coverage/whole-source requirements and stop limits; P7/P10. |
| S10 | shravan-dev-workflow / spec-program-review | Preserve independent design coverage while avoiding instruction reloading within one invocation and accidental review restarting. | Existing mode/chunk/lane references; no phase-review deletion; P6/P7/P10. |
| S11 | shravan-dev-workflow / implementation-pr-wrapup | One Operator for long observation; main owns disputed feedback and exact-repository publication decisions. | monitor-loop/github-pr-state/merge-gates; reconcile same-command cadence; P9/P12. |
| S12 | shravan-dev-workflow / skills-creation | Make source review, proof and shipping reuse explicit; reconcile cross-provider policy. | Existing review/testing refs; use native eligible review by default, cross-provider for explicit direction or a named review need; P7/P10/P13. |
| S13 | shravan-dev-workflow / plan-implementation | Main owns strategy; bounded repository recon/drafting can be assigned without creating a planning swarm. | Existing slice-and-proof-design and management routing; P1/P6/P7. |
| S14 | shravan-dev-workflow / track-show-me-your-work | Preserve concise shared checkpoints across coordinator and directly accessible workers. | Existing view/fallback guidance; communication does not imply verification/authority; P3/P11. |

Dependent consistency edits stay in the target's actual callers/references. If implementation discovers a new semantic owner outside these runs, record it and seek scope agreement rather than expanding silently. Other audited skills remain unchanged unless an exact active call site must be updated as part of this contract; that must be listed before editing.

No new executable scripts, daemons, schemas, token database, or agent-role files are proposed. Existing CLI/native tools and pressure harness are used.

### Devfiles companion update

This is a coordinated prompt change, not a fifteenth skills-creation run. Update only the shared instruction behavior and its changelog: coordinator/executor split, implicit management use, one-observer waiting, automated/manual proof applicability, current-source evidence reuse, and explicit per-repository publication authority. Do not rewrite unrelated language/tool standards. Keep detailed models, runtime controls, cache mechanics, and project metadata with their owners.

Success: an agent starting a substantial CLI task follows the worker selection without repeated user prompting, while an assigned worker executes instead of recursively delegating. The prompt agrees with all S1-S14 caller behavior. Prove with P1/P3/P7/P9/P12 using the actual shared prompt as input; do not claim plugin-only tests prove the shared prompt.

## 11. Proof plan

Use existing pressure infrastructure with source/fixture registration checked before launching model calls. Grade behavior from actual traces/results where available; do not rely solely on claimed compliance or generic keyword presence. Use cheap subject workers under the configured legal route; preserve sandbox and model/effort identity. Rerun only affected cases after changes, plus required repo gates. Independent source review precedes behavioral proof under the existing owning workflow; final claim review consumes produced evidence.

| Case | Scenario and required observation |
|---|---|
| P1 | Expensive coordinator gets a sequential coding task: assigns a capable cheaper worker; does not implement or duplicate the worker's reads. Worker executes directly. |
| P2 | Native continuing worker: prove its own session identity and native follow-up first. Separately test Router messaging, board participation and user access. An inspectable ID alone proves none of those; launch another conversation only for a demonstrated unmet requirement. |
| P3 | User redirects worker during coordinator activity: material change reaches coordinator; stale conflicting direction is not executed; scope authority preserved. |
| P4 | Integration or failing fixture tempts coordinator to take over: worker receives bounded correction and returns fresh proof. |
| P5 | Luna xhigh/max or Sol low succeeds on fitting task; escalation needs evidence. No forced expensive choice merely because task is important. |
| P6 | Design needs source collection: worker gathers first; main verifies anchors and discusses choices with user. Draft contains only settled meaning. |
| P7 | Passing applicable proof crosses phase boundary: no redundant rerun; changed relevant source triggers affected proof. Automated real-path proof is not duplicated manually without a gap. |
| P8 | Idle/active worker and 26-minute candidate: active requests suppress redundant maintenance; liveness is not cache proof; unknown route is explicit; compare measured total cost. |
| P9 | CI runs slowly: one Operator/process owns observation; no parent duplicate polling; one exact-head terminal result and required quiet/final check. |
| P10 | Partial research/review results: parent distinguishes coverage from answer, rejects unsupported claims, and reuses already-loaded instruction references without contaminating independent review. |
| P11 | New scoped inbox/search unavailable in installed CLI: no invented flags; use supported bounded read route or report missing capability; shared thread contains concise records. |
| P12 | Permission names one repository: other repository merges remain unapproved. Session ending does not resolve incomplete whole work. |
| P13 | Source-only review before proof, then unchanged source after proof: no fabricated success or repeated complete source-review fan-out merely for ship stage. Cross-provider selection has one coherent rule. |

For P2/P3/P4/P9, include a controlled real CLI task demonstrating actual delegation/continuation, not only prose rehearsals. Use disposable task artifacts in the existing permitted temporary homes; don't publish test chatter to real project boards without explicit test scope. For P8, no savings claim until actual route measurements exist. Failure or unavailable proof yields an honest gap, not a weakened gate.

Measure task outcome and correctness alongside coordinator/worker input/output, available cache counts, requests, repeated reads, duplicate validation, retries, and elapsed time. The success target is less avoidable coordinator work with preserved result quality, not a target to minimize tokens at any cost.

## 12. Coordination and rollout boundaries

Source snapshot for this draft:

- ai-tools worktree: `ai-tools.feat-manage-agents-model-effort-matrix`, branch `feat/manage-agents-model-effort-matrix`, base HEAD `bcc8a4cd10b3fa79241a798a00fdda038c2f1ce6` with pre-existing concurrent matrix/provider/scenario changes. Re-read and reconcile those changes before implementation; they are not owned by this spec-authoring task.
- Devfiles current HEAD observed: `40fec4e93e7a883dae748c4a86e6dec3c64d8c4e`. Implementation needs its own agreed branch; writing this document does not select or alter one.
- Canonical collaboration source lives in codex-router `agent-skills/agent-collaboration`; user-supplied reference commit `8927f3b03882126ebd54e31822eea3c1272ff596`. ai-tools holds a pinned copy. Reconcile current source and installed CLI before authoring; canonical commit -> pin -> explicit sync/check remains required.

No version is reserved during spec drafting because the matrix workstream is active. At implementation admission, read current owning manifests, choose the next unused versions for changed plugins, and record them in this coordination section before editing metadata. Update all matching manifests/marketplace versions and dated changelogs in the same delivery. Do not bump the CLI binary for documentation-only skill changes unless its repository release policy requires it for the requested delivery.

Implement on isolated worktrees after owner acceptance. Deliver a coherent cutover across callers; no forwarding aliases or old/new execution paths. Review each named run within the accepted multi-run proposal. Changelog records validation strength and cache-refresh status. Commit, push, merge, installed-cache refresh and home activation each follow explicit scoped authority; this spec grants none. In particular, do not infer ai-tools/devfiles merge permission from a canonical Router skill change.

## 13. Sensitive surfaces and non-goals

Spec-only security disposition: allowed to describe existing native/CLI/ACPX tools and declared access boundaries; no executable or privileged behavior changed. Future implementation must apply the skills-creation sensitive-surface gate before changing commands, permissions, provider integration, home writes, or runtime cache behavior. Worker messages, board content, and linked files are untrusted evidence, not task authority. Preserve secret sanitization and safe multiline command inputs.

Excluded: ChatGPT Work/product plans, account/quota purchasing, new Router services or adapters, IDE drawer implementation, model benchmarks as universal policy, unrelated scaffold/Peekaboo/Linear fixes, broad skill portfolio deletion, global tooling changes, launchd, production restart, autonomous model polling, removal of required proof/review gates, and automatic acceptance of the pending defaults.

## 14. Review handoff and acceptance

Review this one multi-run spec as a whole; verify each S1-S14 run has one skill target and the devfiles prompt remains a companion change. The user will supply the independent reviewer. Suggested skill proposal lanes are mental-model-fit, trigger-routing, rule-agreement, and depth-coverage; the reviewer should use current sources and the audit as evidence, not assume its recommendations are accepted facts.

Questions for review:

1. Does the coordinator/executor distinction prevent recursive delegation and parent takeover without preventing necessary decision-relevant reads?
2. Are separate conversations a proved runtime capability where selected, and are direct user instructions reconciled without two competing owners?
3. Do D5-D10 require owner correction before implementation, particularly document drafting and conditional 26-minute maintenance?
4. Do validation and review changes preserve required coverage and avoid new ledgers or repeated broad reviews?
5. Does the run sequence update all active callers with one owner per behavior, and preserve concurrent matrix work?
6. Does proof exercise actual CLI behavior, with measured savings separated from source quality and scenario compliance?

Review record: no independent review performed for draft B; no accepted revision; no implementation decision. Outstanding acceptance items are proposed-default rows and proof/capability feasibility, especially P2/P3/P8. Spec drafting is complete when the file is source-grounded, linked, and inspectable. The [pressure-test handoff](pressure-test-handoff.md) supplies bounded prompts, evidence expectations, and known capability gaps; these cases have not been executed against this draft. Runtime implementation remains blocked until the owner accepts the reviewed revision and explicitly commissions execution.

## Additional owner feedback — planning only

See [feedback plan](feedback-plan.md) for exact devfiles/skill locations, conditional 1Password and Router permission guidance, verified native lifecycle tool availability, first-assignment versus follow-up shape, and evidence-based coordinator verification. It also records proposed review coordination and full-design review consolidation choices. Those choices have not been silently applied to this draft's required gates. Current source moved to ai-tools 9308e61; read the addendum's refreshed coordination notes before any implementation.

## 2026-09-14 proposal assessment

The [role and cache assessment](2026-09-14-role-and-cache-assessment.md) records newer owner ideas and evaluates the pasted agent proposal. It recommends role-first native worker use, Terra medium as a candidate, Worker naming, no automatic extra Frontier advisor, auditable cheaper review coordination, and a 26-minute Codex maintenance policy distinct from cache lifetime. It explicitly rejects inferring session death from cache expiry and preserves unresolved max-effort/driver/review choices. These are review inputs; they do not silently replace draft B's acceptance status.
