# Feedback plan: permissions, persistence, verification, and review ownership

Status: planning addendum to draft B; no runtime changes. Written from current source and owner-supplied agent feedback on 2026-09-13. Recommendations below are not adopted merely because another agent reported high confidence. No 1Password operation, session mutation, test, commit, merge, or permission escalation was performed for this note.

## 1. Exact homes and current gaps

All skill paths below are relative to `plugins/shravan-dev-workflow/skills/` in the named ai-tools worktree unless qualified otherwise.

| Home | Observed missing or conflicting behavior | Planned change |
|---|---|---|
| Devfiles `shared/my_agents.md:201-209` — 1Password Developer Environments | Uses op/wrappers and protects secrets, but does not explain desktop-socket sandbox access or host-specific permission requests | Add conditional first-attempt access guidance and a bounded connection-error decision; no restart/account/service-account workaround |
| Devfiles `shared/my_agents.md:8,265` — ground truth and Subagents | Ground-truth language can be read as all collection in main; Subagents only routes to management | Clarify worker collection plus parent decisive-source verification; keep parent judgment and scope authority |
| Devfiles `shared/my_agents.md:154,351` — DoD and proof | Mandatory outside-suite manual proof versus automated real-path proof | One applicability rule: automated actual-path evidence may suffice; manual proof covers named gaps |
| `manage-agents/references/native-providers-codex.md` | Documents spawn/model/history/access, not continuing, waiting, interrupting, or closing a native worker | Teach lifecycle capabilities using currently exposed host tools; stable worker identity and follow-up reuse |
| `manage-agents/SKILL.md:45,184-207` and `references/agent-job-packet.md:7-26` | Parent execution allowed; first assignment and follow-up costs insufficiently distinguished | Explicit coordinator/executor role; complete packet for new or materially changed assignment, concise delta for same-assignment follow-up |
| `implement-plan/SKILL.md:22`, `references/execution-and-proof.md:34-35` | Inline default conflates delegation with parallel independence | Coordinator assigns serial or parallel work; assigned executor executes; no recursive delegation by default |
| `orchestrator-implementation-goal/SKILL.md` | Phase invocation does not establish who executes; idle coordinator behavior implicit | Assign execution through management, corrections to same worker, event-driven wait and one observer |
| `implementation-review/SKILL.md:22-45`; `spec-program-review/SKILL.md:21-25,121-145` | Expensive parent and independent lanes each do complete-source work | Choose review-owner policy Q1 below; do not reduce required independent coverage silently |
| `orchestrator-design`, `spec-design` step 11, `program-design` steps 5/16 and explorer lane | Parent-first reconstruction; phase-local reviews plus final whole-design review | Worker evidence before full reconstruction; decide Q2 review coverage/ownership explicitly |
| `implementation-pr-wrapup/references/github-pr-state.md:15`, `monitor-loop.md:16,22`; shared prompt `:371` | 120-second gh watch versus 180-second default; optional observer wording | One Operator owns long watch, one same-command default, one terminal receipt and final gate decision |
| `manage-agents`/`session-ledger.md` and canonical collaboration timing refs | Repeated 29-minute policy; active/idle/cache state not distinguished reliably | One management owner for maintenance eligibility; operation refs consume it; avoid busy-worker pings and duplicated model polling |
| Canonical Router `agent-skills/agent-collaboration/SKILL.md` final access paragraph | Already forbids ungranted retries and alternate profiles, but host-specific access routes could be clearer | Explain platform permission APIs without turning command failure into authorization or new CLI flags |

## 2. Permissions: plan a conditional instruction, not a universal flag

Owner-provided proposed sentence:

> For 1Password CLI access, run op with sandbox_permissions: require_escalated on the first attempt. A desktop-socket connection error from sandboxed op means retry escalated; do not restart 1Password, switch accounts, or use a service account.

Preserve its intent: do not waste attempts against a known sandbox boundary, and do not “repair” account/application state to solve a local access problem. Refine applicability before implementation:

> For an authorized 1Password desktop-integrated CLI operation, check the host's available permission mechanism. When the execution tool supports and permits `sandbox_permissions: require_escalated` and desktop-socket access requires it, request that mode on the first attempt, with the specific operation and reason. When the host instead exposes scoped permission requests, request the necessary access through that mechanism. If execution is already unrestricted, run normally without unsupported flags. A sandboxed desktop-socket connection failure is a reason to inspect/request the missing access, not evidence that 1Password must be restarted. Retry the same operation only after the necessary permission is granted and only when retrying cannot duplicate a possibly successful mutation. Do not restart 1Password, change accounts, or substitute a service account to bypass the access boundary.

The exact `sandbox_permissions` value belongs to the host execution tool, not the op command line. This session's policy disables that parameter and uses unrestricted filesystem execution; the proposed literal instruction cannot be followed universally. A connection error may also reflect desktop integration/application state: it is not conclusive proof of sandbox denial. Keep the original operation/result uncertainty visible.

For Router/session/communication CLI access, use the same decision principle but retain the canonical collaboration permission and uncertain-write rules. A message receipt does not prove the receiving process has socket access. An error is not a permission grant. A denied, empty, or unavailable permission response does not authorize retry, alternate service/profile, human-input impersonation, or disabling protection.

Do not escalate every command by default. Native subagent tools may have no execution permission parameter at all. Documentation must distinguish already-authorized task intent from platform access, and avoid asking the user to reauthorize the task when only the host capability is missing.

Planned pressure cases: escalation supported/required; host rejects escalation parameter; already-unrestricted host; explicit denial; desktop connection error with uncertain cause; possibly committed external mutation; Router selected socket unavailable. No real credentials should be needed for these read-only decision rehearsals.

## 3. Native worker persistence: correct the tool claim

Feedback says Codex has `send_input`, `wait_agent`, `resume_agent`, and `close_agent`. That is not a portable command list. The current session actually exposes:

| Need | Exposed tool in this session | Meaning |
|---|---|---|
| Start native worker | `collaboration.spawn_agent` | New child assignment/conversation |
| Follow up and start an idle worker turn | `collaboration.followup_task` | Continue existing worker instead of spawning another |
| Deliver information without starting an idle turn | `collaboration.send_message` | Queue information; not proof of processing |
| Await activity | `collaboration.wait_agent` | Wait for mailbox/activity, not a guarantee of completion |
| Inspect liveness | `collaboration.list_agents` | Current status, not proof |
| Interrupt current worker work | `collaboration.interrupt_agent` | Stops current turn; worker remains available |

No `send_input`, `resume_agent`, or `close_agent` tool is advertised here. Do not invent them or substitute a different runtime because an old reference named them. Future references should describe lifecycle capabilities and map only advertised tools on that host. Tools from another Codex version may differ.

Live evidence already in [session-evidence.md](session-evidence.md): a native Luna child has its own thread ID and Router can inspect it. Parent readback gave `canAcceptDirectInput=false`; direct Router steering and user editing were not proved. Native continuation is already exposed independently of Router direct messaging. Session identity, native follow-up, Router input, board participation, and user UI access must be tested separately.

## 4. First assignment versus follow-up

First assignment supplies goal, scope, sources, worker role, selected model/runtime/access, proof, communication authority, stop condition, and expected result. For a follow-up inside the same assignment, send only the change or question plus any new evidence and changed deadline. Reuse established identity and constraints.

Rebuild the relevant assignment fields when scope, authority, source target, model/runtime, or expected outcome materially changes. Do not re-run graph/pattern/provider selection for every “continue” or small correction. Do not omit authority changes under the pretext of saving context. Maintain one concise current relationship record; no second lifecycle database.

## 5. Verification without repeating execution

| Worker returns | Coordinator verifies |
|---|---|
| Exact changed-source identity, changed files, and decisive diff/hunks with full diff available | Actual changed-file inventory stays in scope; material hunks satisfy assigned obligations; no hidden source gap |
| Exact proof command, applicability, terminal exit/result counts, and inspectable raw output/artifact pointer | The command ran against the relevant source and outcome supports the claim; no “tests passed” assertion without evidence |
| What was not done, unresolved questions, known failures and next needed action | Continue/correct with worker, inspect decisive additional source, or ask user for the actual unresolved decision |

A diffstat alone is not evidence of correctness. Verbatim full logs need not flood the main model: preserve raw output in an artifact and return decisive terminal evidence plus failures. A source pointer alone is not proof it was read.

Reject the absolute “parent never rereads sources” rule. Do not redo the worker's entire investigation; read decisive context when required to judge a real concern. Inadequate evidence may mean a better next packet, but may also reveal a genuine design break, missing test, hidden assumption, or capability limit. The coordinator does not execute the fix merely because it inspected the relevant source.

Independent review for a substantial slice stays separate from the implementation worker. The top-level user's coordinator may delegate review coordination as Q1 describes; the review coordinator still owns full coverage and candidate reduction within the review assignment.

## 6. Waiting, useful checks, and cache margin

Use an event-driven native wait or an authorized Router wake for follow-up. One observer owns any deterministic long command/CI watch. Parent receives material changes/terminal evidence and does not run a second polling loop.

The user wants agents to pause but resume before useful cache expires and to check progress often enough to stay on track. Proposed interpretation: schedule a bounded next check according to actual task risk/deadline, and consider the 26-minute maintenance target for eligible idle conversations. Do not turn every pause into an unconditional wake. Recent qualifying model requests, not arbitrary status reads or a vague “active” label, reset the relevant cache clock. Never interrupt or redundantly ping a busy worker solely for cache maintenance.

Keep task progress, model-cache retention, native worker liveness, and GitHub polling as separate concerns. The main conversation's cache does not become warm because a child made a request. Use observed host/route behavior; do not guarantee 26-minute savings or interpret Router account affinity as provider cache lifetime.

One owner in management defines eligibility and interval policy; session-ledger records last relevant activity; collaboration implements the requested wake; other skills refer to this instead of copying numbers. Exact host wake support and net maintenance benefit remain proof obligations.

## 7. Three decisions for owner review

### Q1 — Who coordinates independent review?

- A: Frontier main coordinates, reading scoped diff/decisive anchors while independent reviewers retain whole-source coverage.
- B: A capable cheaper agent coordinates review, reads the complete review basis, manages fresh reviewers under an explicit coordinator assignment, and returns reduced findings/coverage. Frontier main verifies material findings against decisive evidence and retains the user decision.

Recommendation: B for substantial reviews, A for a genuinely small review where another coordination layer would add more cost than it removes. This remains proposed. B must explicitly distinguish a review coordinator allowed to dispatch bounded lanes from an ordinary reviewer forbidden to spawn children. A persistent authoring worker is not automatically an independent review coordinator; use fresh context when needed. No model capability floor or fixed lane coverage is lowered by this note.

### Q2 — One full-cycle design review?

Recommendation: one three-artifact independent review for a full orchestrated cycle when intermediate artifacts are not delivered as independently reviewed results. Standalone phase delivery still receives its required local review. Preserve intermediate review when a downstream consumer requires reviewed input before proceeding.

This is a proposed semantic change to the spec/program/orchestrator contracts. Today those phase-local gates remain required. Trace each removed/reused gate's obligations to the final review before accepting consolidation; do not merely delete two review invocations.

### Q3 — Persistent worker transport?

Recommendation remains native by default when sufficient, consistent with the user's correction and live child-session evidence. Keep and follow up the same native worker. Separate Router conversations are for a demonstrated unmet user-access/lifecycle/control requirement or an explicit owner choice. Both may use boards when exact identity and access are available. The pasted feedback's assumption that persistent workers must default to Router is not established.

## 8. Planned sequence and proof

1. Reconcile Q1/Q2/Q3 and the conditional permission/wait policy in the spec. Do not present these recommendations as already confirmed.
2. Update the devfiles companion plan at the precise homes above: permissions, coordinator role, delegated source collection, fitting proof, and brief routing to management.
3. Update management/native lifecycle/assignment-follow-up and verification contracts first, then implementation and goal callers. Update native adapters only for tools actually exposed by the supported host.
4. Update design/review ownership only to the accepted Q1/Q2 semantics, preserving independent coverage and fresh review context.
5. Align PR observation and cache/wake ownership; canonical collaboration edits belong in codex-router, followed by reviewed commit/pin/sync into ai-tools when implementation is authorized.
6. Pressure-test serial delegation, same-worker follow-up, no parent takeover, actual proof verification, hidden changes, stale proof, one observer, busy/idle behavior, and permission host variants. Reuse existing harness and bounded fixtures; do not start a large new test framework.

Current source refresh: ai-tools HEAD is now `9308e61ac516f6410b99948465f836eae8cddc8a`; devfiles HEAD remains `40fec4e93e7a883dae748c4a86e6dec3c64d8c4e`. Earlier spec snapshot is historical; reread current model matrix before implementation. No runtime files changed by this planning pass.
